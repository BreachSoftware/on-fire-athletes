import { CardPart } from "@/hooks/TradingCardInfo";
import { useCurrentCardInfo } from "@/hooks/useCurrentCardInfo";
import { Box, Button, HStack, Image } from "@chakra-ui/react";
import StatusIcon from "../StatusIcon";
import { CARD_BACKGROUNDS } from "../card-backgrounds";

/**
 * This function returns a background selector for the mobile step 8 component.
 * @returns the mobile step 8 component
 */
export default function MobileStep8() {
    // Get the current card info from the context
    const card = useCurrentCardInfo();

    /**
     *
     * A function to render a background selector button
     *
     * @param index The index of the background to render
     * @returns the background selector button
     */
    function backgroundSelector(index: number) {
        const background = CARD_BACKGROUNDS[index];

        return (
            <Button
                key={index}
                height={"80px"}
                width={"22vw"}
                border={
                    card.curCard.selectedBackground === index
                        ? "2px solid var(--chakra-colors-green-100)"
                        : ""
                }
                borderRadius={"5px"}
                p="5px"
                flexShrink={0}
                onClick={() => {
                    card.setCurCard({
                        ...card.curCard,
                        selectedBackground: index,
                        partsToRecolor: [CardPart.BACKGROUND], // Forces card re-render
                    });
                }}
            >
                <Box position="relative" height="100%" width="100%">
                    <Image
                        src={`/backgrounds/${background.src}`}
                        bg={"#888"}
                        objectFit={"cover"}
                        height={"100%"}
                        width={"100%"}
                        alt={`Background ${index}`}
                        borderRadius={"5px"}
                        style={{
                            filter: `brightness(${card.curCard.selectedBackground === index ? "100%" : "70%"})`,
                        }}
                        draggable={false}
                    />
                    {card.curCard.selectedBackground === index && (
                        // The checkmark icon
                        <Box position="absolute" bottom="-11px" right="-15px">
                            <StatusIcon
                                isCheck={true}
                                isGlowing={true}
                                isActive={true}
                            />
                        </Box>
                    )}
                </Box>
            </Button>
        );
    }

    return (
        <HStack key="20" width={"100%"} overflowX="auto" paddingBottom={"10px"}>
            {/* Using a map function to generate 6 vertical photo placeholders */}
            {Array.from({ length: CARD_BACKGROUNDS.length }, (_, i) => {
                return backgroundSelector(i);
            })}
        </HStack>
    );
}
