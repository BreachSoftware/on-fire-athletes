"use client";
// Import necessary components and hooks from Chakra UI and React
import { Button, Flex, Heading, Text, useBreakpointValue, useToast } from "@chakra-ui/react";
import { checkoutSteps } from "./checkoutSteps";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { useCurrentCheckout } from "@/hooks/useCheckout";
import { useStripe } from "@stripe/react-stripe-js";
import { handlePurchase } from "./completeOrder/stripeHandlePurchase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TradingCardInfo from "@/hooks/TradingCardInfo";
import { useAuth } from "@/hooks/useAuth";

interface CheckoutStepWrapperProps {
	onFireCard: TradingCardInfo | null;
	buyingOtherCard: boolean;
}

/**
 * CheckoutStepWrapper is a functional component that handles the display and navigation of checkout steps.
 * It renders a step-by-step UI for a checkout process.
 * @returns {JSX.Element} - The rendered JSX element for the checkout step wrapper.
 */
export default function CheckoutStepWrapper({ onFireCard: onFireCard, buyingOtherCard }: CheckoutStepWrapperProps) {
	const curCheckout = useCurrentCheckout();
	const stripe = useStripe();
	const router = useRouter();
	const toast = useToast();
	const auth = useAuth();
	const checkout = curCheckout.checkout;
	const stepNumber = checkout.stepNum;
	const visitedSteps = checkout.visitedSteps;

	const [ hasAddedListeners, setHasAddedListeners ] = useState(false);

	const screenTooSmall = useBreakpointValue({ base: true, lg: false });

	// State to keep track of whether the user is buying physical cards
	const [ buyingPhysicalCards, setBuyingPhysicalCards ] = useState(false);
	useEffect(() => {
		if (checkout.physicalCardCount > 0) {
			setBuyingPhysicalCards(true);
		} else {
			setBuyingPhysicalCards(false);
		}
	}, [ checkout.packageName, checkout.physicalCardCount ]);

	// Used for the Purchase button on the last step
	const [ isLoading, setIsLoading ] = useState(false);

	/**
	 * Function to check if the current step is incomplete
	 * @returns {boolean} - Whether the current step is incomplete
	 */
	function stepIsIncomplete() {
		if (stepNumber === 2) {
			// Check if the email is the correct format
			const validEmail = checkout.contactInfo.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);

			// Check if the phone number is the correct format
			const validPhone = !checkout.contactInfo.phone ? true : checkout.contactInfo.phone.match(/^\d{10}$/g);

			return checkout.contactInfo.firstName === "" || checkout.contactInfo.lastName === "" || !validEmail || !validPhone;
		} else if (stepNumber === 3) {
			// Check if the street address is the correct format
			const validStreetAddress = checkout.shippingAddress.streetAddress.match(/^\d+\s[A-Za-z\d]+(\s[A-Za-z\-']+){1,2}\.?$/g);

			// Check if the zip code is the 5 or the 9 digit (XXXXX-XXXX) format
			const validZipCode = checkout.shippingAddress.zipCode !== "" &&
				(checkout.shippingAddress.zipCode.length === 5 || checkout.shippingAddress.zipCode.length === 10);

			return checkout.shippingAddress.firstName === "" ||
			checkout.shippingAddress.lastName === "" ||
			!validStreetAddress ||
			checkout.shippingAddress.city === "" ||
			checkout.shippingAddress.state === "" ||
			!validZipCode;
		}
		return false;
	}

	/**
	 *  Function to calculate the total price of all items in the cart
	 * @returns {number} - The total price of all items in the cart
	 */
	function totalPriceInCart() {
		let total = 0;
		for (let i = 0; i < checkout.cart.length; i++) {
			total = total + (checkout.cart[i].price * checkout.cart[i].numberOfOrders);
		}
		if (buyingPhysicalCards) {
			total = total + checkout.shippingCost;
		}
		return total;
	};

	/**
	 *  Function to calculate the total price of all items in the cart in cents
	 * @returns {number} - The total price of all items in the cart in cents
	 */
	function totalPriceInCartInCents() {
		return parseInt((totalPriceInCart() * 100).toFixed(2));
	}

	/**
	 * Function to calculate the shipping cost based on the number of physical cards
	 * @returns {number} - The calculated shipping cost
	 */
	function calculateShippingCost() {
		// Calculate shipping cost based on the number of physical cards
		const calculatedShippingCost = 4.99 + Math.floor(checkout.physicalCardCount / 10) * 5;
		return calculatedShippingCost;
	}


	//  useEffect to update the total price in the cart when the cart changes
	useEffect(() => {
		curCheckout.setCheckout({ ...checkout, total: totalPriceInCartInCents(), shippingCost: calculateShippingCost() });
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ checkout.cart, checkout.stepNum ]);

	return (
		<Flex width={"100%"} bg="#171C1B" h={"100%"} borderRadius={"8px"}>
			{/* Main container for the content of the checkout step, with padding and background color */}
			<Flex m="30px" w="100%" flexDirection={"column"} justifyContent={{ lg: "space-between" }}
			>

				{/* Header section containing the step title and step navigation */}
				<Flex
					alignItems={{ base: "normal", lg: "center" }}
					justifyContent={"space-between"}
					flexDirection={{ base: "column", lg: "row" }}
					mb={{ base: "0", lg: "25px" }}
				>
					<Heading
						fontSize={{ base: "22px", lg: "xl", xl: "2xl" }}
						fontStyle={"italic"}
						fontWeight={{ base: "bold", lg: "light" }}
						mb={{ base: "25px", lg: "0px" }}
					>
						{/* Display the title of the current step based on the stepNumber */}
						{checkoutSteps[stepNumber].title}
					</Heading>

					{/* Navigation section for steps */}
					{!screenTooSmall &&
						<Flex flexDirection={{ base: "column", lg: "row" }}>
							{checkoutSteps.map((step, index) => {
								if (index !== 0 && index !== 1) {
									return (
									// Fragment is used to avoid adding extra nodes to the DOM
										<>
											<Text
												key={index} // Unique key for each step to help React manage re-renders
												// Change text color based on whether the step is completed or not.
												// If the step is not accessible, change the color to gray
												textColor={index <= visitedSteps ?
													index === 3 && !buyingPhysicalCards ?
														"#808080" : "#FFFFFF" : "#808080"} // Color based on whether the step is completed or not
												fontSize={{ lg: "6px", xl: "10px" }}
												// Change cursor based on whether the step is completed or not.
												// If the step is not accessible, change the cursor to not-allowed
												_hover={{
													cursor: index <= visitedSteps ?
														index === 3 && !buyingPhysicalCards ? "not-allowed" : "pointer" : "not-allowed"
												}} // Change cursor based on whether the step is accessible
												userSelect={"none"} // Disable text selection
												mx={{ lg: "5px" }} // Add horizontal margin to add space before and after the step
												onClick={() => {
													// Change the step number to the clicked step if it's accessible
													if (index <= visitedSteps) {
														if (index === 3 && !buyingPhysicalCards) {
															// do nothing, as it's disabled
														} else {
															curCheckout.setCheckout({ ...checkout, stepNum: index });
														}
													}
												}}
											>
												{step.title}
											</Text>
											{/* Separator for steps, avoids adding for the last step */}
											<Text fontSize={{ lg: "6px", xl: "10px" }} userSelect={"none"}>
												{index === checkoutSteps.length - 1 ? "" : "/"}
											</Text>
										</>
									);
								}
								return null;
							})}
						</Flex>
					}
				</Flex>

				{/* Content area for the current step, displaying the component from checkoutSteps */}
				{checkoutSteps[stepNumber].bodyElement}

				{/* Footer section with the Next or Purchase button and optional bot-left element */}
				<Flex
					justifyContent={{ base: "center", lg: stepNumber === 4 ? "space-between" : "flex-end" }}
					flexDirection={{ base: "column", lg: "row" }}
					alignItems="center"
					gap="25px"
					w="100%"
					mt={"15px"}
				>

					{/* Bottom left element rendering at the beginning of this HStack */}
					{checkoutSteps[stepNumber].cornerElement}

					<Flex direction={{ base: "column", lg: "row" }} gap={{ base: "25px", lg: "31px" }} alignItems={"center"}>
						{/* total price of all items in cart */}
						<Text fontFamily={"Barlow"} transform={"skewX(-6deg)"} fontSize={"2xl"} fontWeight={"bold"}>
						Total: ${totalPriceInCart().toFixed(2)}{buyingPhysicalCards ? "*" : ""}
						</Text>
						<Flex gap="10%">
							<Button
								variant={"back"}
								width="100px"
								isDisabled={stepNumber === 0 || (stepNumber === 2 && buyingOtherCard)} // Disable the button if it's the first step
								onClick={() => {
									if (checkout.packageName !== "allStar" && stepNumber == 2) {
										curCheckout.setCheckout({ ...checkout, stepNum: stepNumber - 2 });
									} else if (!buyingPhysicalCards && stepNumber == 4) {
										curCheckout.setCheckout({ ...checkout, stepNum: stepNumber - 2 });
									} else {
										curCheckout.setCheckout({ ...checkout, stepNum: stepNumber - 1 });
									}
								}}
							>
						Back
							</Button>
							<Button
								variant="next"
								w="115px"
								_hover={{
									md: {
										filter: "drop-shadow(0px 0px 5px #27CE00)",
										width: "115px"
									}
								}}
								isDisabled={stepIsIncomplete()}
								isLoading={isLoading}
								onClick={() => {
									// Increment the step number to go to the next step, up to the last step
									// Skipping the shipping details step if the user is not buying physical cards
									if (!buyingPhysicalCards && stepNumber == 2) {
										const lastVisitedStep = stepNumber + 2 > visitedSteps ? stepNumber + 2 : visitedSteps;
										curCheckout.setCheckout({ ...checkout, stepNum: stepNumber + 2, visitedSteps: lastVisitedStep });
									// Advancing like normal
									} else if (stepNumber >= 0 && stepNumber < checkoutSteps.length - 1) {
										let advance = false;
										// Special next button logic for the payment details step
										if(stepNumber === 4) {

											// Click the button on the screen with id "save-details-button"
											// This button is within the CheckoutForm, and it seems like the easier option for the short-term
											const saveDetailsButton = document.getElementById("save-details-button");
											if(saveDetailsButton) {
												saveDetailsButton.click();
												setIsLoading(true);
											}

											if(!hasAddedListeners) {
												// Bug fix event listener to stop loading button from always being loading
												// Also gets triggered if the checkout process fails
												addEventListener("resetLoadingButton", () => {
													setIsLoading(false);
												});

												// create an event listener to wait for the button to be clicked so the next button can stop loading
												addEventListener("savedDetailsSuccess", () => {
													setIsLoading(false);
													// Go to the end of the checkout process after it gets processed
													curCheckout.setCheckout({
														...checkout,
														stepNum: checkoutSteps.length - 1,
														visitedSteps: checkoutSteps.length - 1
													});
												});

												setHasAddedListeners(true);
											}
										} else {
											advance = true;
										}
										if(advance) {
											const lastVisitedStep = stepNumber + 1 > visitedSteps ? stepNumber + 1 : visitedSteps;
											curCheckout.setCheckout({ ...checkout, stepNum: stepNumber + 1, visitedSteps: lastVisitedStep });
										}
									} else if (stepNumber === checkoutSteps.length - 1) {
										setIsLoading(true);
										handlePurchase(checkout, onFireCard, stripe, router, buyingOtherCard, auth).then((result) => {
											if (!result) {
												setIsLoading(false);
												toast({
													title: "Error",
													description: "An error occurred during the purchase.",
													status: "error",
													duration: 3000,
													isClosable: true,
												});
											}
										});
									}

								}}
							>
								<Flex alignItems={"center"}>
									{/* Change button text based on whether it's the last step */}
									{stepNumber !== checkoutSteps.length - 1 ? "Next" : "Purchase"}
									<ChevronRightIcon boxSize={"30px"} mr={"-10px"} />
								</Flex>
							</Button>
						</Flex>
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	);
}
