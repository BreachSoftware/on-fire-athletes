"use client";
import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import NavBar from "../navbar";
import Sidebar from "@/components/sidebar";

/**
 * Options page component
 * @returns
 */
export default function OptionsPage() {
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
                    <Sidebar height="100vh" backgroundPresent={true} />
                ) : null}
                <Box w="100%">
                    <NavBar />

                    {/* Page content */}
                    {/* <OptionsBox/> */}
                </Box>
            </Flex>
        </>
    );
}
