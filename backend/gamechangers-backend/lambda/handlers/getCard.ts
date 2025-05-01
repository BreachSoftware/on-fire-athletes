/* eslint-disable func-style */
import {
	Handler,
	APIGatewayProxyEvent,
	APIGatewayProxyResult,
} from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { sendResponse } from "../utils/responseFunctions";
import { dbTables } from "../../EnvironmentManager/EnvironmentManager";

// Create an instance of the DynamoDB DocumentClient
const dynamoDb = new DynamoDB.DocumentClient();

interface Response {
	headers: { [key: string]: string | number | boolean };
	statusCode: number;
	body: string;
}

/**
 * Gets a pre-existing card.
 * @param event - The API Gateway event object.
 * @returns A promise that resolves to the API Gateway proxy result.
 */
export const getCard: Handler = async (
	event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
	const headers = {
		"Content-Type": "application/json",
	};

	const lambdaResponse: Response = {
		headers: headers,
		statusCode: 400,
		body: JSON.stringify({
			success: false,
			message: "Error getting images for user",
			input: event,
		}),
	};

	if (!event.queryStringParameters) {
		lambdaResponse.statusCode = 400;
		lambdaResponse.body = JSON.stringify({
			success: false,
			message: "Error! Required query string parameters are missing!",
		});

		return Promise.resolve(lambdaResponse);
	}

	const queryStringParameters = event.queryStringParameters;

	const uuid = queryStringParameters.uuid;
	const _generatedBy = queryStringParameters.generatedBy; // Re-added, though unused in scan

	if (!uuid) {
		return Promise.resolve({
			statusCode: 400,
			headers: headers,
			body: JSON.stringify({
				success: false,
				message:
					"Error! Missing one or more required query parameters. uuid or generatedBy is null.", // Reverted message
			}),
		});
	} else if (typeof uuid !== "string") {
		return Promise.resolve({
			statusCode: 400,
			headers: headers,
			body: JSON.stringify({
				success: false,
				message:
					"Error! Incorrect type for one or more query parameters. uuid and generatedBy should be strings.", // Reverted message
			}),
		});
	}

	try {
		// Loop through scans until the card is found or no more items
		let lastEvaluatedKey: DynamoDB.DocumentClient.Key | undefined;
		do {
			const scanParams: DynamoDB.DocumentClient.ScanInput = {
				TableName: dbTables.GamechangersCards(),
				FilterExpression: "#uuidKey = :uuidVal",
				ExpressionAttributeNames: { "#uuidKey": "uuid" },
				ExpressionAttributeValues: { ":uuidVal": uuid },
				...(lastEvaluatedKey
					? { ExclusiveStartKey: lastEvaluatedKey }
					: {}),
			};
			const { Items, LastEvaluatedKey } = await dynamoDb
				.scan(scanParams)
				.promise();

			// If we found the item, return it immediately
			if (Items && Items.length > 0) {
				return sendResponse(200, Items[0] as object);
			}

			// The loop should continue as long as there are more pages (LastEvaluatedKey exists)
			lastEvaluatedKey = LastEvaluatedKey;
		} while (lastEvaluatedKey);

		// If the loop completes without finding the item, it means the item wasn't found after scanning the entire table.
		return sendResponse(404, { error: "The card does not exist" });
	} catch (error) {
		console.error("Error scanning DynamoDB:", error); // Updated log message

		// Return an error response with a 500 status code
		return sendResponse(500, {
			error: "An error occurred when retrieving the card",
		});
	}
};
