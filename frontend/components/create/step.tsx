"use client";

// eslint-disable-next-line no-use-before-define
import { Box, Flex, FlexProps, Heading, Text } from "@chakra-ui/react";

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
				gap={{ base: "10px", md: "15px" }}
				alignItems="center"
				flexDirection="column"
				width="100%"
				height="100%"
				alignSelf="center"
				// py={{ base: 6, md: 0 }}
				{...rest}>
				<Box py={{ base: "4px", md: "24px" }}>
					<Box pos="relative">
						<Text
							color="white"
							style={{
								WebkitTextStrokeWidth: "2.4pt",
								WebkitTextStrokeColor: "white",
							}}
							fontSize={{ base: "50px", md: "80px" }}
							lineHeight="0.75"
							fontWeight={"900"}
							fontStyle="italic"
							marginRight={2}
							letterSpacing={{ base: "0", md: "-1px" }}>
							0{stepNumber}
						</Text>
						<Text
							pos="absolute"
							top={0}
							left={0}
							color="#27CE00"
							fontSize={{ base: "50px", md: "80px" }}
							lineHeight="0.75"
							fontWeight={"900"}
							fontStyle="italic"
							marginRight={2}
							letterSpacing={{ base: "0", md: "-1px" }}>
							0{stepNumber}
						</Text>
					</Box>
				</Box>
				<Heading
					// The slightest amount of boldness
					style={{
						WebkitTextStrokeWidth: "0.4pt",
						WebkitTextStrokeColor: "white",
					}}
					maxW="290px"
					fontSize={{ base: "25px", md: "30px" }}
					letterSpacing={"1.5px"}
					lineHeight="30px"
					textColor="white"
					fontStyle="italic"
					textAlign={"center"}
					fontWeight={"500"}>
					{stepDescription}
				</Heading>
			</Flex>
		</>
	);
}
