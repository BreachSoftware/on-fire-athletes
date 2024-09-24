import { Button, Menu, MenuButton, MenuList, MenuItem, Text } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useRef, KeyboardEvent } from "react";

interface contactDropdownInputProps {
	options: string[];
	selectedOption: string;
	setValue: (newVal: string) => void;
	backgroundColor?: string;
	opacity?: number;
	textColor?: string;
	mobile?: boolean;
	h? : string;
	referenceWidth?: string;
}


/**
 * dropdown for subject feild in contact form
 * @returns dropdown oompoent
 */
export default function ContactSubjectDropdown(props: contactDropdownInputProps) {
	const menuListRef = useRef<HTMLDivElement>(null);

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

	return(
		<>
			<Menu matchWidth preventOverflow={true} placement="top">

				{/* Dropdown button */}
				<MenuButton
					width={"100%"}
					maxWidth={"100%"}
					paddingY={4}
					as={Button}
					variant={props.mobile ? "SubjectMobile_dropdown" : "Subjectdropdown"}
					rightIcon={<ChevronDownIcon boxSize={9} />}
					h={props.h}
					pl={5}
					textColor="white"
					borderColor="black"
					opacity={props.opacity}
					backgroundColor={props.backgroundColor}
				>
					<Text noOfLines={1}>
						{props.selectedOption}
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
						if (option !== props.selectedOption) {
							return (
								<MenuItem key={index} onClick={() => {
									props.setValue(option);
								}}
								>
									{option}
								</MenuItem>
							);
						}

						return null;
					})}
				</MenuList>
			</Menu>
		</>
	);
}
