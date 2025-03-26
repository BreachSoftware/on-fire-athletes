import Payment from "@/app/payment/components/Payment";
import { useCurrentCheckout } from "@/hooks/useCheckout";
import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";

/**
 * CreditCardInformationBody is a functional component that displays the credit card information body.
 * @returns {JSX.Element} - The rendered JSX element for the credit card information body.
 */
export default function CreditCardInformationBody() {
    const [firstVisit, setFirstVisit] = useState(true);
    const co = useCurrentCheckout();

    // Reset the payment info entered flag when the component mounts
    useEffect(() => {
        if (firstVisit) {
            co.updateCheckout({
                paymentInfoEntered: false,
            });
            setFirstVisit(false);
        }
    }, [firstVisit, co]);

    return (
        <Box borderRadius={"8px"}>
            <Payment checkoutScreen />
        </Box>
    );
}
