"use client";
import { Link, Tr } from "@chakra-ui/react";
import React, { useState } from "react";
import { OFAOrder } from "@/types/order.types";
import { Td } from "@chakra-ui/react";
import { apiEndpoints } from "@backend/EnvironmentManager/EnvironmentManager";
import { useToastFeedback } from "@/hooks/use-toast-feedback";
import CheckboxButton from "./checkbox-button";
import { formatCents, formatDate } from "@/utils/utils";

interface OrderRowProps {
    order: OFAOrder;
}

export default function OrderRow({ order }: OrderRowProps) {
    const [sentForPrint, setSentForPrint] = useState<boolean>(
        order.is_sent_for_print ?? false,
    );
    const [isPackaged, setIsPackaged] = useState<boolean>(
        order.is_packaged ?? false,
    );

    const { onCompleted, onError } = useToastFeedback(
        "Order updated successfully",
        "Order update failed",
    );

    async function updateOrder(orderUpdate: Partial<OFAOrder>) {
        const response = await fetch(apiEndpoints.updateOrder(), {
            method: "POST",
            body: JSON.stringify({
                uuid: order.uuid,
                card_uuid: order.card_uuid,
                ...orderUpdate,
            }),
        });

        if (!response.ok) {
            onError();
        } else {
            const newOrder = (await response.json()).Item;

            setSentForPrint(newOrder.is_sent_for_print ?? false);
            setIsPackaged(newOrder.is_packaged ?? false);
            onCompleted();
        }
    }

    return (
        <Tr key={order.uuid} color="white">
            <Td>
                {formatDate(order.transaction_time, "M/d/yyyy")}
                <br />
                {formatDate(order.transaction_time, "h:mm a")}
            </Td>

            <Td whiteSpace="nowrap" textDecor="underline">
                <Link
                    href={`https://onfireathletes.com/print?user=${order.card_generatedBy}&card=${order.card_uuid}`}
                    isExternal
                >
                    View Card
                </Link>
            </Td>
            {/* Serial number */}
            <MaybeMissingTd>{order.serial_number || "--"}</MaybeMissingTd>
            {/* Sent for print */}
            <Td>
                <CheckboxButton
                    isChecked={sentForPrint}
                    onChange={(e) => {
                        updateOrder({ is_sent_for_print: e.target.checked });
                    }}
                    colorScheme="green"
                    _checked={{
                        color: "green.100",
                        bg: "green.900",
                    }}
                >
                    Sent for print?
                </CheckboxButton>
            </Td>
            {/* PO number */}
            <Td>{"N/A"}</Td>
            {/* Packaged */}
            <Td>
                <CheckboxButton
                    isChecked={isPackaged}
                    onChange={(e) => {
                        updateOrder({ is_packaged: e.target.checked });
                    }}
                    colorScheme="green"
                    _checked={{
                        color: "green.100",
                        bg: "green.900",
                    }}
                >
                    Packaged?
                </CheckboxButton>
            </Td>
            <Td>Download Print File</Td>
            <Td>Download Bag Tag Print File</Td>
            <Td>
                <Link
                    href={`https://onfireathletes.com/print?user=${order.card_generatedBy}&card=${order.card_uuid}`}
                    isExternal
                >
                    View Print File
                </Link>
            </Td>
            <Td>{formatCents(order.cost_paid ?? 0)}</Td>
            <MaybeMissingTd>{order.coupon_used || "--"}</MaybeMissingTd>
            <Td>{order.bagTagQuantity ?? 0}</Td>
            <Td>{order.physicalCardQuantity ?? 0}</Td>
            <Td>{order.digitalCardQuantity ?? 0}</Td>
            <Td>{order.email}</Td>
            <Td>{order.phone_number}</Td>

            <Td>{order.shipping_firstName}</Td>
            <Td>{order.shipping_lastName}</Td>
            <Td>{order.address}</Td>
            <Td>{order.city}</Td>
            <Td>{order.state}</Td>
            <Td>{order.zip_code}</Td>
            <Td>N/A</Td>
            <Td whiteSpace="nowrap">{order.uuid}</Td>
            <Td whiteSpace="nowrap">
                <Link href={order.card_uuid} isExternal>
                    {order.card_uuid}
                </Link>
            </Td>
            <Td whiteSpace="nowrap">{order.card_generatedBy}</Td>
            <Td whiteSpace="nowrap">{order.receiver_uuid}</Td>
            <Td whiteSpace="nowrap">{order.sender_uuid}</Td>
            {/* Payout amount */}
            <Td>{"N/A"}</Td>
            <Td>N/A</Td>
        </Tr>
    );
}

function MaybeMissingTd({ children }: { children: React.ReactNode }) {
    const isMissing =
        children === "N/A" || children === "--" || children === null;

    return <Td color={isMissing ? "gray.300" : "white"}>{children}</Td>;
}
