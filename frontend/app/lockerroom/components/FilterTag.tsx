import { Button, Spacer } from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { formatTitle } from "@/components/create/DropdownInput";
import { helvetica } from "@/theming/fonts";

interface FilterTagProps {
	text: string;
	isActive?: boolean;
	onClick?: () => void
	order: number;
	filterType: string;
}

/**
 * Filter Tag component.
 * @param text - The text to display on the tag.
 * @param isActive - Whether the tag is active or not.
 * @param onClick - The function to call when the tag is clicked.
 */
export default function FilterTag(props: FilterTagProps) {

	return (
		<>
			<Button
				size={"md"}
				onClick={props.onClick}
				borderRadius={"none"}
				backgroundColor={props.isActive ? "green.200" : "transparent"}
				textColor={props.isActive ? "black" : "white"}
				textAlign="left"
				justifyContent="flex-start"
				paddingLeft="16px"
				maxH={"20px"}
				width={"100%"}
			>

				{/* Span for text styling */}
				<span style={{
					alignSelf: "start",
					fontSize: "16px",
					fontFamily: helvetica,
					fontWeight: 400,
				}}>
					{formatTitle(props.text)}
				</span>
				<Spacer/>
				{props.isActive ? <CheckIcon boxSize={3} /> : <></>}
			</Button>
		</>
	);
}
