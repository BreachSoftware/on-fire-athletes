import { accordionAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(accordionAnatomy.keys);

// Color Palette
const styling = {
	backgroundColor: "#000000",
	lightGray: "#E5E5E5",
	limeGreen: "green.100",
	buttonTextColor: "#000000",
	buttonColor: "#000000",
	buttonExpandedColor: "#ffffff",
};

const faq = definePartsStyle({

	// Entire Accordion
	root: {
		border: "none",
	},

	// Seperate Accordion Items
	container: {
		backgroundColor: styling.backgroundColor,
		textAlign: "left",
		fontSize: 12,
		boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
	},

	// Each accordion button title area
	button: {
		paddingRight: "0",
		paddingTop: "0",
	},

	// Child content
	panel: {
		borderColor: "gray.200",
		background: styling.backgroundColor,
		fontSize: 18,
		fontFamily: "Roboto",
	},

	// Icon on right side of button
	icon: {
		border: "1px solid",
		borderColor: "gray.200",
		background: "gray.200",
		borderRadius: "full",
		color: "gray.500",
	},
});

const filter = definePartsStyle({

	// Entire Accordion
	root: {
		border: "none",
	},

	// Seperate Accordion Items
	container: {
		backgroundColor: "gray.1400",
		textAlign: "left",
		padding: 2,
	},

	// Each accordion button title area
	button: {
		paddingRight: "0",
		paddingTop: "0",
		paddingBottom: "0",
		// flip button icon when clicked
		_expanded: {
			"> svg": {
				transform: "rotate(90deg)",
			},
		},
	},

	// Child content
	panel: {
		borderColor: "gray.600",
		fontSize: 18,
		padding: 2,
	},

	// Icon on right side of button
	icon: {
		borderRadius: "0",
		color: "green.100",
	},
});


export const accordionTheme = defineMultiStyleConfig({
	variants: {
		faq: faq,
		filter: filter,
	},
});
