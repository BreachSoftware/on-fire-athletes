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
import { useState, Fragment, createRef, ChangeEvent } from "react";
import { useCurrentCardInfo } from "@/hooks/useCurrentCardInfo";
import TradingCardInfo, { CardPart } from "@/hooks/TradingCardInfo";
import { CARD_BACKGROUNDS } from "./card-backgrounds";
export interface FullColorPickerProps {
    type: keyof TradingCardInfo;
    setColor?: (color: string) => void;
    isDisabled?: boolean;
}

/**
 * This is a color picker component that allows a user to select any hex color
 *
 * @returns Color picker component
 */
export default function FullColorPicker({
    type,
    setColor,
    isDisabled = false,
}: FullColorPickerProps) {
    const card = useCurrentCardInfo();

    const color = card.curCard[type];

    if (typeof color !== "string") {
        throw new Error("Type must be a string color value");
    }

    // make a state var of color chosen
    const [pickerColor, setPickerColor] = useState<string>(color);

    /**
     *  Handles the color selection
     * @param event
     */
    function handleColorSelect(event: ChangeEvent<HTMLInputElement>): void {
        if (event.target.value) {
            setPickerColor(event.target.value);
        }
    }

    const colorInputRef = createRef<HTMLInputElement>();

    /**
     *  Handles the color selection
     * @param event clicking on the button
     */
    function handleColorFinalize(newColor: string): void {
        if (newColor) {
            setPickerColor(newColor);
            if (setColor) {
                setColor(newColor);
            } else {
                // Determine which part of the card to recolor
                const partToRecolor = [];
                switch (type) {
                    case "borderColor":
                        partToRecolor.push(
                            CardPart.EXTERIOR_BORDER,
                            CardPart.INTERIOR_BORDER,
                        );
                        break;
                    case "signatureColor":
                        partToRecolor.push(CardPart.SIGNATURE);
                        break;
                    case "backgroundMainColor":
                        partToRecolor.push(CardPart.BACKGROUND);
                        break;
                    case "backgroundAccentColor":
                        partToRecolor.push(CardPart.ACCENT);
                        break;
                    case "numberColor":
                        break;
                    case "nameColor":
                        break;
                    default:
                        console.error("Invalid color type: ", type);
                        break;
                }

                if (partToRecolor.length > 0) {
                    // Add the part to recolor to the list of parts to recolor
                    const myArr = card.curCard.partsToRecolor;
                    for (const part of partToRecolor) {
                        if (!myArr.includes(part)) {
                            myArr.push(part);
                        }
                    }
                    if (type === "nameColor") {
                        card.setCurCard({
                            ...card.curCard,
                            partsToRecolor: myArr,
                            [type]: newColor,
                            ["topCardTextColor"]: newColor,
                        });
                    } else {
                        card.setCurCard({
                            ...card.curCard,
                            partsToRecolor: myArr,
                            [type]: newColor,
                        });
                    }
                    // IGNORE THIS https://t4.ftcdn.net/jpg/05/60/35/17/360_F_560351726_9mSpgIAQ9M72jd3qNMEsLETEe64ioZvV.jpg
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    card.curCard[type] = newColor;
                } else if (type === "nameColor") {
                    card.setCurCard({
                        ...card.curCard,
                        [type]: newColor,
                        ["topCardTextColor"]: newColor,
                    });
                } else {
                    card.setCurCard({
                        ...card.curCard,
                        [type]: newColor,
                    });
                }
            }
        }
    }

    /**
     *
     * Sets the picker color with a delay to allow the picker to close
     *
     */
    function setPickerWithDelay(): void {
        setTimeout(() => {
            if (setColor) {
                setColor(pickerColor);
            } else if (type === "nameColor") {
                card.setCurCard({
                    ...card.curCard,
                    [type]: pickerColor,
                    ["topCardTextColor"]: pickerColor,
                });
            } else {
                card.setCurCard({
                    ...card.curCard,
                    [type]: pickerColor,
                });
            }
        }, 100);
    }

    const colorAttributes: Array<keyof TradingCardInfo> = [
        "borderColor",
        "numberColor",
        "signatureColor",
        "backgroundMainColor",
        "backgroundAccentColor",
        "nameColor",
        "backgroundTextColor",
    ];

    const presetColorsRow1: Array<string> = [
        "#6600FF", // purple
        "#FFFF00", // yellow
        "#FF6600", // orange
        "#0000FF", // blue
    ];

    const presetColorsRow2: Array<string> = [
        "#FF0000", // red
        "#00FF00", // green
        "#FF00FF", // pink
        "#000000", // black
    ];

    const colorindex = colorAttributes.indexOf(type);

    // take out the color that is being opened
    colorAttributes.splice(colorindex, 1);

    const uniqueColorsSet = new Set<string>();

    /**
     * Checks if the color is unique
     */
    function showColor(color: string, uniqueColorsSet: Set<string>): boolean {
        if (
            uniqueColorsSet.has(color) ||
            presetColorsRow1.includes(color) ||
            presetColorsRow2.includes(color) ||
            color == pickerColor
        ) {
            return false;
        }
        uniqueColorsSet.add(color);
        return true;
    }

    let userAgent = "";
    if (typeof window !== "undefined") {
        userAgent = navigator.userAgent.toLowerCase();
    }
    const isMobile =
        /mobile|android|ipad|iphone|ipod|blackberry|iemobile|opera mini/i.test(
            userAgent,
        );

    return (
        <>
            {isMobile ? (
                // Mobile Color Picker
                <HStack>
                    <input
                        style={{
                            width: "40px",
                            height: "40px",
                            backgroundColor: pickerColor,
                            border: "2px solid white",
                        }}
                        onChange={handleColorSelect}
                        onBlur={() => {
                            handleColorFinalize(pickerColor);
                        }}
                        value={pickerColor}
                        type={"color"}
                        color={"tomato"}
                        ref={colorInputRef}
                        disabled={isDisabled}
                    />
                    <Spacer />
                </HStack>
            ) : (
                // Desktop Color Picker
                <Popover
                    onClose={() => {
                        return setPickerWithDelay();
                    }}
                >
                    <PopoverTrigger>
                        <Circle
                            marginRight={"10px"}
                            cursor={isDisabled ? "not-allowed" : "pointer"}
                            border={"2px solid white"}
                            size="40px"
                            bg={pickerColor}
                        />
                    </PopoverTrigger>
                    {isDisabled ? null : (
                        <PopoverContent width={"100%"}>
                            <PopoverArrow padding={0} margin={0} />
                            <Box
                                backgroundColor={"gray.600"}
                                width={"100%"}
                                display="flex"
                                justifyContent="center"
                            >
                                <HexColorPicker
                                    color={color}
                                    onChange={setPickerColor}
                                />
                            </Box>
                            <Box>
                                <HStack
                                    backgroundColor={"gray.600"}
                                    width={"100%"}
                                    minH={"40px"}
                                >
                                    {/* map circles based on */}
                                    <Spacer />
                                    {colorAttributes.map((color, index) => {
                                        const currentColor = String(
                                            card.curCard[color],
                                        );

                                        if (
                                            showColor(
                                                currentColor,
                                                uniqueColorsSet,
                                            )
                                        ) {
                                            return (
                                                <Fragment key={index}>
                                                    <Circle
                                                        cursor={"pointer"}
                                                        border={
                                                            "2px solid white"
                                                        }
                                                        size="30px"
                                                        bg={currentColor}
                                                        onClick={() => {
                                                            setPickerColor(
                                                                currentColor,
                                                            );
                                                        }}
                                                    />
                                                    <Spacer />
                                                </Fragment>
                                            );
                                        }
                                        return <Fragment key={index} />; // Skip rendering if the color is not unique
                                    })}
                                </HStack>
                            </Box>
                            <Box>
                                <HStack
                                    backgroundColor={"gray.600"}
                                    width={"100%"}
                                    minH={"40px"}
                                >
                                    {/* map circles based on */}
                                    <Spacer />
                                    {presetColorsRow1.map((color, index) => {
                                        return (
                                            <Fragment key={index}>
                                                <Circle
                                                    cursor={"pointer"}
                                                    border={"2px solid white"}
                                                    size="30px"
                                                    bg={color}
                                                    onClick={() => {
                                                        setPickerColor(color);
                                                    }}
                                                />
                                                <Spacer />
                                            </Fragment>
                                        );
                                    })}
                                </HStack>
                            </Box>
                            <Box>
                                <HStack
                                    backgroundColor={"gray.600"}
                                    width={"100%"}
                                    minH={"40px"}
                                >
                                    {/* map circles based on */}
                                    <Spacer />
                                    {presetColorsRow2.map((color, index) => {
                                        return (
                                            <Fragment key={index}>
                                                <Circle
                                                    cursor={"pointer"}
                                                    border={"2px solid white"}
                                                    size="30px"
                                                    bg={color}
                                                    onClick={() => {
                                                        setPickerColor(color);
                                                    }}
                                                />
                                                <Spacer />
                                            </Fragment>
                                        );
                                    })}
                                </HStack>
                            </Box>
                        </PopoverContent>
                    )}
                </Popover>
            )}
        </>
    );
}
