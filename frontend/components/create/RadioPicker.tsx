"use client";

// eslint-disable-next-line no-use-before-define
import React from "react";
import { Radio, RadioGroup, Text, Flex, Icon } from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";

interface RadioPickerProps {
  option1text: string;
  option2text: string;
  option3text?: string;
  value?: string;
  onChange?: (value: string | boolean) => void;
  variant?: string;
}

/**
 * RadioPicker component creates radio buttons for the card creation process.
 *
 * @param {Object} props - The component props.
 * @param {string} props.option1text - The text for the first radio button.
 * @param {string} props.option2text - The text for the second radio button.
 * @param {string} [props.option3text] - The text for the third radio button (optional).
 * @param {string} [props.value] - The value of the radio button (optional).
 * @param {function} [props.onChange] - The function to call when the radio button is changed (optional).
 * @param {string} [props.variant] - The variant of the radio button (optional).
 * @returns {JSX.Element} The radio buttons component.
 */
export default function RadioPicker(props: RadioPickerProps) {
	// Auto set to "1" unless already set
	const [ value, setValue ] = React.useState(props.value || "1");

	// ADD CHECKMARKS FOR SELECTED RADIO BUTTONS

	/**
	 * Determine the box shadow for the radio button
	 * @param {string}
	 * @returns {string} The box shadow for the radio button
	 */
	function determineBoxShadow(value: string) {
		if (props.option1text === "All Cards") {
			return "none";
		}

		if (props.value === value) {
			return "0px 0px 10px #27CE00";
		}
		return "none";

	}

	/**
	 * Determine the check color for the radio button
	 * @param {string}
	 */
	function determineCheckColor(value: number) {
		if (props.value === value.toString()) {
			return "white";
		}
		return "transparent";
	}

	return (
		<>
			<RadioGroup
				value={value}
				onChange={(value) => {
					setValue(value);
					props.onChange?.(value);
				}}
				variant={props.variant || "default"}
				width={props.option3text ? "95%" : "100%"}
			>
				<Flex
					width={"100%"}
					maxW={props.variant ? "100%" : "200px"}
					alignItems={"center"}
					justifyContent={"space-between"}
				>
					<Radio boxShadow={determineBoxShadow("1")} value="1" gap={props.option3text ? 1 : 0}
						_checked={{ dropShadow: "none", backgroundColor: "green.100", borderColor: "green.100" }}
					>
						{props.option1text === "All" ?
							<></> :
							<Icon boxSize={3} position={"absolute"} left={"-23px"} top={"6px"} as={CheckIcon} color={determineCheckColor(1)} />
						}
						<Text textColor={props.value === "1" ? "green.100" : "white"}>
							{props.option1text}
						</Text>
					</Radio>

					<Radio boxShadow={determineBoxShadow("2")} value="2" gap={props.option3text ? 1 : 0}
						_checked={{ dropShadow: "none", backgroundColor: "green.100", borderColor: "green.100" }}
					>
						{props.option1text === "All" ?
							<></> :
							<Icon boxSize={3} position={"absolute"} left={"-23px"} top={"6px"} as={CheckIcon} color={determineCheckColor(2)} />
						}
						<Text textColor={props.value === "2" ? "green.100" : "white"}>
							{props.option2text}
						</Text>
					</Radio>

					{/* Optional 3rd radio button */}
					{props.option3text && (
						<Radio boxShadow={determineBoxShadow("3")} value="3" gap={props.option3text ? 1 : 0}
							_checked={{ dropShadow: "none", backgroundColor: "green.100", borderColor: "green.100" }}
						>
							{props.option1text === "All" ?
								<></> :
								<Icon boxSize={3} position={"absolute"} left={"-23px"} top={"6px"} as={CheckIcon} color={determineCheckColor(3)} />
							}
							<Text textColor={props.value === "3" ? "green.100" : "white"}>
								{props.option3text}
							</Text>
						</Radio>
					)}
				</Flex>
			</RadioGroup>
		</>
	);
}
