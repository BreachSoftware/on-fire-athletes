"use client";
import React, { useState, useEffect } from "react";
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    TableColumnHeaderProps,
} from "@chakra-ui/react";
import OrderRow from "./order-row";
import { ORDER_TABLE_HEADERS } from "./constants";
import { apiEndpoints } from "@backend/EnvironmentManager/EnvironmentManager";
import { OFAOrder } from "@/types/order.types";

interface OrderTableProps {}

export default function OrderTable({}: OrderTableProps) {
    const [orders, setOrders] = useState<OFAOrder[]>([]);

    const apiUrl = new URL(apiEndpoints.getAllOrders());

    useEffect(() => {
        fetch(apiUrl.toString())
            .then((res) => res.json())
            .then((data) => {
                console.log("orders length: ", data.length);
                setOrders(data as OFAOrder[]);
            });
    }, []);

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
                {/* {orders.map((order) => (
                    <Text key={order.orderId}>{order.orderId}</Text>
                ))} */}
                {orders.map((order) => (
                    <OrderRow key={order.uuid} order={order} />
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
        whiteSpace: "nowrap",
        ...rest,
    };

    return <Th {...thStyles}>{children}</Th>;
}
