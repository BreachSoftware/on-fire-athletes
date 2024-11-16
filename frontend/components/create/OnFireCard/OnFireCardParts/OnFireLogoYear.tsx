import React from "react";
import { Image } from "@chakra-ui/react";

import TradingCardInfo from "@/hooks/TradingCardInfo";
import LogoA from "@/public/card_assets/onfire-logo-year.png";
import LogoB from "@/public/card_assets/onfire-logo-year-b.png";
import { zIndex } from "./helpers";

export default function OnFireLogoYear({ card }: { card: TradingCardInfo }) {
    const logo = card.cardType === "a" ? LogoA : LogoB;

    return (
        <Image
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
