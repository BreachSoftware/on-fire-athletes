import { HStack, Grid, VStack, Input, Text, GridItem } from "@chakra-ui/react";
import { useCurrentCardInfo } from "@/hooks/useCurrentCardInfo";
import { KeyboardEvent } from "react";
import DropdownInput from "./DropdownInput";
import { SportsPositions } from "./SportsPositions";
import { SportsLevels } from "./SportsLevels";
import PositionDropdown from "./PositionDropdown";

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

    return (
        <>
            <VStack
                width={"100%"}
                height={"100%"}
                alignItems={"left"}
                justifyContent={"space-evenly"}
                gap={8}
                fontFamily={"Barlow Semi Condensed"}
            >
                {/* Portrait orientation section */}

                {/* Input grid */}
                <HStack
                    width={"100%"}
                    justifyContent={"space-between"}
                    flexWrap={"wrap"}
                >
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
                        {/* Fake username and password fields, to make sure that
						Google Autocomplete stuff doesnt randomly pop up when typing things */}
                        <Input
                            type="username"
                            display="none"
                            autoComplete="off"
                        />
                        <Input
                            type="password"
                            display="none"
                            autoComplete="off"
                        />

                        {/* User Inputs */}
                        <Input
                            variant={"basicInput"}
                            autoComplete="off"
                            isDisabled={card.curCard.inputDisabled}
                            backgroundColor={"gray.200"}
                            placeholder={"First Name*"}
                            value={card.curCard.firstName}
                            onChange={(e) => {
                                if (e.target.value.length > 13) {
                                    e.target.value = e.target.value.slice(
                                        0,
                                        13,
                                    );
                                }
                                card.setCurCard({
                                    ...card.curCard,
                                    firstName: e.target.value,
                                });
                            }}
                        />

                        <Input
                            variant={"basicInput"}
                            autoComplete="off"
                            isDisabled={card.curCard.inputDisabled}
                            backgroundColor={"gray.200"}
                            placeholder={"Last Name*"}
                            value={card.curCard.lastName}
                            onChange={(e) => {
                                if (e.target.value.length > 13) {
                                    e.target.value = e.target.value.slice(
                                        0,
                                        13,
                                    );
                                }
                                card.setCurCard({
                                    ...card.curCard,
                                    lastName: e.target.value,
                                });
                            }}
                        />

                        <Input
                            variant={"basicInput"}
                            autoComplete="off"
                            isDisabled={card.curCard.inputDisabled}
                            backgroundColor={"gray.200"}
                            placeholder={"Jersey Number"}
                            value={card.curCard.number}
                            type={"number"}
                            onKeyDown={(event) => {
                                checkIfNumber(event);
                            }}
                            onChange={(e) => {
                                // Doing this because maxLength didnt work
                                if (e.target.value.length > 2) {
                                    e.target.value = e.target.value.slice(0, 2);
                                }
                                card.setCurCard({
                                    ...card.curCard,
                                    number: e.target.value,
                                });
                            }}
                        />

                        <DropdownInput
                            isDisabled={card.curCard.inputDisabled}
                            title={
                                card.curCard.sport === ""
                                    ? "Sport*"
                                    : card.curCard.sport
                            }
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
                            title={
                                card.curCard.careerLevel === ""
                                    ? "Career Level"
                                    : card.curCard.careerLevel
                            }
                            options={SportsLevels}
                            attribute="careerLevel"
                        />

                        <GridItem as={GridItem} colSpan={{ base: 1, md: 2 }}>
                            <Input
                                variant={"basicInput"}
                                autoComplete="off"
                                isDisabled={card.curCard.inputDisabled}
                                w={"100%"}
                                backgroundColor={"#303C3A"}
                                placeholder={"Team Name or Hometown*"}
                                value={card.curCard.teamName}
                                onChange={(e) => {
                                    // The max length is 22
                                    if (e.target.value.length > 22) {
                                        e.target.value = e.target.value.slice(
                                            0,
                                            22,
                                        );
                                    }
                                    card.setCurCard({
                                        ...card.curCard,
                                        teamName: e.target.value,
                                    });
                                }}
                            />
                        </GridItem>
                    </Grid>
                </HStack>
            </VStack>
        </>
    );
}
