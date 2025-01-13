import TradingCardInfo from "./TradingCardInfo";

export interface StreetAddress {
    firstName: string;
    lastName: string;
    streetAddress: string;
    unitNumber?: string;
    city: string;
    state: string;
    zipCode: string;
}

export interface ContactInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
}

export interface Item {
    title: string;
    card: TradingCardInfo | null;
    numberOfCards: number;
    numberOfOrders: number;
    price: number;
    itemType?: "card" | "bag tag" | "package";
    multiplier?: number;
}

export enum DatabasePackageNames {
    PROSPECT = "prospect",
    ROOKIE = "rookie",
    ALL_STAR = "allStar",
    MVP = "mvp",
}

export default class CheckoutInfo {
    visitedSteps: number;

    cart: Item[];
    subtotal: number;
    shippingCost: number;
    tax: number;
    total: number;

    packageName: DatabasePackageNames | null;
    onFireCard: TradingCardInfo | null;
    packageCardCount: number;
    packagePrice: number;
    digitalCardCount: number;
    digitalCardPrice: number;
    physicalCardCount: number;
    physicalCardPrice: number;
    bagTagCount: number;
    bagTagPrice: number;

    contactInfo: ContactInfo;

    // This customerId is for Stripe
    customerId: string;
    clientSecret: string;
    paymentMethodId?: string;
    paymentComplete: boolean;
    // These two are optional because they are only used when the payment method is a card
    paymentCardBrand?: string;
    paymentCardLastFour?: string;
    cryptoWalletConnected: boolean;

    couponCode: string;
    couponCentsOff: number;
    couponPercentOff: number;

    stepNum: number;
    shippingCards: boolean;
    shippingAddress: StreetAddress;
    billingAddress: StreetAddress;
    shippingIsBilling: boolean;
    paymentInfoEntered: boolean; // I'm thinking this is what happens when they link their wallet or enter their card info, but it hasnt charged yet

    termsAccepted: boolean;
    complete: boolean;

    // This is the price the user sets for the card if they choose the all-star package
    cardPrice: string;

    /**
     * Constructor for the CheckoutInfo class
     */
    constructor() {
        // Start on the first step of the StepWrapper
        this.visitedSteps = 2;

        this.cart = [];
        this.subtotal = 0;
        this.shippingCost = 0;
        this.tax = 0;
        this.total = 0;

        this.packageName = DatabasePackageNames.ALL_STAR;
        this.onFireCard = null;
        this.packageCardCount = 0;
        this.packagePrice = 0;
        this.digitalCardCount = 0;
        this.digitalCardPrice = 1.0;
        this.physicalCardCount = 0;
        this.physicalCardPrice = 24.99;
        this.bagTagCount = 0;
        this.bagTagPrice = 19.99;

        this.contactInfo = {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
        };

        this.customerId = "";
        this.clientSecret = "";
        this.paymentMethodId = "";
        this.paymentComplete = false;
        this.paymentCardBrand = "";
        this.paymentCardLastFour = "";
        this.cryptoWalletConnected = false;

        this.couponCode = "";
        this.couponCentsOff = 0;
        this.couponPercentOff = 0;

        this.stepNum = 0;
        this.shippingCards = false;
        this.shippingAddress = {
            firstName: "",
            lastName: "",
            streetAddress: "",
            city: "",
            state: "",
            zipCode: "",
        };
        this.billingAddress = this.shippingAddress;
        // Does not start checked according to the flow
        this.shippingIsBilling = false;

        this.paymentInfoEntered = false;

        this.termsAccepted = false;
        this.complete = false;

        this.cardPrice = "";
    }

    /**
     * Converts the CheckoutInfo object to a string so you can see all its attributes
     */
    static showInfo(checkoutInfo: CheckoutInfo): string {
        return `
			visitedSteps: ${checkoutInfo.visitedSteps}
			type: ${checkoutInfo.stepNum}
			cart: ${checkoutInfo.cart}
			subtotal: ${checkoutInfo.subtotal}
			shippingCost: ${checkoutInfo.shippingCost}
			tax: ${checkoutInfo.tax}
			total: ${checkoutInfo.total}
			packageName: ${checkoutInfo.packageName}
			onFireCard: ${checkoutInfo.onFireCard}
			digitalCardCount: ${checkoutInfo.digitalCardCount}
			physicalCardCount: ${checkoutInfo.physicalCardCount}
			paymentComplete: ${checkoutInfo.paymentComplete}
			paymentCardBrand: ${checkoutInfo.paymentCardBrand}
			paymentCardLastFour: ${checkoutInfo.paymentCardLastFour}
			cryptoWalletConnected: ${checkoutInfo.cryptoWalletConnected}
			shippingCards: ${checkoutInfo.shippingCards}
			// shipping and billing need to showå
			shippingAddress: ${checkoutInfo.shippingAddress}
			billingAddress: ${checkoutInfo.billingAddress}
			paymentInfoEntered: ${checkoutInfo.paymentInfoEntered}
			termsAccepted: ${checkoutInfo.termsAccepted}
			cardPrice: ${checkoutInfo.cardPrice}
			`;
    }
}
