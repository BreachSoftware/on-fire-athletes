import { Button, Text } from "@chakra-ui/react";
import { FaXmark } from "react-icons/fa6";
import { formatTitle } from "@/components/create/DropdownInput";
import { helvetica } from "@/theming/fonts";

interface FilterBubbleProps {
	text: string;
	onClick?: () => void
}

/**
 * Filter Bubble component.
 * @param text - The text to display on the tag.
 * @param onClick - The function to call when the tag is clicked.
 */
export default function FilterBubble(props: FilterBubbleProps) {

	return (
		<>
			<Button
				size={"md"}
				onClick={props.onClick}
				borderRadius={"full"}
				backgroundColor={"#D5D5D5"}
				textColor={"black"}
				textAlign={"center"}
				justifyContent={"center"}
				alignItems={"center"}
				paddingLeft="8px"
				paddingRight="8px"
				gap={0.5}
				maxH={"22px"}
				width={"min-content"}
				_hover={{
					md: {
						backgroundColor: "gray.400",
					}
				}}
			>
				<Text
					fontSize="14px"
					fontFamily={helvetica}
					fontWeight={400}
				>
					{formatTitle(props.text)}
				</Text>
				<FaXmark color="black" size={14} />
			</Button>
		</>
	);
}
