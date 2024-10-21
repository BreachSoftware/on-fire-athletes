import { useState, useEffect } from "react";
import { Tooltip } from "@chakra-ui/tooltip";
import { Text, SimpleGrid } from "@chakra-ui/layout";

import FullColorPicker from "../FullColorSelector";
import { useCurrentCardInfo } from "@/hooks/useCurrentCardInfo";
import SharedStack from "@/components/shared/wrappers/shared-stack";

export default function MobileStep6() {
    const card = useCurrentCardInfo();

    const [borderColor, setBorderColor] = useState(card.curCard.borderColor);
    const [nameColor, setNameColor] = useState(card.curCard.nameColor);
    const [numberColor, setNumberColor] = useState(card.curCard.numberColor);
    const [signatureColor, setSignatureColor] = useState(
        card.curCard.signatureColor,
    );

    useEffect(() => {
        const thingsToCheck = [
            borderColor,
            borderColor,
            nameColor,
            numberColor,
            signatureColor,
        ];

        const thingsInState = [
            card.curCard.borderColor,
            card.curCard.borderColor,
            card.curCard.nameColor,
            card.curCard.numberColor,
            card.curCard.signatureColor,
        ];

        const toChange = [];

        for (let i = 0; i < thingsToCheck.length; i++) {
            if (thingsToCheck[i] !== thingsInState[i]) {
                toChange.push(i);
            }
        }

        card.setCurCard({
            ...card.curCard,
            borderColor: borderColor,
            nameColor: nameColor,
            numberColor: numberColor,
            signatureColor: signatureColor,
            partsToRecolor: toChange,
        });
    }, [borderColor, nameColor, numberColor, signatureColor]);

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
                <FullColorPicker type="borderColor" setColor={setBorderColor} />
                <Text>Border</Text>
            </SharedStack>
            {card.curCard.number ? (
                <SharedStack row>
                    <FullColorPicker
                        type="numberColor"
                        setColor={setNumberColor}
                    />
                    <Text>Number</Text>
                </SharedStack>
            ) : (
                <Tooltip
                    label="No jersey number selected. Add one back on step 2!"
                    fontSize={"md"}
                    placement={"right"}
                >
                    <SharedStack
                        style={{
                            filter: "opacity(50%) grayscale(100%) brightness(0.4)",
                            cursor: "not-allowed",
                        }}
                        alignItems={"center"}
                    >
                        <FullColorPicker
                            type="numberColor"
                            setColor={setNumberColor}
                            isDisabled={true}
                        />
                        <Text>Number</Text>
                    </SharedStack>
                </Tooltip>
            )}
            <SharedStack row>
                <FullColorPicker type="nameColor" setColor={setNameColor} />
                <Text>Name</Text>
            </SharedStack>
            {card.curCard.signature && (
                <>
                    <FullColorPicker
                        type="signatureColor"
                        setColor={setSignatureColor}
                    />
                    <Text>Signature</Text>
                </>
            )}
        </SimpleGrid>
    );
}
