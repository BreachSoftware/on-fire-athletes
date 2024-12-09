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
    const determineBoxShadow = (radioValue: string) => {
        return radioValue === value ? "0px 0px 10px #27CE00" : "none";
    };

    const createButton = (radioValue: string, label: string) => (
        <Radio
            value={radioValue}
            boxShadow={determineBoxShadow(radioValue)}
            _checked={{
                backgroundColor: "green.100",
                borderColor: "green.100",
            }}
        >
            <Text
                textColor={radioValue === value ? "green.100" : "white"}
                fontSize={"14px"}
                fontWeight="medium"
            >
                {label}
            </Text>
        </Radio>
    );

    const filterButtons = options
        .filter((option) => !excludeLabels.includes(option))
        .map((option, index) => createButton(index.toString(), option));

    const exclusionMessage = excludeLabels.length > 0 && (
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

    return (
        <Box width="100%">
            <RadioGroup
                value={value}
                onChange={(value) => onChange?.(value)}
                variant={variant}
                width={"100%"}
            >
                <Flex
                    width={"100%"}
                    maxW={variant ? "100%" : "200px"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                >
                    {filterButtons}
                </Flex>
            </RadioGroup>
            {exclusionMessage}
        </Box>
    );
}
