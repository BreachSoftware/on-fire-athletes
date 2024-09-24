import { Button, Stack, Center, Heading, VStack, useToast } from "@chakra-ui/react";
import { fetchAllCards } from "@/app/lockerroom/components/FetchAllCards";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BeatLoader } from "react-spinners";
import ChevronRightIcon from "../icons/chevron-right";
import TrendingNowCarousel from "./TrendingCarousel";
import TrendingCard from "./TrendingCard";
// import TrendingNowCarousel from "./TrendingCarousel";

/**
 * Section of the home page that displays the cards that are currently trending.
 *
 * @returns {JSX.Element} The rendered trending now component.
 */
export default function TrendingNow() {
	// State variables to store the cards
	const [ cards, setCards ] = useState([]);
	const [ buttonClicked, setButtonClicked ] = useState(false);
	const toast = useToast();
	const router = useRouter();

	useEffect(() => {
		fetchAllCards()
			.then((fetchedCards) => {
				setCards(fetchedCards.slice(0, 4));
			})
			.catch((error) => {
				console.error("Error fetching Trending Cards:", error);
				toast({
					title: "Error",
					description: "Failed to load cards. Please try again.",
					status: "error",
					duration: 5000,
					isClosable: true,
					position: "bottom-right",
				});
			});
	}, [ toast ]);

	return (
		<>
			<Center
				flexDir="column"
				backgroundImage={"url('/darkpaper.png')"}
				backgroundRepeat="no-repeat"
				backgroundSize="100% 101%" // The 101% is to fix a small gap at the bottom of the image
				backgroundPosition={"center top"}
				width={"100%"}
				alignItems={"center"}
				pt={32}
				px={{ base: "24px", md: "64px", lg: "100px" }}
				pb={{ base: 0, md: 12 }}>
				<VStack spacing={0} mb={{ base: 4, md: 12 }}>
					<Heading
						fontFamily={"Barlow Condensed"}
						lineHeight={0}
						fontSize={{ base: "40px", lg: "60px" }}
						letterSpacing={"3px"}
						fontWeight={"bold"}
						textTransform={"uppercase"}
						color={"green.100"}>
						Sports Cards
					</Heading>
					<Heading
						color={"white"}
						mt={{ base: "none", md: "8px" }}
						fontSize={{ base: "52px", lg: "80px" }}
						letterSpacing={0}
						fontWeight="normal"
						lineHeight="103px"
						fontFamily={"Brotherhood, sans-serif"}>
						Trending Now
					</Heading>
				</VStack>
				<Stack
					display={{ base: "none", lg: "flex" }}
					direction="row"
					gap={10}
					flexWrap={"wrap"}
					justifyContent={"center"}
					w="full"
					px={"16px"}>
					{cards.map((card, index) => {
						return <TrendingCard key={index} passedInCard={card} shouldShowButton={true} />;
					})}
				</Stack>
				<TrendingNowCarousel cards={cards} />
				<Button
					_hover={{
						md: {
							backgroundColor: "green.300",
							color: "white",
							fontStyle: "italic",
						},
					}}
					backgroundColor={"green.100"}
					letterSpacing={"2px"}
					width="233px"
					height="44px"
					color={"white"}
					my={16}
					fontSize={14}
					textTransform={"uppercase"}
					fontFamily={"Barlow"}
					onClick={() => {
						setButtonClicked(true);
						router.push("/lockerroom");
					}}
					rightIcon={<ChevronRightIcon fontSize="lg" />}
					isLoading={buttonClicked}
					spinner={<BeatLoader size={8} color="white" />}>
					Start Collecting
				</Button>
			</Center>
		</>
	);
}
