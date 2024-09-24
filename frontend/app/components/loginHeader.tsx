import { VStack, Heading, Text } from "@chakra-ui/react";

interface LoginHeaderProps {
	title: string;
	subtitle: string;
}

/**
 * Header component for the login or signup page.
 * @param param0 - The component props.
 * @returns The login or signup header component.
 */
export default function LoginHeader({ title, subtitle }: LoginHeaderProps) {

	// If you are on the reset password page, the title and subtitle's font size will be smaller
	const onResetPasswordPage = title.toLocaleLowerCase() === "reset password";

	return (
		<VStack gap="0" pt="10px" pb="30px">
			<Heading
				fontFamily={"Brotherhood"}
				fontSize={{ base: onResetPasswordPage ? "40px" : "76px", sm: "76px" }}
				color={"white"}
				letterSpacing={"3.8px"}
				fontWeight={"regular"}
				lineHeight={"1"}
			>
				{title}
			</Heading>
			<Text
				fontFamily={"Barlow Condensed"}
				fontSize={{ base: onResetPasswordPage ? "18px" : "24px", sm: "28px" }}
				color={"green.100"}
				letterSpacing={"1.12px"}
			>
				{subtitle}
			</Text>
		</VStack>
	);

}
