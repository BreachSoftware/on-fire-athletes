"use client";

// eslint-disable-next-line no-use-before-define
import React from "react";
import Step, { StepProps } from "./step";
import { Divider, Flex, useBreakpointValue } from "@chakra-ui/react";

interface EasyStepInfoSectionProps {
    steps: StepProps[];
}

/**
 * Renders a section of the info card with a title, description, and button.
 * @param {InfoSectionProps} props - The props for the InfoSection component.
 * @returns {JSX.Element} The rendered InfoSection component.
 */
export default function EasyStepsInfoSection(props: EasyStepInfoSectionProps) {

	// Set the orientation of the divider based on the screen size
	const dividerOrientation = useBreakpointValue({ base: "horizontal", md: "vertical" }) as "horizontal" | "vertical" | undefined;

	return (
		<>
			<Flex
				flexDirection={{ base: "column", md: "row" }}
				width={"100%"}
				gap={{ base: "25px", md: "50px" }}
			>
				<Flex
					width={"100%"}
					flexDirection={{ base: "column", md: "row" }}
					justifyContent={"center"}
					gap={{ base: "38px", md: "8px" }}
				>
					<Divider
						display={{ base: "block", md: "none" }}
						w="100%"
						orientation="horizontal"
						height="100%"
						borderBlockEnd="1px"
						borderColor="white"
						opacity={1}
					/>
					{props.steps.flatMap((step, index) => {
						return [
							<Step
								key={index}
								stepNumber={step.stepNumber}
								stepDescription={step.stepDescription}
								paddingX="12px"
							/>,
							index !== props.steps.length - 1 && (
								<Divider
									key={`divider-${index}`}
									orientation={dividerOrientation}
									height="100%"
									borderBlockEnd="1px" // regular border of 1px makes 2px border
									borderColor="white"
									opacity={1}
								/>
							)
						];
					})}
				</Flex>


			</Flex>
		</>
	);
}
