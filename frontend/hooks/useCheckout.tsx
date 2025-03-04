"use client";

import {
    FC,
    ReactNode,
    createContext,
    useContext,
    useMemo,
    useState,
} from "react";
import CheckoutInfo from "@/hooks/CheckoutInfo";

// The properties of the useCurrentCheckout hook
export interface useCheckoutProperties {
    checkout: CheckoutInfo;
    setCheckout: (newCheckout: CheckoutInfo) => void;
    updateCheckout: (fieldsToUpdate: Partial<CheckoutInfo>) => void;
    isGift: boolean;
}

type Props = {
    children?: ReactNode;
};

// The currentCheckoutContext is used to provide the data to the useCurrentCheckoutInfo hook
const currentCheckoutContext = createContext({} as useCheckoutProperties);

/**
 * Setting the useCurrentCheckoutInfo hook to use the currentCheckoutContext
 * @returns The data to be used by the useCurrentCheckoutInfo hook
 */
export function useCurrentCheckout() {
    return useContext(currentCheckoutContext);
}

/**
 * The useCheckout hook is used to provide the data to the useCurrentCheckoutInfo hook
 * @returns The data to be used by the useCurrentCheckoutInfo hook
 */
function useCheckout(): useCheckoutProperties {
    const [checkout, setCheckout] = useState<CheckoutInfo>(new CheckoutInfo());

    let isGift: boolean = false;

    if (typeof window !== "undefined") {
        const queryParams = new URLSearchParams(window.location.search);
        isGift = queryParams.get("gift") === "true";
    }

    function updateCheckout(fieldsToUpdate: Partial<CheckoutInfo>) {
        console.log("UPDATE CHECKOUT", fieldsToUpdate);

        setCheckout({
            ...checkout,
            ...fieldsToUpdate,
        });
    }

    return {
        checkout: checkout,
        setCheckout: setCheckout,
        updateCheckout: updateCheckout,
        isGift: isGift,
    };
}

/**
 * The ProvideCheckout component is used to provide the data to the useCurrentCheckoutInfo hook
 * @param children The children of the component
 * @returns The data to be used by the useCurrentCheckoutInfo hook
 */
// eslint-disable-next-line func-style
export const ProvideCheckout: FC<Props> = ({ children }) => {
    const checkoutData = useCheckout();
    return (
        <currentCheckoutContext.Provider value={checkoutData}>
            {children}
        </currentCheckoutContext.Provider>
    );
};
