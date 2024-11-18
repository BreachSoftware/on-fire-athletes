import { Box } from "@chakra-ui/react";

import CardOutline from "@/public/card_assets/card-outline.png";
import CardOutlineShine from "@/public/card_assets/card-outline-shine.png";

// Use this enum to determine the zIndex of the elements on the card
enum zIndex {
    background = 1,
    petch = 2,
    hero = 3,
    signature = 4,
    text = 5,
    border = 6,
    cardBackVideo = 7,
}

export default function ExteriorBorder({
    color,
    mirrored,
}: {
    color: string;
    mirrored: boolean;
}) {
    return (
        <Box
            // mirror
            transform={mirrored ? "scaleX(-1)" : "scaleX(1)"}
            position="absolute"
            zIndex={zIndex.cardBackVideo + 1}
            top={0}
            left={0}
            w="100%"
            h="100%"
            pointerEvents="none"
            userSelect="none"
        >
            <Box
                position="absolute"
                top={0}
                left={0}
                w="100%"
                h="100%"
                bg={color}
                css={{
                    maskImage: `url(${CardOutline.src})`,
                    maskSize: "cover",
                    maskRepeat: "no-repeat",
                    WebkitMaskImage: `url(${CardOutline.src})`,
                    WebkitMaskSize: "cover",
                    WebkitMaskRepeat: "no-repeat",
                }}
            />
            <Box
                pos="absolute"
                zIndex="10"
                top="0"
                left="0"
                w="100%"
                h="100%"
                bgImage={CardOutlineShine.src}
                backgroundSize="cover"
                opacity="0.25"
                pointerEvents="none"
            />
        </Box>
    );
}
