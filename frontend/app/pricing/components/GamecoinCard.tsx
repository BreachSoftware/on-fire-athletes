import { Box, Text, VStack, Button } from "@chakra-ui/react";

interface Benefit {
    description: string;
    percentage: number;
}

const benefits: Benefit[] = [
    {
        description:
            "of all GMEX transactions is distributed among all token holders",
        percentage: 2,
    },
    {
        description:
            "of every transaction is distributed to a charity wallet to support underserved athletes, teams, and communities",
        percentage: 5,
    },
];

const discount: {
    percentage: number;
    description: string;
} = {
    percentage: 20,
    description: "Discount on All Purchases",
};

export default function GamecoinCard() {
    return (
        <VStack
            spacing={6}
            align="stretch"
            alignSelf="stretch"
            color="white"
            bg="gray.700"
            borderRadius="2xl"
            p={10}
            boxShadow="0 0 32px lime"
        >
            {/* Header */}
            <Text fontSize="xl" fontWeight="bold" textTransform="uppercase">
                Payment Options
            </Text>

            {/* Game Coin Section */}
            <Box>
                <Text color="green.200" fontWeight="semibold" fontSize="sm">
                    (GMEX OFFICIAL CRYPTO TOKEN OF ON/OFF ATHLETES)
                </Text>
                <Text fontSize="xl" fontWeight="bold" mb={4}>
                    GAME COIN
                </Text>

                {/* Discount Section */}
                <Box mb={4}>
                    <Text color="green.200" fontWeight="semibold" fontSize="sm">
                        DISCOUNT
                    </Text>
                    <Text fontSize="md">
                        {discount.percentage}% {discount.description}
                    </Text>
                </Box>

                {/* Benefits Section */}
                <Box>
                    <Text color="green.200" fontWeight="semibold" fontSize="sm">
                        BENEFIT TO GAME COIN (GMEX) TOKEN HOLDERS
                    </Text>
                    {benefits.map((benefit, index) => (
                        <Text key={index} fontSize="md" mb={2}>
                            {benefit.percentage}% {benefit.description}
                        </Text>
                    ))}
                </Box>
            </Box>

            {/* Credit Card Section */}
            <Box>
                <Text fontSize="xl" fontWeight="bold" mb={2}>
                    CREDIT CARD
                </Text>
                <Box mb={4}>
                    <Text color="green.200" fontWeight="semibold" fontSize="sm">
                        DISCOUNT
                    </Text>
                    <Text fontSize="md">No Discount</Text>
                </Box>
                <Box>
                    <Text color="green.200" fontWeight="semibold" fontSize="sm">
                        BENEFIT TO GAME COIN (GMEX) TOKEN HOLDERS
                    </Text>
                    <Text fontSize="md">
                        20% of sales value is used to purchase Game Coin (GMEX)
                        Tokens and those tokens are then burned.
                    </Text>
                </Box>
            </Box>

            {/* CTA Button */}
            <Button colorScheme="green" size="lg" width="100%">
                LEARN MORE ABOUT GAME COIN (GMEX)
            </Button>

            {/* Footer Text */}
            <Text fontSize="sm" color="gray.400">
                Game Coin (GMEX) can be purchased on Bitmart and Pancake Swap.
            </Text>
        </VStack>
    );
}
