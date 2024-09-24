import { defineStyleConfig } from "@chakra-ui/react";

const baseStyle = defineStyleConfig({
	baseStyle: {
		// fontWeight: "600",
		position: "relative",
		zIndex: 1,
		borderRadius: "xl",
		_before: {
			position: "absolute",
			content: "\"\"",
			top: 0,
			right: 0,
			bottom: 0,
			left: 0,
			transitionProperty: "common",
			transitionDuration: "normal",
			opacity: 0,
			zIndex: -1,
		},
	},
});

const variants = {
	infoButton: {
		background: "rgba(0,0,0,0.1)",
		borderRadius: "full",
		width: "250px",
	},
	next: {
		"textColor": "#ffffff",
		"backgroundColor": "#27CE00",
		"borderColor": "#27CE00",
		"borderRadius": 24,
		"borderWidth": 1,
		"paddingLeft": 7,
		"paddingRight": 7,
		"width": "100%",
		"fontSize": "xs",
		"textTransform": "uppercase",
		"position": "relative",
		"&:hover": {
			md: {
				"filter": "drop-shadow(0px 0px 5px #27CE00)",
				"width": "130%",
				"& span": {
					transform: "skewX(-6deg)",
				},
			}
		},
		"transition": "all 0.2s ease-in-out",
	},
	back: {
		textColor: "#27CE00",
		borderColor: "#27CE00",
		borderRadius: 24,
		borderWidth: 1,
		paddingLeft: 7,
		paddingRight: 7,
		width: "100%",
		fontSize: "xs",
		textTransform: "uppercase",
	},
	white: {
		backgroundColor: "white",
		height: "36px",
		color: "black",
		borderRadius: 24,
		letterSpacing: "1.5px",
		textTransform: "uppercase",
		fontWeight: "bold",
		paddingLeft: 6,
		paddingRight: 6,
		_hover: {
			md: {
				backgroundColor: "gray.100",
			}
		}
	},
	trendingNow: {
		backgroundColor: "gray.1500",
		height: "36px",
		color: "black",
		borderRadius: 24,
		letterSpacing: "1.5px",
		textTransform: "uppercase",
		fontWeight: "bold",
		paddingLeft: 6,
		paddingRight: 6,
		_hover: {
			md: {
				backgroundColor: "gray.400",
			}
		}
	},
	outline: {
		backgroundColor: "transparent",
		borderColor: "white",
		color: "white",
		borderRadius: 24,
		letterSpacing: "1.5px",
		textTransform: "uppercase",
		fontWeight: "bold",
		paddingLeft: 8,
		paddingRight: 8,
		_hover: {
			md: {
				backgroundColor: "white",
				color: "black",
			}
		}
	},
	mobileStepLeft: {
		backgroundColor: "transparent",
		color: "white",
		letterSpacing: "1.5px",
		textTransform: "uppercase",
		fontWeight: "bold",
		width: "50px",
		paddingLeft: 8,
		paddingRight: 8,
		borderRadius: "0",
		borderRight: "2px solid white",
	},
	mobileStepRight: {
		backgroundColor: "transparent",
		color: "white",
		letterSpacing: "1.5px",
		textTransform: "uppercase",
		fontWeight: "bold",
		width: "50px",
		paddingLeft: 8,
		paddingRight: 8,
		borderRadius: "0",
		borderLeft: "2px solid white",
	},
	dropdown: {
		fontWeight: "medium",
		background: "gray.200",
		textAlign: "left",
		borderWidth: 1,
		borderRadius: "0",
		_disabled: {
			textColor: "gray.400"
		},
	},
	mobile_dropdown: {
		fontWeight: "medium",
		background: "#121212",
		textAlign: "left",
		borderWidth: 1,
		borderRadius: "0",
		_disabled: {
			background: "#121212",
			textColor: "gray.400",
			opacity: null,
		},
	},
	Subjectdropdown: {
		fontWeight: "medium",
		background: "black",
		textAlign: "left",
		borderWidth: 1,
		borderRadius: "0",
		_disabled: {
			textColor: "gray.400"
		},
	},
	SubjectMobile_dropdown: {
		fontWeight: "medium",
		background: "black",
		textAlign: "left",
		borderWidth: 1,
		borderRadius: "0",
		_disabled: {
			background: "#121212",
			textColor: "gray.400",
			opacity: null,
		},
	},
	applyFilter: {
		"textColor": "#ffffff",
		"backgroundColor": "green.100",
		"borderColor": "green.100",
		"borderRadius": 0,
		"width": "100%",
		"fontSize": "xs",
		"textTransform": "uppercase",
		"position": "relative",
		"transition": "all 0.2s ease-in-out",
		"fontFamily": "body",
		"fontWeight": "normal",
		"letterSpacing": "1.2px",
		"&:hover": {
			md: {
				filter: "drop-shadow(0px 0px 5px #27CE00)",
			}
		},
	},
	applyFilterWhite: {
		"textColor": "green.100",
		"backgroundColor": "white.100",
		"borderColor": "white.100",
		"borderRadius": 0,
		"width": "100%",
		"fontSize": "xs",
		"textTransform": "uppercase",
		"position": "relative",
		"transition": "all 0.2s ease-in-out",
		"fontFamily": "body",
		"fontWeight": "normal",
		"letterSpacing": "1.2px",
		"&:hover": {
			md: {
				filter: "drop-shadow(0px 0px 5px #ffffff)",
			}
		},
	},
	filterInactiveTag: {
		"textColor": "green.100",
		"backgroundColor": "transparent",
		"borderColor": "green.100",
		"borderWidth": 1,
		"borderRadius": 24,
		"fontSize": 10,
		"fontWeight": "header",
		"letterSpacing": "1.2px",
		"textTransform": "uppercase",
		"transition": "all 0.2s ease-in-out",
		"&:hover": {
			md: {
				backgroundColor: "green.300",
				textColor: "white",
			}
		},
	},
	filterActiveTag: {
		"textColor": "white",
		"backgroundColor": "green.100",
		"borderColor": "green.100",
		"borderWidth": 1,
		"borderRadius": 24,
		"fontSize": 10,
		"fontWeight": "header",
		"letterSpacing": "1.2px",
		"textTransform": "uppercase",
		"transition": "all 0.2s ease-in-out",
		"&:hover": {
			md: {
				backgroundColor: "green.300",
				textColor: "white",
			}
		},
	},
	captureYourMoment: {
		"backgroundColor": "green.100",
		"transition": "width 0.2s ease-out",
		"fontWeight": 400,
		"letterSpacing": "2px",
		"fontSize": "16px",
		"color": "white",
		"height": "60px",
		"width": "300px",
		"&:hover": {
			md: {
				backgroundColor: "green.600",
				width: "270px",
				fontStyle: "italic",
				fontWeight: 600,
			}
		}
	},
	captureYourMomentMobile: {
		backgroundColor: "green.100",
		fontWeight: 400,
		letterSpacing: "2px",
		fontSize: "16px",
		color: "white",
	},
	watchVideo: {
		backgroundColor: "green.600",
		height: "44px",
		color: "white",
		borderRadius: 22,
		letterSpacing: "1.5px",
		textTransform: "uppercase",
		fontWeight: "bold",
		paddingLeft: 6,
		paddingRight: 6,
		_hover: {
			filter: "drop-shadow(0px 0px 5px #28BC06)",
		},
		transition: "all 0.2s ease-in-out",
	},
};

const defaultProps = {
	variant: "infoButton" as const,
};

export const buttonTheme = defineStyleConfig({
	baseStyle: baseStyle,
	variants: variants,
	defaultProps: defaultProps
});
