"use client";

import { useState, useEffect, useRef } from "react";
import {
    Box,
    HStack,
    Image as ChakraImage,
    Spinner,
    useToast,
    Flex,
    Menu,
    Button,
    MenuButton,
    MenuItem,
    MenuList,
} from "@chakra-ui/react";
import NavBar from "../navbar";
import Sidebar from "@/components/sidebar";
import Footer from "../components/footer";
import Image from "next/image";
import the from "../../public/the_locker_room/The.svg";
import locker from "../../public/the_locker_room/Locker.svg";
import room from "../../public/the_locker_room/Room.svg";
import TradingCardInfo from "@/hooks/TradingCardInfo";
import LockerRoomFilter from "../lockerroom/components/LockerRoomFilter";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useCurrentFilterInfo } from "@/hooks/useCurrentFilter";
import FilterInfo from "@/hooks/FilterInfo";
import PaginatedList from "./components/PaginatedList";
import { fetchAllCards } from "./components/FetchAllCards";
import { getWithExpiry } from "@/components/localStorageFunctions";
import { BackToCheckoutModal } from "../components/BackToCheckoutModal";
import { helvetica } from "@/theming/fonts";

/**
 *
 * The locker room
 *
 */
export default function LockerRoom() {
    const [cards, setCards] = useState([]);
    const [filterableCards, setFilterableCards] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const toast = useToast();
    const filter = useCurrentFilterInfo();
    const [searchboxValue, setSearchboxValue] = useState("");
    const targetRef = useRef<HTMLDivElement>(null);

    const [currentPage, setCurrentPage] = useState<number>(() => {
        // Try to get the saved page from local storage
        const expiryVariable = getWithExpiry("lastPaginationPage");
        const savedPage = parseInt(expiryVariable || 1);
        return savedPage;
    });

    /**
     * Filters the trading cards based on the selected filter tags.
     *
     * @param {TradingCardInfo} card - The trading card object to be filtered.
     * @returns {boolean} - Returns true if the card satisfies all the filter conditions, otherwise false.
     */
    function filterCards(card: TradingCardInfo): boolean {
        // Array of filter categories
        const filterCategories = [
            "sport",
            "careerLevel",
            "position",
            "yearCreated",
        ];

        // Check if the card's first name or last name includes the search value
        const fullName = `${card.firstName} ${card.lastName}`.toLowerCase();
        const searchValue = searchboxValue.toLowerCase();
        const matchesSearchValue = fullName.includes(searchValue);

        if (searchValue && !matchesSearchValue) {
            return false;
        }

        return filterCategories.every((category) => {
            // Get the selected tags for the current category
            const tags =
                filter.curFilter[category as keyof Omit<FilterInfo, "type">]
                    .tags;
            const selectedTags = tags.filter((tag: { value: boolean }) => {
                return tag.value;
            });

            // If no tags are selected in the current category, include the card
            if (selectedTags.length === 0) {
                return true;
            }

            // Get the card's value for the current category
            let cardValue = card[category as keyof TradingCardInfo];

            if (category === "yearCreated") {
                cardValue = new Date(card.createdAt * 1000)
                    .getFullYear()
                    .toString();
            }

            // Check if the selectedTag is an "Other" for the "position" category
            const isOtherCard =
                category === "position" && selectedTags[0].title === "Other";

            // Check if the card's value matches any of the selected tags or if it's an "Other" card
            return selectedTags.some((tag: { title: string }) => {
                return tag.title === cardValue || isOtherCard;
            });
        });
    }

    // useEffect hook to update the filterable cards based on the current filter
    useEffect(() => {
        if (filter.curFilter.type === "1") {
            // Filter the cards using the filterCards function
            setFilterableCards(
                cards.filter((card: TradingCardInfo) => {
                    return filterCards(card);
                }),
            );
        } else if (filter.curFilter.type === "2") {
            // Filter the cards that are for sale
            setFilterableCards(
                cards.filter((card: TradingCardInfo) => {
                    return filterCards(card) && card.price > 0;
                }),
            );
        } else if (filter.curFilter.type === "3") {
            // Filter the cards that are trade only
            setFilterableCards(
                cards.filter((card: TradingCardInfo) => {
                    return filterCards(card) && card.price === 0;
                }),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cards, filter, searchboxValue]);

    // Sort by
    const [sortBy, setSortBy] = useState("Recent");

    /**
     * Function that switches what we are sorting the filtered list by
     * @param option The option to sort by
     */
    function handleSortOption(option: string) {
        setSortBy(option);
    }

    /**
     * Function that sorts the cards based on the selected sort option
     * @returns The sorted list of cards
     */
    function sortCards() {
        switch (sortBy) {
            case "Recent":
                return [...filterableCards];
            case "Alphabetical":
                return [...filterableCards].sort(
                    (a: TradingCardInfo, b: TradingCardInfo) => {
                        return a.firstName.localeCompare(b.firstName);
                    },
                );
            case "Reverse Alphabetical":
                return [...filterableCards].sort(
                    (a: TradingCardInfo, b: TradingCardInfo) => {
                        return b.firstName.localeCompare(a.firstName);
                    },
                );
            case "Trending":
                // Not implemented yet
                return [...filterableCards];
            default:
                return filterableCards;
        }
    }

    useEffect(() => {
        // Fetch all cards and set the cards state
        fetchAllCards()
            .then((fetchedCards) => {
                setCards(fetchedCards);
                setFilterableCards(fetchedCards);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching cards:", error);
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
            <BackToCheckoutModal />
            <Box
                bgGradient={
                    "linear(180deg, gray.1200 0%, gray.1300 100%) 0% 0% no-repeat padding-box;"
                }
                minH={"100dvh"}
            >
                <HStack alignItems={"top"} width={"100%"} gap={0}>
                    <Flex flexDir="column" w="full" h="full" minH="100dvh">
                        <Box width={"100%"}>
                            <NavBar />
                        </Box>
                        <Box width={"100%"} flex={1}>
                            {/* The Locker Room Title */}
                            <HStack
                                fontFamily={"'Brotherhood', sans-serif"}
                                flexWrap={"wrap"}
                                justifyContent={"center"}
                                alignContent={"center"}
                                overflowX={"hidden"}
                                // The title is centered on desktop, taking into account the sidebar, which mobile doesn't have
                                pl={{ base: "0px", md: "70px" }}
                                pt={{ base: "16px", md: "0px" }}
                            >
                                <ChakraImage
                                    as={Image}
                                    src={the}
                                    alt="The"
                                    height={{
                                        base: "60px",
                                        sm: "72px",
                                        md: "80px",
                                        xl: "132px",
                                    }}
                                    w="fit-content"
                                />
                                <Flex>
                                    <ChakraImage
                                        as={Image}
                                        src={locker}
                                        priority
                                        alt="Locker"
                                        height={{
                                            base: "70px",
                                            sm: "85px",
                                            md: "100px",
                                            xl: "150px",
                                        }}
                                        w="fit-content"
                                    />
                                    <ChakraImage
                                        as={Image}
                                        src={room}
                                        alt="Room"
                                        height={{
                                            base: "70px",
                                            sm: "85px",
                                            md: "100px",
                                            xl: "150px",
                                        }}
                                        w="fit-content"
                                    />
                                </Flex>
                            </HStack>

                            {/* Main Content */}
                            <HStack
                                width={{ base: "100%", sm: "" }}
                                alignItems={{
                                    base: "top",
                                    sm: "top",
                                    lg: "top",
                                }}
                                justifyContent={"center"}
                                display={"flex"}
                                flexWrap={{
                                    base: "wrap",
                                    sm: "wrap",
                                    lg: "nowrap",
                                }}
                                flexDir={{
                                    base: "column",
                                    sm: "column",
                                    lg: "row",
                                }}
                                gap={{
                                    base: 0,
                                    md: "45px",
                                    lg: "25px",
                                    "2xl": "60px",
                                }}
                                paddingX={{
                                    base: 0,
                                    sm: 0,
                                    md: "12px",
                                    lg: "24px",
                                    xl: "48px",
                                    "2xl": "72px",
                                }}
                                paddingTop={{ base: "16px", md: "25px" }}
                            >
                                {/* Left Side Filter Area */}
                                <Box
                                    flex={"1"}
                                    height={"min-content"}
                                    minW={{
                                        base: "95%",
                                        sm: "95%",
                                        lg: 240,
                                        xl: 332,
                                    }}
                                    maxW={{
                                        base: "95%",
                                        sm: "95%",
                                        lg: 240,
                                        xl: 332,
                                    }}
                                    margin={{ base: "auto", sm: "auto", lg: 0 }} // Center the filter on mobile and tablet
                                    marginBottom={{ base: 4, sm: 4, lg: 16 }}
                                >
                                    <LockerRoomFilter
                                        setCurrentPage={setCurrentPage}
                                        cards={cards}
                                        setSearchValue={setSearchboxValue}
                                        searchValue={searchboxValue}
                                    />
                                </Box>
                                {isLoading ? (
                                    <Spinner
                                        speed={"0.75s"}
                                        color="white"
                                        w="150px"
                                        h="150px"
                                        margin={"auto"}
                                    />
                                ) : (
                                    <Flex
                                        flexDirection={"column"}
                                        width={"100%"}
                                        justify={"space-between"}
                                        mt={{ base: 0, lg: -14 }}
                                        pb="32px"
                                    >
                                        {/* Sort By Dropdown */}
                                        <Flex
                                            direction={"row-reverse"}
                                            width={"100%"}
                                            ref={targetRef}
                                            pb={4}
                                        >
                                            <Menu
                                                variant={"sortBy"}
                                                placement="bottom-end"
                                            >
                                                <MenuButton
                                                    as={Button}
                                                    rightIcon={
                                                        <ChevronDownIcon
                                                            fontSize={24}
                                                        />
                                                    }
                                                    width={"fit-content"}
                                                    fontWeight={500}
                                                    fontFamily={helvetica}
                                                    color="white"
                                                >
                                                    Sort by: {sortBy}
                                                </MenuButton>
                                                <MenuList
                                                    backgroundColor={"#364B47"}
                                                    borderRadius={0}
                                                    border={0}
                                                >
                                                    <MenuItem
                                                        backgroundColor={
                                                            "#364B47"
                                                        }
                                                        onClick={() => {
                                                            return handleSortOption(
                                                                "Recent",
                                                            );
                                                        }}
                                                    >
                                                        Recent
                                                    </MenuItem>
                                                    <MenuItem
                                                        backgroundColor={
                                                            "#364B47"
                                                        }
                                                        onClick={() => {
                                                            return handleSortOption(
                                                                "Alphabetical",
                                                            );
                                                        }}
                                                    >
                                                        Alphabetical
                                                    </MenuItem>
                                                    <MenuItem
                                                        backgroundColor={
                                                            "#364B47"
                                                        }
                                                        onClick={() => {
                                                            return handleSortOption(
                                                                "Reverse Alphabetical",
                                                            );
                                                        }}
                                                    >
                                                        Reverse Alphabetical
                                                    </MenuItem>
                                                    <MenuItem
                                                        backgroundColor={
                                                            "#364B47"
                                                        }
                                                        onClick={() => {
                                                            return handleSortOption(
                                                                "Trending",
                                                            );
                                                        }}
                                                    >
                                                        Trending
                                                    </MenuItem>
                                                </MenuList>
                                            </Menu>
                                        </Flex>

                                        {/* Paginated List of Cards */}
                                        <PaginatedList
                                            currentPage={currentPage}
                                            setCurrentPage={setCurrentPage}
                                            itemsPerPage={12}
                                            data={sortCards()}
                                            targetRef={targetRef}
                                        />
                                    </Flex>
                                )}
                            </HStack>
                        </Box>

                        <Footer />
                    </Flex>
                    <Box
                        position="sticky"
                        top={0}
                        w="140px"
                        h="100dvh"
                        display={{ base: "none", md: "inline" }}
                    >
                        <Sidebar height={"100dvh"} />
                    </Box>
                </HStack>
            </Box>
            {/* <Box bgImage="crinkled-paper.png" bgPos="center"> */}

            {/* <Footer /> */}
            {/* </Box> */}
        </>
    );
}
