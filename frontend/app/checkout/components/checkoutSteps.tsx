// eslint-disable-next-line no-use-before-define
import React from "react";
import CreditCardInformationBody from "./creditCardInformationBody";
import AddressBody, { AddressType } from "./addressBody";
import CompleteOrderBody from "./completeOrder/completeOrder";
import SelectYourPackage from "./selectYourPackage/selectYourPackageOld";
import AllStarPrice from "./allStarPrice";
import GameCoinButton from "./GameCoinButton";
import CheckoutAddOns from "./checkout-add-ons";

class CheckoutStep {
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
