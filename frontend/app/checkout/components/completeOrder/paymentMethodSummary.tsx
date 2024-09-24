import { Flex, Text } from "@chakra-ui/react";

interface PaymentMethodSummaryProps {
	firstName: string;
	lastName: string;
	paymentCardBrand: string | null;
	paymentCardLastFour: string | null;
}

/**
 * This component renders the payment method summary for the complete order step in the checkout process.
 * @returns {JSX.Element} - The rendered JSX element for the payment method summary.
 */
export default function PaymentMethodSummary({ firstName, lastName, paymentCardBrand, paymentCardLastFour }: PaymentMethodSummaryProps) {
	return (
		<>
			<Flex flexDirection={"column"} fontSize={{ base: "14px", md: "18px" }} fontWeight={"light"} fontFamily={"Barlow"}>
				<Text>
					{firstName} {lastName}
				</Text>
				<Text>
					{paymentCardBrand} ending in {paymentCardLastFour}
				</Text>
			</Flex>
		</>
	);
}
