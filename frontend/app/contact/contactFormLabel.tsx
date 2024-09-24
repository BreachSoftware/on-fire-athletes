import { Text, type TextProps } from "@chakra-ui/layout";

/**
 * ContactFormLabel component.
 * @param {TextProps} props
 * @returns {JSX.Element}
 */
export default function ContactFormLabel({ children, ...rest }: TextProps) {
	return (
		<Text
			fontWeight="bold"
			fontFamily="Barlow"
			fontSize={{ base: "sm", sm: "md" }}
			{...rest}
		>
			{children}
		</Text>
	);
}
