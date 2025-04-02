import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";
import OrderTable from "./orderTable";

interface OrdersPageProps {}

export default function OrdersPage({}: OrdersPageProps) {
    return (
        <Flex
            height="100vh"
            justifyContent="center"
            alignItems="center"
            background="gray.800"
            px="124px"
            py="124px"
        >
            <Box maxW="calc(100vw - 248px)" maxH="100vh">
                <Text
                    fontSize="24px"
                    fontWeight="bold"
                    fontFamily="Barlow Condensed"
                    mb={4}
                    color="white"
                >
                    Orders
                </Text>
                <Box
                    overflow="auto"
                    pt={0}
                    pb={5}
                    h="100%"
                    w="100%"
                    borderWidth="1px"
                    borderRadius="lg"
                    boxShadow="md"
                    maxH="calc(100vh - 248px)"
                >
                    <OrderTable />
                </Box>
            </Box>
        </Flex>
    );
}
