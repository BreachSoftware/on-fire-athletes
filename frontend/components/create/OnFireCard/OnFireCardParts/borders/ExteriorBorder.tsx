import React from "react";

import CardSizeBox from "@/components/create/OnFireCard/shared/CardSizeBox";
import CardOutline from "@/components/create/OnFireCard/shared/CardOutline";
import CardOutlineShine from "@/public/card_assets/card-outline-shine.png";
import { zIndex } from "@/components/create/OnFireCard/OnFireCardParts/helpers";

export default function ExteriorBorder({
    color,
    back = false,
}: {
    color: string;
    back?: boolean;
}) {
    return (
        <CardSizeBox
            display="flex"
            justifyContent="center"
            alignItems="center"
            src={undefined}
        >
            <CardSizeBox
                zIndex={back ? zIndex.cardBackVideo + 1 : zIndex.border}
                transform={back ? "scaleX(-1)" : "scaleX(1)"}
                src={undefined}
                display="flex"
                justifyContent="center"
                alignItems="center"
                width="351px"
                height="491px"
            >
                <CardOutline width="100%" height="100%" fill={color} />
            </CardSizeBox>
        </CardSizeBox>
    );
}

export function ExteriorBorderShine({ back = false }: { back?: boolean }) {
    return (
        <CardSizeBox
            src={CardOutlineShine.src}
            zIndex={back ? zIndex.cardBackVideo + 1 : zIndex.border}
            opacity={0.25}
            transform={back ? "scaleX(-1)" : "scaleX(1)"}
        />
    );
}
