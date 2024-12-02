import CheckoutInfo from "@/hooks/CheckoutInfo";
import { useCurrentCheckout } from "@/hooks/useCheckout";
import { apiEndpoints } from "@backend/EnvironmentManager/EnvironmentManager";
import { useToast } from "@chakra-ui/react";
import { useElements } from "@stripe/react-stripe-js";
import { Stripe } from "@stripe/stripe-js";

/**
 * Handles the setup of the payment details.
 */
export async function handleSetup(
    stripe: Stripe | null,
    elements: ReturnType<typeof useElements>,
    toast: ReturnType<typeof useToast>,
    curCheckout: ReturnType<typeof useCurrentCheckout>,
    setCheckout: (c: CheckoutInfo) => void,
) {
    // Call elements.submit() to trigger the form submission
    const { error: submitError } = await elements!.submit();

    if (submitError) {
        toast({
            title: "Error",
            description: submitError.message ?? "An unknown error occurred.",
            status: "error",
            duration: 5000,
            isClosable: true,
        });
        return "error";
    }

    const clientSecret = curCheckout.checkout.clientSecret;
    // Confirm the setup without redirecting
    const result = await stripe!.confirmSetup({
        elements: elements!,
        clientSecret: clientSecret,
        redirect: "if_required",
    });

    if (result.error) {
        toast({
            title: "Error",
            description: result.error.message ?? "An unknown error occurred.",
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
    const paymentMethodId = result.setupIntent?.payment_method as
        | string
        | undefined;

    setCheckout({
        ...curCheckout.checkout,
        clientSecret: clientSecret,
        paymentMethodId: paymentMethodId,
        paymentInfoEntered: true,
    });

    // check if paymentMethodId is undefined
    if (!paymentMethodId) {
        return "error";
    }

    const paymentMethodResponse = await fetch(
        apiEndpoints.retrievePaymentMethod(),
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ paymentMethodId: paymentMethodId }),
        },
    );
    const { paymentMethod } = await paymentMethodResponse.json();

    const capitalizedBrand =
        paymentMethod.card.brand.charAt(0).toUpperCase() +
        paymentMethod.card.brand.slice(1);

    return {
        paymentMethodId,
        clientSecret,
        paymentCardBrand: capitalizedBrand,
        paymentCardLastFour: paymentMethod.card.last4,
        paymentInfoEntered: true,
    };
}
