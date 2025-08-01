"use client";
import { Box, Flex, Spinner } from "@chakra-ui/react";
import AllStarPrice from "../checkout/components/allStarPrice";
import { useEffect, useState } from "react";
import { getCard } from "../generate_card_asset/cardFunctions";
import { getWithExpiry } from "@/components/localStorageFunctions";
import { useCurrentCheckout } from "@/hooks/useCheckout";

export default function NilPricePage() {
    const [cardObtained, setCardObtained] = useState(false);
    const { checkout, updateCheckout } = useCurrentCheckout();

    // Copied from checkout because I couldn't get it to work otherwise
    useEffect(() => {
        /**
         * Get the card information from the API
         * @param uuid - The UUID of the card
         * @param generatedBy - The user who generated the card
         * @returns The card object
         */
        async function getCardInfo(uuid: string, generatedBy: string) {
            const card = await getCard(uuid, generatedBy);
            return card;
        }

        if (!cardObtained) {
            if (typeof window !== "undefined") {
                const currentCard = getWithExpiry("cardInfo");
                if (currentCard) {
                    // Parse the current card object
                    const { uuid, generatedBy } = JSON.parse(currentCard);
                    getCardInfo(uuid, generatedBy).then((card) => {
                        setCardObtained(true);
                        // Set the card in the checkout context to assist with the checkout process
                        updateCheckout({
                            onFireCard: card,
                        });
                    });
                }
            }
        }
    });

    return (
        <Flex
            flexDir="row"
            w="full"
            minH="100dvh"
            bgGradient={
                "linear(180deg, gray.1200 0%, gray.1300 100%) 0% 0% no-repeat padding-box;"
            }
        >
            <Flex flexDir="column" flex={1}>
                <Box w="full" flex={1}>
                    {!checkout.onFireCard ? (
                        <Box
                            w="100%"
                            h="100%"
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Spinner w="150px" h="150px" />
                        </Box>
                    ) : (
                        <AllStarPrice isNil />
                    )}
                </Box>
            </Flex>
        </Flex>
    );
}
