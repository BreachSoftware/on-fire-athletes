import React, { useCallback, useRef, useState, useEffect } from "react";
import {
    Box,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    Button,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    useColorModeValue,
    SimpleGrid,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    NumberInput,
    NumberInputField,
    Input,
    Center,
    IconButton,
    useDisclosure,
    Icon,
} from "@chakra-ui/react";
import { BsEyedropper, BsX } from "react-icons/bs";

interface CursorPosition {
    x: number;
    y: number;
}

interface EyeDropper {
    open: () => Promise<{ sRGBHex: string }>;
}

declare global {
    interface Window {
        EyeDropper?: {
            new (): EyeDropper;
        };
    }
}

interface ColorPickerProps {
    color: string;
    setColor: (color: string) => void;
}

const initialPresetColors = [
    { value: "#D1D1D6", isNew: false }, // Light gray
    { value: "#000000", isNew: false }, // Black
    { value: "#007AFF", isNew: false }, // iOS Blue
    { value: "#34C759", isNew: false }, // iOS Green
    { value: "#FF3B30", isNew: false }, // iOS Red
] as SavedColor[];

const generateColorGrid = () => {
    // First row: grayscale (white to black)
    const grayscaleRow = Array.from({ length: 12 }, (_, i) => {
        const value = Math.round(100 - (i * 100) / 11);
        return `hsl(0, 0%, ${value}%)`;
    });

    // Generate 9 rows of colors with varying hue and lightness
    const colorRows = Array.from({ length: 9 }, (_, rowIndex) => {
        const lightness = 90 - rowIndex * 10; // Start bright, get darker

        return Array.from({ length: 12 }, (_, colIndex) => {
            // Hue goes from 180 (cyan) through 0 (red) to 120 (green)
            const hue = ((colIndex * 300) / 11 + 180) % 360;
            return `hsl(${hue}, 100%, ${lightness}%)`;
        });
    });

    return [grayscaleRow, ...colorRows] as const;
};

const colorGrid = generateColorGrid();

interface SavedColor {
    value: string;
    isNew: boolean;
}

interface PresetColorsProps {
    onSelectColor: (color: string) => void;
    currentColor: string;
    savedColors: SavedColor[];
    onAddColor: (color: string) => void;
}

const PresetColors = ({
    onSelectColor,
    currentColor,
    savedColors,
    onAddColor,
}: PresetColorsProps) => {
    const [currentPage] = useState(0);
    const colorsPerPage = 10;

    const boxSize = "24px";

    const currentColors = savedColors.slice(
        currentPage * colorsPerPage,
        (currentPage + 1) * colorsPerPage,
    );

    return (
        <Box pt={4} borderTop="1px solid" borderColor="rgba(255,255,255,0.1)">
            <Box display="flex" gap={3} alignItems="flex-start">
                <Box
                    width="40px"
                    height="40px"
                    borderRadius="md"
                    backgroundColor={currentColor}
                    border="2px solid rgba(255, 255, 255, 0.2)"
                    flexShrink={0}
                />
                <Box flex={1} px={2}>
                    <Box position="relative">
                        <SimpleGrid
                            columns={Math.floor(colorsPerPage / 2)}
                            spacing={2}
                        >
                            {currentColors.map(
                                ({ value: savedColor, isNew }) => (
                                    <Box
                                        key={savedColor}
                                        role="button"
                                        cursor="pointer"
                                        tabIndex={0}
                                        width={boxSize}
                                        height={boxSize}
                                        padding="0"
                                        borderRadius="full"
                                        backgroundColor={savedColor}
                                        onClick={() =>
                                            onSelectColor(savedColor)
                                        }
                                        _hover={{
                                            transform: "scale(1.05)",
                                        }}
                                        transition="all 0.2s"
                                        animation={
                                            isNew
                                                ? "addColor 0.3s ease-out"
                                                : undefined
                                        }
                                        sx={{
                                            "@keyframes addColor": {
                                                "0%": {
                                                    transform: "scale(0.5)",
                                                    opacity: 0,
                                                },
                                                "50%": {
                                                    transform: "scale(1.2)",
                                                },
                                                "100%": {
                                                    transform: "scale(1)",
                                                    opacity: 1,
                                                },
                                            },
                                        }}
                                        border="2px solid rgba(255, 255, 255, 0.2)"
                                    />
                                ),
                            )}
                            {currentColors.length < colorsPerPage && (
                                <Center
                                    role="button"
                                    cursor="pointer"
                                    tabIndex={0}
                                    width={boxSize}
                                    height={boxSize}
                                    borderRadius="full"
                                    bg="white"
                                    borderColor="rgba(255, 255, 255, 0.3)"
                                    _hover={{ transform: "scale(1.1)" }}
                                    transition="transform 0.2s"
                                    onClick={() => onAddColor(currentColor)}
                                    title="Add current color to presets"
                                >
                                    <Box
                                        as="span"
                                        fontSize="lg"
                                        color="gray.400"
                                    >
                                        +
                                    </Box>
                                </Center>
                            )}
                        </SimpleGrid>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

interface RGBColor {
    r: number;
    g: number;
    b: number;
}

const parseRGB = (color: string): RGBColor => {
    // Handle rgb/rgba format
    const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (rgbMatch) {
        return {
            r: parseInt(rgbMatch[1], 10),
            g: parseInt(rgbMatch[2], 10),
            b: parseInt(rgbMatch[3], 10),
        };
    }

    // Handle hex format
    if (color.startsWith("#")) {
        return hexToRgb(color);
    }

    // Handle named colors by creating a temporary element
    const tempEl = document.createElement("div");
    tempEl.style.color = color;
    document.body.appendChild(tempEl);
    const computedColor = getComputedStyle(tempEl).color;
    document.body.removeChild(tempEl);

    // Parse the computed color (will be in rgb format)
    const computedMatch = computedColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (computedMatch) {
        return {
            r: parseInt(computedMatch[1], 10),
            g: parseInt(computedMatch[2], 10),
            b: parseInt(computedMatch[3], 10),
        };
    }

    // Default to black if parsing fails
    return { r: 0, g: 0, b: 0 };
};

const rgbToHex = (r: number, g: number, b: number): string => {
    return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

const hexToRgb = (hex: string): RGBColor => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
          }
        : { r: 0, g: 0, b: 0 };
};

export default function IOSColorPicker({ color, setColor }: ColorPickerProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [cursorPosition, setCursorPosition] = useState<CursorPosition | null>(
        null,
    );
    const [savedColors, setSavedColors] =
        useState<SavedColor[]>(initialPresetColors);
    const spectrumRef = useRef<HTMLDivElement>(null);
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const lastUpdateRef = useRef<number>(0);
    const [rgbValues, setRGBValues] = useState<RGBColor>({
        r: 0,
        g: 0,
        b: 0,
    });
    const [hexInputValue, setHexInputValue] = useState<string>("");

    useEffect(() => {
        const rgb = parseRGB(color);
        setRGBValues(rgb);
        setHexInputValue(rgbToHex(rgb.r, rgb.g, rgb.b));
    }, [color]);

    const handleRGBChange = useCallback(
        (key: keyof RGBColor, value: number) => {
            const newValues = { ...rgbValues, [key]: value };
            setRGBValues(newValues);
            setHexInputValue(rgbToHex(newValues.r, newValues.g, newValues.b));
            setColor(`rgb(${newValues.r}, ${newValues.g}, ${newValues.b})`);
        },
        [rgbValues, setColor],
    );

    const calculateColor = useCallback(
        (x: number, y: number, rect: DOMRect) => {
            const hue = (x / rect.width) * 360;
            const saturation = 100;
            const lightness = ((rect.height - y) / rect.height) * 100;
            return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        },
        [],
    );

    const handleSpectrumInteraction = useCallback(
        (event: React.MouseEvent<HTMLDivElement>) => {
            if (event.type === "mousemove" && event.buttons !== 1) return;

            const now = Date.now();
            if (now - lastUpdateRef.current < 16) return; // Skip updates faster than 60fps
            lastUpdateRef.current = now;

            const spectrum = spectrumRef.current;
            if (!spectrum) return;

            const rect = spectrum.getBoundingClientRect();
            const x = Math.max(
                0,
                Math.min(event.clientX - rect.left, rect.width),
            );
            const y = Math.max(
                0,
                Math.min(event.clientY - rect.top, rect.height),
            );

            setCursorPosition({ x, y });
            setColor(calculateColor(x, y, rect));
        },
        [setColor, calculateColor],
    );

    const handleAddColor = useCallback((colorToAdd: string) => {
        setSavedColors((prev) => {
            if (prev.map((c) => c.value).includes(colorToAdd)) return prev;

            // Mark all previous colors as not new
            const updatedPrev = prev.map((color) => ({
                ...color,
                isNew: false,
            }));

            // Add new color with animation flag
            return [...updatedPrev, { value: colorToAdd, isNew: true }].slice(
                -10,
            );
        });

        // Reset the isNew flag after animation
        setTimeout(() => {
            setSavedColors((prev) =>
                prev.map((color) => ({
                    ...color,
                    isNew: false,
                })),
            );
        }, 300); // Match animation duration
    }, []);

    const validateColorValue = (value: string): number => {
        const num = parseInt(value, 10);
        if (isNaN(num)) return 0;
        return Math.max(0, Math.min(255, num));
    };

    const handleEyeDropper = async () => {
        try {
            if (!window.EyeDropper) {
                console.warn("EyeDropper API not supported in this browser");
                return;
            }

            const dropper = new window.EyeDropper();
            const result = await dropper.open();
            const rgb = hexToRgb(result.sRGBHex);
            setRGBValues(rgb);
            setHexInputValue(result.sRGBHex.slice(1));
            setColor(result.sRGBHex);
        } catch (e) {
            // User canceled or API failed
            console.log("Color picking canceled or failed");
        }
    };

    return (
        <Popover
            placement="bottom-start"
            isOpen={isOpen}
            onClose={onClose}
            onOpen={onOpen}
        >
            <PopoverTrigger>
                <Button
                    width="40px"
                    height="40px"
                    padding="0"
                    borderRadius="md"
                    backgroundColor={color}
                    _hover={{ transform: "scale(1.05)" }}
                    transition="transform 0.2s"
                    border="2px solid"
                    borderColor={borderColor}
                />
            </PopoverTrigger>
            <PopoverContent
                width="300px"
                height="460px"
                boxShadow="lg"
                bg="rgba(30, 30, 30, 0.95)"
                backdropFilter="blur(10px)"
            >
                <PopoverBody p={4} position="relative" height="100%">
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={4}
                    >
                        <IconButton
                            variant="ghost"
                            boxSize="32px"
                            icon={<Icon as={BsEyedropper} boxSize="20px" />}
                            color="blue.400"
                            aria-label="Pick color from screen"
                            onClick={handleEyeDropper}
                            _hover={{ bg: "whiteAlpha.200" }}
                            _active={{ bg: "whiteAlpha.300" }}
                            isDisabled={!window.EyeDropper}
                            title={
                                window.EyeDropper
                                    ? "Pick color from screen"
                                    : "Not supported in this browser"
                            }
                        />
                        <Box fontSize="lg" color="white" fontWeight="semibold">
                            Colors
                        </Box>
                        <IconButton
                            boxSize="32px"
                            variant="ghost"
                            icon={<Icon as={BsX} boxSize="30px" />}
                            color="whiteAlpha.600"
                            aria-label="Close"
                            onClick={onClose}
                            _hover={{ bg: "whiteAlpha.200" }}
                            _active={{ bg: "whiteAlpha.300" }}
                        />
                    </Box>
                    <Tabs
                        variant="unstyled"
                        colorScheme="gray"
                        height="calc(100% - 40px)"
                    >
                        <TabList
                            mb={4}
                            bg="rgba(60, 60, 60, 0.8)"
                            p={"3px"}
                            borderRadius="lg"
                            gap={1}
                            h="36px"
                        >
                            <Tab
                                borderRadius="md"
                                _selected={{ bg: "rgba(120, 120, 120, 0.8)" }}
                                color="white"
                                flex={1}
                            >
                                Grid
                            </Tab>
                            <Tab
                                borderRadius="md"
                                _selected={{ bg: "rgba(120, 120, 120, 0.8)" }}
                                color="white"
                                flex={1}
                            >
                                Spectrum
                            </Tab>
                            <Tab
                                borderRadius="md"
                                _selected={{ bg: "rgba(120, 120, 120, 0.8)" }}
                                color="white"
                                flex={1}
                            >
                                Sliders
                            </Tab>
                        </TabList>
                        <TabPanels height="calc(100% - 48px)">
                            <TabPanel p={0}>
                                <Box>
                                    <Box
                                        width="100%"
                                        height="200px"
                                        borderRadius="lg"
                                        overflow="hidden"
                                    >
                                        <SimpleGrid columns={12} spacing={0}>
                                            {colorGrid
                                                .flat()
                                                .map((gridColor, index) => (
                                                    <Box
                                                        key={index}
                                                        tabIndex={0}
                                                        role="button"
                                                        aria-label={`Select color ${gridColor}`}
                                                        cursor="pointer"
                                                        width="100%"
                                                        height="20px"
                                                        padding={0}
                                                        backgroundColor={
                                                            gridColor
                                                        }
                                                        onClick={() =>
                                                            setColor(gridColor)
                                                        }
                                                        borderRadius={0}
                                                        position="relative"
                                                        _hover={{
                                                            zIndex: 2,
                                                            boxShadow: `0 0 0 2px ${gridColor}, 0 0 0 3px rgba(255,255,255,0.5)`,
                                                        }}
                                                        transition="box-shadow 0.2s"
                                                    />
                                                ))}
                                        </SimpleGrid>
                                    </Box>
                                </Box>
                            </TabPanel>
                            <TabPanel p={0}>
                                <Box>
                                    <Box
                                        ref={spectrumRef}
                                        width="100%"
                                        height="200px"
                                        borderRadius="lg"
                                        cursor="crosshair"
                                        onClick={handleSpectrumInteraction}
                                        onMouseMove={handleSpectrumInteraction}
                                        position="relative"
                                        background="linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)"
                                        _after={{
                                            content: '""',
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background:
                                                "linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 50%), linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 50%)",
                                            pointerEvents: "none",
                                            borderRadius: "lg",
                                        }}
                                    >
                                        {cursorPosition && (
                                            <Box
                                                position="absolute"
                                                left={`${cursorPosition.x}px`}
                                                top={`${cursorPosition.y}px`}
                                                transform="translate(-50%, -50%)"
                                                width="24px"
                                                height="24px"
                                                borderRadius="full"
                                                border="2px solid white"
                                                boxShadow="0 0 0 1px rgba(0,0,0,0.3)"
                                                pointerEvents="none"
                                            />
                                        )}
                                    </Box>
                                </Box>
                            </TabPanel>
                            <TabPanel p={0} height="100%">
                                <Box position="relative" height="100%">
                                    <Box height="160px" py={0}>
                                        <Box mb={3}>
                                            <Box
                                                color="gray.400"
                                                mb={1}
                                                fontSize="xs"
                                            >
                                                Red
                                            </Box>
                                            <Box display="flex" gap={6}>
                                                <Slider
                                                    value={rgbValues.r}
                                                    min={0}
                                                    max={255}
                                                    onChange={(v) =>
                                                        handleRGBChange("r", v)
                                                    }
                                                    h="24px"
                                                    flex={1}
                                                    sx={{
                                                        "[data-track]": {
                                                            height: "24px",
                                                            borderRadius:
                                                                "full",
                                                            background: `linear-gradient(to right, rgb(0,${rgbValues.g},${rgbValues.b}), rgb(255,${rgbValues.g},${rgbValues.b}))`,
                                                        },
                                                        ".chakra-slider__filled-track":
                                                            {
                                                                opacity: 0,
                                                            },
                                                        ".chakra-slider__thumb":
                                                            {
                                                                transform:
                                                                    "translateY(-50%)",
                                                            },
                                                        ".chakra-slider__track":
                                                            {
                                                                overflow:
                                                                    "hidden",
                                                                margin: "0",
                                                                borderRadius:
                                                                    "full",
                                                            },
                                                        ".chakra-slider__container":
                                                            {
                                                                padding: "0",
                                                            },
                                                    }}
                                                >
                                                    <SliderTrack data-track>
                                                        <SliderFilledTrack />
                                                    </SliderTrack>
                                                    <SliderThumb
                                                        boxSize={6}
                                                        borderColor="white"
                                                        borderWidth={2}
                                                        _focus={{
                                                            boxShadow:
                                                                "0 0 0 3px rgba(255,255,255,0.3)",
                                                        }}
                                                    />
                                                </Slider>
                                                <NumberInput
                                                    value={rgbValues.r}
                                                    min={0}
                                                    max={255}
                                                    w="62px"
                                                    size="sm"
                                                    onChange={(valueString) =>
                                                        handleRGBChange(
                                                            "r",
                                                            validateColorValue(
                                                                valueString,
                                                            ),
                                                        )
                                                    }
                                                >
                                                    <NumberInputField
                                                        textAlign="center"
                                                        paddingX={1}
                                                        paddingY={0}
                                                        height="24px"
                                                        bg="whiteAlpha.100"
                                                        border="1px solid"
                                                        borderColor="whiteAlpha.200"
                                                        color="white"
                                                        rounded="md"
                                                        _hover={{
                                                            borderColor:
                                                                "whiteAlpha.300",
                                                        }}
                                                        _focus={{
                                                            borderColor:
                                                                "whiteAlpha.400",
                                                            boxShadow: "none",
                                                        }}
                                                    />
                                                </NumberInput>
                                            </Box>
                                        </Box>

                                        <Box mb={3}>
                                            <Box
                                                color="gray.400"
                                                mb={1}
                                                fontSize="xs"
                                            >
                                                Green
                                            </Box>
                                            <Box display="flex" gap={6}>
                                                <Slider
                                                    value={rgbValues.g}
                                                    min={0}
                                                    max={255}
                                                    onChange={(v) =>
                                                        handleRGBChange("g", v)
                                                    }
                                                    h="24px"
                                                    flex={1}
                                                    sx={{
                                                        "[data-track]": {
                                                            height: "24px",
                                                            borderRadius:
                                                                "full",
                                                            background: `linear-gradient(to right, rgb(${rgbValues.r},0,${rgbValues.b}), rgb(${rgbValues.r},255,${rgbValues.b}))`,
                                                        },
                                                        ".chakra-slider__filled-track":
                                                            {
                                                                opacity: 0,
                                                            },
                                                        ".chakra-slider__thumb":
                                                            {
                                                                transform:
                                                                    "translateY(-50%)",
                                                            },
                                                        ".chakra-slider__track":
                                                            {
                                                                overflow:
                                                                    "hidden",
                                                                margin: "0",
                                                                borderRadius:
                                                                    "full",
                                                            },
                                                        ".chakra-slider__container":
                                                            {
                                                                padding: "0",
                                                            },
                                                    }}
                                                >
                                                    <SliderTrack data-track>
                                                        <SliderFilledTrack />
                                                    </SliderTrack>
                                                    <SliderThumb
                                                        boxSize={6}
                                                        borderColor="white"
                                                        borderWidth={2}
                                                        _focus={{
                                                            boxShadow:
                                                                "0 0 0 3px rgba(255,255,255,0.3)",
                                                        }}
                                                    />
                                                </Slider>
                                                <NumberInput
                                                    value={rgbValues.g}
                                                    min={0}
                                                    max={255}
                                                    w="62px"
                                                    size="sm"
                                                    onChange={(valueString) =>
                                                        handleRGBChange(
                                                            "g",
                                                            validateColorValue(
                                                                valueString,
                                                            ),
                                                        )
                                                    }
                                                >
                                                    <NumberInputField
                                                        textAlign="center"
                                                        paddingX={1}
                                                        paddingY={0}
                                                        height="24px"
                                                        bg="whiteAlpha.100"
                                                        border="1px solid"
                                                        borderColor="whiteAlpha.200"
                                                        color="white"
                                                        rounded="md"
                                                        _hover={{
                                                            borderColor:
                                                                "whiteAlpha.300",
                                                        }}
                                                        _focus={{
                                                            borderColor:
                                                                "whiteAlpha.400",
                                                            boxShadow: "none",
                                                        }}
                                                    />
                                                </NumberInput>
                                            </Box>
                                        </Box>

                                        <Box>
                                            <Box
                                                color="gray.400"
                                                mb={1}
                                                fontSize="xs"
                                            >
                                                Blue
                                            </Box>
                                            <Box display="flex" gap={6}>
                                                <Slider
                                                    value={rgbValues.b}
                                                    min={0}
                                                    max={255}
                                                    onChange={(v) =>
                                                        handleRGBChange("b", v)
                                                    }
                                                    h="24px"
                                                    flex={1}
                                                    sx={{
                                                        "[data-track]": {
                                                            height: "24px",
                                                            borderRadius:
                                                                "full",
                                                            background: `linear-gradient(to right, rgb(${rgbValues.r},${rgbValues.g},0), rgb(${rgbValues.r},${rgbValues.g},255))`,
                                                        },
                                                        ".chakra-slider__filled-track":
                                                            {
                                                                opacity: 0,
                                                            },
                                                        ".chakra-slider__thumb":
                                                            {
                                                                transform:
                                                                    "translateY(-50%)",
                                                            },
                                                        ".chakra-slider__track":
                                                            {
                                                                overflow:
                                                                    "hidden",
                                                                margin: "0",
                                                                borderRadius:
                                                                    "full",
                                                            },
                                                        ".chakra-slider__container":
                                                            {
                                                                padding: "0",
                                                            },
                                                    }}
                                                >
                                                    <SliderTrack data-track>
                                                        <SliderFilledTrack />
                                                    </SliderTrack>
                                                    <SliderThumb
                                                        boxSize={6}
                                                        borderColor="white"
                                                        borderWidth={2}
                                                        _focus={{
                                                            boxShadow:
                                                                "0 0 0 3px rgba(255,255,255,0.3)",
                                                        }}
                                                    />
                                                </Slider>
                                                <NumberInput
                                                    value={rgbValues.b}
                                                    min={0}
                                                    max={255}
                                                    w="62px"
                                                    size="sm"
                                                    onChange={(valueString) =>
                                                        handleRGBChange(
                                                            "b",
                                                            validateColorValue(
                                                                valueString,
                                                            ),
                                                        )
                                                    }
                                                >
                                                    <NumberInputField
                                                        textAlign="center"
                                                        paddingX={1}
                                                        paddingY={0}
                                                        height="24px"
                                                        bg="whiteAlpha.100"
                                                        border="1px solid"
                                                        borderColor="whiteAlpha.200"
                                                        color="white"
                                                        rounded="md"
                                                        _hover={{
                                                            borderColor:
                                                                "whiteAlpha.300",
                                                        }}
                                                        _focus={{
                                                            borderColor:
                                                                "whiteAlpha.400",
                                                            boxShadow: "none",
                                                        }}
                                                    />
                                                </NumberInput>
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Box mt={8} mb={2}>
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="flex-end"
                                            gap={2}
                                        >
                                            <Box
                                                color="gray.400"
                                                fontSize="xs"
                                                flexShrink={0}
                                            >
                                                Hex Color
                                            </Box>
                                            <Box
                                                position="relative"
                                                width="90px"
                                            >
                                                <Box
                                                    position="absolute"
                                                    left={2}
                                                    top="50%"
                                                    transform="translateY(-50%)"
                                                    color="whiteAlpha.600"
                                                    fontSize="sm"
                                                    pointerEvents="none"
                                                    lineHeight="1"
                                                    height="12px"
                                                    marginTop="-1px"
                                                >
                                                    #
                                                </Box>
                                                <Input
                                                    value={hexInputValue}
                                                    onChange={(e) => {
                                                        const newValue =
                                                            e.target.value
                                                                .replace(
                                                                    /[^0-9A-Fa-f]/g,
                                                                    "",
                                                                )
                                                                .toUpperCase()
                                                                .slice(0, 6);
                                                        setHexInputValue(
                                                            newValue,
                                                        );

                                                        // Only update color if we have a valid hex
                                                        if (
                                                            /^[0-9A-Fa-f]{6}$/.test(
                                                                newValue,
                                                            )
                                                        ) {
                                                            const rgb =
                                                                hexToRgb(
                                                                    `#${newValue}`,
                                                                );
                                                            setRGBValues(rgb);
                                                            setColor(
                                                                `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
                                                            );
                                                        }
                                                    }}
                                                    textAlign="center"
                                                    pl={6}
                                                    pr={2}
                                                    paddingY={0}
                                                    height="24px"
                                                    fontSize="sm"
                                                    bg="whiteAlpha.100"
                                                    border="1px solid"
                                                    borderColor="whiteAlpha.200"
                                                    color="white"
                                                    rounded="md"
                                                    _hover={{
                                                        borderColor:
                                                            "whiteAlpha.300",
                                                    }}
                                                    _focus={{
                                                        borderColor:
                                                            "whiteAlpha.400",
                                                        boxShadow: "none",
                                                    }}
                                                    spellCheck={false}
                                                    maxLength={6}
                                                    textTransform="uppercase"
                                                />
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                    <Box position="absolute" bottom={4} left={4} right={4}>
                        <PresetColors
                            onSelectColor={setColor}
                            currentColor={color}
                            savedColors={savedColors}
                            onAddColor={handleAddColor}
                        />
                    </Box>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
}
