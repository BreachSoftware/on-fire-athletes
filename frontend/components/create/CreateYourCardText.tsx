import { Flex, Text, Box } from "@chakra-ui/react";

/**
 * A component that displays the text "CREATE YOUR DIGITAL SPORTS CARD"
 *
 * @returns Create Your Card Text Component
 */
export default function CreateYourCardText() {
	return (
		<Flex direction="column" fontFamily="Barlow Condensed" fontSize={{ base: "48px", sm: "64px" }} lineHeight="64px" color="white" >
			<Flex direction={"row"}>
				<Text letterSpacing="4px" fontWeight={700}>CREATE</Text>
				<Box w="10px" />
				<Text fontFamily="Brotherhood" color="green.100" m="4px 0px -4px 6px">YOUR</Text>
			</Flex>
			<Text letterSpacing="4px" fontWeight={700}> SPORTS CARD</Text>
		</Flex>
	);
}
