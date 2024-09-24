import { useCurrentCheckout } from "@/hooks/useCheckout";
import { Flex, HStack, Link, Text } from "@chakra-ui/react";

interface CompleteOrderSectionProps {
	categoryTitle: string,
	// This is disabled because we have done this elsewhere in the project and it works!
	// eslint-disable-next-line no-undef
	categoryInformation: JSX.Element,
	redirectToStepNumber?: number,
	mobileView?: boolean
}

/**
 * This component is responsible for displaying each category in the complete order section.
 */
export default function CompleteOrderSection({ categoryTitle, categoryInformation, redirectToStepNumber, mobileView }: CompleteOrderSectionProps) {
	const { checkout, setCheckout } = useCurrentCheckout();
	return (
		<>
			<Flex w={"100%"} flexDirection={"column"} gap={{ base: "7.5px", md: "10px" }}>
				<HStack gap="20px">
					<Text fontSize={{ base: "14px", sm: "3xl" }} fontWeight={{ base: "medium", md: "bold" }} textColor={"green.100"}>
						{categoryTitle}
					</Text>
					{mobileView && redirectToStepNumber &&
					<Link
						onClick={() => {
							setCheckout({
								...checkout,
								stepNum: redirectToStepNumber,
							});
						}}
					>
						<Text as="u" textColor={"white"} fontSize="12px">
							Edit
						</Text>
					</Link>}
				</HStack>
				<Text
					fontSize={{ base: "14px", md: "18px" }}
					fontWeight="light"
				>
					{categoryInformation}
				</Text>
				{ redirectToStepNumber && !mobileView &&
					<Link textColor={"white"} onClick={() => {
						setCheckout({
							...checkout,
							stepNum: redirectToStepNumber,
						});
					}}>
						Edit
					</Link> }
			</Flex>
		</>
	);
}
