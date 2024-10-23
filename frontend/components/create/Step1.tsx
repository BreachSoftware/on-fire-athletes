// eslint-disable-next-line no-use-before-define
import React, { useEffect } from "react";
import {
    VStack,
    Box,
    Image,
    Flex,
    Heading,
    useBreakpointValue,
} from "@chakra-ui/react";
import { useCurrentCardInfo } from "@/hooks/useCurrentCardInfo";
import { useState } from "react";
import TradingCardInfo, { allPartsToRecolor } from "@/hooks/TradingCardInfo";
import CardDropShadow from "./CardDropShadow";
import BlankA from "@/images/card-templates/blank-A.png";
import BlankB from "@/images/card-templates/blank-B.png";
import StatusIcon from "./StatusIcon";

/**
 * This component contains the content of Step 1 in the card creation process
 *
 * @returns the content of Step 1 in the card creation process
 */
export default function Step1() {
    const currentInfo = useCurrentCardInfo();
    const [cardType, setCardType] = useState("");
    const [cardWidth, setCardWidth] = useState(0);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [clickedIndex, setClickedIndex] = useState<number | null>(null);
    const [iconSize, setIconSize] = useState(12);
    const isMobile = useBreakpointValue({ base: true, md: false });

    if (currentInfo.curCard.partsToRecolor.length === 0) {
        // Allowing gameCard to re-render when the user changes the card type
        currentInfo.setCurCard({
            ...currentInfo.curCard,
            partsToRecolor: allPartsToRecolor(),
        });
    }

    const cardStyles = [BlankA, BlankB];

    // Look for user changes
    useEffect(() => {
        TradingCardInfo.showInfo(currentInfo.curCard);
        currentInfo.setCurCard({
            ...currentInfo.curCard,
            cardType: cardType,
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cardType, currentInfo.curCard.stepNumber]);

    // Determine card widths based on window size
    useEffect(() => {
        // Define breakpoints and corresponding widths
        const breakpoints = [
            { maxWidth: 375, width: 83 },
            { maxWidth: 425, width: 115 },
            { maxWidth: 768, width: 130 },
            { maxWidth: 1024, width: 150 },
            { maxWidth: Infinity, width: 200 },
        ];

        /**
         * Function to handle resizing of the window
         */
        function handleResize() {
            const windowWidth = window.innerWidth;
            const matchedBreakpoint = breakpoints.find((bp) => {
                return windowWidth <= bp.maxWidth;
            });
            if (matchedBreakpoint) {
                setCardWidth(matchedBreakpoint.width);
                setIconSize(matchedBreakpoint.width / 10);
            }
        }

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            return window.removeEventListener("resize", handleResize);
        };
    });

    return (
        <>
            <VStack
                width={"100%"}
                height={"100%"}
                alignItems={"center"}
                justifyContent={"center"}
                gap={16}
                fontFamily={"Barlow Semi Condensed"}
            >
                {/* Title */}
                <VStack
                    fontStyle={"italic"}
                    position={"relative"}
                    textTransform={"uppercase"}
                    letterSpacing={2.5}
                    textAlign={"center"}
                >
                    {!isMobile && (
                        <Heading color={"green.100"}>Step 1:</Heading>
                    )}
                    <Heading
                        color={"white"}
                        fontFamily={"'Brotherhood', sans-serif"}
                    >
                        Select Your Layout
                    </Heading>
                </VStack>

                {/* Show the selected card types */}
                <Flex
                    width={"100%"}
                    height={"100%"}
                    flexDirection={"row"}
                    wrap={"wrap"}
                    gap={{ base: "25px", sm: "35px", xl: "70px" }}
                    justifyContent={"center"}
                    alignItems={"center"}
                >
                    {/* Cards and Shadows */}
                    {cardStyles.map((image, index) => {
                        return (
                            <Flex key={index} flexDirection={"column"}>
                                <Box
                                    width={`${cardWidth}px`}
                                    cursor="pointer"
                                    opacity={
                                        // If no card is clicked or hovered, set opacity to 1
                                        clickedIndex === null &&
                                        hoveredIndex === null
                                            ? 1
                                            : // If a card is hovered or clicked, set opacity to 1. If not, set opacity to 0.4
                                              hoveredIndex === index ||
                                                clickedIndex === index
                                              ? 1
                                              : 0.4
                                    }
                                    transform={
                                        // If no card is clicked or hovered, set scale to 1
                                        clickedIndex === null &&
                                        hoveredIndex === null
                                            ? "scale(1)"
                                            : // If a card is hovered or clicked, set scale to 1.1. If not, set scale to 1
                                              hoveredIndex === index ||
                                                clickedIndex === index
                                              ? "scale(1.1)"
                                              : "scale(1)"
                                    }
                                    transition={"all 0.3s"}
                                    _hover={{
                                        md: {
                                            transform: "scale(1.1)",
                                            opacity: 1,
                                        },
                                    }}
                                    onClick={() => {
                                        setCardType(index === 0 ? "a" : "b");
                                        setClickedIndex(index);
                                    }}
                                    onMouseEnter={() => {
                                        return setHoveredIndex(index);
                                    }}
                                    onMouseLeave={() => {
                                        return setHoveredIndex(null);
                                    }}
                                    onLoad={() => {}}
                                >
                                    <Image src={image.src} alt="OnFire Card" />
                                    {/* show status icon if card is selected */}
                                    {clickedIndex === index && (
                                        <Box
                                            position="absolute"
                                            bottom={0}
                                            right={0}
                                        >
                                            <StatusIcon
                                                isCheck={true}
                                                isGlowing={true}
                                                iconSize={iconSize}
                                                isActive={true}
                                            />
                                        </Box>
                                    )}
                                </Box>

                                {/* Drop Shadow */}
                                <Box
                                    alignSelf="center"
                                    paddingTop="30px"
                                    w={"120%"}
                                >
                                    <CardDropShadow opacity={0.7} />
                                </Box>
                            </Flex>
                        );
                    })}
                </Flex>
            </VStack>
        </>
    );
}
