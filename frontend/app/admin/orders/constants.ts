import { TableColumnHeaderProps } from "@chakra-ui/react";

export const ORDER_TABLE_HEADERS: {
    label: string;
    style?: TableColumnHeaderProps;
}[] = [
    { label: "Transaction Time" },
    { label: "Card Image" },
    { label: "Serial Number" },
    { label: "Sent for Print" },
    { label: "PO Number" },
    { label: "Packaged" },
    { label: "Download Card Print File" },
    { label: "Download Bag Tag Print File" },
    { label: "View Print File" },
    { label: "Cost Paid" },
    { label: "Coupon Used" },
    { label: "Bagtag Quantity" },
    { label: "Physical Card Quantity" },
    { label: "Digital Card Quantity" },
    { label: "Email" },
    { label: "Phone Number", style: { minWidth: "200px" } },
    { label: "Shipping First Name" },
    { label: "Shipping Last Name" },
    { label: "Address", style: { minWidth: "200px" } },
    { label: "City" },
    { label: "State" },
    { label: "Zip Code" },
    { label: "Print Shipping Label" },
    { label: "Order ID" },
    { label: "Card UUID" },
    { label: "Generated By" },
    { label: "Receiver UUID" },
    { label: "Sender UUID" },
    { label: "Payout Amt" },
    { label: "Edit Card" },
];
