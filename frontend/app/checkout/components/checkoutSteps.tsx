// eslint-disable-next-line no-use-before-define
import React from "react";
import CreditCardInformationBody from "./creditCardInformationBody";
import AddressBody, { AddressType } from "./addressBody";
import CompleteOrderBody from "./completeOrder/completeOrder";
import SelectYourPackage from "./selectYourPackage/selectYourPackageOld";
import AllStarPrice from "./allStarPrice";
import GameCoinButton from "./GameCoinButton";
import CheckoutAddOns from "./checkout-add-ons";
import CheckoutInfo, { StepNum } from "@/hooks/CheckoutInfo";
import { totalPriceInCart } from "@/utils/utils";

export class CheckoutStep {
    title: string;
    bodyElement: React.ReactElement;
    cornerElement: React.ReactElement | null;

    /**
     * Constructor for CheckoutStep
     * @param title The title of the step
     * @param bodyElement The element to be rendered within the bounds of the container
     * @param cornerElement The element to be rendered in the bottom left corner of the wrapper
     */
    constructor(
        title: string,
        bodyElement: React.ReactElement,
        cornerElement?: React.ReactElement,
    ) {
        this.title = title;
        this.bodyElement = bodyElement;
        this.cornerElement = cornerElement || null;
    }
}

// If needed, the Box components can be replaced with imported React elements to make this look a lot cleaner

export const checkoutSteps: CheckoutStep[] = [
    new CheckoutStep("Select Your Package", <SelectYourPackage />),
    new CheckoutStep("All-Star Price", <AllStarPrice />),
    new CheckoutStep("Add-Ons", <CheckoutAddOns />),
    new CheckoutStep(
        "Shipping Address",
        <AddressBody addressType={AddressType.SHIPPING} />,
    ),
    new CheckoutStep(
        "Payment Information",
        <CreditCardInformationBody />,
        <GameCoinButton />,
    ),
    new CheckoutStep("Review Order", <CompleteOrderBody />),
];

export function getCheckoutSteps(
    isGift: boolean,
    buyingPhysicalCards: boolean,
    isSubscribed: boolean,
    totalPrice: number,
    buyingOtherCard: boolean,
) {
    const shouldShowStep: { [key in StepNum]: boolean } = {
        [StepNum.SELECT_YOUR_PACKAGE]: true,
        [StepNum.ALL_STAR_PRICE]: true,
        [StepNum.ADD_ONS]: !(isGift || buyingOtherCard),
        [StepNum.SHIPPING_ADDRESS]: !(
            isGift ||
            (isSubscribed && !buyingPhysicalCards)
        ),
        [StepNum.PAYMENT_DETAILS]: !(isSubscribed && totalPrice === 0),
        [StepNum.REVIEW_ORDER]: true,
    };

    const filteredSteps = checkoutSteps
        .filter((_, index) => shouldShowStep[index as StepNum])
        .map((step, index) => ({
            step,
            stepIndex: index,
        }));

    return filteredSteps;
}

export function getFilteredSteps(
    checkout: CheckoutInfo,
    isGift: boolean,
    authIsSubscribed: boolean,
    buyingOtherCard: boolean,
) {
    const buyingPhysicalCards = checkout
        ? checkout.physicalCardCount > 0 || checkout.bagTagCount > 0
        : false;

    const totalPrice = totalPriceInCart(checkout, buyingPhysicalCards);

    return getCheckoutSteps(
        isGift,
        buyingPhysicalCards,
        authIsSubscribed,
        totalPrice,
        buyingOtherCard,
    );
}

export function updateStepIndex(
    checkoutInfo: CheckoutInfo,
    filteredSteps: { step: CheckoutStep; stepIndex: number }[],
) {
    const matchedStep = filteredSteps.find(
        (filteredStep) => filteredStep.stepIndex === checkoutInfo.stepNum,
    );

    if (matchedStep) {
        checkoutInfo.stepIndex = matchedStep.stepIndex;
    }
}
