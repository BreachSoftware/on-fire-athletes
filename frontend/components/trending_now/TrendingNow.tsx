"use client";
import { Stack, Center, Heading, VStack, useToast } from "@chakra-ui/react";
import { fetchAllCards } from "@/app/lockerroom/components/FetchAllCards";
import { useEffect, useState } from "react";
import TrendingNowCarousel from "./TrendingCarousel";
import TrendingCard from "./TrendingCard";
import LightItUpCTAButton from "@/app/components/buttons/light-it-up-button";
// import TrendingNowCarousel from "./TrendingCarousel";

import DarkPaper from "@/images/backgrounds/darkpaper.png";

/**
 * Section of the home page that displays the cards that are currently trending.
 *
 * @returns {JSX.Element} The rendered trending now component.
 */
export default function TrendingNow() {
    // State variables to store the cards
    const toast = useToast();
    const [cards, setCards] = useState([]);

    useEffect(() => {
        fetchAllCards()
            .then((fetchedCards) => {
                setCards(fetchedCards.slice(0, 4));
            })
            .catch((error) => {
                console.error("Error fetching Trending Cards:", error);
                toast({
                    title: "Error",
                    description: "Failed to load cards. Please try again.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom-right",
                });
            });
    }, [toast]);

    return (
        <>
            <Center
                flexDir="column"
                backgroundImage={DarkPaper.src}
                backgroundRepeat="no-repeat"
                backgroundSize="cover"
                backgroundPosition={"center center"}
                width="full"
                alignItems={"center"}
                mb="-1px"
                pt={32}
                px={{ base: "24px", md: "64px", lg: "100px" }}
                pb={{ base: 0, md: 12 }}
            >
                <VStack spacing={0} mb={{ base: 4, md: 12 }}>
                    <Heading
                        fontFamily={"Barlow Condensed"}
                        lineHeight={0}
                        fontSize={{ base: "40px", lg: "60px" }}
                        letterSpacing={"3px"}
                        fontWeight={"bold"}
                        textTransform={"uppercase"}
                        color={"green.100"}
                    >
                        Sports Cards
                    </Heading>
                    <Heading
                        color={"white"}
                        mt={{ base: "none", md: "8px" }}
                        fontSize={{ base: "52px", lg: "80px" }}
                        letterSpacing={0}
                        fontWeight="normal"
                        lineHeight="103px"
                        fontFamily={"Brotherhood, sans-serif"}
                    >
                        Trending Now
                    </Heading>
                </VStack>
                <Stack
                    display={{ base: "none", lg: "flex" }}
                    direction="row"
                    gap={10}
                    flexWrap={"wrap"}
                    justifyContent={"center"}
                    w="full"
                    px={"16px"}
                >
                    {[...cards, ...cards].slice(0, 4).map((card, index) => {
                        return (
                            <TrendingCard
                                key={index}
                                passedInCard={card}
                                shouldShowButton={true}
                            />
                        );
                    })}
                </Stack>
                <TrendingNowCarousel cards={cards} />
                <LightItUpCTAButton
                    color="white"
                    my={16}
                    textTransform="uppercase"
                    link={"/lockerroom"}
                >
                    View Locker Room
                </LightItUpCTAButton>
            </Center>
        </>
    );
}
