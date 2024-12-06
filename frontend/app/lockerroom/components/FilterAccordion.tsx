import React from "react";
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    Flex,
    Text,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons"; // Chevron icon from Chakra UI

interface FilterAccordionProps {
    title: string;
    filterMainContent: React.ReactNode;
}

export default function FilterAccordion({
    title,
    filterMainContent,
}: FilterAccordionProps) {
    return (
        <Accordion width="100%" allowToggle>
            <AccordionItem border="none">
                {({ isExpanded }) => (
                    <>
                        <AccordionButton padding={0} border="none">
                            <Flex
                                width="100%"
                                align="center"
                                justify="space-between"
                                bgColor="#131515"
                                padding="12px 16px"
                                border="none" // Explicitly remove border
                            >
                                <Text
                                    fontSize="22px"
                                    letterSpacing="0.44px"
                                    fontFamily="Barlow Semi Condensed"
                                    textTransform="uppercase"
                                    color="white"
                                >
                                    {title}
                                </Text>

                                <ChevronRightIcon
                                    fontSize="40px"
                                    color="#27CE00"
                                    transform={
                                        isExpanded
                                            ? "rotate(90deg)"
                                            : "rotate(0deg)"
                                    }
                                    transition="transform 0.2s ease"
                                />
                            </Flex>
                        </AccordionButton>

                        <AccordionPanel padding="12px 16px">
                            {filterMainContent}
                        </AccordionPanel>
                    </>
                )}
            </AccordionItem>
        </Accordion>
    );
}
