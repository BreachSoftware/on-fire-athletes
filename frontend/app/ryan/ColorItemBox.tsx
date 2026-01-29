import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { Item } from "./page";

interface ColorItemBoxProps {
    items: Item[];
}

export default function ColorItemBox({ items }: ColorItemBoxProps) {
    return (
        <Box
            backgroundColor="gray.500"
            borderColor="white"
            padding={3}
            margin={2}
            borderRadius="md"
            display="inline-block"
        >
            <Text
                color="white"
                fontWeight="semibold"
                fontFamily="Barlow Condensed"
                fontSize={24}
            >
                All Items:
            </Text>
            {items.map((item) => (
                <Flex
                    key={item.id}
                    backgroundColor={item.color}
                    padding={2}
                    borderRadius="md"
                    display="block"
                    margin={2}
                >
                    <Text
                        color="white"
                        fontWeight="semibold"
                        fontFamily="Barlow Condensed"
                    >
                        {item.name}
                    </Text>
                </Flex>
            ))}
        </Box>
    );
}
