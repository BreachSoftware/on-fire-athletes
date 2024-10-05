"use client";
import React from "react";
import BuiltForAthletes from "@/components/built_for_athletes";
import { Flex } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import Navbar from "@/app/navbar";
import Sidebar from "@/components/sidebar";
import Footer from "./components/footer";
import TrendingNow from "@/components/trending_now/TrendingNow";
import CaptureCreateCustomize from "@/app/components/CaptureCreateCustomize";
import "@fontsource/water-brush";
import "@fontsource/barlow";
import MobileFrontWrapper from "./components/mobile-front-wrapper";
import { BackToCheckoutModal } from "./components/BackToCheckoutModal";
import InTheNews from "@/components/in_the_news";
import LightItUp from "@/components/light_it_up/light_it_up";
import SideBarHamburger from "@/components/sidebarHamburger";

/**
 * Renders the home screen.
 * @returns {JSX.Element} The rendered home screen.
 */
export default function Index() {
    // Data for the "In The News" section. This array would typically come from props or be fetched from an API

    /* Array of news items, each item would have an id, imageUrl, headline, and description */
    const inTheNewsData = [
        {
            id: 1,
            imageUrl: "in_the_news/news1.png",
            headline: "ONFIRE Athletes Launches!",
            description:
                "ONFIRE Athletes, Powered by Game Coin, Revolutionizes Sports Legacy.",
            link: "/newsroom/onfire-athletes-launches",
        },
        {
            id: 2,
            imageUrl: "in_the_news/news2.png",
            headline: "What are “AR” Cards?",
            description:
                "ONFIRE Athletes uses Augmented Reality (AR) to bring your sports card to life!",
            link: "/newsroom/what-are-ar-cards",
        },
        {
            id: 3,
            imageUrl: "in_the_news/news3.png",
            headline: "What sparked ONFIRE?",
            description:
                "Eliminate barriers. Level the playing field. Set the current sports narrative on fire!",
            link: "/our-story",
        },
        // ...other news items
    ];

    return (
        <>
            <Box w="full" position="relative" minH="100vh">
                <Flex flexDir="row" w="full" h="full">
                    <Box w="full">
                        <Box
                            as="video"
                            src="HomepageBackgroundVideo.mp4"
                            loop={false}
                            muted={true}
                            controls={false}
                            autoPlay={true}
                            playsInline={true}
                            w={{ base: "full", md: "100dvw" }}
                            h={{ base: "full", md: "100dvh" }}
                            minH="100vh"
                            objectFit="cover"
                            position="fixed"
                            top={0}
                            right={0}
                            left={0}
                            bottom={0}
                        />
                        <Box position="relative">
                            <Flex
                                w="100%"
                                position="relative"
                                minH="100vh"
                                h="fit-content"
                                direction="column"
                                bgGradient={{
                                    base: "none",
                                    md: "linear(to-r, #000, #00000000)",
                                }}
                            >
                                <Navbar
                                    bgGradient={{
                                        base: "linear(to-b, #000, #000000f0)",
                                        md: "linear(to-b, rgba(0,0,0,1), rgba(0,0,0,0.6), rgba(0,0,0,0))",
                                    }}
                                />
                                <CaptureCreateCustomize />
                            </Flex>
                            <BuiltForAthletes />
                            <MobileFrontWrapper />
                        </Box>
                        <Box position="relative" zIndex={1}>
                            <LightItUp />
                            <InTheNews
                                showBackground={true}
                                title="In The News"
                                data={inTheNewsData}
                            />
                            <TrendingNow />
                            <Footer />
                        </Box>
                    </Box>
                    <Box
                        position="sticky"
                        top={0}
                        w="140px"
                        h="100dvh"
                        display={{ base: "none", md: "inline" }}
                    >
                        <Sidebar height={"100dvh"} />
                    </Box>
                </Flex>
            </Box>
            <BackToCheckoutModal />
            <SideBarHamburger />
        </>
    );
}
