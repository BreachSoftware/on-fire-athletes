import { menuAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(menuAnatomy.keys);

// define the base component styles
const baseStyle = definePartsStyle({
	// define the part you're going to style
	button: {
		// For the dropdown on the card create flow, this is being styled in Button.ts
	},
	list: {
		borderRadius: "0",
		border: "none",
		overflowY: "auto",
		maxHeight: "300px",
	},
	item: {
		bg: "white",
		color: "black",
		_hover: {
			md: {
				bg: "green.100",
				color: "white",
			}
		},
		_focus: {
			bg: "green.100",
			color: "white",
		},
	},
	groupTitle: {
		textTransform: "uppercase",
		color: "white",
		letterSpacing: "wider",
		opacity: "0.7",
	},
	command: {
		opacity: "0.8",
		fontFamily: "mono",
		fontSize: "sm",
		letterSpacing: "tighter",
		pl: "4",
	},
	divider: {
		my: "4",
		borderColor: "white",
		borderBottom: "2px dotted",
	},
});

export const menuTheme = defineMultiStyleConfig({ baseStyle: baseStyle });
