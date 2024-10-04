import React from "react";
import { Stack, StackProps } from "@chakra-ui/react";

interface Props extends StackProps {
    row?: boolean;
    fit?: boolean;
    spaced?: boolean;
}

const SharedStack = React.forwardRef<HTMLDivElement, Props>(
    ({ row = false, fit = false, spaced = false, children, ...props }, ref) => {
        return (
            <Stack
                ref={ref}
                width={fit ? "fit-content" : "full"}
                justify={spaced && row ? "space-between" : "flex-start"}
                align={row ? "center" : "flex-start"}
                direction={row ? "row" : "column"}
                {...props}
            >
                {children}
            </Stack>
        );
    },
);

// It's a good practice to set a display name for debugging purposes
SharedStack.displayName = "SharedStack";

export default SharedStack;
