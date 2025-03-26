"use client";
import { Flex } from "@chakra-ui/react";
import NavBar from "../navbar";
import GiftCompleteContent from "./gift-complete-content";

export default function GiftSuccessPage() {
    return (
        <Flex
            flexDir="column"
            h="100dvh"
            w="100dvw"
            bgGradient={
                "linear(180deg, gray.1200 0%, gray.1300 100%) 0% 0% no-repeat padding-box;"
            }
            align="center"
        >
            <Flex w="100%" direction={"column"}>
                <NavBar />
            </Flex>

            <Flex
                w="100%"
                h="100%"
                justifyContent={"space-around"}
                direction={{ base: "column", sm: "row" }}
                alignItems="center"
                padding="90px"
                marginTop={{ base: "0px", lg: "-50px" }}
            >
                <Flex
                    h="100%"
                    alignItems="center"
                    fontSize="3xl"
                    fontWeight="bold"
                    color="white"
                >
                    <GiftCompleteContent />
                </Flex>
            </Flex>
        </Flex>
    );
}
