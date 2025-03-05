import SharedStack from "@/components/shared/wrappers/shared-stack";
import CheckoutInfo, { DatabasePackageNames } from "@/hooks/CheckoutInfo";
import { useCurrentCheckout } from "@/hooks/useCheckout";
import React, { useMemo } from "react";
import { AddOnOptionType } from "./add-on-option";
import { packages } from "../selectYourPackage/packages";
import { SimpleGrid } from "@chakra-ui/react";
import { useAuth } from "@/hooks/useAuth";
import {
    BAG_TAG_ADD_ON_TITLE,
    DIGITAL_ADD_ON_TITLE,
    PHYSICAL_ADD_ON_TITLE,
} from "./constants";
import AddOnOptionDetailed from "./add-on-option-detailed";
import {
    BAG_TAG_PRICES,
    DIGITAL_CARD_PRICES,
    PHYSICAL_CARD_PRICES,
} from "@/utils/constants";

export default function CheckoutAddOns() {
    const { isSubscribed } = useAuth();
    const { checkout, updateCheckout } = useCurrentCheckout();
    const { packageName, bagTagCount, digitalCardCount, physicalCardCount } =
        checkout;

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
            title: "Additional Bag Tag",
            value: bagTagCount - defaultBagTagCount,
            onChange: (value) => {
                const price = BAG_TAG_PRICES[value];

                updateCheckout({
                    bagTagCount: value + defaultBagTagCount,
                    ...getCartUpdate(
                        BAG_TAG_ADD_ON_TITLE,
                        value,
                        "bag tag",
                        price,
                    ),
                });
            },
            pricingOptions: [1, 2, 3, 4, 5],
        }),
        [defaultBagTagCount, checkout.cart],
    );

    // NOTE: we don't need to adjust for defaults because the default is saved on packageCardCount
    const digitalCardOption: AddOnOptionType = useMemo(
        () => ({
            title: "Additional 5 Digital Cards",
            price: "$1.00 / 5 cards",
            value: digitalCardCount,
            onChange: (value) => {
                const price = DIGITAL_CARD_PRICES[value];

                updateCheckout({
                    digitalCardCount: value,
                    ...getCartUpdate(
                        DIGITAL_ADD_ON_TITLE,
                        value,
                        "card",
                        price,
                    ),
                });
            },
            hidePriceStyling: true,
            pricingOptions: Array.from({ length: 20 }, (_, i) => 25 + i * 25),
        }),
        [digitalCardCount, checkout.cart],
    );

    const phsyicalCardDisplayPrice = isSubscribed
        ? `$14.99/ea ($9.99/ea after 6)`
        : `$24.99/ea`;

    const physicalCardOption: AddOnOptionType = useMemo(
        () => ({
            title: "Additional Physical AR Card",
            price: phsyicalCardDisplayPrice,
            value: physicalCardCount - defaultPhysicalCardCount,
            onChange: (value) => {
                const price = PHYSICAL_CARD_PRICES[value];

                updateCheckout({
                    physicalCardCount: value + defaultPhysicalCardCount,
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
        [defaultPhysicalCardCount, checkout.cart],
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
                    <AddOnOptionDetailed key={a.title} {...a} />
                ))}
            </SimpleGrid>
        </SharedStack>
    );
}
