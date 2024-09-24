import { Box, Text, keyframes } from "@chakra-ui/react";
import { Keyframes } from "@emotion/react";
import { PropsWithChildren } from "react";

/**
 * SplashText
 * A shared component to change the styling for the looping text
 * @returns {JSX.Element} The styled component for the looping text
 */
function SplashText({ children, animation, isAbsoluted }: PropsWithChildren<{ animation: string; isAbsoluted?: boolean }>) {
	return (
		<Text
			position={isAbsoluted ? "absolute" : "relative"}
			top={0}
			left={0}
			opacity={0}
			fontFamily="Brotherhood"
			fontSize={{ base: "64px", lg: "96px", xl: "125px" }}
			color="green.100"
			textShadow="0px 10px 6px #00000084"
			userSelect="none"
			marginLeft="6px"
			animation={animation}>
			{children}
		</Text>
	);
}

/**
 * Animated Text
 * The animated text component for the homepage, with looping text
 * @returns {JSX.Element} The animated text component
 */
export default function AnimatedText() {
	// Keyframes for the text animations, split into 8 steps to match with the animations for the slider component
	const captureAnim = keyframes`
        0% {opacity: 0;}
        6.25% {opacity: 1;}
        31.25% {opacity: 1;}
        37.5% {opacity: 0;}
        62.5% {opacity: 0;}
        68.75% {opacity: 0;}
        93.75% {opacity: 0}
        100%% {opacity: 0;}
    `;

	const createAnim = keyframes`
        0% {opacity: 0;}
        6.25% {opacity: 0;}
        31.25% {opacity: 0;}
        37.5% {opacity: 1;}
        62.5% {opacity: 1;}
        68.75% {opacity: 0;}
        93.75% {opacity: 0}
        100% {opacity: 0;}
    `;

	const customizeAnim = keyframes`
        0% {opacity: 0;}
        6.25% {opacity: 0;}
        31.25% {opacity: 0;}
        37.5% {opacity: 0;}
        62.5% {opacity: 0;}
        68.75% {opacity: 1;}
        93.75% {opacity: 1;}
        100%% {opacity: 0;}
    `;

	/**
	 * getAnimString
	 * Function to get the animation string for the text so that they can all be changed at once
	 * @param keyframe The keyframe to use
	 * @returns The animation string
	 */
	function getAnimString(keyframe: Keyframes) {
		return `${keyframe} 4s ease-in infinite;`;
	}

	return (
		<Box position="relative" height="fit-content" mb={{ base: "-48px", lg: "-72px", xl: "-96px" }} width="full" zIndex={2}>
			{/* One of the text components is position="relative" so that the parent and conform to the height of the text */}
			<SplashText animation={getAnimString(captureAnim)}>Capture</SplashText>
			<SplashText animation={getAnimString(createAnim)} isAbsoluted>
				Create
			</SplashText>
			<SplashText animation={getAnimString(customizeAnim)} isAbsoluted>
				Customize
			</SplashText>
		</Box>
	);
}
