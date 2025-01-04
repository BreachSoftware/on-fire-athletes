import React from "react";
import { Image } from "@chakra-ui/react";

import TradingCardInfo from "@/hooks/TradingCardInfo";
import LogoA from "@/public/card_assets/onfire-logo-year.png";
import LogoB from "@/public/card_assets/onfire-logo-year-b.png";
import LogoA2025 from "@/public/card_assets/onfire-logo-year-2025.png";
import LogoB2025 from "@/public/card_assets/onfire-logo-year-2025-b.png";
import { zIndex } from "./helpers";

export default function OnFireLogoYear({ card }: { card: TradingCardInfo }) {
    const logo = getLogo(card);

    return (
        <Image
            pointerEvents="none"
            position="absolute"
            top={0}
            left={0}
            zIndex={zIndex.border}
            w="350px"
            h="490px"
            src={logo.src}
            alt="OnFire Logo Year"
        />
    );
}

function getLogo(card: TradingCardInfo) {
    const is2025 = new Date().getFullYear() === 2025;
    const isA = card.cardType === "a";

    const logo = is2025 ? (isA ? LogoA2025 : LogoB2025) : isA ? LogoA : LogoB;

    return logo;
}
