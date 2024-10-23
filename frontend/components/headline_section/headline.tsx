import "@fontsource/barlow-condensed/600-italic.css"; // SemiBold Italic style
import "@fontsource/barlow/600-italic.css"; // Medium Italic style
import { Button, Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { ChevronRightIcon } from "@chakra-ui/icons";

interface HeadlineProps {
    headlineTitle: string;
    buttonText?: string;
    url?: string;
    width?: string;
    height?: string;
    background: string;
}

/**
 *
 * @returns
 */
export default function Headline(props: HeadlineProps) {
    const router = useRouter();

    return (
        <Flex
            w={
                props.width || {
                    base: "45vh",
                    sm: "50vh",
                    md: "55vh",
                    lg: "70vh",
                }
            }
            maxWidth={{ base: "300px", md: "500px" }}
            h={props.height || { base: "45vh", lg: "50vh" }}
            maxHeight={{ base: "300px", md: "500px" }}
            backgroundImage={props.background}
            backgroundSize={"cover"}
            backgroundPosition={"center"}
            role="group"
            zIndex={1}
        >
            <Flex
                w="100%"
                h="100%"
                padding="15px"
                bgGradient="linear(to-r, #27CE00D1, #146709D1)"
                _hover={{
                    md: {
                        cursor: "pointer",
                        bgGradient: "linear(to-r, #00D200EA, #105208EA)",
                    },
                }}
                transition="all 0.3s ease-out"
                onClick={() => {
                    if (props.url != undefined) {
                        router.push(props.url);
                    }
                }}
            >
                <Flex
                    flexDirection="column"
                    gap="20px"
                    padding="15px"
                    justifyContent="center"
                    alignItems="center"
                    w="100%"
                >
                    <Text
                        color="white"
                        fontFamily={"'Brotherhood', sans-serif"}
                        fontSize="60px"
                        textAlign="center"
                        letterSpacing="1.4px"
                        lineHeight="60px"
                    >
                        {props.headlineTitle}
                    </Text>
                    <Button
                        variant={"outline"}
                        width={"min-content"}
                        outline="none"
                        _focus={{
                            outline: "none",
                            shadow: "none",
                        }}
                        _groupHover={{
                            bg: "white",
                            color: "#00D200DD",
                        }}
                        backgroundColor={"transparent"}
                        color="white"
                        alignItems={"center"}
                        px="16px"
                        borderWidth="2px"
                        _hover={{
                            color: "#00D200DD",
                        }}
                    >
                        <Text
                            fontSize={"14px"}
                            fontFamily={"'Barlow Semi-Condensed', sans-serif"}
                            fontWeight={600}
                        >
                            {props.buttonText || "LEARN MORE"}
                        </Text>
                        <ChevronRightIcon
                            minH="24px"
                            minW="24px"
                            ml="4px"
                            mb="1px"
                        />
                    </Button>
                </Flex>
            </Flex>
        </Flex>
    );
}
