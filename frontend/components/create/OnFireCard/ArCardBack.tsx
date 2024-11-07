import { useEffect, useState, useRef } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import QRCode from "qrcode";

import CardMaskReverseImage from "@/public/card_assets/card-mask-reverse.png";
import ArCardBackgroundImage from "@/public/card_assets/ar-card-background.png";
import OnFireLogo from "@/images/logos/small-logo.png";
import TradingCardInfo from "@/hooks/TradingCardInfo";
import { CardFonts } from "../create-helpers";
import ExteriorBorder from "./ExteriorBorder";

const firstNameLeftMapper: Record<number, number> = {
    0: 40,
    1: 136,
    2: 99,
    3: 62,
    4: 48,
};

const lastNameLeftMapper: Record<number, number> = {
    0: 40,
    1: 130,
    2: 100,
    3: 84,
    4: 50,
};

const lettersThatExtend = ["F", "I", "J", "T", "U", "W"];

export default function ArCardBack({ card }: { card: TradingCardInfo }) {
    const [qrCodeData, setQrCodeData] = useState("");

    // Set up text scaling for first and last names
    const maxNameWidth = 250;
    const lastNameWidth = 230;
    const firstNameScaling = useTextScaling(card.firstName, maxNameWidth);
    const lastNameScaling = useTextScaling(card.lastName, lastNameWidth);
    const firstNameLeft = firstNameLeftMapper[card.firstName.length || 0] || 48;
    const lastNameLeft =
        (lastNameLeftMapper[card.lastName.length || 0] || 50) +
        (lettersThatExtend.includes(card.lastName.slice(-1)) ? -6 : 0);
    const lastNameTop =
        295 +
        (card.lastName.length || 0) * -3 +
        (card.firstName.length < 5 ? 16 : 0);

    useEffect(() => {
        const generateQR = async () => {
            try {
                const url = `https://onfireathletes.com/ar/${card.uuid}`;
                const qrCode = await QRCode.toDataURL(url, {
                    width: 64,
                    margin: 0,
                    errorCorrectionLevel: "H",
                    color: {
                        dark: "#000000",
                        light: "#ffffff",
                    },
                });
                setQrCodeData(qrCode);
            } catch (err) {
                console.error("Error generating QR code:", err);
            }
        };

        generateQR();
    }, [card.uuid]);

    return (
        <Flex
            mt={"200px"}
            mb="200px"
            justify="center"
            align="center"
            h="490px"
            w="350px"
            css={{
                maskImage: `url(${CardMaskReverseImage.src})`,
                maskMode: "luminance",
                maskSize: "cover",
                maskRepeat: "no-repeat",
                transformStyle: "preserve-3d",
                WebkitMaskImage: `url(${CardMaskReverseImage.src})`,
                WebkitMaskMode: "luminance",
                WebkitMaskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
            }}
            position="relative"
        >
            <Box
                h="490px"
                w="350px"
                position="absolute"
                top={0}
                left={0}
                bg={`url(${ArCardBackgroundImage.src})`}
                bgSize="cover"
            />
            <ExteriorBorder color={card.borderColor} mirrored />
            <Box
                zIndex={11}
                h="490px"
                w="350px"
                left={0}
                top={0}
                position="absolute"
            >
                <Flex
                    position="absolute"
                    flexDir="column"
                    align="center"
                    justify="center"
                    bg="black"
                    w="fit-content"
                    p={2}
                    pt={6}
                    left="50%"
                    transform={`translateX(-50%)`}
                >
                    <Image
                        src={OnFireLogo.src}
                        filter="brightness(0) invert(1)"
                        alt=""
                        w="42px"
                        h="42px"
                    />
                    <Text
                        mt={1}
                        color="white"
                        fontFamily={CardFonts.BrotherhoodSansSerif}
                    >
                        1 /{card.currentlyAvailable}
                    </Text>
                    <Image mt={2} src={qrCodeData} alt="" w="48px" h="48px" />
                </Flex>
            </Box>
            <Box position="absolute" left="0px" top="0px" h="490px" w="350px">
                <Text
                    color="rgba(0,0,0,0)"
                    ref={firstNameScaling.textRef}
                    fontFamily={CardFonts.ChakraPetch}
                    fontWeight="900"
                    textTransform="uppercase"
                    style={{
                        transform: `scale(${firstNameScaling.scale})`,
                        transformOrigin: "left",
                        whiteSpace: "nowrap",
                        // This outlines the text
                        WebkitTextStroke: "0.2px white",
                    }}
                    position="absolute"
                    left={`${firstNameLeft}px`}
                    bottom="260px"
                >
                    {card.firstName}
                </Text>
                <Text
                    color="white"
                    ref={lastNameScaling.textRef}
                    fontFamily={CardFonts.BrotherhoodSansSerif}
                    textTransform="uppercase"
                    style={{
                        transform: `scale(${lastNameScaling.scale})`,
                        transformOrigin: "left",
                        whiteSpace: "nowrap",
                    }}
                    position="absolute"
                    left={`${lastNameLeft}px`}
                    top={`${lastNameTop}px`}
                >
                    {card.lastName}
                </Text>
            </Box>
            <Flex
                flexDir="column"
                justify="flex-end"
                pos="absolute"
                right="34px"
                bottom="26px"
                fontSize="7px"
                color="white"
                textAlign="right"
                letterSpacing={"1px"}
            >
                <Text>OFFICIAL TRADING CARD OF ONFIRE ATHLETES. THIS</Text>
                <Text>CARD HAS NOT BEEN AUTHORIZED, ENDORSED, OR</Text>
                <Text>APPROVED BY ANY LICENSING BODY</Text>
            </Flex>
        </Flex>
    );
}

const useTextScaling = (text: string, targetWidth: number) => {
    const textRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        if (textRef.current) {
            // Get the original width without scaling
            const originalScale = textRef.current.style.transform;
            textRef.current.style.transform = "scale(1)";
            const originalWidth = textRef.current.offsetWidth;
            textRef.current.style.transform = originalScale;

            // Calculate and set the new scale
            const newScale = Math.min(7, targetWidth / originalWidth);
            console.log({ newScale });
            setScale(newScale);
        }
    }, [text, targetWidth]);

    return { textRef, scale };
};
