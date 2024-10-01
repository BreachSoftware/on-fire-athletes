"use client";
/* eslint-disable quote-props */
import {
    Box,
    type BoxProps,
    Flex,
    Stack,
    Icon,
    Image,
    Popover,
    PopoverTrigger,
    PopoverContent,
    useDisclosure,
    Spacer,
    Link,
    Heading,
    useBreakpointValue,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import OnFireLogo from "../app/favicon.ico";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import SideDrawer from "@/components/sideDrawer";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import ResponsiveBlock from "@/components/shared/wrappers/responsive-block";
import SideBarHamburger from "@/components/sidebarHamburger";

// Optional params
interface NavBarProps extends BoxProps {
    darkText?: boolean;
    logoDropShadow?: boolean;
    noDivider?: boolean;
    hreffunc?: (href: string) => string;
    cryptoWalletConnected?: boolean;
}

interface NavItem {
    label: string;
    hreffunc?: (href: string) => string;
    children?: Array<NavItem>;
    href?: string;
    target?: string;
}

// Items in the navbar
const NAV_ITEMS: Array<NavItem> = [
    {
        label: "Create",
        href: "/create",
    },
    {
        label: "Locker Room",
        href: "/lockerroom",
    },
    {
        label: "About",
        href: "#",
        children: [
            {
                label: "FAQs",
                href: "/faq",
            },
            {
                label: "Contact",
                href: "/contact",
            },
        ],
    },
    {
        label: "Profile",
        href: "/profile",
    },
    {
        label: "Sign Up",
        href: "/signup",
    },
    {
        label: "Sign In",
        href: "/login",
    },
    {
        label: "Sign Out",
        href: "/",
    },
];

// All colors used in the navbar
const NAV_COLORS = {
    white: "#FFFFFF",
    green: "#27CE00",
    darkGreen: "#187B07",
    burntOrange: "#BC823E",
    darkGrey: "#535353",
};

/**
 * Returns the display property for the navbar item.
 */
export function displayTabs(label: string, isAuthed: boolean): string {
    if (label == "Sign Up" && isAuthed) {
        return "none";
    } else if (label == "Sign In" && isAuthed) {
        return "none";
    } else if (label == "Sign Out" && !isAuthed) {
        return "none";
    } else if (label == "Profile" && !isAuthed) {
        return "none";
    }
    return "block";
}

/**
 * Renders the desktop sub navbar component.
 * @param param0
 * @returns The desktop sub navbar component.
 */
function DesktopSubNav({ label, href }: NavItem) {
    return (
        <Box
            as="a"
            href={href}
            role={"group"}
            display={"block"}
            rounded={"md"} // Rounded corners
            p={1}
            transition={"all .3s ease"}
            _hover={{ bg: NAV_COLORS.darkGreen }}
            _focus={{ outline: "none", boxShadow: "none" }}
        >
            <Stack direction={"row"} align={"center"} border={"none"}>
                <Box>
                    <Heading
                        size={"sm"}
                        color={NAV_COLORS.white}
                        fontWeight={500}
                    >
                        {label}
                    </Heading>
                </Box>
                <Flex
                    transition={"all .3s ease"}
                    opacity={0}
                    _groupHover={{
                        opacity: "100%",
                        transform: "translateX(0)",
                    }}
                    justify={"flex-end"}
                    align={"center"}
                    flex={1}
                >
                    <Icon
                        color={NAV_COLORS.green}
                        w={5}
                        h={5}
                        as={ChevronRightIcon}
                    />
                </Flex>
            </Stack>
        </Box>
    );
}

/**
 * Renders the desktop navbar component.
 * @returns The desktop navbar component.
 */
function DesktopNav(props: NavBarProps) {
    const auth = useAuth();

    // change link color if darkText is true
    const linkHoverColor = NAV_COLORS.white;
    const linkColor = props.darkText ? NAV_COLORS.darkGrey : NAV_COLORS.white;

    return (
        <Flex height={"min-content"} width={"100%"}>
            <Stack direction={"row"} width="100%">
                {NAV_ITEMS.slice(0, 3).map((navItem) => {
                    const displayValue = displayTabs(
                        navItem.label,
                        auth.isAuthenticated,
                    );

                    return (
                        <Box
                            key={navItem.label}
                            display={displayValue}
                            onClick={
                                navItem.label === "Sign Out"
                                    ? async () => {
                                          await auth.signOut();
                                          window.location.href = "/";
                                      }
                                    : () => {}
                            }
                            _hover={{
                                backgroundColor: NAV_COLORS.green,
                                textDecoration: "none",
                                color: linkHoverColor,
                                "& svg": {
                                    transform: "rotate(-180deg)",
                                },
                            }}
                            _focus={{ outline: "none", boxShadow: "none" }}
                        >
                            <Popover placement={"bottom"} trigger={"hover"}>
                                <PopoverTrigger>
                                    <Link
                                        href={
                                            navItem.label === "Sign Out"
                                                ? undefined
                                                : props.hreffunc
                                                  ? props.hreffunc(
                                                        navItem.href || "",
                                                    )
                                                  : undefined
                                        }
                                        style={{
                                            textDecoration: "none",
                                            outline: "none",
                                            boxShadow: "none",
                                        }}
                                    >
                                        <Flex
                                            width={"fit-content"}
                                            h="100%"
                                            alignItems={"center"}
                                            color={linkColor}
                                            _hover={{
                                                textDecoration: "none",
                                                color: linkHoverColor,
                                            }}
                                        >
                                            <Heading
                                                fontSize={"20px"}
                                                fontFamily={"Barlow Condensed"}
                                                textTransform="uppercase"
                                                letterSpacing={"2px"}
                                                px={5}
                                                py={2}
                                                userSelect={"none"}
                                                transition={"all .3s ease"}
                                            >
                                                {navItem.label}
                                            </Heading>
                                            {navItem.children && (
                                                <Icon
                                                    as={ChevronDownIcon}
                                                    w={5}
                                                    h={5}
                                                    ml={-3}
                                                    mr={3}
                                                    transition={"all .3s ease"}
                                                />
                                            )}
                                        </Flex>
                                    </Link>
                                </PopoverTrigger>

                                {navItem.children && (
                                    <PopoverContent
                                        border={0}
                                        borderRadius={0}
                                        p={4}
                                        zIndex={4}
                                        bg={NAV_COLORS.green}
                                        textTransform="uppercase"
                                        width={"fit-content"}
                                    >
                                        <Stack>
                                            {navItem.children.map((child) => {
                                                return (
                                                    <DesktopSubNav
                                                        key={child.label}
                                                        {...child}
                                                    />
                                                );
                                            })}
                                        </Stack>
                                    </PopoverContent>
                                )}
                            </Popover>
                        </Box>
                    );
                })}
            </Stack>

            {/* Spacer to push the right-side elements to the right */}
            <Spacer />

            <Flex justifyContent="flex-end" width="100%" direction="row">
                {NAV_ITEMS.slice(3).map((navItem) => {
                    return (
                        <Box
                            key={navItem.label}
                            display={displayTabs(
                                navItem.label,
                                auth.isAuthenticated,
                            )}
                            onClick={
                                navItem.label === "Sign Out"
                                    ? async () => {
                                          await auth.signOut();
                                          window.location.href = "/";
                                      }
                                    : () => {}
                            }
                            _hover={{
                                backgroundColor: NAV_COLORS.green,
                                textDecoration: "none",
                                color: linkHoverColor,
                            }}
                            ml={2}
                        >
                            <Link
                                href={
                                    navItem.label === "Sign Out"
                                        ? undefined
                                        : props.hreffunc
                                          ? props.hreffunc(navItem.href || "")
                                          : undefined
                                }
                                style={{
                                    textDecoration: "none",
                                    outline: "none",
                                    boxShadow: "none",
                                }}
                            >
                                <Flex
                                    width={"fit-content"}
                                    h="100%"
                                    alignItems={"center"}
                                    color={linkColor}
                                    _hover={{
                                        textDecoration: "none",
                                        color: linkHoverColor,
                                    }}
                                >
                                    <Heading
                                        fontSize={"15px"}
                                        fontWeight={500}
                                        fontFamily="Barlow"
                                        textTransform="uppercase"
                                        letterSpacing="0.75px"
                                        px={5}
                                        py={2}
                                        userSelect={"none"}
                                    >
                                        {navItem.label}
                                    </Heading>
                                    {navItem.children && (
                                        <Icon
                                            as={ChevronDownIcon}
                                            w={5}
                                            h={5}
                                            transition={"all .3s ease"}
                                        />
                                    )}
                                </Flex>
                            </Link>
                        </Box>
                    );
                })}
                {/* If a crypto wallet is connected, their account information and balance will be shown */}
                {props.cryptoWalletConnected && <ConnectButton />}
            </Flex>
        </Flex>
    );
}

/**
 * Renders the navbar component.
 * @returns The navbar component.
 */
export default function NavBar({
    darkText,
    logoDropShadow,
    cryptoWalletConnected,
    ...rest
}: NavBarProps) {
    const { isOpen, onToggle } = useDisclosure();

    const [generatedByUUID, setGeneratedByUUID] = useState<string | null>(null);
    const [cardSentUUID, setCardSentUUID] = useState<string | null>(null);
    const [senderUUID, setSenderUUID] = useState<string | null>(null);

    const [windowLocation, setWindowLocation] = useState<string | null>(null);

    /**
     * Returns the correct href for the navbar item.
     */
    function calcHREF(href: string | undefined): string {
        switch (href) {
            case "/signup":
                if (generatedByUUID && cardSentUUID) {
                    return `/signup?fromUUID=${generatedByUUID}&cardUUID=${cardSentUUID}&fromUUID=${senderUUID}`;
                }
                return "/signup/";

                break;
            case "/login":
                if (generatedByUUID && cardSentUUID) {
                    return `/login?fromUUID=${generatedByUUID}&cardUUID=${cardSentUUID}&fromUUID=${senderUUID}`;
                }
                return "/login/";
                break;
            default:
                return href ?? "#";
        }
    }

    useEffect(() => {
        if (typeof window !== "undefined") {
            const queryParams = new URLSearchParams(window.location.search);
            const path = window.location.pathname;
            setGeneratedByUUID(queryParams.get("generatedByUUID") || null);
            setCardSentUUID(queryParams.get("cardUUID") || null);
            setSenderUUID(queryParams.get("fromUUID") || null);
            setWindowLocation(path || null);
        }
    }, []);

    const isMobile = useBreakpointValue({ base: true, lg: false });

    return (
        <>
            <SideBarHamburger />
            <ResponsiveBlock
                bgGradient={{
                    base: "none",
                    md: "linear(to-b, rgba(0,0,0,1), rgba(0,0,0,0.6), rgba(0,0,0,0))",
                }}
                zIndex={100}
                position="relative"
                {...rest}
            >
                <Flex
                    pt={{ base: "22px", md: "32px" }}
                    align={"center"}
                    justify={"space-between"}
                    width={"100%"}
                    borderBottom={
                        windowLocation === "/create/card_creation"
                            ? "2px solid #161E1C"
                            : "none"
                    }
                >
                    <Flex
                        flex={1}
                        align={"center"}
                        justify={"space-between"}
                        position={"relative"}
                    >
                        {/* Logo */}
                        <Link
                            href="/"
                            style={{ outline: "none", boxShadow: "none" }}
                        >
                            <Image
                                src={OnFireLogo.src}
                                alt="Logo"
                                width={{ base: "38px", md: "59px" }}
                            />
                        </Link>

                        {/* Navbar Items */}
                        <Flex
                            display={{ base: "none", md: "flex" }}
                            ml={5}
                            width={"100%"}
                        >
                            <DesktopNav
                                darkText={darkText}
                                logoDropShadow={logoDropShadow}
                                hreffunc={calcHREF}
                                cryptoWalletConnected={cryptoWalletConnected}
                            />
                        </Flex>
                    </Flex>
                </Flex>
                <SideDrawer
                    isOpen={isOpen}
                    onClose={onToggle}
                    placement={"right"}
                    size={"xl"}
                    isMobile={isMobile}
                />
            </ResponsiveBlock>
        </>
    );
}
