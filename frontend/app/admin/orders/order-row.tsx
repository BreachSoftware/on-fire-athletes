import { Link, Tr } from "@chakra-ui/react";
import React from "react";
import { OFAOrder } from "./constants";
import { Td } from "@chakra-ui/react";

interface OrderRowProps {
    order: OFAOrder;
}

export default function OrderRow({ order }: OrderRowProps) {
    return (
        <Tr key={order.orderId}>
            <Td>{order.orderId}</Td>
            <Td>
                <Link href={order.cardImage} isExternal>
                    {order.cardImage}
                </Link>
            </Td>
            <Td>{order.cardGeneratedBy}</Td>
            <Td>{order.costPaid}</Td>
            <Td>{order.bagtagQuantity}</Td>
            <Td>{order.physicalCardQuantity}</Td>
            <Td>{order.digitalCardQuantity}</Td>
            <Td>{order.email}</Td>
            <Td>{order.phoneNumber}</Td>
            <Td>{order.receiverUuid}</Td>
            <Td>{order.senderUuid}</Td>
            <Td>{order.shippingFirstName}</Td>
            <Td>{order.shippingLastName}</Td>
            <Td>{order.address}</Td>
            <Td>{order.city}</Td>
            <Td>{order.state}</Td>
            <Td>{order.zipCode}</Td>
            <Td>{order.serialNumber}</Td>
            <Td>{order.transactionType}</Td>
            <Td>{order.payoutAmt}</Td>
            <Td>{order.sentForPrint}</Td>
            <Td>{order.poNumber}</Td>
            <Td>{order.packaged}</Td>
            <Td>{order.editCard}</Td>
            <Td>{order.downloadCardPrintFile}</Td>
            <Td>{order.downloadBagTagPrintFile}</Td>
            <Td>
                <Link
                    href={`https://onfireathletes.com/print?user=${order.cardGeneratedBy}&card=${order.orderId}`}
                    isExternal
                >
                    {order.viewPrintFile}
                </Link>
            </Td>
            <Td>{order.printShippingLabel}</Td>
        </Tr>
    );
}
