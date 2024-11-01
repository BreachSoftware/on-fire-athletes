import React from "react";
import { Box, Text, Flex, Heading } from "@chakra-ui/react";
import InTheNewsArticle from "./article";
import InTheNewsCarousel from "./carousel";
import CrinkledPaper from "@/images/backgrounds/crinkled-paper.png";

interface InTheNewsProps {
    showBackground: boolean;
    title: string;
    data: {
        id: number;
        imageUrl: string;
        headline: string;
        description: string;
        link: string;
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
    return (
        <Box
            position="relative"
            minH={{ base: "none", md: "100dvh" }}
            h="fit-content"
        >
            {props.showBackground && <BackgroundComponent />}
            <Flex
                px={{ base: "12px", md: "64px", xl: "100px" }}
                py={{ base: 12, md: 16 }}
                position="relative"
                minH={{ base: "none", md: "100dvh" }}
                h="fit-content"
                flexDir={"column"}
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
                        fontWeight={700}
                        lineHeight="70px"
                        fontSize={{ base: "48px", xl: "60px" }}
                        fontStyle={"normal"}
                        color={"green.100"}
                        letterSpacing="3px"
                        textTransform="uppercase"
                        mb={{ base: 8, md: 12 }}
                    >
                        {props.title}
                    </Heading>
                )}
                <InTheNewsCarousel items={props.data} />
                <Flex
                    display={{ base: "none", lg: "flex" }}
                    justifyContent="space-around"
                    gridGap={12}
                    flexDir={{ base: "column", md: "row" }}
                >
                    {props.data.map((item) => {
                        return <InTheNewsArticle key={item.id} item={item} />;
                    })}
                </Flex>
            </Flex>
        </Box>
    );
}

function BackgroundComponent() {
    return (
        <>
            <Box
                position={"absolute"}
                top={"0"}
                left={"0"}
                right={"0"}
                bottom={"0"}
                backgroundImage={CrinkledPaper.src}
                backgroundRepeat="no-repeat"
                backgroundSize="cover"
                backgroundPosition={"center top"}
            />
        </>
    );
}
