import React from "react";
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Text,
    Heading,
    Flex,
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import LightItUpCTAButton from "@/app/components/buttons/light-it-up-button";
import Link from "next/link";
import SubscriptionDetails from "./subscription-details";

type PricingTier = "PROSPECT" | "ROOKIE" | "ALL_STAR" | "MVP";

interface TierConfig {
    price: number;
    features: (number | "✓" | "X")[];
}

type PricingFeature = {
    label: string;
    subText?: string;
    subTextLinkUrl?: string;
};

const tiers: Record<PricingTier, TierConfig> = {
    PROSPECT: {
        price: 19.99,
        features: ["✓", "X", "X", "X", "X", "✓", "✓", "✓", "✓", "✓", "X"],
    },
    ROOKIE: {
        price: 29.99,
        features: ["✓", 1, "X", "X", "X", "✓", "✓", "✓", "X", "✓", "X"],
    },
    ALL_STAR: {
        price: 39.99,
        features: ["✓", 1, 15, "X", "✓", "✓", "✓", "✓", "X", "✓", "X"],
    },
    MVP: {
        price: 79.99,
        features: ["✓", 3, 25, "✓", "✓", "✓", "✓", "✓", "✓", "✓", "✓"],
    },
};

const featureLabels: PricingFeature[] = [
    { label: "Create Custom Card" },
    {
        label: "Physical Card(s) with 3D and AR Interactivity",
        subText: "Learn More About AR Cards",
        subTextLinkUrl: "/newsroom/what-are-ar-cards",
    },
    {
        label: "Quantity of Uniquely Registered/Numbered Digital Cards You Receive to Trade or Sell",
    },
    { label: "Add Additional Digital Cards to Trade/Sell" },
    {
        label: "Sell Cards You Created",
        subText: "(Athlete Receives 75% of Profits)",
    },
    { label: "Trade Cards" },
    { label: "Buy Cards" },
    { label: "Build Your Own Profile" },
    { label: "Bag Tag of Your Card Design" },
    { label: "Resell Any Cards You Purchased (Coming Soon)" },
    { label: "One-Year ONFIRE INSIDER Subscription" },
];

export default function PricingTable() {
    const renderFeatureValue = (value: number | "✓" | "X") => {
        if (value === "✓") {
            return (
                <CheckIcon
                    p={"2px"}
                    rounded="full"
                    bg="green.200"
                    color="white"
                    fontSize={{ base: "12px", lg: "15px" }}
                />
            );
        } else if (value === "X") {
            return (
                <CloseIcon
                    p="2px"
                    color="white"
                    fontSize={{ base: "12px", lg: "15px" }}
                />
            );
        } else {
            return (
                <Text
                    color="white"
                    fontWeight="medium"
                    fontSize={{ base: "12px", lg: "15px" }}
                    fontFamily="Barlow"
                >
                    {value}
                </Text>
            );
        }
    };

    return (
        <Box
            overflowX="auto"
            bg="gray.1000"
            borderRadius="2xl"
            p={{ base: "10px", lg: 10 }}
            boxShadow="0 0 16px #27CE00"
            h="100%"
            flex={1}
            maxW={{ base: "100%", lg: "860px" }}
        >
            <Table colorScheme="gray">
                <Thead>
                    <Tr>
                        <Th
                            borderColor="transparent"
                            fontFamily="Brotherhood, Regular"
                            color="white"
                            fontSize={{ base: "24px", lg: "42px" }}
                            fontWeight="normal"
                            pl="12px"
                            pb="18px"
                        >
                            PRICING
                        </Th>
                        {(Object.keys(tiers) as PricingTier[]).map(
                            (tierName) => (
                                <Th
                                    key={tierName}
                                    borderColor="transparent"
                                    textAlign="center"
                                    p={0}
                                >
                                    <Heading
                                        fontSize={{ base: "12px", lg: "16px" }}
                                        color="green.200"
                                        textTransform="uppercase"
                                        fontFamily="Barlow Semi Condensed"
                                        whiteSpace="nowrap"
                                        padding={0}
                                    >
                                        {tierName.replace("_", "-")}
                                    </Heading>
                                </Th>
                            ),
                        )}
                    </Tr>
                </Thead>
                <Tbody>
                    {featureLabels.map((feature, index) => (
                        <Tr
                            key={index}
                            bg={index % 2 === 0 ? "black" : "gray.1000"}
                        >
                            <Td
                                color="white"
                                display="flex"
                                flexDirection="column"
                                fontSize={{ base: "10px", lg: "14px" }}
                                fontWeight="medium"
                                fontFamily="Barlow"
                                letterSpacing="18"
                                borderColor="transparent"
                                maxW={{ base: "120px", lg: "360px" }}
                                p={{ base: "6px", lg: "10px" }}
                                lineHeight={{ base: "13px", lg: "initial" }}
                            >
                                {feature.label}
                                {feature.subText &&
                                    (feature.subTextLinkUrl ? (
                                        <Link
                                            href={feature.subTextLinkUrl}
                                            target="_blank"
                                        >
                                            <Text
                                                color="green.200"
                                                textDecoration="underline"
                                            >
                                                {feature.subText}
                                            </Text>
                                        </Link>
                                    ) : (
                                        <Text>{feature.subText}</Text>
                                    ))}
                            </Td>
                            {(Object.keys(tiers) as PricingTier[]).map(
                                (tierName) => (
                                    <Td
                                        key={tierName}
                                        borderColor="transparent"
                                        textAlign="center"
                                        p={{ base: "6px", lg: "10px" }}
                                    >
                                        {renderFeatureValue(
                                            tiers[tierName].features[index],
                                        )}
                                    </Td>
                                ),
                            )}
                        </Tr>
                    ))}
                    <Tr bg="black">
                        <Td colSpan={5} borderColor="transparent" pt={0} px={0}>
                            <SubscriptionDetails />
                        </Td>
                    </Tr>
                    <Tr>
                        <Td pt={6} borderColor="transparent">
                            <Text
                                color="white"
                                fontSize="20px"
                                fontWeight="medium"
                                fontFamily="Barlow Semi Condensed"
                                mb={2}
                            >
                                PRICE
                            </Text>
                        </Td>
                        {(Object.keys(tiers) as PricingTier[]).map(
                            (tier, index) => (
                                <Td key={index} borderColor="transparent" p={0}>
                                    <Text
                                        color="green.200"
                                        fontSize={{ base: "12px", lg: "20px" }}
                                        fontFamily="Barlow Semi Condensed"
                                        fontWeight="semibold"
                                    >
                                        ${tiers[tier].price}
                                    </Text>
                                </Td>
                            ),
                        )}
                    </Tr>
                </Tbody>
            </Table>
            <Flex
                justify={{ base: "flex-start", lg: "flex-end" }}
                mt={4}
                gap={4}
                position={{ base: "sticky", lg: "relative" }}
                left={"16px"}
            >
                <LightItUpCTAButton
                    link="/signup"
                    color="white"
                    w={{ base: "100%", lg: "233px" }}
                >
                    SIGN UP
                </LightItUpCTAButton>
                <LightItUpCTAButton
                    link="/create"
                    color="white"
                    w={{ base: "100%", lg: "233px" }}
                >
                    START CREATING
                </LightItUpCTAButton>
            </Flex>
        </Box>
    );
}
