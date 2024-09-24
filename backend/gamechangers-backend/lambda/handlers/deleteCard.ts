/* eslint-disable func-style */
import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { dbTables } from "../../EnvironmentManager/EnvironmentManager";

// Create an instance of the DynamoDB DocumentClient
const dynamoDb = new DynamoDB.DocumentClient();

/**
 * Deletes a card.
 * @param event - The API Gateway event object.
 * @returns A promise that resolves to the API Gateway proxy result.
 */
export const deleteCard: Handler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

	// Check for empty event body
	if (!event.body) {
		return {
			statusCode: 400,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ error: "The request body cannot be empty" }),
		};
	}

	// Parse the request body from the event
	const data = JSON.parse(event.body as string);

	// Error Checking
	if (data.generatedBy === undefined) {
		return {
			statusCode: 400,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ error: "The request body must contain a generatedBy property" }),
		};
	} else if (data.generatedBy === "") {
		return {
			statusCode: 400,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ error: "The generatedBy property cannot be empty" }),
		};
	} else if (typeof data.generatedBy !== "string") {
		return {
			statusCode: 400,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ error: "The generatedBy property must be of type string" }),
		};
	} else if (data.uuid === undefined) {
		return {
			statusCode: 400,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ error: "The request body must contain a uuid property" }),
		};
	} else if (data.uuid === "") {
		return {
			statusCode: 400,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ error: "The uuid property cannot be empty" }),
		};
	} else if (typeof data.uuid !== "string") {
		return {
			statusCode: 400,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ error: "The uuid property must be of type string" }),
		};
	}

	// Define the parameters for the DynamoDB delete operation
	const params = {
		TableName: dbTables.GamechangersCards(),
		Key: {
			generatedBy: data.generatedBy,
			uuid: data.uuid,
		},
	};

	try {
		// Check if the card item exists in the DynamoDB table
		const card = await dynamoDb.get(params).promise();
		if (!card.Item) {
			return {
				statusCode: 404,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ error: "The card item does not exist" }),
			};
		}

		// Delete the card item from the DynamoDB table
		await dynamoDb.delete(params).promise();

		// Return a success response with the created card item
		return {
			statusCode: 200,
			body: JSON.stringify("SUCCESS: Card deleted."),
		};
	} catch (error) {
		// Log the error if an exception occurs
		console.error("The following error occurred when deleting a card: ");
		console.error(error);

		// Return an error response with a 500 status code
		return {
			statusCode: 500,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ error: error }),
		};
	}
};
