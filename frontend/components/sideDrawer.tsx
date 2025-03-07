"use client";
import {
    Drawer,
    DrawerOverlay,
    DrawerContentProps,
    DrawerContent,
    DrawerBody,
    Text,
    Grid,
    Flex,
    Divider,
    Box,
    Button,
    useBreakpointValue,
} from "@chakra-ui/react";
import Sidebar from "./sidebar";
import Headline from "./headline_section/headline";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { useRouter, usePathname } from "next/navigation";
import { BeatLoader } from "react-spinners";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { displayTabs } from "@/app/navbar";

import CreateYourCardBg from "@/images/backgrounds/create-your-card.png";
import FutureFandomBg from "@/images/backgrounds/future-fandom.png";
import SharedStack from "./shared/wrappers/shared-stack";

interface SideDrawerProps extends DrawerContentProps {
    isOpen: boolean;
    onClose: () => void;
    placement?: "bottom" | "end" | "left" | "right" | "start" | "top";
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "full";
}

interface MobileNavItem {
    title: string;
    href: string;
}

interface MobileNavSection {
    header: string;
    children?: Array<MobileNavItem>;
}

// The items used for our Navigation Menu
const navItems: Array<MobileNavSection> = [
    {
        header: "Light it Up",
        children: [
            {
                title: "Sign Up",
                href: "/signup",
            },
            {
                title: "Sign In",
                href: "/login",
            },
            {
                title: "Profile",
                href: "/profile",
            },
            {
                title: "Sign Out",
                href: "/",
            },
        ],
    },
    {
        header: "Create",
        children: [
            {
                title: "Create Sports Card",
                href: "/create",
            },
        ],
    },
    {
        header: "Collect",
        children: [
            {
                title: "Locker Room",
                href: "/lockerroom",
            },
        ],
    },
    {
        header: "About",
        children: [
            {
                title: "Our Story",
                href: "/our-story",
            },
            // {
            //     title: "Pricing",
            //     href: "/pricing",
            // },
            {
                title: "Product",
                href: "/product",
            },
            {
                title: "AR Card",
                href: "newsroom/what-are-ar-cards",
            },
            {
                title: "NIL Partnerships",
                href: "/nil",
            },
            {
                title: "FAQs",
                href: "/faq",
            },
            {
                title: "Contact",
                href: "/contact",
            },
        ],
    },
    // {
    //     header: "Gift",
    //     children: [
    //         {
    //             title: "Gift a card",
    //             href: "/checkout?gift=true",
    //         },
    //     ],
    // },
];

/**
 * The side drawer component.
 * @param
 * @returns
 */
function SideDrawer(props: SideDrawerProps) {
    const isMobile = useBreakpointValue({ base: true, lg: false });

    const { onClose } = props;

    const rightHeaderColor = "#187b07";
    const leftHeaderColor = "green.100";
    const headerFont = "Barlow Condensed";
    const headerWeight = 600;
    const headerSpacing = "0.4px";

    const subHeaderColor = "white";
    const subHeaderFont = "Barlow Semi Condensed";
    const subHeaderSpacing = "1.68px";
    const subHeaderWeight = 600;

    const primaryBackgroundColor = "green.100"; // Background color for drawer right
    const secondaryBackgroundColor = "#171C1B"; // Linear gradient for drawer left

    const router = useRouter();
    const auth = useAuth();

    const sidebarItems = isMobile
        ? [
              ...navItems,
              {
                  header: "Get Started Today",
              },
          ]
        : navItems;

    return (
        <Drawer
            isOpen={props.isOpen}
            placement={props.placement || "right"}
            onClose={props.onClose}
            size={props.size || "xl"}
        >
            <DrawerOverlay />

            <DrawerContent w={{ base: "100%", md: "1000px" }} maxW="1000px">
                {/* Grid split in two halves that takes up full width */}
                <Grid
                    templateColumns={{ base: "100%", lg: "1fr 1fr" }}
                    templateRows="auto"
                    height="100dvh"
                    overflowY="hidden"
                >
                    {/* Left half */}
                    {/* Only show this on desktop */}
                    <Flex
                        display={{ base: "none", lg: "flex" }}
                        flexDirection="column"
                        bgColor={secondaryBackgroundColor}
                        justifyContent={"center"}
                    >
                        <Flex
                            direction={"column"}
                            width={"80%"}
                            alignSelf={"center"}
                            gap={5}
                        >
                            <Text
                                color={leftHeaderColor}
                                fontFamily={headerFont}
                                fontSize={{ base: "16px", lg: "20px" }}
                                letterSpacing={headerSpacing}
                                fontWeight={headerWeight}
                                textTransform={"uppercase"}
                            >
                                Get Started Today
                            </Text>

                            {/* Headline Boxes */}
                            <Flex
                                direction={"column"}
                                height={"min-content"}
                                gap={34}
                                justifyContent={"center"}
                            >
                                <Headline
                                    headlineTitle="Create Your Card"
                                    buttonText="Start Creating"
                                    url="/create"
                                    width="100%"
                                    height="280px"
                                    background={CreateYourCardBg.src}
                                />

                                <Headline
                                    headlineTitle="The Future of Fandom"
                                    buttonText="Start Collecting"
                                    url="/lockerroom"
                                    width="100%"
                                    height="280px"
                                    background={FutureFandomBg.src}
                                />
                            </Flex>
                        </Flex>
                    </Flex>

                    {/* Right half */}
                    <Flex
                        flexDirection={{ base: "row-reverse", lg: "row" }}
                        backgroundColor={primaryBackgroundColor}
                        justifyContent={"center"}
                        alignItems={"center"}
                        height="100%"
                        overflowY="auto"
                        w="100%"
                    >
                        <DrawerBody h="100%">
                            {/* Nav Menu */}
                            <Flex
                                flexDirection={"column"}
                                justifySelf={"center"}
                                alignSelf={"center"}
                                py={{ base: "32px", md: "80px" }}
                            >
                                <SharedStack
                                    flexDirection={"column"}
                                    alignSelf={"center"}
                                    height={"100%"}
                                    w="100%"
                                    divider={
                                        <Divider
                                            borderColor={"gray.1700"}
                                            opacity={0.26}
                                            borderWidth={1}
                                            width="106%"
                                            style={{
                                                marginTop: "25px",
                                                marginBottom: "25px",
                                            }}
                                        />
                                    }
                                >
                                    {/* Smaller groupings of each nav section */}
                                    {sidebarItems.map((navItem, index) => {
                                        return (
                                            <Flex
                                                flexDirection="column"
                                                key={index}
                                                gap="14px"
                                                userSelect="none"
                                            >
                                                <Text
                                                    color={rightHeaderColor}
                                                    fontFamily={headerFont}
                                                    fontSize={{
                                                        base: "16px",
                                                        lg: "20px",
                                                    }}
                                                    letterSpacing={
                                                        headerSpacing
                                                    }
                                                    fontWeight={headerWeight}
                                                    textTransform={"uppercase"}
                                                    lineHeight={{
                                                        base: "18px",
                                                        lg: "24px",
                                                    }}
                                                >
                                                    {navItem.header}
                                                </Text>
                                                <SharedStack gap="12px">
                                                    {/* Each child of the nav section */}
                                                    {navItem.children?.map(
                                                        (child, index) => {
                                                            return (
                                                                <Box
                                                                    key={index}
                                                                    w="fit-content"
                                                                    display={displayTabs(
                                                                        child.title,
                                                                        auth.isAuthenticated,
                                                                    )}
                                                                    _focus={{
                                                                        outline:
                                                                            "none",
                                                                    }}
                                                                >
                                                                    <Button
                                                                        variant="ghost"
                                                                        p={0}
                                                                        h="fit-content"
                                                                        display={
                                                                            "inline-block"
                                                                        }
                                                                        position={
                                                                            "relative"
                                                                        }
                                                                        textDecoration={
                                                                            "none"
                                                                        }
                                                                        color={
                                                                            subHeaderColor
                                                                        }
                                                                        fontFamily={
                                                                            subHeaderFont
                                                                        }
                                                                        fontSize={{
                                                                            base: "18px",
                                                                            lg: "28px",
                                                                        }}
                                                                        fontWeight={
                                                                            subHeaderWeight
                                                                        }
                                                                        letterSpacing={
                                                                            subHeaderSpacing
                                                                        }
                                                                        textTransform={
                                                                            "uppercase"
                                                                        }
                                                                        lineHeight={{
                                                                            base: "20px",
                                                                            lg: "34px",
                                                                        }}
                                                                        noOfLines={
                                                                            1
                                                                        }
                                                                        whiteSpace="nowrap"
                                                                        overflow="visible"
                                                                        // fancy underline animation on hover
                                                                        transition={
                                                                            "all 0.2s ease-in-out"
                                                                        }
                                                                        _after={{
                                                                            content:
                                                                                "''",
                                                                            position:
                                                                                "absolute",
                                                                            width: "100%",
                                                                            transform:
                                                                                "scaleX(0)",
                                                                            borderRadius: 5,
                                                                            height: "0.05em",
                                                                            bottom: 0,
                                                                            left: 0,
                                                                            background:
                                                                                "white",
                                                                            transformOrigin:
                                                                                "bottom right",
                                                                            transition:
                                                                                "transform 0.25s ease-out",
                                                                        }}
                                                                        _hover={{
                                                                            md: {
                                                                                cursor: "pointer",
                                                                                _after: {
                                                                                    transform:
                                                                                        "scaleX(1)",
                                                                                    transformOrigin:
                                                                                        "bottom left",
                                                                                },
                                                                            },
                                                                        }}
                                                                        onClick={
                                                                            child.title
                                                                                .toLocaleLowerCase()
                                                                                .replace(
                                                                                    " ",
                                                                                    "",
                                                                                ) ===
                                                                            "signout"
                                                                                ? async () => {
                                                                                      await auth.signOut();
                                                                                      // Refreshes the page to update the navbar
                                                                                      window.location.href =
                                                                                          "/";
                                                                                  }
                                                                                : () => {
                                                                                      router.push(
                                                                                          child.href,
                                                                                      );
                                                                                  }
                                                                        }
                                                                        tabIndex={
                                                                            -1
                                                                        }
                                                                    >
                                                                        {
                                                                            child.title
                                                                        }
                                                                    </Button>
                                                                </Box>
                                                            );
                                                        },
                                                    )}
                                                </SharedStack>
                                            </Flex>
                                        );
                                    })}
                                </SharedStack>
                                {/* <Box w="100px" h="400px" bg="yellow"></Box> */}
                                <ActionButtons onClose={onClose} />
                            </Flex>
                        </DrawerBody>

                        <Sidebar onSubClose={props.onClose} />
                    </Flex>
                </Grid>
            </DrawerContent>
        </Drawer>
    );
}

export default SideDrawer;

function ActionButtons({ onClose }: { onClose: () => void }) {
    const pathname = usePathname();
    const router = useRouter();

    // State for the create button loading
    const [createButtonLoading, setCreateButtonLoading] = useState(false);
    const [collectButtonLoading, setCollectButtonLoading] = useState(false);

    return (
        <Flex
            display={{
                base: "flex",
                lg: "none",
            }}
            mt="16px"
            flexDirection={"column"}
            gap={"15px"}
        >
            {/* Create Button */}
            <Button
                tabIndex={-1}
                variant="infoButton"
                style={{
                    border: "1px solid white",
                    height: "50px",
                }}
                w="100%"
                letterSpacing={"1.5px"}
                bg={"transparent"}
                borderRadius="30px"
                color="white"
                _focus={{
                    shadow: "none",
                }}
                pl="32px"
                isLoading={createButtonLoading}
                spinner={<BeatLoader color="white" size={8} />}
                onClick={() => {
                    if (pathname !== "/create") {
                        router.push("/create");
                        setCreateButtonLoading(true);
                    } else {
                        onClose();
                    }
                }}
            >
                <Text fontSize="14px">START CREATING</Text>
                <ChevronRightIcon boxSize={8} marginLeft="auto" />
            </Button>

            {/* Collect Button */}
            <Button
                tabIndex={-1}
                variant="infoButton"
                style={{
                    border: "1px solid white",
                    height: "50px",
                }}
                w="100%"
                letterSpacing={"1.5px"}
                bg={"transparent"}
                borderRadius="30px"
                color="white"
                _focus={{
                    shadow: "none",
                }}
                pl="32px"
                isLoading={collectButtonLoading}
                spinner={<BeatLoader color="white" size={8} />}
                onClick={() => {
                    if (pathname !== "/lockerroom") {
                        router.push("/lockerroom");
                        setCollectButtonLoading(true);
                    } else {
                        onClose();
                    }
                }}
            >
                <Text fontSize="14px">START COLLECTING</Text>
                <ChevronRightIcon boxSize={8} marginLeft="auto" />
            </Button>
        </Flex>
    );
}
