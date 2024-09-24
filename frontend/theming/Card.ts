import { cardAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(cardAnatomy.keys);

const baseStyle = definePartsStyle({

	container: {
	},
	header: {
		paddingBottom: "2px",
	},
	body: {
		paddingTop: "2px",
	},
	footer: {
		paddingTop: "2px",
	},

});

const variants = {
	digital: {
		header: {
			color: "green.100",
		},
		container: {
			backgroundColor: "white.100",
			borderRadius: 15,
		},
		body: {
			color: "black",
		},
		footer: {
			paddingTop: "2px",
		},
	},

	physical: {
		header: {
			color: "white.100",
		},
		container: {
			backgroundColor: "green.100",
			borderRadius: 15,
		},
		body: {
			paddingTop: "2px",
		},
		footer: {
			paddingTop: "2px",
		},
	},

	cart: {
		header: {
			color: "#848786",
		},
		container: {
			backgroundColor: "#171C1B",
			borderRadius: "8px",
		},
		body: {
			color: "white",
		}
	}

};

const sizes = {
	md: definePartsStyle({
		container: {
			borderRadius: "0px",
		},
	}),
};

export const cardTheme = defineMultiStyleConfig({
	baseStyle: baseStyle,
	sizes: sizes,
	variants: variants,
});
