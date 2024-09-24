import { Textarea, type TextareaProps } from "@chakra-ui/textarea";

interface Props extends TextareaProps {
    hasError: boolean;
}

/**
 * ContactFormTextArea component.
 * @param {TextareaProps} props
 * @returns {JSX.Element}
 */
export default function ContactFormTextarea({ hasError, ...rest }: Props) {
	return (
		<Textarea
			h="200px"
			backgroundColor="black"
			resize="none"
			borderWidth="1px"
			borderColor={hasError ? "red.500" : "black"}
			focusBorderColor="green.100"
			_placeholder={{
				color: "gray",
				fontStyle: "italic",
			}}
			{...rest}
		/>
	);
}
