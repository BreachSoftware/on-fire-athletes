import {
    Box,
    Text,
    Button,
    Flex,
    Heading,
    useBreakpointValue,
} from "@chakra-ui/react";
import PhotoFrame from "./photo_frame";
import { useRouter } from "next/navigation";
import useEmblaCarousel from "embla-carousel-react";
import { useState } from "react";
import { BeatLoader } from "react-spinners";
import { CSSProperties } from "styled-components";

interface InTheNewsProps {
    showBackground: boolean;
    title: string;
    data: {
        id: number;
        imageUrl: string;
        headline: string;
        description: string;
    }[];
    articleHeader?: boolean;
}

/**
 * NewsComponent displays a list of news items with their images,
 * headlines, and a short description. Each news item can be interacted with
 * via a button. The data for news items is currently mocked within the component
 * but could be sourced from props or an API in a real-world scenario.
 *
 * @returns {JSX.Element} The rendered NewsComponent.
 */
export default function InTheNews(props: InTheNewsProps) {
    const isMobile = useBreakpointValue({
        base: true,
        md: false,
    });

    const router = useRouter();
    // State to keep track of loading states for each news item
    const [loadingStates, setLoadingStates] = useState<{
        [key: number]: boolean;
    }>({});

    const [emblaRef] = useEmblaCarousel({
        loop: false,
        align: "center", // Align to the center
        slidesToScroll: 1,
        containScroll: "keepSnaps",
    });

    const viewportStyle: CSSProperties = {
        overflow: "hidden",
        width: "100%",
        height: "100%",
    };

    const containerStyle: CSSProperties = {
        display: "flex",
        willChange: "transform",
    };

    const slideStyle: CSSProperties = {
        flex: "0 0 100%", // Takes full width of the container
        minWidth: "100%", // Takes full width of the container
        boxSizing: "border-box",
        padding: "0",
        margin: "0",
    };

    return (
        <Box
            pos={"relative"}
            overflow="hidden"
            minH={{ base: "0px", md: "800px" }}
            h="min-content"
        >
            <Flex
                p={8}
                flexDir={"column"}
                h="100%"
                justifyContent={"center"}
                alignItems={"center"}
            >
                {/* If we are showing the header on the News Articles or not */}
                {props.articleHeader ? (
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
                        {props.title}
                    </Text>
                ) : (
                    <Heading
                        as="b"
                        size="xxl"
                        textAlign="center"
                        fontFamily={"'Barlow Condensed', sans-serif"}
                        fontWeight={600}
                        fontSize={"60px"}
                        fontStyle={"normal"}
                        color={"green.100"}
                        mb={6}
                    >
                        {props.title}
                    </Heading>
                )}
                {isMobile ? (
                    <div ref={emblaRef} style={viewportStyle}>
                        <div style={containerStyle}>
                            {props.data.map((item, index) => {
                                return (
                                    <div key={index} style={slideStyle}>
                                        <Box p={2} alignContent={"center"}>
                                            <Box
                                                ml={index === 0 ? 6 : 0}
                                                alignItems={"centers"}
                                                maxW={"80%"}
                                            >
                                                <PhotoFrame
                                                    src={item.imageUrl}
                                                    alt="News image"
                                                />
                                            </Box>
                                            <Text
                                                fontFamily="'Barlow Condensed', sans-serif"
                                                fontSize="47px"
                                                color="black"
                                                fontWeight={600}
                                                fontStyle="italic"
                                                letterSpacing="0.94px"
                                                pl={index === 0 ? 6 : 0}
                                            >
                                                {item.headline}
                                            </Text>
                                            <Text
                                                fontFamily="'Barlow', sans-serif"
                                                fontSize="23px"
                                                color="gray.600"
                                                fontWeight={500}
                                                letterSpacing="0.46px"
                                                mb={4}
                                                maxW={"90%"}
                                                pl={index === 0 ? 6 : 0}
                                            >
                                                {item.description}
                                            </Text>
                                            <Button
                                                maxW={{
                                                    base: "50%",
                                                    sm: "50%",
                                                    md: "30%",
                                                }}
                                                _hover={{
                                                    md: {
                                                        maxW: {
                                                            base: "60%",
                                                            sm: "60%",
                                                            md: "40%",
                                                        },
                                                        width: {
                                                            base: "60%",
                                                            sm: "60%",
                                                            md: "40%",
                                                        },
                                                    },
                                                }}
                                                variant="next"
                                                fontSize="14px"
                                                fontFamily="'Barlow Condensed', sans-serif"
                                                letterSpacing="2px"
                                                onClick={() => {
                                                    setLoadingStates(
                                                        (prevState) => {
                                                            return {
                                                                ...prevState,
                                                                [item.id]: true,
                                                            };
                                                        },
                                                    );
                                                    router.push("/newsroom");
                                                }}
                                                isLoading={
                                                    loadingStates[item.id]
                                                }
                                                spinner={
                                                    <BeatLoader
                                                        size={8}
                                                        color="white"
                                                    />
                                                }
                                                ml={index === 0 ? 6 : 0}
                                            >
                                                {"Learn More"}
                                            </Button>
                                        </Box>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <Flex
                        justifyContent="space-around"
                        flexDir={"row"}
                        flexWrap={"wrap"}
                        zIndex={1}
                    >
                        {props.data.map((item) => {
                            return (
                                <Box
                                    key={item.id}
                                    maxWidth={{ base: "300px", md: "500px" }}
                                    p={4}
                                    m={8}
                                    mx={2}
                                >
                                    <PhotoFrame
                                        src={item.imageUrl}
                                        alt="News image"
                                    />
                                    <Text
                                        fontFamily="'Barlow Condensed', sans-serif"
                                        fontSize="47px"
                                        color="black"
                                        fontWeight={600}
                                        fontStyle="italic"
                                        letterSpacing="0.94px"
                                        mt={3}
                                    >
                                        {item.headline}
                                    </Text>
                                    <Text
                                        fontFamily="'Barlow', sans-serif"
                                        fontSize="23px"
                                        color="gray.600"
                                        fontWeight={500}
                                        letterSpacing="0.46px"
                                        mb={4}
                                    >
                                        {item.description}
                                    </Text>
                                    <Button
                                        maxW={{
                                            base: "50%",
                                            sm: "50%",
                                            md: "30%",
                                        }}
                                        _hover={{
                                            md: {
                                                maxW: {
                                                    base: "60%",
                                                    sm: "60%",
                                                    md: "40%",
                                                },
                                                width: {
                                                    base: "60%",
                                                    sm: "60%",
                                                    md: "40%",
                                                },
                                            },
                                        }}
                                        variant="next"
                                        fontSize="14px"
                                        fontFamily="'Barlow Condensed', sans-serif"
                                        letterSpacing="2px"
                                        onClick={() => {
                                            router.push("/newsroom");
                                        }}
                                    >
                                        Learn More
                                    </Button>
                                </Box>
                            );
                        })}
                    </Flex>
                )}
            </Flex>

            {/* If we want the background to be transparent or not */}
            {props.showBackground && (
                <Box
                    zIndex={"-1"}
                    position={"absolute"}
                    top={"0"}
                    left={"0"}
                    right={"0"}
                    bottom={"0"}
                    backgroundImage={"url('crinkled-paper.png')"}
                    backgroundRepeat={"repeat"}
                    backgroundSize={"1800px"}
                    backgroundPosition={"center top"}
                />
            )}
        </Box>
    );
}
