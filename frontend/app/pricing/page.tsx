"use client";
import React from "react";
import { VStack, Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import NavBar from "../navbar";
import Sidebar from "@/components/sidebar";
import PricingCard from "./components/PricingCard";
import GamecoinCard from "./components/GamecoinCard";

/**
 * Pricing page component
 * @returns JSX.Element
 */
export default function Pricing() {
    const showSidebar = useBreakpointValue({ base: false, lg: true });

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
                        bgImage="keith-johnston-card-array.png"
                        bgPosition="center"
                        bgRepeat="no-repeat"
                        bgSize="cover"
                        h="100%"
                        w="100%"
                    >
                        <Flex
                            bgGradient={
                                "linear(180deg, rgba(0, 0, 0, 0.9) 0%, rgba(49, 69, 61, 0.9) 100%) 0% 0% no-repeat padding-box;"
                            }
                            h="100%"
                            w="100%"
                        />
                    </Flex>
                </Flex>

                {showSidebar ? (
                    <Sidebar height="100vh" backgroundPresent={false} />
                ) : null}
                <Box w="100%">
                    <NavBar />

                    {/* Page content */}
                    <VStack pt="80px">
                        {/* Pricing Options */}
                        <Flex
                            gap={12}
                            direction={{
                                base: "column",
                                sm: "row",
                            }}
                            w={"90%"}
                            height={"100%"}
                            p={{ base: 5, sm: 0 }}
                            justifyContent={"center"}
                            alignItems={"center"}
                            wrap={{ base: "wrap", sm: "nowrap" }}
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
