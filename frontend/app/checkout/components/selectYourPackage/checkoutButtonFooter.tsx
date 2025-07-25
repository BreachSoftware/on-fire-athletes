import { Flex, Button } from "@chakra-ui/react";
import { useCurrentCheckout } from "@/hooks/useCheckout";

import { packages } from "@/app/checkout/components/selectYourPackage/packages";
import { DatabasePackageNames } from "@/hooks/CheckoutInfo";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function CheckoutButtonFooter() {
    const { dbUser } = useAuth();
    const curCheckout = useCurrentCheckout();
    const checkout = curCheckout.checkout;

    const pkgName = checkout.packageName;
    const pkg = pkgName ? packages[pkgName] : null;

    const router = useRouter();

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
                isDisabled={
                    !pkg ||
                    (pkg.databaseName !== DatabasePackageNames.MVP &&
                        !(
                            checkout.bagTagCount ||
                            checkout.physicalCardCount ||
                            checkout.digitalCardCount
                        ))
                }
                width={"40%"}
                onClick={() => {
                    if (!pkg) return;

                    if (!dbUser) {
                        router.push(`/signup?giftPackage=${pkg.databaseName}`);
                        return;
                    }

                    if (
                        curCheckout.isGift &&
                        checkout.packageName === DatabasePackageNames.MVP
                    ) {
                        curCheckout.updateCheckout({
                            cart: [
                                {
                                    title: `GIFT - ${pkg.title} Package`,
                                    card: null,
                                    numberOfCards: 0,
                                    numberOfOrders: 1,
                                    price: pkg.price,
                                    itemType: "package",
                                },
                            ],
                            packageCardCount: 0,
                            physicalCardCount: 0,
                            digitalCardCount: 0,
                            bagTagCount: 0,
                            packagePrice: pkg.price,
                            stepNum: checkout.stepNum + 4,
                        });

                        return;
                    }

                    if (checkout.packageName === DatabasePackageNames.MVP) {
                        curCheckout.updateCheckout({
                            packagePrice: pkg.price,
                            packageCardCount: pkg.defaultDigitalCardCount || 0,
                            physicalCardCount:
                                pkg.defaultPhysicalCardCount || 0,
                            digitalCardCount: checkout.digitalCardCount,
                            bagTagCount: pkg.defaultBagTagCount || 0,
                            stepNum: checkout.stepNum + 1,
                        });
                    } else {
                        if (curCheckout.isGift) {
                            curCheckout.updateCheckout({
                                stepNum: checkout.stepNum + 4,
                            });
                        } else {
                            if (!checkout.digitalCardCount) {
                                // Set price to 25 if only physical
                                if (checkout.physicalCardCount) {
                                    // Set Price to $25 and skip step
                                    curCheckout.updateCheckout({
                                        cardPrice: "25",
                                        stepNum: checkout.stepNum + 3,
                                    });
                                } else {
                                    curCheckout.updateCheckout({
                                        stepNum: checkout.stepNum + 3,
                                    });
                                }
                            } else {
                                curCheckout.updateCheckout({
                                    stepNum: checkout.stepNum + 1,
                                });
                            }
                        }
                    }
                }}
            >
                CHECKOUT
            </Button>
        </Flex>
    );
}
