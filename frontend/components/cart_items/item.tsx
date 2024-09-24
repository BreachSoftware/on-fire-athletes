
"use client";

import {
	Flex,
	Text,
	useBreakpointValue,
	Box,
	Circle,
	HStack,
	Button,
	Spacer,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	useDisclosure,
	ModalCloseButton,
	Image,
} from "@chakra-ui/react";
import itembg from "@/public/card_assets/locker-room-background.png";
import arCardBack from "@/public/AROnFireBackGreyscale.png";
import { useCurrentCheckout } from "@/hooks/useCheckout";
import { useState } from "react";
import TradingCardInfo from "@/hooks/TradingCardInfo";
import OnFireCard from "../create/OnFireCard/OnFireCard";


// props
interface CheckItemProps {
	title: string;
	card: TradingCardInfo | null;
	numberOfCards: number;
	numberOfOrders: number;
	price: number;
	canEdit: boolean;
	canRemove: boolean;
}

/**
 * CheckItem component
 * @returns JSX.Element
 */
export default function Item({
	title, card, numberOfCards, numberOfOrders, price, canEdit = true, canRemove = true
}: CheckItemProps) {
	// leaving this commented might use in the future
	// const [ isHovered, setIsHovered ] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [ modalQuantity, setModalQuantity ] = useState(numberOfOrders);

	const co = useCurrentCheckout();

	const checkout = co.checkout;
	const itemsInCart = checkout.cart;

	const cardType = title.includes("Physical") ? "Physical" : "Digital";

	return (
		<>
			<Flex w={"100%"} mb={3} direction="row" align="left">
				<Box ml={2} mt={2} position="relative" display="inline-block"
					// onMouseEnter={() => {
					// 	return setIsHovered(true);
					// }}
					// onMouseLeave={() => {
					// 	return setIsHovered(false);
					// }}
				>
					<Box
						backgroundImage={`url(${itembg.src})`}
						backgroundSize={"cover"}
						backgroundPosition={"center"}
						transition={"background-image 1s ease-in-out"}
						display="flex"
						justifyContent="center"
						alignItems="center"
						width={useBreakpointValue({ base: "80px", md: 100 })}
						height={useBreakpointValue({ base: "80px", md: 100 })}
					>
						{cardType === "Digital" ?
							// Digital Card has just the OnFire Card
							<Box
								transform={{ base: "scale(0.10)", md: "scale(0.12)" }}
								// disable draggable images on cards in the checkout flow
								pointerEvents="none">
								<OnFireCard
									key={card!.uuid}
									card={card!}
									showButton={false}
								/>
							</Box> :
							// Physical Card has the OnFire Card and AR Card Back
							<>
								<Box
									transform={{ base: "scale(0.07) rotate(348deg) translate(-150px)", md: "scale(0.1) rotate(348deg) translate(-150px)" }}
									zIndex={1}
									// disable draggable images on cards in the checkout flow
									pointerEvents="none"
								>
									<OnFireCard
										key={card!.uuid}
										card={card!}
										showButton={false}
									/>
								</Box>
								<Image
									// Temporary Asset for AR Card Back
									src={arCardBack.src}
									alt="AR Card Preview"
									height={{ base: "35px", md: "50px" }}
									position={"absolute"}
									top={"20px"}
									right={"15px"}
									transform={"rotate(12deg)"}
									zIndex={0}
								/>
							</>
						}
					</Box>
					<Circle
						size="auto"
						minWidth="17px"
						px="4px"
						py="1px"
						bg="green.100"
						color="white"
						fontSize={useBreakpointValue({ base: "8px", md: "10px" })}
						fontWeight="bold"
						position="absolute"
						top="-9px"
						left="-8px"
						display="flex"
						alignItems="center"
						justifyContent="center"
					>
						{numberOfOrders}
					</Circle>
				</Box>
				<Flex ml={6} direction="column" align="left">
					<Spacer/>
					<Text
						zIndex={2}
						fontFamily={"Barlow Condensed"}
						fontWeight={"600"}
						transform={"skew(-6deg)"}
						// scale text size based on screen size
						fontSize={useBreakpointValue({ base: "20px", sm: "md", lg: "xl" })}
					>
						{title}
					</Text>
					<Text
						zIndex={2}
						fontFamily={"Roboto"}
						fontWeight={"regular"}
						transform={"skew(-6deg)"}
						// scale text size based on screen size
						fontSize={useBreakpointValue({ base: "12px", md: "12px" })}
					>
						{cardType} Card: ${(price * numberOfOrders).toFixed(2)}{" "}
						({numberOfOrders * numberOfCards} card{numberOfOrders * numberOfCards > 1 ? "s" : ""})
					</Text>
					<HStack paddingTop="10px">
						{ /* Remove Button */ }
						{ canRemove && <Button
							zIndex={2}
							bg="transparent"
							border="none"
							color="white"
							fontWeight="normal"
							fontSize="12px"
							fontFamily={"Roboto"}
							padding="0"
							height="auto"
							maxW={"40px"}
							lineHeight="normal"
							textDecoration={"underline"}
							onClick={() => {
								let physicalCardRemoved = false;
								let amountOfPhysicalCards = 0;
								// remove item from cart
								const newCart = itemsInCart.filter((item) => {
									if (item.title === title && item.title.includes("Physical")) {
										physicalCardRemoved = true;
										amountOfPhysicalCards = item.numberOfOrders;
									}
									return item.title !== title;
								});
								if (physicalCardRemoved) {
									co.setCheckout({
										...checkout,
										cart: newCart,
										physicalCardCount: checkout.physicalCardCount - amountOfPhysicalCards,
									});
								} else {
									co.setCheckout({ ...checkout, cart: newCart });
								}
							}}
						>
							Remove
						</Button>
						}
						{ /* Edit Button */ }
						{ canEdit &&
								<Button
									zIndex={2}
									bg="transparent"
									border="none"
									color="white"
									fontWeight="normal"
									fontSize="12px"
									fontFamily={"Roboto"}
									padding="0"
									height="auto"
									maxW={"40px"}
									lineHeight="normal"
									textDecoration={"underline"}
									onClick={() => {
										onOpen();
									}}
								>
								Edit
								</Button>
						}
						<Modal isOpen={isOpen} onClose={() => {
							onClose();
							co.setCheckout({
								...checkout,
								cart: itemsInCart.map((item) => {
									if (item.title === title) {
										return { ...item, numberOfOrders: modalQuantity };
									}
									return item;
								}),
								physicalCardCount: title.includes("Physical") ? modalQuantity * numberOfCards : checkout.physicalCardCount,
							});
						}}
						>
							<ModalOverlay />
							<ModalContent>
								<ModalHeader>
										Edit Item
									<ModalCloseButton />
								</ModalHeader>
								<ModalBody>
									<Flex w={"100%"} justifyContent={"center"} alignItems={"center"}>
										<Button w={"50px"} onClick={() => {
											// decrement quantity
											if (modalQuantity > 1) {
												setModalQuantity(modalQuantity - 1);
											}
										}}>-</Button>
										<Text mx={"2%"}>{modalQuantity}</Text>
										<Button w={"50px"} onClick={() => {
											// increment quantity
											setModalQuantity(modalQuantity + 1);
										}
										}>+</Button>
									</Flex>
								</ModalBody>
							</ModalContent>
						</Modal>
					</HStack>
					<Spacer/>
					<Spacer/>
				</Flex>
				<Spacer/>
			</Flex>
		</>
	);
}
