import { radioAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";
import { defineStyleConfig } from "@chakra-ui/react";

const { defineMultiStyleConfig } = createMultiStyleConfigHelpers(radioAnatomy.keys);

const RadioThemes = defineStyleConfig({

	// The styles all button have in common
	baseStyle: {

		// Radio Circle
		control: {

			borderColor: "gray.400",
			_hover: {
				md: {
					borderColor: "green.100",
				}
			},

			_checked: {
				backgroundColor: "green.100",
				borderColor: "green.100",
				color: "green.100",
				_hover: {
					md: {
						backgroundColor: "green.100",
						borderColor: "green.100",
					}
				},
			},
		},

		// Radio Container
		container: {
		},

		// Radio Label
		label: {
			transform: "skewX(-6deg)",
			fontWeight: "bold",
		},
	},

	sizes: {
	},

	// Variants
	variants: {
		searchFilter: {

			// Radio Circle
			control: {
				width: "11px",
				height: "11px",
			},

			// Radio Container
			container: {
			},

			// Radio Label
			label: {
				fontSize: { base: "xs", sm: "14px" },
				fontFamily: "heading",
				transform: "skewX(0)",
				textTransform: "uppercase",
				letterSpacing: "0.1em",
			},

		},
	},
});

export const radioTheme = defineMultiStyleConfig({
	baseStyle: RadioThemes.baseStyle,
	variants: RadioThemes.variants,
});
