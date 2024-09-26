import { IconButton, Flex, Image, useBreakpointValue } from "@chakra-ui/react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SidebarDots from "../public/sidebar_dots.svg";
import SidebarDotsGreen from "../public/sidebar_dots_green.svg";
import HamburgerMenuImage from "../public/hamburger-menu.png";

interface SideBarHamburgerProps {
	onClick: () => void;
	backgroundPresent?: boolean;
	backColor?: string;
	isGridIconAltColor?: boolean;
	showXIcon: boolean;
	onSubClose: () => void;
	isMobile?: boolean;
}

/**
 * Sidebar hamburger component containing a menu toggle, a separator, and smaller social media links.
 * @param {Object} props - The component props.
 * @param {boolean} [props.backgroundPresent=true] - Determines if the background should be included.
 * @param {boolean} [props.isGridIconGold=false] - Determines if the grid icon should be gold.
 * @param {boolean} [props.showXIcon=false] - Determines if the X icon should be shown, and be styled as the "sub-sidebar".
 * @param {Function} [props.onSubClose=()=>{}] - The function to call when the X icon is clicked.
 * @returns {JSX.Element} The sidebar hamburger component.
 */
export default function SideBarHamburger(props: SideBarHamburgerProps) {
	// Hook to manage the open and close state of the side drawer
	const gridIconColor = props.isGridIconAltColor || props.backgroundPresent ? "green" : "white";

	const greenIcon = useBreakpointValue({ base: false, md: !props.backColor });

	return (
		<>
			{/* show X Icon if showXIcon is true, else show the normal grid */}
			{props.showXIcon ? (
				<IconButton
					variant="ghost"
					aria-label="Close menu"
					icon={<FontAwesomeIcon icon={faXmark} />}
					boxSize="48px"
					fontSize="48px"
					isRound
					color={gridIconColor}
					_active={{ color: "green.300" }}
					_hover={{ md: { color: "green.300" } }}
					onClick={props.onSubClose}
				/>
			) : (
				<Flex
					onClick={props.onClick}
					p="5px"
					alignSelf={{ base: "flex-start", md: "center" }}
					cursor="pointer"
					_hover={{
						// slightly darken on hover
						filter: "brightness(0.7)",
					}}>
					<Image boxSize={{ base: "28px", md: "43px" }} alt="Open Drawer" src={greenIcon ? SidebarDotsGreen.src : HamburgerMenuImage.src} />
				</Flex>
			)}
		</>
	);
}
