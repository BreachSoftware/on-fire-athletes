"use client";
/* eslint-disable no-undef */
import { useAuth } from "@/hooks/useAuth";
import { Box, Flex, useBreakpointValue, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import TradingCardInfo from "@/hooks/TradingCardInfo";
import { useRouter } from "next/navigation";
import { useCurrentCardInfo } from "@/hooks/useCurrentCardInfo";
import profileInfo from "@/interfaces/profileInfo";
import { checkForTrade } from "@/components/checkForTrade";
import LoginUI from "@/components/loginUI";
import Sidebar from "@/components/sidebar";
import NavBar from "../navbar";
import LoginHeader from "../components/loginHeader";

/**
 * The login page component.
 * @returns the login page
 */
export default function LoginPage() {

	const auth = useAuth();
	const toast = useToast();
	const router = useRouter();
	const card = useCurrentCardInfo();

	const [ checkingForTrade, setCheckingForTrade ] = useState(true);

	const info: profileInfo = {
		firstName: card.curCard.firstName,
		lastName: card.curCard.lastName,
		position: card.curCard.position,
		teamName: card.curCard.teamName,
		NFTDescription: card.curCard.NFTDescription,
		frontPhotoS3URL: card.curCard.frontPhotoS3URL,
	};
	let generatedByUUID: string | null = "";
	let cardSentUUID: string | null = "";
	let senderUUID: string | null = "";
	let toNewOwnUUID: string | null = "";
	let requested: string | null = "";

	if (typeof window !== "undefined") {
		const queryParams = new URLSearchParams(window.location.search);

		generatedByUUID = queryParams.get("generatedByUUID");
		cardSentUUID = queryParams.get("cardUUID");
		toNewOwnUUID = queryParams.get("toUUID");
		senderUUID = queryParams.get("fromUUID");
		requested = queryParams.get("requested");
	}

	/**
	 * This useEffect is used to check if the user is already authenticated.
	 * If they are, it will check if they are trying to trade a card.
	 *
	 * It mainly allows the user to trade a card if they are already authenticated.
	 */
	useEffect(() => {

		const card = TradingCardInfo.loadCard();
		if (card) {
			// If the unix time of the card is more than 1 day old, remove the card
			const currentTime = new Date().getTime() / 1000;
			const cardTime = card.createdAt;
			if (currentTime - cardTime > 86400000) {
				TradingCardInfo.clearCard();
				setCheckingForTrade(true);
				checkForTrade(generatedByUUID, cardSentUUID, senderUUID, toNewOwnUUID, requested, auth, toast);
				setCheckingForTrade(false);
			}
		} else {
			setCheckingForTrade(true);
			checkForTrade(generatedByUUID, cardSentUUID, senderUUID, toNewOwnUUID, requested, auth, toast);
			setCheckingForTrade(false);
		}

	// We don't need to re-run this effect when the toast function changes
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ generatedByUUID, cardSentUUID, toNewOwnUUID, senderUUID, requested ]);

	const showSidebar = useBreakpointValue(
		{
			base: false,
			lg: true,
		}
	);

	/**
	 * This handles the form submission when the Enter key is pressed or the sign in button is clicked.
	 * This also handles if there are trading parameters in the URL.
	 * @param username - the username
	 * @param password - the password
	 * @returns a boolean indicating if the sign in was successful
	 */
	async function signInClicked(username: string, password: string) : Promise<boolean> {
		let res = { success: false, message: "" };
		if (username === "" || password === "") {
			throw new Error("Username or password is empty");
		}
		try {
			res = await auth.signIn(username, password, info);
		} catch (error) {
			toast({
				title: "Error signing in",
				description: "There was an error signing in. Please try again.",
				status: "error",
				duration: 9000,
				isClosable: true,
				position: "bottom-left"
			});

			return false;
		}

		const card = TradingCardInfo.loadCard();
		if (res.success) {
			// If the user has a card in local storage, save it to the database
			if (card) {
				const user = await auth.currentAuthenticatedUser();
				const userID = user.userId;
				if (userID !== "") {
					// Redirect to the pricing page
					TradingCardInfo.submitCard(card, userID).then(() => {
						window.location.href = "/checkout";
					});
				}
			} else if (!checkingForTrade) {
				setCheckingForTrade(true);
				checkForTrade(generatedByUUID, cardSentUUID, senderUUID, toNewOwnUUID, requested, auth, toast);
				setCheckingForTrade(false);
			}
			return true;
		} else if (res.message === "There is already a signed in user") {
			// If the user has a card in local storage, save it to the database
			if (card) {
				const user = await auth.currentAuthenticatedUser();
				const userID = user.userId;
				if (userID !== "") {
					// Redirect to the pricing page
					TradingCardInfo.submitCard(card, userID).then(() => {
						window.location.href = "/checkout";
					});
				}
			} else {
				// redirect to the home page
				window.location.href = "/";
			}
			return true;
		}
		console.error("Error signing in:", res.message);
		toast({
			title: "Error signing in",
			description: "Incorrect username or password",
			status: "error",
			duration: 9000,
			isClosable: true,
			position: "bottom-left"
		});
		return false;
	}

	/**
 	 * Redirects to the sign up page, but also retains the query parameters if they exist.
 	 */
	function checkSignupQueryPrams() {
		if (generatedByUUID && cardSentUUID && senderUUID) {
			router.push(`/signup?generatedByUUID=${generatedByUUID}&cardUUID=${cardSentUUID}`);
		} else {
			router.push("/signup");
		}
	}

	return (
		<>
			<Flex
				w="100%"
				// This truly fills the entire page for mobile devices
				minH="100vh"
				h={{ base: "100%", md: "100vh" }}
				justify="flex-start"
				direction="row-reverse"
				bgImage={"darkpaper.png"}
				bgPosition={"center"}
				bgRepeat={"no-repeat"}
				bgSize={"cover"}
			>
				{showSidebar ? <Sidebar height="100vh" /> : null}
				<Box w={"100%"}>
					<NavBar />
					<LoginHeader title={"Sign in"} subtitle="Sign into your account to get started!" />
					<LoginUI signInClicked={signInClicked} onClick={checkSignupQueryPrams} router={router} />
				</Box>
			</Flex>

		</>
	);
}

