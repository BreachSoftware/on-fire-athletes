import React from "react";
import {
    Box,
    Button,
    Center,
    Circle,
    Flex,
    Grid,
    Text,
} from "@chakra-ui/react";
import { useCurrentCheckout } from "@/hooks/useCheckout";
import AddOn from "./addOn";

type PackageType = {
    title: string;
    databaseName: string;
    price: number;
    details: {
        text: string | React.ReactNode;
        indent?: boolean;
        isAddOn?: boolean;
    }[];
};

interface PackageHeaderProps {
    title: string;
    price: number;
}

function PackageHeader({ title, price }: PackageHeaderProps) {
    return (
        <Flex
            flexDirection="column"
            alignItems="flex-start"
            justifyContent="flex-start"
        >
            <Text
                fontFamily="Barlow Condensed"
                color="white"
                fontWeight="600"
                fontSize={{ base: "24px", md: "30px", xl: "32px" }}
                textAlign="center"
                transform="skew(-5deg)"
            >
                {title}
            </Text>
            <Text
                fontFamily="Barlow Condensed"
                color="green.100"
                fontSize={{ base: "24px", md: "30px", lg: "40px" }}
                fontWeight="600"
                textAlign="center"
                transform="skew(-5deg)"
            >
                ${price}
            </Text>
        </Flex>
    );
}

function PackageDetails({ pkg }: { pkg: PackageType }) {
    const curCheckout = useCurrentCheckout();
    const checkout = curCheckout.checkout;

    const { details } = pkg;

    return (
        <Flex flexDirection="column" alignItems="flex-start" p="20px">
            <Text
                fontFamily="Barlow Condensed"
                fontSize="18"
                textColor="green.200"
                marginBottom="5px"
                textDecoration="underline"
            >
                INCLUDES:
            </Text>

            {details.map((detail, index) => (
                <Flex
                    color="white"
                    key={index}
                    alignItems="center"
                    gap="10px"
                    style={{
                        paddingLeft: detail.indent ? "25px" : "0",
                    }}
                >
                    {detail.isAddOn ? (
                        <Text color="green.100">+</Text>
                    ) : (
                        <Circle size="1" bg="green.100" />
                    )}
                    {typeof detail.text === "string" ? (
                        <Text fontFamily="Barlow Condensed" fontSize="18">
                            {detail.text}
                        </Text>
                    ) : (
                        detail.text
                    )}
                </Flex>
            ))}
            {/* Add-Ons */}
            {/* We use this flex for other sections so that the bottom portion is all in the same position for the packages */}
            <Flex
                flexDirection={"column"}
                alignItems={"flex-start"}
                gap={"10px"}
                flexGrow={1}
            >
                {/* {pkg.title === "ALL-STAR" && ( */}
                {false && (
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
                                title={"Additional 5 Digital Cards"}
                                price={(checkout.digitalCardPrice * 5).toFixed(
                                    2,
                                )}
                                value={
                                    checkout.packageName === "allStar"
                                        ? checkout.digitalCardCount / 5
                                        : 0
                                }
                                onChange={(value) => {
                                    curCheckout.setCheckout({
                                        ...checkout,
                                        digitalCardCount: value * 5,
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
                                title={"Additional 5 Digital Cards"}
                                price={(checkout.digitalCardPrice * 5).toFixed(
                                    2,
                                )}
                                value={
                                    checkout.packageName === "mvp"
                                        ? checkout.digitalCardCount / 5
                                        : 0
                                }
                                onChange={(value) => {
                                    curCheckout.setCheckout({
                                        ...checkout,
                                        digitalCardCount: value * 5,
                                    });
                                }}
                            />
                        </Flex>
                    </>
                )}
            </Flex>
        </Flex>
    );
}

const ProspectInfo: PackageType = {
    title: "PROSPECT",
    databaseName: "prospect",
    price: 19.99,
    details: [
        {
            text: "1 Bag Tag of Your Card Design",
        },
        {
            text: "Build Your Own Athlete Profile",
        },
        {
            text: (
                <Text fontSize="18" fontFamily="Barlow Condensed">
                    Add Additional Bag Tags to Your Purchase{" "}
                    <Box as="span" color="green.100">
                        for Only $19.99
                    </Box>
                </Text>
            ),
        },
    ],
};

// Our Rookie Package Information
const RookieInfo: PackageType = {
    title: "ROOKIE",
    databaseName: "rookie",
    price: 29.99,
    details: [
        {
            text: "1 Physical Augmented Reality (AR) Card in Magnetic Case",
        },
        { text: "Build Your Own Athlete Profile" },
        {
            text: (
                <Text fontFamily="Barlow Condensed" fontSize="18">
                    Add Additional Physical Augmented Reality (AR) Cards{" "}
                    <Box as="span" color="green.100">
                        for Only $24.99 Each
                    </Box>
                </Text>
            ),
            isAddOn: true,
        },
        {
            text: (
                <Text fontFamily="Barlow Condensed" fontSize="18">
                    Add a Bag Tag{" "}
                    <Box as="span" color="green.100">
                        for Only $19.99
                    </Box>
                </Text>
            ),
            isAddOn: true,
        },
    ],
};

// Our All-Star Package Information
const AllStarInfo: PackageType = {
    title: "ALL-STAR",
    databaseName: "allStar",
    price: 39.99,
    details: [
        {
            text: "1 Physical Augmented Reality (AR) Card in Magnetic Case",
        },
        {
            text: "15 Digital Cards to Sell / Trade (You receive 75% of profit of cards sold)",
        },
        { text: "Build Your Own Athlete Profile" },
        {
            text: (
                <Text fontFamily="Barlow Condensed" fontSize="18">
                    Add Additional Physical Augmented Reality (AR) Cards{" "}
                    <Box as="span" color="green.100">
                        for Only $24.99 Each
                    </Box>
                </Text>
            ),
            isAddOn: true,
        },
        {
            text: (
                <Text fontFamily="Barlow Condensed" fontSize="18">
                    Add a Bag Tag{" "}
                    <Box as="span" color="green.100">
                        for Only $19.99
                    </Box>
                </Text>
            ),
            isAddOn: true,
        },
    ],
};

// Our AR Package Information
const MVPInfo: PackageType = {
    title: "MVP",
    databaseName: "mvp",
    price: 99.99,
    details: [
        {
            text: "Receive 10 Physical Cards With 3D and A/R Interactivity",
        },
        { text: "Receive 50 Digital Cards" },
        { text: "Ability to SELL and/or Trade Your Cards" },
        { text: "Athlete Receives 75% of Profits*", indent: true },
        { text: "Ability to Collect Cards" },
        { text: "Build Your Own Athlete Profile" },
    ],
};

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
            py={{ base: "24px", md: "64px" }}
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
            <Flex>
                <Grid
                    width="100%"
                    templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                    templateRows={{ base: "1fr", md: "repeat(2, 1fr)" }}
                    justifyContent="center"
                    marginTop="16px"
                    flexDir="column"
                >
                    <Flex flexDir="column" gap="16px">
                        {/* Package Box Component */}
                        {[ProspectInfo, RookieInfo, AllStarInfo].map(
                            (pkg, index) => {
                                return (
                                    <PackageBoxComponent
                                        pkg={pkg}
                                        key={index}
                                    />
                                );
                            },
                        )}
                    </Flex>
                    <PackageBoxComponent pkg={MVPInfo} />
                </Grid>
            </Flex>
        </Flex>
    );
}

function PackageBoxComponent({ pkg }: { pkg: PackageType }) {
    // Our checkout info
    const curCheckout = useCurrentCheckout();
    const checkout = curCheckout.checkout;

    // Glow effect for the selected package
    const glowEffect = "0 0 100px green";

    return (
        <Flex
            overflow="hidden"
            margin={"10px"}
            flexBasis={{ base: "100%", md: "30%" }}
            backgroundColor={"#171C1B"}
            // padding={"20px"}
            borderWidth={"2px"}
            borderColor={
                checkout.packageName === pkg.databaseName
                    ? "green.100"
                    : "transparent"
            }
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
                    packageName: pkg.databaseName as
                        | "rookie"
                        | "allStar"
                        | "mvp",
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
            flexDir="row"
            alignItems="center"
            gap={12}
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

function CheckoutButtonFooter({ pkg }: { pkg: PackageType }) {
    const curCheckout = useCurrentCheckout();
    const checkout = curCheckout.checkout;

    return (
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
                isDisabled={checkout.packageName !== pkg.databaseName}
                width={"40%"}
                onClick={() => {
                    if (checkout.packageName === "rookie") {
                        curCheckout.setCheckout({
                            ...checkout,
                            packagePrice: RookieInfo.price,
                            packageCardCount: 15,
                            physicalCardCount: 1,
                            stepNum: checkout.stepNum + 2,
                        });
                    } else if (checkout.packageName === "allStar") {
                        curCheckout.setCheckout({
                            ...checkout,
                            packagePrice: AllStarInfo.price,
                            packageCardCount: 25,
                            physicalCardCount: 5,
                            stepNum: checkout.stepNum + 1,
                            digitalCardCount: checkout.digitalCardCount,
                        });
                    } else {
                        curCheckout.setCheckout({
                            ...checkout,
                            packagePrice: MVPInfo.price,
                            packageCardCount: 50,
                            digitalCardCount: checkout.digitalCardCount,
                            // This accounts for the 5 physical cards that come with the MVP package
                            physicalCardCount: 10,
                            stepNum: checkout.stepNum + 1,
                        });
                    }
                }}
            >
                CHECKOUT
            </Button>
        </Flex>
    );
}

function SelectBanner({ isSelected }: { isSelected: boolean }) {
    return (
        <Flex
            justify="center"
            align="center"
            bg={isSelected ? "#27CE01" : "#27CE0140"}
            h="100%"
            flexDir="column"
            gap={2}
        >
            <Center pos="relative" boxSize="16px">
                <Circle
                    pos="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    size="16px"
                    bg="#6C6C6C"
                    opacity={0.28}
                    border={isSelected ? "2px solid white" : "none"}
                />
                <Circle
                    pos="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    size="10px"
                    bg={isSelected ? "white" : "#27CE01"}
                    boxShadow={isSelected ? "0px 0px 6px #27CE00" : "none"}
                />
            </Center>
            {/* "Select" text, written vertically */}
            <Text
                fontFamily="Barlow Condensed"
                color="white"
                fontSize="20px"
                fontWeight="500"
                letterSpacing="1px"
                sx={{
                    writingMode: "vertical-rl",
                    textOrientation: "mixed",
                }}
            >
                SELECT
            </Text>
        </Flex>
    );
}
