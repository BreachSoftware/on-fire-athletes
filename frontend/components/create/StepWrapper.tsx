/* eslint-disable no-undef */
"use client";

import { Box, HStack, Heading, VStack, Wrap, WrapItem, Flex } from "@chakra-ui/react";
import ProgressBar from "./ProgressBar";
import NextButton from "@/app/components/buttons/next_button";
import BackButton from "@/app/components/buttons/back_button";
import { useState } from "react";
import { useCurrentCardInfo, useCurrentCardInfoProperties } from "@/hooks/useCurrentCardInfo";
import TradingCardInfo, { PaymentStatus, TradeStatus } from "@/hooks/TradingCardInfo";
import { useRouter } from "next/navigation";
import html2canvas from "html2canvas";
import { b64toBlob, uploadAssetToS3 } from "./Step3";
import { useAuth } from "@/hooks/useAuth";
import { maskImageToCard, resize } from "../image_filters";
import CardMask from "../../public/card_assets/card-mask.png";
import CardMaskReverse from "../../public/card_assets/card-mask-reverse.png";
import { apiEndpoints } from "@backend/EnvironmentManager/EnvironmentManager";

interface StepWrapperProps {
	numSteps: number;
	cardCreationSteps?: { step: JSX.Element, stepTitle: string }[];
	entireCardRef: React.RefObject<HTMLDivElement>;
	cardBackRef: React.RefObject<HTMLDivElement>;
}

export enum SubmitResult {
	Success = 1,
	GoToCheckout = 2,
	GoToSignup = 3,
	Failure = 4,
}

/**
 * Submits the current card using useAuth and the current card ref.
 */
export async function submitCardWithAuth(
	entireCardRef: React.RefObject<HTMLDivElement>,
	cardBackRef: React.RefObject<HTMLDivElement>,
	currentInfo: useCurrentCardInfoProperties,
	userID: string,
) {

	if (entireCardRef.current === null || cardBackRef.current === null) {
		return SubmitResult.Failure;
	}

	// Get the current Unix timestamp
	const current_unix_time = Math.floor(Date.now() / 1000);

	const style = document.createElement("style");
	document.head.appendChild(style);
	// @ts-expect-error Changing this specific line makes the card get generated incorrectly.
	style.sheet?.insertRule("body > div:last-child img { display: inline-block; }");

	const canvas = await html2canvas(entireCardRef.current, { backgroundColor: null, scale: 2 });
	let cardImageBase64 = canvas.toDataURL("image/png", 1.0);

	const resizedMask = await resize(CardMask.src, 700, null);
	cardImageBase64 = await maskImageToCard(cardImageBase64, resizedMask);

	const resizedReversedMask = await resize(CardMaskReverse.src, 700, null);

	const cardBackCanvas = await html2canvas(cardBackRef.current, { backgroundColor: null, scale: 2 });
	let cardBackImageBase64 = cardBackCanvas.toDataURL("image/png", 1.0);
	cardBackImageBase64 = await maskImageToCard(cardBackImageBase64, resizedReversedMask);

	// Generate the filename for the card image
	let filename = "";
	if (userID === "") {
		// If the user is not signed in, generate a random filename
		const randomNumbers = `${Math.random() * 100000000000000000}`;
		filename = `${randomNumbers}-${current_unix_time}.png`;
	} else {
		// If the user is signed in, use their user ID in the filename
		filename = `${userID}-${current_unix_time}.png`;
	}

	await uploadAssetToS3(filename, await b64toBlob(cardImageBase64), "card", "image/png");
	await uploadAssetToS3(filename, await b64toBlob(cardBackImageBase64), "card-back", "image/png");

	currentInfo.setCurCard({
		...currentInfo.curCard,
		submitted: true,
		cardImage: `https://gamechangers-media-uploads.s3.amazonaws.com/card/${filename}`,
		cardBackS3URL: `https://gamechangers-media-uploads.s3.amazonaws.com/card-back/${filename}`,
	});
	currentInfo.curCard.cardImage = `https://gamechangers-media-uploads.s3.amazonaws.com/card/${filename}`;
	currentInfo.curCard.cardBackS3URL = `https://gamechangers-media-uploads.s3.amazonaws.com/card-back/${filename}`;
	currentInfo.curCard.submitted = true;
	currentInfo.curCard.paymentStatus = PaymentStatus.PENDING;
	currentInfo.curCard.tradeStatus = TradeStatus.TRADE_ONLY;

	// If the user is signed in
	if (userID !== "") {
		// Submit the card

		const myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");

		const raw = JSON.stringify({
			generatedBy: userID,
		});

		const requestOptions = {
			method: "POST",
			headers: myHeaders,
			body: raw,
		};
		let shouldSave = null;
		await fetch(apiEndpoints.getCreatedCards(), requestOptions)
			.then((response: Response) => {
				return response.json();
			})
			.then((result: string) => {
				shouldSave = result.length === 0;
				return;
			})
			.catch((error) => {
				return console.error(error);
			});

		// update the user profile if they are signed in and create a card Only on the first card
		if(shouldSave) {
			const cardRequestOptions : RequestInit = {
				method: "POST",
				headers: myHeaders,
				body: JSON.stringify({
					uuid: userID,
					team_hometown: currentInfo.curCard.teamName,
					position: currentInfo.curCard.position,
					last_name: currentInfo.curCard.lastName,
					generated: current_unix_time,
					first_name: currentInfo.curCard.firstName,
					bio: currentInfo.curCard.NFTDescription,
					avatar: null,
				}),
				// redirect: "follow"
			};

			await fetch(
				apiEndpoints.users_updateUserProfile(),
				cardRequestOptions) // change to prod when ready
				.then((response: Response) => {
					return response.text();
				})
				.then(() => {
					return;
				})
				.catch((error) => {
					return console.error(error);
				});
		}

		await TradingCardInfo.submitCard(currentInfo.curCard, userID);
		// Redirect to the pricing page
		return SubmitResult.GoToCheckout;
	}
	// Save the card and redirect to the sign-up page
	TradingCardInfo.saveCard(currentInfo.curCard);
	return SubmitResult.GoToSignup;
}

/**
 * The step wrapper for the creation process. Handles the progress bar and the back/next buttons for going through the steps
 * @param param0 StepWrapperProps
 * @returns the React component for the step wrapper
 */
export default function StepWrapper({ numSteps, cardCreationSteps, entireCardRef, cardBackRef }: StepWrapperProps) {

	const currentInfo = useCurrentCardInfo();

	const auth = useAuth();

	const [ stepNumber, setStepNumber ] = useState(currentInfo.curCard.stepNumber);

	/**
	 * Checks if the required fields are met.
	 */
	function stepIsIncomplete() {
		if (stepNumber === 1) {
			if (currentInfo.curCard.cardType !== "a" && currentInfo.curCard.cardType !== "b") {
				return true;
			}
			return false;
		}
		if (stepNumber === 2) {
			if (currentInfo.curCard.firstName.length < 1 ||
				currentInfo.curCard.lastName.length < 1 ||
				currentInfo.curCard.position.length < 1 ||
				currentInfo.curCard.teamName.length < 1) {
				return true;
			}
			return false;
		}
		if (stepNumber === 3) {
			if(currentInfo.curCard.frontPhotoURL != "") {
				return false;
			}
			return true;
		}
		return false;
	}

	const [ submitButtonLoading, setSubmitButtonLoading ] = useState(false);

	const router = useRouter();

	return (
		<Box backgroundColor={"transparent"} backdropBlur={30} w={"100%"} maxWidth={900} h="100%">
			{/* Step 1 has weird padding, espeically on mobile, to account for the "SELECT YOUR LAYOUT" text so it can be on one line */}
			<VStack width={"100%"} height={"100%"}
				paddingRight={ stepNumber == 1 ? 0 : 16 } paddingLeft={ stepNumber == 1 ? 0 : 16 } paddingBottom={12}
				alignItems={"left"}
			>
				{/* Title */}
				{currentInfo.curCard.stepNumber === 1 ? (
					null
				) : (
					<HStack fontStyle={"italic"} position={"relative"} textTransform={"uppercase"} letterSpacing={2.5} pt="60px" pb="20px">
						<Wrap>
							<WrapItem>
								<Heading color={"green.100"}>Step {stepNumber}:</Heading>
							</WrapItem>
							<WrapItem>
								<Heading color={"white"}>{cardCreationSteps![stepNumber - 1].stepTitle}</Heading>
							</WrapItem>
						</Wrap>
					</HStack>
				)}

				{/* Content */}
				<VStack height={"100%"}>
					{cardCreationSteps![stepNumber - 1].step}
				</VStack>

				{stepNumber !== 1 ?
					<>
						{/* Bottom controls */}
						<VStack paddingTop={10} paddingBottom={10} align={"left"}>
							<ProgressBar height={12} progress={stepNumber / numSteps * 100} />
						</VStack>

						<HStack gap={4}>
							<BackButton text={stepNumber === 1 ? "start over" : "Back"} onClick={() => {
								if (stepNumber !== 1) {
									currentInfo.setCurCard({
										...currentInfo.curCard,
										stepNumber: stepNumber - 1
									});
									setStepNumber(stepNumber - 1);
								}
							}} />
							<NextButton text={stepNumber === 5 ? "submit" : "next"} onClick={async() => {
								if (stepNumber !== 5) {
									currentInfo.setCurCard({
										...currentInfo.curCard,
										stepNumber: stepNumber + 1
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
									const user = await auth.currentAuthenticatedUser();

									// Get the user's ID
									const userID = user.userId;
									const result = await submitCardWithAuth(entireCardRef, cardBackRef, currentInfo, userID);

									if(result === SubmitResult.GoToCheckout) {
										router.push("/checkout");
									} else if(result === SubmitResult.GoToSignup) {
										router.push("/signup");
									} else {
										console.error("Error submitting card!");
										setSubmitButtonLoading(false);
									}

								}
							}} isDisabled={stepIsIncomplete()} isLoading={submitButtonLoading} />
						</HStack>
					</> :
					<Flex justify="center" mt="50px">
						<NextButton text={"Begin"}
							isDisabled={stepIsIncomplete()}
							onClick={() => {
								currentInfo.setCurCard({
									...currentInfo.curCard,
									stepNumber: stepNumber + 1
								});
								setStepNumber(stepNumber + 1);
							}}
						/>
					</Flex>
				}

			</VStack>
		</Box>
	);
}
