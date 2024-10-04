/* eslint-disable no-undef */
// This disable is needed for the React.KeyboardEvent<HTMLInputElement> type
import { useAuthProps } from "@/hooks/useAuth";
import {
    Flex,
    VStack,
    Heading,
    Input,
    Image,
    Button,
    Text,
    useToast,
    Grid,
    GridItem,
    Spacer,
} from "@chakra-ui/react";
import { ChangeEvent, useEffect, useState } from "react";
import ChevronRightIcon from "../public/next1.png";
import TermsAndConditions from "./auth/termsAgreement";

interface SignUpUIProps {
    onClick: () => void;
    confirmEmail: (
        code: string,
        email: string,
        password: string,
        firstName: string,
        lastName: string,
    ) => Promise<boolean>;
    modal?: boolean;
    auth: useAuthProps;
    onProfile?: boolean;
}

/**
 * The UI for the signup page. Displayed on the login page and the login modal.
 * @param onClick () => void - the function to call when the sign in button is clicked
 * @param confirmEmail (code: string) => Promise<boolean> - the function to call when the confirm email button is clicked
 * @param modal boolean | undefined - whether or not the modal version of the sign up page is being displayed
 * @param auth useAuthProps - the authentication object
 * @returns the signup page UI
 */
export default function SignUpUI({
    onClick,
    confirmEmail,
    auth,
    onProfile,
}: SignUpUIProps) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [validEmail, setValidEmail] = useState(false);
    const [password, setPassword] = useState("");
    // These state variables are used to check if the password and confirm password fields match
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordsMatch, setPasswordsMatch] = useState(false);

    const [validPassword, setValidPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [code, setCode] = useState("");
    const [showCode, setShowCode] = useState(false);
    const [confirmedCode, setConfirmedCode] = useState(false);
    const [validCode, setValidCode] = useState(false);
    const [codeButtonDisabled, setCodeButtonDisabled] = useState(true);
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const toast = useToast();

    // Enable button when email and password are auto-filled
    useEffect(() => {
        const inputs = document.querySelectorAll("input:-webkit-autofill");
        if (inputs && inputs.length > 0) {
            setButtonDisabled(false);
        }
    }, []);

    // Enable button when email and password are correctly filled (with the passwords matching), as well as when the terms are accepted
    useEffect(() => {
        if (email && password) {
            setButtonDisabled(
                email === "" ||
                    password === "" ||
                    !passwordsMatch ||
                    !acceptedTerms,
            );
        }
    }, [acceptedTerms, email, password, passwordsMatch]);

    // Enable code button when code is filled
    useEffect(() => {
        setCodeButtonDisabled(code === "");
    }, [code]);

    // Check if the passwords match after either password field changes
    useEffect(() => {
        if (password && confirmPassword) {
            setPasswordsMatch(password === confirmPassword);
        }
    }, [password, confirmPassword]);

    /**
     * Checks if the email is valid
     * @param email string
     */
    function isValidEmail(email: string): void {
        const notEmpty = email.trim().length !== 0;
        // eslint-disable-next-line max-len
        const emailRegEx =
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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
     * Checks if the password is valid
     * @param password string
     */
    function isPasswordValid(password: string): void {
        const notEmpty = password.trim().length !== 0;
        const hasCapitalLetter = /[A-Z]/.test(password);
        const hasLowercaseLetter = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSymbol = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

        setValidPassword(
            notEmpty &&
                hasCapitalLetter &&
                hasLowercaseLetter &&
                hasNumber &&
                hasSymbol,
        );
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
     * Checks if the confirm password is valid and if it matches the password
     * @param password - The confirm password
     */
    function handleConfirmPasswordChange(
        event: ChangeEvent<HTMLInputElement>,
    ): void {
        const confirmPassword = event.target.value;
        setConfirmPassword(confirmPassword);
        isPasswordValid(confirmPassword);
    }

    /**
     * Handles code input change
     * @param email - The email of the user
     * @param password - The password of the user
     * @param validEmail - Whether the email is valid
     * @param validPassword - Whether the password is valid
     * @returns boolean on whether the operation was successful or not
     */
    async function signUpClicked(
        email: string,
        password: string,
        validEmail: boolean,
        validPassword: boolean,
    ) {
        setIsLoading(true);
        const { username } = await auth.currentAuthenticatedUser();
        if (username) {
            toast({
                title: "Already Signed In",
                description: "Please sign out before creating an account",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
            setIsLoading(false);
            return false;
        }
        if (email === "" || password === "") {
            toast({
                title: "Empty Field",
                description: "Please enter an email and password",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
            setIsLoading(false);
            return false;
        }

        if (validEmail && validPassword) {
            const { success, message } = await auth.signUp(email, password);
            if (success && message === "Message sent") {
                setIsLoading(false);
                setShowCode(true);
                return true;
            } else if (message === "account exists") {
                toast({
                    title: "Account Exists",
                    description:
                        "An account with the given email already exists.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom-left",
                });
                setIsLoading(false);
                return false;
            }
        } else {
            if (!validEmail) {
                toast({
                    title: "Invalid Email",
                    description: "Please enter a valid email",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom-left",
                });
                setIsLoading(false);
                return false;
            }
            if (!validPassword) {
                toast({
                    title: "Invalid Password",
                    description:
                        "Password must contain a capital letter, a lowercase letter, a number, and a symbol",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom-left",
                });
                setIsLoading(false);
                return false;
            }
        }
        setIsLoading(false);
        return false;
    }

    /**
     * Handles form submission when the Enter key is pressed
     * @param event React.KeyboardEvent<HTMLInputElement>
     */
    async function handleKeyPress(
        event: React.KeyboardEvent<HTMLInputElement>,
    ) {
        if (event.key === "Enter") {
            if (showCode) {
                setIsLoading(true);
                setValidCode(code.trim().length !== 0);
                setConfirmedCode(true);
                const success = await confirmEmail(
                    code,
                    email,
                    password,
                    firstName,
                    lastName,
                );
                if (!success) {
                    setIsLoading(false);
                }
            } else {
                await signUpClicked(email, password, validEmail, validPassword);
            }
        }
    }

    /**
     * Handles code input change
     * @param event ChangeEvent<HTMLInputElement>
     */
    function handleCodeChange(event: ChangeEvent<HTMLInputElement>) {
        setCode(event.target.value);
    }

    return (
        // Ensure the entire page is a flex column
        <Flex
            direction="column"
            w="100%"
            h="full"
            px="24px"
            alignItems="center"
        >
            {/* Centering the child sign up modal */}
            <Flex width={"100%"} justifyContent={"center"} mb={6}>
                {/* The sign up modal */}
                <VStack
                    backgroundColor={"gray.1000"}
                    borderRadius={13}
                    p={{ base: "20px", md: onProfile ? "4px" : "52px" }}
                    pb={{ base: "20px", md: onProfile ? "4px" : "63px" }}
                    style={{
                        filter: onProfile
                            ? ""
                            : "drop-shadow(0px 3px 16px #000000C7)",
                    }}
                    w="full"
                    h="fit-content"
                    maxW="964px"
                >
                    {!showCode ? (
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
                                marginBottom={5}
                                fontStyle="italic"
                            >
                                Create Account
                            </Heading>
                            {/* Grid for the input boxes */}
                            <Grid
                                templateRows={{
                                    base: "1fr",
                                    md: "repeat(3, 1fr)",
                                }}
                                templateColumns={{
                                    base: "1fr",
                                    md: "repeat(2, 1fr)",
                                }}
                                gap={6}
                                w={{
                                    base: onProfile ? "115%" : "100%",
                                    md: "100%",
                                }}
                            >
                                <GridItem>
                                    <Input
                                        variant="login"
                                        placeholder="First Name*"
                                        onChange={(event) => {
                                            return setFirstName(
                                                event.target.value,
                                            );
                                        }}
                                        onKeyDown={handleKeyPress}
                                    />
                                </GridItem>
                                <GridItem>
                                    <Input
                                        variant="login"
                                        placeholder="Last Name*"
                                        onChange={(event) => {
                                            return setLastName(
                                                event.target.value,
                                            );
                                        }}
                                        onKeyDown={handleKeyPress}
                                    />
                                </GridItem>
                                <GridItem colSpan={{ base: 1, md: 2 }}>
                                    <Input
                                        variant="login"
                                        placeholder="Email Address*"
                                        onChange={handleEmailChange}
                                        onKeyDown={handleKeyPress}
                                    />
                                </GridItem>
                                <GridItem>
                                    <Input
                                        variant={"login"}
                                        type="password"
                                        placeholder="Password*"
                                        onChange={handlePasswordChange}
                                        onKeyDown={handleKeyPress}
                                    />
                                </GridItem>
                                <GridItem>
                                    <Input
                                        variant={"login"}
                                        type="password"
                                        placeholder="Confirm Password*"
                                        onChange={handleConfirmPasswordChange}
                                        onKeyDown={handleKeyPress}
                                    />
                                    {/* Only show this message if the password and confirmPassword parameters are typed in, and the passowrds do not match */}
                                </GridItem>
                            </Grid>
                            {password && confirmPassword && !passwordsMatch && (
                                <Flex w="full" gap={6}>
                                    <Spacer />
                                    <Text flex={1} color="red.500">
                                        Passwords do not match!
                                    </Text>
                                </Flex>
                            )}

                            <Flex
                                direction={{ base: "column" }}
                                mt="32px"
                                gap="18px"
                                align="flex-start"
                                color="white"
                                fontSize={14}
                                fontWeight={300}
                                w="100%"
                                justifyContent={"flex-start"}
                                paddingLeft={1}
                            >
                                {/* Terms and Conditions Agreement */}
                                <TermsAndConditions
                                    isAccepted={acceptedTerms}
                                    setIsAccepted={setAcceptedTerms}
                                />
                                {/* Sign Up Button */}
                                <Flex w="full" justify="flex-end">
                                    <Button
                                        w="fit-content"
                                        isLoading={isLoading}
                                        onClick={() => {
                                            setIsLoading(true);
                                            return signUpClicked(
                                                email,
                                                password,
                                                validEmail,
                                                validPassword,
                                            );
                                        }}
                                        variant="next"
                                        _hover={{
                                            filter: "drop-shadow(0px 0px 5px #27CE00)",
                                            width: "fit-content",
                                            "& span": {
                                                transform: "skewX(-6deg)",
                                            },
                                        }}
                                        isDisabled={
                                            buttonDisabled || !acceptedTerms
                                        }
                                        letterSpacing={2}
                                    >
                                        Sign Up
                                    </Button>
                                </Flex>
                            </Flex>
                        </>
                    ) : (
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
                                marginBottom={5}
                                fontStyle="italic"
                            >
                                We sent you a code
                            </Heading>
                            <Text color="white" width={"100%"}>
                                Please enter the 6-digit code we sent to:
                            </Text>
                            <Text
                                color="white"
                                maxW={{ base: "85%", md: "65%" }}
                                marginBottom={5}
                            >
                                {email}
                            </Text>

                            <Input
                                width={"100%"}
                                backgroundColor={"black"}
                                borderColor={"black"}
                                mb={5}
                                _placeholder={{
                                    color: "gray",
                                    fontStyle: "italic",
                                }}
                                onKeyDown={handleKeyPress}
                                onChange={handleCodeChange}
                                value={code}
                                placeholder="Code*"
                                size="md"
                                marginBottom={5}
                                errorBorderColor="red.300"
                                isInvalid={!validCode && confirmedCode}
                            />

                            <Button
                                maxW={"100%"}
                                variant="next"
                                isLoading={isLoading}
                                isDisabled={codeButtonDisabled}
                                onClick={async () => {
                                    setIsLoading(true);
                                    setValidCode(code.trim().length !== 0);
                                    setConfirmedCode(true);
                                    const success = await confirmEmail(
                                        code,
                                        email,
                                        password,
                                        firstName,
                                        lastName,
                                    );
                                    if (!success) {
                                        setIsLoading(false);
                                    }
                                }}
                            >
                                Confirm
                            </Button>
                        </>
                    )}
                </VStack>
            </Flex>
            {/* Already have an account button */}
            {!showCode && (
                <Flex
                    width="100%"
                    maxW="964px"
                    h="fit-content"
                    justifyContent="center"
                    marginTop={{ md: "46px" }}
                    marginBottom={onProfile ? 1 : 5}
                >
                    <Flex
                        backgroundColor="gray.1000"
                        borderColor={"#171C1B"}
                        borderRadius={13}
                        align={"center"}
                        w="full"
                        justifyContent={"center"}
                        gap="18px"
                        px={{ base: "24px", md: "50px" }}
                        py={{ base: "16px", md: "24px" }}
                        style={{
                            filter: onProfile
                                ? ""
                                : "drop-shadow(0px 3px 16px #000000C7)",
                        }}
                        _hover={{ cursor: "pointer" }}
                        onClick={onClick}
                    >
                        <Text
                            fontWeight="bold"
                            fontStyle="italic"
                            fontSize="22px"
                            fontFamily="Barlow Condensed"
                            letterSpacing="1.1px"
                            color="white"
                        >
                            Already Have An Account?
                        </Text>
                        <Image src={ChevronRightIcon.src} alt="" />
                    </Flex>
                </Flex>
            )}
        </Flex>
    );
}
