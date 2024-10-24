import { useState, useEffect } from "react";
import { Text, SimpleGrid } from "@chakra-ui/layout";

import FullColorPicker from "../FullColorSelector";
import { useCurrentCardInfo } from "@/hooks/useCurrentCardInfo";
import SharedStack from "@/components/shared/wrappers/shared-stack";

export default function MobileStep9() {
    const card = useCurrentCardInfo();

    const [backgroundMainColor, setBackgroundMainColor] = useState(
        card.curCard.backgroundMainColor,
    );
    const [backgroundAccentColor, setBackgroundAccentColor] = useState(
        card.curCard.backgroundAccentColor,
    );
    const [backgroundTextColor, setBackgroundTextColor] = useState(
        card.curCard.backgroundTextColor,
    );

    useEffect(() => {
        const thingsToCheck = [
            "",
            "",
            backgroundAccentColor,
            backgroundMainColor,
            "",
        ];

        const thingsInState = [
            "",
            "",
            card.curCard.backgroundAccentColor,
            card.curCard.backgroundMainColor,
            "",
        ];

        const toChange = [];

        for (let i = 0; i < thingsToCheck.length; i++) {
            if (thingsToCheck[i] !== thingsInState[i]) {
                toChange.push(i);
            }
        }

        card.setCurCard({
            ...card.curCard,
            backgroundMainColor: backgroundMainColor,
            backgroundAccentColor: backgroundAccentColor,
            backgroundTextColor: backgroundTextColor,
            partsToRecolor: toChange,
        });
    }, [backgroundMainColor, backgroundAccentColor, backgroundTextColor]);

    return (
        <SimpleGrid
            w={"100%"}
            columns={2}
            alignContent={"center"}
            px={"20px"}
            rowGap={"11px"}
            color="white"
        >
            <SharedStack row>
                <FullColorPicker
                    type="backgroundMainColor"
                    setColor={setBackgroundMainColor}
                />
                <Text>Primary</Text>
            </SharedStack>
            <SharedStack row>
                <FullColorPicker
                    type="backgroundAccentColor"
                    setColor={setBackgroundAccentColor}
                />
                <Text>Secondary</Text>
            </SharedStack>
            {card.curCard.cardType === "a" && (
                <SharedStack row>
                    <FullColorPicker
                        type="backgroundTextColor"
                        setColor={setBackgroundTextColor}
                        isDisabled={false}
                    />
                    <Text>Last Name</Text>
                </SharedStack>
            )}
        </SimpleGrid>
    );
}
