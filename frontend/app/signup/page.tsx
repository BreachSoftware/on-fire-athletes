/* eslint-disable no-undef */
"use client";
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Flex, useBreakpointValue, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import NavBar from "../navbar";
import Sidebar from "@/components/sidebar";
import { useRouter } from "next/navigation";
import TradingCardInfo from "@/hooks/TradingCardInfo";
import { useCurrentCardInfo } from "@/hooks/useCurrentCardInfo";
import profileInfo from "@/interfaces/profileInfo";
import { checkForTrade } from "@/components/checkForTrade";
import SignUpUI from "@/components/signUpUI";
import LoginHeader from "../components/loginHeader";
import { apiEndpoints } from "@backend/EnvironmentManager/EnvironmentManager";

import DarkPaper from "@/images/backgrounds/darkpaper.png";

/**
 * SignUp component for user registration
 * @returns JSX.Element
 */
export default function SignUp() {
    // Initialize hooks and utilities
    const auth = useAuth();
    const toast = useToast();
    const router = useRouter();
    const card = useCurrentCardInfo();

    // Create profile info object from current card data
    const info: profileInfo = {
        firstName: card.curCard.firstName,
        lastName: card.curCard.lastName,
        position: card.curCard.position,
        teamName: card.curCard.teamName,
        NFTDescription: card.curCard.NFTDescription,
        frontPhotoS3URL: card.curCard.frontPhotoS3URL,
    };

    // Display toast message if a card is loaded
    useEffect(() => {
        const card = TradingCardInfo.loadCard();
        if (card) {
            toast({
                title: "Create an account to save your card!",
                status: "info",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    }, [toast]);

    // Initialize variables for UUID query parameters
    let generatedByUUID: string | null = "";
    let cardSentUUID: string | null = "";
    let senderUUID: string | null = "";

    // Extract UUID query parameters if on client-side
    if (typeof window !== "undefined") {
        const queryParams = new URLSearchParams(window.location.search);

        generatedByUUID = queryParams.get("generatedByUUID");
        cardSentUUID = queryParams.get("cardUUID");
        senderUUID = queryParams.get("fromUUID");
    }

    const [checkedAuth, setCheckedAuth] = useState(false);

    /**
     * Check authentication status and handle card trading process
     */
    useEffect(() => {
        if (checkedAuth) {
            return;
        }
        setCheckedAuth(true);
        const card = TradingCardInfo.loadCard();
        if (card) {
            // Remove card if it's more than 1 day old
            const currentTime = new Date().getTime() / 1000;
            const cardTime = card.createdAt;
            if (currentTime - cardTime > 86400000) {
                TradingCardInfo.clearCard();
                checkForTrade(
                    generatedByUUID,
                    cardSentUUID,
                    senderUUID,
                    null,
                    null,
                    auth,
                    toast,
                );
            }
        } else {
            checkForTrade(
                generatedByUUID,
                cardSentUUID,
                senderUUID,
                null,
                null,
                auth,
                toast,
            );
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth]);

    // Determine if sidebar should be shown based on screen size
    const showSidebar = useBreakpointValue({ base: false, lg: true });

    /**
     * Confirms the email of the user and handles the trading process
     * @param code - The confirmation code
     * @param email - The email of the user
     * @param password - The password of the user
     * @returns boolean indicating success or failure
     */
    async function confirmEmail(
        code: string,
        email: string,
        password: string,
        firstName: string,
        lastName: string,
    ): Promise<boolean> {
        if (code.trim().length !== 0) {
            const confirmed = await auth.confirm(email.trim(), code.trim());
            if (confirmed) {
                // Sign the user in
                const res = await auth.signIn(email, password, {
                    ...info,
                    firstName: firstName || info.firstName,
                    lastName: lastName || info.lastName,
                });

                if (res.success) {
                    const user = await auth.currentAuthenticatedUser();
                    const userID = user.userId;

                    // Create user profile if it doesn't exist
                    if (
                        res.message ===
                        "Successful sign in but unsuccessful profile check"
                    ) {
                        const myHeaders = new Headers();
                        myHeaders.append("Content-Type", "application/json");
                        const requestOptions: RequestInit = {
                            method: "POST",
                            headers: myHeaders,
                            body: JSON.stringify({
                                uuid: userID,
                                email: email,
                                team_hometown: "",
                                socials: null,
                                position: "",
                                media: [],
                                last_name: lastName,
                                generated: Math.floor(Date.now() / 1000),
                                first_name: firstName,
                                bio: "",
                                avatar: null,
                            }),
                        };

                        const request = await fetch(
                            apiEndpoints.createUser(),
                            requestOptions,
                        );
                        if (!request.ok) {
                            console.error(
                                "error creating user profile:",
                                request.statusText,
                            );
                            toast({
                                title: "Error creating user profile",
                                description:
                                    "There was an error creating your profile. Please try again later.",
                                status: "error",
                                duration: 9000,
                                isClosable: true,
                                position: "bottom-left",
                            });
                        }
                    }

                    // Handle card saving and trading
                    const card = TradingCardInfo.loadCard();
                    if (card) {
                        if (userID !== "") {
                            // Save card and redirect to checkout
                            TradingCardInfo.submitCard(card, userID).then(
                                () => {
                                    if (card.isNil) {
                                        window.location.href = "/nil-price";
                                    } else {
                                        window.location.href = "/checkout";
                                    }
                                },
                            );
                        }
                    } else {
                        await checkForTrade(
                            generatedByUUID,
                            cardSentUUID,
                            senderUUID,
                            null,
                            null,
                            auth,
                            toast,
                        );
                    }
                    return true;
                }
                // Display error toast if sign-in fails
                toast({
                    title: "Error signing in",
                    description:
                        "There was an error signing in. Please try again.",
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                    position: "bottom-left",
                });
                return false;
            }
            // Display error toast for incorrect confirmation code
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

    /**
     * Redirects to the login page, preserving query parameters if they exist
     */
    function checkLoginQueryPrams() {
        if (generatedByUUID && cardSentUUID && senderUUID) {
            router.push(
                `/login?generatedByUUID=${generatedByUUID}&cardUUID=${cardSentUUID}&fromUUID=${senderUUID}`,
            );
        } else {
            router.push("/login");
        }
    }

    return (
        <>
            {/* Main content layout */}
            <Flex
                w="100%"
                h={{ base: "100dvh", md: "100vh" }}
                justify="flex-start"
                direction="row-reverse"
                bgImage={DarkPaper.src}
                bgColor="#000000DD"
                bgPosition="center"
                bgRepeat="no-repeat"
                bgSize="cover"
            >
                {showSidebar ? <Sidebar height="100vh" /> : null}
                <Flex w="100%" flexDirection={"column"}>
                    <NavBar />
                    <LoginHeader
                        title="Sign Up"
                        subtitle="Create an account to get started!"
                    />
                    <SignUpUI
                        onClick={() => {
                            checkLoginQueryPrams();
                        }}
                        confirmEmail={confirmEmail}
                        auth={auth}
                    />
                </Flex>
            </Flex>
        </>
    );
}
