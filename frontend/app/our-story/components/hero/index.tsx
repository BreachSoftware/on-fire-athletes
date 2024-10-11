import { Image } from "@chakra-ui/image";
import { Box, Flex, Text } from "@chakra-ui/layout";

import OurStoryHeroBackground from "./background";

import LargeLogo from "@/images/logos/on-fire-athletes-full-logo-large.png";

export default function OurStoryHero() {
    return (
        <Box position="relative" minH="100vh" h="fit-content">
            <OurStoryHeroBackground />
            <Flex
                pt={{ base: "120px", lg: 0 }}
                minH="100dvh"
                position="relative"
                flexDir="column"
                alignItems="center"
                justifyContent="flex-end"
                gridGap={{ base: "52px", lg: "72px" }}
                px={{ base: "24px", lg: "156px" }}
            >
                <Flex
                    w="full"
                    flexDir="column"
                    alignItems="center"
                    gridGap={{ base: "16px", lg: "24px" }}
                >
                    <Image
                        src={LargeLogo.src}
                        alt="On Fire Athletes Full Logo"
                        w={{ base: "100%", lg: "624px" }}
                        objectFit="contain"
                    />
                    <Box>
                        <Text
                            fontFamily="Barlow Condensed"
                            fontSize={{ base: "26px", lg: "56px" }}
                            fontWeight="medium"
                            textAlign="center"
                            filter="drop-shadow(0 0 15px #00000029)"
                        >
                            Eliminate barriers. Level the playing field.
                        </Text>
                        <Text
                            color="#27CE01"
                            fontFamily="Brotherhood"
                            fontSize={{ base: "32px", md: "65px" }}
                            letterSpacing="0.65px"
                            lineHeight={{ base: "30px", lg: "58px" }}
                            textAlign="center"
                            filter="drop-shadow(0 0 15px #00000049)"
                        >
                            Set the current sports narrative ONFiRE!
                        </Text>
                    </Box>
                </Flex>
                <Flex
                    bg="#121212"
                    px={{ base: "16px", lg: "260px" }}
                    pt={{ base: "48px", lg: "72px" }}
                    flexDir="column"
                    alignItems="center"
                    gridGap={{ base: "32px", lg: "40px" }}
                >
                    <Text
                        fontFamily="Barlow Condensed"
                        fontWeight="medium"
                        fontSize={{ base: "18px", lg: "28px" }}
                        textAlign="center"
                        letterSpacing="0.68px"
                    >
                        ONFIRE Athletes combines the nostalgia of physical
                        sports cards paired with the most modern technology,
                        offering the best of both worlds. Our first-of-its-kind
                        platform gives you the ability to create, showcase,
                        trade, sell, and print your own physical sports card
                        with augmented reality.
                    </Text>
                    <Text
                        fontFamily="Barlow Semi Condensed"
                        fontWeight="semibold"
                        fontSize={{ base: "14px", lg: "22px" }}
                        letterSpacing="1.1px"
                        color="#27CE01"
                    >
                        SCROLL TO LEARN MORE
                    </Text>
                    <Box
                        h={{ base: "124px", lg: "164px" }}
                        w="5px"
                        bg="#27CE01"
                        rounded="full"
                        filter="drop-shadow(0 0 15px #44FF19)"
                        mb={{ base: "-60px", lg: "-82px" }}
                        zIndex={2}
                    />
                </Flex>
            </Flex>
        </Box>
    );
}
