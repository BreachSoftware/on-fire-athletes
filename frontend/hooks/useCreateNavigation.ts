import { useCurrentCheckout } from "./useCheckout";

type CreatePage = {
	name: string
	stepNum: number
	isDisabled?: boolean
	shouldHide?: boolean
}

/**
 * Hook to manage steps in the checkout header navigation bar
 * @returns JSX.Element
 */
export default function useCreateNavigation() {
	const { checkout } = useCurrentCheckout();
	const { contactInfo, shippingAddress } = checkout;

	const shouldExcludeShipping = checkout.packageName === "rookie";

	const isContactInfoComplete = contactInfo.firstName && contactInfo.lastName && contactInfo.email && contactInfo.phone;
	const isShippingAddressComplete =
	isContactInfoComplete &&
	shippingAddress.city &&
	shippingAddress.firstName &&
	shippingAddress.lastName &&
	shippingAddress.state &&
	shippingAddress.streetAddress &&
	shippingAddress.zipCode;
	const isPaymentMethodComplete = isShippingAddressComplete && checkout.customerId && checkout.paymentMethodId;

	const isPaymentDisabled = shouldExcludeShipping ? !isContactInfoComplete : !isShippingAddressComplete;

	const CREATE_PAGES: CreatePage[] = [
		{ name: "Contact Information", stepNum: 2 },
		{
			name: "Shipping Address",
			stepNum: 3,
			isDisabled: !isContactInfoComplete,
			shouldHide: shouldExcludeShipping,
		},
		{ name: "Payment Method", stepNum: 4, isDisabled: isPaymentDisabled },
		{ name: "Credit Card Information", stepNum: 4, isDisabled: isPaymentDisabled },
		{ name: "Review Order", stepNum: 5, isDisabled: !isPaymentMethodComplete },
	].filter((p) => {
		return !p.shouldHide;
	});

	return CREATE_PAGES;
}
