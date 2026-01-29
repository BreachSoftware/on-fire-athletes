"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import ColorItemSelect from "./ColorItemSelect";
import ColorItemBox from "./ColorItemBox";
import ColorItem from "./ColorItem";
import { ColorItemProvider } from "./ColorItemProvider"; // Import the ColorItemProvider

export type Item = {
    id: string;
    name: string;
    color: string;
};

const items: Item[] = [
    {
        id: "1",
        name: "First Item",
        color: "blue",
    },
    {
        id: "2",
        name: "Second Item",
        color: "red",
    },
    {
        id: "3",
        name: "Third Item",
        color: "green",
    },
];

export default function RyanPage() {
    return (
        <ColorItemProvider items={items}>
            <Box>
                <Text
                    align="center"
                    fontSize="60"
                    fontWeight="semibold"
                    fontFamily="Barlow Condensed"
                    color="white"
                >
                    Ryan Page
                </Text>
                <Box alignSelf="flex-start" mb={8}>
                    <ColorItemBox items={items} />
                </Box>
                <Flex direction="column" align="center" justify="center" mt={8}>
                    <Flex mb={8} justifyContent="center">
                        {items.map((item) => (
                            <ColorItem key={item.id} item={item} />
                        ))}
                    </Flex>

                    <ColorItemSelect items={items} />
                </Flex>
            </Box>
        </ColorItemProvider>
    );
}
