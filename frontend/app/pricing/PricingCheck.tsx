import { Icon } from "@chakra-ui/react";
import { FaCheck, FaTimes } from "react-icons/fa";

interface PricingCheckProps {
    isChecked: boolean;
}

export const PricingCheck = ({ isChecked }: PricingCheckProps) => {
    return (
        <Icon
            as={isChecked ? FaCheck : FaTimes}
            color={isChecked ? "green.400" : "red.400"}
            boxSize={4}
        />
    );
};
