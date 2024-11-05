"use client";
import {
    VStack,
    Icon,
    IconButton,
    Divider,
    Link,
    Flex,
    Center,
    useDisclosure,
    Image,
} from "@chakra-ui/react";

import {
    FaFacebookF,
    FaXTwitter,
    FaTiktok,
    FaSnapchat,
    FaInstagram,
} from "react-icons/fa6";
import SideDrawer from "./sideDrawer";
import SidebarDotsGreen from "../public/sidebar_dots_green.svg";
import SidebarDots from "../public/sidebar_dots.svg";
import { CloseIcon } from "@chakra-ui/icons";

interface Props {
    height?: string;
    backgroundPresent?: boolean;
    isMobile?: boolean;
    backColor?: string;
    isGridIconAltColor?: boolean;
    onSubClose?: () => void;
}

/**
 * Sidebar component containing a menu toggle, a separator, and smaller social media links.
 * @param {Object} props - The component props.
 * @param {string} [props.height="100vh"] - The height of the sidebar. Use "auto" to fit to the parent.
 * @param {boolean} [props.backgroundPresent=true] - Determines if the background should be included.
 * @param {boolean} [props.isGridIconGold=false] - Determines if the grid icon should be gold.
 * @param {boolean} [props.showXIcon=false] - Determines if the X icon should be shown, and be styled as the "sub-sidebar".
 * @param {boolean} [props.isGridIconAltColor=false] - Determines if the grid icon should be an alternate color.
 * @param {boolean} [props.isIconOnly=false] - Determines if the sidebar should only contain the top corner grid icon
 * @param {Function} [props.onSubClose=()=>{}] - The function to call when the X icon is clicked.
 * @param {boolean} [props.isMobile=false] - Determines if the sidebar is being rendered on a mobile device.
 * @returns {JSX.Element} The sidebar component.
 */
function Sidebar({
    height = "100%",
    backColor = "black",
    isGridIconAltColor = false,
    onSubClose,
}: Props) {
    const iconColor = "white";
    const socialIconHoverColor = "green.100";

    const iconSize = "12px"; // Smaller icon size
    const socialMediaIconSpacing = 3; // Adjusted spacing for smaller icons

    // Hook to manage the open and close state of the side drawer
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <VStack
            w={{ base: "100px", lg: "140px" }}
            h={height}
            p={4}
            spacing={"32px"}
            py="32px"
            align="center"
            bg={backColor ?? "black"}
            css={{
                // Getting rid of default scrollbar. Should work on nearly every browser
                msOverflowStyle: "none",
                "&::-webkit-scrollbar": { width: "0px" },
            }}
        >
            <Center w="100%">
                {onSubClose ? (
                    <IconButton
                        variant="ghost"
                        aria-label="Close menu"
                        icon={<CloseIcon />}
                        fontSize="24px"
                        isRound
                        color="white"
                        _active={{ color: "green.300" }}
                        _hover={{ md: { color: "green.300" } }}
                        _focus={{ boxShadow: "none" }}
                        onClick={onSubClose}
                    />
                ) : (
                    <Flex onClick={onOpen}>
                        <Image
                            alt={"Open Drawer"}
                            width="43px"
                            height="43px"
                            src={
                                isGridIconAltColor
                                    ? SidebarDots.src
                                    : SidebarDotsGreen.src
                            }
                            cursor={"pointer"}
                        />
                    </Flex>
                )}

                {/* The side drawer component */}
                <SideDrawer
                    isOpen={isOpen}
                    onClose={onClose}
                    placement={"right"}
                    size={"xl"}
                />
            </Center>

            <Divider
                orientation="vertical"
                borderColor={iconColor === "white" ? "whiteAlpha.900" : "white"}
            />

            <VStack spacing={socialMediaIconSpacing} w="100%" mt="auto">
                {[
                    {
                        icon: FaFacebookF,
                        label: "Facebook",
                        href: "https://facebook.com/onfireathletes",
                    },
                    {
                        icon: FaXTwitter,
                        label: "X",
                        href: "https://x.com/onfireathletes_",
                    },
                    // {
                    //     icon: FaTiktok,
                    //     label: "TikTok",
                    //     href: "https://tiktok.com/@onfireathletes",
                    // },
                    // {
                    //     icon: FaSnapchat,
                    //     label: "Snapchat",
                    //     href: "https://www.snapchat.com/onfireathletes",
                    // },
                    {
                        icon: FaInstagram,
                        label: "Instagram",
                        href: "https://www.instagram.com/onfireathletes_",
                    },
                ].map((social, index) => {
                    return (
                        <Center key={index}>
                            <Link href={social.href} isExternal>
                                <IconButton
                                    variant="ghost"
                                    aria-label={social.label}
                                    icon={
                                        <Icon
                                            as={social.icon}
                                            style={{
                                                width: "21px",
                                                height: "21px",
                                            }}
                                        />
                                    }
                                    isRound
                                    boxSize={iconSize}
                                    color={iconColor}
                                    _hover={{
                                        md: { color: socialIconHoverColor },
                                    }}
                                    _focus={{
                                        outline: "none",
                                        boxShadow: "none",
                                        border: "none",
                                    }}
                                />
                            </Link>
                        </Center>
                    );
                })}
            </VStack>
        </VStack>
    );
}

export default Sidebar;
