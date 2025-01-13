import { RefObject } from "react";
import { Box, Center, Skeleton } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

import FilterInfo from "@/hooks/FilterInfo";
import TradingCardInfo from "@/hooks/TradingCardInfo";
import { useCurrentFilterProperties } from "@/hooks/useCurrentFilter";
import {
    hexToRgb,
    rgbToHsl,
    hslToRgb,
    rgbToHex,
    saturateHex,
    getColorAsHex,
} from "../create/OnFireCard/card_utils";
import OnFireCard, { OnFireCardRef } from "../create/OnFireCard/OnFireCard";
import LockerRoomBackground from "../../public/card_assets/locker-room-background.png";

/**
 * Function that determines if a color is too dark to be used as a background color
 * @param hex the string to check
 * @returns true if the color is too dark, false otherwise
 */
function colorTooDark(hex: string, threshold: number = 125): boolean {
    const rgb = hexToRgb(hex);
    const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
    return brightness < threshold;
}

/**
 * Lightens a hex string if it is too dark
 * @param hex the hex string to lighten
 * @returns the lightened hex string
 */
function lightenColor(hex: string, minimum: number = 125): string {
    // Convert hex to RGB
    const rgb = hexToRgb(hex);

    // Convert RGB to HSL
    const hsl = rgbToHsl(rgb[0], rgb[1], rgb[2]);

    // Adjust the lightness (L) to 125 (assuming L is in the range 0-255)
    hsl[2] = minimum / 255; // Convert to the HSL scale (0-1)

    // Convert back to RGB
    const newRgb = hslToRgb(hsl[0], hsl[1], hsl[2]);

    // Convert the new RGB back to hex
    return rgbToHex(newRgb[0], newRgb[1], newRgb[2]);
}

/**
 * A function to recolor the background image of the trading card
 * Bases the color off of the border color of the card
 * @returns the hex string of the color to use
 */
function decideColor(card: TradingCardInfo) {
    let chosenColor = getColorAsHex(card.borderColor);

    const threshold = 150;
    if (colorTooDark(chosenColor, threshold)) {
        chosenColor = lightenColor(chosenColor, threshold);
    }

    return saturateHex(chosenColor, 1.6);
}

type TradingCardInBackgroundProps = {
    card: TradingCardInfo;
    filter: useCurrentFilterProperties;
    onCardClick: ((card: TradingCardInfo) => void) | undefined;
    isPageFlipping: boolean;
    passedInCard: TradingCardInfo;
    onFireCardRef: RefObject<OnFireCardRef> | undefined;
};

/**
 * A function to display the trading card in the background
 * @param card - The trading card to display
 * @param filter - The current filter to use
 * @param onCardClick - The function to call when the card is clicked
 * @param isPageFlipping - Whether the page is currently flipping
 * @param passedInCard - The trading card to display
 * @param onFireCardRef - The ref to the OnFireCard component
 */
export default function TradingCardInBackground({
    card,
    filter,
    onCardClick,
    isPageFlipping,
    passedInCard,
    onFireCardRef,
}: TradingCardInBackgroundProps) {
    const router = useRouter();

    // Set the default background image
    const defaultBackground = LockerRoomBackground;

    return (
        <Box
            boxShadow={"0 8px 0.75rem #0000004f"}
            w="full"
            minH="370px"
            maxH="410px"
            pb="min(100%, 410px)"
            pos="relative"
            cursor="pointer"
            transition={"background-color 0.5s ease-in-out"}
            onClick={() => {
                if (onCardClick) {
                    onCardClick(passedInCard);
                } else {
                    filter.setCurFilter(new FilterInfo());
                    router.push(
                        `/profile?user=${card?.generatedBy}&card=${card?.uuid}`,
                    );
                }
            }}
            display="flex"
            justifyContent="center"
            alignItems="center"
            backgroundColor={decideColor(card)}
            backgroundImage={defaultBackground.src}
            backgroundSize={"cover"}
            backgroundPosition={"center"}
            backgroundBlendMode={"multiply"}
            // Clip the background image barely barely to fix a weird background color bug
            clipPath={
                "polygon(0.01% 0.01%, 99.99% 0.01%, 99.99% 99.99%, 0.01% 99.99%)"
            }
        >
            <Center
                pos="absolute"
                inset={0}
                w="full"
                h="full"
                transform={"scale(0.595)"}
                marginBottom={4}
                mt={"-3%"}
                mixBlendMode={"normal"}
            >
                {/* Image component for the trading card image */}
                <Skeleton
                    isLoaded={!isPageFlipping}
                    fadeDuration={1}
                    borderRadius={"12"}
                >
                    <OnFireCard
                        key={card.uuid}
                        slim
                        card={card}
                        showButton={false}
                        ref={onFireCardRef}
                        shouldFlipOnClick
                    />
                </Skeleton>
            </Center>
        </Box>
    );
}
