import { Text }	from "@chakra-ui/react";
import RadioPicker from "../RadioPicker";
import { useCurrentCardInfo } from "@/hooks/useCurrentCardInfo";

type Variant = "first" | "last";

interface MobileTextPickerProps {
    variant: Variant;
}

/**
 * The mobile text picker component, with functionality to change either the first or the last name.
 * @returns A mobile text picker component
 */
export default function MobileTextPicker({ variant }: MobileTextPickerProps) {

	// Capitalize first letter of the variant
	const capitalizedVariant = variant.charAt(0).toUpperCase() + variant.slice(1);

	const cardHook = useCurrentCardInfo();

	/**
     * A function to render a text selector button
     * @param index The index of the text to render
     * @returns the text selector button
     */
	return (
		<>
			<Text size="sm">{capitalizedVariant} Name:</Text>
			<RadioPicker
				option1text={"Solid"}
				option2text={"Outline"}
				value={variant === "first" ? cardHook.curCard.firstNameSolid ? "1" : "2" : cardHook.curCard.lastNameSolid ? "1" : "2"}
				onChange={(value) => {
					if(variant === "first") {
						cardHook.setCurCard({ ...cardHook.curCard, firstNameSolid: (value === "1") });
					} else {
						cardHook.setCurCard({ ...cardHook.curCard, lastNameSolid: (value === "1") });
					}
				}}
			/>
		</>
	);

}
