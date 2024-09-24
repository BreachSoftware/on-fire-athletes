import { Textarea } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useCurrentCardInfo } from "@/hooks/useCurrentCardInfo";
import TradingCardInfo from "@/hooks/TradingCardInfo";


interface CardDescriptionProps {
	key: string;
}

/**
 * THis component contains the content of Step 3 in the card creation process
 *
 * @returns the content of Step 3 in the card creation process
 */
export default function CardDescription(props: CardDescriptionProps) {

	// Get the current card info from the context
	const card = useCurrentCardInfo();

	const [ description, setDescription ] = useState(card.curCard.NFTDescription);

	// Update the card preview when the component mounts and when the user changes the color
	useEffect(() => {

		TradingCardInfo.showInfo(card.curCard);
		card.setCurCard({
			...card.curCard,
			NFTDescription: description,

		});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		description
	]);


	return (
		<>
			<Textarea
				key={props.key}
				placeholder={
					"Provide a detailed description of your creation that will be displayed with your digital sports card.\n\nMax 250 characters."
				}
				p="5%"
				_placeholder={{ color: "white", fontSize: "11px" }}
				fontSize={"11px"}
				height="100%"
				resize="none"
				maxLength={250}
				color={"white"}
				opacity={".67"}
				backgroundColor={"#353B38"}
				value={description}
				onChange={(e) => {
					setDescription(e.target.value);
				}}
			/>
		</>
	);
}

