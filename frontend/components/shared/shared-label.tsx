import { Text, TextProps } from "@chakra-ui/react";
import React from "react";

const SharedLabel: React.FC<TextProps> = ({ children, ...props }) => {
    return (
        <Text fontSize="14px" color="navy.700" fontWeight="semibold" {...props}>
            {children}
        </Text>
    );
};

export default SharedLabel;
