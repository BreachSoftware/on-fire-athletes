import GenericSelect from "@/components/shared/generic-select";
import { Checkbox, Flex, Text } from "@chakra-ui/react";

interface AddOnProps {
    title: string; // Title of the add-on
    value: number; // How many of this add-on the user wants
    onChange: (value: number) => void; // Function to handle the change in the number of add-ons
    hidePriceStyling?: boolean;
    pricingOptions: Record<number, number>;
}

/**
 * One Add-On component in the checkout flow
 * @returns JSX.Element
 */
export default function AddOn(props: AddOnProps) {
    return (
        <>
            <Flex
                flexDirection={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
                width={"100%"}
                padding={"5px"}
                backgroundColor={"black"}
            >
                <Checkbox
                    variant={"checkoutAddOn"}
                    colorScheme={"green"}
                    isChecked={props.value > 0}
                    onChange={() => {
                        return props.onChange(props.value > 0 ? 0 : 1);
                    }}
                ></Checkbox>

                {/* Title and Price */}
                <Flex
                    flexDirection={"row"}
                    alignItems={"center"}
                    width={"100%"}
                    padding={"5px"}
                    gap={"5px"}
                >
                    <Text
                        fontFamily={"Barlow Condensed"}
                        fontSize={"16"}
                        textColor={"#F8F8F8"}
                    >
                        {props.title}
                    </Text>
                </Flex>

                <GenericSelect
                    options={Object.keys(props.pricingOptions).map((key) =>
                        parseInt(key),
                    )}
                    displayTransformer={(o) =>
                        `${o} - $${props.pricingOptions[o].toFixed(2)}`
                    }
                    selectedValue={props.value}
                    setSelectedValue={props.onChange}
                />

                {/* <Select
                    value={props.value}
                    onChange={(e) => props.onChange(parseInt(e.target.value))}
                >
                    {props.pricingOptions.map((o) => (
                        <option key={o} value={o}>
                            {o}
                        </option>
                    ))}
                </Select> */}

                {/* <HStack width="140px">
                    <Button
                        {...dec}
                        padding="0"
                        margin="0"
                        borderRadius="0"
                        backgroundColor="green.100"
                        width="24px"
                        height="24px"
                        minWidth="24px"
                        minHeight="24px"
                    >
                        <MinusIcon width={3} height={3} />
                    </Button>
                    <Input
                        {...input}
                        variant={"basicInput"}
                        padding="2px"
                        textAlign="center"
                        fontSize="sm"
                        width="40px"
                    />
                    <Button
                        {...inc}
                        padding="0"
                        margin="0"
                        borderRadius="0"
                        backgroundColor="green.100"
                        width="24px"
                        height="24px"
                        minWidth="24px"
                        minHeight="24px"
                    >
                        <AddIcon width={3} height={3} />
                    </Button>
                </HStack> */}
            </Flex>
        </>
    );
}
