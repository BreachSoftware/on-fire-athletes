import { useCurrentCheckout } from "./useCheckout";

type CreatePage = {
    name: string;
    stepNum: number;
    isDisabled?: boolean;
    shouldHide?: boolean;
};

/**
 * Hook to manage steps in the checkout header navigation bar
 * @returns JSX.Element
 */
export default function useCreateNavigation(buyingOtherCard: boolean) {
    const { checkout, isGift } = useCurrentCheckout();
    const { shippingAddress, physicalCardCount, bagTagCount } = checkout;

    const shouldExcludeAddOns = isGift || buyingOtherCard;
    const shouldExcludeShipping = physicalCardCount === 0 && bagTagCount === 0;

    const isShippingAddressComplete =
        shippingAddress.city &&
        shippingAddress.state &&
        shippingAddress.streetAddress &&
        shippingAddress.zipCode;
    const isPaymentMethodComplete =
        isShippingAddressComplete &&
        checkout.customerId &&
        checkout.paymentMethodId;

    const isPaymentDisabled = shouldExcludeShipping
        ? true
        : !isShippingAddressComplete;

    const CREATE_PAGES: CreatePage[] = [
        {
            name: "Add-ons",
            stepNum: 2,
            shouldHide: shouldExcludeAddOns,
        },
        {
            name: "Shipping Address",
            stepNum: 3,
            shouldHide: shouldExcludeShipping,
        },
        { name: "Payment Method", stepNum: 4, isDisabled: isPaymentDisabled },
        {
            name: "Credit Card Information",
            stepNum: 4,
            isDisabled: isPaymentDisabled,
        },
        {
            name: "Review Order",
            stepNum: 5,
            isDisabled: !isPaymentMethodComplete,
        },
    ].filter((p) => {
        return !p.shouldHide;
    });

    return CREATE_PAGES;
}
