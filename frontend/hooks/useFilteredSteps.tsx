import { useAuth } from "./useAuth";
import { useCurrentCheckout } from "./useCheckout";
import { getFilteredSteps } from "@/app/checkout/components/checkoutSteps";

export function useFilteredSteps({
    buyingOtherCard,
}: { buyingOtherCard?: boolean } = {}) {
    const curCheckout = useCurrentCheckout();
    const auth = useAuth();

    if (!curCheckout.checkout) {
        return [];
    }

    const { checkout } = curCheckout;
    const isGift = curCheckout.isGift ?? false;

    const filteredSteps = getFilteredSteps(
        checkout,
        isGift,
        auth.isSubscribed,
        buyingOtherCard ?? false,
    );

    return filteredSteps;
}
