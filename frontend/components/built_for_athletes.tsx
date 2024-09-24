// pages/built_for_athletes.js
import "@fontsource/barlow-condensed/600-italic.css"; // SemiBold Italic style
import { Box, Flex, Text, Divider, Circle } from "@chakra-ui/react";

/**
 * A page that displays a promotional message for athletes
 * over a background image. Includes a text overlay at the bottom left
 * and a divider with concentric circles at the end at the bottom of the viewport.
 *
 * @returns {JSX.Element} The BuiltForAthletes page component.
 */
export default function BuiltForAthletes() {
	return (
		<Flex
			position="relative"
			direction="column"
			justify="flex-end"
			alignItems="flex-start"
			px={{ base: "24px", lg: "64px", xl: "124px" }}
			pb={{ base: "72px", lg: "96px", xl: "112px" }}
			height="100dvh"
			width="full"
			overflow="clip">
			{/* Fade gradient, only appears when the screen is medium or less. */}
			<Flex
				position="absolute"
				top="0"
				left="0"
				w="full"
				h={{ base: "180px", md: "0" }}
				bgGradient="linear(to-b, #00000000 0%, #27CE00 100%)"
				mixBlendMode="multiply"
				transform="translate3d(0,0,0)"
			/>
			{/* Background Gradient */}
			<Flex
				position="absolute"
				top={{ base: "180px", md: "0" }}
				left="0"
				w="full"
				h="100%"
				bgGradient="linear(to-b, #27CE00 0%, #0A3401 70%, #061D01 100%)"
				mixBlendMode="multiply"
				transform="translate3d(0,0,0)"
			/>

			{/* Text at the bottom left */}
			<Box
				position="relative"
				color="white"
				maxW={{ base: "100%", xl: "50vw" }} // Responsive max width
				fontSize={{ base: "76px", lg: "124px", xl: "188px" }} // Responsive font size
				fontWeight="semibold"
				fontStyle="italic"
				lineHeight={{ base: "64px", lg: "112px", xl: "150px" }}
				fontFamily="'Barlow Condensed', sans-serif"
				textColor="white"
				mb={{ base: "32px", xl: "64px" }}>
				<Text>BUILT FOR</Text>
				<Text>FANS &</Text>
				<Text>ATHLETES</Text>
			</Box>

			{/* Divider with concentric circles at the bottom */}
			<Flex position="relative" width="full" align="center">
				<Divider borderColor="#7ECA31" />
				<Flex justify="center" align="center" position="relative">
					{/* Outer Circle */}
					<Circle size="40px" bg="transparent" borderWidth="1px" borderColor="green.800" />
					{/* Middle Circle */}
					<Circle size="36px" borderWidth="8px" borderColor="gray.700" position="absolute" />
					{/* Inner Circle */}
					<Circle size="20px" bg="#80CA47" borderWidth="1px" borderColor="#80CA47" position="absolute" />
				</Flex>
			</Flex>
		</Flex>
	);
}
