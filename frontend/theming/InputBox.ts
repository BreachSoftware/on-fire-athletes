import { inputAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(inputAnatomy.keys);

const baseStyle = definePartsStyle({
	field: {
		borderRadius: "none",
		bg: "gray.600",
		padding: "20px",
		color: "white",
		_placeholder: {
			color: "gray.400",
		},
	},
});

const basicVariant = definePartsStyle({
	field: {
		borderRadius: "none",
		bg: "gray.600",
		padding: "20px",
		color: "white",
		border: "2px solid",
		borderColor: "gray.1800",
		_placeholder: {
			color: "gray.400",
		},
		_focus: {
			borderColor: "green.100",
		},
	},
});

// Search variant
const searchVariant = definePartsStyle({
	field: {
		borderRadius: 34,
		border: "2px solid",
		borderColor: "white",
		bg: "transparent",
		color: "white.100",
		_placeholder: {
			color: "white",
		},
		_focus: {
			borderColor: "green.100",
		},
		_hover: {
			md: {
				borderColor: "green.100",
			},
		},
	},

	element: {},
});

const profileVariant = definePartsStyle({
	field: {
		border: "solid 1px #88888888",
		bg: "gray.200",
		padding: "0px 10px",
		color: "white",
		_placeholder: {
			color: "gray.400",
		},
	},
});

const checkoutVariant = definePartsStyle({
	field: {
		border: "solid 1px black",
		bg: "black",
		color: "white",
		_placeholder: {
			color: "gray.400",
		},
		height: { base: "32px", md: "45px" },
		_focus: {
			borderColor: "green.100",
		},
		fontSize: { base: "13px", md: "18px" },
	},
	element: {
		height: { base: "32px", md: "45px" },
	}
});

const loginVariant = definePartsStyle({
	field: {
		width: "100%",
		backgroundColor: "black",
		borderColor: "black",
		fontSize: "18px",
		letterSpacing: "0.36px",
		_placeholder: {
			fontWeight: "light",
			fontStyle: "italic",
		},
		borderWidth: "2px",
		_focus: {
			backgroundColor: "#17201F",
			borderColor: "limegreen",
		},
	},
});

export const inputTheme = defineMultiStyleConfig({
	baseStyle: baseStyle,
	variants: {
		search: searchVariant,
		profile: profileVariant,
		checkout: checkoutVariant,
		login: loginVariant,
		basicInput: basicVariant,
	},
});
