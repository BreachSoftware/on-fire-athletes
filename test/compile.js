const puppeteer = require("puppeteer");
const { ECS, S3 } = require("aws-sdk");
const axios = require("axios");
const sharp = require("sharp");

const CARD_ID = "a9b0b608-9070-40d7-b184-ad779093b2c2";

// Configure AWS SDK
const ecs = new ECS({
    credentials: undefined,
    region: process.env.AWS_REGION || "us-east-1",
});

const s3 = new S3({
    credentials: undefined,
    region: process.env.AWS_REGION || "us-east-1",
});

const API_BASE = "https://dlzd38qso6.execute-api.us-east-1.amazonaws.com";

/**
 * Uploads a buffer to S3
 * @param {string} cardId - The UUID of the card
 * @param {Buffer} buffer - The compiled .mind file buffer
 * @returns {Promise<string>} - The S3 URL of the uploaded file
 */
async function uploadToS3(cardId, buffer) {
    const key = `mind-ar/${cardId}.mind`;

    await s3
        .putObject({
            Bucket: "onfireathletes-media-uploads",
            Key: key,
            Body: buffer,
            ContentType: "application/octet-stream",
        })
        .promise();

    return `s3://onfireathletes-media-uploads/${key}`;
}

/**
 * Compiles a .mind file for a given card
 * @param {string} cardId - The UUID of the card to compile a .mind file for
 * @returns {Promise<string>} - The S3 URL of the uploaded .mind file
 */
async function compileMindFile(cardId) {
    const browser = await puppeteer.launch({
        headless: "new",
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-web-security",
        ],
        ignoreDefaultArgs: ["--enable-automation"],
    });
    const page = await browser.newPage();

    try {
        // 1. Get card data from API
        const { data: cardData } = await axios.get(
            `${API_BASE}/getCard?uuid=${cardId}`,
        );

        if (!cardData.cardImage) {
            throw new Error("Card does not have required images");
        }

        // 2. Download all images
        const images = [
            cardData.cardPrintS3URL,
            cardData.cardBackS3URL,
            // cardData.frontPrintTradingCard,
            // cardData.backPrintTradingCard,
            // cardData.frontPrintBagTag,
            // cardData.backPrintBagTag,
        ].filter(Boolean);

        const imageBase64Array = await Promise.all(
            images.map(async (imageUrl) => {
                const response = await axios.get(imageUrl, {
                    responseType: "arraybuffer",
                });
                return Buffer.from(response.data).toString("base64");
            }),
        );

        // 3. Flip images directly in Node using "sharp"
        const flippedBase64Array = await Promise.all(
            imageBase64Array.map(async (base64) => {
                try {
                    const originalBuffer = Buffer.from(base64, "base64");
                    const flippedBuffer = await sharp(originalBuffer)
                        .flip() // vertical flip
                        .toBuffer();
                    // Re-encode as base64
                    return flippedBuffer.toString("base64");
                } catch (err) {
                    console.error("Failed to flip image in Node.js", err);
                    return null; // Skip problem images if needed
                }
            }),
        );
        // Filter null out
        const validFlippedImages = flippedBase64Array.filter(Boolean);

        // 4. Combine original + flipped images
        const allImages = [...imageBase64Array, ...validFlippedImages];

        // 5. Load HTML page with MindAR compiler
        await page.goto("about:blank");
        await page.setContent(`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>MindAR Compiler</title>
                    <script src="https://aframe.io/releases/1.5.0/aframe.min.js"></script>
                    <script src="https://cdn.jsdelivr.net/gh/donmccurdy/aframe-extras@v7.0.0/dist/aframe-extras.min.js"></script>
                    <script src="https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js"></script>
                    <script>
                        window.compileStatus = { error: null, done: false };
                        
                        async function compile() {
                            try {
                                if (!window.MINDAR || !window.MINDAR.IMAGE) {
                                    throw new Error('MINDAR.IMAGE is not available');
                                }
                                
                                const images = document.getElementsByClassName('input-image');
                                console.log('Number of images found:', images.length);
                                
                                const compiler = new window.MINDAR.IMAGE.Compiler();
                                
                                // Track compilation progress
                                const data = await compiler.compileImageTargets(Array.from(images), (progress) => {
                                    console.log('compilation progress:', progress);
                                    window.compileStatus.progress = progress;
                                });
                                
                                // Export the compiled data
                                const exportedBuffer = await compiler.exportData();
                                window.compileStatus.done = true;
                                return exportedBuffer;
                            } catch (error) {
                                console.error('Compilation error:', error);
                                // window.compileStatus.error = error.message;
                                // throw error;
                            }
                        }
                    </script>
                </head>
                <body>
                    ${allImages
                        .map(
                            (base64, index) => `
                            <img 
                                class="input-image" 
                                src="data:image/jpeg;base64,${base64}" 
                                alt="Input Image ${index + 1}" 
                                style="display: none;"
                                crossorigin="anonymous"
                                onload="console.log('Image ${index + 1} loaded')"
                                onerror="console.log('Image ${index + 1} failed to load')"
                            />`,
                        )
                        .join("")}
                </body>
            </html>
        `);

        // Enable console log capture
        page.on("console", (msg) =>
            console.log("Browser console:", msg.text()),
        );
        page.on("pageerror", (err) => console.error("Browser error:", err));

        // Wait for network and scripts to load
        await page.waitForNetworkIdle({
            idleTime: 2000,
            timeout: 30000,
        });

        // Add a small delay to ensure everything is initialized
        await page.waitForTimeout(1000);

        // Wait for MINDAR to be available
        await page
            .waitForFunction(
                () => {
                    return window.MINDAR && window.MINDAR.IMAGE;
                },
                { timeout: 10000 },
            )
            .catch((error) => {
                console.error("Timeout waiting for MINDAR to initialize");
                throw error;
            });

        // 6. Run MindAR compiler with better error handling
        const compiledData = await page
            .evaluate(async () => {
                try {
                    const result = await window.compile();
                    if (!result) {
                        throw new Error("Compilation returned no data");
                    }
                    return Array.from(new Uint8Array(result));
                } catch (error) {
                    console.error("Compilation status:", window.compileStatus);
                    throw error;
                }
            })
            .catch(async (error) => {
                // Get any additional error context from the page
                const errorContext = await page.evaluate(() => ({
                    mindArPresent: !!window.MINDAR,
                    mindArImagePresent: window.MINDAR && !!window.MINDAR.IMAGE,
                    compileStatus: window.compileStatus,
                }));

                console.error("Compilation failed:", error);
                console.error("Error context:", errorContext);
                throw error;
            });

        // Convert array of bytes into a Node.js Buffer
        const buffer = Buffer.from(compiledData);

        // 7. Upload the .mind file to S3
        const s3Url = await uploadToS3(cardId, buffer);
        console.log(`Mind file uploaded successfully to ${s3Url}`);
        return s3Url;
    } catch (err) {
        console.error("Error compiling Mind file:", err);
        throw err;
    } finally {
        await browser.close();
    }
}

// Main execution
(async () => {
    const cardId = CARD_ID; //process.env.CARD_ID;
    if (!cardId) {
        console.error("CARD_ID environment variable not set.");
        process.exit(1);
    }

    const taskArn = process.env.AWS_ECS_TASK_ARN;

    try {
        const s3Url = await compileMindFile(cardId);
        console.log(
            `Mind file compilation complete. File available at: ${s3Url}`,
        );

        // Stop the task after completion
        try {
            await ecs
                .stopTask({
                    cluster: "OnFireCluster",
                    task: taskArn,
                })
                .promise();
            console.log("ECS task stopped successfully.");
        } catch (ecsError) {
            console.error("Error stopping ECS task:", ecsError);
        }
    } catch (error) {
        console.error("Fatal error:", error);
        process.exit(1);
    }
})();
