import FullColorPicker, { FullColorPickerProps } from "../../FullColorSelector";
import { HStack, Text } from "@chakra-ui/react";

interface mobileColorPickerProps {
	colorPickerProps: FullColorPickerProps
	title: string
}

/**
 *
 * A wrapper element for the color picker and text pair
 *
 * @param props The props to the mobile color picker
 * @returns The color picker and text component
 *
 */
export default function ColorPickerWithText(props: mobileColorPickerProps) {
	return (
		<HStack>
			<FullColorPicker {...props.colorPickerProps}/>
			<Text>{props.title}</Text>
		</HStack>
	);
}
