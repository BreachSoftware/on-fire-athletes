import { Box, Flex, Text } from "@chakra-ui/react";
import ColorItemSelect from "./ColorItemSelect";
import ColorItemBox from "./ColorItemBox";
import ColorItem from "./ColorItem";

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
    );
}
import { Box, Text } from "@chakra-ui/react";

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
        <Box>
            <Text>Ryan Page</Text>
            {/* Write component that accepts a single Item and shows it's name with it's color */}

            {/* Write component that accepts any number of Items and displays the name and color in a box */}

            {/* 
                Write component that shows clickable options for each item and displays the selected item's names
                It should keep track of the selected items and allow for deselection.
            */}
        </Box>
    );
}
