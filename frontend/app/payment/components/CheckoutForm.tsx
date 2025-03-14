/* eslint-disable no-undef */
import { PaymentElement } from "@stripe/react-stripe-js";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { Text, Button, Flex, useToast } from "@chakra-ui/react";
import { useCurrentCheckout } from "@/hooks/useCheckout";
import { checkoutSteps } from "@/app/checkout/components/checkoutSteps";
import { useEffect, useState } from "react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { apiEndpoints } from "@backend/EnvironmentManager/EnvironmentManager";
import CouponInput from "./coupon-input";
import { totalPriceInCart } from "@/utils/utils";
import { useRouter } from "next/navigation";

interface CheckoutFormProps {
    buyCard?: boolean;
}

/**
 * The CheckoutForm component
 */
export default function CheckoutForm({ buyCard }: CheckoutFormProps) {
    const router = useRouter();
    const stripe = useStripe();
    const toast = useToast();
    const elements = useElements();
    const curCheckout = useCurrentCheckout();

    const { checkout, updateCheckout } = curCheckout;

    const [buyingOtherCard, setBuyingOtherCard] = useState(false);
    const buyingPhysicalCards = checkout.physicalCardCount > 0;
    const stepNumber = checkout.stepNum;

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (window !== undefined) {
            const queryParams = new URLSearchParams(window.location.search);
            const buyingOtherCard = queryParams.get("buyingOtherCard");

            if (buyingOtherCard) {
                setBuyingOtherCard(true);
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [window?.location.search]);

    // dispatch the Event on an interval to ensure that the button is never stuck perpetually loading
    setInterval(() => {
        dispatchEvent(new Event("resetLoadingButton"));
    }, 3000);

    /**
     *
     * Handles the form submission.
     * Logic within this function for the checkoutScreen may be subject to change.
     *
     * @param e The form event
     */
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const total = totalPriceInCart(checkout, buyingPhysicalCards).toFixed(
            2,
        );

        if (total === "0.00") {
            router.push(buyCard ? "/transfer" : "/lockerroom");
            return;
        }

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        const { error } = await stripe.confirmPayment({
            elements: elements,
            confirmParams: {
                // Make sure to change this to your payment completion page
                return_url: buyCard
                    ? `${window.location.origin}/transfer`
                    : `${window.location.origin}/lockerroom`,
            },
        });

        if (error) {
            if (
                error.type === "card_error" ||
                error.type === "validation_error"
            ) {
                toast({
                    title: "Error",
                    description: error.message ?? "An unknown error occurred.",
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: "Error",
                    description: "An unknown error occurred.",
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                });
            }
        }
    }

    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement id="payment-element" />
            {!buyingOtherCard && <CouponInput />}
            {/* Invisible button that gets clicked by the checkoutStepWrapper */}
            <Flex
                justifyContent={{
                    base: "center",
                    lg: stepNumber === 4 ? "space-between" : "flex-end",
                }}
                flexDirection={{ base: "column", lg: "row" }}
                alignItems="center"
                gap="25px"
                w="100%"
                mt={{ base: "15px", md: "40px" }}
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
                        Total: $
                        {totalPriceInCart(
                            checkout,
                            buyingPhysicalCards,
                        ).toFixed(2)}
                        {buyingPhysicalCards ? "*" : ""}
                    </Text>
                    <Flex gap="10%">
                        <Button
                            variant={"back"}
                            width="100px"
                            onClick={() => {
                                if (curCheckout.isGift) {
                                    let newStepNum = stepNumber - 1;
                                    if (stepNumber === 4) {
                                        newStepNum = 0;
                                    }
                                    curCheckout.updateCheckout({
                                        stepNum: newStepNum,
                                    });
                                    return;
                                }

                                if (!buyingPhysicalCards) {
                                    curCheckout.updateCheckout({
                                        stepNum: stepNumber - 2,
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
                            isLoading={isLoading}
                            onClick={async () => {
                                setIsLoading(true);

                                const total = totalPriceInCart(
                                    checkout,
                                    buyingPhysicalCards,
                                ).toFixed(2);

                                if (total === "0.00") {
                                    updateCheckout({
                                        paymentInfoEntered: true,
                                        stepNum: checkoutSteps.length - 1,
                                        visitedSteps: checkoutSteps.length - 1,
                                    });

                                    setIsLoading(false);
                                    return;
                                }

                                // Call elements.submit() to trigger the form submission
                                const { error: submitError } =
                                    await elements!.submit();

                                if (submitError) {
                                    toast({
                                        title: "Error",
                                        description:
                                            submitError.message ??
                                            "An unknown error occurred.",
                                        status: "error",
                                        duration: 5000,
                                        isClosable: true,
                                    });
                                    setIsLoading(false);
                                    return;
                                }

                                const clientSecret =
                                    curCheckout.checkout.clientSecret;
                                // Confirm the setup without redirecting
                                const result = await stripe!.confirmSetup({
                                    elements: elements!,
                                    clientSecret: clientSecret,
                                    redirect: "if_required",
                                });

                                if (result.error) {
                                    toast({
                                        title: "Error",
                                        description:
                                            result.error.message ??
                                            "An unknown error occurred.",
                                        status: "error",
                                        duration: 5000,
                                        isClosable: true,
                                    });
                                } else {
                                    toast({
                                        title: "Success",
                                        description: "Payment method saved.",
                                        status: "success",
                                        duration: 3000,
                                        isClosable: true,
                                    });
                                }

                                // Retrieve the payment method details
                                const paymentMethodId = result.setupIntent
                                    ?.payment_method as string | undefined;

                                updateCheckout({
                                    clientSecret: clientSecret,
                                    paymentMethodId: paymentMethodId,
                                    paymentInfoEntered: true,
                                });

                                // check if paymentMethodId is undefined
                                if (!paymentMethodId) {
                                    setIsLoading(false);
                                    return;
                                }

                                const paymentMethodResponse = await fetch(
                                    apiEndpoints.retrievePaymentMethod(),
                                    {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                            paymentMethodId: paymentMethodId,
                                        }),
                                    },
                                );
                                const { paymentMethod } =
                                    await paymentMethodResponse.json();

                                const capitalizedBrand =
                                    paymentMethod.card.brand
                                        .charAt(0)
                                        .toUpperCase() +
                                    paymentMethod.card.brand.slice(1);

                                updateCheckout({
                                    paymentMethodId,
                                    clientSecret,
                                    paymentCardBrand: capitalizedBrand,
                                    paymentCardLastFour:
                                        paymentMethod.card.last4,
                                    paymentInfoEntered: true,
                                    stepNum: checkoutSteps.length - 1,
                                    visitedSteps: checkoutSteps.length - 1,
                                });
                            }}
                        >
                            <Flex alignItems={"center"}>
                                {/* Change button text based on whether it's the last step */}
                                {stepNumber !== checkoutSteps.length - 1
                                    ? "Next"
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
        </form>
    );
}
