"use client";
import LightItUpCTAButton from "@/app/components/buttons/light-it-up-button";
import { Box, Center, Flex, Image, Text, VStack } from "@chakra-ui/react";
import "@fontsource/roboto";

type LightItUpCardProps = {
    image: string;
    videoUrl: string;
    imageOverlayTitle: string;
    imageOverlaySubtitle: string;
    title: string;
    description: string;
    buttonTitle: string;
    buttonLink: string;
};

/**
 * LightItUpCard is a UI component that displays an image with overlay text and a call-to-action button.
 */
function LightItUpCard({
    image,
    videoUrl,
    imageOverlayTitle,
    imageOverlaySubtitle,
    title,
    description,
    buttonTitle,
    buttonLink,
}: LightItUpCardProps) {
    return (
        <Center>
            <VStack color="white" position="relative">
                {/* Image container */}
                <Flex
                    position="relative"
                    maxW="100%"
                    maxH="100%"
                    justifyContent="center"
                    alignItems="center"
                    overflow="visible"
                >
                    {videoUrl ? (
                        <Box
                            as="video"
                            src={videoUrl}
                            loop
                            muted
                            controls={false}
                            autoPlay
                            playsInline
                            objectFit="cover"
                            opacity={{ base: 1, md: 0.5 }}
                            h={{ base: "336px", md: "256px", xl: "450px" }}
                            w={"auto"}
                            transition="all 0.3s ease-in-out"
                            _hover={{
                                base: {},
                                md: {
                                    opacity: 1,
                                    transform: "translateY(-30px)",
                                    transformOrigin: "top center",
                                },
                            }}
                        />
                    ) : (
                        <Image
                            transition="all 0.3s ease-in-out"
                            // Only apply the hover effect on desktop
                            _hover={{
                                base: {},
                                md: {
                                    opacity: 1,
                                    transform: "translateY(-30px)",
                                    transformOrigin: "top center",
                                },
                            }}
                            opacity={{ base: 1, md: 0.5 }}
                            src={image}
                            alt={`${title} Image`}
                            h={{ base: "336px", md: "256px", xl: "450px" }}
                            objectFit="contain"
                            w={"auto"}
                        />
                    )}
                    <VStack pos={"absolute"} bottom={0} spacing={0}>
                        {/* Overlapping text with a transparent fill and a stroke*/}
                        <Text
                            fontSize={{ base: "36px", lg: "40px" }}
                            fontFamily="Brotherhood, Regular"
                            lineHeight="56px"
                        >
                            {imageOverlaySubtitle}
                        </Text>
                        {/* Overlapping text with a transparent fill and a stroke*/}
                        <Text
                            style={{
                                color: "transparent",
                                WebkitTextStrokeWidth: "3px",
                                WebkitTextStrokeColor: "white",
                                filter: "drop-shadow(0 0 2px rgba(89,216,58,0.8))",
                            }}
                            fontFamily="Barlow Condensed"
                            fontWeight="bold"
                            mt="-8px"
                            letterSpacing={{ base: "2.4px", md: "3.9px" }}
                            fontStyle="italic"
                            lineHeight="0.75"
                            fontSize={{ base: "64px", md: "56px", xl: "78px" }}
                        >
                            {imageOverlayTitle}
                        </Text>
                    </VStack>
                </Flex>
                {/* Card content */}
                <Flex
                    mt={4}
                    zIndex={1}
                    width={"100%"}
                    maxW={{ base: "312px", md: "412px" }}
                    h="124px"
                    alignItems={"center"}
                    flexDir={"column"}
                >
                    <Text
                        color={"green.100"}
                        textAlign={"center"}
                        fontFamily={"'Barlow Condensed', sans-serif"}
                        fontWeight={"semibold"}
                        fontStyle={"italic"}
                        letterSpacing="0.6px"
                        lineHeight="36px"
                        fontSize={{ base: "28px", md: "24px", xl: "30px" }}
                    >
                        {title}
                    </Text>
                    <Text
                        mt={2}
                        textAlign={"center"}
                        fontFamily={"'Barlow'"}
                        fontWeight="medium"
                        fontSize={{ base: "14px", xl: "18px" }}
                        lineHeight={{ base: "16px", xl: "22px" }}
                    >
                        {description}
                    </Text>
                    {/* <ButtonWithIcon title={buttonTitle} link={buttonLink} color="green.600" width={{ md: "200px", lg: "250px" }} /> */}
                </Flex>
                <LightItUpCTAButton link={buttonLink}>
                    {buttonTitle}
                </LightItUpCTAButton>
            </VStack>
        </Center>
    );
}

export default LightItUpCard;
