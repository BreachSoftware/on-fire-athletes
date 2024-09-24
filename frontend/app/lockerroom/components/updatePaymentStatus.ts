import { getCard } from "@/app/generate_card_asset/cardFunctions";
import { apiEndpoints } from "@backend/EnvironmentManager/EnvironmentManager";

/**
 *
 * Updates a card's payment status to the given status
 *
 * @returns The result of the API call
 *
 */
export async function updatePaymentStatus(generatedBy: string, card_uuid: string, paymentStatus: number) {
	try {
		const myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");

		const raw = JSON.stringify({
			generatedBy: generatedBy,
			uuid: card_uuid,
			paymentStatus: paymentStatus
		});

		const requestOptions = {
			method: "POST",
			headers: myHeaders,
			body: raw,
		};
		const response = await fetch(apiEndpoints.updatePaymentStatus(), requestOptions); // change to prod
		const data = await response.json();

		// Get the card data from the card whose payment status was updated
		const cardData = await getCard(card_uuid, generatedBy);

		// Make serialized cards in DynamoDB
		for (let i = 0; i < cardData.totalCreated; i++) {
			const cardSerializationOptions = {
				method: "POST",
				headers: myHeaders,
				body: JSON.stringify({
					uuid: cardData.uuid,
					serialNumber: i + 1, // Serial numbers start at 1
					generatedBy: cardData.generatedBy,
				}),
			};
			// Create serialized cards in DynamoDB
			await fetch(apiEndpoints.createSerializedCard(), cardSerializationOptions);
		}

		// Update the amount of cards available
		const updateAvailableCardsOptions = {
			method: "POST",
			headers: myHeaders,
			body: JSON.stringify({
				uuid: cardData.uuid,
				generatedBy: cardData.generatedBy,
				totalCreated: cardData.totalCreated,
				currentlyAvailable: cardData.totalCreated,
			}),
		};
		await fetch(apiEndpoints.updateTotalCards(), updateAvailableCardsOptions);

		return data;

	} catch (error) {
		console.error("Error updating paymentStatus:", error);
		throw error;
	}
}
