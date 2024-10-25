"use client";
import React, { PropsWithChildren } from "react";
import { Box, Flex } from "@chakra-ui/layout";

import NavBar from "../navbar";
import Footer from "../components/footer";
import Sidebar from "@/components/sidebar";

export default function OurStoryLayout({ children }: PropsWithChildren) {
    return (
        <Flex
            flexDir="row"
            w="100dvw"
            h="fit-content"
            minH="100vh"
            bgGradient="linear(to-b, black, #121212)"
            color="white"
        >
            <Flex flexDir="column" flex={1} w="full">
                <Box position="sticky" top={0} zIndex={5}>
                    <NavBar />
                </Box>
                <Box flex={1} mt="-88px" position="relative">
                    {children}
                </Box>
                <Footer />
            </Flex>
            <Box
                h="100vh"
                position="sticky"
                top={0}
                display={{ base: "none", md: "inline" }}
            >
                <Sidebar height="full" />
            </Box>
        </Flex>
    );
}
