"use client";
import React from "react";
import { Box, Flex, Text, Center } from "@chakra-ui/layout";
import SharedStack from "@/components/shared/wrappers/shared-stack";

import StoryPaper from "@/images/backgrounds/story-paper.png";
import SharedCarousel from "@/components/shared/carousel";

export default function NILBenefits() {
    return (
        <Box
            w="full"
            position="relative"
            px={{ base: "24px", lg: "32px", "2xl": 0 }}
            pt={{ base: "calc(88px + 348px)", lg: "calc(88px + 274px)" }}
            pb="88px"
            mt={{ base: "-348px", lg: "-274px" }}
        >
            <Background />
            <Flex
                position="relative"
                flexDir="column"
                gridGap="64px"
                alignItems="center"
                maxW="1412px"
                mx="auto"
            >
                <Text
                    fontFamily="Brotherhood"
                    fontWeight="regular"
                    fontSize={{ base: "40px", lg: "60px" }}
                    textAlign="center"
                    letterSpacing="0px"
                    lineHeight="35px"
                    color="#27CE01"
                >
                    AFTER YOU'RE VERIFIED YOU CAN:
                </Text>
                <SharedCarousel
                    containerOverrides={{
                        display: { base: "block", lg: "none" },
                    }}
                    arrowTopPosition="50%"
                >
                    <BenefitStep
                        stepNum={1}
                        label="SET IT OFF"
                        description="Create your one of a kind digital and physical AR card using our proprietary creator."
                    />
                    <BenefitStep
                        stepNum={2}
                        label="LIGHT IT UP"
                        description="Launch your card in our Locker Room Marketplace and promote it on your social media platforms."
                    />
                    <BenefitStep
                        stepNum={3}
                        label="CATCH FIRE"
                        description="Sell your card to fans and make 75% of EVERY sale from the Locker Room Marketplace."
                    />
                </SharedCarousel>
                <SharedStack
                    row
                    display={{ base: "none", lg: "flex" }}
                    h="fit-content"
                    alignItems="flex-start"
                    justifyContent="space-between"
                >
                    <BenefitStep
                        stepNum={1}
                        label="SET IT OFF"
                        description="Create your one of a kind digital and physical AR card using our proprietary creator."
                    />
                    <Divider />
                    <BenefitStep
                        stepNum={2}
                        label="LIGHT IT UP"
                        description="Launch your card in our Locker Room Marketplace and promote it on your social media platforms."
                    />
                    <Divider />
                    <BenefitStep
                        stepNum={3}
                        label="CATCH FIRE"
                        description="Sell your card to fans and make 75% of EVERY sale from the Locker Room Marketplace."
                    />
                </SharedStack>
            </Flex>
        </Box>
    );
}

interface BenefitStepProps {
    stepNum: number;
    label: string;
    description: string;
}

function BenefitStep({ stepNum, label, description }: BenefitStepProps) {
    return (
        <Flex
            flexDir="column"
            alignItems="center"
            w="full"
            maxW={{ base: "none", lg: "427px" }}
            gridGap="20px"
        >
            <Center
                w="64px"
                h="64px"
                rounded="full"
                bg="#27CE01"
                boxShadow="0 0 6px #27CE01"
            >
                <Text
                    color="transparent"
                    fontFamily="Barlow Condensed"
                    fontWeight="extrabold"
                    fontStyle="italic"
                    fontSize="50px"
                    lineHeight="35px"
                    style={{
                        WebkitTextStrokeWidth: "2px",
                        WebkitTextStrokeColor: "white",
                    }}
                >
                    {stepNum}
                </Text>
            </Center>
            <Flex flexDir="column" alignItems="center" gridGap="8px">
                <Text
                    fontFamily="Brotherhood"
                    fontWeight="regular"
                    fontSize="36px"
                    letterSpacing="1.8px"
                    lineHeight="51px"
                    textTransform="uppercase"
                    color="#27CE01"
                >
                    {label}
                </Text>
                <Box w="112px" h="2px" bg="#27CE01" rounded="full" />
                <Text
                    fontFamily="Barlow Condensed"
                    fontWeight="semibold"
                    fontStyle="italic"
                    fontSize={{ base: "24px", "2xl": "30px" }}
                    textAlign="center"
                    lineHeight={{ base: "34px", "2xl": "36px" }}
                    color="white"
                    maxW={{ base: "284px", md: "none" }}
                >
                    {description}
                </Text>
            </Flex>
        </Flex>
    );
}

function Divider() {
    return <Box h="330px" w="3px" bg="#31453D" rounded="full" />;
}

function Background() {
    return (
        <Box
            top={0}
            left={0}
            right={0}
            bottom={0}
            position="absolute" // Ensures proper stacking context
            bgImage={StoryPaper.src}
            bgSize="cover"
            bgPos="center top"
        />
    );
}
