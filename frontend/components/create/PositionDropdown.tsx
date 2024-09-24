
import { Box, Input, Tooltip } from "@chakra-ui/react";
import DropdownInput from "./DropdownInput";
import { SportsPositions } from "./SportsPositions";
import { useCurrentCardInfo } from "@/hooks/useCurrentCardInfo";
import MobileCardCreationTextBox from "./mobile/mobileCardCreationTextBox";
import { useEffect } from "react";

interface PositionDropdownProps {
	opacity?: number;
	textColor?: string;
	title?: string;
	backgroundColor?: string;
	mobile?: boolean;
	h?: string;
	referenceWidth?: string;
}

/**
 * The position dropdown component.
 */
function PositionDropdown({ opacity, textColor, title = "Position*", backgroundColor, mobile, h, referenceWidth }: PositionDropdownProps) {

	const card = useCurrentCardInfo();

	// If there is only one position, we will select it automatically
	useEffect(() => {

		if (card.curCard.sport !== "" && SportsPositions[card.curCard.sport as keyof typeof SportsPositions]?.length === 1) {
			card.setCurCard({
				...card.curCard,
				position: SportsPositions[card.curCard.sport as keyof typeof SportsPositions][0],
			});
		}

	// We only want to run this effect when the sport changes.
	// Adding the dependency it wants will create an infinite loop. Bad!
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ card.curCard.sport ]);

	return (
		<Tooltip
			hasArrow
			label="Please select a sport first!"
			isDisabled={card.curCard.sport !== ""}
			bg={"green.100"}
			color={"white"}
		>
			<Box w={"100%"}>
				{/* Changes between input boxes depending on if "Sport" is "Other" */}
				{card.curCard.sport === "Other" ? (mobile ? (
					<MobileCardCreationTextBox
						placeholder={"Position*"}
						attribute={"position"}
					/>) : (
					<Input
						backgroundColor={backgroundColor || "gray.200"}
						textColor={textColor}
						placeholder={"Position*"}
						value={card.curCard.position}
						onChange={(e) => {
							card.setCurCard({
								...card.curCard,
								position: e.target.value,
							});
						}}
					/>
				)) : (
					<DropdownInput
						title={title}
						h={h}
						backgroundColor={backgroundColor || "gray.200"}
						isDisabled={card.curCard.sport === ""}
						opacity={opacity}
						textColor={textColor}
						options={
							SportsPositions[card.curCard.sport as keyof typeof SportsPositions] ?
								SportsPositions[card.curCard.sport as keyof typeof SportsPositions] : []
						}
						attribute="position"
						mobile={mobile}
						referenceWidth={referenceWidth}
					/>
				)}
			</Box>
		</Tooltip>
	);
};

export default PositionDropdown;
