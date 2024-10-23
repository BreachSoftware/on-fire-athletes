import { Box, Flex } from "@chakra-ui/layout";
import CreateCardArray from "@/images/backgrounds/create-card-array.png";

export default function CreateBackground() {
    return (
        <Flex
            direction="column"
            position="absolute"
            top={0}
            left={0}
            right={0}
            bg="black"
            minH="100vh"
            h="100%"
        >
            {/* Top Background Image */}
            <Box
                bgImage={CreateCardArray.src}
                bgPosition="center"
                bgRepeat="no-repeat"
                filter={"grayscale(0%)"}
                bgSize="cover"
                bgPos="60% 40%"
                h={{ base: "65vh", lg: "47%", xl: "47%", "2xl": "500px" }}
                w="full"
            >
                <Box
                    bgGradient="linear(#000C, #17760BC3, #058D05C3)"
                    h="100%"
                    w="100%"
                />
            </Box>
            {/* Bottom Part of the Background */}
            <Box
                bgGradient={
                    "linear(180deg, gray.1200 0%, gray.1300 100%) 0% 0% no-repeat padding-box;"
                }
                flex={1}
                w="full"
                h="100%"
            />
        </Flex>
    );
}
