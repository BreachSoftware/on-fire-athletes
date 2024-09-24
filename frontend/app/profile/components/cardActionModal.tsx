// eslint-disable-next-line no-use-before-define
import React from "react";
import TradingCardInfo from "@/hooks/TradingCardInfo";
import {
	Flex,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalOverlay,
	Text,
	Image,
} from "@chakra-ui/react";
import ViewedCardActionButton from "./viewedCardActionButton";
import { FaChevronRight } from "react-icons/fa6";
import { darkenHexString } from "@/components/create/OnFireCard/card_utils";


interface CardActionModalProps {
	isOpen: boolean;
	onClose: () => void;
	currentCard: TradingCardInfo;
	fromName: string;
	currentUserId: string;
    cardAction: () => void;
	title: string;
    subtitle: string;
    actionButtonText: string;
	actionButtonIcon?: React.JSX.Element;
    children?: React.ReactNode;
	secondaryAction?: () => void;
	secondaryActionText?: string;
	secondaryButtonIcon?: React.JSX.Element;
	closeable?: boolean;
}

/**
 * The component for requesting a card to be added to your collection
 */
export function CardActionModal(props: CardActionModalProps) {
	return (
		<Modal
			isOpen={props.isOpen}
			onClose={props.onClose}
			isCentered
		>
			<ModalOverlay backdropFilter="blur(5px) hue-rotate(10deg)" />
			<ModalContent backgroundColor={"#171C1B"}
				maxW={{ base: "85vw", md: "55vw" }}
				width="auto"
			>
				{ (props.closeable == undefined || props.closeable) &&
					<ModalCloseButton
						mr={"1%"}
						mt={"1%"}
						sx={{
							width: "18px",
							height: "18px",
							fontSize: "18px",
						}} /> }
				<ModalBody userSelect={"none"}>

					{/* Modal Content */}
					<Flex flexDir={{ base: "column", md: "row" }} gap="40px" paddingY={30} paddingX={{ base: 0, md: 30 }} alignItems={"center"}>

						{/* Image */}
						<Flex flexDirection={"column"} height={"100%"} width={{ base: "100%", md: "40%" }} paddingY="30px">
							<Image
								src={props.currentCard.cardImage}
								alt={`${props.currentCard.firstName} ${props.currentCard.lastName}`}
								maxW={{ base: "60%", md: "70%" }}
								aspectRatio={2 / 3}
								mx="auto"
								transform={"rotate(-12deg)"}
								style={{
									filter: `drop-shadow(0px 0px 15px ${ darkenHexString(props.currentCard.borderColor) })`,
									transition: "filter 1s ease-in"

								}}
							/>
						</Flex>

						{/* Text & Button */}
						<Flex
							flexDirection={"column"}
							gap={{ base: "10px", md: "30px" }}
							width={{ base: "100%", md: "50%" }}
						>
							{/* Title */}
							<Text
								fontFamily={"Brotherhood"}
								fontSize={props.title.toLowerCase() === "light it up!" ? { base: "40px", md: "60px" } : { base: "25px", md: "30px" }}
								fontWeight="500"
								letterSpacing="3px"
								textTransform={"uppercase"}
								color={"green.100"}
							>
								{props.title}
							</Text>

							{/* Subtitle */}
							<Text
								fontFamily={"Barlow Condensed"}
								fontSize={{ base: "22px", md: "26px" }}
								// make it thin
								fontWeight="300"
								letterSpacing="1.3px"
								transform={"skew(-5deg)"}
								color={"white"}
								marginBottom={"20px"}
							>
								{props.subtitle}
							</Text>

							{props.children ? (
							// "Send my card" action children
								<Flex
									flexDirection={"column"}
									gap={{ base: "10px", md: "30px" }}
									width={"100%"}
								>
									<Flex direction="column" w="100%" mb="20px">
										{props.children}
									</Flex>
								</Flex>
							) : (
							// "Request" and "Buy" action buttons
								<Flex direction="row" gap="10px">
									<ViewedCardActionButton
										opacity={"1"}
										hover={{
											bgColor: "#CCC",
											cursor: "pointer",
											color: "black"
										}}
										onClick={props.cardAction}
									>
										{/* Button content */}
										<Flex alignItems={"center"} gap={"10px"}>
											<Text
												fontFamily={"Barlow"}
												fontSize={{ base: "14px", md: "16px" }}
												fontWeight="600"
												letterSpacing="2px"
												paddingBottom={"2px"}
											>
												{props.actionButtonText}
											</Text>
											{props.actionButtonIcon ? props.actionButtonIcon : <FaChevronRight size="18px" /> }
										</Flex>
									</ViewedCardActionButton>

									{/* Secondary Button */}
									{props.secondaryAction && props.secondaryActionText && (
										<ViewedCardActionButton
											opacity={"1"}
											outline
											hover={{
												bgColor: "#C53030",
												cursor: "pointer",
												color: "white"
											}}
											onClick={props.secondaryAction}
										>
											<Flex alignItems="center" gap="10px">
												<Text
													fontFamily="Barlow"
													fontSize={{ base: "14px", md: "16px" }}
													fontWeight="600"
													letterSpacing="2px"
													paddingBottom={"2px"}
												>
													{props.secondaryActionText}
												</Text>
												{props.secondaryButtonIcon ? props.secondaryButtonIcon : <FaChevronRight size="18px" />}
											</Flex>

										</ViewedCardActionButton>
									)}
								</Flex>
							)}
						</Flex>
					</Flex>
				</ModalBody>
			</ModalContent>
		</Modal>
	);

}
