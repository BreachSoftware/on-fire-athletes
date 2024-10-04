/* eslint-disable no-undef */
import React from "react";
// This disable is needed for the React.KeyboardEvent<HTMLInputElement> type
import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalOverlay,
    VStack,
    useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import profileInfo from "@/interfaces/profileInfo";
import LoginUI from "./loginUI";
import SignUpUI from "./signUpUI";
interface LoginModalProps {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

/**
 * The modal for logging in / signing up while trying to do an action that requires authentication
 * @param props - The properties of the login modal
 */
export default function LoginModal(props: LoginModalProps) {
    const router = useRouter();
    const toast = useToast();
    const auth = useAuth();
    const [showSignIn, setShowSignIn] = useState(true);

    // Always going to be empty, but this is required for the sign in function
    const info: profileInfo = {
        firstName: "",
        lastName: "",
        position: "",
        teamName: "",
        NFTDescription: "",
        frontPhotoS3URL: "",
    };

    /**
     * Checks if the login / sign up was successful
     * The language is the same for both because when you sign up, you are subsequently signed in
     * @param res - The response from the authentication decision
     */
    function authenticationDecision(res: {
        success: boolean;
        message: string;
    }) {
        if (res.success) {
            props.onClose();
            toast({
                title: "Signed in",
                description: "You are now signed in",
                status: "success",
                duration: 9000,
                isClosable: true,
                position: "bottom-left",
            });
            return true;
        } else if (res.message === "There is already a signed in user") {
            toast({
                title: "Error signing in",
                description: "There is already a signed in user",
                status: "error",
                duration: 9000,
                isClosable: true,
                position: "bottom-left",
            });
            return false;
        }
        toast({
            title: "Error signing in",
            description: "Incorrect username or password",
            status: "error",
            duration: 9000,
            isClosable: true,
            position: "bottom-left",
        });
        return false;
    }

    /**
     * Handles the sign in button being clicked
     * @param username - The username to sign in with
     * @param password - The password to sign in with
     * @returns boolean on whether the operation was successful or not
     */
    async function signInClicked(username: string, password: string) {
        let res = { success: false, message: "" };
        if (username === "" || password === "") {
            throw new Error("Username or password is empty");
        }
        try {
            res = await auth.signIn(username, password, info);
        } catch (error) {
            toast({
                title: "Error signing in",
                description: "There was an error signing in. Please try again.",
                status: "error",
                duration: 9000,
                isClosable: true,
                position: "bottom-left",
            });
            return false;
        }
        return authenticationDecision(res);
    }

    /**
     * Handles the sign up button being clicked
     * @param code - The code to confirm the email
     * @param email - The email of the user
     * @param password- The password of the user
     * @returns boolean on whether the operation was successful or not
     */
    async function confirmEmail(code: string, email: string, password: string) {
        if (code.trim().length !== 0) {
            const confirmed = await auth.confirm(email.trim(), code.trim());
            if (confirmed) {
                // Sign the user in
                const res = await auth.signIn(email, password, info);
                return authenticationDecision(res);
            }
            toast({
                title: "Incorrect Code",
                description: "The code you entered is incorrect",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
            return false;
        }
        return false;
    }

    return (
        <Modal
            isOpen={props.isOpen}
            onClose={props.onClose}
            size="4xl"
            isCentered
        >
            <ModalOverlay backdropFilter="blur(5px) hue-rotate(10deg)" />
            <ModalContent
                borderRadius={"1rem"}
                w={{ base: "90%", sm: "90%", md: "37%" }}
                bgColor="#171C1B"
            >
                <ModalCloseButton />
                <ModalBody>
                    <VStack borderRadius={"1rem"} w={"100%"} padding={3}>
                        {showSignIn ? (
                            <>
                                <LoginUI
                                    signInClicked={signInClicked}
                                    onClick={() => {
                                        setShowSignIn(false);
                                    }}
                                    router={router}
                                    onProfile={true}
                                    modal
                                />
                            </>
                        ) : (
                            <>
                                <SignUpUI
                                    onClick={() => {
                                        setShowSignIn(true);
                                    }}
                                    confirmEmail={confirmEmail}
                                    auth={auth}
                                    onProfile={true}
                                    modal
                                />
                            </>
                        )}
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
