import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import "@fontsource/water-brush";
import "@fontsource/barlow-condensed";
import { CSSProperties } from "styled-components";
import { useRouter } from "next/navigation";
import { useState } from "react";
import HeroCTAButton from "@/components/homepage/hero/cta-button";
import AnimatedSlider from "./animated-slider";
import AnimatedText from "./animated-text";

/**
 * ForTheNewEra
 * Homepage hero section.
 * @returns {JSX.Element} The header component.
 */
export default function CaptureCreateCustomize() {
    const outlineStyle: CSSProperties = {
        WebkitTextStrokeWidth: "2px",
        WebkitTextStrokeColor: "white",
    };

    const router = useRouter();
    const [createButtonLoading, setCreateButtonLoading] = useState(false);
    const [collectButtonLoading, setCollectButtonLoading] = useState(false);

    return (
        <>
            <Flex
                flexDir="column"
                maxW="1800px"
                h="100%"
                minH="100vh"
                alignSelf="left"
                justifyContent={{ base: "space-between", md: "center" }}
            >
                <Flex
                    flexDir="column"
                    bgGradient={{
                        base: "linear(to-b, #000000f0 60%, #000000a9 80%, #00000000)",
                        md: "none",
                    }}
                    px={{
                        base: "32px",
                        xs: "40px",
                        lg: "64px",
                        "2xl": "100px",
                    }}
                    pb={{ base: "48px", md: "none" }}
                    pt={{ base: "24px", md: "none" }}
                >
                    <AnimatedText />
                    <Text
                        fontFamily="barlow Condensed"
                        fontSize={{
                            base: "46px",
                            xs: "64px",
                            lg: "76px",
                            xl: "100px",
                        }}
                        color="white"
                        fontWeight={700}
                        letterSpacing={{ base: "2px", md: "5px" }}
                        userSelect="none"
                        zIndex={1}
                    >
                        YOUR MOMENT
                    </Text>

                    {/* Slider */}
                    <AnimatedSlider />
                    <Box display={{ base: "inline", lg: "none" }} mt={"16px"}>
                        <Text
                            fontFamily="Barlow Condensed"
                            fontSize="6vw"
                            fontWeight={600}
                            fontStyle="italic"
                            letterSpacing="1.56px"
                            color="white"
                            textShadow="0px 0px 10px #00000029"
                            userSelect="none"
                        >
                            SPORTS CARDS FOR THE NEW ERA
                        </Text>
                    </Box>
                    <Flex
                        direction="column"
                        display={{ base: "none", lg: "flex" }}
                    >
                        <Text
                            fontFamily="Barlow Condensed"
                            fontSize={{ lg: "48px", xl: "60px" }}
                            fontWeight={600}
                            fontStyle="italic"
                            letterSpacing="4.8px"
                            color="#000000"
                            textShadow="0px 0px 10px #00000029"
                            userSelect="none"
                            style={outlineStyle}
                            mb={{ lg: "-24px", xl: "-32px" }}
                        >
                            SPORTS CARDS FOR &nbsp;
                        </Text>
                        <Text
                            fontFamily="Barlow Condensed"
                            fontSize={{ lg: "48px", xl: "60px" }}
                            fontWeight={600}
                            fontStyle="italic"
                            letterSpacing="4.8px"
                            color="#000000"
                            textShadow="0px 0px 10px #00000029"
                            userSelect="none"
                            style={outlineStyle}
                            ml="0"
                        >
                            THE NEW ERA
                        </Text>
                    </Flex>
                </Flex>

                <Flex
                    flexDir="column"
                    my="80px"
                    gridGap={6}
                    display={{ base: "none", md: "flex" }}
                    px={{ base: "32px", lg: "64px", "2xl": "100px" }}
                >
                    <HeroCTAButton
                        isLoading={createButtonLoading}
                        onClick={() => {
                            router.push("/create");
                            setCreateButtonLoading(true);
                        }}
                    >
                        Start Creating
                    </HeroCTAButton>
                    <HeroCTAButton
                        isLoading={collectButtonLoading}
                        onClick={() => {
                            router.push("/lockerroom");
                            setCollectButtonLoading(true);
                        }}
                    >
                        Start Collecting
                    </HeroCTAButton>
                </Flex>
            </Flex>
        </>
    );
}
