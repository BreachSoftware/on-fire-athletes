import TradingCardInfo from "@/hooks/TradingCardInfo";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Text, Flex, Button, useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CardActionModal } from "./cardActionModal";

interface BuyCardModalProps {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
	currentCard: TradingCardInfo;
	fromName: string;
	currentUserId: string;
}

/**
 * This component is a modal that prompts the user if they want to buy a card from another user.
 * @param props - The props for this component.
 * @returns The BuyCardModal component.
 */
export default function BuyCardModal(props: BuyCardModalProps) {

	const [ showPaymentUI, setShowPaymentUI ] = useState(false);
	const areYouSure = useDisclosure();
	const router = useRouter();

	// Executes when showPaymentUI is true
	useEffect(() => {

		if (showPaymentUI) {
			// Saves the card information to local storage
			TradingCardInfo.saveCard(props.currentCard);

			// Redirect the user to the payment page
			router.push("/checkout?buyingOtherCard=true");
		}

		// if (showPaymentUI) {
		// 	localStorage.setItem("cardUUID", props.currentCard.uuid);
		// 	localStorage.setItem("generatedByUUID", props.currentCard.generatedBy);
		// 	localStorage.setItem("senderUUID", props.currentCard.generatedBy);
		// 	localStorage.setItem("newOwnUUID", props.currentUserId);
		// 	localStorage.setItem("cardPrice", props.currentCard.price.toString());
		// } else if (!showPaymentUI) {
		// 	localStorage.removeItem("cardUUID");
		// 	localStorage.removeItem("generatedByUUID");
		// 	localStorage.removeItem("senderUUID");
		// 	localStorage.removeItem("newOwnUUID");
		// 	localStorage.removeItem("cardPrice");
		// }
	// Disabled eslint rule because we only want this running if the user gets to the payment UI
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ showPaymentUI ]);

	return (
		<>
			<CardActionModal
				isOpen={props.isOpen}
				onClose={() => {
					if (showPaymentUI) {
						areYouSure.onOpen();
					} else {
						props.onClose();
						setShowPaymentUI(false);
					}
				}}
				currentCard={props.currentCard}
				fromName={props.fromName}
				currentUserId={props.currentUserId}
				cardAction={() => {
					setShowPaymentUI(true);
				}}
				title={"Buy Card"}
				subtitle={`Would you like to buy the "${props.currentCard.firstName} ${props.currentCard.lastName}" card from ${props.fromName}?`}
				actionButtonText={`Buy from ${props.fromName}`}
			/>

			{/* Modal for when the user tries to leave the modal while paying */}
			<Modal
				isOpen={areYouSure.isOpen}
				onClose={areYouSure.onClose}
				isCentered
				returnFocusOnClose={false}
			>
				<ModalOverlay />
				<ModalCloseButton />
				<ModalContent>
					<ModalHeader>Are you sure?</ModalHeader>
					<ModalBody>
						<Text>Are you sure you want to leave the payment process?</Text>
						<Flex justifyContent="flex-end" gap="10px" marginTop="20px">
							<Button
								onClick={areYouSure.onClose}
								variant="back"
							>
								No
							</Button>
							<Button
								onClick={() => {
									areYouSure.onClose();
									props.onClose();
									setShowPaymentUI(false);
								}}
								variant="next"
							>
								Yes
							</Button>
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
}
