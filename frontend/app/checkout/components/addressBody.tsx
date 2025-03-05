import {
    Flex,
    Input,
    Stack,
    VStack,
    Text,
    Select,
    Checkbox,
    HStack,
} from "@chakra-ui/react";
import { listOfStates } from "./listOfStates";
import { useCurrentCheckout } from "@/hooks/useCheckout";
import { useState } from "react";

// Enum for the address type
export enum AddressType {
    BILLING = "Billing",
    SHIPPING = "Shipping",
}

// Props for the AddressBody component
interface AddressBodyProps {
    addressType: AddressType;
}

/**
 * This component renders a checkbox for the shipping address bottom corner. It will be checked if
 * the user marks the same shipping address as the billing address.
 * @returns {JSX.Element} - The rendered JSX element for the shipping address bottom corner checkbox
 */
export function ShippingAddressBottomCorner() {
    const { checkout, updateCheckout } = useCurrentCheckout();

    /**
     * Toggles the shipping address is billing address boolean
     */
    function toggleShippingIsBilling() {
        if (!checkout.shippingIsBilling === true) {
            updateCheckout({
                shippingIsBilling: true,
                shippingAddress: {
                    firstName: checkout.billingAddress.firstName,
                    lastName: checkout.billingAddress.lastName,
                    streetAddress: checkout.billingAddress.streetAddress,
                    unitNumber: checkout.billingAddress.unitNumber,
                    city: checkout.billingAddress.city,
                    state: checkout.billingAddress.state,
                    zipCode: checkout.billingAddress.zipCode,
                },
            });
        } else {
            updateCheckout({
                shippingIsBilling: false,
                shippingAddress: {
                    firstName: "",
                    lastName: "",
                    streetAddress: "",
                    unitNumber: "",
                    city: "",
                    state: "",
                    zipCode: "",
                },
            });
        }
    }

    return (
        <Checkbox
            variant={"checkout"}
            colorScheme="green"
            defaultChecked={checkout.shippingIsBilling}
            onChange={() => {
                toggleShippingIsBilling();
            }}
        >
            Shipping Address is Same as Billing Address
        </Checkbox>
    );
}

/**
 * This component renders the body content for the shipping information step in the checkout process.
 * @returns {JSX.Element} - The rendered JSX element for the shipping information body.
 */
export default function AddressBody({ addressType }: AddressBodyProps) {
    const [vailidStreetAdress, setVailidStreetAdress] = useState(true);

    const curCheckout = useCurrentCheckout();
    const checkout = curCheckout.checkout;

    // Should be shipping if the user is on the Shipping step. Otherwise, it should be billing
    const shippingOrBilling =
        addressType === AddressType.SHIPPING
            ? "shippingAddress"
            : "billingAddress";

    /**
     * Sets a key-value pair in the address info object in the checkout object
     * Could potentially be moved to the hook if needed elsewhere
     * @param key the key within the address info object
     * @param value the value to set for the key
     */
    function addToAddressInfo(key: string, value: string) {
        curCheckout.updateCheckout({
            [shippingOrBilling]: {
                ...checkout[shippingOrBilling],
                [key]: value,
            },
        });
    }

    /**
     * Validates the zip code and returns a formatted version of it
     * @param zipCode the zip code to validate
     * @returns the formatted zip code
     */
    function validateZipCode(zipCode: string) {
        // Remove all non-digit characters
        const digitsOnly = zipCode.replace(/\D/g, "");

        if (digitsOnly.length <= 5) {
            // If 5 or fewer digits, return as is
            return digitsOnly;
        } else if (digitsOnly.length <= 9) {
            // If more than 5 but no more than 9 digits, format as XXXXX-XXXX
            return `${digitsOnly.slice(0, 5)}-${digitsOnly.slice(5)}`;
        }

        // If more than 9 digits, truncate to 9 and format
        return `${digitsOnly.slice(0, 5)}-${digitsOnly.slice(5, 9)}`;
    }

    return (
        <Flex flexDirection="column" gap="20px">
            {/* Address input fields */}
            <Flex gap="10px" flexDirection={"column"}>
                Address*
                <Stack
                    direction={{ base: "column", md: "row" }}
                    gap={{ base: 4, md: 12 }}
                >
                    <Input
                        placeholder="Street Address"
                        value={checkout[shippingOrBilling].streetAddress}
                        variant={"checkout"}
                        borderColor={vailidStreetAdress ? "none" : "red"}
                        borderWidth={"1px"}
                        onChange={(e) => {
                            addToAddressInfo("streetAddress", e.target.value);
                        }}
                        onBlur={() => {
                            const validStreetAddress =
                                checkout.shippingAddress.streetAddress.match(
                                    /^\d+\s[A-Za-z\d]+(\s[A-Za-z\-']+){1,2}\.?$/g,
                                );
                            if (!validStreetAddress) {
                                setVailidStreetAdress(false);
                            } else {
                                setVailidStreetAdress(true);
                            }
                        }}
                        onFocus={() => {
                            setVailidStreetAdress(true);
                        }}
                    />
                    <Input
                        w={{ base: "100%", md: "70%" }}
                        placeholder="Apartment, Suite, Etc."
                        value={checkout[shippingOrBilling].unitNumber || ""}
                        variant={"checkout"}
                        onChange={(e) => {
                            addToAddressInfo("unitNumber", e.target.value);
                        }}
                    />
                </Stack>
            </Flex>

            {/* City, State, and Zip Code input fields */}
            <Flex gap="10px" flexDirection={"column"}>
                <Stack
                    direction={{ base: "column", md: "row" }}
                    gap={{ base: "20px", md: 8 }}
                >
                    {/* City input field */}
                    <VStack w="100%" align={"start"}>
                        <Text>City*</Text>
                        <Input
                            placeholder="City"
                            value={checkout[shippingOrBilling].city}
                            variant={"checkout"}
                            onChange={(e) => {
                                addToAddressInfo("city", e.target.value);
                            }}
                        />
                    </VStack>

                    <HStack
                        flexGrow={1}
                        gap={{ base: "20px", md: 8 }}
                        w={"100%"}
                    >
                        {/* State dropdown */}
                        <VStack w={{ base: "100%", md: "50%" }} align={"start"}>
                            <Text>State*</Text>
                            <Select
                                placeholder="State"
                                value={checkout[shippingOrBilling].state}
                                variant={"checkout"}
                                onChange={(e) => {
                                    addToAddressInfo("state", e.target.value);
                                }}
                                textColor={
                                    checkout[shippingOrBilling].state === ""
                                        ? "gray.400"
                                        : "white"
                                }
                                fontSize={{ base: "13px", md: "18px" }}
                                _focus={{ borderColor: "green.100" }}
                                height={{ base: "42px", md: "45px" }}
                            >
                                {/* Map over states and render options */}
                                {listOfStates.map((state) => {
                                    return (
                                        <option key={state} value={state}>
                                            {state}
                                        </option>
                                    );
                                })}
                            </Select>
                        </VStack>

                        {/* Zip Code input field */}
                        <VStack w={{ base: "100%", md: "70%" }} align={"start"}>
                            <Text>Zip Code*</Text>
                            <Input
                                type="text" // Changed to text because it was causing issues wtih restricting the length to 10 digits
                                placeholder="Zip Code"
                                value={checkout[shippingOrBilling].zipCode}
                                maxLength={10}
                                variant={"checkout"}
                                onChange={(e) => {
                                    const formattedZipCode = validateZipCode(
                                        e.target.value,
                                    );
                                    addToAddressInfo(
                                        "zipCode",
                                        formattedZipCode,
                                    );
                                }}
                            />
                        </VStack>
                    </HStack>
                </Stack>
            </Flex>
        </Flex>
    );
}
