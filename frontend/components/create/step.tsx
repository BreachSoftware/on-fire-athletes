"use client";

// eslint-disable-next-line no-use-before-define
import { Flex, FlexProps, Heading, Text } from "@chakra-ui/react";

export interface StepProps extends FlexProps {
    stepNumber: number;
    stepDescription: string;
}

/**
 * Renders a section of the info card with a title, description, and button.
 * @param {InfoSectionProps} props - The props for the InfoSection component.
 * @returns {JSX.Element} The rendered InfoSection component.
 */
export default function Step({ stepNumber, stepDescription, ...rest }: StepProps) {
	return (
		<>
			<Flex
				gap="15px"
				alignItems="center"
				flexDirection={"column"}
				width={{ base: "70%", md: "100%" }}
				height={"100%"}
				alignSelf={"center"}
				{...rest}
			>
				<Text
					style={{
						color: "transparent",
						WebkitTextStrokeWidth: "1.1pt",
						WebkitTextStrokeColor: "white",
					}}
					fontSize={"80px"}
					lineHeight="0.75"
					fontWeight={"200"}
					fontStyle="italic"
					marginRight={5}
					letterSpacing="-5px"
				>
					0{stepNumber}
				</Text>
				<Heading
					// The slightest amount of boldness
					style={{
						WebkitTextStrokeWidth: "0.3pt",
						WebkitTextStrokeColor: "white",
					}}
					fontSize={"22px"}
					letterSpacing={"1.5px"}
					textColor="white"
					fontStyle="italic"
					textAlign={"center"}
					fontWeight={"600"}
				>
					{stepDescription}
				</Heading>
			</Flex>

		</>
	);
}
