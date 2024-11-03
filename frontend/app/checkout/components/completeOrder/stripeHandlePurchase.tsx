import emailjs from "@emailjs/browser";
import { tradeBoughtCard } from "@/hooks/buyCardFunc";
import CheckoutInfo from "@/hooks/CheckoutInfo";
import TradingCardInfo from "@/hooks/TradingCardInfo";
import { useAuthProps } from "@/hooks/useAuth";
import { PaymentIntent, Stripe } from "@stripe/stripe-js";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { apiEndpoints } from "@backend/EnvironmentManager/EnvironmentManager";

/**
 * Handles the purchase process for trading cards, supporting both Stripe and non-Stripe payment methods.
 *
 * @param checkout - Contains checkout information including payment details and shipping address.
 * @param onFireCard - Information about the card being purchased.
 * @param stripe - Optional Stripe object for processing payments. If null, assumes non-Stripe payment.
 * @param router - Next.js router for navigation after purchase.
 * @param buyingOtherCard - Indicates if the user is buying another user's card.
 * @param auth - Authentication props for getting the current user's ID.
 * @param hash - Optional hash for non-Stripe (GMEX) payments.
 * @returns A promise that resolves to a boolean indicating success or failure of the purchase.
 */
export async function handlePurchase(
    checkout: CheckoutInfo,
    onFireCard: TradingCardInfo | null,
    stripe: Stripe | null,
    router: AppRouterInstance,
    buyingOtherCard: boolean,
    auth: useAuthProps,
    hash?: string,
): Promise<boolean> {
    try {
        // Get the current user's ID
        const currentUserId = (await auth.currentAuthenticatedUser()).userId;
        let paymentIntent: PaymentIntent | null = null;
        let shouldByPassPayment = false;

        console.log("checkout total", checkout.total);

        if (checkout.total === 0) {
            // If the total is 0, bypass payment and create the order
            shouldByPassPayment = true;
        }

        // If Stripe is provided, process the payment using Stripe
        if (stripe && !shouldByPassPayment) {
            // Extract payment method and customer ID from checkout info
            const paymentMethodId = checkout.paymentMethodId;
            const customerId = checkout.customerId;

            console.log("checkout", JSON.stringify(checkout));
            console.log("paymentMethodId", paymentMethodId);
            console.log("customerId", customerId);

            if (!paymentMethodId || !customerId) {
                console.error("Payment method or customer ID not found.");
                return false;
            }

            // Create a payment intent
            const paymentIntentResponse = await fetch(
                apiEndpoints.createPaymentIntent(),
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        paymentMethodId: paymentMethodId,
                        customerId: customerId,
                        cost: checkout.total,
                    }),
                },
            );

            const data = await paymentIntentResponse.json();
            console.log("Payment intent response:", data);

            shouldByPassPayment = data.byPassPayment;

            if (!shouldByPassPayment) {
                const clientSecret = data.paymentIntent.client_secret;

                // Confirm the card payment
                const {
                    error: confirmError,
                    paymentIntent: confirmedPaymentIntent,
                } = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: paymentMethodId,
                });

                if (confirmError) {
                    console.error(
                        confirmError.message ?? "An unknown error occurred.",
                    );
                    return false;
                } else if (
                    confirmedPaymentIntent &&
                    confirmedPaymentIntent.status === "succeeded"
                ) {
                    paymentIntent = confirmedPaymentIntent;
                } else {
                    console.error("Payment failed.");
                    return false;
                }
            }
        }

        // Prepare headers for subsequent API calls
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        // Get a total count of digital cards (including cards provided by the package)
        const totalDigitalCards =
            checkout.packageCardCount + checkout.digitalCardCount;

        // Create an order
        const orderOptions = {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify({
                card_uuid: onFireCard!.uuid,
                card_generatedBy: onFireCard!.generatedBy,
                cost_paid: checkout.total,
                sender_uuid: checkout.packageName
                    ? "GamechangersAdmin"
                    : onFireCard!.generatedBy,
                receiver_uuid: currentUserId,
                physicalCardQuantity: checkout.physicalCardCount,
                digitalCardQuantity: totalDigitalCards,
                first_name: checkout.contactInfo.firstName,
                last_name: checkout.contactInfo.lastName,
                email: checkout.contactInfo.email,
                phone_number: checkout.contactInfo.phone,
                shipping_firstName: checkout.shippingAddress.firstName,
                shipping_lastName: checkout.shippingAddress.lastName,
                address: checkout.shippingAddress.streetAddress,
                city: checkout.shippingAddress.city,
                state: checkout.shippingAddress.state,
                zip_code: checkout.shippingAddress.zipCode,
            }),
        };

        const createOrderResponse = await fetch(
            apiEndpoints.createOrder(),
            orderOptions,
        );
        if (!createOrderResponse.ok) {
            console.error(
                "Error creating order:",
                createOrderResponse.statusText,
            );
            return false;
        }

        const orderId = (await createOrderResponse.json()).uuid;

        // Handle buying another user's card
        if (buyingOtherCard) {
            const response = await tradeBoughtCard(
                onFireCard!.uuid,
                onFireCard!.generatedBy,
                orderId,
                currentUserId,
            );
            if (!response || !response.ok) {
                console.error(
                    "Error trading bought card:",
                    response?.statusText,
                );
                return false;
            }
        } else {
            const updateAvailableCardsOptions = {
                method: "POST",
                headers: myHeaders,
                body: JSON.stringify({
                    uuid: onFireCard!.uuid,
                    generatedBy: onFireCard!.generatedBy,
                    totalCreated: totalDigitalCards,
                    currentlyAvailable: totalDigitalCards,
                }),
            };
            const response = await fetch(
                apiEndpoints.updateTotalCards(),
                updateAvailableCardsOptions,
            );
            if (!response.ok) {
                console.error(
                    "Error updating available cards:",
                    response.statusText,
                );
                return false;
            }

            // Update card price for "allStar" package
            if (checkout.packageName !== "rookie") {
                const newCardPrice = parseFloat(checkout.cardPrice) + 3.0;

                const updatePriceOptions = {
                    method: "POST",
                    headers: myHeaders,
                    body: JSON.stringify({
                        uuid: onFireCard!.uuid,
                        generatedBy: onFireCard!.generatedBy,
                        price: newCardPrice,
                    }),
                };
                const updatePriceResponse = await fetch(
                    apiEndpoints.updateCardPrice(),
                    updatePriceOptions,
                );
                if (!updatePriceResponse.ok) {
                    console.error(
                        "Error updating card price:",
                        updatePriceResponse.statusText,
                    );
                    return false;
                }
            }
        }

        // Construct the success URL with appropriate query parameters
        let successUrl = "/checkout/success?";
        if (shouldByPassPayment) {
            // Add flag if payment was bypassed
            successUrl = `${successUrl}paymentBypassed=true`;
        } else if (stripe && paymentIntent) {
            // Add Stripe payment intent ID if Stripe was used
            successUrl = `${successUrl}payment_intent=${paymentIntent.id}`;
        } else if (hash) {
            // Add GMEX hash if non-Stripe payment was used
            successUrl = `${successUrl}paymentWithGMEX=${hash}`;
        }
        if (buyingOtherCard) {
            // Add flag if buying another user's card
            successUrl = `${successUrl}${successUrl.includes("?") ? "&" : ""}boughtOtherCard=true`;
        }

        if (!buyingOtherCard) {
            try {
                await handlePostCheckoutEmail(checkout);
            } catch (e) {
                console.error("Error sending post-checkout email: ", e);
            }
        }

        // Navigate to the success page
        router.push(successUrl);
        return true;
    } catch (error) {
        console.error("Error during purchase:", error);
        return false;
    }
}

enum EmailTemplates {
    ROOKIE = "template_71hzb7j",
    ALL_STAR = "template_46qvoa9",
}

async function handlePostCheckoutEmail(checkout: CheckoutInfo) {
    const isRookie = checkout.packageName === "rookie";

    const templateToUse = isRookie
        ? EmailTemplates.ROOKIE
        : EmailTemplates.ALL_STAR;

    await emailjs.send(
        "service_8rtflzq",
        templateToUse,
        {
            toEmail: checkout.contactInfo.email,
            cardImage: checkout.onFireCard!.cardImage,
            profileUrl: `https://onfireathletes.com/profile?user=${checkout.onFireCard!.generatedBy}`,
        },
        { publicKey: "nOgMf7N2DopnucmPc" },
    );
}
