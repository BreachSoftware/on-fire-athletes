import { keyframes, Box, Flex } from "@chakra-ui/react";

/**
 * AnimatedSlider
 * The slider component on the homepage.
 * @returns {JSX.Element} The animated slider component.
 */
export default function AnimatedSlider() {
	// Keyframes for the slider animation, split into 8 steps to match with the animations for the text component
	const sliderAnim = keyframes`
        0% {max-width: 0%;}
        6.25% {max-width: 33%;}
        31.25% {max-width: 33%;}
        37.5% {max-width: 66%;}
        62.5% {max-width: 66%;}
        68.75% {max-width: 100%;}
        93.75% {max-width: 100%}
        100% {max-width: 100%;}
    `;

	// Animation text to be applied to the slider
	const animation = `${sliderAnim} 4s ease-out infinite;`;

	return (
		<>
			{/* Slider component wrapper to set the width of the slider */}
			<Flex w={{ base: "256px", md: "484px", xl: "650px" }} h="5px" borderRadius="full" backgroundColor={{ base: "#181d1a", md: "black" }}>
				{/* Slider component animated portion */}
				<Box
					w="100%"
					h="5px"
					maxW="0px"
					bg="#27CE00"
					rounded="full"
					filter={{ base: "drop-shadow(0 0 8px #44FF19)", md: "drop-shadow(0 0 15px #44FF19)" }}
					animation={animation}
				/>
			</Flex>
		</>
	);
}
