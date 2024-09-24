import { Circle, HStack } from "@chakra-ui/react";
import { useState } from "react";


interface NameColorPickerProps {
	onChange: (value: boolean) => void
}

/**
 * This is a color picker component that will be used in the card creation process step 3
 *
 * @returns Coloir picker component
 */
export default function NameColorPicker({ onChange }: NameColorPickerProps) {

	const [ clicked, setClicked ] = useState(false);

	return (

		<>
			<HStack justifyContent={"space-between"} width={"100%"}>
				{/* <Circle border={"2px solid white"} size="40px" bg="green.100" /> */}
				<Circle
					cursor={"pointer"}
					border={"2px solid"}
					size="40px" bg="black"
					borderColor={clicked ? "gray.100" : "green.100"}
					onClick={() => {
						onChange(!clicked);
						setClicked(!clicked);
					}}/>
				<Circle
					cursor={"pointer"}
					border={"2px solid"}
					size="40px"
					bg="white"
					borderColor={clicked ? "green.100" : "gray.100"}
					onClick={() => {
						onChange(!clicked);
						setClicked(!clicked);
					}}/>
			</HStack>
		</>

	);
}
