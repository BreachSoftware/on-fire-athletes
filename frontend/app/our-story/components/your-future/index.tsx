"use client";
import { Box, Text, Flex } from "@chakra-ui/layout";

import YourFutureBackground from "./background";
import SharedStack from "@/components/shared/wrappers/shared-stack";
import YourFutureCTAButton from "./cta-button";
import { useAuth } from "@/hooks/useAuth";

export default function YourFutureSection() {
    const { isAuthenticated } = useAuth();

    return (
        <Box position="relative">
            <YourFutureBackground />
            <Flex
                position="relative"
                flexDir="column"
                alignItems="center"
                gridGap={{ base: "48px", lg: "64px" }}
                px={{ base: "24px", lg: "264px" }}
                pt={{ base: "96px", lg: "124px" }}
                pb="48px"
                maxW={{ "2xl": "1920px" }}
                mx={{ "2xl": "auto" }}
            >
                <Box>
                    <Text
                        fontFamily="Brotherhood"
                        fontSize={{ base: "64px", lg: "120px" }}
                        letterSpacing="1.2px"
                        color="#27CE01"
                        textAlign="center"
                        lineHeight={{ base: "40px", lg: "70px" }}
                        mb={4}
                    >
                        Your Future
                    </Text>
                    <Text
                        fontFamily="Barlow Condensed"
                        fontWeight="semibold"
                        fontSize={{ base: "48px", lg: "80px" }}
                        letterSpacing="4px"
                        textTransform="uppercase"
                        textAlign="center"
                        lineHeight={{ base: "48px", lg: "80px" }}
                    >
                        Is in your hands
                    </Text>
                </Box>
                <Text
                    fontFamily="Barlow"
                    fontWeight="medium"
                    fontSize={{ base: "16px", lg: "18px" }}
                    letterSpacing="0.36px"
                    px={{ base: 0, lg: "72px" }}
                    textAlign="center"
                >
                    Our first-of-its-kind platform combines the nostalgia of
                    sports cards with today's technology, offering the best of
                    both worlds. Our creator allows you to customize your card
                    and trade and sell to other athletes and fans in our Locker
                    Room Marketplace. Digital cards, meets physical cards, meets
                    personal branding…and our most unique feature, our physical
                    cards feature augmented reality to bring your physical card
                    to life, literally, in the palm of your hands.
                </Text>
                <Box>
                    <Text
                        fontFamily="Barlow Condensed"
                        fontWeight="medium"
                        fontStyle="italic"
                        fontSize={{ base: "24px", lg: "42px" }}
                        letterSpacing="2.1px"
                        textAlign="center"
                        mb={{ base: 8, lg: 1 }}
                    >
                        EVERY SPORT, ATHLETE, LEVEL, AND FAN
                    </Text>
                    <Box
                        w={{ base: "80%", lg: "full" }}
                        mx="auto"
                        h="5px"
                        rounded="full"
                        bg="#00DA1F"
                        filter="drop-shadow(0px 0px 15px #44FF19)"
                    />
                </Box>
                <SharedStack
                    direction={{ base: "column", lg: "row" }}
                    fit
                    spacing={8}
                >
                    <YourFutureCTAButton
                        link={isAuthenticated ? "/profile" : "/signup"}
                    >
                        Create Profile
                    </YourFutureCTAButton>
                    <YourFutureCTAButton link="/create">
                        Start Creating
                    </YourFutureCTAButton>
                </SharedStack>
            </Flex>
        </Box>
    );
}
