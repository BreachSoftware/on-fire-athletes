"use client";

import React, { useEffect, useRef, useState } from "react";
import {
    Box,
    Image,
    Text,
    Flex,
    Heading,
    Skeleton,
    Checkbox,
    Button,
} from "@chakra-ui/react";
import "@fontsource/barlow-condensed/500-italic.css";
import { getCard } from "../generate_card_asset/cardFunctions";
import { generateArCardBackImage } from "@/components/create/OnFireCard/generate-card-images";
import SharedStack from "@/components/shared/wrappers/shared-stack";
import TradingCardInfo from "@/hooks/TradingCardInfo";
import OnFireCard, {
    PartsToShowType,
} from "@/components/create/OnFireCard/OnFireCard";
import { generateCardImage } from "@/components/create/StepWrapper";
import CardMask from "@/public/card_assets/card-mask.png";

/**
 * Returns the Profile page.
 * @returns {JSX.Element} The Profile page.
 */
export default function Profile() {
    const [card, setCard] = useState<TradingCardInfo | undefined>(undefined);
    const [printFrontImg, setPrintFrontImg] = useState<string | undefined>(
        undefined,
    );
    const [partsToShow, setPartsToShow] = useState<PartsToShowType>({
        onFireLogo: false,
        interiorBorder: false,
        interiorBorderShine: false,
        exteriorBorderShine: false,
        cardShadow: true,
        exteriorBorder: true,
        background: true,
        name: true,
        backgroundName: true,
        number: true,
        position: true,
        team: true,
        hero: true,
        signature: true,
    });
    const [loading, setLoading] = useState(false);
    const [printBackImg, setPrintBackImg] = useState<string | undefined>(
        undefined,
    );

    const onFireCardRef = useRef(null);

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
                // const frontImg = await generatePrintCardFrontImage(card);

                setPrintBackImg(backImg);
                // setPrintFrontImg(frontImg);
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
                            Dynamic Front Card
                        </Heading>
                        <SharedStack row p={8}>
                            <OnFireCard
                                key={card?.uuid}
                                card={card}
                                showButton={false}
                                ref={onFireCardRef}
                                shouldFlipOnClick
                                enabledParts={partsToShow}
                            />
                            <SharedStack p={4} color="white">
                                <Heading size="md">Parts to show</Heading>
                                {Object.entries(partsToShow).map(
                                    ([key, value]) => (
                                        <Checkbox
                                            key={key}
                                            isChecked={value}
                                            onChange={() =>
                                                setPartsToShow({
                                                    ...partsToShow,
                                                    [key]: !value,
                                                })
                                            }
                                        >
                                            {key}
                                        </Checkbox>
                                    ),
                                )}
                            </SharedStack>
                        </SharedStack>

                        <Button
                            bg="blue.500"
                            color="white"
                            onClick={async () => {
                                setLoading(true);
                                const frontImg = await generateCardImage(
                                    onFireCardRef,
                                    CardMask.src,
                                    "cardFront",
                                );
                                setPrintFrontImg(frontImg);
                                setLoading(false);
                            }}
                        >
                            Generate Print Front
                        </Button>
                        <Heading size="lg" color="white">
                            Print Card Front
                        </Heading>
                        <Text color="white">{cardFrontFilename}</Text>
                        {loading ? (
                            <Skeleton w="385px" h="525px" borderRadius="md" />
                        ) : (
                            <Image
                                w="385px"
                                h="525px"
                                src={printFrontImg}
                                alt="Print Front"
                            />
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
