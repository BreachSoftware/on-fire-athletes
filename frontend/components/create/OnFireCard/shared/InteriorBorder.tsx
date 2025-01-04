import React from "react";

import CardSizeBox from "./CardSizeBox";
import CardInteriorBorderA from "../OnFireCardParts/borders/CardInteriorBorderA";
import CardInteriorBorderB from "../OnFireCardParts/borders/CardInteriorBorderB";
import { zIndex } from "../OnFireCardParts/helpers";

export default function InteriorBorder({
    color,
    cardType,
}: {
    color: string;
    cardType: "a" | "b";
}) {
    return (
        <CardSizeBox
            src={undefined}
            zIndex={zIndex.border}
            width="351px"
            height="491px"
        >
            {cardType === "a" ? (
                <CardInteriorBorderA width="100%" height="100%" fill={color} />
            ) : (
                <CardInteriorBorderB width="100%" height="100%" fill={color} />
            )}
        </CardSizeBox>
    );
}
