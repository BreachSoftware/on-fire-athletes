import { Box, Button, Link } from "@chakra-ui/react";

interface NextButtonProps {
	text: string;
	destination?: string;
	isDisabled?: boolean;
	isLoading?: boolean;
	disableHoverGrow?: boolean;
	onClick?: () => void
}

/**
 * This is the next button component that can be used to navigate through the app.
 * @param text The text to be displayed on the button.
 * @param destination The destination to navigate to.
 * @returns The next button component.
 */
export default function NextButton(props: NextButtonProps) {
	return (
		<Box width={"min-content"}>
			<Link href={props.destination}>
				<Button
					variant={"next"}
					size={"sm"}
					isLoading={props.isLoading}
					onClick={props.onClick}
					isDisabled={props.isDisabled}
					_hover={props.disableHoverGrow ? { width: "100%" } : {}}
				>
					<span>{props.text}</span>
				</Button>
			</Link>
		</Box>
	);
}
