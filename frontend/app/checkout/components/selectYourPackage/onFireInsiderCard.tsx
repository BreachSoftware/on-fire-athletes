import { Box, Text } from "@chakra-ui/react";

export default function OnFireInsiderCard() {
    return (
        <Box
            bg="black"
            w="100%"
            h="100%"
            py="20px"
            px="30px"
            fontFamily="Barlow Condensed"
            color="white"
            mt="20px"
        >
            <Text color="green.100" textDecoration="underline">
                ONFIRE INSIDER SUBSCRIPTION INCLUDES:
            </Text>
            <Text>
                <Dot />
                Create an Unlimited Amount of Digital Cards to Sell & Trade
            </Text>
            <Text>
                <Dot />
                First Access to New Backgrounds and Special Drops
            </Text>
            <Text>
                <Dot />
                Ability to Participate and Win Prizes in Player of the Week
            </Text>
            <Text>
                <Dot />
                Special Discounts on Future Purchases:
            </Text>
            <Box pl="18px">
                <Text textDecor="underline">Physical AR Card:</Text>
                <Text>
                    <Dot />
                    Buy AR Cards{" "}
                    <Box as="span" color="green.100" fontStyle="italic">
                        for Only $14.99 Each. (Save 50% off retail!)
                    </Box>
                </Text>
                <Text>
                    <Dot />
                    Buy 6 or More AR Cards{" "}
                    <Box as="span" color="green.100" fontStyle="italic">
                        for Only $9.99 Each. (Save over 60% off retail!)
                    </Box>
                </Text>
            </Box>
            <Box pl="18px">
                <Text textDecor="underline">Bag Tags:</Text>
                <Text>
                    <Dot />
                    $14.99 Each (Save 25% off retail!)
                </Text>
            </Box>
            <Text>
                <Dot />
                <Box as="span" fontStyle="italic">
                    Subscription Auto-Renews One Year from Date of Purchase for
                    $5.99 Per Month
                </Box>
            </Text>
        </Box>
    );
}

function Dot() {
    return (
        <Box color="green.100" as="span" pr="6px">
            •
        </Box>
    );
}
