import React from "react";
import { Text, TextProps } from "@chakra-ui/react";
import TradingCardInfo from "@/hooks/TradingCardInfo";
import { motion } from "framer-motion";
import { zIndex } from "./helpers";

/**
 * The Number text to render for cardType B
 * @returns the component to render the number text in its proper position
 */
export default function NumberTextB({
    card,
    ...rest
}: { card: TradingCardInfo } & TextProps) {
    return (
        <Text
            as={motion.div}
            zIndex={zIndex.text}
            position="absolute"
            top={"319px"}
            left={"42px"}
            fontFamily={"'Barlow', sans-serif;"}
            fontWeight={"500"}
            textAlign={"center"}
            fontSize={"21px"}
            letterSpacing={"-1.5px"}
            transition={"color 0.5s ease-in-out"}
            style={{
                color: card.numberColor,
                pointerEvents: "none",
            }}
            {...rest}
        >
            {typeof card !== "undefined"
                ? card.number !== ""
                    ? `#${card.number}`
                    : null
                : null}
        </Text>
    );
}
