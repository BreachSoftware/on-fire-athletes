import {
    Box,
    Circle,
    Popover,
    PopoverArrow,
    PopoverContent,
    PopoverTrigger,
    HStack,
    Spacer,
} from "@chakra-ui/react";
import { HexColorPicker } from "react-colorful";
import { useState, Fragment, useCallback, useEffect } from "react";
import { useCurrentCardInfo } from "@/hooks/useCurrentCardInfo";
import TradingCardInfo from "@/hooks/TradingCardInfo";
import debounce from "lodash/debounce";

export interface FullColorPickerProps {
    type: keyof TradingCardInfo;
    setColor?: (color: string) => void;
    isDisabled?: boolean;
}

const presetColorsRow1 = [
    "#6600FF", // purple
    "#FFFF00", // yellow
    "#FF6600", // orange
    "#0000FF", // blue
] as const;

const presetColorsRow2 = [
    "#FF0000", // red
    "#00FF00", // green
    "#FF00FF", // pink
    "#000000", // black
] as const;

const colorAttributes: Array<keyof TradingCardInfo> = [
    "borderColor",
    "numberColor",
    "signatureColor",
    "backgroundMainColor",
    "backgroundAccentColor",
    "nameColor",
    "backgroundTextColor",
];

export default function FullColorPicker({
    type,
    setColor,
    isDisabled = false,
}: FullColorPickerProps) {
    const card = useCurrentCardInfo();
    const color = card.curCard[type] as string;
    const [pickerColor, setPickerColor] = useState<string>(color);

    // Create a debounced update function
    const debouncedUpdateColor = useCallback(
        debounce((newColor: string) => {
            if (setColor) {
                setColor(newColor);
            } else if (type === "nameColor") {
                card.setCurCard({
                    ...card.curCard,
                    nameColor: newColor,
                    topCardTextColor: newColor,
                });
            } else {
                card.setCurCard({
                    ...card.curCard,
                    [type]: newColor,
                });
            }
        }, 250),
        [card, setColor, type],
    );

    // Update color whenever pickerColor changes
    useEffect(() => {
        debouncedUpdateColor(pickerColor);
        return () => debouncedUpdateColor.cancel();
    }, [pickerColor, debouncedUpdateColor]);

    const uniqueColorsSet = new Set<string>();
    const isColorUnique = (color: string): boolean => {
        if (
            uniqueColorsSet.has(color) ||
            presetColorsRow1.includes(color as any) ||
            presetColorsRow2.includes(color as any) ||
            color === pickerColor
        ) {
            return false;
        }
        uniqueColorsSet.add(color);
        return true;
    };

    const isMobile =
        typeof window !== "undefined" &&
        /mobile|android|ipad|iphone|ipod|blackberry|iemobile|opera mini/i.test(
            navigator.userAgent.toLowerCase(),
        );

    const filteredColorAttributes = colorAttributes.filter(
        (attr) => attr !== type,
    );

    if (isMobile) {
        return (
            <HStack>
                <input
                    style={{
                        width: "40px",
                        height: "40px",
                        backgroundColor: pickerColor,
                        border: "2px solid white",
                    }}
                    onChange={(e) => setPickerColor(e.target.value)}
                    value={pickerColor}
                    type="color"
                    disabled={isDisabled}
                />
                <Spacer />
            </HStack>
        );
    }

    const ColorRow = ({ colors }: { colors: readonly string[] }) => (
        <Box>
            <HStack backgroundColor="gray.600" width="100%" minH="40px">
                <Spacer />
                {colors.map((color, index) => (
                    <Fragment key={index}>
                        <Circle
                            cursor="pointer"
                            border="2px solid white"
                            size="30px"
                            bg={color}
                            onClick={() => setPickerColor(color)}
                        />
                        <Spacer />
                    </Fragment>
                ))}
            </HStack>
        </Box>
    );

    return (
        <Popover>
            <PopoverTrigger>
                <Circle
                    marginRight="10px"
                    cursor={isDisabled ? "not-allowed" : "pointer"}
                    border="2px solid white"
                    size="40px"
                    bg={pickerColor}
                />
            </PopoverTrigger>
            {!isDisabled && (
                <PopoverContent width="100%">
                    <PopoverArrow padding={0} margin={0} />
                    <Box
                        backgroundColor="gray.600"
                        width="100%"
                        display="flex"
                        justifyContent="center"
                    >
                        <HexColorPicker
                            color={pickerColor}
                            onChange={setPickerColor}
                        />
                    </Box>
                    <Box>
                        <HStack
                            backgroundColor="gray.600"
                            width="100%"
                            minH="40px"
                        >
                            <Spacer />
                            {filteredColorAttributes.map((colorAttr, index) => {
                                const currentColor = String(
                                    card.curCard[colorAttr],
                                );
                                if (!isColorUnique(currentColor)) return null;

                                return (
                                    <Fragment key={index}>
                                        <Circle
                                            cursor="pointer"
                                            border="2px solid white"
                                            size="30px"
                                            bg={currentColor}
                                            onClick={() =>
                                                setPickerColor(currentColor)
                                            }
                                        />
                                        <Spacer />
                                    </Fragment>
                                );
                            })}
                        </HStack>
                    </Box>
                    <ColorRow colors={presetColorsRow1} />
                    <ColorRow colors={presetColorsRow2} />
                </PopoverContent>
            )}
        </Popover>
    );
}
