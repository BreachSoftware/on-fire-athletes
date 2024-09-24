import { HStack, VStack, Flex, Textarea } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useCurrentCardInfo } from "@/hooks/useCurrentCardInfo";
import TradingCardInfo from "@/hooks/TradingCardInfo";

/**
 * THis component contains the content of Step 3 in the card creation process
 *
 * @returns the content of Step 3 in the card creation process
 */
export default function Step5() {

	// Get the current card info from the context
	const card = useCurrentCardInfo();

	const [ description, setDiscription ] = useState(card.curCard.NFTDescription);

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
			<VStack
				width={"100%"}
				height={"100%"}
				alignItems={"left"}
				justifyContent={"space-evenly"}
				// paddingTop={8}
				gap={8}
				color={"white"}
				fontFamily={"Barlow Semi Condensed"}
			>

				<HStack width={"100%"} justifyContent={"space-between"} flexWrap={"wrap"}>
					<Flex align="center" justifyContent={"center"} height={"100%"} width={"100%"} minWidth={"150px"}>
						<Textarea placeholder={
							"Provide a detailed description of your creation that will be displayed with your digital sports card. Max 250 characters."
						}
						_placeholder={{ color: "white", }}
						paddingTop={"5%"}
						paddingLeft={"5%"}
						paddingRight={"5%"}
						maxLength={250}
						resize={"none"}
						color={"white"}
						opacity={".67"}
						backgroundColor={"#353B38"}
						value={description}
						onChange={(e) => {
							setDiscription(e.target.value);
						}} height={{ base: "10vh", md: "25vh" }} />
					</Flex>

				</HStack>


			</VStack>
		</>
	);
}

