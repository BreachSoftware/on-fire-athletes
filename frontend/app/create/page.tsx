"use client";

import { Flex, Image, Box } from "@chakra-ui/react";
import CardDropShadow from "@/components/create/CardDropShadow";
import InfoCard from "./components/info-card";
import CreateYourCardText from "@/components/create/CreateYourCardText";
import NavBar from "../navbar";
import Sidebar from "@/components/sidebar";
import { BackToCheckoutModal } from "../components/BackToCheckoutModal";
import Footer from "../components/footer";
import CreateBackground from "./components/background";
import SharedStack from "@/components/shared/wrappers/shared-stack";
import { InfoItemProps } from "./components/info-card/item";
import StartCreatingButton from "./components/start-creating-button";
import SideBarHamburger from "@/components/sidebarHamburger";

/**
 * Main page for the creation process
 * @returns the creation overview page
 */
export default function CreationOverview() {
    const Steps: InfoItemProps[] = [
        {
            number: 1,
            description: "Create and customize your own card!",
        },
        {
            number: 2,
            description: "Pick a digital and/or physical AR package!",
        },
        {
            number: 3,
            description: "Showcase, Trade, & Sell your sports cards!",
        },
    ];

    return (
        <Box w="full" position="relative" minH="100vh">
            <Flex flexDir="row" position="relative" w="full" h="full">
                <BackToCheckoutModal />
                <CreateBackground />
                <Flex direction="row-reverse" position="relative">
                    <Flex w="full" flexDir="column" h="full">
                        <NavBar noDivider />
                        <SharedStack
                            flex={1}
                            pt={{ base: "40px", lg: "none" }}
                            px={{ base: "24px", lg: "48px", "2xl": "72px" }}
                            alignItems="center"
                            direction={{ base: "column", lg: "row" }}
                        >
                            <SharedStack
                                w="full"
                                spacing={8}
                                pl={{ base: "12px", lg: "48px", "2xl": 24 }}
                                pr={{ base: "12px", lg: "48px", "2xl": 24 }}
                            >
                                <Flex
                                    w="full"
                                    flexDir={{ base: "column", lg: "row" }}
                                    alignItems={{
                                        base: "center",
                                        lg: "flex-end",
                                    }}
                                    gridGap={{ base: 8, lg: 0 }}
                                    justifyContent="space-between"
                                >
                                    <CreateYourCardText />
                                    <Box>
                                        <StartCreatingButton />
                                    </Box>
                                </Flex>
                                <Box
                                    w="full"
                                    display={{ base: "none", lg: "inline" }}
                                >
                                    <InfoCard steps={Steps} />
                                </Box>
                            </SharedStack>
                            <Flex
                                direction="column"
                                align="center"
                                px={{ base: "16px", lg: 0 }}
                            >
                                <Box
                                    w={{
                                        base: "full",
                                        md: "396px",
                                        "2xl": "516px",
                                    }}
                                    h={{
                                        base: "418px",
                                        md: "512px",
                                        "2xl": "672px",
                                    }}
                                >
                                    <Image
                                        src="step_one_template_cards/demario_a.png"
                                        alt="Your Card"
                                        objectFit="contain"
                                        transform="rotate(12deg) scale(0.75)"
                                        filter="drop-shadow(0 0 24px rgba(204,134,37,0.6))"
                                    />
                                </Box>
                                <Box
                                    mt={{ base: "16px", lg: "64px" }}
                                    width="100%"
                                >
                                    <CardDropShadow />
                                </Box>
                            </Flex>
                            <Box
                                w="full"
                                mt={{ base: "16px", xs: "64px" }}
                                mb="16px"
                                display={{ base: "inline", lg: "none" }}
                            >
                                <InfoCard steps={Steps} />
                            </Box>
                        </SharedStack>
                        <Footer />
                    </Flex>
                </Flex>
                <Box
                    position="sticky"
                    top={0}
                    w="140px"
                    h="100dvh"
                    display={{ base: "none", md: "inline" }}
                >
                    <Sidebar height="100%" />
                </Box>
            </Flex>
            <SideBarHamburger />
        </Box>
    );
}
