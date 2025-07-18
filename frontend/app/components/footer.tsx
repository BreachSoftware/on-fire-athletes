"use client";

import ResponsiveBlock from "@/components/shared/wrappers/responsive-block";
import { Divider, Flex, Image, Link } from "@chakra-ui/react";

import MobileBackground from "@/images/backgrounds/mobileFooterBackground.png";
import DesktopBackground from "@/images/backgrounds/desktopFooterBackground.png";
import FullLogo from "@/images/logos/on-fire-athletes-full-logo.png";

/**
 * Footer
 * This is the footer component for all the pages of the app.
 * @returns {JSX.Element} The footer component.
 */
export default function Footer() {
    return (
        <ResponsiveBlock
            bgImage={{
                base: MobileBackground.src,
                md: DesktopBackground.src,
            }}
            w="full"
            zIndex={11}
        >
            <Flex
                direction={{ base: "column", md: "row" }}
                wrap="wrap"
                justify={"space-around"}
                align="center"
                w="100%"
                color="white"
                fontSize="sm"
                gap={{ base: "20px", md: "24px" }}
                borderWidth={0}
                boxSizing="border-box"
                pb={{ base: "32px", md: "48px" }}
                pt={{ base: "24px", md: "48px" }}
            >
                <Image
                    src={FullLogo.src}
                    alt="Game Coin Logo"
                    w="250px"
                    h="auto"
                />
                <Flex
                    flexGrow={{ base: 0, md: 1 }}
                    width={{ base: "75%", md: "auto" }}
                >
                    <Divider
                        orientation="horizontal"
                        background="white"
                        borderColor="whiteAlpha.900"
                        border="2px solid white"
                        borderRadius="full"
                        boxShadow="0px 0px 15px white"
                        opacity="1"
                    />
                </Flex>
                <Flex direction={"row"} gap={"25px"}>
                    <Link href="/faq?category=Legal&item=0" noOfLines={1}>
                        TERMS & CONDITIONS
                    </Link>
                    <Link href="/faq?category=Legal&item=1" noOfLines={1}>
                        PRIVACY POLICY
                    </Link>
                </Flex>
            </Flex>
        </ResponsiveBlock>
    );
}
