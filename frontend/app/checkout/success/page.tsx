"use client";
import { Flex, Spinner, Text } from "@chakra-ui/react";
import OrderCompleteContent from "../components/orderCompleteContent";
import NavBar from "@/app/navbar";
import { retrievePaymentStatus } from "@/app/lockerroom/components/retrievePaymentStatus";
import TradingCardInfo, { PaymentStatus } from "@/hooks/TradingCardInfo";
import { updatePaymentStatus } from "@/app/lockerroom/components/updatePaymentStatus";
import { useEffect, useState } from "react";
import { useDisconnect } from "wagmi";

/**
 * @file This file contains the successful card creation page.
 * @returns {JSX.Element} The successful card creation page.
 */
export default function SuccessfulCardCreationPage() {
    const [cardSuccessfullyCreated, setCardSuccessfullyCreated] =
        useState(false);
    const [uuid, setUuid] = useState("");
    const [generatedBy, setGeneratedBy] = useState("");
    const [buyingOtherCard, setBuyingOtherCard] = useState(false);

    const { disconnect } = useDisconnect();

    /**
     * This function checks to see if the user just submitted a card.
     * If the user just submitted a card, the payment status will checked and updated accordingly.
     */
    async function checkForSubmittedCard() {
        if (typeof window !== "undefined") {
            const queryParams = new URLSearchParams(window.location.search);
            const paymentBypassed =
                queryParams.get("paymentBypassed") === "true";
            const paymentIntentID = queryParams.get("payment_intent");
            const boughtOtherCard = queryParams.get("boughtOtherCard");
            const boughtWithGMEX = queryParams.get("paymentWithGMEX");
            if (paymentIntentID || paymentBypassed) {
                const status = paymentBypassed
                    ? "succeeded"
                    : await retrievePaymentStatus(paymentIntentID);
                if (status === "succeeded") {
                    // Load the card and update the payment status
                    const { uuid, generatedBy } = TradingCardInfo.loadCard();
                    if (boughtOtherCard) {
                        setBuyingOtherCard(true);
                    }
                    // If the user bought another user's card, don't update the payment status
                    if (!boughtOtherCard) {
                        await updatePaymentStatus(
                            generatedBy,
                            uuid,
                            PaymentStatus.SUCCESS,
                        );
                    }
                    // Clear the card
                    TradingCardInfo.clearCard();

                    setUuid(uuid);
                    setGeneratedBy(generatedBy);
                    setCardSuccessfullyCreated(true);
                } else {
                    console.error(`Payment status is: ${status}`);
                }
                // Remove query parameters from the URL
                window.history.replaceState(
                    {},
                    document.title,
                    window.location.pathname,
                );
            } else if (boughtWithGMEX) {
                const { uuid, generatedBy } = TradingCardInfo.loadCard();
                if (boughtOtherCard) {
                    setBuyingOtherCard(true);
                }
                if (!boughtOtherCard) {
                    await updatePaymentStatus(
                        generatedBy,
                        uuid,
                        PaymentStatus.SUCCESS,
                    );
                }
                TradingCardInfo.clearCard();
                disconnect();
                setUuid(uuid);
                setGeneratedBy(generatedBy);
                setCardSuccessfullyCreated(true);
                // Remove query parameters from the URL
                window.history.replaceState(
                    {},
                    document.title,
                    window.location.pathname,
                );
            }
        }
    }

    useEffect(() => {
        checkForSubmittedCard();
    }, []);

    return (
        <Flex
            flexDir="column"
            h="100dvh"
            w="100dvw"
            bgGradient={
                "linear(180deg, gray.1200 0%, gray.1300 100%) 0% 0% no-repeat padding-box;"
            }
            align="center"
        >
            <Flex w="100%" direction={"column"}>
                <NavBar />
            </Flex>

            {cardSuccessfullyCreated ? (
                <Flex
                    w="100%"
                    h="100%"
                    justifyContent={"space-around"}
                    direction={{ base: "column", sm: "row" }}
                    alignItems="center"
                    padding="90px"
                    marginTop={{ base: "0px", lg: "-50px" }}
                >
                    <Flex
                        h="100%"
                        alignItems="center"
                        fontSize="3xl"
                        fontWeight="bold"
                        color="white"
                    >
                        <OrderCompleteContent
                            cardUUID={uuid}
                            generatedByUUID={generatedBy}
                            buyingOtherCard={buyingOtherCard}
                        />
                    </Flex>
                </Flex>
            ) : (
                // Display a spinner while the serialized cards are being created
                <Flex
                    w="full"
                    h="full"
                    justifyContent={"center"}
                    alignItems={"center"}
                    flexDirection={"column"}
                    gap="50px"
                >
                    <Spinner
                        color="white"
                        w="150px"
                        h="150px"
                        speed={"0.75s"}
                    />
                    <Text color={"white"} fontSize={"24px"} fontWeight={"bold"}>
                        Finalizing your card purchase...
                    </Text>
                </Flex>
            )}
        </Flex>
    );
}
