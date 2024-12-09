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
