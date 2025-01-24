import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import html2canvas from "html2canvas";
import QRCode from "qrcode";
import "@fontsource/chakra-petch/600.css";

import CardMaskReverseImage from "@/public/card_assets/card-mask-reverse.png";
import ArCardBackgroundImage from "@/public/card_assets/ar-card-background-interior.png";
import CardMaskReverse from "@/public/card_assets/card-mask-reverse.png";
import OnFireLogo from "@/images/logos/small-logo-white.png";
import TradingCardInfo from "@/hooks/TradingCardInfo";
import { CardFonts } from "@/components/create/create-helpers";
import { maskImageToCard, resize } from "@/components/image_filters";

async function calculateTextWidth(text: string, font: string): Promise<number> {
    // Create a hidden div for more accurate font measurement
    const measureDiv = document.createElement("div");
    measureDiv.style.position = "absolute";
    measureDiv.style.visibility = "hidden";
    measureDiv.style.height = "auto";
    measureDiv.style.width = "auto";
    measureDiv.style.whiteSpace = "nowrap";
    measureDiv.style.font = font;
    measureDiv.textContent = text;

    document.body.appendChild(measureDiv);

    try {
        // Force a browser reflow to ensure accurate measurements
        void measureDiv.offsetWidth;

        // Wait a frame to ensure styles are applied
        await new Promise(requestAnimationFrame);

        const width = measureDiv.getBoundingClientRect().width;

        return width;
    } finally {
        document.body.removeChild(measureDiv);
    }
}

async function calculateTextScale(
    text: string,
    targetWidth: number,
    fontSize: number,
    fontFamily: string,
): Promise<number> {
    // Ensure font is loaded first
    await document.fonts.ready;

    // Force font loading if possible
    try {
        await document.fonts.load(`900 ${fontSize}px ${fontFamily}`);
    } catch (e) {
        console.warn("Font loading failed:", e);
    }

    const fullFont = `900 ${fontSize}px ${fontFamily}`;
    const actualWidth = await calculateTextWidth(text, fullFont);
    const scale = Math.min(5, targetWidth / actualWidth);

    return scale;
}

export async function generateArCardBackImage(
    card: TradingCardInfo,
    {
        editionNumber,
        totalOverride,
        forPrint = true,
        noNumber = false,
    }: {
        editionNumber?: number;
        totalOverride?: number;
        forPrint?: boolean;
        noNumber?: boolean;
    } = {},
): Promise<string> {
    // Generate QR code
    const url = `https://onfireathletes.com/ar?card=${card.uuid}`;
    const qrCodeData = await QRCode.toDataURL(url, {
        width: 128,
        margin: 2,
        errorCorrectionLevel: "H",
        color: {
            dark: "#000000",
            light: "#ffffff",
        },
    });

    // Calculate text scaling
    const firstNameWidth = forPrint ? 240 : 200;
    const lastNameWidth = forPrint ? 250 : 180;
    const firstNameScale = await calculateTextScale(
        card.firstName,
        firstNameWidth,
        16,
        CardFonts.ChakraPetch,
    );
    const lastNameScale = await calculateTextScale(
        card.lastName,
        lastNameWidth,
        16,
        CardFonts.BrotherhoodSansSerif,
    );

    const textDefaultTop = 108;

    // Calculate name positions
    const firstNameTop = textDefaultTop + ((7 - firstNameScale) / 7) * 100; // Adjust the multiplier (40) to control how much it moves
    const lastNameTop = textDefaultTop + 94; // default last name buffer
    // Math.max(-18, (card.lastName.length || 0) * -2); // if last name is longer, move up

    const width = forPrint ? 385 : 350;
    const height = forPrint ? 525 : 490;

    // Create a temporary container
    const container = document.createElement("div");
    container.style.position = "fixed"; // Changed from absolute
    container.style.top = "0";
    container.style.left = "0";
    container.style.width = `${width}px`;
    container.style.height = `${height}px`;
    container.style.backgroundColor = "#000"; // Add background color for debugging
    container.style.zIndex = "-1000"; // Keep it behind everything

    try {
        // Load all images first
        const imagePromises = [
            new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve(CardMaskReverseImage.src);
                img.src = CardMaskReverseImage.src;
            }),
            new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve(ArCardBackgroundImage.src);
                img.src = ArCardBackgroundImage.src;
            }),
            new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve(OnFireLogo.src);
                img.src = OnFireLogo.src;
            }),
        ];

        await Promise.all(imagePromises);

        const html = renderToStaticMarkup(
            createElement(
                "div",
                {
                    style: {
                        width: `${width}px`,
                        height: `${height}px`,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        background: card.borderColor,
                    },
                },
                [
                    createElement(
                        "div",
                        {
                            style: {
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "490px",
                                width: "350px",
                                position: "relative",
                            },
                        },
                        [
                            // Interior Background
                            createElement("div", {
                                style: {
                                    height: "490px",
                                    width: "350px",
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    background: `url(${ArCardBackgroundImage.src})`,
                                    backgroundSize: "cover",
                                },
                            }),

                            // Center content (QR code, logo, edition number)
                            createElement(
                                "div",
                                {
                                    style: {
                                        zIndex: 11,
                                        height: "490px",
                                        width: "350px",
                                        left: 0,
                                        top: 0,
                                        position: "absolute",
                                    },
                                },
                                [
                                    createElement(
                                        "div",
                                        {
                                            style: {
                                                position: "absolute",
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                background: "black",
                                                width: "fit-content",
                                                padding: "8px",
                                                paddingTop: "124px",
                                                marginTop: "-100px",
                                                left: "50%",
                                                transform: "translateX(-50%)",
                                            },
                                        },
                                        [
                                            createElement("img", {
                                                src: OnFireLogo.src,
                                                style: {
                                                    filter: "brightness(0) invert(1)",
                                                    width: "42px",
                                                    height: "42px",
                                                    WebkitFilter:
                                                        "brightness(0) invert(1)",
                                                },
                                            }),
                                            createElement(
                                                "div",
                                                {
                                                    style: {
                                                        marginTop: "-2px",
                                                        paddingBottom: "16px",
                                                        color: "white",
                                                        fontFamily:
                                                            CardFonts.BrotherhoodSansSerif,
                                                        visibility: noNumber
                                                            ? "hidden"
                                                            : "visible",
                                                    },
                                                },
                                                `${editionNumber || 1} /${totalOverride || card.totalCreated}`,
                                            ),
                                        ],
                                    ),
                                ],
                            ),
                            // Names
                            createElement(
                                "div",
                                {
                                    style: {
                                        position: "absolute",
                                        left: "0px",
                                        top: "0px",
                                        height: "490px",
                                        width: "350px",
                                    },
                                },
                                [
                                    createElement(
                                        "div",
                                        {
                                            style: {
                                                textAlign: "center",
                                                color: "rgba(0,0,0,0)",
                                                fontFamily:
                                                    CardFonts.ChakraPetch,
                                                fontSize: "16px", // Base font size
                                                fontWeight: 900,
                                                textTransform: "uppercase",
                                                transform: `scale(${firstNameScale}) translateX(-50%)`,
                                                transformOrigin: "left",
                                                whiteSpace: "nowrap",
                                                WebkitTextStroke: "0.2px white",
                                                position: "absolute",
                                                // left: `${firstNameLeft}px`,
                                                left: "50%",
                                                top: `${firstNameTop}px`,
                                            },
                                        },
                                        card.firstName,
                                    ),
                                    createElement(
                                        "div",
                                        {
                                            style: {
                                                textAlign: "center",
                                                color: "white",
                                                fontFamily:
                                                    CardFonts.BrotherhoodSansSerif,
                                                fontSize: "16px", // Base font size
                                                textTransform: "uppercase",
                                                transform: `scale(${lastNameScale}) translateX(-50%)`,
                                                transformOrigin: "left",
                                                whiteSpace: "nowrap",
                                                position: "absolute",
                                                // left: `${lastNameLeft}px`,
                                                left: "48%",
                                                top: `${lastNameTop}px`,
                                            },
                                        },
                                        card.lastName,
                                    ),
                                ],
                            ),
                            // Footer QR code
                            createElement("img", {
                                src: qrCodeData,
                                style: {
                                    position: "absolute",
                                    right: "26px",
                                    bottom: "32px",
                                    width: "72px",
                                    height: "72px",
                                    padding: "1px",
                                    background: "white",
                                    borderRadius: "1px",
                                    objectFit: "contain",
                                },
                            }),
                            // Footer text
                            createElement(
                                "div",
                                {
                                    style: {
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "flex-end",
                                        alignItems: "flex-end",
                                        position: "absolute",
                                        right: "106px",
                                        bottom: "36px",
                                        color: "white",
                                        textAlign: "right",
                                    },
                                },
                                [
                                    createElement(
                                        "div",
                                        {
                                            style: {
                                                fontSize: "24px",
                                                fontFamily:
                                                    CardFonts.BrotherhoodSansSerif,
                                                marginBottom: "16px",
                                                letterSpacing: "0.2px",
                                                marginRight: "10px",
                                            },
                                        },
                                        "LIGHT IT UP!",
                                    ),
                                    createElement("div", {
                                        style: {
                                            width: "202px",
                                            height: "1px",
                                            background: "white",
                                            marginTop: "-10px",
                                            marginBottom: "4px",
                                        },
                                    }),
                                    createElement(
                                        "div",
                                        {
                                            style: {
                                                fontSize: "8.5px",
                                                fontWeight: 400,
                                                fontFamily: "Barlow",
                                                lineHeight: "8px",
                                            },
                                        },
                                        [
                                            createElement(
                                                "i",
                                                {},
                                                "This card is solely ",
                                            ),
                                            createElement("b", {}, "licensed"),
                                            createElement(
                                                "i",
                                                {},
                                                " by the depicted player",
                                            ),
                                        ],
                                    ),
                                    createElement(
                                        "div",
                                        {
                                            style: {
                                                fontSize: "10.5px",
                                                // letterSpacing: "1px",
                                                fontWeight: 600,
                                                fontFamily: "Barlow",
                                            },
                                        },
                                        "©2024 ONFIRE ATHLETES",
                                    ),
                                ],
                            ),
                        ],
                    ),
                ],
            ),
        );

        container.innerHTML = html;
        document.body.appendChild(container);

        const scale = 2;

        console.log("Starting html2canvas capture...");
        const canvas = await html2canvas(container, {
            width: width,
            height: height,
            scale: scale,
            useCORS: true,
            logging: true,
            backgroundColor: "#000000",
        });

        const mask = CardMaskReverse.src;

        const imageBase64 = canvas.toDataURL("image/png", 1.0);
        const resizedMask = await resize(mask, width * scale, height * scale);
        const resultingImage = forPrint
            ? imageBase64
            : await maskImageToCard(imageBase64, resizedMask);
        return resultingImage;
    } finally {
        document.body.removeChild(container);
    }
}
