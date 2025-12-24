"use client";

import React from "react";
import { Radio, RadioGroup, Text, Flex, Box } from "@chakra-ui/react";

interface RadioPickerProps {
    options: string[];
    value: string;
    onChange: (value: string) => void;
    variant?: string;
    excludeLabels?: string[];
}

export default function RadioPicker({
    options,
    value = "1",
    onChange,
    variant = "default",
    excludeLabels = [],
}: RadioPickerProps) {
    const includedOptions = options.filter(
        (option) => !excludeLabels.includes(option),
    );

    return (
        <Box width="100%">
            <RadioGroup
                value={value}
                onChange={onChange}
                variant={variant}
                width={"100%"}
            >
                <Flex
                    width={"100%"}
                    maxW={variant ? "100%" : "200px"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                >
                    {includedOptions.map((option, index) => (
                        <RadioButton
                            key={index}
                            label={option}
                            radioValue={index.toString()}
                            selectedValue={value}
                        />
                    ))}
                </Flex>
            </RadioGroup>
            {excludeLabels.length > 0 && <ExclusionMessage />}
        </Box>
    );
}

function RadioButton({
    radioValue,
    label,
    selectedValue,
}: {
    radioValue: string;
    label: string;
    selectedValue: string;
}) {
    const determineBoxShadow = (radioValue: string) => {
        return radioValue === selectedValue ? "0px 0px 10px #27CE00" : "none";
    };
    return (
        <Radio
            value={radioValue}
            boxShadow={determineBoxShadow(radioValue)}
            _checked={{
                backgroundColor: "green.100",
                borderColor: "green.100",
            }}
        >
            <Text
                textColor={radioValue === selectedValue ? "green.100" : "white"}
                fontSize={"14px"}
                fontWeight="medium"
            >
                {label}
            </Text>
        </Radio>
    );
}

function ExclusionMessage() {
    return (
        <Text
            color="red.500"
            fontSize="sm"
            mt={2}
            textAlign="center"
            width="100%"
        >
            Some options are excluded.
        </Text>
    );
}
