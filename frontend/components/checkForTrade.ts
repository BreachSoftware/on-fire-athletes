import { tradeCard } from "@/hooks/tradeCardFunc";
import { useAuthProps } from "@/hooks/useAuth";
import { ToastId, UseToastOptions } from "@chakra-ui/react";

/**
 * Checks to see if the user is logged in and attempting to trade a card.
 * If the user is logged in and attempting to receive a card, the trade will be initiated.
 * Additionally, if the user is logged in and authorizing a card to be traded, the trade will be initiated.
 * @param generatedByUUID - the UUID of the card that was generated
 * @param cardSentUUID - the UUID of the card that was sent
 * @param senderUUID - the UUID of the sender
 * @param toNewOwnUUID - the UUID of the receiver
 * @param requested - boolean indicating if the card was requested
 * @param auth - the authentication information
 * @param toast - the toast function
 * @returns void
 */
export async function checkForTrade(generatedByUUID: string | null, cardSentUUID: string | null, senderUUID: string | null,
	toNewOwnUUID: string | null, requested: string | null, auth: useAuthProps, toast: (options: UseToastOptions) => ToastId | undefined) {

	try {
		const { username } = await auth.currentAuthenticatedUser();
		if (username) {
			if (generatedByUUID && cardSentUUID && senderUUID) {
				// Check if the signed in user is receiving a card
				// If not, check if the signed in user is allowing a card to be traded
				// If not, sign up / sign in as usual
				if (toNewOwnUUID && toNewOwnUUID != username && !requested) {
					await auth.signOut();
					window.location.reload();
				} else if (generatedByUUID !== username && toNewOwnUUID && requested === "true") {
					await auth.signOut();
					window.location.reload();
				} else if (generatedByUUID === username && toNewOwnUUID && requested === "true") {
					tradeCard(generatedByUUID, cardSentUUID, senderUUID, toNewOwnUUID).then((result) => {
						if (result?.status == 200) {
							const toastDisplayTime = 5000;
							toast({
								title: "Card Succesfully Traded",
								description: "The card has been successfully traded. Redirecting you to their profile...",
								status: "success",
								duration: toastDisplayTime,
								isClosable: true,
								position: "bottom-left"
							});
							// Wait for the toast to finish before redirecting
							setTimeout(() => {
								window.location.href = `/profile?user=${toNewOwnUUID}&card=${cardSentUUID}&tab=traded`;
							}, toastDisplayTime);
						} else if (result?.status == 403) {
							console.error("User already has card");

							const toastDisplayTime = 5000;
							toast({
								title: "Error trading card",
								description: "The recipient already has this card. Redirecting you to the card...",
								status: "error",
								duration: toastDisplayTime,
								isClosable: true,
								position: "bottom-left"
							});
							// Wait for the toast to finish before redirecting
							setTimeout(() => {
								window.location.href = `/profile?user=${toNewOwnUUID}&card=${cardSentUUID}&tab=traded`;
							}, toastDisplayTime);
						} else {
							console.error("Error trading card");

							const toastDisplayTime = 8000;
							toast({
								title: "Error trading card",
								description: "An error occurred while trading the card. Verify that the card is still available." +
								" Redirecting you to the home page...",
								status: "error",
								duration: toastDisplayTime,
								isClosable: true,
								position: "bottom-left"
							});

							// Wait for the toast to finish before redirecting
							setTimeout(() => {
								window.location.href = "/";
							}, toastDisplayTime);
						}
					});
				} else {
					tradeCard(generatedByUUID, cardSentUUID, senderUUID, username).then((result) => {
						if (result?.status == 200) {
							toast({
								title: "Card Succesfully Traded",
								description: "The card has been successfully traded. Redirecting you to the card...",
								status: "success",
								duration: 5000,
								isClosable: true,
								position: "bottom-left"
							});
							setTimeout(() => {
								window.location.href = `/profile?user=${username}&card=${cardSentUUID}&tab=traded`;
							}, 5000);
						} else if (result?.status == 403) {
							console.error("User already has card");

							const toastDisplayTime = 5000;
							toast({
								title: "Error trading card",
								description: "You already have this card. Redirecting you to the card...",
								status: "error",
								duration: toastDisplayTime,
								isClosable: true,
								position: "bottom-left"
							});
							// Wait for the toast to finish before redirecting
							setTimeout(() => {
								window.location.href = `/profile?user=${username}&card=${cardSentUUID}&tab=traded`;
							}, toastDisplayTime);
						} else {
							console.error("Error trading card");

							const toastDisplayTime = 8000;
							toast({
								title: "Error trading card",
								description: "An error occurred while trading the card. Verify that the card is still available." +
								" Redirecting you to the home page...",
								status: "error",
								duration: toastDisplayTime,
								isClosable: true,
								position: "bottom-left"
							});

							// Wait for the toast to finish before redirecting
							setTimeout(() => {
								window.location.href = "/";
							}, toastDisplayTime);
						}
					});
				}
			} else {
				window.location.href = "/";
			}
		}
	} catch (error) {
		console.error("Error checking authentication:", error);
	}
};
