import React from "react";

import { Box, BoxProps } from "@chakra-ui/react";

export default function CardSizeBox({
    src,
    ...rest
}: { src: string | undefined } & BoxProps) {
    return (
        <Box
            pos="absolute"
            top="0"
            left="0"
            w="100%"
            h="100%"
            bgImage={src}
            backgroundSize="cover"
            pointerEvents="none"
            {...rest}
        />
    );
}
