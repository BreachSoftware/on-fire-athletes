import React, { CSSProperties } from "react";
import { Text, TextProps } from "@chakra-ui/react";

import TradingCardInfo from "@/hooks/TradingCardInfo";
import { zIndex } from "./helpers";

/**
 * The BigTextB function to render the first and last name in big text for cardType B
 * @returns the component to render the first and last name in big text for cardType B
 */
export default function BigTextB({
    curCard,
    letterSpacing,
}: {
    curCard: TradingCardInfo;
    letterSpacing: number;
}) {
    const textAttributes: TextProps = {
        zIndex: zIndex.text,
        position: "absolute",
        top: "334px",
        left: "42px",
        fontFamily: curCard.nameFont,
        fontSize: "55px",
    };

    const nameSolidStyle: CSSProperties = {
        color: curCard.nameColor,
        pointerEvents: "none",
        WebkitTextStrokeWidth: "1.75px",
        WebkitTextStrokeColor: "transparent",
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        letterSpacing: `${letterSpacing}px`,
    };

    const nameOutlineStyle: CSSProperties = {
        color: "transparent",
        pointerEvents: "none",
        WebkitTextStrokeWidth: "1px",
        WebkitTextStrokeColor: curCard.nameColor,
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        letterSpacing: `${letterSpacing}px`,
    };

    return (
        <>
            <Text
                {...textAttributes}
                style={
                    curCard.firstNameSolid ? nameSolidStyle : nameOutlineStyle
                }
                transition={
                    "color 0.5s ease-in-out, " +
                    "-webkit-text-stroke-color 0.5s ease-in-out, " +
                    "-webkit-text-stroke-width 0.5s ease-in-out"
                }
            >
                {curCard.nameFont.includes("Brotherhood")
                    ? curCard.firstName.toUpperCase().replaceAll("I", "i")
                    : curCard.firstName.toUpperCase()}
            </Text>
            <Text
                {...textAttributes}
                top={"385px"}
                style={
                    curCard.lastNameSolid ? nameSolidStyle : nameOutlineStyle
                }
                transition={
                    "color 0.5s ease-in-out, " +
                    "-webkit-text-stroke-color 0.5s ease-in-out, " +
                    "-webkit-text-stroke-width 0.5s ease-in-out"
                }
            >
                {curCard.nameFont.includes("Brotherhood")
                    ? curCard.lastName.toUpperCase().replaceAll("I", "i")
                    : curCard.lastName.toUpperCase()}
            </Text>
        </>
    );
}
