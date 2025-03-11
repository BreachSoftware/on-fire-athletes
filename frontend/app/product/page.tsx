import SharedStack from "@/components/shared/wrappers/shared-stack";
import React from "react";
import { Box, Text } from "@chakra-ui/react";
import ProductBackground from "@/images/backgrounds/product-bg.png";
import NavBar from "../navbar";
import Sidebar from "@/components/sidebar";
import PhsyicalCardProduct from "@/images/product/physical-card-product.png";
import DigitalCardProduct from "@/images/product/digital-card-product.png";
import BagTagProduct from "@/images/product/bag-tag-product.png";
import MVPProduct from "@/images/product/mvp-product.png";
import ProductSnapshot from "./product-snapshot";
import Footer from "../components/footer";
// Trigger build

export default function Product() {
    return (
        <SharedStack
            row
            h="fit-content"
            w="full"
            spacing={0}
            alignItems="flex-start"
            bg="#121212"
        >
            <SharedStack
                flex={1}
                w="full"
                bgImage={{ base: ProductBackground.src, "2xl": "none" }}
            >
                <Box position="sticky" top={0} zIndex={5} w="full">
                    <NavBar />
                </Box>
                {/* Header Section */}
                <SharedStack
                    w="full"
                    px={{ base: 2, md: 8 }}
                    pt={{ base: "48px", "2xl": "184px" }}
                    pb={{ base: "0px", "2xl": "100px" }}
                >
                    <SharedStack w="full" alignItems="center">
                        <Text
                            fontSize={{ base: "36px", "2xl": "72px" }}
                            letterSpacing="1.44px"
                            color="green.100"
                            fontFamily="Brotherhood, Regular"
                            textAlign="center"
                            lineHeight={{ base: "36px", "2xl": "initial" }}
                        >
                            Create, Customize, and Capture Your Moment
                        </Text>
                        <Text
                            fontSize={{ base: "24px", "2xl": "40px" }}
                            color="white"
                            fontFamily="Barlow Condensed"
                            fontStyle="italic"
                            fontWeight="semibold"
                            textAlign="center"
                        >
                            WITH ANY OF THE FOLLOWING PRODUCTS!
                        </Text>
                    </SharedStack>
                </SharedStack>

                <SharedStack
                    w="full"
                    pl={{ base: "40px", "2xl": "100px" }}
                    pr={{ base: "40px", "2xl": "64px" }}
                    justify="center"
                    spacing="72px"
                    pt={{ base: "8px", "2xl": "48px" }}
                    pb="128px"
                    bgImage={{ base: "none", "2xl": ProductBackground.src }}
                    bgSize="cover"
                    bgPosition="center"
                    bgRepeat="no-repeat"
                >
                    {/* Product Section */}
                    <ProductSnapshot
                        imageSrc={DigitalCardProduct.src}
                        title="DIGITAL SPORTS CARDS"
                        description="Create your own digital sports card. This allows you to capture your moment online and sell digital cards in the Locker Room Marketplace."
                        pricingComponent={
                            <SharedStack
                                row
                                spacing={{ base: "18px", "2xl": "84px" }}
                                alignItems={{
                                    base: "center",
                                    "2xl": "flex-start",
                                }}
                                justify={{
                                    base: "center",
                                    "2xl": "flex-start",
                                }}
                            >
                                <PricingList
                                    items={DIGITAL_PRICING_LIST.slice(0, 3)}
                                />
                                <PricingList
                                    items={DIGITAL_PRICING_LIST.slice(3)}
                                />
                            </SharedStack>
                        }
                    />
                    <NeonDivider />
                    <ProductSnapshot
                        imageSrc={PhsyicalCardProduct.src}
                        title="PHSYICAL AR CARDS"
                        description="Bring your moment to life in the palm of your hand with a printed card featuring augmented reality allowing you to showcase a highlight video on the back of the card."
                        pricingComponent={
                            <SharedStack
                                row
                                spacing={{ base: "18px", "2xl": "84px" }}
                                alignItems={{
                                    base: "center",
                                    "2xl": "flex-start",
                                }}
                                justify={{
                                    base: "center",
                                    "2xl": "flex-start",
                                }}
                            >
                                <PricingList
                                    items={PHSYICAL_PRICING_LIST.slice(0, 3)}
                                />
                                <PricingList
                                    items={PHSYICAL_PRICING_LIST.slice(3)}
                                />
                            </SharedStack>
                        }
                        reverse
                    />
                    <NeonDivider />
                    <ProductSnapshot
                        imageSrc={BagTagProduct.src}
                        title="BAG TAGS"
                        description="Take your moment on the road! Our bag tags allow you to customize a card that is printed on rigid plastic equipped with augmented reality to showcase a video of your choosing on the back."
                        pricingComponent={
                            <PricingList items={BAG_TAG_PRICING_LIST} />
                        }
                    />
                    <NeonDivider />
                    <ProductSnapshot
                        imageSrc={MVPProduct.src}
                        title="MVP PACKAGE"
                        description="How about all of it? This option gives you every product we offer and then some!"
                        pricingComponent={
                            <PricingList
                                items={[
                                    {
                                        title: "MVP Package Includes",
                                        subtitles: [
                                            "10 Physical AR Cards",
                                            "50 Digital Cards to Sell",
                                            "1 Bag Tag",
                                        ],
                                    },
                                    {
                                        title: "for only $59.99!",
                                    },
                                ]}
                            />
                        }
                        reverse
                    />
                </SharedStack>
                <Footer />
            </SharedStack>
            <Box
                h="100vh"
                position="sticky"
                top={0}
                display={{ base: "none", md: "inline" }}
            >
                <Sidebar height="full" />
            </Box>
        </SharedStack>
    );
}

function PricingList({
    items,
}: {
    items: { title: string; subtitles?: string[] }[];
}) {
    return (
        <SharedStack
            flex={1}
            w={{ base: "full", "2xl": "fit-content" }}
            alignItems={{ base: "center", "2xl": "flex-start" }}
        >
            {items.map((item) => (
                <SharedStack key={item.title} gap={0}>
                    <Text
                        fontSize={{ base: "18px", "2xl": "36px" }}
                        color="green.100"
                        fontStyle="italic"
                        fontWeight="semibold"
                        fontFamily="Barlow Condensed"
                        w="full"
                    >
                        {item.title}
                    </Text>
                    {item.subtitles && (
                        <SharedStack>
                            {item.subtitles.map((subtitle) => (
                                <Text
                                    w="full"
                                    key={subtitle}
                                    fontSize={{ base: "18px", "2xl": "36px" }}
                                    color="white"
                                    fontStyle="italic"
                                    fontWeight={{
                                        base: "medium",
                                        "2xl": "semibold",
                                    }}
                                    fontFamily="Barlow Condensed"
                                >
                                    • {subtitle}
                                </Text>
                            ))}
                        </SharedStack>
                    )}
                </SharedStack>
            ))}
        </SharedStack>
    );
}

function NeonDivider() {
    return (
        <Box
            alignSelf="center"
            w="full"
            h="3px"
            border="3px solid"
            borderColor="green.100"
            boxShadow="0px 0px 15px #44FF19"
            rounded="full"
        />
    );
}

const PHSYICAL_PRICING_LIST: { title: string; subtitles?: string[] }[] = [
    { title: "1 AR Card: $24.99" },
    { title: "5 AR Cards: $39.99" },
    { title: "10 AR Cards: $54.99" },
    { title: "15 AR Cards: $69.99" },
    { title: "20 AR Cards: $84.99" },
    { title: "25 AR Cards: $99.99" },
];

const BAG_TAG_PRICING_LIST: { title: string; subtitles?: string[] }[] = [
    { title: "1 Bag Tag: $19.99" },
    { title: "2 Bag Tags: $29.99" },
    { title: "3 Bag Tags: $37.99" },
    { title: "4 Bag Tags: $44.99" },
    { title: "5 Bag Tags: $49.99" },
];

const DIGITAL_PRICING_LIST: { title: string; subtitles?: string[] }[] = [
    { title: "25 Digital Card: $9.99" },
    { title: "50 Digital Cards: $11.99" },
    { title: "75 Digital Cards: $13.99" },
    { title: "100 Digital Cards: $15.99" },
    { title: "125 Digital Cards: $17.99" },
    { title: "Up to 250 Cards: $22.99" },
];
