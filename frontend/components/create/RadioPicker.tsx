"use client";

import React from "react";
import { Radio, RadioGroup, Text, Flex } from "@chakra-ui/react";

interface RadioPickerProps {
    option1text: string;
    option2text: string;
    option3text: string;
    value: string;
    onChange: (value: string) => void;
    variant?: string;
}

export default function RadioPicker({
    option1text,
    option2text,
    option3text,
    value = "1",
    onChange,
    variant = "default",
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

    return (
        <RadioGroup
            value={value}
            onChange={(value) => onChange?.(value)}
            variant={variant}
            width={option3text ? "95%" : "100%"}
        >
            <Flex
                width={"100%"}
                maxW={variant ? "100%" : "200px"}
                alignItems={"center"}
                justifyContent={"space-between"}
            >
                {createButton("1", option1text)}
                {createButton("2", option2text)}
                {option3text && createButton("3", option3text)}
            </Flex>
        </RadioGroup>
    );
}
