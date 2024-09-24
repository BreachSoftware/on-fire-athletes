"use client";
import TradingCardInfo from "@/hooks/TradingCardInfo";
import { useCurrentCardInfo } from "@/hooks/useCurrentCardInfo";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
	Button,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	Text,
} from "@chakra-ui/react";
import { useRef, KeyboardEvent } from "react";

interface DropdownInputProps {
	title: string;
	options: string[];
	attribute: keyof TradingCardInfo;
	isDisabled?: boolean;
	backgroundColor?: string;
	opacity?: number;
	textColor?: string;
	mobile?: boolean;
	h? : string;
	referenceWidth?: string;
}

/**
 * Formats the title of the dropdown input.
 * Split words by capital letters, but preserve alphanumeric groups like '4X100M'
 * @param title The title of the dropdown input
 */
export function formatTitle(title: string) {
	const formattedTitle = title.replace(/([a-z])([A-Z])/g, "$1 $2").trim();
	return formattedTitle;
}

/**
 * The dropdown input component.
 * @params title The title of the dropdown input
 * @params options The options for the dropdown input
 * @returns The dropdown input component
 */
export default function DropdownInput(props: DropdownInputProps) {
	const menuListRef = useRef<HTMLDivElement>(null);
	const card = useCurrentCardInfo();

	/**
	 * @param index
	 */
	function scrollToHighlightedItem() {
		const menuList = menuListRef.current;
		const highlightedItem = document.activeElement;

		if (menuList && highlightedItem) {
			const menuListRect = menuList.getBoundingClientRect();
			const highlightedItemRect = highlightedItem.getBoundingClientRect();

			if (
				highlightedItemRect.top >= menuListRect.top &&
			highlightedItemRect.bottom <= menuListRect.bottom
			) {
			// Item is already visible, no need to scroll
				return;
			}

			// setTimeout(() => {
			highlightedItem.scrollIntoView({ behavior: "smooth", block: "nearest" });
			// }, 0);
		}
	}


	/**
	 *
	 * @param event
	 */
	function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
		const { key, currentTarget } = event;
		const menuItems = Array.from(currentTarget.children).filter(
			(child): child is HTMLElement => {
				return child instanceof HTMLElement;
			}
		);
		const menuItemsCount = menuItems.length;

		if (key === "ArrowDown") {
			let nextIndex = document.activeElement ?
				menuItems.indexOf(document.activeElement as HTMLElement) + 1 :
				0;
			if (nextIndex >= menuItemsCount) {
			// If at the bottom of the list, move focus to the first item
				nextIndex = 0;
			}
			menuItems[nextIndex].focus();
			scrollToHighlightedItem();
		} else if (key === "ArrowUp") {
			let prevIndex = document.activeElement ?
				menuItems.indexOf(document.activeElement as HTMLElement) - 1 :
				menuItemsCount - 1;
			if (prevIndex < 0) {
			// If at the top of the list, move focus to the last item
				prevIndex = menuItemsCount - 1;
			}
			menuItems[prevIndex].focus();
			scrollToHighlightedItem();
		}
	}

	return (
		<>
			<Menu matchWidth preventOverflow={true} placement="top">

				{/* Dropdown button */}
				<MenuButton
					width={"100%"}
					maxWidth={props.referenceWidth ? props.referenceWidth : "100%"}
					paddingY={4}
					as={Button}
					isDisabled={props.isDisabled}
					variant={props.mobile ? "mobile_dropdown" : "dropdown"}
					rightIcon={<ChevronDownIcon />}
					h={props.h}
					pl={5}
					backgroundColor={props.backgroundColor}
					opacity={props.opacity}
					textColor={ props.textColor ? props.textColor : card.curCard[props.attribute] === "" ? "gray.400" : "white" }
				>
					<Text noOfLines={1}>
						{ card.curCard[props.attribute] === "" ? formatTitle(props.title) : formatTitle(String(card.curCard[props.attribute])) }
					</Text>
				</MenuButton>

				{/* Options in dropdown */}
				<MenuList
					ref={menuListRef}
					zIndex={100}
					maxH={{ base: "150px", md: "250px" }}
					style={{
						overflowY: "auto",
						minWidth: "100%",
					}}
					onKeyDown={handleKeyDown}
				>
					{props.options.map((option, index) => {
						return (
							<MenuItem key={index} onClick={() => {
								card.setCurCard({
									...card.curCard,
									[props.attribute]: option,
									// Reset position if sport is changed. If position is the attribute, set it to the selected position.
									// Otherwise keep the current position
									position: (props.attribute === "sport") ? "" : (props.attribute === "position") ? option : card.curCard.position,
								});
							}}
							>
								{formatTitle(option)}
							</MenuItem>
						);
					})}
				</MenuList>
			</Menu>
		</>
	);

}
