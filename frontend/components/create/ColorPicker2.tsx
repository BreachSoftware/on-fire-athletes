import React, { useState } from "react";
import { SketchPicker } from "react-color";
import { Box, Center } from "@chakra-ui/react";

export default function ColorPicker2({
    color,
    setColor,
}: {
    color: string;
    setColor: (color: string) => void;
}) {
    const [displayColorPicker, setDisplayColorPicker] = useState(false);

    const handleClick = () => {
        setDisplayColorPicker(!displayColorPicker);
    };

    const handleClose = () => {
        setDisplayColorPicker(false);
    };

    return (
        <Center position="relative" color="black" pr={3}>
            <Center
                padding="2px"
                backgroundColor="white"
                borderRadius="1000px"
                boxShadow="0 0 0 1px rgba(0,0,0,.1)"
                display="inline-block"
                cursor="pointer"
                onClick={handleClick}
            >
                <Box borderRadius="1000px" boxSize="24px" background={color} />
            </Center>
            {displayColorPicker ? (
                <Box position="absolute" zIndex="2" top="100%">
                    <Box
                        position="fixed"
                        top="0px"
                        right="0px"
                        bottom="0px"
                        left="0px"
                        onClick={handleClose}
                    />
                    <SketchPicker
                        color={color}
                        onChange={({ hex }) => {
                            setColor(hex);
                        }}
                    />
                </Box>
            ) : null}
        </Center>
    );
}
