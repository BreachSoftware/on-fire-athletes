import CheckoutInfo from "@/hooks/CheckoutInfo";
import { format } from "date-fns";

export function applyDiscount(
    price: number,
    centsOff: number,
    percentOff: number,
): number {
    let baseTotalWithDiscount = price;

    if (!centsOff && !percentOff) {
        return baseTotalWithDiscount;
    }

    if (centsOff) {
        baseTotalWithDiscount -= centsOff;
    } else {
        const discountFactor = 1 - percentOff / 100;
        baseTotalWithDiscount *= discountFactor;
    }

    return Math.max(Math.round(baseTotalWithDiscount), 0);
}

export function totalPriceInCart(
    checkout: CheckoutInfo,
    buyingPhysicalCards: boolean,
): number {
    const { couponCentsOff, couponPercentOff } = checkout;

    let total = 0;
    for (let i = 0; i < checkout.cart.length; i++) {
        total =
            total + checkout.cart[i].price * checkout.cart[i].numberOfOrders;
    }
    if (buyingPhysicalCards) {
        total = total + checkout.shippingCost;
    }

    return applyDiscount(total, couponCentsOff / 100, couponPercentOff);
}

export const formatMoney = (amount: number) => {
    return amount.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
    });
};

export function formatCents(amountInCents: number) {
    return formatMoney(amountInCents / 100);
}

export function formatDate(
    date: Date | number | null | undefined,
    dateFormat: string = "M/d/yyyy",
) {
    if (!date) {
        return "N/A";
    }

    const dateToUse = typeof date === "number" ? new Date(date * 1000) : date;

    return format(dateToUse, dateFormat);
}
