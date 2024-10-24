/* eslint-disable max-len */
"use client";
import React from "react";

import { Flex, Box, Text, Image, Link, Button } from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";
// import InTheNews from "@/components/in_the_news";

const headerImage = "crinkled-paper.png";

// the data in the article. complete with an image, header, subheader, main text, youtube link
const data = {
    image: "in_the_news/news3.png",
    header: "Game Coin Donates to Mater Academy East Las Vegas",
    subheader:
        "We’re happy to announce our donation to Mater Academy in East Las Vegas. Watch the video below to see our Technical Director Frederick Lenna explain our platform and our donation to Mater Academy East Las Vegas with GMEX Ambassador Kyle Meade.",
    text: "Game Coin's Technical Director Frederick Lenna explains the platform. Game Coin donates to Mater Academy Las Vegas with GMEX Ambassador Kyle Meade.",
    youtube: "https://www.youtube.com/watch?v=ZhRxxOjCMCw",
};

/**
 * The article page component.
 * @returns {JSX.Element} The article page component.
 */
export default function Article() {
    return (
        <>
            <Flex
                minH="100vh"
                minW="100vw"
                direction="column"
                alignItems="center"
                userSelect="none"
            >
                {/* Top Section with Gradient */}
                <Flex
                    w={{ base: "100%", lg: "calc(100% - 140px)" }} // Adjust width here
                    h={{
                        base: "50vh",
                        sm: "65vh",
                        md: "80vh",
                        lg: "80vh",
                        xl: "90vh",
                    }}
                    bgGradient="linear(to-b, #000000, #31453D)"
                    position="relative"
                    mr={{ lg: "140px" }} // Add margin-right to compensate for sidebar
                >
                    {/* Overlapping Header */}
                    <Flex
                        position="absolute"
                        bottom="-20px" // Adjust as needed for the overlap effect
                        w="100%"
                        justifyContent={"center"}
                        alignItems={"center"}
                    >
                        <Flex
                            w={{ base: "90%", md: "80%", lg: "70%", xl: "50%" }}
                            flexDirection={"column"}
                            justifyContent={"center"}
                            alignItems={"center"}
                        >
                            {/* Back to Home Button */}
                            <Link href="/" width={"100%"}>
                                <Text
                                    width={"100%"}
                                    fontSize={{
                                        base: "xs",
                                        md: "2xl",
                                        lg: "14px",
                                    }}
                                    textAlign="center"
                                    fontFamily={"Roboto.100"}
                                    fontStyle="italic"
                                    textColor={"white"}
                                    letterSpacing={2.8}
                                >
                                    BACK TO HOME
                                </Text>
                            </Link>

                            {/* Article Title */}
                            <Text
                                width={"80%"}
                                fontSize={{
                                    base: "28px",
                                    sm: "32px",
                                    md: "36px",
                                    lg: "40px",
                                }}
                                mb={4}
                                textAlign="center"
                                fontFamily={"Barlow Condensed"}
                                fontStyle="italic"
                                textColor={"green.100"}
                                fontWeight={600}
                                letterSpacing={1}
                            >
                                {data.header}
                            </Text>

                            {/* Article Image */}
                            <Box w={"fit-content"} boxShadow="xl">
                                <Image src={data.image} alt="Article Image" />
                            </Box>
                        </Flex>
                    </Flex>
                </Flex>

                {/* Body Section */}
                <Flex
                    w={{ base: "100%", lg: "calc(100% - 140px)" }} // Adjust width here
                    flex="1"
                    backgroundImage={`url(${headerImage})`}
                    backgroundSize="cover"
                    backgroundPosition="center"
                    direction="column"
                    alignItems="center"
                    justifyContent="flex-start"
                    mr={{ lg: "140px" }} // Add margin-right to compensate for sidebar
                    paddingBottom={8}
                >
                    {/* Article Content */}
                    <Flex
                        flexDirection={"column"}
                        alignItems={"center"}
                        justifyContent={"flex-start"}
                        w={{ base: "90%", md: "80%", lg: "70%", xl: "50%" }}
                        gap={8}
                    >
                        {/* Article Subheader */}
                        <Box
                            w={"100%"}
                            marginTop={"40px"}
                            textColor={"green.900"}
                            fontFamily={"Roboto"}
                            fontSize={"20px"}
                            fontWeight={"bold"}
                            lineHeight={"2"}
                        >
                            <Text fontSize="md">{data.subheader}</Text>
                        </Box>

                        {/* Video Button */}
                        <Button
                            width={"min-content"}
                            variant={"watchVideo"}
                            onClick={() => {
                                return window.open(data.youtube, "_blank");
                            }}
                        >
                            Watch Video
                        </Button>

                        {/* Article Text */}
                        <Box
                            w={"100%"}
                            textColor={"green.900"}
                            fontFamily={"Roboto"}
                            fontSize={"18px"}
                            fontWeight={"regular"}
                            lineHeight={"2"}
                        >
                            <Text fontSize="md">{data.text}</Text>
                        </Box>

                        {/* Back to Home Button */}
                        <Link href="/" alignSelf={"flex-start"}>
                            <Flex
                                direction={"row"}
                                alignItems={"center"}
                                justifyContent={"center"}
                                width={"fit-content"}
                            >
                                <ChevronLeftIcon
                                    w={6}
                                    h={6}
                                    color={"gray.1700"}
                                />
                                <Text
                                    width={"100%"}
                                    fontSize={{
                                        base: "xs",
                                        md: "2xl",
                                        lg: "14px",
                                    }}
                                    textAlign="center"
                                    fontFamily={"Roboto.100"}
                                    fontStyle="italic"
                                    textColor={"gray.1700"}
                                    fontWeight={600}
                                    letterSpacing={2.8}
                                    _hover={{ textDecoration: "underline" }}
                                >
                                    BACK TO HOME
                                </Text>
                            </Flex>
                        </Link>
                    </Flex>

                    {/* The "More Articles" Section. Client wants this removed for now but let's keep this commented if we return */}
                    {/* <Flex
						width={"100%"}
						flexDirection={"column"}
						alignItems={"center"}
						paddingTop={8}
					>
						<Divider
							borderColor={"gray.1700"}
							borderWidth={2}
							width={"80%"}
						/>

						// More in the News
						<InTheNews
							showBackground={false}
							title="More in the News"
							data={inTheNewsData}
							articleHeader={true}
						/>
					</Flex> */}
                </Flex>
            </Flex>
        </>
    );
}
