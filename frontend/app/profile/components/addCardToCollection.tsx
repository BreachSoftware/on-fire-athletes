import { tradeCard } from "@/hooks/tradeCardFunc";
import TradingCardInfo from "@/hooks/TradingCardInfo";

interface CardInfoElementProps {
	card: TradingCardInfo;
	currentUserId: string;

}

/**
 * Function to add the card to the user's collection
 * @param card the card to add to the collection
 * @param currentUserId the current user's ID
 */
export async function addCardToCollection({ card, currentUserId }: CardInfoElementProps) {
	// Add the card to the user's collection by trading it to themselves
	await tradeCard(card.generatedBy, card.uuid, card.generatedBy, currentUserId);
	window.location.href = `/profile?user=${currentUserId}&card=${card.uuid}&tab=traded`;
};
