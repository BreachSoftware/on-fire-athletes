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
        >
            <Box>
                <Text
                    fontSize="42px"
                    fontWeight="bold"
                    fontFamily="Barlow Condensed"
                    mb={4}
                >
                    Orders
                </Text>
                <Box
                    overflow="auto"
                    pt={0}
                    pb={5}
                    maxW="1400px"
                    maxH="600px"
                    mx="auto"
                    borderWidth="1px"
                    borderRadius="lg"
                    boxShadow="md"
                >
                    <OrderTable />
                </Box>
            </Box>
        </Flex>
    );
}
