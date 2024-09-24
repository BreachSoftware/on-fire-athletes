import { Flex, Button, Text, Input } from "@chakra-ui/react";
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

	const [ inputValue, setInputValue ] = useState(props.currentPage.toString());

	/**
	 *  Handle input change.
	 * @param e
	 */
	function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
		setInputValue(e.target.value.toString());
	};

	/**
	 * Handle input submit.
	 */
	function handleInputSubmit() {
		const newPage = parseInt(inputValue);
		if(newPage < 1) {
			props.handleClick(1);
			setInputValue("1");
		} else if (newPage > props.totalPages) {
			props.handleClick(props.totalPages);
			setInputValue(props.totalPages.toString());
		} else if (newPage > 0 && newPage <= props.totalPages) {
			props.handleClick(newPage);
			setInputValue(newPage.toString());
		}
	};

	/**
     * Handle key press to restrict input to numbers only.
     * @param e
     */
	function handleKeyPress(e: KeyboardEvent<HTMLInputElement>) {
		if (!(/^[0-9]*$/).test(e.key) && e.key !== "Backspace" && e.key !== "ArrowLeft" && e.key !== "ArrowRight") {
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
	}, [ props.currentPage ]);

	return (
		<Flex mt={4} justify="center" wrap={"wrap"}>
			<Button
				variant={"ghost"}
				color={props.currentPage === 1 ? "gray" : "green.100"}
				borderRadius={"full"}
				isDisabled={props.currentPage === 1 }
				maxW={"40px"}
				mt={3}
				onClick={() => {
					props.handleClick(props.currentPage - 1);
					setInputValue((props.currentPage - 1).toString());
				}}
				fontSize={14}
			>
				<Text>
					{"<"}
				</Text>
			</Button>

			<Input
				maxW={determineWidth(props.totalPages)}
				h={"48px"}
				variant={"filterInactiveTag"}
				color={"white"}
				borderRadius={"10px"}
				borderWidth={2}
				ml={1}
				mt={2}
				fontSize={14}
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
			>
			</Input>
			<Text mt={5} paddingX={2}> of {props.totalPages}</Text>
			<Button
				variant={"ghost"}
				color={props.currentPage === props.totalPages ? "gray" : "green.100"}
				borderRadius={"full"}
				isDisabled={props.currentPage === props.totalPages }
				mt={3}
				onClick={() => {
					props.handleClick(props.currentPage + 1);
					setInputValue((props.currentPage + 1).toString());

				}}
				fontSize={14}
			>
				<Text position="absolute">
					{">"}
				</Text>
			</Button>
		</Flex>
	);
}
