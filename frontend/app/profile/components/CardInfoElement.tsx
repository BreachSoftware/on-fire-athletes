import TrendingCard from "@/components/trending_now/TrendingCard";
import TradingCardInfo from "@/hooks/TradingCardInfo";
import { Button, Flex, Grid, Stack, Text } from "@chakra-ui/react";
import { Link } from "react-scroll";
import { TabName } from "./profileAlbumTab";
import SerializedTradingCard from "@/hooks/SerializedTradingCard";
import { useEffect, useState } from "react";

interface CardInfoElementProps {
	card: TradingCardInfo | SerializedTradingCard;
	currentCardYearCreated: number;
	currentUserId: string;
	setCurrentCard: (card: TradingCardInfo) => void;
	setCurrentSerializedCard?: (card: SerializedTradingCard) => void;
	privateView: boolean;
	onSendCardModalOpen: () => void;
	loginModalOpen: () => void;
	onAddToCollectionModalOpen: () => void;
	onBuyCardModalOpen: () => void;
	setViewCardClicked: (clicked: boolean) => void;
	tabName: string;
}

/**
 * The function that returns the card info element.
 * This is the box that has the card details and the price.
 * @returns the React component for the card info element
 */
export default function CardInfoElement(props: CardInfoElementProps) {

	const card = props.card instanceof SerializedTradingCard ? props.card.TradingCardInfo : props.card;

	const [ sendButtonPressed, setSendButtonPressed ] = useState(false);

	// Determine if the button should be disabled based on the current tab and card availability
	const buttonShouldBeDisabled =
		props.privateView ?
			props.tabName === TabName.Created && card.currentlyAvailable <= 0 :
			card.currentlyAvailable <= 0;
	const isBuyable = card.price !== 0 && card.currentlyAvailable > 0 && !props.privateView;

	// This useEffect is used to open the send card modal when the send button is pressed
	// The reason it exists is to let the currentCard state variable update before the mobile share link is generated
	useEffect(() => {
		if (sendButtonPressed) {
			props.onSendCardModalOpen();
			setSendButtonPressed(false);
		}
	}, [ sendButtonPressed, props ]);

	/**
	 * Focuses on the current card when the view card button or the card is clicked.
	 */
	function focusCurrentCard() {
		// Set the view card clicked to true
		props.setViewCardClicked(true);
		// If the card is a serialized card, set the current serialized card
		if (props.card instanceof SerializedTradingCard && props.setCurrentSerializedCard) {
			props.setCurrentSerializedCard(props.card);
		}
		// Set the current card
		props.setCurrentCard(card);
	}

	/**
	 * The UI for the action button.
	 */
	function actionButtonUI() {
		// If the button should be disabled, disable it
		if (buttonShouldBeDisabled) {
			return (
				<Button
					variant="next"
					my={{ base: "8px", lg: "0px" }}
					w="100%"
					_hover={{ width: "100%" }}
					isDisabled
				>
					<Text>CARD UNAVAILABLE</Text>
				</Button>
			);
		} else if (props.privateView) {
			// If the user is in private view and viewing the created or traded tab, show the send card button
			if (props.tabName === TabName.Created || props.tabName === TabName.Traded) {
				return (
					<Button
						variant="next"
						my={{ base: "8px", lg: "0px" }}
						w="100%"
						_hover={{ width: "100%" }}
						onClick={() => {
							props.setCurrentCard(card);
							setSendButtonPressed(true);
						}}
					>
						<Text>SEND MY CARD</Text>
					</Button>
				);
			}
			// If the user is viewing the bought tab, there should be no button
			return null;
		}

		// If the user is not in private view
		if (props.tabName === TabName.Created) {
			// If the user is viewing a buyable card, show the buy card button
			if (isBuyable) {
				return (
					<Button
						variant="next"
						my={{ base: "8px", lg: "0px" }}
						w="100%"
						_hover={{ width: "100%" }}
						onClick={() => {
							props.setCurrentCard(card);
							if (props.currentUserId) {
								props.onBuyCardModalOpen();
							} else {
								props.loginModalOpen();
							}
						}}
					>
						<Text>BUY CARD</Text>
					</Button>
				);
			}
			// If the user is viewing a non-priced card, show the add to collection button
			return (
				<Button
					variant="next"
					my={{ base: "8px", lg: "0px" }}
					w="100%"
					_hover={{ width: "100%" }}
					onClick={() => {
						props.setCurrentCard(card);
						if (props.currentUserId) {
							props.onAddToCollectionModalOpen();
						} else {
							props.loginModalOpen();
						}
					}}
				>
					<Text>ADD TO COLLECTION</Text>
				</Button>
			);
		}
		// If the user is viewing another user's traded or bought tab, there should be no button
		return null;
	}

	return (
		<Stack flexDirection={{ base: "column", xl: "row" }}>
			<Link activeClass="active" to="cardElement" spy={true} smooth={true} offset={-50} duration={500} width="200px">
				<TrendingCard passedInCard={card as unknown as TradingCardInfo} slim overrideCardClick={focusCurrentCard} />
			</Link>
			<Flex direction="column" ml={{ base: "0px", xl: "80px" }} justifyContent="space-between" maxWidth="400px" h="100%" gap="20px">
				<Flex direction="column">
					<Text
						fontFamily="Barlow Condensed"
						fontStyle="italic"
						color="green.800"
						mb="4px"
						letterSpacing="0.75px"
					>CARD DETAILS</Text>
					<Text noOfLines={{ base: 2, xl: 1 }} mb={{ base: "8px", xl: "0px" }}>{card.NFTDescription}</Text>
				</Flex>
				<Grid
					templateColumns="3fr 5fr"
					templateRows="repeat(1, 1fr)"
					alignItems="center"
					w={{ base: "100%", xl: "400px" }}
					gap="12px"
					fontSize="18px"
					color="white"
					mb="8px"
				>
					{card.price !== 0 ?
						<>
							<Text>Price</Text><Text bgColor="gray.600" py="8px" px="20px">${card.price.toFixed(2)}</Text>
						</> : null}
					{props.card instanceof SerializedTradingCard ?
						<>
							<Text>Card Number</Text>
							<Text bgColor="gray.600" py="8px" px="20px">{props.card.serialNumber} of {card.totalCreated}</Text>
						</> :
						<>
							<Text>Cards Available</Text><Text
								bgColor="gray.600"
								py="8px"
								px="20px">
								{card.currentlyAvailable}/{card.totalCreated}
							</Text>
						</>
					}
					<Text>Year Created</Text>
					<Text bgColor="gray.600" py="8px" px="20px">{props.currentCardYearCreated}</Text>
				</Grid>
				<Flex mr={"5%"} alignSelf="center" direction={{ base: "column", lg: "row" }}>
					{actionButtonUI()}
					<Link activeClass="active" to="cardElement" spy={true} smooth={true} offset={-50} duration={500} width="200px">
						<Button
							variant="back"
							ml={{ base: "0px", lg: "20px" }}
							color="white"
							_hover={{ md: { shadow: "0px 0px 5px #27CE00" } }}
							onClick={() => {
								focusCurrentCard();
							}}>
							<Text>VIEW CARD</Text>
						</Button>
					</Link>
				</Flex>
			</Flex>
		</Stack>
	);
}
