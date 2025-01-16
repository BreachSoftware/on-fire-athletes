"use client";
import React from "react";
import {
    VStack,
    Box,
    Text,
    Accordion,
    AccordionButton,
    AccordionItem,
    AccordionPanel,
    useBreakpointValue,
} from "@chakra-ui/react";
import Item from "@/components/cart_items/item";
import TradingCardInfo from "@/hooks/TradingCardInfo";
import { useCurrentCheckout } from "@/hooks/useCheckout";
import { JSX, SVGProps } from "react";
import SharedStack from "@/components/shared/wrappers/shared-stack";
import {
    BAG_TAG_ADD_ON_TITLE,
    DIGITAL_ADD_ON_TITLE,
    PHYSICAL_ADD_ON_TITLE,
} from "./checkout-add-ons/constants";

interface CheckoutItemsAttributes {
    title: string;
    card: TradingCardInfo | null;
    numberOfCards: number;
    numberOfOrders: number;
    price: number;
    itemType?: "card" | "bag tag" | "package";
    multiplier?: number;
}
interface CheckoutItemsInCartProps {
    items: CheckoutItemsAttributes[];
    buyingOtherCard: boolean;
}

/**
 * The component that shows the items in the cart on the checkout page
 * @param items The items in the cart
 * @returns JSX.Element
 */
export function ItemsInCartComponent({
    items,
}: {
    items: CheckoutItemsAttributes[];
}) {
    return (
        <VStack>
            {items.map((item, index) => {
                // If the item is a physical or digital card, allow the user to edit or remove it
                // Otherwise, don't allow the user to edit or remove the item
                const isAddOn = [
                    DIGITAL_ADD_ON_TITLE,
                    PHYSICAL_ADD_ON_TITLE,
                    BAG_TAG_ADD_ON_TITLE,
                ].includes(item.title);

                return (
                    <Item
                        key={index}
                        title={item.title}
                        card={item.card}
                        numberOfCards={item.numberOfCards}
                        numberOfOrders={item.numberOfOrders}
                        itemType={item.itemType}
                        price={item.price}
                        canEdit={false}
                        canRemove={isAddOn}
                        multiplier={item.multiplier}
                    />
                );
            })}
        </VStack>
    );
}

/**
 * The component that shows the items in the cart on the checkout page
 * @returns JSX.Element
 */
export default function CheckoutItemsInCart(props: CheckoutItemsInCartProps) {
    const curCheckout = useCurrentCheckout();

    const isMobile = useBreakpointValue({ base: true, lg: false });

    /**
     * thin Accordion Icon
     * @param props
     * @returns
     */
    function ThinChevronIcon(
        props: JSX.IntrinsicAttributes &
            SVGProps<SVGSVGElement> & { rotation?: string },
    ) {
        return (
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#27CE00"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transform: props.rotation }}
                {...props}
            >
                <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
        );
    }

    return (
        <>
            <SharedStack
                w="100%"
                p={4}
                bg="#171C1B"
                alignItems="flex-start"
                justifyContent={"space-between"}
                h="495px"
                overflowY="auto"
                roundedBottom="xl"
                overflowX="hidden"
                css={{
                    // Getting rid of default scrollbar
                    msOverflowStyle: "none",
                    // Creating custom scrollbar.
                    // Unfortunately the colors from themes don't work here so you have to hard code
                    "&::-webkit-scrollbar": { width: "0.75rem" },
                    "&::-webkit-scrollbar-track": {
                        backgroundColor: "#1E2423",
                        borderRadius: "5rem",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "#2A302F",
                        borderRadius: "5rem",
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                        backgroundColor: "#363C3B",
                    },
                }}
                display={{ base: "none", lg: "flex" }}
            >
                <ItemsInCartComponent items={props.items} />
                <ShippingAndHandlingItem />
            </SharedStack>
            {curCheckout.checkout.stepNum !== 5 ? (
                <Accordion
                    color={"#31453D"}
                    borderBottom={"2px"}
                    borderTop={"2px"}
                    allowToggle
                    display={{ base: "block", lg: "none" }}
                    defaultIndex={isMobile ? undefined : 0}
                >
                    <AccordionItem>
                        {({ isExpanded }) => {
                            return (
                                <>
                                    <AccordionButton>
                                        <Text
                                            fontWeight={200}
                                            fontSize={"26px"}
                                            fontStyle={"italic"}
                                            color={"white"}
                                            fontFamily={"Barlow Condensed"}
                                            as="span"
                                            flex="1"
                                            textAlign="left"
                                        >
                                            Items in Cart ({props.items.length})
                                        </Text>
                                        <Box
                                            as={ThinChevronIcon}
                                            boxSize="15%"
                                            color="green.400"
                                            rotation={
                                                isExpanded
                                                    ? "rotate(180deg)"
                                                    : "rotate(0deg)"
                                            }
                                            transition="transform 0.2s"
                                            sx={{
                                                "& svg": {
                                                    strokeWidth: "1px",
                                                    fill: "none",
                                                    stroke: "currentColor",
                                                },
                                            }}
                                        />
                                    </AccordionButton>
                                    <AccordionPanel color={"white"} pb={4}>
                                        <ItemsInCartComponent
                                            items={props.items}
                                        />
                                        {/* <VStack textColor={"white"}>
										{props.items.map((item, index) => {
											let canEdit = false;
											let canRemove = false;

											// If the item is a physical or digital card, allow the user to edit or remove it
											// Otherwise, don't allow the user to edit or remove the item
											if (item.title.startsWith("Physical") || item.title.startsWith("Digital")) {
												canEdit = true;
												canRemove = true;
											}
											return (
												<Item
													key={index}
													title={item.title}
													card={item.card}
													numberOfCards={item.numberOfCards}
													numberOfOrders={item.numberOfOrders}
													price={item.price}
													canEdit={canEdit}
													canRemove={canRemove}
												/>
											);
										})}
									</VStack> */}
                                    </AccordionPanel>
                                </>
                            );
                        }}
                    </AccordionItem>
                </Accordion>
            ) : (
                <></>
            )}
        </>
    );
}

export function ShippingAndHandlingItem({
    isUnderTotal = false,
}: {
    isUnderTotal?: boolean;
}) {
    const { checkout } = useCurrentCheckout();
    const { shippingCost } = checkout;

    if (shippingCost <= 0) {
        return <></>;
    }

    return (
        <Text
            fontFamily={"Barlow Semi Condensed"}
            fontWeight={"bold"}
            fontSize={"xs"}
            color={"#808080"}
            transform={"skew(-10deg)"}
        >
            {isUnderTotal
                ? `* Includes S&H: $${shippingCost}`
                : `* Shipping & Handling: $${shippingCost}`}
        </Text>
    );
}
