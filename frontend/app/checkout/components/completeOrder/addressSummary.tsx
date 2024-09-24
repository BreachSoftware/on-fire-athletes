import { Flex, Text } from "@chakra-ui/react";

interface AddressSummaryProps {
	firstName: string;
	lastName: string;
	address: string;
	city: string;
	state: string;
	zipCode: string;
}

/**
 * This component renders the payment method summary for the complete order step in the checkout process.
 * @returns {JSX.Element} - The rendered JSX element for the payment method summary.
 */
export default function AddressSummary({ firstName, lastName, address, city, state, zipCode }: AddressSummaryProps) {
	return (
		<>
			<Flex flexDirection={"column"} fontSize={{ base: "14px", md: "18px" }} fontWeight="Light" fontFamily={"Barlow"}>
				<Text>
					{firstName} {lastName}
				</Text>
				<Text>
					{address}
				</Text>
				<Text>
					{city}, {state} {zipCode}
				</Text>
			</Flex>
		</>
	);
}
