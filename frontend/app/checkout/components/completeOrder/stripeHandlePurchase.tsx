import emailjs from "@emailjs/browser";
import { tradeBoughtCard } from "@/hooks/buyCardFunc";
import CheckoutInfo, { DatabasePackageNames } from "@/hooks/CheckoutInfo";
import TradingCardInfo from "@/hooks/TradingCardInfo";
import { useAuthProps } from "@/hooks/useAuth";
import { PaymentIntent, Stripe } from "@stripe/stripe-js";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { apiEndpoints } from "@backend/EnvironmentManager/EnvironmentManager";
import { totalPriceInCart } from "@/utils/utils";
import { PaymentMethod } from "@/utils/constants";
import { UserFields } from "@/types/user.types";

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
    isNil?: boolean,
    isGift?: boolean,
): Promise<boolean> {
    try {
        // Get the current user's ID
        const currentUserId = (await auth.currentAuthenticatedUser()).userId;
        const { dbUser } = auth;

        let paymentIntent: PaymentIntent | null = null;
        let shouldByPassPayment = false;

        if (checkout.total === 0) {
            // If the total is 0, bypass payment and create the order
            shouldByPassPayment = true;
        }

        // If Stripe is provided, process the payment using Stripe
        if (stripe && !shouldByPassPayment) {
            // Extract payment method and customer ID from checkout info
            const paymentMethodId = checkout.paymentMethodId;
            const customerId = checkout.customerId;

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
                card_uuid: onFireCard?.uuid,
                card_generatedBy: onFireCard?.generatedBy,
                cost_paid: checkout.total,
                sender_uuid: checkout.packageName
                    ? "GamechangersAdmin"
                    : onFireCard?.generatedBy,
                receiver_uuid: currentUserId,
                physicalCardQuantity: checkout.physicalCardCount,
                digitalCardQuantity: totalDigitalCards,
                bagTagQuantity: checkout.bagTagCount,
                first_name: dbUser?.first_name,
                last_name: dbUser?.last_name,
                email: dbUser?.email,
                phone_number: checkout.contactInfo.phone, // Always empty right now
                shipping_firstName: dbUser?.first_name,
                shipping_lastName: dbUser?.last_name,
                address: checkout.shippingAddress.streetAddress,
                city: checkout.shippingAddress.city,
                state: checkout.shippingAddress.state,
                zip_code: checkout.shippingAddress.zipCode,
                coupon_used: checkout.couponCode,
                payment_method: shouldByPassPayment
                    ? PaymentMethod.Bypassed
                    : hash
                      ? PaymentMethod.GMEX
                      : PaymentMethod.Card,
                package_name: isGift
                    ? `GIFT - ${checkout.packageName?.toUpperCase()}`
                    : auth.isSubscribed
                      ? "SUBSCRIPTION"
                      : isNil
                        ? "NIL"
                        : checkout.packageName?.toUpperCase(),
                is_gift: isGift,
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
        } else if (!isGift) {
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

            if (checkout.packageName === "mvp") {
                await fetch(apiEndpoints.addSubscription(), {
                    method: "POST",
                    headers: myHeaders,
                    body: JSON.stringify({
                        userId: currentUserId,
                        packageName: checkout.packageName,
                        isGmex: hash ? true : false,
                    }),
                });
                await auth.refreshUser();
            }

            // Update card price for sellable packages
            if (
                checkout.packageName !== "rookie" &&
                checkout.packageName !== "prospect"
            ) {
                // THIS IS WHERE WE WOULD ADD SHIPPING IF WE WANT TO ADD IT BACK
                const newCardPrice = parseFloat(checkout.cardPrice);

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
        if (isNil) {
            // Add flag if the order is for NIL
            successUrl = `${successUrl}${successUrl.includes("?") ? "&" : ""}nil=true`;
        }
        if (isGift) {
            // Add flag if the order is for a gift
            successUrl = `${successUrl}${successUrl.includes("?") ? "&" : ""}gift=true`;
        }

        if (!isGift) {
            if (!buyingOtherCard) {
                try {
                    await handlePostCheckoutEmail(checkout, dbUser);
                } catch (e) {
                    console.error("Error sending post-checkout email: ", e);
                }
            } else {
                try {
                    await handleBoughtLockerRoomCardEmail(
                        checkout,
                        currentUserId,
                        dbUser,
                    );
                } catch (e) {
                    console.error(
                        "Error sending bought locker room card email: ",
                        e,
                    );
                }
            }
        }

        console.log("Success URL: ", successUrl);

        // Navigate to the success page
        router.push(successUrl);
        return true;
    } catch (error) {
        console.error("Error during purchase:", error);
        return false;
    }
}

const EmailTemplates: Record<DatabasePackageNames, string> = {
    [DatabasePackageNames.PROSPECT]: "template_z2uq3ok",
    [DatabasePackageNames.ROOKIE]: "template_71hzb7j",
    [DatabasePackageNames.ALL_STAR]: "template_46qvoa9",
    [DatabasePackageNames.MVP]: "template_830qvoo",
};

async function handlePostCheckoutEmail(
    checkout: CheckoutInfo,
    dbUser: UserFields | null | undefined,
) {
    if (!checkout.packageName || !dbUser) {
        return;
    }

    const templateToUse = EmailTemplates[checkout.packageName];

    await emailjs.send(
        "service_8rtflzq",
        templateToUse,
        {
            toName: `${dbUser.first_name} ${dbUser.last_name}`,
            toEmail: dbUser.email,
            cardImage: checkout.onFireCard!.cardImage,
            profileUrl: `https://onfireathletes.com/profile?user=${checkout.onFireCard!.generatedBy}`,
        },
        { publicKey: "nOgMf7N2DopnucmPc" },
    );
}

async function handleBoughtLockerRoomCardEmail(
    checkout: CheckoutInfo,
    userId: string,
    dbUser: UserFields | null | undefined,
) {
    if (!dbUser) {
        return;
    }

    await emailjs.send(
        "service_8rtflzq",
        "template_rsncin1",
        {
            toEmail: dbUser.email,
            cardImage: checkout.onFireCard!.cardImage,
            cardFirstName: checkout.onFireCard!.firstName,
            cardLastName: checkout.onFireCard!.lastName,
            toName: `${dbUser.first_name} ${dbUser.last_name}`,
            cardPrice: `${totalPriceInCart(checkout, false).toFixed(2)}`,
            profileUrl: `https://onfireathletes.com/profile?user=${userId}`,
        },
        { publicKey: "nOgMf7N2DopnucmPc" },
    );
}
