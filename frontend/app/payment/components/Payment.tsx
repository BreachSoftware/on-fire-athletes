import { useEffect, useRef, useState } from "react";
import { Appearance, loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { Box, useToast, Spinner } from "@chakra-ui/react";
import { useCurrentCheckout } from "@/hooks/useCheckout";
import { apiEndpoints } from "@backend/EnvironmentManager/EnvironmentManager";

interface PaymentProps {
    checkoutScreen?: boolean;
    buyCard?: boolean;
}

// OnFire keys
const STRIPE_PUBLIC_KEY =
    process.env.NEXT_PUBLIC_STRIPE_PK ||
    "pk_live_51PssXyCEBFOTy6pM9DfyGbI7JZUqMoClqRVuFCEAVamp10DYl2O48SqCjiw7vSbeiv8CCmYPZwSgguOTCcJzbY0u00cwKkUFDZ";

/**
 * Payment component
 * @param {*} props
 * @returns
 */
export default function Payment(props: PaymentProps) {
    const curCheckout = useCurrentCheckout();
    const toast = useToast();
    const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);
    const [clientSecret, setClientSecret] = useState<string>("");
    const [setupIntnetCreated, setSetupIntentCreated] =
        useState<boolean>(false);
    const appearance = useRef<Appearance>({
        theme: "night",
    });

    console.log("STRIPE PUBLIC KEY", STRIPE_PUBLIC_KEY);

    useEffect(() => {
        /**
         * Creates a setup intent for saving payment details
         * @returns {void}
         */
        async function createSetupIntent() {
            // Create a new customer
            const customerResponse = await fetch(
                apiEndpoints.createCustomer(),
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: curCheckout.checkout.contactInfo.email,
                        name: `${curCheckout.checkout.contactInfo.firstName} ${curCheckout.checkout.contactInfo.lastName}`,
                    }),
                },
            );

            const data = await customerResponse.json();
            const customerId = data.id;

            if (!customerId) {
                toast({
                    title: "Error",
                    description: "No customer ID found.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
                console.error("No customer ID found.");
                return;
            }

            const createSetupIntentResponse = await fetch(
                apiEndpoints.createSetupIntent(),
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ customerId: customerId }),
                },
            );

            const setupIntentData = await createSetupIntentResponse.json();
            const clientSecret = setupIntentData.setupIntent.client_secret;

            console.log("SETUP INTENT", setupIntentData.setupIntent);

            setClientSecret(clientSecret);
            setSetupIntentCreated(true);

            curCheckout.setCheckout({
                ...curCheckout.checkout,
                customerId: customerId,
                clientSecret: clientSecret,
                paymentInfoEntered: false,
            });
        }

        if (!setupIntnetCreated) {
            createSetupIntent();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [curCheckout.checkout.clientSecret]);

    useEffect(() => {
        if (props.checkoutScreen) {
            appearance.current = {
                theme: "night",
                variables: {
                    colorPrimary: "white",
                    colorBackground: "black",
                    colorTextPlaceholder: "gray.400",
                    borderRadius: "0px",
                },
            };
        }
    });

    return (
        <Box w="100%">
            {clientSecret && stripePromise ? (
                <Elements
                    stripe={stripePromise}
                    options={{
                        clientSecret: clientSecret,
                        appearance: appearance.current,
                    }}
                >
                    <CheckoutForm buyCard={props.buyCard} />
                </Elements>
            ) : (
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    w="100%"
                >
                    <Spinner w="150px" h="150px" speed={"0.75s"} />
                </Box>
            )}
        </Box>
    );
}
