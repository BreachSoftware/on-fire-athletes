import { useCurrentCheckout } from "@/hooks/useCheckout";
import useCreateNavigation from "@/hooks/useCreateNavigation";
import { Box, Divider, Flex, Text } from "@chakra-ui/react";
import React from "react";

/**
 * The navigation bar for the checkout page
 * @returns JSX.Element
 */
function NavigationBar({ buyingOtherCard }: { buyingOtherCard: boolean }) {
    const { checkout, updateCheckout } = useCurrentCheckout();
    const CREATE_PAGES = useCreateNavigation(buyingOtherCard);

    return (
        <Box>
            <Flex
                flexWrap="wrap"
                fontFamily="Barlow Condensed"
                fontSize="14px"
                gap="4px"
                letterSpacing="0.56pt"
                my="24px"
                display={{ base: "flex", md: "none" }}
            >
                {CREATE_PAGES.map((page, index) => {
                    const { name, isDisabled } = page;
                    const isCurrent = checkout.stepNum === page.stepNum;
                    const isLast = index === CREATE_PAGES.length - 1;

                    return (
                        <React.Fragment key={page.name}>
                            <Text
                                key={name}
                                color={isCurrent ? "limegreen" : "white"}
                                onClick={
                                    isDisabled
                                        ? undefined
                                        : () => {
                                              updateCheckout({
                                                  ...checkout,
                                                  stepNum: page.stepNum,
                                              });
                                          }
                                }
                            >
                                {name}
                            </Text>
                            {!isLast && <Text color="white">/</Text>}
                        </React.Fragment>
                    );
                })}
            </Flex>
            <Divider borderColor="#31453D" />
        </Box>
    );
}

/**
 * The header component for the checkout page
 * @returns JSX.Element
 */
export default function CheckoutHeader({
    buyingOtherCard,
}: {
    buyingOtherCard: boolean;
}) {
    const { isGift } = useCurrentCheckout();

    return (
        <>
            <Box
                pl={{ base: "0", md: "2" }}
                pb={{ base: "0", md: "2" }}
                bg="transparent"
            >
                <Flex
                    direction={{ base: "row", lg: "row" }}
                    justifyContent={"space-between"}
                    pl="2"
                    bg="transparent"
                    mb="14px"
                >
                    <Flex>
                        <Text
                            fontFamily="Brotherhood"
                            color="white"
                            fontWeight={"100"}
                            fontSize={{ base: "38px", md: "40px", lg: "50px" }}
                            textAlign={{ base: "center", md: "left" }}
                            letterSpacing={"3.0px"}
                        >
                            {isGift ? "Checkout - Gift" : "Checkout"}
                        </Text>
                    </Flex>
                </Flex>
                <Divider borderColor="#31453D" />
                <NavigationBar buyingOtherCard={buyingOtherCard} />
            </Box>
        </>
    );
}
