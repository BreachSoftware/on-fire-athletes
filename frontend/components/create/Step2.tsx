import { HStack, Grid, VStack, Input, Text, GridItem } from "@chakra-ui/react";
import { useCurrentCardInfo } from "@/hooks/useCurrentCardInfo";
import { KeyboardEvent } from "react";
import DropdownInput from "./DropdownInput";
import { SportsPositions } from "./SportsPositions";
import { SportsLevels } from "./SportsLevels";
import PositionDropdown from "./PositionDropdown";
import SharedCreateInput from "./SharedCreateInput";
import TradingCardInfo from "@/hooks/TradingCardInfo";
import SharedStack from "../shared/wrappers/shared-stack";

/**
 * This function checks if the key pressed is a number
 * @param event the key press event
 */
export function checkIfNumber(event: KeyboardEvent<HTMLInputElement>) {
    /**
     * Allowing: Integers | Backspace | Tab | Delete | Left & Right arrow keys
     **/
    const regex = new RegExp(
        /(^\d*$)|(Backspace|Tab|Delete|ArrowLeft|ArrowRight)/,
    );

    return !event.key.match(regex) && event.preventDefault();
}

/**
 * This component contains the content of Step 2 in the card creation process
 *
 * @returns the content of Step 2 in the card creation process
 */
export default function Step2() {
    const card = useCurrentCardInfo();

    const handleTextChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        cardField: keyof TradingCardInfo,
    ) => {
        card.setCurCard({
            ...card.curCard,
            [cardField]: e.target.value,
        });
    };

    return (
        <SharedStack
            height={"100%"}
            justifyContent={"space-evenly"}
            gap={8}
            fontFamily={"Barlow Semi Condensed"}
        >
            {/* Portrait orientation section */}

            {/* Input grid */}
            <SharedStack row spaced flexWrap={"wrap"}>
                <Text color="white">*Required fields.</Text>
                <Grid
                    templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                    templateRows={{
                        base: "1fr 1fr 1fr 1fr 1fr",
                        md: "1fr 1fr, 1fr 1fr, 1fr 1fr",
                    }}
                    gap={4}
                    width={"100%"}
                >
                    {/* User Inputs */}
                    <SharedCreateInput
                        value={card.curCard.firstName}
                        onChange={(e) => handleTextChange(e, "firstName")}
                        placeholder="First Name*"
                        maxLength={13}
                    />

                    <SharedCreateInput
                        value={card.curCard.lastName}
                        onChange={(e) => handleTextChange(e, "lastName")}
                        placeholder="Last Name*"
                        maxLength={13}
                    />

                    <SharedCreateInput
                        value={card.curCard.number}
                        onChange={(e) => handleTextChange(e, "number")}
                        placeholder="Jersey Number"
                        maxLength={2}
                        type="number"
                        onKeyDown={(event) => checkIfNumber(event)}
                    />

                    <DropdownInput
                        isDisabled={card.curCard.inputDisabled}
                        title={card.curCard.sport || "Sport*"}
                        options={[
                            // the names of all the titles in the SportsPositions file
                            ...Object.keys(SportsPositions),
                        ]}
                        attribute="sport"
                    />

                    <PositionDropdown />

                    {/* Career Level dropdown */}
                    <DropdownInput
                        isDisabled={card.curCard.inputDisabled}
                        title={card.curCard.sport || "CareerLevel*"}
                        options={SportsLevels}
                        attribute="careerLevel"
                    />

                    <GridItem as={GridItem} colSpan={{ base: 1, md: 2 }}>
                        <SharedCreateInput
                            value={card.curCard.teamName}
                            onChange={(e) => handleTextChange(e, "teamName")}
                            placeholder="Team Name or Hometown*"
                            maxLength={22}
                        />
                    </GridItem>
                </Grid>
            </SharedStack>
        </SharedStack>
    );
}
