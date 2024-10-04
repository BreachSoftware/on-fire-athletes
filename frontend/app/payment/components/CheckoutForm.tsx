/* eslint-disable no-undef */
import { PaymentElement } from "@stripe/react-stripe-js";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { Button, useToast } from "@chakra-ui/react";
import { handleSetup } from "@/app/checkout/components/completeOrder/stripeHandleSetup";
import { useCurrentCheckout } from "@/hooks/useCheckout";
import { checkoutSteps } from "@/app/checkout/components/checkoutSteps";

interface CheckoutFormProps {
    buyCard?: boolean;
}

/**
 * The CheckoutForm component
 */
export default function CheckoutForm({ buyCard }: CheckoutFormProps) {
    const stripe = useStripe();
    const toast = useToast();
    const elements = useElements();
    const curCheckout = useCurrentCheckout();

    const { checkout, setCheckout } = curCheckout;

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

        console.log("ERROR?: ", error);

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

    /**
     * setting the processing state and calling the handleSetup function
     */
    async function processHandleSetup() {
        console.log("IN PROCESSING HANDLE SETUP");

        await handleSetup(
            stripe,
            elements,
            toast,
            curCheckout,
            setCheckout,
        ).then((result) => {
            console.log("SETUP RESULT: ", result);
            if (result === "error") {
                // Just tell the checkoutStepWrapper to reset the button
                dispatchEvent(new Event("resetLoadingButton"));
            } else {
                setCheckout({
                    ...curCheckout.checkout,
                    ...result, // Payment method ID along with other payment details
                    stepNum: checkoutSteps.length - 1,
                    visitedSteps: checkoutSteps.length - 1,
                });
                dispatchEvent(new Event("savedDetailsSuccess"));
            }

            // if (result === "success") {
            //     // Broadcast the event to update the checkout so checkoutStepWrapper can make the next button not loading
            //     dispatchEvent(new Event("savedDetailsSuccess"));
            // } else {
            //     // Just tell the checkoutStepWrapper to reset the button
            //     dispatchEvent(new Event("resetLoadingButton"));
            // }
        });
    }

    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement id="payment-element" />
            {/* Invisible button that gets clicked by the checkoutStepWrapper */}
            <Button
                id="save-details-button"
                onClick={processHandleSetup}
                visibility={"hidden"}
                width={"0px"}
                height={"0px"}
            />
        </form>
    );
}
