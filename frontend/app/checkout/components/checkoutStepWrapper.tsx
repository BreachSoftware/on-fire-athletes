"use client";
// Import necessary components and hooks from Chakra UI and React
import {
    Flex,
    Heading,
    Text,
    useBreakpointValue,
    useToast,
} from "@chakra-ui/react";
import { useCurrentCheckout } from "@/hooks/useCheckout";
import { useFilteredSteps } from "@/hooks/useFilteredSteps";
import { useStripe } from "@stripe/react-stripe-js";
import { handlePurchase } from "./completeOrder/stripeHandlePurchase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TradingCardInfo from "@/hooks/TradingCardInfo";
import { useAuth } from "@/hooks/useAuth";
import { totalPriceInCart } from "@/utils/utils";
import React from "react";
import CheckoutInfo, { StepNum } from "@/hooks/CheckoutInfo";
import { checkoutSteps } from "./checkoutSteps";
import CheckoutFooter from "./checkoutFooter";

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
}: CheckoutStepWrapperProps): JSX.Element {
    const curCheckout = useCurrentCheckout();
    const stripe = useStripe();
    const router = useRouter();
    const toast = useToast();
    const auth = useAuth();
    const checkout = curCheckout.checkout;
    const stepNumber: StepNum = checkout.stepNum;
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

    const filteredSteps = useFilteredSteps();
    /**
     * Function to check if the current step is incomplete
     * @returns {boolean} - Whether the current step is incomplete
     */
    function stepIsIncomplete() {
        if (stepNumber === StepNum.SHIPPING_ADDRESS) {
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
        if (checkout.stepIndex > 0) {
            const prevStep = checkout.stepIndex - 1;

            curCheckout.updateCheckout({
                stepIndex: prevStep, // Move back one step
            });
        }
    }

    function handleNextClick() {
        const currentStepIndex = filteredSteps.findIndex(
            (filteredStep) => filteredStep.stepIndex === checkout.stepIndex,
        );

        if (currentStepIndex === -1) {
            console.error("Invalid step index!");
            return;
        }

        const nextStep = filteredSteps[currentStepIndex];
        console.log(
            `Advancing to next step: ${nextStep.step.title} (Index: ${nextStep.stepIndex})`,
        );

        let advance = true;

        if (nextStep.stepIndex === StepNum.PAYMENT_DETAILS) {
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

            advance = false;
        }

        if (advance) {
            console.log("StepIndex before advance: ", checkout.stepIndex);
            curCheckout.updateCheckout({
                stepIndex: nextStep.stepIndex,
                visitedSteps: Math.max(visitedSteps, nextStep.stepIndex),
            });
            console.log("StepIndex after update: ", checkout.stepIndex);
        } else {
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
                                        <React.Fragment key={step.step.title}>
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
                                                {step.step.title}
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

                <CheckoutFooter
                    stepNumber={stepNumber}
                    filteredSteps={filteredSteps}
                    totalPrice={totalPrice}
                    buyingPhysicalCards={buyingPhysicalCards}
                    buyingOtherCard={buyingOtherCard}
                    isLoading={isLoading}
                    stepIsIncomplete={stepIsIncomplete}
                    handleBackClick={handleBackClick}
                    handleNextClick={handleNextClick}
                />
            </Flex>
        </Flex>
    );
}
