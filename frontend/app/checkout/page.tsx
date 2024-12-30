"use client";
import React from "react";

import { Box, Flex, Grid, GridItem, Spinner, VStack } from "@chakra-ui/react";
import NavBar from "../navbar";
import Sidebar from "@/components/sidebar";
import CheckoutHeader from "./components/checkoutHeader";
import CheckoutItemsInCart from "./components/checkoutItemsInCart";
import { useCurrentCheckout } from "@/hooks/useCheckout";
import CheckoutStepWrapper from "./components/checkoutStepWrapper";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { getWithExpiry } from "@/components/localStorageFunctions";
import SelectYourPackage from "./components/selectYourPackageOld";
import AllStarPrice from "./components/allStarPrice";
import { getCard } from "../generate_card_asset/cardFunctions";
import TradingCardInfo from "@/hooks/TradingCardInfo";
import { useTransferContext } from "@/hooks/useTransfer";
import "../../node_modules/@rainbow-me/rainbowkit/dist/index.css";
import { darkTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";

// OnFire keys
const STRIPE_PUBLIC_KEY =
    process.env.NEXT_PUBLIC_STRIPE_PK ||
    "pk_live_51PssXyCEBFOTy6pM9DfyGbI7JZUqMoClqRVuFCEAVamp10DYl2O48SqCjiw7vSbeiv8CCmYPZwSgguOTCcJzbY0u00cwKkUFDZ";
/**
 * The Checkout page when purchasing a card
 * @returns JSX.Element
 */
export default function CheckoutPage() {
    const [onFireCard, setOnFireCard] = useState<TradingCardInfo | null>(null);
    const [cardObtained, setCardObtained] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    const [buyingOtherCard, setBuyingOtherCard] = useState(false);

    // Game Coin integration
    const [cryptoWalletConnected, setCryptoWalletConnected] = useState(false);
    const transferContext = useTransferContext();

    // To be set by the hook's step number
    // Default value should be false. It stays true for development purposes

    const co = useCurrentCheckout();

    const checkout = co.checkout;
    const checkoutStep = checkout.stepNum;

    const itemsInCart = checkout.cart;

    const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);
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
                        setOnFireCard(card);
                        setCardObtained(true);
                        // Set the card in the checkout context to assist with the checkout process
                        co.setCheckout({
                            ...checkout,
                            onFireCard: card,
                        });
                    });
                }
            }
        }
    });

    // This useEffect is used to check if the user is buying a card from another user
    useEffect(() => {
        if (window !== undefined) {
            const queryParams = new URLSearchParams(window.location.search);
            const buyingOtherCard = queryParams.get("buyingOtherCard");

            if (buyingOtherCard) {
                setBuyingOtherCard(true);
                if (!onFireCard) {
                    setShowSpinner(true);
                } else {
                    const digitalAddOn = {
                        title: `${onFireCard.firstName} ${onFireCard.lastName} Digital Card`,
                        card: onFireCard,
                        numberOfCards: 1,
                        numberOfOrders: 1,
                        price: onFireCard?.price || 0,
                    };

                    const physicalAddOn = {
                        title: `${onFireCard.firstName} ${onFireCard.lastName} Physical Card`,
                        card: onFireCard,
                        numberOfCards: 1,
                        numberOfOrders: 1,
                        price: 0,
                    };

                    co.setCheckout({
                        ...checkout,
                        stepNum: 2,
                        packageName: null,
                        digitalCardPrice: onFireCard.price,
                        digitalCardCount: 1,
                        physicalCardPrice: 0,
                        physicalCardCount: 1,
                        cart: [digitalAddOn, physicalAddOn].filter((item) => {
                            return item !== null;
                        }),
                    });
                    setShowSpinner(false);
                }
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onFireCard]);

    useEffect(() => {
        if (checkoutStep === 0 && !buyingOtherCard) {
            co.setCheckout({
                ...checkout,
                cart: [],
                physicalCardCount: 0,
                digitalCardCount: 0,
                cardPrice: "",
            });
        }
        // I disabled this because we only want this to run when the checkoutStep changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checkoutStep, buyingOtherCard]);

    // This useEffect is used to set the cart items when the user is not buying a card from another user
    useEffect(() => {
        if (checkoutStep === 2 && !buyingOtherCard) {
            let formalPackageName = "";
            if (co.checkout.packageName) {
                switch (co.checkout.packageName) {
                    case "rookie":
                        formalPackageName = "Rookie";
                        break;
                    case "allStar":
                        formalPackageName = "All-Star";
                        break;
                    case "mvp":
                        formalPackageName = "MVP";
                        break;
                    default:
                        formalPackageName = "";
                        break;
                }
            }
            if (onFireCard && formalPackageName) {
                // Set the main package item
                const mainPackage = {
                    title: `${formalPackageName} Package`,
                    card: onFireCard,
                    numberOfCards: co.checkout.packageCardCount,
                    numberOfOrders: 1,
                    price: co.checkout.packagePrice,
                };

                // If the user has selected to add a digital or physical card, set the add-on items
                let digitalAddOn = null;
                if (co.checkout.digitalCardCount > 0) {
                    digitalAddOn = {
                        title: "Digital Card Add-On",
                        card: onFireCard,
                        numberOfCards: 1,
                        numberOfOrders: co.checkout.digitalCardCount,
                        price: co.checkout.digitalCardPrice,
                    };
                }

                let includedPhysicalAddOn = null;

                includedPhysicalAddOn = {
                    title:
                        co.checkout.packageName === "rookie"
                            ? "Included Physical Card"
                            : "Included Physical Cards",
                    card: onFireCard,
                    numberOfCards: 1,
                    numberOfOrders:
                        co.checkout.packageName === "rookie"
                            ? 1
                            : co.checkout.packageName === "allStar"
                              ? 5
                              : 10,
                    price: 0.0,
                };

                // Add all items to the cart
                co.setCheckout({
                    ...checkout,
                    cart: [
                        mainPackage,
                        includedPhysicalAddOn,
                        digitalAddOn,
                    ].filter((item) => {
                        return item !== null;
                    }),
                });
            }
        }
        // I disabled this because it was causing an infinite loop
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checkoutStep]);

    // This useEffect is used to show the crypto wallet account balance in the NavBar
    useEffect(() => {
        if (transferContext.address && co.checkout.stepNum === 4) {
            setCryptoWalletConnected(true);
        } else {
            setCryptoWalletConnected(false);
        }
    }, [transferContext.address, co.checkout.stepNum]);

    return (
        <RainbowKitProvider theme={darkTheme()}>
            <Flex
                flexDir="row"
                w="full"
                minH="100dvh"
                bgGradient={
                    "linear(180deg, gray.1200 0%, gray.1300 100%) 0% 0% no-repeat padding-box;"
                }
            >
                <Flex flexDir="column" flex={1}>
                    <Flex
                        w="100%"
                        direction={"column"}
                        mb={{ base: "32px", md: "48px" }}
                    >
                        <NavBar cryptoWalletConnected={cryptoWalletConnected} />
                    </Flex>
                    <Box w="full" flex={1}>
                        {showSpinner ? (
                            <Box
                                w="100%"
                                h="100%"
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Spinner w="150px" h="150px" />
                            </Box>
                        ) : checkout.stepNum === 0 ? (
                            // Placeholder for Select Your package Page
                            <SelectYourPackage />
                        ) : checkout.stepNum === 1 ? (
                            <AllStarPrice />
                        ) : (
                            <>
                                <VStack
                                    w="100%"
                                    h="100%"
                                    gap="25px"
                                    align="top"
                                    color="white"
                                    display={{ base: "flex", lg: "none" }}
                                    px="24px"
                                    pb="32px"
                                >
                                    <CheckoutHeader />
                                    <CheckoutItemsInCart
                                        items={itemsInCart}
                                        buyingOtherCard={buyingOtherCard}
                                    />
                                    <Elements stripe={stripePromise}>
                                        <CheckoutStepWrapper
                                            onFireCard={onFireCard}
                                            buyingOtherCard={buyingOtherCard}
                                        />
                                    </Elements>
                                </VStack>
                                <Grid
                                    display={{ base: "none", lg: "grid" }}
                                    templateAreas={`"header header" 
													"itemsInCart stepWrapper"`}
                                    gridTemplateColumns={"0.4fr 1fr"}
                                    color="white"
                                    gap="6"
                                    fontWeight="bold"
                                    paddingX="72px"
                                    width={"100%"}
                                >
                                    <GridItem area={"header"}>
                                        <CheckoutHeader />
                                    </GridItem>
                                    <GridItem area={"itemsInCart"}>
                                        <CheckoutItemsInCart
                                            items={itemsInCart}
                                            buyingOtherCard={buyingOtherCard}
                                        />
                                    </GridItem>
                                    <GridItem area={"stepWrapper"} w="100%">
                                        <Elements stripe={stripePromise}>
                                            <CheckoutStepWrapper
                                                onFireCard={onFireCard}
                                                buyingOtherCard={
                                                    buyingOtherCard
                                                }
                                            />
                                        </Elements>
                                    </GridItem>
                                </Grid>
                            </>
                        )}
                    </Box>
                </Flex>
                <Box
                    position="sticky"
                    top={0}
                    w="140px"
                    h="100dvh"
                    display={{ base: "none", md: "inline" }}
                >
                    <Sidebar height="100dvh" backgroundPresent />
                </Box>
            </Flex>
        </RainbowKitProvider>
    );
}
