"use client";

import { Box, Button, Text, Flex } from "@chakra-ui/react";
import React, { useState } from "react";
import { Item } from "./page";

interface ColorItemSelectProps {
    items: Item[];
}

export default function ColorItemSelect({ items }: ColorItemSelectProps) {
    const [selectedItems, setSelectedItems] = useState<Item[]>([]);

    return (
        <Flex
            direction="column"
            backgroundColor="gray.500"
            p={4}
            borderRadius="md"
            width="fit-content"
            margin="0 auto"
        >
            <Text
                fontSize="40"
                mb={4}
                fontWeight="semibold"
                fontFamily="Barlow Condensed"
                textAlign="center"
            >
                Select Items
            </Text>
            <Box mb={4}>
                {items.map((item) => (
                    <ColorItemButton
                        key={item.id}
                        item={item}
                        selectedItems={selectedItems}
                        setSelectedItems={setSelectedItems}
                    />
                ))}
            </Box>
            {selectedItems.length > 0 && (
                <SelectedItemsText selectedItems={selectedItems} />
            )}
        </Flex>
    );
}

function ColorItemButton({
    item,
    selectedItems,
    setSelectedItems,
}: {
    item: Item;
    selectedItems: Item[];
    setSelectedItems: (items: Item[]) => void;
}) {
    const isSelected = selectedItems.includes(item);
    const handleButtonClick = (item: Item) => {
        if (isSelected) {
            setSelectedItems(
                selectedItems.filter((selected) => selected.id !== item.id),
            );
        } else {
            setSelectedItems([...selectedItems, item]);
        }
    };

    return (
        <Button
            onClick={() => handleButtonClick(item)}
            borderColor={item.color}
            backgroundColor={isSelected ? item.color : "transparent"}
            color="white"
            borderWidth="4px"
            fontWeight="semibold"
            fontFamily="Barlow Condensed"
            borderRadius="md"
            px={4}
            py={2}
            mr={2}
            mb={2}
        >
            {item.name}
        </Button>
    );
}

function SelectedItemsText({ selectedItems }: { selectedItems: Item[] }) {
    return (
        <Box textAlign="left">
            <Text
                fontSize="25"
                fontWeight="semibold"
                fontFamily="Barlow Condensed"
                color="white"
                mb={2}
            >
                Selected Items:
            </Text>
            <Text
                fontWeight="semibold"
                fontFamily="Barlow Condensed"
                color="white"
            >
                {selectedItems.map((item) => item.name).join(", ")}
            </Text>
        </Box>
    );
}
