import { Input, type InputProps } from "@chakra-ui/input";

interface Props extends InputProps {
    hasError: boolean;
}

/**
 * ContactFormInput component.
 * @param {InputProps} props
 * @returns {JSX.Element}
 */
export default function ContactFormInput({ hasError, ...rest }: Props) {
	return (
		<Input
			h="40px"
			backgroundColor="black"
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
