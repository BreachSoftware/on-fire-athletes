import React from "react";
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    TableColumnHeaderProps,
} from "@chakra-ui/react";
import { orderData } from "./orderData";
import OrderRow from "./order-row";
import { ORDER_TABLE_HEADERS } from "./constants";

interface OrderTableProps {}

export default function OrdersPage({}: OrderTableProps) {
    return (
        <Table variant="simple" background="gray.800">
            <Thead>
                <Tr>
                    {ORDER_TABLE_HEADERS.map((header) => (
                        <OrderTableTh key={header.label} {...header.style}>
                            {header.label}
                        </OrderTableTh>
                    ))}
                </Tr>
            </Thead>
            <Tbody>
                {orderData.map((order) => (
                    <OrderRow key={order.orderId} order={order} />
                ))}
            </Tbody>
        </Table>
    );
}

function OrderTableTh({ children, ...rest }: TableColumnHeaderProps) {
    const thStyles: TableColumnHeaderProps = {
        fontSize: { base: "16px", "2xl": "16px" },
        color: "green.100",
        fontStyle: "italic",
        fontWeight: "semibold",
        fontFamily: "Barlow Condensed",
        w: "full",
        position: "sticky" as const,
        top: 0,
        zIndex: 1,
        background: "gray.800",
        ...rest,
    };

    return <Th {...thStyles}>{children}</Th>;
}
