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
    VStack,
    Heading,
    Flex,
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import LightItUpCTAButton from "@/app/components/buttons/light-it-up-button";

type PricingTier = "PROSPECT" | "ROOKIE" | "ALL_STAR" | "MVP";

interface TierConfig {
    price: number;
    features: (number | "✓" | "X")[];
}

const tiers: Record<PricingTier, TierConfig> = {
    PROSPECT: {
        price: 19.99,
        features: ["X", "X", "X", "X", "X", "✓", "✓", "✓", "✓", "✓"],
    },
    ROOKIE: {
        price: 29.99,
        features: [1, "X", "X", "X", "X", "✓", "✓", "✓", "✓", "✓"],
    },
    ALL_STAR: {
        price: 39.99,
        features: [1, "✓", 15, "✓", "✓", "✓", "✓", "✓", "✓", "✓"],
    },
    MVP: {
        price: 79.99,
        features: [3, "✓", 25, "✓", "✓", "✓", "✓", "✓", "✓", "✓"],
    },
};

const featureLabels = [
    "Physical Card (1-each 3D and / All Interactivity)",
    "Create Custom Card",
    "Quantity of Uniquely Registered/Numbered Digital Cards Per Month to Trade or Sell",
    "Add Additional Digital Cards to Trade/Sell",
    "Sell Cards (10% Fee) (Lifetime Revenue 70% of Profits)",
    "Trade Cards",
    "Buy Cards",
    "Build Your Own Profile",
    "Pay Team of Your Card Design",
    "Resell Any Cards You Purchased (Coming Soon)",
];

const subscriptionFeatures = [
    "Access to exclusive content",
    "Monthly webinars",
    "Special discounts",
    "Early access to new features",
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
                />
            );
        } else if (value === "X") {
            return <CloseIcon p="2px" color="gray.300" />;
        } else {
            return (
                <Text color="gray.100" fontWeight="bold" fontSize="sm">
                    {value}
                </Text>
            );
        }
    };

    return (
        <Box
            overflowX="auto"
            bg="gray.700"
            borderRadius="2xl"
            p={10}
            boxShadow="0 0 32px lime"
            h="100%"
        >
            <Table colorScheme="gray">
                <Thead>
                    <Tr>
                        <Th borderColor="transparent"></Th>
                        {(Object.keys(tiers) as PricingTier[]).map(
                            (tierName) => (
                                <Th
                                    key={tierName}
                                    borderColor="transparent"
                                    textAlign="center"
                                >
                                    <VStack spacing={2}>
                                        <Heading
                                            size="sm"
                                            color="green.200"
                                            textTransform="uppercase"
                                            fontFamily="Barlow Semi Condensed"
                                        >
                                            {tierName.replace("_", " ")}
                                        </Heading>
                                    </VStack>
                                </Th>
                            ),
                        )}
                    </Tr>
                </Thead>
                <Tbody>
                    {featureLabels.map((label, index) => (
                        <Tr
                            key={index}
                            bg={index % 2 === 0 ? "gray.800" : "gray.700"}
                        >
                            <Td borderColor="transparent" color="gray.100">
                                {label}
                            </Td>
                            {(Object.keys(tiers) as PricingTier[]).map(
                                (tierName) => (
                                    <Td
                                        key={tierName}
                                        borderColor="transparent"
                                        textAlign="center"
                                    >
                                        {renderFeatureValue(
                                            tiers[tierName].features[index],
                                        )}
                                    </Td>
                                ),
                            )}
                        </Tr>
                    ))}
                    <Tr bg="gray.800">
                        <Td colSpan={5} borderColor="transparent" pt={6}>
                            <Text
                                color="gray.100"
                                fontSize="md"
                                fontWeight="bold"
                                mb={2}
                            >
                                One-Year ONFIRE INSIDER Subscription Includes:
                            </Text>
                            <VStack align="start" spacing={1}>
                                {subscriptionFeatures.map((feature, index) => (
                                    <Text
                                        key={index}
                                        color="gray.100"
                                        fontSize="xs"
                                    >
                                        • {feature}
                                    </Text>
                                ))}
                            </VStack>
                        </Td>
                    </Tr>
                    <Tr>
                        <Td pt={6} borderColor="transparent">
                            <Text
                                color="gray.100"
                                fontSize="lg"
                                fontWeight="semibold"
                                mb={2}
                            >
                                PRICE
                            </Text>
                        </Td>
                        {(Object.keys(tiers) as PricingTier[]).map(
                            (tier, index) => (
                                <Td key={index} borderColor="transparent">
                                    <Text
                                        color="green.200"
                                        fontSize="xl"
                                        fontWeight="semibold"
                                    >
                                        {tiers[tier].price}
                                    </Text>
                                </Td>
                            ),
                        )}
                    </Tr>
                </Tbody>
            </Table>
            <Flex justify="flex-end" mt={4} gap={4}>
                <LightItUpCTAButton link="/" color="white">
                    SIGN UP
                </LightItUpCTAButton>
                <LightItUpCTAButton link="/" color="white">
                    START CREATING
                </LightItUpCTAButton>
            </Flex>
        </Box>
    );
}
