import { selectAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(selectAnatomy.keys);

const checkoutVariant = definePartsStyle({
	field: {
		border: "solid 1px black",
		bg: "black",
		color: "white",
		borderRadius: "none",
	},
});

export const selectTheme = defineMultiStyleConfig({
	variants: {
		checkout: checkoutVariant,
	},
});
