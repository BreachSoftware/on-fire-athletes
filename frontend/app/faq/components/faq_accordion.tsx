"use client";

import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import {
    Accordion,
    AccordionButton,
    AccordionItem,
    AccordionPanel,
    AccordionProps,
    Box,
    Flex,
    useBreakpointValue,
} from "@chakra-ui/react";
import { useRef } from "react";

// Props for the FAQ component
interface FAQProps extends AccordionProps {
    data: {
        title: string;
        content: string | string[];
    }[];
    activeIndex?: number;
    setActiveIndex: (index: number | undefined) => void;
    onBtnClick: (btn: HTMLElement) => void;
}

// Styling for the accordion
const styling = {
    backgroundColor: "gray.800",
    limeGreen: "green.100",
    buttonColor: "white",
    buttonExpandedColor: "white",
    textColor: "white",
};

/**
 * Accordion component containing the FAQ items.
 * @param {FAQProps} data The data for the FAQ items.
 * @returns {JSX.Element} The FAQ accordion component.
 */
export default function FAQAccordion(props: FAQProps) {
    const { data, activeIndex, setActiveIndex, onBtnClick, ...rest } = props;

    // Check if the user is on a mobile device
    const isMobile = useBreakpointValue({ base: true, lg: false });

    const accRef = useRef<HTMLDivElement>(null);

    return (
        <>
            {/* Entire Accordion */}
            <Accordion
                ref={accRef}
                variant={"faq"}
                id="faq-accordion"
                allowToggle
                w={"100%"}
                h={"100%"}
                index={activeIndex}
                onChange={(index) => {
                    setActiveIndex(
                        typeof index === "number" ? index : undefined,
                    );
                }}
                {...rest}
            >
                {/* Seperate the Buttons */}
                <Flex direction={"column"} gap={5}>
                    {data.map((item, index) => {
                        return (
                            <AccordionItem key={index} border={"none"} w="full">
                                {({ isExpanded }) => {
                                    const title = slugify(item.title);

                                    return (
                                        <>
                                            <h2
                                                id={title}
                                                // scroll to where the button is at the top of the page:
                                                onClick={() => {
                                                    const element =
                                                        document.getElementById(
                                                            title,
                                                        );
                                                    accRef.current?.scrollTo({
                                                        top: element?.offsetTop,
                                                        behavior: "smooth",
                                                    });
                                                    if (element) {
                                                        onBtnClick(element);
                                                    }
                                                }}
                                            >
                                                {/* Each accordion button */}
                                                <AccordionButton
                                                    position="relative"
                                                    border={"solid"}
                                                    borderWidth={5}
                                                    borderColor={
                                                        isExpanded
                                                            ? styling.limeGreen
                                                            : styling.backgroundColor
                                                    }
                                                    borderBottom={"none"}
                                                    textColor={
                                                        isExpanded
                                                            ? styling.limeGreen
                                                            : styling.buttonColor
                                                    }
                                                    padding={"15px"}
                                                    paddingLeft={{
                                                        base: "20px",
                                                        lg: "45px",
                                                    }}
                                                    minH={"75px"}
                                                    // if expanded, change hover styling
                                                    _hover={
                                                        isExpanded
                                                            ? {
                                                                  // Button is expanded
                                                                  backgroundColor:
                                                                      isMobile
                                                                          ? styling.backgroundColor
                                                                          : styling.limeGreen,
                                                                  textColor:
                                                                      isMobile
                                                                          ? styling.limeGreen
                                                                          : styling.buttonColor,
                                                                  fontWeight:
                                                                      isMobile
                                                                          ? "bold"
                                                                          : "normal",
                                                              }
                                                            : {
                                                                  // Button is not expanded
                                                                  backgroundColor:
                                                                      isMobile
                                                                          ? styling.backgroundColor
                                                                          : styling.limeGreen,
                                                                  fontWeight:
                                                                      isMobile
                                                                          ? "normal"
                                                                          : "bold",
                                                                  borderColor:
                                                                      isMobile
                                                                          ? styling.backgroundColor
                                                                          : styling.limeGreen,
                                                              }
                                                    }
                                                    transition={"all .3s ease"}
                                                >
                                                    <Flex
                                                        width={"100%"}
                                                        align={"center"}
                                                    >
                                                        <Box
                                                            flex="1"
                                                            textAlign="left"
                                                            fontWeight="bold"
                                                            paddingRight={
                                                                "60px"
                                                            }
                                                            fontSize={"18px"}
                                                        >
                                                            {item.title}
                                                        </Box>

                                                        {/* Icon */}
                                                        <Flex
                                                            position={
                                                                isExpanded
                                                                    ? "absolute"
                                                                    : "relative"
                                                            }
                                                            top={0}
                                                            right={0}
                                                            align={"center"}
                                                            justify={"center"}
                                                            backgroundColor={
                                                                styling.limeGreen
                                                            }
                                                            width={10}
                                                            height={10}
                                                            transition={
                                                                "all .3s ease"
                                                            }
                                                        >
                                                            {isExpanded ? (
                                                                <MinusIcon
                                                                    fontSize="12px"
                                                                    color={
                                                                        styling.buttonExpandedColor
                                                                    }
                                                                />
                                                            ) : (
                                                                <AddIcon
                                                                    fontSize="12px"
                                                                    color={
                                                                        styling.buttonExpandedColor
                                                                    }
                                                                />
                                                            )}
                                                        </Flex>
                                                    </Flex>
                                                </AccordionButton>
                                            </h2>

                                            {/* Accordion content */}
                                            <AccordionPanel
                                                id={`${title}-panel`}
                                                paddingLeft={{
                                                    base: "20px",
                                                    lg: "45px",
                                                }}
                                                paddingRight={{
                                                    base: "20px",
                                                    lg: "60px",
                                                }}
                                                paddingBottom={{
                                                    base: "20px",
                                                    lg: "40px",
                                                }}
                                                border={"solid"}
                                                borderWidth={5}
                                                borderColor={styling.limeGreen}
                                                borderTop={"none"}
                                                color={styling.buttonColor}
                                            >
                                                {typeof item.content ===
                                                "string"
                                                    ? item.content
                                                    : item.content.map(
                                                          (content, index) => {
                                                              return (
                                                                  <Box
                                                                      key={
                                                                          index
                                                                      }
                                                                      pb="10px"
                                                                  >
                                                                      {content}
                                                                  </Box>
                                                              );
                                                          },
                                                      )}
                                            </AccordionPanel>
                                        </>
                                    );
                                }}
                            </AccordionItem>
                        );
                    })}
                </Flex>
            </Accordion>
        </>
    );
}

function slugify(text: string) {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9]/g, "-")
        .toLowerCase();
}
