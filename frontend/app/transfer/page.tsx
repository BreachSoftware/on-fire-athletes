"use client";

import { Box, Flex, HStack, Spinner, Text, VStack } from "@chakra-ui/react";
// import { useToast } from "@chakra-ui/react";
import NavBar from "../navbar";
import Sidebar from "@/components/sidebar";
// import { useEffect } from "react";
// import { retrievePaymentStatus } from "../lockerroom/components/retrievePaymentStatus";
// import { tradeBoughtCard } from "@/hooks/buyCardFunc";

/**
 * This componenet is used as a visual placeholder while a card is being transferred from one account to another.
 * @returns {JSX.Element} The TransferPage component
 */
export default function TransferPage() {

	// Commented out because it is not used and to prevent the linter from complaining
	// const toast = useToast();

	// useEffect(() => {

	// 	/**
	// 	 * Checks for the payment intent in the URL and retrieves the payment status
	// 	 */
	// 	async function checkForPaymentIntent() {
	// 		if (typeof window !== "undefined") {
	// 			const queryParams = new URLSearchParams(window.location.search);
	// 			const paymentIntnetID = queryParams.get("payment_intent");
	// 			if (paymentIntnetID) {
	// 				const status = await retrievePaymentStatus(paymentIntnetID);
	// 				if (status === "succeeded") {
	// 					// Extract the cardUUID, senderUUID, and newOwnUUID from the localStorage
	// 					const cardUUID = localStorage.getItem("cardUUID");
	// 					const generatedByUUID = localStorage.getItem("generatedByUUID");
	// 					const price = localStorage.getItem("cardPrice");
	// 					const senderUUID = localStorage.getItem("senderUUID");
	// 					const receiverUUID = localStorage.getItem("newOwnUUID");

	// 					// Trade the card
	// 					const result = await tradeBoughtCard(cardUUID!, generatedByUUID!, Number(price), senderUUID!, receiverUUID!);
	// 					if (result?.ok) {
	// 						localStorage.removeItem("cardUUID");
	// 						localStorage.removeItem("generatedByUUID");
	// 						localStorage.removeItem("cardPrice");
	// 						localStorage.removeItem("senderUUID");
	// 						localStorage.removeItem("newOwnUUID");

	// 						// Redirect to the profile of the user who bought the card
	// 						window.location.href = `/profile?user=${receiverUUID}&card=${cardUUID}&tab=bought`;
	// 					} else if (result?.status === 403) {
	// 						console.error("There was an error transferring the card. You may already own this card.");
	// 						toast({
	// 							title: "Error",
	// 							description: "There was an error transferring the card. You may already own this card. Redirecting you back to the card...",
	// 							status: "error",
	// 							duration: 5000,
	// 							isClosable: true,
	// 						});
	// 						// Leave a few seconds for the user to read the error message
	// 						setTimeout(() => {
	// 							window.history.back();
	// 						}, 5000);
	// 					} else {
	// 						console.error("There was an error transferring the card. Please try again later.");
	// 						toast({
	// 							title: "Error",
	// 							description: "There was an error transferring the card. Redirecting you back to the card...",
	// 							status: "error",
	// 							duration: 5000,
	// 							isClosable: true,
	// 						});
	// 						// Leave a few seconds for the user to read the error message
	// 						setTimeout(() => {
	// 							window.history.back();
	// 						}, 5000);
	// 					}
	// 				} else {
	// 					console.error("There was a problem with the purchasing of the card. Please try again later.");
	// 					toast({
	// 						title: "Error",
	// 						description: "There was a problem with the purchasing of the card. Redirecting you back to the card...",
	// 						status: "error",
	// 						duration: 5000,
	// 						isClosable: true,
	// 					});
	// 					// Leave a few seconds for the user to read the error message
	// 					setTimeout(() => {
	// 						window.history.back();
	// 					}, 5000);
	// 				}
	// 			}
	// 		}
	// 	}

	// 	checkForPaymentIntent();
	// }, [ toast ]);

	return (
		<>
			<Box
				bgGradient={
					"linear(180deg, #000000 0%, #203030 100%) 0% 0% no-repeat padding-box;"
				}
				minH={"100vh"}
				w={"100vw"}
			>
				<HStack alignItems={"top"} width={"100%"} height={"100vh"}>
					<VStack flexGrow={1}>
						<Box width={"100%"}>
							<NavBar />
						</Box>

						<Flex
							width={"100%"}
							height={"100%"}
							justifyContent={"center"}
							alignItems={"center"}
							flexDirection={"column"}
							gap="50px"
						>
							<Spinner w="150px" h="150px" />
							<Text color={"white"} fontSize={"24px"} fontWeight={"bold"}>
								Transferring your card...
							</Text>
						</Flex>
					</VStack>
					<Box display={{ base: "none", sm: "none", md: "inherit" }}>
						<Sidebar backgroundPresent={false} />
					</Box>
				</HStack>
			</Box>
		</>
	);
}

