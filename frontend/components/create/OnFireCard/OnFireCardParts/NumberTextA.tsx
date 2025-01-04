import React from "react";
import { Text, TextProps } from "@chakra-ui/react";
import TradingCardInfo from "@/hooks/TradingCardInfo";
import { motion } from "framer-motion";
import { zIndex } from "./helpers";

/**
 * The Number text to render for cardType A
 * @returns the component to render the number text in its proper position
 */
export default function NumberTextA({
    card,
    ...rest
}: { card: TradingCardInfo } & TextProps) {
    return (
        <Text
            as={motion.div}
            zIndex={zIndex.text}
            position="absolute"
            top={"440px"}
            left={"15px"}
            width={"50px"}
            fontFamily={"'Barlow', sans-serif;"}
            fontWeight={"600"}
            textAlign={"center"}
            fontSize={"21px"}
            transition={"color 0.5s ease-in-out"}
            style={{
                color: card.numberColor,
                pointerEvents: "none",
            }}
            {...rest}
        >
            {typeof card !== "undefined"
                ? card.number !== ""
                    ? `#${card.number.substring(0, 2)}`
                    : null
                : null}
        </Text>
    );
}
