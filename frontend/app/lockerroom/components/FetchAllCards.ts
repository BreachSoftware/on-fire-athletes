import TradingCardInfo, { PaymentStatus } from "@/hooks/TradingCardInfo";
import { apiEndpoints } from "@backend/EnvironmentManager/EnvironmentManager";

/**
 *
 * Fetches all cards from the backend
 *
 * @returns A list of all cards
 *
 */
export async function fetchAllCards(options?: { page: number; limit: number }) {
    const { page, limit } = options || {};

    try {
        const apiUrl = new URL(apiEndpoints.getAllCards());
        if (limit) {
            apiUrl.searchParams.set("limit", limit.toString());
        }
        if (page) {
            apiUrl.searchParams.set("page", page.toString());
        }

        const response = await fetch(apiUrl.toString());
        const data = await response.json();
        if (response.status === 404) {
            // Assume no cards are in the database
            return [];
        }
        let fetchedCards = data.map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (card: TradingCardInfo) => {
                if (
                    !card.cardImage ||
                    card.cardImage === "TO BE REPLACED WITH S3 LINK"
                ) {
                    card.cardImage = "https://via.placeholder.com/150";
                }
                return new TradingCardInfo({
                    ...card,
                });
            },
        );

        // Filter to only cards that have been paid for
        fetchedCards = fetchedCards.filter((card: TradingCardInfo) => {
            return card.paymentStatus === PaymentStatus.SUCCESS;
        });

        return fetchedCards;
    } catch (error) {
        console.error("Error fetching cards:", error);
        throw error;
    }
}
