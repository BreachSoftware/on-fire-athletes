import { useEffect, useState } from "react";
import { VStack, Text, TextProps } from "@chakra-ui/react";
import "@fontsource/chakra-petch/600.css"; // Thick 600 weight. Other weights will render incorrectly

const chakraPetchProps = {
    fontFam: "Chakra Petch",
    spaceBetweenText: 2,
    textWallHeight: 303,
    maxWidth: 236,
    minWidth: 230,
    top: "38px",
    left: "80px",
    fontWeight: "400",
    letterSpacing: "4.4px",
};

const brotherhoodProps = {
    fontFam: "'Brotherhood', sans-serif",
    spaceBetweenText: 4,
    textWallHeight: 312,
    maxWidth: 232,
    minWidth: 228,
    top: "44px",
    left: "86px",
    fontWeight: "400",
    letterSpacing: "0px",
};

type RepeatingPetchProps = TextProps & {
    text: string;
    position: string;
    fontFam: string;
};

/**
 * The RepeatingPetch component that is used on gamecard A.
 * Auto-scales width to 300px.
 * @param text the text to repeat
 * @returns the React component for the repeating petch.
 */
export default function RepeatingPetch({
    text,
    position,
    fontFam,
    ...rest
}: RepeatingPetchProps) {
    const [fontSize, setFontSize] = useState<number>(100);
    const [numLines, setNumLines] = useState<number>(0);
    const textToShow = text.toUpperCase();

    const fontPropsMapper: Record<string, typeof chakraPetchProps> = {
        "Chakra Petch": chakraPetchProps,
        "'Brotherhood', sans-serif": brotherhoodProps,
    };

    const fontProps = fontPropsMapper[fontFam] || chakraPetchProps;

    const maxWidth = fontProps.maxWidth;
    const minWidth = fontProps.minWidth;
    const textWallHeight = fontProps.textWallHeight;
    const spaceBetweenText = fontProps.spaceBetweenText;

    const uniqueID = `id-${Math.random().toString(36).substring(2, 16)}`;

    useEffect(() => {
        const element = document.getElementById(uniqueID);
        // If this is a while loop, then the whole thing loops infinitely. Unfortunately need to rerender the component
        if (element) {
            setNumLines(
                Math.round(
                    textWallHeight / (element.offsetHeight + spaceBetweenText),
                ),
            );
            const difference = Math.abs(element.offsetWidth - maxWidth);

            const amountToChange = Math.max(Math.floor(difference / 5), 1);
            if (element.offsetWidth > maxWidth) {
                setFontSize(fontSize - amountToChange);
            } else if (element.offsetWidth < minWidth) {
                setFontSize(fontSize + amountToChange);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text, fontSize]);

    useEffect(() => {
        const element = document.getElementById(uniqueID);
        // If this is a while loop, then the whole thing loops infinitely. Unfortunately need to rerender the component
        if (element) {
            setFontSize(fontSize * 0.9);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fontFam]);

    if (text.length < 2) {
        return null;
    }

    const textAttributes: TextProps = {
        pt: 0.5,
        noOfLines: 1,
        fontWeight: fontProps.fontWeight,
        fontSize: fontFam === "Chakra Petch" ? fontSize : fontSize * 0.9,
        width: fontFam === "Chakra Petch" ? "100%" : "105%",
        letterSpacing: fontProps.letterSpacing,
        lineHeight: "0.74em",
        fontStyle: "center",
        fontFamily: fontFam,
        overflow: "unset",
        ...rest,
    };

    /**
     * Duplicates a single row the proper amount for the text.
     */
    function renderProperNumberOfLines() {
        if (numLines === 0) {
            return null;
        }

        return Array.from({ length: numLines }, (_, index) => {
            const opacity = 1 - (index + 1) / numLines;
            return (
                <Text key={index} {...textAttributes} opacity={opacity}>
                    {textToShow}
                </Text>
            );
        });
    }

    return (
        <VStack
            zIndex={2}
            spacing={spaceBetweenText}
            top={fontProps.top}
            left={fontProps.left}
            position={position}
        >
            <Text id={uniqueID} {...textAttributes}>
                {textToShow}
            </Text>
            {renderProperNumberOfLines()}
        </VStack>
    );
}
