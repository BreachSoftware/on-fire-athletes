import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import html2canvas from "html2canvas";
import QRCode from "qrcode";

import CardMaskReverseImage from "@/public/card_assets/card-mask-reverse.png";
import ArCardBackgroundImage from "@/public/card_assets/ar-card-background-interior.png";
import CardMaskReverse from "@/public/card_assets/card-mask-reverse.png";
import CardOutline from "@/public/card_assets/card-outline.png";
import CardOutlineShine from "@/public/card_assets/card-outline-shine.png";
import OnFireLogo from "@/images/logos/small-logo-white.png";
import TradingCardInfo from "@/hooks/TradingCardInfo";
import { CardFonts } from "@/components/create/create-helpers";
import { maskImageToCard, resize } from "@/components/image_filters";

function calculateTextWidth(text: string, font: string): number {
    const measureCanvas = document.createElement(
        "canvas",
    ) as unknown as HTMLCanvasElement;
    const measureContext = measureCanvas.getContext("2d");
    if (!measureContext) return 0;

    measureContext.font = font;
    return measureContext.measureText(text).width;
}

function calculateTextScale(
    text: string,
    targetWidth: number,
    fontSize: number,
    fontFamily: string,
): number {
    const fullFont = `900 ${fontSize}px ${fontFamily}`; // Adjust font weight as needed
    const actualWidth = calculateTextWidth(text, fullFont);

    console.log("scale", targetWidth / actualWidth);

    return Math.min(7, targetWidth / actualWidth);
}

export async function generateArCardBackImage(
    card: TradingCardInfo,
): Promise<string> {
    // Generate QR code
    const url = `https://onfireathletes.com/ar/${card.uuid}`;
    const qrCodeData = await QRCode.toDataURL(url, {
        width: 64,
        margin: 0,
        errorCorrectionLevel: "H",
        color: {
            dark: "#000000",
            light: "#ffffff",
        },
    });

    // Calculate text scaling
    const firstNameWidth = 200;
    const lastNameWidth = 180;
    const firstNameScale = calculateTextScale(
        card.firstName,
        firstNameWidth,
        16,
        CardFonts.ChakraPetch,
    );
    const lastNameScale = calculateTextScale(
        card.lastName,
        lastNameWidth,
        16,
        CardFonts.BrotherhoodSansSerif,
    );

    const textDefaultTop = 138;

    // Calculate name positions
    const firstNameTop = textDefaultTop + ((7 - firstNameScale) / 7) * 100; // Adjust the multiplier (40) to control how much it moves
    const lastNameTop = textDefaultTop + 94; // default last name buffer
    // Math.max(-18, (card.lastName.length || 0) * -2); // if last name is longer, move up

    // Create a temporary container
    const container = document.createElement("div");
    container.style.position = "fixed"; // Changed from absolute
    container.style.top = "0";
    container.style.left = "0";
    container.style.width = "350px";
    container.style.height = "490px";
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
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "490px",
                        width: "350px",
                        maskImage: `url(${CardMaskReverseImage.src})`,
                        maskMode: "luminance",
                        maskSize: "cover",
                        maskRepeat: "no-repeat",
                        transformStyle: "preserve-3d",
                        WebkitMaskImage: `url(${CardMaskReverseImage.src})`,
                        WebkitMaskMode: "luminance",
                        WebkitMaskSize: "contain",
                        WebkitMaskRepeat: "no-repeat",
                        position: "relative",
                    },
                },
                [
                    // This is the exterior border
                    // We put it first because you can't do masks with static html
                    createElement(
                        "div",
                        {
                            style: {
                                transform: "scaleX(-1)", // mirrored
                                position: "absolute",
                                zIndex: -1, // Equivalent to cardBackVideo + 1
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                pointerEvents: "none",
                                userSelect: "none",
                            },
                        },
                        [
                            // Color Border
                            createElement("div", {
                                style: {
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    background: card.borderColor,
                                    maskImage: `url(${CardOutline.src})`,
                                    maskSize: "cover",
                                    maskRepeat: "no-repeat",
                                    WebkitMaskImage: `url(${CardOutline.src})`,
                                    WebkitMaskSize: "cover",
                                    WebkitMaskRepeat: "no-repeat",
                                },
                            }),
                            // Shine Effect
                            createElement("div", {
                                style: {
                                    position: "absolute",
                                    zIndex: 10,
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    background: `url(${CardOutlineShine.src})`,
                                    backgroundSize: "cover",
                                    opacity: 0.25,
                                    pointerEvents: "none",
                                },
                            }),
                        ],
                    ),

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
                                        paddingTop: "24px",
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
                                                marginTop: "4px",
                                                marginBottom: "8px",
                                                color: "white",
                                                fontFamily:
                                                    CardFonts.BrotherhoodSansSerif,
                                            },
                                        },
                                        `1 /${card.currentlyAvailable}`,
                                    ),
                                    createElement("img", {
                                        src: qrCodeData,
                                        style: {
                                            marginTop: "8px",
                                            width: "48px",
                                            height: "48px",
                                        },
                                    }),
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
                                        fontFamily: CardFonts.ChakraPetch,
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
                    // Footer text
                    createElement(
                        "div",
                        {
                            style: {
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "flex-end",
                                position: "absolute",
                                right: "32px",
                                bottom: "30px",
                                fontSize: "7px",
                                color: "white",
                                textAlign: "right",
                                letterSpacing: "1px",
                            },
                        },
                        [
                            createElement(
                                "div",
                                {},
                                "OFFICIAL TRADING CARD OF ONFIRE ATHLETES. THIS",
                            ),
                            createElement(
                                "div",
                                {},
                                "CARD HAS NOT BEEN AUTHORIZED, ENDORSED, OR",
                            ),
                            createElement(
                                "div",
                                {},
                                "APPROVED BY ANY LICENSING BODY",
                            ),
                        ],
                    ),
                ],
            ),
        );

        container.innerHTML = html;
        document.body.appendChild(container);

        const scale = 2;
        const width = 350;
        const height = 490;

        console.log("Starting html2canvas capture...");
        const canvas = await html2canvas(container, {
            width: width,
            height: height,
            scale: scale,
            useCORS: true,
            logging: true,
            backgroundColor: "#000000",
            onclone: (clonedDoc) => {
                // Debug logging
                console.log("Cloned document:", clonedDoc);
                const clonedElement = clonedDoc.body.firstChild;
                console.log("Cloned element:", clonedElement);
            },
        });

        const mask = CardMaskReverse.src;

        const imageBase64 = canvas.toDataURL("image/png", 1.0);
        const resizedMask = await resize(mask, width * scale, height * scale);
        const resultingImage = await maskImageToCard(imageBase64, resizedMask);
        return resultingImage;
    } finally {
        document.body.removeChild(container);
    }
}
