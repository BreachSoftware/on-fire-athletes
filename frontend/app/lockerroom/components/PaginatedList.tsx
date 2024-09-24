// eslint-disable-next-line no-use-before-define
import React from "react";
/* eslint-disable func-style */
import { useState, useEffect } from "react";
import { Box, BoxProps, Center, GridItem, SimpleGrid, Text, useBreakpointValue } from "@chakra-ui/react";
import TrendingCard, { defaultTrendingCardWidth, pixelsToShaveOffOfEachSide } from "@/components/trending_now/TrendingCard";
import TradingCardInfo from "@/hooks/TradingCardInfo";
import PaginationNavigator from "./PaginationNavigator";
import { setWithExpiry } from "@/components/localStorageFunctions";
import SerializedTradingCard from "@/hooks/SerializedTradingCard";

interface ProfilePageProps {
	currentCard?: TradingCardInfo;
	setCurrentCard?: (card: TradingCardInfo) => void;
	setViewCardClicked?: (clicked: boolean) => void;
	setCurrentSerializedCard?: (card: SerializedTradingCard) => void;
	tabName?: string;
	currentUserId?: string;
	onSendCardModalOpen?: () => void;
	loginModalOpen?: () => void;
	onAddToCollectionModalOpen?: () => void;
	privateView?: boolean;
  }

  interface PaginatedListProps extends BoxProps {
	itemsPerPage: number;
	data: TradingCardInfo[] | SerializedTradingCard[];
	targetRef: React.RefObject<HTMLDivElement>;
	currentPage: number;
	setCurrentPage: (page: number) => void;
	profilePage?: boolean;
	profilePageProps?: ProfilePageProps;
  }

/**
 * Generates a paginatied list of TrendingCard components.
 * @param itemsPerPage - Number of items per page.
 * @param data - Array of TradingCardInfo objects.
 * @param targetRef - Reference to the target element.
 * @param currentPage - The current page.
 * @param setCurrentPage - Function to set the current page.
 * @param profilePage - Whether the page is a profile page.
 * @param currentCard - The current card of the profile page to be passed off to TrendingCard.
 * @param setCurrentCard - Function to set the current card of the profile page to be passed off to TrendingCard.
 * @param setViewCardClicked - Function to set the view card clicked on the profile page. This will be passed off to TrendingCard.
 * @param setCurrentSerializedCard - Function to set the current serialized card of the profile page to be passed off to TrendingCard.
 * @param tabName - The tab name of the profile page. This will be passed off to TrendingCard.
 * @param currentUserId - The current user ID of the profile page. This will be passed off to TrendingCard.
 * @param onSendCardModalOpen - Function to open the send card modal on the profile page. This will be passed off to TrendingCard.
 * @param loginModalOpen - Function to open the login modal on the profile page. This will be passed off to TrendingCard.
 * @param onAddToCollectionModalOpen - Function to open the add to collection modal on the profile page. This will be passed off to TrendingCard.
 * @param privateView - Whether the view is private or not. This will be passed off to TrendingCard.
 * @returns {JSX.Element} The paginated list component.
 */
export default function PaginatedList({
	itemsPerPage,
	data,
	targetRef,
	currentPage,
	setCurrentPage,
	profilePage = false,
	profilePageProps,
	...rest
}: PaginatedListProps) {


	const [ isPageFlipping, setIsPageFlipping ] = useState(false);
	const [ customTrendingCardWidth, setCustomTrendingCardWidth ] = useState<number|null>(null);
	const [ numColumnsInGrid, setNumColumnsInGrid ] = useState<number>(3);

	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

	const totalPages = Math.ceil(data.length / itemsPerPage);

	const noCardMessageBoxWidth = useBreakpointValue({ base:"50vw", md:"30%" });

	const parentStackRef = React.useRef<HTMLDivElement>(null);

	const handleClick = (page: number) => {
		setIsPageFlipping(true);
		setCurrentPage(page);
		setWithExpiry("lastPaginationPage", page.toString(), 24); // Save the page to local storage with a 24 hour expiry
		setTimeout(() => {
			setIsPageFlipping(false);
		}, 1000);
	};

	const isMobile = useBreakpointValue({ base: true, md: false });

	// Padding for in between cards in pixels
	const paddingForCard = 21;

	/**
	 * Focuses on the current card when the view card button or the card is clicked.
	 */
	function focusCurrentCard(card: TradingCardInfo | SerializedTradingCard) {
		if (profilePageProps && profilePageProps.setViewCardClicked && profilePageProps.currentCard) {
			// Set the view card clicked to true
			profilePageProps.setViewCardClicked(true);
			// If the card is a serialized card, set the current serialized card
			if (card instanceof SerializedTradingCard && profilePageProps.setCurrentSerializedCard) {
				profilePageProps.setCurrentSerializedCard(card);
			} else if (profilePageProps.setCurrentCard) {
				// Set the current card
				profilePageProps.setCurrentCard!(card as TradingCardInfo);
			}
		}
	}

	useEffect(() => {
		if (currentPage > totalPages) {
			setCurrentPage(1);
			localStorage.setItem("lastPaginationPage", "1");
		}

	}, [ currentItems, currentPage, totalPages, setCurrentPage ]);

	// Scroll to the top of the page when the page changes
	useEffect(() => {
		if (targetRef.current) {

			// If we are on the first page and didnt navigate backwards, dont scroll
			if (currentPage === 1 && !isPageFlipping) {
				return;
			}

			targetRef.current.scrollIntoView({ behavior: "smooth" });

		}
	}, [ currentPage, targetRef, isPageFlipping ]);

	useEffect(() => {

		let numCardsPerRow = 3;
		let minWidthOfCardsOnScreen = 0, widthOfPaddingOnScreen = 0;

		/**
		 * function that functions
		 */
		function recalculateWidths() {
			minWidthOfCardsOnScreen = ((defaultTrendingCardWidth - 2 * pixelsToShaveOffOfEachSide) * numCardsPerRow);
			widthOfPaddingOnScreen = paddingForCard * (numCardsPerRow - 1);
		}

		/**
		 * Handles resizing of the trending cards.
		 */
		function handleResize() {
			if(isMobile) {
				setCustomTrendingCardWidth(null);
			} else if (parentStackRef.current) {
				const parentWidth = parentStackRef.current.offsetWidth;
				recalculateWidths();
				if(parentWidth <= (minWidthOfCardsOnScreen - widthOfPaddingOnScreen)) {
					numCardsPerRow = 2;
					recalculateWidths();
					if(parentWidth <= (minWidthOfCardsOnScreen - widthOfPaddingOnScreen)) {
						numCardsPerRow = 1;
					}
				}
				setNumColumnsInGrid(numCardsPerRow);

				const cardWidthBeforeShaving = parentStackRef.current.offsetWidth / numCardsPerRow - paddingForCard * (numCardsPerRow - 1);
				setCustomTrendingCardWidth(cardWidthBeforeShaving);
			}
		}

		handleResize(); // Calculate on mount
		window.addEventListener("resize", handleResize); // Recalculate on window resize

		return () => {
			return window.removeEventListener("resize", handleResize);
		}; // Cleanup on unmount
	});

	return (
		<Box
			minWidth="100%"
			paddingBottom={24}
			{...rest}
		>
			<SimpleGrid
				ref={parentStackRef}
				columns={numColumnsInGrid}
				spacing={paddingForCard * 2}
				alignItems={"top"}
				minWidth="100%"
				width={profilePage ? "65vw" : undefined}
				// Set the max width of the grid to the number of columns times the width of the card plus the padding between the cards
				maxWidth={numColumnsInGrid * defaultTrendingCardWidth + (paddingForCard * 2) * (numColumnsInGrid - 1)}
				justifyContent={{ base: "center", md: "start" }} // Center on mobile, start on larger screens
				// Flex and flexwrap needed for mobile screens
				flexWrap={{ base: "wrap", md: "nowrap" }}
				display={{ base: "flex", md: "grid" }}
			>
				{currentItems.map((card, index) => {
					return (
						<GridItem key={index}>
							<TrendingCard
								isPageFlipping={isPageFlipping}
								passedInCard={card}
								shouldShowButton={isMobile}
								overrideCardClick={profilePage ? focusCurrentCard : undefined}
								trendingCardWidth={customTrendingCardWidth}
								onProfilePage={profilePage}
								tabName={profilePage ? profilePageProps?.tabName : undefined}
								currentUserId={profilePageProps?.currentUserId}
								setCurrentCard={profilePageProps?.setCurrentCard}
								onSendCardModalOpen={profilePageProps?.onSendCardModalOpen}
								loginModalOpen={profilePageProps?.loginModalOpen}
								onAddToCollectionModalOpen={profilePageProps?.onAddToCollectionModalOpen}
								privateView={profilePageProps?.privateView}
							/>
						</GridItem>
					);
				})}
			</SimpleGrid>
			{data.length !== 0 ?
				<PaginationNavigator currentPage={currentPage} totalPages={totalPages} handleClick={handleClick} /> :
				<Center pt="100px">
					<Box w={noCardMessageBoxWidth} h="100px" bg="gray.1000" alignContent={"center"} borderRadius="10px">
						<Text textAlign="center" color="white.1500" fontFamily="Barlow Condensed" fontSize="20px">No cards to show!</Text>
					</Box>
				</Center>
			}
		</Box>
	);
};
