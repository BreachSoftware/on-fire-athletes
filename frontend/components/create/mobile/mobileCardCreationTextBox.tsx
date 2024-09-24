import { Input } from "@chakra-ui/react";
import { useEffect } from "react";
import { useCurrentCardInfo } from "@/hooks/useCurrentCardInfo";
import TradingCardInfo from "@/hooks/TradingCardInfo";
import { useCompletedSteps as useMobileProgress } from "../../../hooks/useMobileProgress";
import { checkIfNumber } from "../Step2";

interface MobileCardCreationTextBoxProps {
  attribute: keyof TradingCardInfo;
  placeholder: string;
  type?: string;
  maxLength?: number;
}

/**
 * This contains a text box and takes props for what variable to update
 * @param props the props for the component
 */
export default function MobileCardCreationTextBox(props: MobileCardCreationTextBoxProps) {
	// Get the current card info from the context
	const card = useCurrentCardInfo();
	const stepHook = useMobileProgress();
	const mobileProgress = stepHook.mobileProgress;

	// Update the card preview when the component mounts and when the user changes the attribute value
	useEffect(() => {
		TradingCardInfo.showInfo(card.curCard);
		card.setCurCard({
			...card.curCard,
		});

		// Set the mobileStepsHook's condition to true if the attribute is not empty.
		// This means it's changed.
		mobileProgress.conditions.set(props.attribute, card.curCard[props.attribute] !== "");

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ card.curCard[props.attribute] ]);

	return (
		<>
			<Input
				variant={"basicInput"}
				isDisabled={card.curCard.inputDisabled}
				placeholder={props.placeholder}
				_placeholder={{ color: "white" }}
				maxLength={250}
				h={"40px"}
				color={"white"}
				opacity={1}
				backgroundColor={"#121212"}
				border={"none"}
				value={card.curCard[props.attribute] as string}
				type={props.type}
				onKeyDown={(event) => {
					// If our type is "number", only allow numbers to be input
					if(props.type === "number") {
						checkIfNumber(event);
					}
				}}
				onChange={(e) => {

					// If maxLength is set, limit the input to never exceed that length
					if(props.maxLength && e.target.value.length > props.maxLength) {
						e.target.value = e.target.value.slice(0, props.maxLength);
					}
					card.setCurCard({
						...card.curCard,
						[props.attribute]: e.target.value,
					});
				}}
			/>
		</>
	);
}
