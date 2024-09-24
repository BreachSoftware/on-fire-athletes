// eslint-disable-next-line no-use-before-define
import React from "react";
import { Flex } from "@chakra-ui/react";


export interface InfoSectionProps {
    description: string | React.JSX.Element;
    buttonTitle?: string;
	buttonLink?: string;
	usesRouter?: boolean;
}

/**
 * Renders a section of the info card with a title, description, and button.
 * @param {InfoSectionProps} props - The props for the InfoSection component.
 * @returns {JSX.Element} The rendered InfoSection component.
 */
export default function InfoSection(props: InfoSectionProps) {

	return (
		<>
			<Flex direction="column" margin={"15px 0px"} padding={"0px 5px"} justifyContent={"space-between"} width={"100%"}>
				{props.description}
			</Flex>
		</>
	);
}
