import { Grid, Text } from "@chakra-ui/react";
import RadioPicker from "../RadioPicker";
import { useCurrentCardInfo } from "@/hooks/useCurrentCardInfo";

/**
 * @file mobileStep7.tsx is the mobile step 7 component for the create page
 * @returns the JSX for the mobile step 7
 */
export default function MobileStep7() {
	// Get the current card information using the useCurrentCardInfo hook
	const card = useCurrentCardInfo();

	return (
		<>
			<Grid templateColumns="1fr 2fr" gap={2} justifyContent="center" flexWrap="wrap">
				{/* Font Style */}
				<Text minW={"100px"} noOfLines={1} color="white" fontWeight="bold" transform="skewX(-6deg)">
					Font Style:
				</Text>
				<RadioPicker
					option1text="Classic"
					option2text="Marker"
					value={card.curCard.nameFont === "Uniser-Bold" ? "1" : "2"}
					onChange={(value) => {
						// Update the nameFont property of the current card based on the selected value
						card.setCurCard({
							...card.curCard,
							nameFont: value === "1" ? "Uniser-Bold" : "'Brotherhood', sans-serif",
						});
					}}
				/>

				{/* First Name */}
				<Text minW={"100px"} noOfLines={1} color="white" fontWeight="bold" transform="skewX(-6deg)">
					First Name:
				</Text>
				<RadioPicker
					option1text="Solid"
					option2text="Outline"
					value={card.curCard.firstNameSolid ? "1" : "2"}
					onChange={(value) => {
						// Update the firstNameSolid property of the current card based on the selected value
						card.setCurCard({
							...card.curCard,
							firstNameSolid: value === "1",
						});
					}}
				/>

				{/* Last Name */}
				<Text minW={"100px"} noOfLines={1} maxW={"70%"} color="white" fontWeight="bold" transform="skewX(-6deg)">
					Last Name:
				</Text>
				<RadioPicker
					option1text="Solid"
					option2text="Outline"
					value={card.curCard.lastNameSolid ? "1" : "2"}
					onChange={(value) => {
						// Update the lastNameSolid property of the current card based on the selected value
						card.setCurCard({
							...card.curCard,
							lastNameSolid: value === "1",
						});
					}}
				/>
			</Grid>
		</>
	);
}
