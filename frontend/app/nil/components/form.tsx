"use client";
import React from "react";
import { Button } from "@chakra-ui/button";
import { Input, type InputProps } from "@chakra-ui/input";
import { Box, Flex, Text, SimpleGrid } from "@chakra-ui/layout";
import ChevronRightIcon from "@/components/icons/chevron-right";

export default function NILApplicationForm() {
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
                    <FormInput label="Name" placeholder="First Name" />
                    <FormInput placeholder="Last Name" />
                    <FormInput label="Email" placeholder="Email Address" />
                    <FormInput label="School Name" placeholder="School Name" />
                    <FormInput label="Social Media" placeholder="Instagram" />
                    <FormInput placeholder="X (Twitter)" />
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
                        rightIcon={<ChevronRightIcon />}
                    >
                        Submit
                    </Button>
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
