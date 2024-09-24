
"use client";

import {
	Flex,
	Text,
	useBreakpointValue,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";

// props
interface CheckItemProps {
	text: string;
}

/**
 * CheckItem component
 * @returns JSX.Element
 */
export default function CheckItem(props: CheckItemProps) {

	return (
		<>
			{/* Small check on left, followed by text */}
			<Flex direction="row" align="center">
				<CheckIcon />
				<Text
					ml={5}
					// scale text size based on screen size
					fontSize={useBreakpointValue({ base: "xs", lg: "sm" })}
				>
					{props.text}
				</Text>
			</Flex>
		</>
	);
}
