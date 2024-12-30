import { MinusIcon, AddIcon } from "@chakra-ui/icons";
import {
    Button,
    Checkbox,
    Flex,
    HStack,
    Input,
    Text,
    useNumberInput,
} from "@chakra-ui/react";

interface AddOnProps {
    title: string; // Title of the add-on
    price: string; // Price of one add-on
    value: number; // How many of this add-on the user wants
    onChange: (value: number) => void; // Function to handle the change in the number of add-ons
}

/**
 * One Add-On component in the checkout flow
 * @returns JSX.Element
 */
export default function AddOn(props: AddOnProps) {
    const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
        useNumberInput({
            step: 1,
            defaultValue: 0,
            min: 0,
            max: 99,
            value: props.value,
            onChange: (valueString) => {
                return props.onChange(parseInt(valueString));
            },
        });

    const inc = getIncrementButtonProps();
    const dec = getDecrementButtonProps();
    const input = getInputProps();

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
                    <Text
                        fontFamily={"Barlow Condensed"}
                        fontSize={"16"}
                        textColor={"green.100"}
                    >
                        ${props.price}/ea.
                    </Text>
                </Flex>

                <HStack width="140px">
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
                </HStack>
            </Flex>
        </>
    );
}
