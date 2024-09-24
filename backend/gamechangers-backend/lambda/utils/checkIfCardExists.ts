import { DynamoDB } from "aws-sdk";
import { dbTables } from "../../EnvironmentManager/EnvironmentManager";

/**
 * Check if a card exists in the database
 * @param card_uuid the uuid of the card
 * @returns true if the card exists, false otherwise
 */
export async function checkIfCardExists(card_uuid: string, card_generatedBy: string) {
	const docClient = new DynamoDB.DocumentClient();

	const params = {
		TableName: dbTables.GamechangersCards(),
		Key: {
			generatedBy: card_generatedBy,
			uuid: card_uuid
		}
	};

	try {
		const data = await docClient.get(params).promise();

		if (!data.Item) {
			return {
				statusCode: 404,
				headers: { "Content-Type": "text/plain" },
				body: JSON.stringify({ error: "The card's uuid does not exist in the database" }),
			};
		}

		return {
			statusCode: 200,
			headers: { "Content-Type": "text/plain" },
			body: JSON.stringify({ message: "The card's uuid exists in the database" }),
		};

	} catch (error) {
		console.error("An error occurred while checking if the card exists in the database");
		console.error(error);

		// Return an error response with a 500 status code
		return {
			statusCode: 500,
			headers: { "Content-Type": "text/plain" },
			body: JSON.stringify({ error: error }),
		};
	}
}
