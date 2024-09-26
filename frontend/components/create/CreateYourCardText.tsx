import { Flex, Text, Box } from "@chakra-ui/react";

/**
 * A component that displays the text "CREATE YOUR DIGITAL SPORTS CARD"
 *
 * @returns Create Your Card Text Component
 */
export default function CreateYourCardText() {
	return (
		<Flex direction="column" fontFamily="Barlow Condensed" fontSize={{ base: "60px", sm: "64px" }} lineHeight={{ base: "60px", md: "64px" }} color="white">
			<Flex direction={"row"}>
				<Text letterSpacing="4px" fontWeight={700}>
					CREATE
				</Text>
				<Box w="10px" />
				<Text fontSize={{ base: "54px", sm: "64px" }} fontFamily="Brotherhood" color="green.100" m="4px 0px -4px 6px">
					YOUR
				</Text>
			</Flex>
			<Text letterSpacing="4px" fontWeight={700}>
				{" "}
				SPORTS CARD
			</Text>
		</Flex>
	);
}
