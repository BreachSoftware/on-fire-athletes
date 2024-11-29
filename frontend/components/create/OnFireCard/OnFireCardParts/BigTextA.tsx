import React, { CSSProperties } from "react";
import { HStack, Text, TextProps } from "@chakra-ui/react";

import { CardFonts } from "@/components/create/create-helpers";
import TradingCardInfo from "@/hooks/TradingCardInfo";
import { zIndex } from "./helpers";

/**
 * The BigTextA function to render the first and last name in big text for cardType A
 * @returns the component to render the first and last name in big text
 */
export default function BigTextA({
    curCard,
    letterSpacing,
}: {
    curCard: TradingCardInfo;
    letterSpacing: number;
}) {
    const textAttributes: TextProps = {
        fontFamily: CardFonts.UniserBold,
        fontSize: "45px",
        letterSpacing: `${letterSpacing}px`,
        color: curCard.nameColor,
        transition:
            "color 0.5s ease-in-out, " +
            "-webkit-text-stroke-color 0.5s ease-in-out, " +
            "-webkit-text-stroke-width 0.5s ease-in-out",
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
        <HStack
            style={{
                transform: "rotate(-90deg)",
                transformOrigin: "0 0",
            }}
            zIndex={zIndex.text}
            position="absolute"
            top={"436px"} // Higher = More Down
            left={"10px"} // Higher = More Right
        >
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
                {curCard.firstName.toUpperCase()}
            </Text>
            <Text
                {...textAttributes}
                style={
                    curCard.lastNameSolid ? nameSolidStyle : nameOutlineStyle
                }
                transition={
                    "color 0.5s ease-in-out, " +
                    "-webkit-text-stroke-color 0.5s ease-in-out, " +
                    "-webkit-text-stroke-width 0.5s ease-in-out"
                }
            >
                {curCard.lastName.toUpperCase()}
            </Text>
        </HStack>
    );
}
