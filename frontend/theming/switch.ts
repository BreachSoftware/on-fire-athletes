import { switchAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(switchAnatomy.keys);

const baseStyle = definePartsStyle({
});

const variants = {
	toggle: {
		container: {
			color: "white",
			height: "32px",
			width: "188px",
		},
		thumb: {
			bg: "green.100",
			width: "60%",
			height: "119%",
			position: "relative",
			bottom: "9.5%",
			left: "-2%",
			border: "1px solid white",
			padding: "0px",
			margin: "0px",
			_checked: {
				transform: "translateX(73%)",
			},
		},
		track: {
			width: "180px",
			height: "100%",
			bg: "gray.400",
			border: "1px solid white",
			_checked: {
				bg: "gray.400",
			},
		},
	},
};

export const switchTheme = defineMultiStyleConfig({ baseStyle: baseStyle, variants: variants });
