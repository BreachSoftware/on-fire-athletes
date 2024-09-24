/* eslint-disable no-undef */
// The no-undef is disabled because the IDE does not recognize React as a global variable
import { useAuth } from "@/hooks/useAuth";
import { Flex, Heading, Input, useToast, Button, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

import { ChangeEvent, useState } from "react";

interface ResetYourPasswordProps {
	setShowCode: (showCode: boolean) => void;
	email: string;
	setEmail: (email: string) => void;
}

/**
 * This is used to show the reset password form
 * @param setShowCode - A function to set the showCode state
 * @param email - The user's email
 * @param setEmail - A function to set the email state
 */
export default function ResetYourPassword({ setShowCode, email, setEmail }: ResetYourPasswordProps) {

	const auth = useAuth();
	const toast = useToast();
	const router = useRouter();
	const [ isLoading, setIsLoading ] = useState(false);
	const [ validEmail, setValidEmail ] = useState(false);

	/**
	 * Checks if the email is valid
	 * @param email string
	 */
	function isValidEmail(email: string): void {
		const notEmpty = email.trim().length !== 0;
		// eslint-disable-next-line max-len
		const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		setValidEmail(notEmpty && emailRegEx.test(email));
	}

	/**
	 * Handles email input change
	 * @param event ChangeEvent<HTMLInputElement>
	 */
	function handleEmailChange(event: ChangeEvent<HTMLInputElement>): void {
		setEmail(event.target.value);
		isValidEmail(event.target.value);
	}

	/**
	 * Handles sign-up button click
	 * @param email string
	 * @param password string
	 */
	async function resetClicked(email: string) {
		setIsLoading(true);
		if (email === "") {
			toast({
				title: "Empty Field",
				description: "Please enter an email",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom-left",
			});
			setIsLoading(false);
			return;
		}

		if (validEmail) {
			const { success, message } = await auth.reset(email.trim());


			if (success && message === "Message sent") {
				setShowCode(true);
			}

			if (message === "account doesn't exists") {
				toast({
					title: "Account Doesn't Exists",
					description: "An account with the given email doesn't exist.",
					status: "error",
					duration: 5000,
					isClosable: true,
					position: "bottom-left",
				});
			}
		} else if (!validEmail) {
			toast({
				title: "Invalid Email",
				description: "Please enter a valid email",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom-left",
			});
		}
		setIsLoading(false);
	}

	/**
	 * Handles form submission when the Enter key is pressed
	 * @param event React.KeyboardEvent<HTMLInputElement>
	 */
	function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key === "Enter") {
			resetClicked(email);
		}
	}

	/**
	 * Checks if the sign-up button should be disabled
	 * @returns boolean
	 */
	function buttonDisabled() {
		return email === "";
	}

	return <>
		<Flex w="100%" justifyContent={"space-between"} marginBottom={5}>
			<Heading
				width={"100%"}
				alignSelf={"flex-start"}
				letterSpacing={1.6}
				fontSize={32}
				fontWeight="bold"
				opacity={1}
				fontFamily="Barlow Condensed"
				color="white"
				fontStyle="italic"
			>
			Reset Your Password
			</Heading>
		</Flex>
		<Input
			mb={5}
			placeholder="Email"
			onChange={handleEmailChange}
			onKeyDown={handleKeyPress}
			width={"100%"}
			backgroundColor={"black"}
			borderColor={"black"}
			// maxW={{ base: modal ? "100%" : "85%", md: "65%" }}
			_placeholder={{
				color: "gray",
				fontStyle: "italic",
			}}
			variant={"login"}
		/>
		<Flex justifyContent={"flex-end"} w="100%">
			<Button
				width={{ base: "40%", md: "35%" }}
				_hover={{ md: { width: "40%" } }}
				isLoading={isLoading}
				onClick={() => {
					return resetClicked(email);
				} }
				variant="next"
				isDisabled={buttonDisabled()}
				letterSpacing={2}
			>
				Submit
			</Button>
		</Flex>
		{/* Already have an account? */}
		<Flex
			w={{ base: "85%", md: "65%" }}
			justifyContent="center"
			color="white"
			fontFamily="Barlow Condensed"
			fontSize="sm"
			marginTop={5}
		>
			<Text color="white" maxW={{ base: "85%", md: "65%" }}>
				Already have an account?
			</Text>
			<Button
				variant="link"
				color="green.600"
				onClick={() => {
					router.push("/login");
				}}
				ml={2}
			>
				Sign In
			</Button>
		</Flex>

	</>;
}
