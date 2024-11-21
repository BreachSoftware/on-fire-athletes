import TradingCardInfo, { CardPart } from "@/hooks/TradingCardInfo";
import { CARD_BACKGROUNDS } from "../card-backgrounds";

/**
 * A function to get the array of imagePaths for a card, for it to render properly.
 * @param curCard the current card to get the image paths for
 * @returns the populated array of proper image paths.
 */
export function imagePaths(curCard: TradingCardInfo): string[] {
    return [
        `/backgrounds/${CARD_BACKGROUNDS[curCard.selectedBackground].src}`,
        curCard.signature ? curCard.signature : "",
    ];
}

/**
 * A function to get the array of relevant imageColors for a card, for it to render properly.
 * @param curCard the current card to get the image colors for
 * @returns the array of colors to recolor images by
 */
export function imageColors(curCard: TradingCardInfo): string[] {
    return [curCard.backgroundMainColor, curCard.signatureColor];
}

/**
 * Generates an array to pass into mergeImages
 * returns null if the cardSide or cardType is invalid
 * @param cardSide a string of "front" or "back"
 * @param cardType a string of "a" or "b"
 * @param gamecardImages an array of b64 strings to render
 * @returns the proper array to pass into mergeImages based on configs.
 */
export function cardRenderOrder(
    cardSide: string,
    gameCard: TradingCardInfo,
    gamecardImages: string[],
    finalRender?: boolean,
) {
    const playerPhoto = gameCard.frontPhotoURL;
    const cardType = gameCard.cardType;

    if (cardSide === "front") {
        if (cardType === "a") {
            const consistentElements: (
                | string
                | {
                      src: string;
                      x?: number;
                      y?: number;
                  }
            )[] = [
                { src: "/card_assets/onfire-logo-year.png" },
                {
                    src: gamecardImages[CardPart.INTERIOR_BORDER],
                },
                gamecardImages[CardPart.EXTERIOR_BORDER], // Outline
            ];

            if (finalRender) {
                consistentElements.splice(
                    5,
                    0,
                    playerPhoto !== ""
                        ? {
                              src: playerPhoto,
                              x: gameCard.heroXOffset,
                              y: gameCard.heroYOffset,
                          }
                        : { src: "", x: 20, y: 20 },
                );
            }
            return consistentElements;
        } else if (cardType === "b") {
            const consistentElements = [
                { src: "/card_assets/onfire-logo-year-b.png" },
                { src: "/card_assets/blank.png", x: 0, y: 0 }, // These are quick fixes.
                { src: "/card_assets/blank.png", x: 0, y: 0 }, // For some reason removing these causes cardType B to not render the back of the card properly
                { src: gamecardImages[CardPart.INTERIOR_BORDER] },
                gamecardImages[CardPart.EXTERIOR_BORDER], // Outline
            ];

            if (finalRender) {
                consistentElements.splice(
                    5,
                    0,
                    playerPhoto !== ""
                        ? {
                              src: playerPhoto,
                              x: gameCard.heroXOffset,
                              y: gameCard.heroYOffset,
                          }
                        : { src: "", x: 20, y: 20 },
                );
            }

            return consistentElements;
        }
    } else if (cardSide === "back") {
        return [
            gamecardImages[CardPart.ACCENT],
            gamecardImages[CardPart.BACKGROUND],
            // "/card_assets/card-bars.png", // Texture. Shouldn't really be recolored
        ];
    }
    return null;
}
