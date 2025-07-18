"use client";
// Import necessary components and hooks from Chakra UI and React
import {
    Box,
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
import CheckoutInfo from "@/hooks/CheckoutInfo";
import { ShippingAndHandlingItem } from "./checkoutItemsInCart";

interface CheckoutStepWrapperProps {
    onFireCard: TradingCardInfo | null;
    buyingOtherCard: boolean;
}

// Step 2: Add-ons
// Step 3: Shipping Address
// Step 4: Payment Details

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
    const stepNumber = checkout.stepNum;
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

    /**
     * Function to check if the current step is incomplete
     * @returns {boolean} - Whether the current step is incomplete
     */
    function stepIsIncomplete() {
        if (stepNumber === 3) {
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
                    {!screenTooSmall && !isGift && !buyingOtherCard && (
                        <Flex flexDirection={{ base: "column", lg: "row" }}>
                            {checkoutSteps.map((step, index) => {
                                if (index !== 0 && index !== 1 && index !== 2) {
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
                                                checkoutSteps.length - 1
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
                {stepNumber !== 4 && (
                    <Flex
                        justifyContent={{
                            base: "center",
                            lg: stepNumber === 4 ? "space-between" : "flex-end",
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
                            <Box>
                                <Text
                                    fontFamily={"Barlow"}
                                    transform={"skewX(-6deg)"}
                                    fontSize={"2xl"}
                                    fontWeight={"bold"}
                                >
                                    Total: ${totalPrice.toFixed(2)}
                                    {buyingPhysicalCards ? "*" : ""}
                                </Text>
                                {buyingPhysicalCards && (
                                    <ShippingAndHandlingItem isUnderTotal />
                                )}
                            </Box>
                            <Flex gap="10%">
                                <Button
                                    variant={"back"}
                                    width="100px"
                                    isDisabled={
                                        stepNumber === 0 ||
                                        ((stepNumber === 2 ||
                                            stepNumber === 3) &&
                                            buyingOtherCard)
                                    } // Disable the button if it's the first step
                                    onClick={() => {
                                        if (
                                            totalPrice === 0 &&
                                            stepNumber === 5
                                        ) {
                                            curCheckout.updateCheckout({
                                                stepNum: 2,
                                            });
                                            return;
                                        }

                                        if (
                                            (checkout.packageName ===
                                                "rookie" ||
                                                checkout.packageName ===
                                                    "prospect") &&
                                            stepNumber == 2
                                        ) {
                                            curCheckout.updateCheckout({
                                                stepNum: stepNumber - 2,
                                            });
                                        } else if (
                                            !buyingPhysicalCards &&
                                            stepNumber == 4
                                        ) {
                                            curCheckout.updateCheckout({
                                                stepNum: stepNumber - 2,
                                            });
                                            // Always skip Add-ons
                                        } else if (stepNumber == 3) {
                                            if (checkout.digitalCardCount) {
                                                curCheckout.updateCheckout({
                                                    stepNum: stepNumber - 2,
                                                });
                                            } else {
                                                curCheckout.updateCheckout({
                                                    stepNum: stepNumber - 3,
                                                });
                                            }
                                        } else if (
                                            stepNumber == 4 &&
                                            curCheckout.isGift
                                        ) {
                                            curCheckout.updateCheckout({
                                                stepNum: stepNumber - 4,
                                            });
                                        } else {
                                            curCheckout.updateCheckout({
                                                stepNum: stepNumber - 1,
                                            });
                                        }
                                    }}
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
                                    onClick={() => {
                                        if (
                                            stepNumber === 2 &&
                                            totalPrice === 0 &&
                                            auth.isSubscribed
                                        ) {
                                            curCheckout.updateCheckout({
                                                stepNum: 5,
                                            });
                                            return;
                                        }

                                        // Increment the step number to go to the next step, up to the last step
                                        // Skipping the shipping details step if the user is not buying physical cards
                                        if (
                                            !buyingPhysicalCards &&
                                            checkout.packageName !==
                                                "prospect" &&
                                            stepNumber == 2
                                        ) {
                                            const lastVisitedStep =
                                                stepNumber + 2 > visitedSteps
                                                    ? stepNumber + 2
                                                    : visitedSteps;
                                            curCheckout.updateCheckout({
                                                stepNum: stepNumber + 2,
                                                visitedSteps: lastVisitedStep,
                                            });
                                            // Advancing like normal
                                        } else if (
                                            stepNumber >= 0 &&
                                            stepNumber <
                                                checkoutSteps.length - 1
                                        ) {
                                            let advance = false;
                                            // Special next button logic for the payment details step
                                            if (stepNumber === 4) {
                                                // Click the button on the screen with id "save-details-button"
                                                // This button is within the CheckoutForm, and it seems like the easier option for the short-term
                                                const saveDetailsButton =
                                                    document.getElementById(
                                                        "save-details-button",
                                                    );
                                                if (saveDetailsButton) {
                                                    saveDetailsButton.click();
                                                    setIsLoading(true);
                                                }

                                                if (!hasAddedListeners) {
                                                    // Bug fix event listener to stop loading button from always being loading
                                                    // Also gets triggered if the checkout process fails
                                                    addEventListener(
                                                        "resetLoadingButton",
                                                        () => {
                                                            setIsLoading(false);
                                                        },
                                                    );

                                                    setHasAddedListeners(true);
                                                }
                                            } else {
                                                advance = true;
                                            }
                                            if (advance) {
                                                const lastVisitedStep =
                                                    stepNumber + 1 >
                                                    visitedSteps
                                                        ? stepNumber + 1
                                                        : visitedSteps;
                                                curCheckout.updateCheckout({
                                                    stepNum: stepNumber + 1,
                                                    visitedSteps:
                                                        lastVisitedStep,
                                                });
                                            }
                                        } else if (
                                            stepNumber ===
                                            checkoutSteps.length - 1
                                        ) {
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
                                                        description:
                                                            "An error occurred during the purchase.",
                                                        status: "error",
                                                        duration: 3000,
                                                        isClosable: true,
                                                    });
                                                }
                                            });
                                        }
                                    }}
                                >
                                    <Flex alignItems={"center"}>
                                        {/* Change button text based on whether it's the last step */}
                                        {stepNumber !== checkoutSteps.length - 1
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
