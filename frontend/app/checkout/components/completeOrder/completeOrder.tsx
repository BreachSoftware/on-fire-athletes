import { Flex, Box, Spacer, useBreakpointValue, Divider, Text } from "@chakra-ui/react";
import CompleteOrderSection from "./completeOrderSection";
import PaymentMethodSummary from "./paymentMethodSummary";
import AddressSummary from "./addressSummary";
import { useCurrentCheckout } from "@/hooks/useCheckout";
import { ItemsInCartComponent } from "../checkoutItemsInCart";
import { useEffect, useState } from "react";

/**
 * This component renders the body content for the complete order step in the checkout process.
 * @returns {JSX.Element} - The rendered JSX element for the complete order body.
 */
export default function CompleteOrderBody() {
	const { checkout } = useCurrentCheckout();
	const [ determiningMobileView, setDeterminingMobileView ] = useState(true);

	// Determines if there are physical cards present in the checkout cart
	const physicalCardCount = checkout.physicalCardCount;


	const isMobile = useBreakpointValue({ base: true, lg: false });

	useEffect(() => {
		if (typeof isMobile !== "undefined") {
			setDeterminingMobileView(false);
		}
	}, [ isMobile ]);

	return (
		// Holds the two sections of the complete order step
		<Flex w={"100%"} direction={{ base: "column", lg: "row" }} gap={"25px"}>
			{/* If the program is determining whether to show the mobile view or not, show nothing */}
			{ determiningMobileView ? null :
				<>
					{!isMobile && <Spacer />}
					{/* Section for the payment method summary */}
					<Flex w={"100%"} direction={{ base: "column", lg: "row" }} gap={6}>
						<Box flex={1}>
							<CompleteOrderSection
								categoryTitle="Order Summary"
								categoryInformation={
									<PaymentMethodSummary
										firstName={checkout.contactInfo.firstName}
										lastName={checkout.contactInfo.lastName}
										paymentCardBrand={checkout.paymentCardBrand ?? null}
										paymentCardLastFour={checkout.paymentCardLastFour ?? null}
									/>
								}
								redirectToStepNumber={2}
								mobileView={isMobile}
							/>
						</Box>
						{/* Section for the shipping address summary */}
						{physicalCardCount > 0 && (
							<Box w={"100%"} flex={1}>
								<CompleteOrderSection
									categoryTitle="Shipping To"
									categoryInformation={
										<AddressSummary
											firstName={checkout.shippingAddress.firstName}
											lastName={checkout.shippingAddress.lastName}
											address={checkout.shippingAddress.streetAddress}
											city={checkout.shippingAddress.city}
											state={checkout.shippingAddress.state}
											zipCode={checkout.shippingAddress.zipCode}
										/>
									}
									redirectToStepNumber={3}
									mobileView={isMobile}
								/>
							</Box>
						)}
					</Flex>
					{/* If the program is in mobile view, show the items in the cart below the order summary and shipping address */}
					{isMobile && (
						<>
							<Divider borderColor={"gray.1700"} />
							<Text textColor={"green.100"} fontFamily={"Barlow"} fontSize={"14px"} fontWeight={"medium"}>
								Items
							</Text>

							<ItemsInCartComponent items={checkout.cart} />
						</>
					)}
				</>
			}
		</Flex>
	);
}
