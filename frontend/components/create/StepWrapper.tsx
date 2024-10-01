/* eslint-disable no-undef */
"use client";

import {
    Box,
    HStack,
    Heading,
    VStack,
    Wrap,
    WrapItem,
    Flex,
} from "@chakra-ui/react";
import ProgressBar from "./ProgressBar";
import NextButton from "@/app/components/buttons/next_button";
import BackButton from "@/app/components/buttons/back_button";
import { useState } from "react";
import {
    useCurrentCardInfo,
    useCurrentCardInfoProperties,
} from "@/hooks/useCurrentCardInfo";
import TradingCardInfo, {
    PaymentStatus,
    TradeStatus,
} from "@/hooks/TradingCardInfo";
import html2canvas from "html2canvas";
import { b64toBlob, uploadAssetToS3 } from "./Step3";
import { useAuth } from "@/hooks/useAuth";
import { maskImageToCard, resize } from "../image_filters";
import CardMask from "../../public/card_assets/card-mask.png";
import CardMaskReverse from "../../public/card_assets/card-mask-reverse.png";
import { apiEndpoints } from "@backend/EnvironmentManager/EnvironmentManager";

interface StepWrapperProps {
    numSteps: number;
    cardCreationSteps?: { step: JSX.Element; stepTitle: string }[];
    entireCardRef: React.RefObject<HTMLDivElement>;
    foregroundRef: React.RefObject<HTMLDivElement>;
    backgroundRef: React.RefObject<HTMLDivElement>;
    cardBackRef: React.RefObject<HTMLDivElement>;
}

export enum SubmitResult {
    Success = 1,
    GoToCheckout = 2,
    GoToSignup = 3,
    Failure = 4,
}

interface SubmitCardProps {
    entireCardRef: React.RefObject<HTMLDivElement>;
    foregroundRef: React.RefObject<HTMLDivElement>;
    backgroundRef: React.RefObject<HTMLDivElement>;
    cardBackRef: React.RefObject<HTMLDivElement>;
    currentInfo: useCurrentCardInfoProperties;
    userID: string;
}

interface CardImageData {
    cardImageBase64: string;
    cardForegroundImageBase64: string;
    cardBackgroundImageBase64: string;
    cardBackImageBase64: string;
}

interface CardUrls {
    cardS3URL: string;
    cardForegroundS3URL: string;
    cardBackgroundS3URL: string;
    cardBackS3URL: string;
}

class CardSubmissionError extends Error {
    /**
     * Creates a new CardSubmissionError
     */
    constructor(message: string) {
        super(message);
        this.name = "CardSubmissionError";
    }
}

/**
 * Generates a card image from the given reference and mask
 * @param ref The reference to the card
 * @param mask The mask to use for the card
 * @returns The card image
 */
async function generateCardImage(
    ref: React.RefObject<HTMLDivElement>,
    mask: string,
): Promise<string> {
    if (!ref.current) {
        throw new CardSubmissionError("Card reference is null");
    }

    const canvas = await html2canvas(ref.current, {
        backgroundColor: null,
        scale: 2,
    });
    const imageBase64 = canvas.toDataURL("image/png", 1.0);
    const resizedMask = await resize(mask, 700, null);
    return maskImageToCard(imageBase64, resizedMask);
}

/**
 * Generates the card images for the card
 * @param entireCardRef The reference to the entire card
 * @param cardBackRef The reference to the card back
 * @returns The card images
 */
async function generateCardImages(
    entireCardRef: React.RefObject<HTMLDivElement>,
    foregroundRef: React.RefObject<HTMLDivElement>,
    backgroundRef: React.RefObject<HTMLDivElement>,
    cardBackRef: React.RefObject<HTMLDivElement>,
): Promise<CardImageData> {
    // Ensure images are displayed correctly for html2canvas
    const style = document.createElement("style");
    document.head.appendChild(style);
    // @ts-expect-error - style.sheet is not defined
    style.sheet?.insertRule(
        "body > div:last-child img { display: inline-block; }",
    );

    const [
        cardImageBase64,
        cardForegroundImageBase64,
        cardBackgroundImageBase64,
        cardBackImageBase64,
    ] = await Promise.all([
        generateCardImage(entireCardRef, CardMask.src),
        foregroundRef.current
            ? generateCardImage(foregroundRef, CardMask.src)
            : "",
        backgroundRef.current
            ? generateCardImage(backgroundRef, CardMask.src)
            : "",
        generateCardImage(cardBackRef, CardMaskReverse.src),
    ]);

    return {
        cardImageBase64: cardImageBase64,
        cardForegroundImageBase64: cardForegroundImageBase64,
        cardBackgroundImageBase64: cardBackgroundImageBase64,
        cardBackImageBase64: cardBackImageBase64,
    };
}

/**
 * Generates a filename for the card. If the user is signed in, the filename is the user's ID and a timestamp.
 * If the user is not signed in, the filename is a random string and a timestamp.
 * @param userID The ID of the user
 * @returns The filename
 */
function generateFilename(userID: string): string {
    const timestamp = Date.now();
    return userID
        ? `${userID}-${timestamp}.png`
        : `${Math.random().toString(36).substring(2)}-${timestamp}.png`;
}

/**
 * Uploads the card images to S3
 * @param filename The filename to use for the card
 * @param cardImageBase64 The base64 encoded card image
 * @param cardBackImageBase64 The base64 encoded card back image
 * @returns The URLs of the card images
 */
async function uploadImages(
    filename: string,
    {
        cardImageBase64,
        cardForegroundImageBase64,
        cardBackgroundImageBase64,
        cardBackImageBase64,
    }: CardImageData,
): Promise<CardUrls> {
    const [cardBlob, cardForegroundBlob, cardBackgroundBlob, cardBackBlob] =
        await Promise.all([
            b64toBlob(cardImageBase64),
            b64toBlob(cardForegroundImageBase64),
            b64toBlob(cardBackgroundImageBase64),
            b64toBlob(cardBackImageBase64),
        ]);

    await Promise.all([
        uploadAssetToS3(filename, cardBlob, "card", "image/png"),
        uploadAssetToS3(
            filename,
            cardForegroundBlob,
            "card-foreground",
            "image/png",
        ),
        uploadAssetToS3(
            filename,
            cardBackgroundBlob,
            "card-background",
            "image/png",
        ),
        uploadAssetToS3(filename, cardBackBlob, "card-back", "image/png"),
    ]);

    const baseUrl = "https://gamechangers-media-uploads.s3.amazonaws.com";
    return {
        cardS3URL: `${baseUrl}/card/${filename}`,
        cardForegroundS3URL: `${baseUrl}/card-foreground/${filename}`,
        cardBackgroundS3URL: `${baseUrl}/card-background/${filename}`,
        cardBackS3URL: `${baseUrl}/card-back/${filename}`,
    };
}

/**
 * Checks if the user has created a card before
 * @param userID The ID of the user
 * @returns True if the user has created a card before, false otherwise
 */
async function checkFirstCardCreation(userID: string): Promise<boolean> {
    const response = await fetch(apiEndpoints.getCreatedCards(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ generatedBy: userID }),
    });

    if (!response.ok) {
        throw new CardSubmissionError("Failed to check card creation status");
    }

    const result = await response.json();
    return result.length === 0;
}

/**
 * Updates the user's profile
 * @param userID The ID of the user
 * @param cardInfo The current card info
 */
async function updateUserProfile(
    userID: string,
    cardInfo: useCurrentCardInfoProperties["curCard"],
): Promise<void> {
    const isFirstCard = await checkFirstCardCreation(userID);
    if (!isFirstCard) {
        return;
    }

    const profileData = {
        uuid: userID,
        team_hometown: cardInfo.teamName,
        position: cardInfo.position,
        last_name: cardInfo.lastName,
        generated: Math.floor(Date.now() / 1000),
        first_name: cardInfo.firstName,
        bio: cardInfo.NFTDescription,
        avatar: null,
    };

    const response = await fetch(apiEndpoints.users_updateUserProfile(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
    });

    if (!response.ok) {
        throw new CardSubmissionError("Failed to update user profile");
    }
}

/**
 * Submits the card with the given user ID
 * @param entireCardRef The reference to the entire card
 * @param foregroundRef The reference to the front foreground
 * @param backgroundRef The reference to the front background
 * @param cardBackRef The reference to the card back
 * @param currentInfo The current card info
 * @param userID The ID of the user
 * @returns The result of the submission
 */
export async function submitCardWithAuth({
    entireCardRef,
    foregroundRef,
    backgroundRef,
    cardBackRef,
    currentInfo,
    userID,
}: SubmitCardProps): Promise<SubmitResult> {
    try {
        const cardImages = await generateCardImages(
            entireCardRef,
            foregroundRef,
            backgroundRef,
            cardBackRef,
        );
        const filename = generateFilename(userID);
        const cardUrls = await uploadImages(filename, cardImages);

        console.log("cardUrls", cardUrls);

        currentInfo.setCurCard({
            ...currentInfo.curCard,
            ...cardUrls,
            submitted: true,
            paymentStatus: PaymentStatus.PENDING,
            tradeStatus: TradeStatus.TRADE_ONLY,
        });

        if (userID) {
            await updateUserProfile(userID, currentInfo.curCard);
            await TradingCardInfo.submitCard(currentInfo.curCard, userID);
            return SubmitResult.GoToCheckout;
        }
        TradingCardInfo.saveCard(currentInfo.curCard);
        return SubmitResult.GoToSignup;
    } catch (error) {
        console.error("Card submission failed:", error);
        return SubmitResult.Failure;
    }
}

/**
 * The step wrapper for the creation process. Handles the progress bar and the back/next buttons for going through the steps
 * @param param0 StepWrapperProps
 * @returns the React component for the step wrapper
 */
export default function StepWrapper({
    numSteps,
    cardCreationSteps,
    entireCardRef,
    foregroundRef,
    backgroundRef,
    cardBackRef,
}: StepWrapperProps) {
    const currentInfo = useCurrentCardInfo();

    const auth = useAuth();

    const [stepNumber, setStepNumber] = useState(
        currentInfo.curCard.stepNumber,
    );

    /**
     * Checks if the required fields are met.
     */
    function stepIsIncomplete() {
        if (stepNumber === 1) {
            if (
                currentInfo.curCard.cardType !== "a" &&
                currentInfo.curCard.cardType !== "b"
            ) {
                return true;
            }
            return false;
        }
        if (stepNumber === 2) {
            if (
                currentInfo.curCard.firstName.length < 1 ||
                currentInfo.curCard.lastName.length < 1 ||
                currentInfo.curCard.position.length < 1 ||
                currentInfo.curCard.teamName.length < 1
            ) {
                return true;
            }
            return false;
        }
        if (stepNumber === 3) {
            if (currentInfo.curCard.frontPhotoURL != "") {
                return false;
            }
            return true;
        }
        return false;
    }

    const [submitButtonLoading, setSubmitButtonLoading] = useState(false);

    // const router = useRouter();

    return (
        <Box
            backgroundColor={"transparent"}
            backdropBlur={30}
            w={"100%"}
            maxWidth={900}
            h="100%"
        >
            {/* Step 1 has weird padding, espeically on mobile, to account for the "SELECT YOUR LAYOUT" text so it can be on one line */}
            <VStack
                width={"100%"}
                height={"100%"}
                paddingRight={stepNumber == 1 ? 0 : 16}
                paddingLeft={stepNumber == 1 ? 0 : 16}
                paddingBottom={12}
                alignItems={"left"}
            >
                {/* Title */}
                {currentInfo.curCard.stepNumber === 1 ? null : (
                    <HStack
                        fontStyle={"italic"}
                        position={"relative"}
                        textTransform={"uppercase"}
                        letterSpacing={2.5}
                        pt="60px"
                        pb="20px"
                    >
                        <Wrap>
                            <WrapItem>
                                <Heading color={"green.100"}>
                                    Step {stepNumber}:
                                </Heading>
                            </WrapItem>
                            <WrapItem>
                                <Heading color={"white"}>
                                    {
                                        cardCreationSteps![stepNumber - 1]
                                            .stepTitle
                                    }
                                </Heading>
                            </WrapItem>
                        </Wrap>
                    </HStack>
                )}

                {/* Content */}
                <VStack height={"100%"}>
                    {cardCreationSteps![stepNumber - 1].step}
                </VStack>

                {stepNumber !== 1 ? (
                    <>
                        {/* Bottom controls */}
                        <VStack
                            paddingTop={10}
                            paddingBottom={10}
                            align={"left"}
                        >
                            <ProgressBar
                                height={12}
                                progress={(stepNumber / numSteps) * 100}
                            />
                        </VStack>

                        <HStack gap={4}>
                            <BackButton
                                text={stepNumber === 1 ? "start over" : "Back"}
                                onClick={() => {
                                    if (stepNumber !== 1) {
                                        currentInfo.setCurCard({
                                            ...currentInfo.curCard,
                                            stepNumber: stepNumber - 1,
                                        });
                                        setStepNumber(stepNumber - 1);
                                    }
                                }}
                            />
                            <NextButton
                                text={stepNumber === 5 ? "submit" : "next"}
                                onClick={async () => {
                                    if (stepNumber !== 5) {
                                        currentInfo.setCurCard({
                                            ...currentInfo.curCard,
                                            stepNumber: stepNumber + 1,
                                        });
                                        setStepNumber(stepNumber + 1);
                                    } else {
                                        /*

										IF USER IS SIGNED IN, REDIRECT TO THE PRICING PAGE

										IF USER IS NOT SIGNED IN, REDIRECT TO THE SIGN IN PAGE

									*/

                                        // Set the submit button to loading
                                        setSubmitButtonLoading(true);

                                        // Get the current authenticated user
                                        const user =
                                            await auth.currentAuthenticatedUser();

                                        // Get the user's ID
                                        const userID = user.userId;
                                        // const result =
                                        await submitCardWithAuth({
                                            entireCardRef: entireCardRef,
                                            foregroundRef: foregroundRef,
                                            backgroundRef: backgroundRef,
                                            cardBackRef: cardBackRef,
                                            currentInfo: currentInfo,
                                            userID: userID,
                                        });

                                        // ! TODO: COMMENT THIS BACK IN
                                        // if(result === SubmitResult.GoToCheckout) {
                                        // 	router.push("/checkout");
                                        // } else if(result === SubmitResult.GoToSignup) {
                                        // 	router.push("/signup");
                                        // } else {
                                        // 	console.error("Error submitting card!");
                                        // 	setSubmitButtonLoading(false);
                                        // }
                                    }
                                }}
                                isDisabled={stepIsIncomplete()}
                                isLoading={submitButtonLoading}
                            />
                        </HStack>
                    </>
                ) : (
                    <Flex justify="center" mt="50px">
                        <NextButton
                            text={"Begin"}
                            isDisabled={stepIsIncomplete()}
                            onClick={() => {
                                currentInfo.setCurCard({
                                    ...currentInfo.curCard,
                                    stepNumber: stepNumber + 1,
                                });
                                setStepNumber(stepNumber + 1);
                            }}
                        />
                    </Flex>
                )}
            </VStack>
        </Box>
    );
}
