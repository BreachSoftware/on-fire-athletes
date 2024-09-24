import { Box, Button, Link } from "@chakra-ui/react";

interface BackButtonProps {
	text: string;
	destination?: string;
	isDisabled?: boolean;
	color?: string;
	borderColor?: string;
	onClick?: () => void
}

/**
 * This is the back button component that can be used to navigate through the app.
 * @param text The text to be displayed on the button.
 * @param destination The destination to navigate to.
 * @returns The back button component.
 */
export default function BackButton(props: BackButtonProps) {

	return (
		<Box width={"min-content"} >

			{/* Out destination */}
			<Link href={props.destination}>

				{/* Button element */}
				<Button
					variant={"back"}
					color={props.color}
					borderColor={props.borderColor}
					size={"sm"}
					onClick={props.onClick}
					isDisabled={props.isDisabled}
				>

					{/* Span for text styling */}
					<span>{props.text}</span>

				</Button>

			</Link>

		</Box>
	);
}
