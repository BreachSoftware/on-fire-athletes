import { defineStyleConfig } from "@chakra-ui/react";

export const TooltipTheme = defineStyleConfig({
	baseStyle: {
		bg: "green.600",
		color: "white",
		borderRadius: "1px",
		fontFamily: "Barlow Condensed",
		fontSize: "20px",
		fontStyle: "italic",
	},
	variants: {
		icon: {
			bg: "transparent",
			color: "white",
			fontFamily: "Barlow Condensed",
			fontSize: "20px",
			fontStyle: "italic",
		},
		warning: {
			bg: "green.600",
			color: "white",
			fontFamily: "Roboto",
			fontSize: "16px",
			fontStyle: "italic",
		},
	},
});
