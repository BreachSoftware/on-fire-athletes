/* eslint-disable no-undef */
// This disable is needed for the React.KeyboardEvent<HTMLInputElement> type
import {
    Flex,
    VStack,
    Heading,
    Input,
    Text,
    Button,
    Image,
    useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import ChevronRightIcon from "../public/next1.png";

interface LoginUIProps {
    signInClicked: (username: string, password: string) => Promise<boolean>;
    onClick: () => void;
    router: AppRouterInstance;
    modal?: boolean;
    onProfile?: boolean;
}

/**
 * The UI for the login page. Displayed on the login page and the login modal.
 * @param signInClicked (username: string, password: string) => Promise<boolean> - the function to call when the sign in button is clicked
 * @param onClick () => void - the function to call when the sign up button is clicked
 * @param router AppRouterInstance - the router instance
 * @param modal boolean | undefined - whether or not the modal version of the login page is being displayed
 * @returns the login page UI
 */
export default function LoginUI({
    signInClicked,
    onClick,
    router,
    onProfile,
}: LoginUIProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);

    const toast = useToast();

    // Enable button when email and password are auto-filled
    useEffect(() => {
        const inputs = document.querySelectorAll("input:-webkit-autofill");
        if (inputs && inputs.length > 0) {
            setButtonDisabled(false);
        }
    }, []);

    // Enable button when email and password are filled
    useEffect(() => {
        setButtonDisabled(email === "" || password === "");
    }, [email, password]);

    /**
     * Checks if the sign in button should be loading
     */
    async function checkIfButtonShouldBeLoading() {
        setIsLoading(true);
        const success = await signInClicked(email, password);
        if (!success) {
            setIsLoading(false);
        }
    }

    /**
     * Handles form submission when the Enter key is pressed
     * @param event React.KeyboardEvent<HTMLInputElement>
     */
    function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter") {
            if (!buttonDisabled) {
                setIsLoading(true);
                checkIfButtonShouldBeLoading();
            } else {
                toast({
                    title: "Error signing in",
                    description: "Please fill in all required fields.",
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                    position: "bottom-left",
                });
            }
        }
    }

    return (
        // Ensure the entire page is a flex column
        <Flex
            direction="column"
            w="100%"
            alignItems="center"
            h="full"
            px="24px"
        >
            {/* Centering the child login modal */}
            <Flex width={"100%"} justifyContent={"center"} mb={6}>
                {/* The Login Modal */}
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
                    <Flex
                        w="100%"
                        justifyContent={"space-between"}
                        marginBottom={5}
                    >
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
                            Sign In
                        </Heading>
                        <Flex
                            w={{ base: "85%", md: "65%" }}
                            justifyContent="flex-end"
                            color="white"
                            fontFamily="Barlow Condensed"
                            fontSize="sm"
                        >
                            <Button
                                variant="link"
                                fontStyle={"italic"}
                                color="green.600"
                                onClick={() => {
                                    router.push("/reset");
                                }}
                                ml={2}
                            >
                                Forgot password?
                            </Button>
                        </Flex>
                    </Flex>

                    <Input
                        w={{ base: onProfile ? "115%" : "100%", md: "100%" }}
                        placeholder="Email Address*"
                        variant="login"
                        mb={5}
                        onChange={(event) => {
                            setEmail(event.target.value);
                        }}
                        onKeyDown={handleKeyPress}
                    />
                    <Input
                        w={{ base: onProfile ? "115%" : "100%", md: "100%" }}
                        type="password"
                        placeholder="Password*"
                        variant="login"
                        mb={3}
                        onChange={(event) => {
                            setPassword(event.target.value);
                        }}
                        onKeyDown={handleKeyPress}
                    />
                    {/* Commented out since the user is already remembered by default */}
                    {/* <HStack w="100%" gap={0}>
						<Checkbox
							colorScheme="green"
							onChange={() => {
								console.log("Checkbox changed");
							}}
							icon={<Box as="span" borderRadius="full" boxSize="100%" />}
							sx={{
								".chakra-checkbox__control": {
									borderRadius: "full"
								}
							}}
						/>
						<Text color="white" fontFamily={"Barlow Condensed"} fontWeight={"500"} ml={2} fontSize={18}>
							Remember me
						</Text>
					</HStack> */}
                    {/* Sign Up Button */}
                    <Flex justifyContent={"flex-end"} width={"100%"}>
                        <Button
                            width={{ base: "40%", md: "20%" }}
                            _hover={{ md: { width: "40%" } }}
                            isLoading={isLoading}
                            onClick={checkIfButtonShouldBeLoading}
                            variant="next"
                            isDisabled={buttonDisabled}
                            letterSpacing={2}
                        >
                            Sign In
                        </Button>
                    </Flex>
                </VStack>
            </Flex>
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
                        Create An Account
                    </Text>
                    <Image src={ChevronRightIcon.src} alt="" />
                </Flex>
            </Flex>
        </Flex>
    );
}
