"use client";
import { Box, Flex, Image, useBreakpointValue } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";
import SidebarDots from "../public/sidebar_dots.svg";
import SidebarDotsGreen from "../public/sidebar_dots_green.svg";
import SideDrawer from "./sideDrawer";

interface SideBarHamburgerProps {
    backgroundPresent?: boolean;
    backColor?: string;
    isGridIconAltColor?: boolean;
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
    const { isOpen, onClose, onOpen } = useDisclosure();

    const greenIcon = useBreakpointValue({ base: false, md: !props.backColor });

    return (
        <>
            <Box
                position="fixed"
                display={{ base: "inline", md: "none" }}
                top={0}
                left={0}
                right={0}
                w="full"
                bgGradient="linear(to-b, #000 20%, #00000000)"
                h="80px"
                zIndex={98}
            />
            <Flex
                position="fixed"
                display={{ base: "flex", md: "none" }}
                top={0}
                right={0}
                w="fit-content"
                justifyContent="flex-end"
                pt="24px"
                pb="24px"
                px="24px"
                zIndex={101}
            >
                <Flex onClick={onOpen} position="relative">
                    <Image
                        alt={"Open Drawer"}
                        width="32px"
                        height="32px"
                        src={greenIcon ? SidebarDotsGreen.src : SidebarDots.src}
                        cursor={"pointer"}
                    />
                </Flex>
            </Flex>
            <SideDrawer
                isOpen={isOpen}
                onClose={onClose}
                placement="right"
                size="xl"
                isMobile={true}
            />
        </>
    );
}
