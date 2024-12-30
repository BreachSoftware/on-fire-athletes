import { Circle, Flex, Text } from "@chakra-ui/react";
import { useCurrentCheckout } from "@/hooks/useCheckout";
import AddOn from "./addOn";
import { PackageType } from "./packages";

export default function PackageDetails({ pkg }: { pkg: PackageType }) {
    const curCheckout = useCurrentCheckout();
    const checkout = curCheckout.checkout;

    const { details } = pkg;

    return (
        <Flex
            flexDirection="column"
            alignItems="flex-start"
            px={{ base: "25px", xl: "25px" }}
            pt={{ base: 0, xl: "25px" }}
            pb={{ base: "18px", xl: "25px" }}
            fontSize="14"
            h="max-content"
        >
            <Text
                fontFamily="Barlow Condensed"
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
                        <Text color="green.100" fontSize="10">
                            +
                        </Text>
                    ) : (
                        <Circle size="1" bg="green.100" />
                    )}
                    {typeof detail.text === "string" ? (
                        <Text fontFamily="Barlow Condensed" fontSize="14">
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
                            fontSize={"14"}
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
                            fontSize={"14"}
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
