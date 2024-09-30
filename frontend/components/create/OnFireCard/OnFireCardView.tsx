// eslint-disable-next-line no-use-before-define
import React from "react";
import { Image } from "@chakra-ui/react";

import TradingCardInfo from "@/hooks/TradingCardInfo";

// Use this enum to determine the zIndex of the elements on the card
enum zIndex {
	background = 1,
	petch = 2,
	hero = 3,
	signature = 4,
	text = 5,
	border = 6,
	cardBackVideo = 7,
}

type PrerenderedGamecardFrontImageProps = {
	shouldAnimate: boolean;
	cardHover: boolean;
	firstTimeAnimation: boolean;
	cardTopAnimation: string;
	card: TradingCardInfo;
}

/**
	 * The function that displays an image if the card is slim
	 * @returns The Image to show for the front of the gamecard
	 */
function PrerenderedGamecardFrontImage(
	{
		shouldAnimate,
		cardHover,
		firstTimeAnimation,
		cardTopAnimation,
		card,
	}: PrerenderedGamecardFrontImageProps
) {
	return(
		<Image
			animation={shouldAnimate && (cardHover || firstTimeAnimation) ? cardTopAnimation : "translate(0);"}
			src={`${card.cardImage}`}
			alt={`${card.firstName} ${card.lastName}`}
			maxWidth={"350px"}
			zIndex={zIndex.border}
			position={"absolute"}
			draggable={false}
			style={{ pointerEvents: "none" }}
		/>
	);
}

type PrerenderedGamecardBackImageProps = {
	shouldAnimate: boolean;
	cardHover: boolean;
	firstTimeAnimation: boolean;
	cardBackAnimation: string;
	card: TradingCardInfo;
}

/**
	 * The function that displays a back image if the card is slim
	 * The image comes from the S3 bucket
	 * @returns The Image to show for the back of the gamecard
	 */
function PrerenderedGamecardBackImage({
	shouldAnimate,
	cardHover,
	firstTimeAnimation,
	cardBackAnimation,
	card,
}: PrerenderedGamecardBackImageProps) {
	return(
		<Image
			animation={shouldAnimate && (cardHover || firstTimeAnimation) ? cardBackAnimation : "translate(0);"}
			src={`${card.cardBackS3URL}`}
			alt={`Back of ${card.firstName} ${card.lastName}'s card`}
			maxWidth={"350px"}
			zIndex={zIndex.background}
			position={"absolute"}
			transition={"filter 1s ease-in"}
			draggable={false}
			style={{ pointerEvents: "none" }}
		/>
	);
}


type OnfireCardProps = {
	card: TradingCardInfo;
	cardFrontRef?: React.RefObject<HTMLDivElement>;
	cardForegroundRef?: React.RefObject<HTMLDivElement>;
	cardBackgroundRef?: React.RefObject<HTMLDivElement>;
	cardBackRef?: React.RefObject<HTMLDivElement>;
	showShadow?: boolean;
	showButton?: boolean;
	slim? : boolean;
	shouldFlipOnClick?: boolean;
	mobileFlipButton?: boolean;
};

export default function OnFireCardView({
	card,
	cardFrontRef,
	cardForegroundRef,
	cardBackgroundRef,
	cardBackRef,
	showShadow,
	showButton,

}) {
	return (
		<>
			<CardMask />
		</>
	);
}
