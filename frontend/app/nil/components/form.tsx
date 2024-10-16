"use client";
import React from "react";
import { apiEndpoints } from "@backend/EnvironmentManager/EnvironmentManager";
import { Button } from "@chakra-ui/button";
import { Input, type InputProps } from "@chakra-ui/input";
import { Box, Flex, Text, SimpleGrid } from "@chakra-ui/layout";
import ChevronRightIcon from "@/components/icons/chevron-right";
import { useToast } from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";

export default function NILApplicationForm() {
    const toast = useToast();
    const [isLoading, setIsLoading] = React.useState(false);
    const [sentSuccessfully, setSentSuccessfully] = React.useState(false);

    const [firstName, setFirstName] = React.useState("");
    const [firstNameError, setFirstNameError] = React.useState(false);
    const [lastName, setLastName] = React.useState("");
    const [lastNameError, setLastNameError] = React.useState(false);
    const [email, setEmail] = React.useState("");
    const [emailError, setEmailError] = React.useState(false);
    const [schoolName, setSchoolName] = React.useState("");
    const [schoolNameError, setSchoolNameError] = React.useState(false);
    const [instagram, setInstagram] = React.useState("");
    const [instagramError, setInstagramError] = React.useState(false);
    const [twitter, setTwitter] = React.useState("");
    const [twitterError, setTwitterError] = React.useState(false);

    function verifyInputs() {
        let isInvalid = false;

        if (!firstName) {
            setFirstNameError(true);
            isInvalid = true;
        }
        if (!lastName) {
            setLastNameError(true);
            isInvalid = true;
        }
        if (!email) {
            setEmailError(true);
            isInvalid = true;
        }
        if (!schoolName) {
            setSchoolNameError(true);
            isInvalid = true;
        }
        if (!instagram) {
            setInstagramError(true);
            isInvalid = true;
        }
        if (!twitter) {
            setTwitterError(true);
            isInvalid = true;
        }
        return isInvalid;
    }

    async function handleSendApplication() {
        setIsLoading(true);
        if (verifyInputs()) {
            setIsLoading(false);
            return;
        }
        const emailHeaders = new Headers();
        emailHeaders.append("Content-Type", "application/json");

        const rawBody = JSON.stringify({
            firstName,
            lastName,
            email,
            schoolName,
            instagram,
            twitter,
        });

        const requestOptions = {
            method: "POST",
            headers: emailHeaders,
            body: rawBody,
            redirect: "follow" as RequestRedirect,
        };

        try {
            const requestVerificationResponse = await fetch(
                apiEndpoints.requestNILVerification(),
                requestOptions,
            );

            if (requestVerificationResponse.status === 200) {
                toast({
                    title: "Verification email sent",
                    description:
                        "Please allow 1-2 business days for verification process and to receive your unique link via email.",
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                });
                setSentSuccessfully(true);
            } else {
                toast({
                    title: "Failed to send verification email",
                    description:
                        "An error occurred while sending the verification email. Please try again later.",
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                });
                console.error("Failed to send verification email");
            }
        } catch (e) {
            console.error(e);
            toast({
                title: "Failed to send verification email",
                description:
                    "An error occurred while sending the verification email. Please try again later.",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        }
        setIsLoading(false);
    }

    const hasError =
        firstNameError ||
        lastNameError ||
        emailError ||
        schoolNameError ||
        instagramError ||
        twitterError;

    return (
        <Box w="full" px={{ base: "24px", lg: "32px", "2xl": 0 }}>
            <Flex
                py="36px"
                px={{ base: "32px", lg: "112px", "2xl": "144px" }}
                w="full"
                flexDir="column"
                alignItems="center"
                mx="auto"
                maxW="1306px"
                bg="#171C1B"
                borderRadius="13px"
                gridGap="56px"
                boxShadow="0 0 16px #27CE00"
                zIndex={2}
                position="relative"
            >
                <Box>
                    <Text
                        fontSize={{ base: "23px", lg: "36px" }}
                        fontWeight="bold"
                        lineHeight={{ base: "28px", lg: "43px" }}
                        textAlign="center"
                        letterSpacing={{ base: "1.15px", lg: "1.8px" }}
                        textTransform="uppercase"
                        fontFamily="Barlow Semi Condensed"
                        color="#27CE01"
                    >
                        GET VERIFIED, THEN CREATE YOUR CARD FOR FREE!
                    </Text>
                    <Box
                        mt="16px"
                        w="full"
                        h="2px"
                        bg="#27CE01"
                        rounded="full"
                    />
                </Box>
                <SimpleGrid
                    w="full"
                    columns={{ base: 1, lg: 2 }}
                    columnGap="42px"
                    rowGap="20px"
                >
                    <FormInput
                        label="Name"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        onBlur={() => setFirstNameError(false)}
                        isInvalid={!!firstNameError}
                    />
                    <FormInput
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        onBlur={() => setLastNameError(false)}
                        isInvalid={!!lastNameError}
                    />
                    <FormInput
                        label="Email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => setEmailError(false)}
                        isInvalid={!!emailError}
                    />
                    <FormInput
                        label="School Name"
                        placeholder="School Name"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        onBlur={() => setSchoolNameError(false)}
                        isInvalid={!!schoolNameError}
                    />
                    <FormInput
                        label="Social Media"
                        placeholder="Instagram"
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                        onBlur={() => setInstagramError(false)}
                        isInvalid={!!instagramError}
                    />
                    <FormInput
                        placeholder="X (Twitter)"
                        value={twitter}
                        onChange={(e) => setTwitter(e.target.value)}
                        onBlur={() => setTwitterError(false)}
                        isInvalid={!!twitterError}
                    />
                </SimpleGrid>
                <Flex alignItems="center" flexDir="column">
                    <Button
                        w="233px"
                        h="44px"
                        bg="#27CE01"
                        fontFamily="Roboto"
                        textTransform="uppercase"
                        fontWeight="medium"
                        letterSpacing="1.6px"
                        rightIcon={
                            sentSuccessfully ? (
                                <CheckIcon />
                            ) : (
                                <ChevronRightIcon />
                            )
                        }
                        onClick={handleSendApplication}
                        isLoading={isLoading}
                        loadingText="Submitting"
                        isDisabled={sentSuccessfully}
                    >
                        {sentSuccessfully ? "Submitted!" : "Submit"}
                    </Button>
                    {hasError && (
                        <Text color="red">Missing Required Fields</Text>
                    )}
                    <Text
                        mt="16px"
                        fontFamily="Barlow Condensed"
                        fontWeight="semibold"
                        fontStyle="italic"
                        fontSize={{ base: "14px", lg: "24px" }}
                        textAlign="center"
                        letterSpacing={{ base: "0.28px", lg: "0.48px" }}
                        lineHeight={{ base: "17px", lg: "29px" }}
                    >
                        Please allow 1-2 business days for verification process
                        and to receive your unique link via email.
                    </Text>
                </Flex>
            </Flex>
        </Box>
    );
}

interface FormInputProps extends InputProps {
    label?: string;
}

function FormInput({ label, ...rest }: FormInputProps) {
    return (
        <Box w="full">
            <Text
                fontFamily="Barlow"
                fontWeight="medium"
                fontSize="18px"
                letterSpacing="0.36px"
                mb="12px"
                opacity={label ? 1 : 0}
                userSelect={label ? "initial" : "none"}
                display={{ base: label ? "inline" : "none", lg: "inline" }}
            >
                {label || "Label"}
            </Text>
            <Input
                bg="black"
                borderWidth="0px"
                fontFamily="Barlow"
                fontSize="18px"
                letterSpacing="0.36px"
                _placeholder={{
                    color: "#FFFFFFA0",
                    fontStyle: "italic",
                }}
                {...rest}
            />
        </Box>
    );
}
