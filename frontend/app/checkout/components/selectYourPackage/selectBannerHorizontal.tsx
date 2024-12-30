import { Box, Center, Circle, Flex, Text } from "@chakra-ui/react";

export default function SelectBanner({ isSelected }: { isSelected: boolean }) {
    return (
        <>
            <Box display={{ base: "block", xl: "none" }} h="41px" w="100%" />
            <Flex
                display={{ base: "flex", xl: "none" }}
                justify="center"
                align="center"
                bg={isSelected ? "#27CE01" : "#27CE0140"}
                flexDir="row"
                pos="absolute"
                bottom="0"
                left="0"
                w="100%"
                h="41px"
                gap="12px"
            >
                <Center pos="relative" boxSize="16px">
                    <Circle
                        pos="absolute"
                        top="50%"
                        left="50%"
                        transform="translate(-50%, -50%)"
                        size="16px"
                        bg="#6C6C6C"
                        opacity={0.28}
                        border="2px solid white"
                    />
                    <Circle
                        pos="absolute"
                        top="50%"
                        left="50%"
                        transform="translate(-50%, -50%)"
                        size="10px"
                        bg={isSelected ? "white" : "#27CE01"}
                        boxShadow={isSelected ? "0px 0px 6px #27CE00" : "none"}
                    />
                </Center>
                {/* "Select" text, written vertically */}
                <Text
                    fontFamily="Barlow Condensed"
                    color="white"
                    fontSize="20px"
                    fontWeight="400"
                    letterSpacing="1px"
                >
                    SELECT
                </Text>
            </Flex>
        </>
    );
}
