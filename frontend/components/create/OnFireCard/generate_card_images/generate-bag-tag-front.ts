import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import html2canvas from "html2canvas";
import "@fontsource/chakra-petch/600.css";

import CardOutlineNew from "@/public/card_assets/card-outline-thick.png";
import { recolor } from "@/components/image_filters";
import BagTagTitleWhite from "@/public/card_assets/bag-tag-title.png";
import BagTagTitleBlack from "@/public/card_assets/bag-tag-title-black.png";
import { colorTooDark } from "../card_utils";

export async function generateBagTagFrontImage(
    cardImageSrc: string,
    cardBorderColor: string,
    {
        asPng = false,
    }: {
        asPng?: boolean;
    } = {},
): Promise<string> {
    const width = 385;
    const height = 611.5;

    // Create a temporary container
    const container = document.createElement("div");
    container.style.position = "fixed"; // Changed from absolute
    container.style.top = "0";
    container.style.left = "0";
    container.style.width = `${width}px`;
    container.style.height = `${height}px`;
    container.style.backgroundColor = "#000"; // Add background color for debugging
    container.style.zIndex = "-1000"; // Keep it behind everything

    const bagTagTitle = colorTooDark(cardBorderColor)
        ? BagTagTitleWhite
        : BagTagTitleBlack;

    try {
        // Load all images first
        const imagePromises = [
            new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve(cardImageSrc);
                img.src = cardImageSrc;
            }),
        ];

        await Promise.all(imagePromises);

        const recoloredOutline = await recolor(
            CardOutlineNew.src,
            cardBorderColor,
            undefined,
            true,
        ).catch((error) => {
            console.error("Error recoloring the card outline", error);
            return null;
        });

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
                        background: cardBorderColor,
                    },
                },
                [
                    // Bag Tag Logo
                    createElement("img", {
                        src: bagTagTitle.src,
                        style: {
                            position: "absolute",
                            width: "222.5px",
                            // height: "42px",
                            left: "80px",
                            top: "72px",
                        },
                    }),
                    createElement("img", {
                        src: cardImageSrc,
                        style: {
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "490px",
                            width: "350px",
                            zIndex: 10,
                            position: "absolute",
                            top: "102px",
                        },
                    }),
                    createElement("img", {
                        src: recoloredOutline,
                        style: {
                            height: "490px",
                            width: "350px",
                            position: "absolute",
                            left: "50%",
                            top: "102px",
                            transform: "translate(-50%, 0)",
                            zIndex: 11,
                            objectFit: "cover",
                        },
                    }),
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

        const imageType = asPng ? "image/png" : "image/jpeg";
        const imageBase64 = canvas.toDataURL(imageType, 1.0);
        // We can do masking here if we want
        const resultingImage = imageBase64;
        return resultingImage;
    } finally {
        document.body.removeChild(container);
    }
}
