import { Circle, HStack } from "@chakra-ui/react";


/**
 * This is a color picker component that will be used in the card creation process step 3
 *
 * @returns Coloir picker component
 */
export default function ColorPicker() {

	return (

		<>
			<HStack justifyContent={"space-between"} width={"100%"}>
				{/* <Circle border={"2px solid white"} size="40px" bg="green.100" /> */}
				<Circle border={"2px solid white"} size="40px" bg="blue.500" />
				<Circle border={"2px solid white"} size="40px" bg="red.500" />
				<Circle border={"2px solid white"} size="40px" bg="yellow.300" />
			</HStack>
		</>

	);
}
