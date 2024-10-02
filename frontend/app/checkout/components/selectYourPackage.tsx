import { Button, Divider, Flex, Text } from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { useCurrentCheckout } from "@/hooks/useCheckout";
import AddOn from "./addOn";

/**
 * This component is responsible for rendering the select your package section of the checkout page.
 */
export default function SelectYourPackage() {
    // Our checkout info
    const curCheckout = useCurrentCheckout();
    const checkout = curCheckout.checkout;

    // Our Rookie Package Information
    const RookieInfo = {
        title: "ROOKIE",
        databaseName: "rookie",
        subtitle: "",
        price: 29.99,
        details: [
            {
                text: "Receive 1 Physical Card With 3D and A/R Interactivity",
                indent: false,
            },
            { text: "Receive 15 Digital Cards", indent: false },
            { text: "Ability to Trade Cards", indent: false },
            { text: "Ability to Collect Cards", indent: false },
            { text: "Build Your Own Athlete Profile", indent: false },
        ],
    };

    // Our All-Star Package Information
    const AllStarInfo = {
        title: "ALL-STAR",
        databaseName: "allStar",
        subtitle: "",
        price: 49.99,
        details: [
            {
                text: "Receive 5 Physical Cards With 3D and A/R Interactivity",
                indent: false,
            },
            { text: "Receive 25 Digital Cards", indent: false },
            { text: "Ability to SELL or Trade Your Cards", indent: false },
            { text: "Athlete Receives 75% of Profits*", indent: true },
            { text: "Ability to Collect Cards", indent: false },
            { text: "Build Your Own Athlete Profile", indent: false },
        ],
    };

    // Our AR Package Information
    const MVPInfo = {
        title: "MVP",
        databaseName: "mvp",
        subtitle: "",
        price: 79.99,
        details: [
            {
                text: "Receive 10 Physical Cards With 3D and A/R Interactivity",
                indent: false,
            },
            { text: "Receive 25 Digital Cards", indent: false },
            { text: "Ability to SELL or Trade Your Cards", indent: false },
            { text: "Athlete Receives 75% of Profits*", indent: true },
            { text: "Ability to Collect Cards", indent: false },
            { text: "Build Your Own Athlete Profile", indent: false },
        ],
    };

    // Glow effect for the selected package
    const glowEffect = "0 0 100px green";

    return (
        <Flex
            width={"100%"}
            justifyContent={"center"}
            alignItems={"center"}
            flexDirection={"column"}
            userSelect={"none"}
            paddingX={"40px"}
            marginTop={"-12.5px"}
        >
            {/* Header */}
            <Text
                fontFamily="Brotherhood"
                color="white"
                fontWeight={"100"}
                width={"100%"}
                fontSize={{ base: "35px", sm: "40px", md: "50px", lg: "60px" }}
                textAlign={{ base: "center", md: "left" }}
                letterSpacing={"3.0px"}
            >
                Select Your Package
            </Text>

            {/* Package Options */}
            <Flex
                width={"100%"}
                justifyContent={"center"}
                marginTop={"10px"}
                wrap={"wrap"}
            >
                {/* Package Box Component */}
                {[RookieInfo, AllStarInfo, MVPInfo].map((pkg, index) => {
                    return (
                        <Flex
                            key={index}
                            margin={"10px"}
                            flexBasis={{ base: "100%", md: "30%" }}
                            backgroundColor={"#171C1B"}
                            padding={"20px"}
                            flexDirection={"column"}
                            borderWidth={"2px"}
                            borderColor={
                                checkout.packageName === pkg.databaseName
                                    ? "green.100"
                                    : "transparent"
                            }
                            boxShadow={
                                checkout.packageName === pkg.databaseName
                                    ? glowEffect
                                    : "none"
                            }
                            zIndex={
                                checkout.packageName === pkg.databaseName
                                    ? 0
                                    : 1
                            }
                            borderRadius={"10px"}
                            onClick={() => {
                                // If the package is already selected, do nothing
                                if (checkout.packageName === pkg.databaseName) {
                                    return;
                                }
                                // Otherwise, set the package name in the checkout object
                                curCheckout.setCheckout({
                                    ...checkout,
                                    packageName: pkg.databaseName as
                                        | "rookie"
                                        | "allStar"
                                        | "mvp",
                                });
                            }}
                            cursor={"pointer"}
                            transition={
                                "border-color 0.2s, box-shadow 0.2s, background-color 0.2s"
                            }
                            _hover={{
                                md: {
                                    backgroundColor:
                                        checkout.packageName !==
                                        pkg.databaseName
                                            ? "#1C2421"
                                            : "#171C1B",
                                    borderColor:
                                        checkout.packageName !==
                                        pkg.databaseName
                                            ? "green.300"
                                            : "green.100",
                                },
                            }}
                        >
                            {/* Header and Price */}
                            <Flex
                                flexDirection={"row"}
                                alignItems={"center"}
                                justifyContent={"space-between"}
                            >
                                <Text
                                    fontFamily="Barlow Condensed"
                                    color="white"
                                    fontSize={{
                                        base: "20px",
                                        sm: "25px",
                                        md: "30px",
                                        xl: "40px",
                                    }}
                                    textAlign={"center"}
                                    transform={"skew(-5deg)"}
                                >
                                    {pkg.title}
                                </Text>
                                <Text
                                    fontFamily="Barlow Condensed"
                                    color="green.100"
                                    fontSize={{
                                        base: "15px",
                                        sm: "20px",
                                        md: "25px",
                                        lg: "30px",
                                    }}
                                    textAlign={"center"}
                                    transform={"skew(-5deg)"}
                                >
                                    ${pkg.price}
                                </Text>
                            </Flex>

                            {/* Subtitle */}
                            {pkg.subtitle && (
                                <Text
                                    fontFamily={"Barlow Condensed"}
                                    fontSize={"14"}
                                    color={"#F8F8F8"}
                                    textAlign={"left"}
                                    transform={"skew(-5deg)"}
                                    marginBottom={"10px"}
                                >
                                    {pkg.subtitle}
                                </Text>
                            )}

                            <Divider
                                borderWidth={2}
                                borderColor="#000000"
                                marginY="10px"
                            />

                            {/* Bullet Points */}
                            <Flex
                                flexDirection={"column"}
                                alignItems={"flex-start"}
                            >
                                <Text
                                    fontFamily={"Barlow Condensed"}
                                    fontSize={"18"}
                                    textColor={"#F8F8F8"}
                                    marginBottom={"5px"}
                                >
                                    INCLUDES:
                                </Text>

                                {pkg.details.map((detail, index) => {
                                    return (
                                        <Flex
                                            key={index}
                                            alignItems={"center"}
                                            gap={"10px"}
                                            style={{
                                                paddingLeft: detail.indent
                                                    ? "25px"
                                                    : "0",
                                            }}
                                        >
                                            <CheckIcon color={"green.100"} />
                                            <Text
                                                fontFamily={"Barlow Condensed"}
                                                fontSize={"18"}
                                            >
                                                {detail.text}
                                            </Text>
                                        </Flex>
                                    );
                                })}
                            </Flex>

                            <Divider
                                borderWidth={2}
                                borderColor="#000000"
                                marginY="10px"
                            />

                            {/* Add-Ons */}
                            {/* We use this flex for other sections so that the bottom portion is all in the same position for the packages */}
                            <Flex
                                flexDirection={"column"}
                                alignItems={"flex-start"}
                                gap={"10px"}
                                flexGrow={1}
                            >
                                {pkg.title === "ALL-STAR" && (
                                    <>
                                        <Text
                                            fontFamily={"Barlow Condensed"}
                                            fontSize={"16"}
                                            textColor={"#F8F8F8"}
                                        >
                                            ADD-ONS:
                                        </Text>

                                        {/* Add-Ons for MVP Package */}

                                        <Flex
                                            flexDirection={"column"}
                                            alignItems={"center"}
                                            width={"100%"}
                                            gap={"10px"}
                                        >
                                            <AddOn
                                                title={
                                                    "Additional 5 Digital Cards"
                                                }
                                                price={(
                                                    checkout.digitalCardPrice *
                                                    5
                                                ).toFixed(2)}
                                                value={
                                                    checkout.packageName ===
                                                    "allStar"
                                                        ? checkout.digitalCardCount /
                                                          5
                                                        : 0
                                                }
                                                onChange={(value) => {
                                                    curCheckout.setCheckout({
                                                        ...checkout,
                                                        digitalCardCount:
                                                            value * 5,
                                                    });
                                                }}
                                            />
                                        </Flex>
                                    </>
                                )}
                                {pkg.title === "MVP" && (
                                    <>
                                        <Text
                                            fontFamily={"Barlow Condensed"}
                                            fontSize={"16"}
                                            textColor={"#F8F8F8"}
                                        >
                                            ADD-ONS:
                                        </Text>

                                        {/* Add-Ons for MVP Package */}

                                        <Flex
                                            flexDirection={"column"}
                                            alignItems={"center"}
                                            width={"100%"}
                                            gap={"10px"}
                                        >
                                            <AddOn
                                                title={
                                                    "Additional 5 Digital Cards"
                                                }
                                                price={(
                                                    checkout.digitalCardPrice *
                                                    5
                                                ).toFixed(2)}
                                                value={
                                                    checkout.packageName ===
                                                    "mvp"
                                                        ? checkout.digitalCardCount /
                                                          5
                                                        : 0
                                                }
                                                onChange={(value) => {
                                                    curCheckout.setCheckout({
                                                        ...checkout,
                                                        digitalCardCount:
                                                            value * 5,
                                                    });
                                                }}
                                            />
                                        </Flex>
                                    </>
                                )}
                            </Flex>

                            {/* Footer Price and Checkout Button */}
                            <Flex
                                flexDirection={"row"}
                                alignItems={"center"}
                                justifyContent={"space-between"}
                                marginTop={"20px"}
                                width={"100%"}
                                paddingLeft="15px"
                            >
                                <Text
                                    fontFamily={"Barlow Condensed"}
                                    fontSize={"24"}
                                    textColor={"#F8F8F8"}
                                >
                                    Subtotal: $
                                    {checkout.packageName === pkg.databaseName
                                        ? (
                                              pkg.price +
                                              checkout.digitalCardCount *
                                                  checkout.digitalCardPrice +
                                              checkout.physicalCardCount *
                                                  checkout.physicalCardPrice
                                          ).toFixed(2)
                                        : pkg.price}
                                </Text>

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
                                        checkout.packageName !==
                                        pkg.databaseName
                                    }
                                    width={"40%"}
                                    onClick={() => {
                                        if (checkout.packageName === "rookie") {
                                            curCheckout.setCheckout({
                                                ...checkout,
                                                packagePrice: RookieInfo.price,
                                                packageCardCount: 15,
                                                // There are no digital card add-ons for the Rookie package
                                                digitalCardCount: 0,
                                                stepNum: checkout.stepNum + 2,
                                            });
                                        } else if (
                                            checkout.packageName === "allStar"
                                        ) {
                                            curCheckout.setCheckout({
                                                ...checkout,
                                                packagePrice: AllStarInfo.price,
                                                packageCardCount: 15,
                                                physicalCardCount: 1,
                                                stepNum: checkout.stepNum + 1,
                                            });
                                        } else {
                                            curCheckout.setCheckout({
                                                ...checkout,
                                                packagePrice: MVPInfo.price,
                                                packageCardCount: 25,
                                                digitalCardCount:
                                                    checkout.digitalCardCount,
                                                // This accounts for the 5 physical cards that come with the MVP package
                                                physicalCardCount:
                                                    checkout.physicalCardCount +
                                                    5,
                                                stepNum: checkout.stepNum + 1,
                                            });
                                        }
                                    }}
                                >
                                    CHECKOUT
                                </Button>
                            </Flex>
                        </Flex>
                    );
                })}
            </Flex>
        </Flex>
    );
}
