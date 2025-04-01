import { Checkbox, CheckboxProps } from "@chakra-ui/react";
import React from "react";

export default function CheckboxButton({
    isChecked,
    children,
    ...props
}: CheckboxProps) {
    return (
        <Checkbox
            border="1px solid"
            borderColor={isChecked ? "brand.500" : "gray.200"}
            px={3}
            py={2}
            rounded="md"
            isChecked={isChecked}
            bg={isChecked ? "brand.50" : "initial"}
            colorScheme="brand"
            transition="0.1s"
            fontWeight="semibold"
            whiteSpace="nowrap"
            {...props}
        >
            {children}
        </Checkbox>
    );
}
