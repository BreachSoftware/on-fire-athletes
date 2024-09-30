import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Flex, Button, Text, Input, Icon } from "@chakra-ui/react";
import { useState, ChangeEvent, KeyboardEvent, useEffect } from "react";

interface PaginationNavigatorProps {
    currentPage: number;
    totalPages: number;
    handleClick: (page: number) => void;
}

/**
 * The pagination navigator component.
 * @returns {JSX.Element} The pagination navigator component.
 */
export default function PaginationNavigator(props: PaginationNavigatorProps) {
    const [inputValue, setInputValue] = useState(props.currentPage.toString());

    /**
     *  Handle input change.
     * @param e
     */
    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
        setInputValue(e.target.value.toString());
    }

    /**
     * Handle input submit.
     */
    function handleInputSubmit() {
        const newPage = parseInt(inputValue);
        if (newPage < 1) {
            props.handleClick(1);
            setInputValue("1");
        } else if (newPage > props.totalPages) {
            props.handleClick(props.totalPages);
            setInputValue(props.totalPages.toString());
        } else if (newPage > 0 && newPage <= props.totalPages) {
            props.handleClick(newPage);
            setInputValue(newPage.toString());
        }
    }

    /**
     * Handle key press to restrict input to numbers only.
     * @param e
     */
    function handleKeyPress(e: KeyboardEvent<HTMLInputElement>) {
        if (
            !/^[0-9]*$/.test(e.key) &&
            e.key !== "Backspace" &&
            e.key !== "ArrowLeft" &&
            e.key !== "ArrowRight"
        ) {
            e.preventDefault();
        }
    }

    /**
     * determine the width of the input field based on the number of digits in the total pages
     */
    function determineWidth(totalPages: number): string {
        if (totalPages.toString().length == 1) {
            return "40px";
        } else if (totalPages.toString().length == 2) {
            return "48px";
        } else if (totalPages.toString().length == 3) {
            return "53px";
        }
        return "63px";
    }

    // This use effect updates the actual text within the input of the pagination naviator, when a match is made
    // with the input of the search bar
    useEffect(() => {
        setInputValue(props.currentPage.toString());
    }, [props.currentPage]);

    return (
        <Flex
            mt={{ base: "60px", lg: "90px" }}
            justify="center"
            align="center"
            wrap={"wrap"}
            gap={0}
        >
            <ChevronButton
                direction="left"
                currentPage={props.currentPage}
                totalPages={props.totalPages}
                handleClick={props.handleClick}
                setInputValue={setInputValue}
            />

            <Input
                maxW={determineWidth(props.totalPages)}
                minH="30px"
                w="32px"
                h="30px"
                p={0}
                variant={"filterInactiveTag"}
                color={"white"}
                borderRadius={"6px"}
                ml={1}
                fontSize={16}
                textAlign={"center"}
                maxLength={props.totalPages.toString().length}
                value={props.totalPages === 0 ? 0 : inputValue}
                _placeholder={{ color: "white" }}
                onChange={handleInputChange}
                onBlur={handleInputSubmit}
                onKeyDownCapture={handleKeyPress}
                px={0}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleInputSubmit();
                    }
                }}
            ></Input>
            <Text pl={2} pr={2} color="white">
                of
            </Text>
            <Text px={1} color="white">
                {props.totalPages}
            </Text>
            <ChevronButton
                direction="right"
                currentPage={props.currentPage}
                totalPages={props.totalPages}
                handleClick={props.handleClick}
                setInputValue={setInputValue}
            />
        </Flex>
    );
}

function ChevronButton(props: {
    direction: "left" | "right";
    currentPage: number;
    totalPages: number;
    handleClick: (page: number) => void;
    setInputValue: (page: string) => void;
}) {
    const isDisabled =
        props.direction === "left"
            ? props.currentPage === 1
            : props.currentPage === props.totalPages;

    const handleClick = () => {
        const newPage =
            props.direction === "left"
                ? props.currentPage - 1
                : props.currentPage + 1;
        props.handleClick(newPage);
        props.setInputValue(newPage.toString());
    };

    const icon =
        props.direction === "left" ? ChevronLeftIcon : ChevronRightIcon;

    return (
        <Button
            color={isDisabled ? "gray" : "green.100"}
            borderRadius={"full"}
            isDisabled={isDisabled}
            onClick={handleClick}
            fontSize={14}
            px={0}
            mx={0}
            minW={0}
            variant="ghost"
            _hover={{ bg: "rgba(170,170,170,0.2)" }}
        >
            <Icon as={icon} boxSize={"24px"} />
        </Button>
    );
}
