import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import { Item } from "./page";

interface ColorItemProps {
    item: Item;
}

export default function ColorItem({ item }: ColorItemProps) {
    return (
        <Flex
            backgroundColor={item.color}
            padding={2}
            borderRadius="md"
            display="inline-block"
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
    );
}
