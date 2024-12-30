"use client";
import React from "react";
import { VStack, Box, Flex } from "@chakra-ui/react";
import NavBar from "../navbar";
import Sidebar from "@/components/sidebar";
import PricingCard from "./components/PricingCard";
import GamecoinCard from "./components/GamecoinCard";
import DarkPaper from "@/images/backgrounds/darkpaper.png";

/**
 * Pricing page component
 * @returns JSX.Element
 */
export default function Pricing() {
    return (
        <>
            {/* Items around main content */}
            <Flex
                w="100%"
                h="100%"
                minH={"100vh"}
                justify="flex-start"
                direction="row-reverse"
            >
                <Flex
                    direction="column"
                    position="absolute"
                    top="0"
                    left="0"
                    zIndex={-10}
                    h="100%"
                    w="100%"
                >
                    {/* Background Image #1 */}
                    <Flex
                        bgImage={DarkPaper.src}
                        bgPosition="center"
                        bgRepeat="no-repeat"
                        bgSize="cover"
                        h="100%"
                        w="100%"
                    />
                </Flex>

                <Box
                    position="sticky"
                    top={0}
                    w="140px"
                    h="100dvh"
                    display={{ base: "none", md: "inline" }}
                >
                    <Sidebar height="100vh" backgroundPresent={false} />
                </Box>
                <Box w="100%">
                    <NavBar />

                    {/* Page content */}
                    <VStack py="40px">
                        {/* Pricing Options */}
                        <Flex
                            gap={12}
                            direction={{
                                base: "column",
                                sm: "row",
                            }}
                            height={"100%"}
                            p={{ base: 5, sm: 0 }}
                            justifyContent={"center"}
                            alignItems={"center"}
                            wrap={{ base: "wrap", sm: "nowrap" }}
                            w="full"
                        >
                            {/* White Digital Card */}
                            <PricingCard />

                            {/* Green Physical Card */}
                            <GamecoinCard />
                        </Flex>
                    </VStack>
                </Box>
            </Flex>
        </>
    );
}
