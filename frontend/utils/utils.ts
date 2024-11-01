import CheckoutInfo from "@/hooks/CheckoutInfo";

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
