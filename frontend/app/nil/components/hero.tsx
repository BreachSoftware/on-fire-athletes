import React from "react";
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
                    <Text
                        textAlign="center"
                        fontFamily="Brotherhood"
                        fontWeight="regular"
                        fontSize={{ base: "40px", lg: "60px" }}
                        letterSpacing="0.8px"
                        lineHeight="85px"
                        color="#27CE01"
                    >
                        Build Your Brand
                    </Text>
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
