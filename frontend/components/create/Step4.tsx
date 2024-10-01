import {
    VStack,
    Text,
    HStack,
    Image,
    Button,
    Flex,
    Grid,
    GridItem,
    Spacer,
    Tooltip,
    Box,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import FullColorPicker from "./FullColorSelector";
import { useCurrentCardInfo } from "@/hooks/useCurrentCardInfo";
import { CardPart } from "@/hooks/TradingCardInfo";
import RadioPicker from "./RadioPicker";
import StatusIcon from "./StatusIcon";
import { CARD_BACKGROUNDS } from "./card-backgrounds";

/**
 * This component contains the content of Step 4 in the card creation process
 *
 * @returns the content of Step 4 in the card creation process
 */
export default function Step4() {
    // Get the current card info from the context
    const card = useCurrentCardInfo();

    // State variables for the color pickers
    const [borderColor, setBorderColor] = useState(card.curCard.borderColor);
    const [backgroundMainColor, setBackgroundMainColor] = useState(
        card.curCard.backgroundMainColor,
    );
    const [backgroundAccentColor, setBackgroundAccentColor] = useState(
        card.curCard.backgroundAccentColor,
    );
    const [backgroundTextColor, setBackgroundTextColor] = useState(
        card.curCard.backgroundTextColor,
    );
    const [selectedBackground, setSelectedBackground] = useState(
        card.curCard.selectedBackground,
    );
    const [nameColor, setNameColor] = useState(card.curCard.nameColor);

    // this need to be set to a hardcoded hex value because the color picker is not Chakra
    const [firstNameSolid, setFirstNameSolid] = useState(
        card.curCard.firstNameSolid,
    );
    const [lastNameSolid, setLastNameSolid] = useState(
        card.curCard.lastNameSolid,
    );

    const [cardNameFont, setCardNameFont] = useState(card.curCard.nameFont);

    const [signatureColor, setSignatureColor] = useState(
        card.curCard.signatureColor,
    );

    const [numberColor, setNumberColor] = useState(card.curCard.numberColor);

    const numberOfBackgrounds = CARD_BACKGROUNDS.length;

    // Update the card preview when the component mounts and when the user changes the color
    useEffect(() => {
        // There is probably a better way to do this...

        // These are in the order of the CardPart enum. Very important.
        const thingsToCheck = [
            borderColor,
            borderColor,
            backgroundAccentColor,
            backgroundMainColor,
            signatureColor,
        ];

        const thingsInState = [
            card.curCard.borderColor,
            card.curCard.borderColor,
            card.curCard.backgroundAccentColor,
            card.curCard.backgroundMainColor,
            card.curCard.signatureColor,
        ];

        const toChange = [];

        for (let i = 0; i < thingsToCheck.length; i++) {
            if (thingsToCheck[i] !== thingsInState[i]) {
                toChange.push(i);
            }
        }

        if (selectedBackground !== card.curCard.selectedBackground) {
            toChange.push(CardPart.BACKGROUND);
        }

        card.setCurCard({
            ...card.curCard,
            numberColor: numberColor,
            signatureColor: signatureColor,
            borderColor: borderColor,
            backgroundMainColor: backgroundMainColor,
            backgroundAccentColor: backgroundAccentColor,
            backgroundTextColor: backgroundTextColor,
            selectedBackground: selectedBackground,
            partsToRecolor: toChange,
            firstNameSolid: firstNameSolid,
            lastNameSolid: lastNameSolid,
            nameFont: cardNameFont,
            nameColor: nameColor,
            topCardTextColor: nameColor,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        borderColor,
        numberColor,
        signatureColor,
        backgroundMainColor,
        backgroundAccentColor,
        backgroundTextColor,
        selectedBackground,
        firstNameSolid,
        lastNameSolid,
        cardNameFont,
        nameColor,
    ]);

    /**
     *
     * A function to render a background selector button
     *
     * @param index The index of the background to render
     * @returns the background selector button
     */
    function backgroundSelector(index: number) {
        return (
            <Button
                key={index}
                height={"100px"}
                minW={"120px"} // For some reason width doesnt work so we force it with minW
                border={
                    selectedBackground === index
                        ? "2px solid var(--chakra-colors-green-100)"
                        : ""
                }
                borderRadius={"5px"}
                p="2px"
                onClick={() => {
                    return setSelectedBackground(index);
                }}
            >
                <Box position="relative" height="100%" width="100%">
                    <Image
                        src={`/card_backgrounds/${CARD_BACKGROUNDS[index].src}`}
                        bg={"#888"}
                        objectFit={"cover"}
                        height={"100%"}
                        width={"100%"}
                        alt={`Background ${index}`}
                        borderRadius={"5px"}
                        style={{
                            filter: `brightness(${selectedBackground === index ? "100%" : "70%"})`,
                        }}
                        draggable={false}
                    />
                    {selectedBackground === index && (
                        // The checkmark icon
                        <Box position="absolute" bottom="-10px" right="-10px">
                            <StatusIcon
                                isCheck={true}
                                isGlowing={true}
                                isActive={true}
                            />
                        </Box>
                    )}
                </Box>
            </Button>
        );
    }

    return (
        <>
            <VStack
                width={"100%"}
                height={"100%"}
                alignItems={"left"}
                justifyContent={"space-evenly"}
                // paddingTop={8}
                color={"white"}
                fontFamily={"Barlow Semi Condensed"}
            >
                <Flex
                    flexDirection={{
                        base: "column",
                        sm: "column",
                        md: "column",
                        lg: "row",
                    }}
                    width={"100%"}
                >
                    <VStack
                        marginBottom={"20px"}
                        height={"100%"}
                        alignItems={"left"}
                    >
                        <Text
                            opacity={".62"}
                            width={"90%"}
                            backgroundColor={"#303C3A"}
                            fontSize={18}
                            textTransform={"uppercase"}
                            fontStyle={"italic"}
                            fontWeight={"bold"}
                            letterSpacing={"1.6px"}
                            paddingLeft={"2%"}
                            mb="10px"
                        >
                            Colors:
                        </Text>
                        <HStack justifyContent={"space-between"}>
                            <Grid
                                templateColumns={{
                                    base: "repeat(2, 1fr)",
                                    lg: "repeat(6, 1fr)",
                                }}
                                templateRows={{
                                    base: "repeat(7, 1fr)",
                                    xl: "repeat(2, 1fr)",
                                }}
                                w={"90%"}
                                h={{ base: "100%", xl: "108px" }}
                            >
                                <GridItem rowStart={1}>
                                    <Flex
                                        w={"100%"}
                                        alignItems={"center"}
                                        justifyContent={"flex-start"}
                                        flexDir={"row"}
                                    >
                                        <FullColorPicker
                                            type={"borderColor"}
                                            setColor={setBorderColor}
                                        />
                                        <Text>Border</Text>
                                    </Flex>
                                </GridItem>
                                <GridItem
                                    colStart={{ base: 1, lg: 4 }}
                                    rowStart={{ base: 3, lg: 1 }}
                                >
                                    <Flex
                                        w={"100%"}
                                        alignItems={"center"}
                                        justifyContent={"flex-start"}
                                        flexDir={"row"}
                                    >
                                        {card.curCard.number ? (
                                            <>
                                                <FullColorPicker
                                                    type="numberColor"
                                                    setColor={setNumberColor}
                                                />
                                                <Text>Number</Text>
                                            </>
                                        ) : (
                                            <Tooltip
                                                label="No jersey number selected. Add one back on step 2!"
                                                fontSize={"md"}
                                                placement={"right"}
                                            >
                                                <Flex
                                                    style={{
                                                        filter: "opacity(50%) grayscale(100%) brightness(0.4)",
                                                        cursor: "not-allowed",
                                                    }}
                                                    alignItems={"center"}
                                                >
                                                    <FullColorPicker
                                                        type="numberColor"
                                                        setColor={
                                                            setNumberColor
                                                        }
                                                        isDisabled={true}
                                                    />
                                                    <Text>Number</Text>
                                                </Flex>
                                            </Tooltip>
                                        )}
                                    </Flex>
                                </GridItem>
                                <GridItem
                                    rowStart={{
                                        base: 5,
                                        sm: 5,
                                        md: 5,
                                        lg: 5,
                                        xl: 3,
                                    }}
                                >
                                    <Flex
                                        w={"100%"}
                                        alignItems={"center"}
                                        justifyContent={"flex-start"}
                                        flexDir={"row"}
                                    >
                                        {card.curCard.signature ? (
                                            <>
                                                <FullColorPicker
                                                    type="signatureColor"
                                                    setColor={setSignatureColor}
                                                />
                                                <Text>Signature</Text>
                                            </>
                                        ) : (
                                            <Tooltip
                                                label="No signature found. Sign your masterpiece on step 3!"
                                                fontSize={"md"}
                                                placement={"right"}
                                            >
                                                <Flex
                                                    style={{
                                                        filter: "opacity(50%) grayscale(100%) brightness(0.4)",
                                                        cursor: "not-allowed",
                                                    }}
                                                    alignItems={"center"}
                                                >
                                                    <FullColorPicker
                                                        type="signatureColor"
                                                        setColor={
                                                            setSignatureColor
                                                        }
                                                        isDisabled={true}
                                                    />
                                                    <Text>Signature</Text>
                                                </Flex>
                                            </Tooltip>
                                        )}
                                    </Flex>
                                </GridItem>
                                <GridItem
                                    colStart={{ base: 1, sm: 1, md: 1, lg: 4 }}
                                    rowStart={{
                                        base: 7,
                                        sm: 7,
                                        md: 7,
                                        lg: 5,
                                        xl: 3,
                                    }}
                                >
                                    <Flex
                                        w={"100%"}
                                        alignItems={"center"}
                                        justifyContent={"flex-start"}
                                        flexDir={"row"}
                                    >
                                        <FullColorPicker
                                            type="nameColor"
                                            setColor={setNameColor}
                                        />
                                        <Text>Name</Text>
                                    </Flex>
                                </GridItem>
                            </Grid>
                        </HStack>
                    </VStack>
                    <Spacer />
                    <VStack
                        width={"90%"}
                        height={"100%"}
                        alignItems={"left"}
                        gap={"28px"}
                    >
                        <Text
                            opacity={".62"}
                            width={"100%"}
                            backgroundColor={"#303C3A"}
                            fontSize={18}
                            textTransform={"uppercase"}
                            fontStyle={"italic"}
                            fontWeight={"bold"}
                            letterSpacing={"1.6px"}
                            paddingLeft={"2%"}
                        >
                            Text Style:
                        </Text>
                        <HStack
                            // bgColor={"green"}
                            gap={2}
                        >
                            <Text
                                minW={"30%"}
                                fontSize={"sm"}
                                color={"white"}
                                fontWeight={"bold"}
                                transform={"skewX(-6deg)"}
                            >
                                Font Style:
                            </Text>
                            {/* solid or outline for card name */}
                            <RadioPicker
                                option1text={"Classic"}
                                option2text={"Marker"}
                                value={
                                    cardNameFont === "Uniser-Bold" ? "1" : "2"
                                }
                                onChange={(value) => {
                                    setCardNameFont(
                                        value === "1"
                                            ? "Uniser-Bold"
                                            : "'Brotherhood', sans-serif",
                                    );
                                }}
                            />
                        </HStack>
                        <HStack gap={2}>
                            <Text
                                minW={"30%"}
                                fontSize={"sm"}
                                color={"white"}
                                fontWeight={"bold"}
                                transform={"skewX(-6deg)"}
                            >
                                First Name:
                            </Text>
                            {/* solid or outline for first name */}
                            <RadioPicker
                                option1text={"Solid"}
                                option2text={"Outline"}
                                value={firstNameSolid ? "1" : "2"}
                                onChange={(value) => {
                                    setFirstNameSolid(value === "1");
                                }}
                            />
                        </HStack>
                        <HStack gap={2}>
                            <Text
                                minW={"30%"}
                                fontSize={"sm"}
                                color={"white"}
                                fontWeight={"bold"}
                                transform={"skewX(-6deg)"}
                            >
                                Last Name:
                            </Text>
                            {/* solid or outline for last name */}
                            <RadioPicker
                                option1text={"Solid"}
                                option2text={"Outline"}
                                value={lastNameSolid ? "1" : "2"}
                                onChange={(value) => {
                                    setLastNameSolid(value === "1");
                                }}
                            />
                        </HStack>
                    </VStack>
                </Flex>

                <VStack alignItems={"left"}>
                    <Text
                        opacity={".62"}
                        width={"100%"}
                        backgroundColor={"#303C3A"}
                        textTransform={"uppercase"}
                        fontSize={18}
                        fontStyle={"italic"}
                        fontWeight={"bold"}
                        letterSpacing={"1.6px"}
                        paddingLeft={"2%"}
                    >
                        Background Pattern:
                    </Text>

                    {/* 6 vertical photo placeholders */}
                    <HStack
                        mb={3}
                        pb={5}
                        spacing={4}
                        width={"100%"}
                        overflowX="scroll"
                        css={{
                            // Getting rid of default scrollbar
                            msOverflowStyle: "none",
                            // Creating custom scrollbar.
                            // Unfortunately the colors from themes don't work here so you have to hard code
                            "&::-webkit-scrollbar": { height: "0.75rem" },
                            "&::-webkit-scrollbar-track": {
                                backgroundColor: "#1E2423",
                                borderRadius: "5rem",
                            },
                            "&::-webkit-scrollbar-thumb": {
                                backgroundColor: "#2A302F",
                                borderRadius: "5rem",
                            },
                            "&::-webkit-scrollbar-thumb:hover": {
                                backgroundColor: "#363C3B",
                            },
                        }}
                    >
                        {/* Using a map function to generate vertical photo placeholders for each background */}
                        {Array.from({ length: numberOfBackgrounds }, (_, i) => {
                            return backgroundSelector(i);
                        })}
                    </HStack>
                </VStack>

                <VStack mt={{ base: 0, xl: -6 }} alignItems={"left"} pt="10px">
                    <Text
                        opacity={".62"}
                        width={"100%"}
                        backgroundColor={"#303C3A"}
                        textTransform={"uppercase"}
                        fontSize={18}
                        fontStyle={"italic"}
                        fontWeight={"bold"}
                        letterSpacing={"1.6px"}
                        paddingLeft={"2%"}
                    >
                        Background Color:
                    </Text>

                    {/* 3 color selector */}
                    <HStack
                        justifyContent={"space-between"}
                        width={"100%"}
                        flexWrap={"wrap"}
                    >
                        <Flex
                            gap={4}
                            alignItems={"center"}
                            justifyContent={"flex-end"}
                            flexDir={{
                                base: "row-reverse",
                                sm: "row-reverse",
                                md: "row-reverse",
                                lg: "row",
                            }}
                        >
                            <FullColorPicker
                                type="backgroundMainColor"
                                setColor={setBackgroundMainColor}
                            />
                            <Text>Primary</Text>
                            <Spacer />
                            <FullColorPicker
                                type="backgroundAccentColor"
                                setColor={setBackgroundAccentColor}
                            />
                            <Text>Secondary</Text>
                            <Spacer />
                            {card.curCard.cardType === "a" ? (
                                <>
                                    <FullColorPicker
                                        type="backgroundTextColor"
                                        setColor={setBackgroundTextColor}
                                        isDisabled={false}
                                    />
                                    <Text>Last Name</Text>
                                </>
                            ) : (
                                <Tooltip
                                    label="This customization only available in Card Design A."
                                    fontSize={"md"}
                                    placement={"right"}
                                >
                                    <Flex
                                        style={{
                                            filter: "opacity(50%) grayscale(100%) brightness(0.4)",
                                            cursor: "not-allowed",
                                        }}
                                        alignItems={"center"}
                                    >
                                        <FullColorPicker
                                            type="backgroundTextColor"
                                            setColor={setBackgroundTextColor}
                                            isDisabled={true}
                                        />
                                        <Text>Last Name</Text>
                                    </Flex>
                                </Tooltip>
                            )}
                        </Flex>
                    </HStack>
                </VStack>
            </VStack>
        </>
    );
}
