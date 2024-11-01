"use client";
import React, { PropsWithChildren } from "react";
import { Keyframes } from "@emotion/react";
import { keyframes } from "@chakra-ui/react";
import { Box, Flex, Text } from "@chakra-ui/layout";

export default function NILHero() {
    return (
        <Flex
            py="64px"
            flexDir="column"
            w="full"
            alignItems="center"
            maxW="1306px"
            mx="auto"
            px={{ base: "24px", "2xl": 0 }}
            gridGap={{ base: "28px", lg: "32px" }}
        >
            <Text
                textAlign="center"
                fontFamily="Barlow Semi Condensed"
                fontWeight="semibold"
                fontStyle="italic"
                fontSize={{ base: "24px", lg: "26px" }}
                letterSpacing="3.9px"
                lineHeight={{ base: "29px", lg: "31px" }}
                transform="uppercase"
                color="#27CE01"
            >
                NIL PARTNERSHIPS
            </Text>
            <Box px="16px">
                <Text
                    textAlign="center"
                    fontFamily="Barlow Condensed"
                    fontWeight="semibold"
                    fontStyle="italic"
                    fontSize={{ base: "40px", lg: "50px" }}
                    letterSpacing={{ base: "0.8px", lg: "1px" }}
                    lineHeight={{ base: "40px", lg: "60px" }}
                >
                    CALLING ALL COLLEGIATE ATHLETES!
                </Text>
                <Text
                    display={{ base: "none", "2xl": "inline" }}
                    textAlign="center"
                    fontFamily="Brotherhood"
                    fontWeight="regular"
                    fontSize="60px"
                    letterSpacing="1.2px"
                    lineHeight="85px"
                    color="#27CE01"
                >
                    Build Your Brand, Grow Your Hype, Fuel Your NIL
                </Text>
                <Flex
                    display={{ base: "flex", "2xl": "none" }}
                    w="full"
                    alignItems="center"
                    justifyContent="center"
                    flexDir="column"
                >
                    <LoopingText />
                    <Box w="80%" h="2px" bg="#27CE01" rounded="full" />
                </Flex>
            </Box>
            <Box
                display={{ base: "none", "2xl": "inline" }}
                w="540px"
                h="2px"
                bg="#27CE01"
                rounded="full"
            />
            <Text
                maxW="948px"
                textAlign="center"
                fontFamily="Roboto Condensed"
                fontWeight="regular"
                fontSize={{ base: "22px", lg: "26px" }}
                letterSpacing="0px"
                lineHeight={{ base: "32px", lg: "35px" }}
            >
                OnFire Athletes empowers college athletes of every sport.
                Allowing you to create your very own customized digital and
                physical 3D augmented reality sports cards to capture, showcase
                and sell your favorite sports moments to family, fans, and
                friends.
            </Text>
            <Text
                textAlign="center"
                fontFamily="Barlow Condensed"
                fontWeight="semibold"
                fontStyle="italic"
                fontSize={{ base: "22px", lg: "26px" }}
                letterSpacing={{ base: "0.44px", lg: "0.52px" }}
                lineHeight={{ base: "32px", lg: "31px" }}
            >
                Create, launch, and sell with our platform, making money with
                every sale of your cards.
            </Text>
        </Flex>
    );
}

function LoopingText() {
    function SplashText({
        children,
        animation,
        isAbsoluted,
    }: PropsWithChildren<{ animation: string; isAbsoluted?: boolean }>) {
        return (
            <Text
                position={isAbsoluted ? "absolute" : "relative"}
                top={0}
                left={0}
                w="full"
                opacity={0}
                textAlign="center"
                fontFamily="Brotherhood"
                fontWeight="regular"
                fontSize={{ base: "40px", lg: "60px" }}
                letterSpacing="0.8px"
                lineHeight="85px"
                color="#27CE01"
                animation={animation}
            >
                {children}
            </Text>
        );
    }

    const captureAnim = keyframes`
        0% {opacity: 0;}
        6.25% {opacity: 1;}
        31.25% {opacity: 1;}
        37.5% {opacity: 0;}
        62.5% {opacity: 0;}
        68.75% {opacity: 0;}
        93.75% {opacity: 0}
        100%% {opacity: 0;}
    `;

    const createAnim = keyframes`
        0% {opacity: 0;}
        6.25% {opacity: 0;}
        31.25% {opacity: 0;}
        37.5% {opacity: 1;}
        62.5% {opacity: 1;}
        68.75% {opacity: 0;}
        93.75% {opacity: 0}
        100% {opacity: 0;}
    `;

    const customizeAnim = keyframes`
        0% {opacity: 0;}
        6.25% {opacity: 0;}
        31.25% {opacity: 0;}
        37.5% {opacity: 0;}
        62.5% {opacity: 0;}
        68.75% {opacity: 1;}
        93.75% {opacity: 1;}
        100%% {opacity: 0;}
    `;

    function getAnimString(keyframe: Keyframes) {
        return `${keyframe} 4s ease-in infinite;`;
    }

    return (
        <Box position="relative" height="fit-content" width="full" zIndex={2}>
            {/* One of the text components is position="relative" so that the parent and conform to the height of the text */}
            <SplashText animation={getAnimString(captureAnim)}>
                Build Your Brand
            </SplashText>
            <SplashText animation={getAnimString(createAnim)} isAbsoluted>
                Grow Your Hype
            </SplashText>
            <SplashText animation={getAnimString(customizeAnim)} isAbsoluted>
                Fuel Your NIL
            </SplashText>
        </Box>
    );
}
