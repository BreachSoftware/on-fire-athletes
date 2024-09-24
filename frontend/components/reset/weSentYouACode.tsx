/* eslint-disable no-undef */
// The no-undef is disabled because the IDE does not recognize React as a global variable
import { useAuth } from "@/hooks/useAuth";
import { Heading, Flex, Input, Button, Text, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";

interface WeSentYouACodeProps {
	email: string;
}

/**
 * This component is used to display the message that a code has been sent to the user's email.
 * @param email - The user's email
 */
export default function WeSentYouACode({ email }: WeSentYouACodeProps) {

	const auth = useAuth();
	const toast = useToast();
	const router = useRouter();

	const [ code, setCode ] = useState("");
	const [ invalidCode, setInvalidCode ] = useState(false);
	const [ isLoading, setIsLoading ] = useState(false);
	const [ password, setPassword ] = useState("");
	const [ validPassword, setValidPassword ] = useState(false);

	/**
	 * Checks if the password is valid
	 * @param password string
	 */
	function isPasswordValid(password: string): void {
		const notEmpty = password.trim().length !== 0;
		const hasCapitalLetter = (/[A-Z]/).test(password);
		const hasLowercaseLetter = (/[a-z]/).test(password);
		const hasNumber = (/\d/).test(password);
		const hasSymbol = (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/).test(password);

		setValidPassword(notEmpty && hasCapitalLetter && hasLowercaseLetter && hasNumber && hasSymbol);
	}

	/**
	 * Handles code input change
	 * @param event ChangeEvent<HTMLInputElement>
	 */
	function handleCodeChange(event: ChangeEvent<HTMLInputElement>) {
		if (invalidCode) {
			setInvalidCode(false);
		}
		setCode(event.target.value);
	}

	/**
	 * Checks if the code confirmation button should be disabled
	 * @returns boolean
	 */
	function codeButtonDisabled() {
		return code === "" || code.length !== 6 || password === "";
	}

	/**
	 * Handles password input change
	 * @param event ChangeEvent<HTMLInputElement>
	 */
	function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
		setPassword(event.target.value);
		isPasswordValid(event.target.value);
	}

	/**
	 * Confirms the reset password with the provided code
	 */
	async function confirmReset() {
		// check valid password
		setIsLoading(true);

		if (code.trim().length !== 0 && code.trim().length === 6 && validPassword) {
			const { success, message } = await auth.confirmReset(email.trim(), code.trim(), password.trim());
			if (success) {
				toast({
					title: "Password Reset",
					description: "Your password has been reset",
					status: "success",
					duration: 5000,
					isClosable: true,
					position: "bottom-left",
				});
				setTimeout(() => {
					router.push("/login");
				}, 2000);

			} else if(message === "Invalid Code") {
				setInvalidCode(true);
				setIsLoading(false);
				toast({
					title: "Incorrect Code",
					description: "The code you entered is incorrect",
					status: "error",
					duration: 5000,
					isClosable: true,
					position: "bottom-left",
				});
			}
		} else if(!validPassword) {
			toast({
				title: "Invalid Password",
				description: "Please enter a valid password",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom-left",
			});
			setIsLoading(false);
		} else {
			toast({
				title: "Reset Failed",
				description: "Please make sure you have entered a valid code and password",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom-left",
			});
			setIsLoading(false);
		}

	}

	/**
	 * Handles form submission when the Enter key is pressed
	 * @param event React.KeyboardEvent<HTMLInputElement>
	 */
	function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key === "Enter") {
			confirmReset();
		}
	}

	return (
		<>
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
				mb={5}
			>
				We sent you a code
			</Heading>
			<Flex direction="column" w="100%">
				<Text color="white" maxW={"100%"}>
					Please enter the 6-digit code we sent to:
				</Text>
				<Text color="green.100" maxW={"100%"} marginBottom={5}>
					{email}
				</Text>
			</Flex>
			<Input
				value={code}
				type={"number"}
				placeholder="Code"
				size="md"
				marginBottom={5}
				onChange={handleCodeChange}
				isInvalid={invalidCode}
				onKeyDown={handleKeyPress}
				width={"100%"}
				backgroundColor={"black"}
				borderColor={"black"}
				_placeholder={{
					color: "gray",
					fontStyle: "italic",
				}}
			/>
			<Input
				type="password"
				mb={5}
				placeholder="New Password"
				onChange={handlePasswordChange}
				onKeyDown={handleKeyPress}

				errorBorderColor="red.300"
				width={"100%"}
				backgroundColor={"black"}
				borderColor={"black"}
				_placeholder={{
					color: "gray",
					fontStyle: "italic",
				}}
			/>
			<Flex justifyContent={"flex-end"} w={"100%"}>
				<Button
					width={{ base: "40%", md: "35%" }}
					_hover={{ md: { width: "40%" } }}
					letterSpacing={2}
					variant="next"
					isLoading={isLoading}
					isDisabled={codeButtonDisabled()}
					onClick={confirmReset}
				>
					Confirm
				</Button>
			</Flex>
		</>
	);

}
