import React from "react";
import { Flex, Grid, Text } from "@chakra-ui/react";

import { useCurrentCheckout } from "@/hooks/useCheckout";
import PackageHeader from "@/app/checkout/components/selectYourPackage/packageHeader";
import PackageDetails from "@/app/checkout/components/selectYourPackage/packageDetails";
import { PackageType } from "@/app/checkout/components/selectYourPackage/packages";
import { packages } from "@/app/checkout/components/selectYourPackage/packages";
import CheckoutButtonFooter from "@/app/checkout/components/selectYourPackage/checkoutButtonFooter";
import SelectBanner from "./selectBanner";
import SharedStack from "@/components/shared/wrappers/shared-stack";
/**
 * This component is responsible for rendering the select your package section of the checkout page.
 */
export default function SelectYourPackage() {
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
            <Text
                fontFamily="Brotherhood"
                color="white"
                fontWeight={"100"}
                width={"100%"}
                fontSize={{ base: "35px", sm: "40px", md: "50px", lg: "76px" }}
                textAlign={{ base: "center", md: "left" }}
                letterSpacing={"3.0px"}
            >
                Select A Package
            </Text>

            {/* Package Options */}
            <SharedStack>
                <Grid
                    width="100%"
                    templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                    templateRows="1fr"
                    justifyContent="center"
                    marginTop="16px"
                    flexDir="column"
                >
                    <Flex flexDir="column" gap="16px">
                        {/* Package Box Component */}
                        {[
                            packages.prospect,
                            packages.rookie,
                            packages.allStar,
                        ].map((pkg, index) => {
                            return (
                                <PackageBoxComponent pkg={pkg} key={index} />
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

function PackageBoxComponent({ pkg }: { pkg: PackageType }) {
    // Our checkout info
    const curCheckout = useCurrentCheckout();
    const checkout = curCheckout.checkout;

    // Glow effect for the selected package
    const glowEffect = "0 0 16px #27CE00";

    return (
        <Flex
            overflow="hidden"
            margin={"10px"}
            flexBasis={{ base: "100%", md: "30%" }}
            backgroundColor={"#171C1B"}
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
                curCheckout.setCheckout({
                    ...checkout,
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
        >
            {/* Select Banner */}
            <SelectBanner
                isSelected={checkout.packageName === pkg.databaseName}
            />

            {/* Header and Price */}
            <PackageHeader title={pkg.title} price={pkg.price} />

            {/* Bullet Points */}
            <PackageDetails pkg={pkg} />
        </Flex>
    );
}
