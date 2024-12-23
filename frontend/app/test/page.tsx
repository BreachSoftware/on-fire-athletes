"use client";
import React, { useState } from "react";
import { Box } from "@chakra-ui/react";

import IOSColorPicker from "@/components/shared/ios-color-picker";

export default function Test() {
    const [color, setColor] = useState("#000000");

    return (
        <Box>
            <IOSColorPicker color={color} setColor={setColor} />
        </Box>
    );
}
