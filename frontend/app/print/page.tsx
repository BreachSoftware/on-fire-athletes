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
import { generateArCardBackImage } from "@/components/create/OnFireCard/generate_card_images/generate-print-card-back";
import { generatePrintCardFrontImage } from "@/components/create/OnFireCard/generate_card_images/generate-print-card-front";
import { generateBagTagFrontImage } from "@/components/create/OnFireCard/generate_card_images/generate-bag-tag-front";
import { generateBagTagBackImage } from "@/components/create/OnFireCard/generate_card_images/generate-bag-tag-back";
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
    const [printBackImg, setPrintBackImg] = useState<string | undefined>(
        undefined,
    );
    const [bagTagBackImg, setBagTagBackImg] = useState<string | undefined>(
        undefined,
    );

    const cardBackFilename = `${card?.uuid}_v${card?.cardType === "a" ? "1" : "2"}_X_X_${card?.firstName}_${card?.lastName}_back.png`;
    const bagTagBackFilename = `${card?.uuid}_v${card?.cardType === "a" ? "1" : "2"}_X_X_${card?.firstName}_${card?.lastName}_bag_back.png`;

    useEffect(() => {
        (async () => {
            const queryParams = new URLSearchParams(window.location.search);
            const userId = queryParams.get("user");
            const selectedCardId = queryParams.get("card");

            if (!selectedCardId) {
                return;
            }

            const card = await getCard(selectedCardId, userId || undefined);

            if (card) {
                setCard(card);
                const backImg = await generateArCardBackImage(card, {
                    noNumber: true,
                });

                setPrintBackImg(backImg);
                generateBagTagImages(card);
            }
        })();
    }, []);

    async function generateBagTagImages(cardInfo: TradingCardInfo) {
        if (!cardInfo) {
            return;
        }
        const bagTagBackImg = await generateBagTagBackImage(cardInfo, {
            editionNumber: 1,
            totalOverride: 1,
        });
        setBagTagBackImg(bagTagBackImg);
    }

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
                    <ModdablePrintCard card={card} isBagTag={false} />
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
                    <Box mt={8}>
                        <ModdablePrintCard
                            card={card}
                            isBagTag
                            partsToShowDefaults={{
                                onFireLogo: true,
                                interiorBorder: true,
                            }}
                        />
                    </Box>
                    <Box>
                        <Heading size="lg" color="white">
                            Bag Tag Back
                        </Heading>
                        <Text color="white">{bagTagBackFilename}</Text>
                        {bagTagBackImg ? (
                            <Image
                                w="385px"
                                h="611.5px"
                                src={bagTagBackImg}
                                alt="Bag Tag Back"
                            />
                        ) : (
                            <Skeleton w="385px" h="611.5px" borderRadius="md" />
                        )}
                    </Box>
                </SharedStack>
            </Flex>
        </Flex>
    );
}

function ModdablePrintCard({
    card,
    isBagTag,
    partsToShowDefaults,
}: {
    card: TradingCardInfo | undefined;
    isBagTag: boolean;
    partsToShowDefaults?: Partial<PartsToShowType>;
}) {
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
        ...partsToShowDefaults,
    });
    const onFireCardRef = useRef(null);

    const cardFrontFilename = `${card?.uuid}_v${card?.cardType === "a" ? "1" : "2"}_X_X_${card?.firstName}_${card?.lastName}${isBagTag ? "_bag_front" : ""}.png`;

    const [loading, setLoading] = useState(false);

    async function generatePrintFront(cardInfo: TradingCardInfo) {
        // Ensure images are displayed correctly for html2canvas
        const style = document.createElement("style");
        document.head.appendChild(style);
        // @ts-expect-error - style.sheet is not defined
        style.sheet?.insertRule(
            "body > div:last-child img { display: inline-block; }",
        );
        setLoading(true);
        const frontImg = await generateCardImage(
            onFireCardRef,
            CardMask.src,
            "cardFront",
        );

        const generateImageFn = isBagTag
            ? generateBagTagFrontImage
            : generatePrintCardFrontImage;

        const printFrontImg = await generateImageFn(
            frontImg,
            cardInfo.borderColor || "#ffffff",
            {
                forPrint: true,
            },
        );
        setPrintFrontImg(printFrontImg);
        setLoading(false);
    }

    useEffect(() => {
        if (card) {
            generatePrintFront(card);
        }
    }, [card]);

    return (
        <Box>
            <Heading size="lg" color="white">
                Dynamic Front Card
            </Heading>
            <SharedStack row p={8}>
                <OnFireCard
                    key={card?.uuid}
                    card={card}
                    showButton={false}
                    cardFrontRef={onFireCardRef}
                    shouldFlipOnClick
                    enabledParts={partsToShow}
                />
                <SharedStack p={4} color="white">
                    <Heading size="md">Parts to show</Heading>
                    {Object.entries(partsToShow).map(([key, value]) => (
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
                    ))}
                </SharedStack>
            </SharedStack>

            <Button
                bg="blue.500"
                color="white"
                onClick={() => (card ? generatePrintFront(card) : 0)}
            >
                Re-Generate Print Front
            </Button>
            <Heading size="lg" color="white">
                {isBagTag ? "Bag Tag Front" : "Print Card Front"}
            </Heading>
            <Text color="white">{cardFrontFilename}</Text>
            {loading ? (
                <Skeleton
                    w="385px"
                    h={isBagTag ? "611.5px" : "525px"}
                    borderRadius="md"
                />
            ) : (
                <Image
                    w="385px"
                    h={isBagTag ? "611.5px" : "525px"}
                    src={printFrontImg}
                    alt="Print Front"
                />
            )}
        </Box>
    );
}
