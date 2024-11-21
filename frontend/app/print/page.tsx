"use client";

import React, { useEffect, useState } from "react";
import { Box, Image, Text, Flex, Heading, Skeleton } from "@chakra-ui/react";
import "@fontsource/barlow-condensed/500-italic.css";
import { getCard } from "../generate_card_asset/cardFunctions";
import {
    generateArCardBackImage,
    generatePrintCardFrontImage,
} from "@/components/create/OnFireCard/generate-card-images";
import SharedStack from "@/components/shared/wrappers/shared-stack";
import TradingCardInfo from "@/hooks/TradingCardInfo";

/**
 * Returns the Profile page.
 * @returns {JSX.Element} The Profile page.
 */
export default function Profile() {
    const [card, setCard] = useState<TradingCardInfo | undefined>(undefined);
    const [printFrontImg, setPrintFrontImg] = useState<string | undefined>(
        undefined,
    );
    const [printBackImg, setPrintBackImg] = useState<string | undefined>(
        undefined,
    );

    const cardFrontFilename = `${card?.uuid}_v${card?.cardType === "a" ? "1" : "2"}_X_X_${card?.firstName}_${card?.lastName}.png`;
    const cardBackFilename = `${card?.uuid}_v${card?.cardType === "a" ? "1" : "2"}_X_X_${card?.firstName}_${card?.lastName}_back.png`;

    useEffect(() => {
        (async () => {
            const queryParams = new URLSearchParams(window.location.search);
            const userId = queryParams.get("user");
            const selectedCardId = queryParams.get("card");

            if (!selectedCardId || !userId) {
                return;
            }

            const card = await getCard(selectedCardId, userId);

            if (card) {
                setCard(card);
                const backImg = await generateArCardBackImage(card, {
                    noNumber: true,
                });
                const frontImg = await generatePrintCardFrontImage(card);

                setPrintBackImg(backImg);
                setPrintFrontImg(frontImg);
            }
        })();
    }, []);

    return (
        <Flex
            flexDir="column"
            w="full"
            bg="#121212"
            justifyContent="center"
            alignItems="center"
        >
            <Flex flexDir="column" w="full" minH="100dvh" maxW="1200px">
                <SharedStack>
                    <Box>
                        <Heading size="lg" color="white">
                            Print Card Front
                        </Heading>
                        <Text color="white">{cardFrontFilename}</Text>
                        {printFrontImg ? (
                            <Image
                                w="385px"
                                h="525px"
                                src={printFrontImg}
                                alt="Print Front"
                            />
                        ) : (
                            <Skeleton w="385px" h="525px" borderRadius="md" />
                        )}
                    </Box>
                    <Box>
                        <Heading size="lg" color="white">
                            Print Card Back
                        </Heading>
                        <Text color="white">{cardBackFilename}</Text>
                        {printBackImg ? (
                            <Image
                                w="385px"
                                h="525px"
                                src={printBackImg}
                                alt="Print Back"
                            />
                        ) : (
                            <Skeleton w="385px" h="525px" borderRadius="md" />
                        )}
                    </Box>
                </SharedStack>
            </Flex>
        </Flex>
    );
}
