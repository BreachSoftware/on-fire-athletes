/* eslint-disable no-undef */
import { Flex, SystemStyleObject } from "@chakra-ui/react";

interface ViewedCardActionButtonProps {
  children: React.ReactNode;
  opacity: string;
  hover: SystemStyleObject;
  alignSelf?: string;
  onClick: () => void;
  outline?: boolean; // New optional prop
}

/**
 * The component for the action button on the viewed card
 * @param props - the props for the component
 */
export default function ViewedCardActionButton(props: ViewedCardActionButtonProps) {
	const outlinedStyles = props.outline ?
		{
			bgColor: "transparent",
			border: "2px solid",
			borderColor: "green.600",
			color: "green.600",
			_hover: {
				borderColor: props.hover.bgColor ? props.hover.bgColor as string : undefined,
				cursor: "pointer",
				...props.hover,
			},
		} :
		{
			bgColor: "green.600",
			color: "white",
		};

	return (
		<Flex
			w={{ base: "98%", md: "200px" }}
			minH={"40px"}
			alignSelf={props.alignSelf ? props.alignSelf : "flex-start"}
			borderRadius={"24px"}
			align="center"
			justify="center"
			opacity={props.opacity}
			_hover={{
				md: {
					...props.hover,
				}
			}}
			transitionDuration="0.2s"
			transitionTimingFunction="ease-in-out"
			onClick={props.onClick}
			{...outlinedStyles}
		>
			{props.children}
		</Flex>
	);
}
