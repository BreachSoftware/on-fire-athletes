// eslint-disable-next-line no-use-before-define
import React from "react";
import { useCurrentCheckout } from "@/hooks/useCheckout";
import {
    Box,
    Image,
    Divider,
    Heading,
    Input,
    Text,
    Flex,
    Button,
    InputGroup,
    InputLeftElement,
} from "@chakra-ui/react";
import { checkoutSteps } from "./checkoutSteps";
import { ChevronRightIcon } from "@chakra-ui/icons";
import Footer from "@/app/components/footer";
import OnFireCard from "@/components/create/OnFireCard/OnFireCard";
import DemarioCard from "@/images/mockups/demario-card.png";
import { useRouter } from "next/navigation";
import { handlePurchase } from "./completeOrder/stripeHandlePurchase";
import { useAuth } from "@/hooks/useAuth";
import CheckoutInfo from "@/hooks/CheckoutInfo";

/**
 * This component is responsible for rendering the all-star price section of the checkout page.
 * @returns {JSX.Element} - The rendered JSX element for the all-star price section.
 */
export default function AllStarPrice({ isNil }: { isNil?: boolean }) {
    const curCheckout = useCurrentCheckout();
    const checkout = curCheckout.checkout;
    const stepNumber = checkout.stepNum;

    const auth = useAuth();
    const router = useRouter();

    const card = checkout.onFireCard;

    /**
     * This function checks if the key pressed is a valid input for the price
     * @param event the key press event
     */
    function checkIfPrice(event: React.KeyboardEvent<HTMLInputElement>) {
        const input = event.target as HTMLInputElement;
        const value = input.value;
        const key = event.key;

        /**
         * Allowing: Integers | Decimal Numbers | Backspace | Tab | Delete | Left & Right arrow keys
         **/
        const regex = new RegExp(
            /^[0-9]$|^\.|^Backspace$|^Tab$|^Delete$|^ArrowLeft$|^ArrowRight$/,
        );

        // Prevent default if key doesn't match allowed pattern
        if (!key.match(regex)) {
            event.preventDefault();
        }

        // If key is a number or a dot, validate decimal places
        if (key.match(/^[0-9]$|^\.$/)) {
            const newValue = value + key;

            // Check if new value has more than 2 decimal places
            if (newValue.includes(".")) {
                const decimalPart = newValue.split(".")[1];
                if (decimalPart && decimalPart.length > 2) {
                    event.preventDefault();
                }
            }
        }

        // limit price to 10,000 dollars
        if (parseFloat(value + key) > 10000.0) {
            event.preventDefault();
        }
    }

    return (
        <>
            <Flex
                bgColor={{ base: "transparent", sm: "transparent" }}
                w="100%"
                h="full"
                justifyContent="center"
                alignItems="center"
                flexDir="column"
                fontSize="3xl"
                fontWeight="bold"
                color="white"
            >
                <Flex
                    w="100%"
                    flex={1}
                    margin="0 auto"
                    justifyContent={{ base: "top", md: "center" }}
                    alignItems={{ base: "top", md: "center" }}
                    flexDirection="column"
                    paddingX={{ base: "15px", md: "50px", xl: "100px" }}
                    paddingY={{ base: "20px", md: "64px" }}
                >
                    <Flex
                        flex={1}
                        w="full"
                        flexDirection={{ base: "column", lg: "row" }}
                        alignItems="center"
                        justifyContent="center"
                        gap={{ base: "30px", md: "50px", xl: "100px" }}
                    >
                        {/* Image of the card, with various size adjustments for different screen sizes */}
                        {card ? (
                            <Box display={{ base: "none", md: "inline" }}>
                                <OnFireCard card={card} slim />
                            </Box>
                        ) : (
                            <Image
                                src={DemarioCard.src}
                                alt="Your Card"
                                width={{ base: 150, md: 200, xl: 350 }}
                                height={{ base: 225, md: 300, xl: 500 }}
                                mt={"1%"}
                                transform={"rotate(348deg)"}
                                zIndex={1}
                            />
                        )}

                        <Flex flexDirection={"column"} gap="25px">
                            <Flex
                                alignItems={{ base: "center", sm: "start" }}
                                flexDirection={"column"}
                                gap={{ base: "10px", md: "0px" }}
                            >
                                <Heading
                                    fontFamily="Brotherhood"
                                    color="white"
                                    fontWeight={"100"}
                                    fontSize={{ base: "48px", lg: "76px" }}
                                    letterSpacing={{
                                        base: "2.4px",
                                        lg: "3.8px",
                                    }}
                                >
                                    Nice Choice!
                                </Heading>
                                <Heading
                                    color={"green.200"}
                                    fontStyle={"italic"}
                                    fontSize={{ base: "22px", lg: "30px" }}
                                    fontFamily={"Barlow Condensed"}
                                    fontWeight={600}
                                >
                                    YOU&apos;VE SELECTED THE ALL-STAR PACKAGE
                                </Heading>
                            </Flex>
                            <Divider borderWidth={2} borderColor="gray.1700" />
                            <Flex
                                // pl="2"
                                bg="#171C1B"
                                flexDirection={"column"}
                                gap="20px"
                                padding={{ base: "25px", sm: "50px" }}
                                paddingX={{ base: "40px", sm: undefined }}
                                maxW={{ base: "none", md: "700px" }}
                                borderRadius="13px"
                                boxShadow={"0 0 25px black"}
                            >
                                <Heading
                                    letterSpacing={"1.3px"}
                                    transform={"skew(-7deg)"}
                                    fontSize={"26px"}
                                    fontFamily={"Barlow Condensed"}
                                    fontWeight={600}
                                >
                                    Set Your Price
                                </Heading>
                                <InputGroup size="lg">
                                    <InputLeftElement
                                        pointerEvents="none"
                                        color="white"
                                        opacity="1"
                                        fontStyle="italic"
                                        fontFamily={"Barlow Condensed"}
                                        fontWeight={400}
                                        paddingTop={{
                                            base: "16px",
                                            md: "12px",
                                        }}
                                        paddingLeft={{
                                            base: "13px",
                                            md: "10px",
                                        }}
                                        fontSize={"27px"}
                                        letterSpacing={"0.1rem"}
                                    >
                                        $
                                    </InputLeftElement>
                                    {/* Input for the price, with validation to ensure correct format */}
                                    <Input
                                        variant={"basicInput"}
                                        placeholder="20.00*"
                                        paddingLeft={{
                                            base: "36px",
                                            md: "33px",
                                        }}
                                        _placeholder={{
                                            color: "white",
                                            fontFamily: "Barlow Condensed",
                                            fontWeight: 400,
                                            fontSize: "28px",
                                            fontStyle: "italic",
                                            letterSpacing: "0.1rem",
                                        }}
                                        _focusVisible={{
                                            opacity:
                                                curCheckout.checkout
                                                    .cardPrice === ""
                                                    ? ".65"
                                                    : "1",
                                        }}
                                        fontSize={"28px"}
                                        textAlign={"left"}
                                        fontStyle={"italic"}
                                        fontFamily={"Barlow Condensed"}
                                        fontWeight={400}
                                        height={{ base: "65px", md: "60px" }}
                                        backgroundColor={{
                                            base: "#121212",
                                            md: "#303c3a",
                                        }}
                                        value={checkout.cardPrice || ""}
                                        letterSpacing={"0.1rem"}
                                        borderColor={"transparent"}
                                        onKeyDown={(e) => {
                                            checkIfPrice(e);
                                        }}
                                        onChange={(e) => {
                                            curCheckout.setCheckout({
                                                ...curCheckout.checkout,
                                                cardPrice: e.target.value,
                                            });
                                        }}
                                        _focus={{
                                            boxShadow: "none",
                                            borderColor: "transparent",
                                        }}
                                    />
                                </InputGroup>
                                <Text
                                    p={{ base: "2px" }}
                                    fontSize={{ base: "14px", md: "18px" }}
                                    fontWeight={"medium"}
                                    fontStyle={"italic"}
                                    color={"white"}
                                    fontFamily={"Barlow"}
                                    letterSpacing={"0.28px"}
                                    mb="15px"
                                >
                                    *Digital cards must be priced at a minimum
                                    of $20.00. Shipping & Handling fee of $5.00
                                    will be added.
                                </Text>
                            </Flex>
                        </Flex>
                    </Flex>
                    <Flex
                        w={"100%"}
                        maxW={{ md: "1175px" }}
                        alignItems={{ base: "center", md: "flex-end" }}
                        flexDirection={"column"}
                        gap="25px"
                    >
                        <Divider
                            alignSelf={"center"}
                            marginTop={{ base: "25px" }}
                            zIndex={0}
                            borderWidth={2}
                            borderColor="gray.1700"
                        />
                        <Flex
                            justifyContent={"center"}
                            gap="20px"
                            mr={{ md: "40px" }}
                            pb={{ base: "32px", md: 0 }}
                        >
                            {/* Back button to go to the previous step */}
                            {!isNil && (
                                <Button
                                    variant={"back"}
                                    width="100px"
                                    onClick={() => {
                                        curCheckout.setCheckout({
                                            ...curCheckout.checkout,
                                            stepNum: stepNumber - 1,
                                        });
                                    }}
                                >
                                    Back
                                </Button>
                            )}
                            {/* Next button to proceed to the next step, disabled if the price is below $20 */}
                            <Button
                                variant="next"
                                w="115px"
                                _hover={{
                                    md: {
                                        filter: "drop-shadow(0px 0px 5px #27CE00)",
                                        width: "115px",
                                    },
                                }}
                                isDisabled={
                                    parseFloat(
                                        checkout.cardPrice.toString() || "0",
                                    ) < 20
                                }
                                onClick={async () => {
                                    if (isNil) {
                                        const cardPrice = parseFloat(
                                            checkout.cardPrice,
                                        ).toFixed(2);

                                        const newCheckout: CheckoutInfo = {
                                            ...checkout,
                                            cardPrice,
                                            packageCardCount: 50,
                                        };

                                        curCheckout.setCheckout(newCheckout);

                                        await handlePurchase(
                                            newCheckout,
                                            card,
                                            null,
                                            router,
                                            false,
                                            auth,
                                            undefined,
                                            true,
                                        );
                                    } // Increment the step number to go to the next step, up to the last step
                                    else if (
                                        stepNumber >= 0 &&
                                        stepNumber < checkoutSteps.length - 1
                                    ) {
                                        curCheckout.setCheckout({
                                            ...checkout,
                                            cardPrice: parseFloat(
                                                checkout.cardPrice,
                                            ).toFixed(2),
                                            stepNum: stepNumber + 1,
                                        });
                                    }
                                }}
                            >
                                <Flex alignItems={"center"}>
                                    {/* Change button text based on whether it's the last step */}
                                    Next
                                    <ChevronRightIcon
                                        boxSize={"30px"}
                                        mr={"-10px"}
                                    />
                                </Flex>
                            </Button>
                        </Flex>
                    </Flex>
                </Flex>

                <Box
                    w="full"
                    justifySelf="flex-end"
                    display={{ base: "inline", md: "none" }}
                >
                    <Footer />
                </Box>
            </Flex>
        </>
    );
}
