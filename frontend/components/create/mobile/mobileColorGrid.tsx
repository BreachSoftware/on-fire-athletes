import { Grid, GridItem } from "@chakra-ui/react";
import { useCurrentCardInfo } from "@/hooks/useCurrentCardInfo";
import ColorPickerWithText from "./mobile_color_pickers/colorPicker";
import TradingCardInfo from "@/hooks/TradingCardInfo";

interface MobileColorGridProps {
	colorPickerTitles: string[];
	colorPickerAttributes: (keyof TradingCardInfo)[];
}

/**
 *
 * This is the mobile step 7 component for the card creation process.
 *
 * @returns the JSX for the mobile step 7
 */
export default function MobileColorGrid({ colorPickerTitles, colorPickerAttributes }: MobileColorGridProps) {
	const card = useCurrentCardInfo();

	// Filters out the color pickers whose attributes are not applicable to the current card
	const filteredAttributes = colorPickerAttributes.filter((attribute) => {
		if (attribute === "signatureColor" && !card.curCard.signature) {
			return false;
		}
		if (attribute === "backgroundTextColor" && card.curCard.cardType === "A") {
			return false;
		}
		return true;
	});

	// Filters out the titles whose attributes are not applicable to the current card
	const filteredTitles = colorPickerTitles.filter((title, index) => {
		const attribute = colorPickerAttributes[index];
		if (attribute === "signatureColor" && !card.curCard.signature) {
			return false;
		}
		if (attribute === "backgroundTextColor" && card.curCard.cardType === "b") {
			return false;
		}
		return true;
	});


	return (
		<Grid w={"100%"} alignContent={"center"} px={"20px"} rowGap={"11px"}>
			{/* Maps the titles and color pickers to the grid */}
			{filteredTitles.map((title, index) => {
				return (
					<GridItem h={"100%"} colStart={index % 2 === 0 ? 1 : 2} rowStart={Math.floor(index / 2) + 1} key={index}>
						<ColorPickerWithText colorPickerProps={{ type: filteredAttributes[index] }} title={title}/>
					</GridItem>
				);
			})}
		</Grid>
	);
}
