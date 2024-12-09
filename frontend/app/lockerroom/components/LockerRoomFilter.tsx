"use client";

import {
    Accordion,
    AccordionButton,
    AccordionItem,
    AccordionPanel,
    Box,
    Divider,
    Flex,
    Text,
    Spacer,
    useBreakpointValue,
    Center,
} from "@chakra-ui/react";
import { useEffect } from "react";
import RadioPicker from "../../../components/create/RadioPicker";
import FilterTag from "../../lockerroom/components/FilterTag";
import { useCurrentFilterInfo } from "@/hooks/useCurrentFilter";
import TradingCardInfo from "@/hooks/TradingCardInfo";
import FilterInfo from "@/hooks/FilterInfo";
import { isEqual } from "lodash";
import { FaXmark } from "react-icons/fa6";
import { BsFilter } from "react-icons/bs";
import StatusIcon from "@/components/create/StatusIcon";
import FilterBubble from "./FilterBubble";
import SearchBarInput from "./SearchBarInput";
import ClearAllButton from "./ClearAllButton";
import FilterAccordion from "./FilterAccordion";

interface FilterProps {
    cards: TradingCardInfo[];
    setSearchValue: (value: string) => void;
    searchValue: string;
    setCurrentPage: (page: number) => void;
}

/**
 * Locker Room Filter.
 * @returns {JSX.Element} The filter component.
 */
export default function Filter(props: FilterProps) {
    const currentFilter = useCurrentFilterInfo(); // Current filter info.

    // Check if we are on mobile
    const isMobile = useBreakpointValue({ base: true, lg: false });

    /**
     * Function to update the filter tags based on the card values.
     * @param cards - Array of cards.
     * @param filterTags - Array of filter tags for a specific filter property.
     * @param filterProperty - Name of the filter property.
     */
    function updateFilterTags(
        cards: TradingCardInfo[],
        filterTags: { title: string; value: boolean; present: boolean }[],
        filterProperty: string,
    ) {
        // Iterate over the cards and update the filter tags
        const updatedFilterTags = filterTags.map((tag) => {
            return { ...tag, present: false };
        });

        // Retrieve selected sports
        const selectedSports = currentFilter.curFilter.sport.tags
            .filter((tag) => {
                return tag.value;
            })
            .map((tag) => {
                return tag.title;
            });

        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            let cardValue = card[filterProperty as keyof TradingCardInfo];
            if (filterProperty === "createdAt") {
                // Convert unix time to year
                cardValue = new Date(card.createdAt * 1000)
                    .getFullYear()
                    .toString();
            }
            if (filterProperty === "position") {
                // If no sport is selected, then show no positions
                if (selectedSports.length === 0) {
                    continue;
                }

                // If the sport is selected, then only show positions for that sport
                if (!selectedSports.includes(card.sport)) {
                    continue;
                }
            }
            if (cardValue && cardValue !== "") {
                const tagIndex = updatedFilterTags.findIndex((tag) => {
                    return tag.title === cardValue;
                });
                if (tagIndex !== -1) {
                    updatedFilterTags[tagIndex].present = true;
                }
            }
        }
        return updatedFilterTags;
    }

    useEffect(() => {
        const filterProperties = [
            "sport",
            "position",
            "careerLevel",
            "createdAt",
        ];
        const filterTags = [
            currentFilter.curFilter.sport.tags,
            currentFilter.curFilter.position.tags,
            currentFilter.curFilter.careerLevel.tags,
            currentFilter.curFilter.yearCreated.tags,
        ];

        const updatedTagsArrays = filterProperties.map((property, index) => {
            return updateFilterTags(props.cards, filterTags[index], property);
        });

        const updatedFilter = {
            ...currentFilter.curFilter,
            sport: {
                ...currentFilter.curFilter.sport,
                tags: updatedTagsArrays[0],
            },
            position: {
                ...currentFilter.curFilter.position,
                tags: updatedTagsArrays[1],
            },
            careerLevel: {
                ...currentFilter.curFilter.careerLevel,
                tags: updatedTagsArrays[2],
            },
            yearCreated: {
                ...currentFilter.curFilter.yearCreated,
                tags: updatedTagsArrays[3],
            },
        };

        // Check if the updated filter is different from the current filter before updating state
        if (!isEqual(updatedFilter, currentFilter.curFilter)) {
            currentFilter.setCurFilter(updatedFilter);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentFilter, props.cards]);

    /**
     * Function to toggle the filter tag.
     * @param tag - The tag to toggle.
     * @param value - The current value of the tag.
     */
    function toggleTag(tag: string, value: boolean) {
        /**
         * Calculate the filter based on the previous filter object
         * @param prevFilter The previous filter object
         * @returns The new filter object
         */
        function calcFilter(prevFilter: FilterInfo) {
            const newFilter = { ...prevFilter };
            for (const key in newFilter) {
                if (newFilter.hasOwnProperty(key)) {
                    const filterItem = newFilter[key as keyof typeof newFilter];
                    if (typeof filterItem !== "string") {
                        for (let i = 0; i < filterItem.tags.length; i++) {
                            if (filterItem.tags[i].title === tag) {
                                filterItem.tags[i].value = !value;
                            }
                        }
                    }
                }
            }
            return newFilter;
        }

        currentFilter.setCurFilter(calcFilter(currentFilter.curFilter));
    }

    // Our filter buttons and everything inside
    const filterMainContent = (
        <Flex
            direction={"column"}
            gap={"16px"}
            px={"32px"}
            pt={"18px"}
            pb={"32px"}
            width={"100%"}
            height={"100%"}
            alignItems={"center"}
            bgColor={"gray.1000"}
            borderRadius={"11px"}
            borderTopLeftRadius={isMobile ? "0px" : "11px"}
        >
            {/* Header for filter tag area */}
            <Flex width={"100%"} direction={"row"}>
                {/* Filter Icon and Header */}
                {/* only show on desktop */}
                {!isMobile && (
                    <Flex
                        gap={2}
                        alignItems={"center"}
                        justifyContent={"center"}
                    >
                        <BsFilter color={"white"} size={30} />

                        <Text color={"white"} fontSize={15}>
                            Filters
                        </Text>
                    </Flex>
                )}

                <Spacer />

                {/* Only show the "clear all" button if the filter has something in it active */}
                {Object.keys(currentFilter.curFilter)
                    .slice(1)
                    .some((key) => {
                        const filter =
                            currentFilter.curFilter[
                                key as keyof typeof currentFilter.curFilter
                            ];
                        if (
                            typeof filter === "object" &&
                            filter !== null &&
                            "tags" in filter
                        ) {
                            return filter.tags.some((tag) => {
                                return tag.value;
                            });
                        }
                        return false;
                    }) && (
                    <ClearAllButton
                        onClick={() => {
                            const updatedFilter = {
                                ...currentFilter.curFilter,
                            };
                            for (const key in updatedFilter) {
                                if (updatedFilter.hasOwnProperty(key)) {
                                    const filterItem =
                                        updatedFilter[
                                            key as keyof typeof updatedFilter
                                        ];
                                    if (typeof filterItem !== "string") {
                                        for (
                                            let i = 0;
                                            i < filterItem.tags.length;
                                            i++
                                        ) {
                                            filterItem.tags[i].value = false;
                                        }
                                    }
                                }
                            }
                            currentFilter.setCurFilter(updatedFilter);
                        }}
                        tagsActive={Object.keys(currentFilter.curFilter)
                            .slice(1)
                            .some((key) => {
                                const filter =
                                    currentFilter.curFilter[
                                        key as keyof typeof currentFilter.curFilter
                                    ];
                                if (
                                    typeof filter === "object" &&
                                    filter !== null &&
                                    "tags" in filter
                                ) {
                                    return filter.tags.some((tag) => tag.value);
                                }
                                return false;
                            })}
                    />
                )}
            </Flex>

            {/* Filter Tags Area. Don't use the "type" index from FilterInfo, so we slice 0 index out */}
            {Object.keys(currentFilter.curFilter)
                .slice(1)
                .map((key, index) => {
                    const filter =
                        currentFilter.curFilter[
                            key as keyof typeof currentFilter.curFilter
                        ];

                    // Check if filter is an object and has 'tags' property
                    if (
                        typeof filter === "object" &&
                        filter !== null &&
                        "tags" in filter
                    ) {
                        const tags = (
                            filter as {
                                tags: {
                                    title: string;
                                    value: boolean;
                                    present: boolean;
                                }[];
                            }
                        ).tags.filter((tag) => {
                            return tag.present;
                        });

                        // Only render the Accordion if there are tags present
                        if (tags.length > 0) {
                            return (
                                <FilterAccordion
                                    title={filter.title}
                                    filterMainContent={
                                        <>
                                            <Flex
                                                paddingBottom={
                                                    tags.filter(({ value }) =>
                                                        Boolean(value),
                                                    ).length > 0
                                                        ? 2
                                                        : 0
                                                }
                                                wrap={"wrap"}
                                                gap={1}
                                            >
                                                {tags.map((tag, index) => {
                                                    if (tag.value) {
                                                        return (
                                                            <FilterBubble
                                                                text={tag.title}
                                                                key={index}
                                                                onClick={() => {
                                                                    toggleTag(
                                                                        tag.title,
                                                                        tag.value,
                                                                    );
                                                                }}
                                                            />
                                                        );
                                                    }
                                                    return null;
                                                })}
                                                <ClearAllButton
                                                    onClick={() => {
                                                        tags.forEach((tag) => {
                                                            if (tag.value) {
                                                                toggleTag(
                                                                    tag.title,
                                                                    tag.value,
                                                                );
                                                            }
                                                        });
                                                    }}
                                                    tagsActive={tags.some(
                                                        (tag) => tag.value,
                                                    )}
                                                />
                                            </Flex>
                                            <Flex
                                                mt="23px"
                                                direction={"column"}
                                                gap={2}
                                                alignItems={"flex-start"}
                                                wrap={"nowrap"}
                                                maxHeight={"320px"}
                                                overflowY={"auto"}
                                                css={{
                                                    // Getting rid of default scrollbar
                                                    msOverflowStyle: "none",
                                                    // Creating custom scrollbar.
                                                    // Unfortunately the colors from themes don't work here so you have to hard code
                                                    "&::-webkit-scrollbar": {
                                                        width: "0.75rem",
                                                    },
                                                    "&::-webkit-scrollbar-track":
                                                        {
                                                            backgroundColor:
                                                                "#1E2423",
                                                            borderRadius:
                                                                "5rem",
                                                        },
                                                    "&::-webkit-scrollbar-thumb":
                                                        {
                                                            backgroundColor:
                                                                "#2A302F",
                                                            borderRadius:
                                                                "5rem",
                                                        },
                                                    "&::-webkit-scrollbar-thumb:hover":
                                                        {
                                                            backgroundColor:
                                                                "#363C3B",
                                                        },
                                                }}
                                            >
                                                {tags.map((tag, index) => (
                                                    <Flex
                                                        key={index}
                                                        align="center"
                                                    >
                                                        <Box
                                                            onClick={() => {
                                                                toggleTag(
                                                                    tag.title,
                                                                    tag.value,
                                                                );
                                                            }}
                                                        >
                                                            <StatusIcon
                                                                iconSize={11}
                                                                padding={"1px"}
                                                                isCheck={true}
                                                                isGlowing={
                                                                    false
                                                                }
                                                                isActive={
                                                                    tag.value
                                                                }
                                                            />
                                                        </Box>
                                                        <FilterTag
                                                            text={tag.title}
                                                            onClick={() => {
                                                                toggleTag(
                                                                    tag.title,
                                                                    tag.value,
                                                                );
                                                            }}
                                                            order={index}
                                                            filterType={
                                                                filter.title
                                                            }
                                                        />
                                                    </Flex>
                                                ))}
                                            </Flex>
                                        </>
                                    }
                                />
                            );
                        }
                    }
                    return null; // If 'filter' is not an object or has no 'tags' property, don't render anything
                })}
        </Flex>
    );

    // Search component
    const searchComponent = (
        <SearchBarInput
            searchValue={props.searchValue}
            onSearch={(value) => {
                props.setSearchValue(value);
                props.setCurrentPage(1);
            }}
        />
    );
    // Radio Picker Component
    const radioPickerComponent = (
        <Flex
            direction={"row"}
            width={"100%"}
            alignItems={"center"}
            justifyContent={"center"}
            paddingTop={2}
            paddingBottom={3}
        >
            <RadioPicker
                options={["All", "For Sale", "Trade Only"]}
                value={currentFilter.curFilter.type}
                onChange={(value) => {
                    currentFilter.setCurFilter({
                        ...currentFilter.curFilter,
                        type: String(value),
                    });
                }}
                variant={"searchFilter"}
            />
        </Flex>
    );

    return (
        <>
            {isMobile ? (
                <Flex
                    direction={"column"}
                    gap={5}
                    width={"100%"}
                    height={"100%"}
                    alignItems={"center"}
                >
                    {/* Accordion Button */}
                    <Accordion
                        width={"100%"}
                        padding={0}
                        borderColor={"transparent"}
                        allowToggle
                    >
                        <AccordionItem>
                            {({ isExpanded }) => {
                                return (
                                    <>
                                        <Flex
                                            width={"100%"}
                                            flexDirection={"row"}
                                            gap={"39px"}
                                            justifyContent={"space-between"}
                                            align="flex-start"
                                        >
                                            <AccordionButton
                                                width={"min-content"}
                                                padding={0}
                                                paddingBottom={0}
                                            >
                                                <Flex
                                                    gap={2}
                                                    flexDirection={"column"}
                                                    alignItems={"center"}
                                                    justifyContent={"center"}
                                                >
                                                    <Text
                                                        color={"white"}
                                                        fontSize={15}
                                                    >
                                                        Filters
                                                    </Text>

                                                    <Center
                                                        backgroundColor={
                                                            "gray.1000"
                                                        }
                                                        boxSize="53px"
                                                    >
                                                        {isExpanded ? (
                                                            <FaXmark
                                                                color={"white"}
                                                                size={42}
                                                            />
                                                        ) : (
                                                            <BsFilter
                                                                color={"white"}
                                                                size={42}
                                                            />
                                                        )}
                                                    </Center>
                                                </Flex>
                                            </AccordionButton>

                                            <Flex
                                                mt={1}
                                                width={"75%"}
                                                flexDirection={"column"}
                                                gap={3}
                                                paddingRight={3}
                                            >
                                                {/* Search Input */}
                                                {searchComponent}

                                                {/* Radio Picker */}
                                                {radioPickerComponent}
                                            </Flex>
                                        </Flex>
                                        {/* Main Component */}
                                        <AccordionPanel padding={0}>
                                            {filterMainContent}
                                        </AccordionPanel>

                                        <Divider
                                            paddingTop={5}
                                            borderColor={"gray.1600"}
                                        />
                                    </>
                                );
                            }}
                        </AccordionItem>
                    </Accordion>
                </Flex>
            ) : (
                // Our normal desktop view
                <Flex
                    direction={"column"}
                    gap={5}
                    width={"100%"}
                    height={"100%"}
                    alignItems={"center"}
                >
                    {/* Search Input */}
                    {searchComponent}

                    {/* Radio Picker */}
                    {radioPickerComponent}

                    {/* Main Component */}
                    {filterMainContent}
                </Flex>
            )}
        </>
    );
}
