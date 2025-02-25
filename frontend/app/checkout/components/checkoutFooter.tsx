import { Button, Flex, Text } from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { StepNum } from "@/hooks/CheckoutInfo";

interface CheckoutFooterProps {
    stepNumber: number;
    filteredSteps: { step: any; stepIndex: number }[];
    totalPrice: number;
    buyingPhysicalCards: boolean;
    buyingOtherCard: boolean;
    isLoading: boolean;
    stepIsIncomplete: () => boolean;
    handleBackClick: () => void;
    handleNextClick: () => void;
}

export default function CheckoutFooter({
    stepNumber,
    filteredSteps,
    totalPrice,
    buyingPhysicalCards,
    buyingOtherCard,
    isLoading,
    stepIsIncomplete,
    handleBackClick,
    handleNextClick,
}: CheckoutFooterProps) {
    if (stepNumber === StepNum.PAYMENT_DETAILS) return null;

    return (
        <Flex
            justifyContent={{
                base: "center",
                lg:
                    stepNumber === StepNum.PAYMENT_DETAILS
                        ? "space-between"
                        : "flex-end",
            }}
            flexDirection={{ base: "column", lg: "row" }}
            alignItems="center"
            gap="25px"
            w="100%"
            mt="15px"
        >
            {/* Bottom left element rendering at the beginning of this HStack */}
            {filteredSteps[stepNumber]?.step?.cornerElement}

            <Flex
                direction={{ base: "column", lg: "row" }}
                gap={{ base: "25px", lg: "31px" }}
                alignItems="center"
            >
                {/* Total price of all items in cart */}
                <Text
                    fontFamily="Barlow"
                    transform="skewX(-6deg)"
                    fontSize="2xl"
                    fontWeight="bold"
                >
                    Total: ${totalPrice.toFixed(2)}
                    {buyingPhysicalCards ? "*" : ""}
                </Text>
                <Flex gap="10%">
                    <Button
                        variant="back"
                        width="100px"
                        isDisabled={
                            stepNumber === StepNum.SELECT_YOUR_PACKAGE ||
                            ((stepNumber === StepNum.ADD_ONS ||
                                stepNumber === StepNum.SHIPPING_ADDRESS) &&
                                buyingOtherCard)
                        }
                        onClick={handleBackClick}
                    >
                        Back
                    </Button>
                    <Button
                        variant="next"
                        w="115px"
                        _hover={{
                            md: {
                                filter: "drop-shadow(0px 0px 5px #27CE00)",
                                width: "115px",
                            },
                        }}
                        isDisabled={stepIsIncomplete()}
                        isLoading={isLoading}
                        onClick={handleNextClick}
                    >
                        <Flex alignItems="center">
                            {/* Change button text based on whether it's the last step */}
                            {stepNumber !== filteredSteps.length - 1
                                ? "Next"
                                : totalPrice === 0
                                  ? "Confirm"
                                  : "Purchase"}
                            <ChevronRightIcon boxSize="30px" mr="-10px" />
                        </Flex>
                    </Button>
                </Flex>
            </Flex>
        </Flex>
    );
}
