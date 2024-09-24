import { apiEndpoints } from "@backend/EnvironmentManager/EnvironmentManager";

/**
 * This file contains the function that will trade a card that has been bought.
 */
export async function tradeBoughtCard(
	card_uuid: string,
	card_generatedBy: string,
	orderUUID: string,
	receiever_uuid: string
): Promise<Response | null> {
	const myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

	// Assign the order to the receiver
	let assignOrderResponse: Response | null = null;

	assignOrderResponse = await fetch(apiEndpoints.assignOrder(), {
		method: "POST",
		headers: myHeaders,
		body: JSON.stringify({
			uuid: orderUUID,
			card_uuid: card_uuid,
			card_generatedBy: card_generatedBy,
			user_id: receiever_uuid,
		}),
	});

	return assignOrderResponse;

}
