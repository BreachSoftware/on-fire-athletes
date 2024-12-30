import { Flex, Button } from "@chakra-ui/react";
import { useCurrentCheckout } from "@/hooks/useCheckout";

import { packages } from "@/app/checkout/components/selectYourPackage/packages";

export default function CheckoutButtonFooter() {
    const curCheckout = useCurrentCheckout();
    const checkout = curCheckout.checkout;

    const pkgName = checkout.packageName;
    const pkg = pkgName ? packages[pkgName] : null;

    return (
        <Flex
            flexDirection={"row"}
            alignItems={"center"}
            justifyContent={"center"}
            marginTop={"20px"}
            width={"100%"}
            paddingLeft="15px"
        >
            <Button
                fontFamily={"Barlow Condensed"}
                fontSize={"18"}
                fontWeight={"400"}
                letterSpacing={"2px"}
                color={"white"}
                backgroundColor={"green.100"}
                _hover={{
                    md: {
                        backgroundColor: "green.300",
                    },
                }}
                isDisabled={!pkg}
                width={"40%"}
                onClick={() => {
                    if (!pkg) return;

                    const shouldSkipStep = checkout.packageName === "rookie";

                    curCheckout.setCheckout({
                        ...checkout,
                        packagePrice: pkg.price,
                        packageCardCount: pkg.defaultDigitalCardCount || 0,
                        physicalCardCount: pkg.defaultPhysicalCardCount || 0,
                        digitalCardCount: checkout.digitalCardCount,
                        stepNum: checkout.stepNum + (shouldSkipStep ? 2 : 1),
                    });
                }}
            >
                CHECKOUT
            </Button>
        </Flex>
    );
}
