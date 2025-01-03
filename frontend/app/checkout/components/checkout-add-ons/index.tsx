import SharedStack from "@/components/shared/wrappers/shared-stack";
import CheckoutInfo, { DatabasePackageNames } from "@/hooks/CheckoutInfo";
import { useCurrentCheckout } from "@/hooks/useCheckout";
import React, { useMemo } from "react";
import AddOnOption, { AddOnOptionType } from "./add-on-option";
import { packages } from "../selectYourPackage/packages";
import { SimpleGrid, Text } from "@chakra-ui/react";
import { useAuth } from "@/hooks/useAuth";
import {
    BAG_TAG_ADD_ON_TITLE,
    DIGITAL_ADD_ON_TITLE,
    PHYSICAL_ADD_ON_TITLE,
} from "./constants";

export default function CheckoutAddOns() {
    const { isSubscribed } = useAuth();
    const { checkout, updateCheckout } = useCurrentCheckout();
    const {
        packageName,
        bagTagCount,
        digitalCardCount,
        physicalCardCount,
        bagTagPrice,
        physicalCardPrice,
    } = checkout;

    const packageDefaults = packageName ? packages[packageName] : null;

    const defaultBagTagCount = isSubscribed
        ? 0
        : packageDefaults?.defaultBagTagCount || 0;
    const defaultPhysicalCardCount = isSubscribed
        ? 0
        : packageDefaults?.defaultPhysicalCardCount || 0;

    function getCartUpdate(
        title: string,
        value: number,
        type: "card" | "bag tag",
        price: number,
        multiplier: number = 1,
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
                        price: price * value,
                        multiplier: multiplier,
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
                        price: price * value,
                        card: checkout.onFireCard,
                        numberOfOrders: 1,
                        itemType: type,
                        multiplier: multiplier,
                    },
                ],
            };
        }
    }

    const bagTagOption: AddOnOptionType = useMemo(
        () => ({
            title: "Additional Bag Tag",
            price: String(bagTagPrice),
            value: bagTagCount - defaultBagTagCount,
            onChange: (value) => {
                updateCheckout({
                    bagTagCount: value + defaultBagTagCount,
                    ...getCartUpdate(
                        BAG_TAG_ADD_ON_TITLE,
                        value,
                        "bag tag",
                        bagTagPrice,
                    ),
                });
            },
        }),
        [bagTagPrice, defaultBagTagCount, checkout.cart],
    );

    // NOTE: we don't need to adjust for defaults because the default is saved on packageCardCount
    const digitalCardOption: AddOnOptionType = useMemo(
        () => ({
            title: "Additional 5 Digital Cards",
            price: "$1.00 / 5 cards",
            value: digitalCardCount,
            onChange: (value) => {
                updateCheckout({
                    digitalCardCount: value,
                    ...getCartUpdate(DIGITAL_ADD_ON_TITLE, value, "card", 1, 5),
                });
            },
            hidePriceStyling: true,
        }),
        [digitalCardCount, checkout.cart],
    );

    const phsyicalCardDisplayPrice = isSubscribed
        ? `$14.99/ea ($9.99/ea if 6+)`
        : `$24.99/ea`;

    const physicalCardOption: AddOnOptionType = useMemo(
        () => ({
            title: "Additional Physical AR Card",
            price: phsyicalCardDisplayPrice,
            value: physicalCardCount - defaultPhysicalCardCount,
            onChange: (value) => {
                const physPrice = isSubscribed
                    ? value >= 6
                        ? 9.99
                        : 14.99
                    : 24.99;

                updateCheckout({
                    physicalCardCount: value + defaultPhysicalCardCount,
                    ...getCartUpdate(
                        PHYSICAL_ADD_ON_TITLE,
                        value,
                        "card",
                        physPrice,
                    ),
                });
            },
            hidePriceStyling: true,
        }),
        [physicalCardPrice, defaultPhysicalCardCount, checkout.cart],
    );

    const addOnOptions: Record<DatabasePackageNames, AddOnOptionType[]> =
        useMemo(
            () => ({
                [DatabasePackageNames.PROSPECT]: [bagTagOption],
                [DatabasePackageNames.ROOKIE]: [
                    bagTagOption,
                    physicalCardOption,
                ],
                [DatabasePackageNames.ALL_STAR]: [
                    bagTagOption,
                    physicalCardOption,
                ],
                [DatabasePackageNames.MVP]: [
                    bagTagOption,
                    digitalCardOption,
                    physicalCardOption,
                ],
            }),
            [bagTagOption, digitalCardOption, physicalCardOption],
        );

    const availableAddOns = packageName ? addOnOptions[packageName] : [];

    return (
        <SharedStack>
            <SimpleGrid
                columns={{ base: 1, md: 2 }}
                gap={4}
                justifyItems="space-between"
                w="full"
            >
                {availableAddOns.map((a) => (
                    <AddOnOption key={a.title} {...a} />
                ))}
            </SimpleGrid>
        </SharedStack>
    );
}
