import { checkboxAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(checkboxAnatomy.keys);

const baseStyle = definePartsStyle({
	control: {
		color: "black",
		_hover: {
			md: {
				bg: "gray.200",
			}
		},
	},
});

const checkoutVariant = definePartsStyle({
	control: {
		borderRadius: 50,
	},
});

const checkoutGreenVariant = definePartsStyle({
	container: {
		bg: "green.100",
		borderRadius: 50,
	},
	control: {
		borderRadius: 50,
		_hover: {
			md: {
				bg: "green.1000",
			}
		},
		bg: "green.1000",
		border: "green.1000",
	},
	icon: {
		bg: "green.100",
		color: "white",
		borderRadius: 50,
	},
});

const checkoutAddOnVariant = definePartsStyle({
	container: {
		borderRadius: 50,
	},
	control: {
		rounded: "full",
	},
	icon: {
		color: "white",
	},
});

export const checkboxTheme = defineMultiStyleConfig({
	baseStyle: baseStyle,
	variants: {
		checkout: checkoutVariant,
		checkoutGreen: checkoutGreenVariant,
		checkoutAddOn: checkoutAddOnVariant,
	},
});
