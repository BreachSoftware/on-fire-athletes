import { defineStyleConfig } from "@chakra-ui/react";

export const textareaTheme = defineStyleConfig({
	baseStyle: {
		borderRadius: "none",
		bg: "gray.600",
		paddingLeft: "20px",
		color: "white",
		_placeholder: {
			color: "gray.400",
		},
		_focus: {
			borderColor: "green.200",
		},
	},
	defaultProps: {
		variant: "",
	},
});
