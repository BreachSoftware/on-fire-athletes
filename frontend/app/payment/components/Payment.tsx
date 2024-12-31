import { useEffect, useRef, useState } from "react";
import { Appearance, loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { Box, useToast, Spinner } from "@chakra-ui/react";
import { useCurrentCheckout } from "@/hooks/useCheckout";
import { apiEndpoints } from "@backend/EnvironmentManager/EnvironmentManager";
import { useAuth } from "@/hooks/useAuth";

interface PaymentProps {
    checkoutScreen?: boolean;
    buyCard?: boolean;
}

// OnFire keys
const STRIPE_PUBLIC_KEY =
    process.env.NEXT_PUBLIC_STRIPE_PK ||
    "pk_test_51PssXyCEBFOTy6pMtubViKDQwVSljNAJRQAk5SkRyexPECtx4w8R3IHLQtI7CSNG1g7hSFk044Pc0STSYtxEWmSW00Y4VLvPII";
/**
 * Payment component
 * @param {*} props
 * @returns
 */
export default function Payment(props: PaymentProps) {
    const { dbUser, refreshUser } = useAuth();
    const { checkout, setCheckout } = useCurrentCheckout();
    const toast = useToast();
    const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);
    const [clientSecret, setClientSecret] = useState<string>("");
    const [setupIntentCreated, setSetupIntentCreated] =
        useState<boolean>(false);
    const appearance = useRef<Appearance>({
        theme: "night",
    });

    useEffect(() => {
        /**
         * Creates a setup intent for saving payment details
         * @returns {void}
         */
        async function createSetupIntent() {
            let customerId: string = dbUser?.stripe_customer_id || "";

            if (customerId) {
                console.log("Found customer! Skipping create...");
            }

            if (!customerId && !!dbUser) {
                console.log("No customer id, creating customer");

                // Create a new customer
                const customerResponse = await fetch(
                    apiEndpoints.createCustomer(),
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: dbUser?.email,
                            name: `${dbUser?.first_name} ${dbUser?.last_name}`,
                            userId: dbUser?.uuid,
                        }),
                    },
                );
                const data = await customerResponse.json();

                customerId = data.id;
                await refreshUser();
            }

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

            setClientSecret(clientSecret);
            setSetupIntentCreated(true);

            setCheckout({
                ...checkout,
                customerId: customerId,
                clientSecret: clientSecret,
                paymentInfoEntered: false,
            });
        }

        if (!setupIntentCreated) {
            createSetupIntent();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checkout.clientSecret]);

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
