"use client";
// Import necessary components and hooks from Chakra UI and React
import {
    Button,
    Flex,
    Heading,
    Text,
    useBreakpointValue,
    useToast,
} from "@chakra-ui/react";
import { checkoutSteps } from "./checkoutSteps";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { useCurrentCheckout } from "@/hooks/useCheckout";
import { useStripe } from "@stripe/react-stripe-js";
import { handlePurchase } from "./completeOrder/stripeHandlePurchase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TradingCardInfo from "@/hooks/TradingCardInfo";
import { useAuth } from "@/hooks/useAuth";
import { totalPriceInCart } from "@/utils/utils";
import React from "react";
import CheckoutInfo, { stepNum } from "@/hooks/CheckoutInfo";

interface CheckoutStepWrapperProps {
    onFireCard: TradingCardInfo | null;
    buyingOtherCard: boolean;
}

/**
 * CheckoutStepWrapper is a functional component that handles the display and navigation of checkout steps.
 * It renders a step-by-step UI for a checkout process.
 * @returns {JSX.Element} - The rendered JSX element for the checkout step wrapper.
 */
export default function CheckoutStepWrapper({
    onFireCard: onFireCard,
    buyingOtherCard,
}: CheckoutStepWrapperProps) {
    const curCheckout = useCurrentCheckout();
    const stripe = useStripe();
    const router = useRouter();
    const toast = useToast();
    const auth = useAuth();
    const checkout = curCheckout.checkout;
    const stepNumber: stepNum = checkout.stepNum;
    const visitedSteps = checkout.visitedSteps;
    const isGift = curCheckout.isGift;

    const [hasAddedListeners, setHasAddedListeners] = useState(false);

    const screenTooSmall = useBreakpointValue({ base: true, lg: false });

    // State to keep track of whether the user is buying physical cards
    const [buyingPhysicalCards, setBuyingPhysicalCards] = useState(false);
    useEffect(() => {
        if (checkout.physicalCardCount > 0 || checkout.bagTagCount > 0) {
            setBuyingPhysicalCards(true);
        } else {
            setBuyingPhysicalCards(false);
        }
    }, [
        checkout.packageName,
        checkout.physicalCardCount,
        checkout.bagTagCount,
    ]);

    // Used for the Purchase button on the last step
    const [isLoading, setIsLoading] = useState(false);
    const totalPrice = totalPriceInCart(checkout, buyingPhysicalCards);

    const filteredSteps = getCheckoutSteps(
        isGift,
        buyingPhysicalCards,
        auth.isSubscribed,
        totalPrice,
        buyingOtherCard,
    );

    function getCheckoutSteps(
        isGift: boolean,
        buyingPhysicalCards: boolean,
        isSubscribed: boolean,
        totalPrice: number,
        buyingOtherCard: boolean,
    ) {
        return checkoutSteps.filter((_, index) => {
            // Skip "Add-Ons" step if: the order is a gift or user is clicking "Buy Now" on an existing card
            if (index === stepNum.ADD_ONS && (isGift || buyingOtherCard)) {
                return false;
            }
            // Skip "Shipping Address" step if: order is a gift, or user is subscribed and not buying physical cards
            if (
                index === stepNum.SHIPPING_ADDRESS &&
                (isGift || (isSubscribed && !buyingPhysicalCards))
            ) {
                return false;
            }

            // Skip "Payment Info" step if: user is subscribed and there are no add-ons
            if (
                index === stepNum.PAYMENT_DETAILS &&
                isSubscribed &&
                totalPrice === 0
            ) {
                return false;
            }

            // Include all other steps
            return true;
        });
    }
    /**
     * Function to check if the current step is incomplete
     * @returns {boolean} - Whether the current step is incomplete
     */
    function stepIsIncomplete() {
        if (stepNumber === stepNum.SHIPPING_ADDRESS) {
            // Check if the street address is the correct format
            const validStreetAddress =
                checkout.shippingAddress.streetAddress.match(
                    /^\d+\s[A-Za-z\d]+(\s[A-Za-z\-']+){1,2}\.?$/g,
                );

            // Check if the zip code is the 5 or the 9 digit (XXXXX-XXXX) format
            const validZipCode =
                checkout.shippingAddress.zipCode !== "" &&
                (checkout.shippingAddress.zipCode.length === 5 ||
                    checkout.shippingAddress.zipCode.length === 10);

            return (
                !validStreetAddress ||
                checkout.shippingAddress.city === "" ||
                checkout.shippingAddress.state === "" ||
                !validZipCode
            );
        }
        return false;
    }

    /**
     *  Function to calculate the total price of all items in the cart in cents
     * @returns {number} - The total price of all items in the cart in cents
     */
    function totalPriceInCartInCents() {
        return parseInt(
            (totalPriceInCart(checkout, buyingPhysicalCards) * 100).toFixed(2),
        );
    }

    /**
     * Function to calculate the shipping cost based on the number of physical cards
     * @returns {number} - The calculated shipping cost
     */
    function calculateShippingCost(checkout: CheckoutInfo) {
        // Calculate shipping cost based on the number of physical cards
        const physicalCardCount = checkout.physicalCardCount;
        const bagTagCount = checkout.bagTagCount;

        if (physicalCardCount > 0 || bagTagCount > 0) {
            return 4.99;
        }

        return 0;
    }

    //  useEffect to update the total price in the cart when the cart changes
    useEffect(() => {
        curCheckout.updateCheckout({
            total: totalPriceInCartInCents(),
            shippingCost: calculateShippingCost(checkout),
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checkout.cart, checkout.stepNum, checkout.couponCode]);

    function handleBackClick() {
        const prevStep = stepNumber - 1;

        // Ensure the previous step exists and is valid
        if (prevStep >= 0 && filteredSteps[prevStep]) {
            curCheckout.updateCheckout({
                stepNum: prevStep,
            });
        }
    }

    function handleNextClick() {
        if (stepNumber >= 0 && stepNumber < filteredSteps.length - 1) {
            let advance = false;
            if (stepNumber === (stepNum.PAYMENT_DETAILS as stepNum)) {
                const saveDetailsButton = document.getElementById(
                    "save-details-button",
                );
                if (saveDetailsButton) {
                    saveDetailsButton.click();
                    setIsLoading(true);
                }

                if (!hasAddedListeners) {
                    addEventListener("resetLoadingButton", () => {
                        setIsLoading(false);
                    });

                    setHasAddedListeners(true);
                }
            } else {
                advance = true;
            }
            if (advance) {
                const lastVisitedStep =
                    stepNumber + 1 > visitedSteps
                        ? stepNumber + 1
                        : visitedSteps;
                curCheckout.updateCheckout({
                    stepNum: stepNumber + 1,
                    visitedSteps: lastVisitedStep,
                });
            }
        } else if (stepNumber === filteredSteps.length - 1) {
            setIsLoading(true);
            handlePurchase(
                checkout,
                onFireCard,
                stripe,
                router,
                buyingOtherCard,
                auth,
                undefined,
                undefined,
                isGift,
            ).then((result) => {
                if (!result) {
                    setIsLoading(false);
                    toast({
                        title: "Error",
                        description: "An error occurred during the purchase.",
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                    });
                }
            });
        }
    }

    return (
        <Flex width={"100%"} bg="#171C1B" h={"100%"} borderRadius={"8px"}>
            {/* Main container for the content of the checkout step, with padding and background color */}
            <Flex m="30px" w="100%" flexDirection={"column"} gap="24px">
                {/* Header section containing the step title and step navigation */}
                <Flex
                    alignItems={{ base: "normal", lg: "center" }}
                    justifyContent={"space-between"}
                    flexDirection={{ base: "column", lg: "row" }}
                    mb={{ base: "0", lg: "25px" }}
                >
                    <Heading
                        fontSize={{ base: "22px", lg: "xl", xl: "2xl" }}
                        fontStyle={"italic"}
                        fontWeight={{ base: "bold", lg: "light" }}
                        mb={{ base: "25px", lg: "0px" }}
                    >
                        {/* Display the title of the current step based on the stepNumber */}
                        {checkoutSteps[stepNumber].title}
                    </Heading>

                    {/* Navigation section for steps */}
                    {!screenTooSmall && !isGift && (
                        <Flex flexDirection={{ base: "column", lg: "row" }}>
                            {filteredSteps.map((step, index) => {
                                if (index !== 0 && index !== 1) {
                                    return (
                                        // Fragment is used to avoid adding extra nodes to the DOM
                                        <React.Fragment key={step.title}>
                                            <Text
                                                key={index} // Unique key for each step to help React manage re-renders
                                                // Change text color based on whether the step is completed or not.
                                                // If the step is not accessible, change the color to gray
                                                textColor={
                                                    index <= visitedSteps
                                                        ? index === 3 &&
                                                          !buyingPhysicalCards
                                                            ? "#808080"
                                                            : "#FFFFFF"
                                                        : "#808080"
                                                } // Color based on whether the step is completed or not
                                                fontSize={{
                                                    lg: "6px",
                                                    xl: "10px",
                                                }}
                                                // Change cursor based on whether the step is completed or not.
                                                // If the step is not accessible, change the cursor to not-allowed
                                                _hover={{
                                                    cursor:
                                                        index <= visitedSteps
                                                            ? index === 3 &&
                                                              !buyingPhysicalCards
                                                                ? "not-allowed"
                                                                : "pointer"
                                                            : "not-allowed",
                                                }} // Change cursor based on whether the step is accessible
                                                userSelect={"none"} // Disable text selection
                                                mx={{ lg: "5px" }} // Add horizontal margin to add space before and after the step
                                                onClick={() => {
                                                    // Change the step number to the clicked step if it's accessible
                                                    if (index <= visitedSteps) {
                                                        if (
                                                            index === 3 &&
                                                            !buyingPhysicalCards
                                                        ) {
                                                            // do nothing, as it's disabled
                                                        } else {
                                                            curCheckout.updateCheckout(
                                                                {
                                                                    stepNum:
                                                                        index,
                                                                },
                                                            );
                                                        }
                                                    }
                                                }}
                                            >
                                                {step.title}
                                            </Text>
                                            {/* Separator for steps, avoids adding for the last step */}
                                            <Text
                                                fontSize={{
                                                    lg: "6px",
                                                    xl: "10px",
                                                }}
                                                userSelect={"none"}
                                            >
                                                {index ===
                                                filteredSteps.length - 1
                                                    ? ""
                                                    : "/"}
                                            </Text>
                                        </React.Fragment>
                                    );
                                }
                                return null;
                            })}
                        </Flex>
                    )}
                </Flex>

                {/* Content area for the current step, displaying the component from checkoutSteps */}
                {checkoutSteps[stepNumber].bodyElement}

                {/* Footer section with the Next or Purchase button and optional bot-left element */}
                {stepNumber !== stepNum.PAYMENT_DETAILS && (
                    <Flex
                        justifyContent={{
                            base: "center",
                            lg:
                                stepNumber ===
                                (stepNum.PAYMENT_DETAILS as stepNum)
                                    ? "space-between"
                                    : "flex-end",
                        }}
                        flexDirection={{ base: "column", lg: "row" }}
                        alignItems="center"
                        gap="25px"
                        w="100%"
                        mt={"15px"}
                    >
                        {/* Bottom left element rendering at the beginning of this HStack */}
                        {checkoutSteps[stepNumber].cornerElement}

                        <Flex
                            direction={{ base: "column", lg: "row" }}
                            gap={{ base: "25px", lg: "31px" }}
                            alignItems={"center"}
                        >
                            {/* total price of all items in cart */}
                            <Text
                                fontFamily={"Barlow"}
                                transform={"skewX(-6deg)"}
                                fontSize={"2xl"}
                                fontWeight={"bold"}
                            >
                                Total: ${totalPrice.toFixed(2)}
                                {buyingPhysicalCards ? "*" : ""}
                            </Text>
                            <Flex gap="10%">
                                <Button
                                    variant={"back"}
                                    width="100px"
                                    isDisabled={
                                        stepNumber ===
                                            stepNum.SELECT_YOUR_PACKAGE ||
                                        ((stepNumber === stepNum.ADD_ONS ||
                                            stepNumber ===
                                                stepNum.SHIPPING_ADDRESS) &&
                                            buyingOtherCard)
                                    } // Disable the button if it's the first step
                                    onClick={handleBackClick}
                                >
                                    Back
                                </Button>
                                <Button
                                    variant="next"
                                    w="115px"
                                    _hover={{
                                        md: {
                                            filter: "drop-shadow(0px 0px 5px #27CE00)",
                                            width: "115px",
                                        },
                                    }}
                                    isDisabled={stepIsIncomplete()}
                                    isLoading={isLoading}
                                    onClick={handleNextClick}
                                >
                                    <Flex alignItems={"center"}>
                                        {/* Change button text based on whether it's the last step */}
                                        {stepNumber !== filteredSteps.length - 1
                                            ? "Next"
                                            : totalPrice === 0
                                              ? "Confirm"
                                              : "Purchase"}
                                        <ChevronRightIcon
                                            boxSize={"30px"}
                                            mr={"-10px"}
                                        />
                                    </Flex>
                                </Button>
                            </Flex>
                        </Flex>
                    </Flex>
                )}
            </Flex>
        </Flex>
    );
}
