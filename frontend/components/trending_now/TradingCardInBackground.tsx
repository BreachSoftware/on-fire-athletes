import { RefObject } from "react";
import { Box, Center, Skeleton } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

import FilterInfo from "@/hooks/FilterInfo";
import TradingCardInfo from "@/hooks/TradingCardInfo";
import { useCurrentFilterProperties } from "@/hooks/useCurrentFilter";
import {
    saturateHex,
    getColorAsHex,
    colorTooDark,
    lightenColor,
} from "../create/OnFireCard/card_utils";
import OnFireCard, { OnFireCardRef } from "../create/OnFireCard/OnFireCard";
import LockerRoomBackground from "../../public/card_assets/locker-room-background.png";

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
