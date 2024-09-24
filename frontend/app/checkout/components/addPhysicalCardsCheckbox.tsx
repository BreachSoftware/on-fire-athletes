import { Checkbox } from "@chakra-ui/react";
import { useState } from "react";

/**
 * This component renders a checkbox for the shipping address bottom corner. It will be checked if
 * the user marks the same shipping address as the billing address.
 * @returns {JSX.Element} - The rendered JSX element for the shipping address bottom corner checkbox
 */
export function AddPhysicalCardsCheckbox() {

	const [ isChecked, setIsChecked ] = useState(false);

	return (
		<Checkbox
			variant={"checkoutGreen"}
			paddingX={5}
			paddingY={2}
			gap={5}
			flexDirection="row-reverse"
			onChange={() => {
				return setIsChecked(!isChecked);
				// Probably need to edit the cart when that's a thing
			}}
		>
			ADD PHYSICAL CARDS TO CART
		</Checkbox>
	);
}
