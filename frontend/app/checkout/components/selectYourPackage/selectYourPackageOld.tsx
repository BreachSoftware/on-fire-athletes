import React, { useMemo } from "react";
import { Flex, Grid, Text } from "@chakra-ui/react";

import { useCurrentCheckout } from "@/hooks/useCheckout";
import PackageHeader from "@/app/checkout/components/selectYourPackage/packageHeader";
import {
    packages,
    PackageType,
} from "@/app/checkout/components/selectYourPackage/packages";
import CheckoutButtonFooter from "@/app/checkout/components/selectYourPackage/checkoutButtonFooter";
import SelectBannerVertical from "@/app/checkout/components/selectYourPackage/selectBannerVertical";
import SelectBannerHorizontal from "@/app/checkout/components/selectYourPackage/selectBannerHorizontal";
import SharedStack from "@/components/shared/wrappers/shared-stack";
import CheckoutInfo, { DatabasePackageNames } from "@/hooks/CheckoutInfo";
import AddOnOption, {
    AddOnOptionType,
} from "../checkout-add-ons/add-on-option";
import { useAuth } from "@/hooks/useAuth";
import {
    BAG_TAG_ADD_ON_TITLE,
    DIGITAL_ADD_ON_TITLE,
    PHYSICAL_ADD_ON_TITLE,
} from "../checkout-add-ons/constants";
import PackageDetails from "./packageDetails";
import {
    BAG_TAG_PRICES,
    DIGITAL_CARD_PRICES,
    PHYSICAL_CARD_PRICES,
} from "@/utils/constants";

/**
 * This component is responsible for rendering the select your package section of the checkout page.
 */
export default function SelectYourPackage() {
    const { isGift } = useCurrentCheckout();

    const { isSubscribed } = useAuth();
    const { checkout, updateCheckout } = useCurrentCheckout();
    const { bagTagCount, digitalCardCount, physicalCardCount } = checkout;

    function getCartUpdate(
        title: string,
        value: number,
        type: "card" | "bag tag",
        price: number,
    ): Partial<CheckoutInfo> {
        const cartItem = checkout.cart.find((item) => item.title === title);

        if (cartItem) {
            const otherCartItems = checkout.cart.filter(
                (c) => c.title !== title,
            );

            if (value === 0) {
                return {
                    cart: otherCartItems,
                };
            }

            return {
                cart: [
                    ...otherCartItems,
                    {
                        ...cartItem,
                        numberOfCards: value,
                        price: price,
                    },
                ],
            };
        } else {
            if (value === 0) {
                return {
                    cart: checkout.cart,
                };
            }

            return {
                cart: [
                    ...checkout.cart,
                    {
                        title,
                        numberOfCards: value,
                        price: price,
                        card: checkout.onFireCard,
                        numberOfOrders: 1,
                        itemType: type,
                    },
                ],
            };
        }
    }

    const bagTagOption: AddOnOptionType = useMemo(
        () => ({
            title: "Bag Tags",
            value: bagTagCount,
            onChange: (value) => {
                const price = BAG_TAG_PRICES[value];

                updateCheckout({
                    bagTagCount: value,
                    packageName: DatabasePackageNames.ALL_STAR,
                    ...getCartUpdate(
                        BAG_TAG_ADD_ON_TITLE,
                        value,
                        "bag tag",
                        price,
                    ),
                });
            },
            // 25 to 500 in increments of 25
            pricingOptions: [1, 2, 3, 4, 5],
        }),
        [checkout.cart],
    );

    // NOTE: we don't need to adjust for defaults because the default is saved on packageCardCount
    const digitalCardOption: AddOnOptionType = useMemo(
        () => ({
            title: "Digital Cards",
            price: "$1.00 / 5 cards",
            value: digitalCardCount,
            onChange: (value) => {
                const price = DIGITAL_CARD_PRICES[value];

                updateCheckout({
                    digitalCardCount: value,
                    packageName: DatabasePackageNames.ALL_STAR,
                    ...getCartUpdate(
                        DIGITAL_ADD_ON_TITLE,
                        value,
                        "card",
                        price,
                    ),
                });
            },
            hidePriceStyling: true,
            // 25 to 500 in increments of 25
            pricingOptions: Array.from({ length: 20 }, (_, i) => 25 + i * 25),
        }),
        [checkout.cart],
    );

    const phsyicalCardDisplayPrice = isSubscribed
        ? `$14.99/ea ($9.99/ea after 6)`
        : `$24.99/ea`;

    const physicalCardOption: AddOnOptionType = useMemo(
        () => ({
            title: "Physical AR Cards",
            price: phsyicalCardDisplayPrice,
            value: physicalCardCount,
            onChange: (value) => {
                const price = PHYSICAL_CARD_PRICES[value];

                updateCheckout({
                    physicalCardCount: value,
                    packageName: DatabasePackageNames.ALL_STAR,
                    ...getCartUpdate(
                        PHYSICAL_ADD_ON_TITLE,
                        value,
                        "card",
                        price,
                    ),
                });
            },
            hidePriceStyling: true,
            pricingOptions: [1, 5, 10, 15, 20, 25],
        }),
        [checkout.cart],
    );

    return (
        <Flex
            width={"100%"}
            h="full"
            justifyContent={"flex-start"}
            alignItems={"center"}
            flexDirection={"column"}
            userSelect={"none"}
            paddingX={{ base: "24px", md: "72px" }}
            py={{ base: "24px", md: "55px" }}
        >
            {/* Header */}
            <SharedStack direction={{ base: "column", md: "row" }} spaced>
                <Text
                    fontFamily="Brotherhood"
                    color="white"
                    fontWeight={"100"}
                    width={"100%"}
                    fontSize={{
                        base: "46px",
                        sm: "54px",
                        md: "64px",
                        lg: "76px",
                    }}
                    textAlign={{ base: "center", md: "left" }}
                    letterSpacing={"3.0px"}
                >
                    Select A Product {isGift ? "to gift" : ""}
                </Text>
                {isGift && (
                    <Text
                        color="white"
                        fontFamily="Barlow Condensed"
                        fontWeight="medium"
                        textAlign="center"
                    >
                        You will receive an e-gift card with a unique code to
                        share with your recipient to use at checkout
                    </Text>
                )}
            </SharedStack>

            {/* Package Options */}
            <SharedStack>
                <Grid
                    width="100%"
                    templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
                    templateRows="1fr"
                    justifyContent="center"
                    marginTop="16px"
                    flexDir="column"
                    gap={{ base: "20px", xl: "38px" }}
                >
                    <Flex flexDir="column" gap="20px">
                        {/* Package Box Component */}
                        {[
                            physicalCardOption,
                            digitalCardOption,
                            bagTagOption,
                        ].map((pkg, index) => {
                            return (
                                <PackageItemSelect
                                    key={index}
                                    packageItem={pkg}
                                />
                            );
                        })}
                    </Flex>
                    <PackageBoxComponent pkg={packages.mvp} />
                </Grid>
                <CheckoutButtonFooter />
            </SharedStack>
        </Flex>
    );
}

function PackageItemSelect({
    packageItem: pkg,
}: {
    packageItem: AddOnOptionType;
}) {
    const { checkout } = useCurrentCheckout();

    const isSelected = pkg.value > 0 && checkout.packageName !== "mvp";

    // Glow effect for the selected package
    const glowEffect = "0 0 16px #27CE00";

    return (
        <Flex
            flex={1}
            minH="fit-content"
            backgroundColor={"#1B2120"}
            boxShadow={isSelected ? glowEffect : "none"}
            borderRadius={"10px"}
            transition={
                "border-color 0.2s, box-shadow 0.2s, background-color 0.2s"
            }
            _hover={{
                md: {
                    backgroundColor: !isSelected ? "#1C2421" : "#171C1B",
                    borderColor: !isSelected ? "green.300" : "green.100",
                },
            }}
            flexDirection={{ base: "column", xl: "row" }}
        >
            {/* Select Banner (Large Screens Only) */}
            <SelectBannerVertical
                isSelected={isSelected}
                onClick={() => pkg.onChange(isSelected ? 0 : 1)}
            />

            <SharedStack>
                {/* Header and Price */}
                <PackageHeader title={pkg.title} />

                {/* Bullet Points */}
                {/* <PackageDetails pkg={pkg} /> */}
                <AddOnOption
                    title={pkg.title}
                    value={pkg.value}
                    onChange={pkg.onChange}
                    pricingOptions={pkg.pricingOptions}
                />
            </SharedStack>
            {/* Select Banner (Mobile Only) */}
            <SelectBannerHorizontal
                isSelected={isSelected}
                onClick={() => pkg.onChange(isSelected ? 0 : 1)}
            />
        </Flex>
    );
}

function PackageBoxComponent({ pkg }: { pkg: PackageType }) {
    // Our checkout info
    const curCheckout = useCurrentCheckout();
    const checkout = curCheckout.checkout;

    // Glow effect for the selected package
    const glowEffect = "0 0 16px #27CE00";

    return (
        <Flex
            flex={1}
            minH="fit-content"
            overflow="hidden"
            // flexBasis={{ base: "100%", md: "30%" }}
            backgroundColor={"#1B2120"}
            // padding={"20px"}
            // borderWidth={"2px"}
            // borderColor={
            //     checkout.packageName === pkg.databaseName
            //         ? "green.100"
            //         : "transparent"
            // }
            boxShadow={
                checkout.packageName === pkg.databaseName ? glowEffect : "none"
            }
            zIndex={checkout.packageName === pkg.databaseName ? 0 : 1}
            borderRadius={"10px"}
            onClick={() => {
                // If the package is already selected, do nothing
                if (checkout.packageName === pkg.databaseName) {
                    return;
                }
                // Otherwise, set the package name in the checkout object
                curCheckout.updateCheckout({
                    packageName: pkg.databaseName,
                    digitalCardCount: 0,
                });
            }}
            cursor={"pointer"}
            transition={
                "border-color 0.2s, box-shadow 0.2s, background-color 0.2s"
            }
            _hover={{
                md: {
                    backgroundColor:
                        checkout.packageName !== pkg.databaseName
                            ? "#1C2421"
                            : "#171C1B",
                    borderColor:
                        checkout.packageName !== pkg.databaseName
                            ? "green.300"
                            : "green.100",
                },
            }}
            flexDirection={{ base: "column", xl: "row" }}
            pos="relative"
        >
            {/* Select Banner (Large Screens Only) */}
            <SelectBannerVertical
                isSelected={checkout.packageName === pkg.databaseName}
            />

            {/* Header and Price */}
            <PackageHeader title={pkg.title} price={pkg.price.toString()} />

            {/* Bullet Points */}
            <PackageDetails pkg={pkg} />

            {/* Select Banner (Mobile Only) */}
            <SelectBannerHorizontal
                isSelected={checkout.packageName === pkg.databaseName}
            />
        </Flex>
    );
}
