import SharedStack from "@/components/shared/wrappers/shared-stack";
import { Box, Text, Button, Image } from "@chakra-ui/react";
import Link from "next/link";
import CreditCardOptions from "@/images/misc/credit-card-options.png";
import GameCoin from "@/images/misc/game-coin-logo.png";

export default function GamecoinCard() {
    return (
        <SharedStack
            spacing={5}
            alignSelf="stretch"
            color="white"
            bg="gray.1000"
            borderRadius="13px"
            px="60px"
            py="40px"
            boxShadow="0 0 16px #27CE00"
            maxW="580px"
        >
            {/* Header */}
            <Text
                fontSize="42px"
                textTransform="uppercase"
                fontFamily="Brotherhood, Regular"
                letterSpacing="0.84px"
            >
                Payment Options
            </Text>
            <GreenDivider />

            {/* Game Coin Section */}
            <Box>
                <GCLabel>
                    GMEX (OFFICIAL CRYPTO TOKEN OF ONFIRE ATHLETES)
                </GCLabel>
                <Image src={GameCoin.src} alt="Game Coin" w="180px" />
            </Box>

            {/* Discount Section */}
            <Box>
                <GCLabel>DISCOUNT</GCLabel>
                <GCText>20% Discount on All Purchases</GCText>
            </Box>

            {/* Benefits Section */}
            <Box>
                <GCLabel>BENEFIT TO GAME COIN (GMEX) TOKEN HOLDERS</GCLabel>
                <GCText>
                    2% of all GMEX transaction is distributed among all token
                    holders.
                </GCText>
            </Box>
            <GCText>
                5% of every transaction is distributed to a charity wallet to
                support underserved athletes, teams, and communities.
            </GCText>

            <GreenDivider />

            {/* Credit Card Section */}
            <Box>
                <GCLabel>CREDIT CARD</GCLabel>
                <Image src={CreditCardOptions.src} alt="Credit Card Options" />
            </Box>
            <Box>
                <GCLabel>DISCOUNT</GCLabel>
                <GCText>No Discount</GCText>
            </Box>
            <Box>
                <GCLabel>BENEFIT TO GAME COIN (GMEX) TOKEN HOLDERS</GCLabel>
                <GCText>
                    20% of gross sales are used to purchase Game Coin (GMEX)
                    tokens and those tokens are then burned.
                </GCText>
            </Box>

            <GreenDivider />

            {/* CTA Button */}
            <Link href="/faq?category=Gamecoin">
                <Button
                    variant="next"
                    fontSize="14px"
                    fontFamily="Barlow"
                    fontWeight="medium"
                    letterSpacing="2px"
                    maxW="120%"
                >
                    LEARN MORE ABOUT GAME COIN (GMEX)
                </Button>
            </Link>

            {/* Footer Text */}
            <Text fontSize="16px" fontWeight="medium" fontFamily="Barlow">
                Game Coin (GMEX) can be purchased on Bitmart and Pancake Swap.
            </Text>
        </SharedStack>
    );
}

function GCLabel({ children }: { children: React.ReactNode }) {
    return (
        <Text
            color="green.200"
            fontWeight="semibold"
            fontSize="16px"
            fontFamily="Barlow Semi Condensed"
            letterSpacing="0.32px"
        >
            {children}
        </Text>
    );
}

function GCText({ children }: { children: React.ReactNode }) {
    return (
        <Text fontSize="14px" fontWeight="medium" fontFamily="Barlow">
            {children}
        </Text>
    );
}

function GreenDivider() {
    return <Box h="2px" w="full" bg="green.200" />;
}
