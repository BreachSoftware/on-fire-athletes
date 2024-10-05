"use client";
import React from "react";
import {
    VStack,
    Button,
    Box,
    Heading,
    Flex,
    useBreakpointValue,
    Text,
    CardBody,
    Card,
    CardFooter,
    CardHeader,
    Spacer,
    HStack,
} from "@chakra-ui/react";
import NavBar from "../navbar";
import Sidebar from "@/components/sidebar";
import CheckItem from "./checkItem";
import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Pricing page component
 * @returns JSX.Element
 */
export default function Pricing() {
    const router = useRouter();
    const showSidebar = useBreakpointValue({ base: false, lg: true });

    // Button loading state
    const [leftIsLoading, setLeftIsLoading] = useState(false);
    const [rightIsLoading, setRightIsLoading] = useState(false);

    return (
        <>
            {/* Items around main content */}
            <Flex
                w="100%"
                h="100%"
                minH={"100vh"}
                justify="flex-start"
                direction="row-reverse"
            >
                <Flex
                    direction="column"
                    position="absolute"
                    top="0"
                    left="0"
                    zIndex={-10}
                    h="100%"
                    w="100%"
                >
                    {/* Background Image #1 */}
                    <Flex
                        bgImage="keith-johnston-card-array.png"
                        bgPosition="center"
                        bgRepeat="no-repeat"
                        bgSize="cover"
                        h="100%"
                        w="100%"
                    >
                        <Flex
                            bgGradient={
                                "linear(180deg, rgba(0, 0, 0, 0.9) 0%, rgba(49, 69, 61, 0.9) 100%) 0% 0% no-repeat padding-box;"
                            }
                            h="100%"
                            w="100%"
                        />
                    </Flex>
                </Flex>

                {showSidebar ? (
                    <Sidebar height="100vh" backgroundPresent={false} />
                ) : null}
                <Box w="100%">
                    <NavBar />

                    {/* Page content */}
                    <VStack spacing={50}>
                        {/* Header */}
                        <VStack
                            paddingTop={useBreakpointValue({
                                base: "3vh",
                                sm: "5vh",
                            })}
                        >
                            <Heading
                                fontFamily={"Barlow Semi Condensed"}
                                lineHeight={0.1}
                                fontWeight={"bold"}
                                textTransform={"uppercase"}
                                color={"green.100"}
                            >
                                Get in the Game
                            </Heading>
                            <Heading
                                color={"white"}
                                fontSize={useBreakpointValue({
                                    base: "40px",
                                    md: "60px",
                                })}
                                fontFamily={"'Brotherhood', sans-serif"}
                                fontWeight={"normal"}
                                textAlign={"center"}
                            >
                                Choose Your Way to Play
                            </Heading>
                        </VStack>

                        {/* Pricing Options */}
                        <Flex
                            gap={6}
                            direction={useBreakpointValue({
                                base: "column",
                                sm: "row",
                            })}
                            w={"90%"}
                            height={"100%"}
                            p={useBreakpointValue({ base: 5, sm: 0 })}
                            justifyContent={"center"}
                            alignItems={"center"}
                            wrap={"wrap"}
                        >
                            {/* White Digital Card */}
                            <Card
                                variant={"digital"}
                                height={useBreakpointValue({
                                    base: "min-content",
                                    sm: 400,
                                })}
                                width={useBreakpointValue({
                                    base: "90%",
                                    sm: "20%",
                                })}
                                minW={useBreakpointValue({
                                    base: "auto",
                                    sm: 300,
                                })}
                                paddingLeft={useBreakpointValue({
                                    base: 0,
                                    sm: 3,
                                })}
                                paddingRight={useBreakpointValue({
                                    base: 0,
                                    sm: 3,
                                })}
                            >
                                <CardHeader>
                                    <Flex
                                        direction={"row"}
                                        alignItems={"flex-end"}
                                        wrap={"wrap"}
                                        gap={3}
                                    >
                                        <Heading
                                            fontFamily={"Barlow Semi Condensed"}
                                            fontWeight={"bold"}
                                            size={"lg"}
                                            transform={"skew(-10deg)"}
                                        >
                                            DIGITAL
                                        </Heading>
                                        <Text>$9.99</Text>
                                    </Flex>

                                    <Text
                                        fontFamily={"Barlow Semi Condensed"}
                                        color={"gray.400"}
                                    >
                                        Trade and sell cards online
                                    </Text>
                                </CardHeader>

                                {/* Checkboxes */}
                                <CardBody paddingTop={3}>
                                    <VStack
                                        height={"90%"}
                                        alignItems={"flex-start"}
                                        justifyContent={"space-between"}
                                    >
                                        <CheckItem text={"Lorem Ipsum"} />
                                        <CheckItem text={"Dolor Sit"} />
                                        <CheckItem text={"Amet Consectetur"} />
                                        <CheckItem text={"Adipiscing Elit"} />
                                        <CheckItem text={"Sed Do Eiusmod"} />
                                    </VStack>
                                </CardBody>

                                <CardFooter>
                                    <Button
                                        variant={"applyFilter"}
                                        isLoading={leftIsLoading}
                                        onClick={() => {
                                            setLeftIsLoading(true);
                                            return router.push("/payment");
                                        }}
                                    >
                                        Get Started
                                    </Button>
                                </CardFooter>
                            </Card>

                            {/* Green Physical Card */}
                            <Card
                                variant={"physical"}
                                height={useBreakpointValue({
                                    base: "min-content",
                                    sm: 400,
                                })}
                                width={useBreakpointValue({
                                    base: "90%",
                                    sm: "40%",
                                })}
                                minW={useBreakpointValue({
                                    base: "auto",
                                    sm: 300,
                                })}
                                paddingLeft={useBreakpointValue({
                                    base: 0,
                                    sm: 3,
                                })}
                                paddingRight={useBreakpointValue({
                                    base: 0,
                                    sm: 3,
                                })}
                            >
                                <CardHeader>
                                    <Flex
                                        direction={"row"}
                                        alignItems={"flex-end"}
                                        wrap={"wrap"}
                                    >
                                        <Flex
                                            direction={"row"}
                                            alignItems={"flex-end"}
                                            wrap={"wrap"}
                                            gap={3}
                                        >
                                            <Heading
                                                fontFamily={
                                                    "Barlow Semi Condensed"
                                                }
                                                fontWeight={"bold"}
                                                textTransform={"uppercase"}
                                                size={"lg"}
                                                transform={"skew(-10deg)"}
                                            >
                                                PHYSICAL
                                            </Heading>

                                            <Text>$39.99</Text>
                                        </Flex>

                                        <Spacer />

                                        <Box
                                            bg={"green.600"}
                                            borderRadius={"full"}
                                            pl={3}
                                            pr={3}
                                            mt={2}
                                            mb={2}
                                            alignSelf={"flex-start"}
                                            fontSize={useBreakpointValue({
                                                base: "10px",
                                                sm: "sm",
                                            })}
                                        >
                                            Recommended
                                        </Box>
                                    </Flex>

                                    <Text fontFamily={"Barlow Semi Condensed"}>
                                        Collect and share your creations
                                    </Text>
                                </CardHeader>

                                <CardBody paddingTop={3}>
                                    <HStack
                                        justifyContent={"space-between"}
                                        width={"100%"}
                                        height={"100%"}
                                        alignItems={"flex-start"}
                                    >
                                        {/* Checkboxes */}
                                        <VStack
                                            height={"90%"}
                                            alignItems={"flex-start"}
                                            justifyContent={"space-between"}
                                            width={"60%"}
                                        >
                                            <CheckItem text={"Lorem Ipsum"} />
                                            <CheckItem text={"Dolor Sit"} />
                                            <CheckItem
                                                text={"Sed Do Eiusmod kvjndcln"}
                                            />
                                            <CheckItem text={"Lorem Ipsum"} />
                                            <CheckItem text={"Dolor Sit"} />
                                        </VStack>
                                    </HStack>
                                </CardBody>

                                <CardFooter
                                    width={useBreakpointValue({
                                        base: "100%",
                                        sm: "50%",
                                    })}
                                >
                                    <Button
                                        variant={"applyFilterWhite"}
                                        // Remove these two lines when we start offering this service!
                                        isDisabled={true}
                                        _hover={{}}
                                        isLoading={rightIsLoading}
                                        onClick={() => {
                                            setRightIsLoading(true);
                                            return router.push("/payment");
                                        }}
                                    >
                                        Coming Soon!
                                    </Button>
                                </CardFooter>
                            </Card>
                        </Flex>
                    </VStack>
                </Box>
            </Flex>
        </>
    );
}
