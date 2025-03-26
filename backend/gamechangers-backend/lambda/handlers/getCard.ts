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
	const _generatedBy = queryStringParameters.generatedBy;

	if (!uuid) {
		return Promise.resolve({
			statusCode: 400,
			headers: headers,
			body: JSON.stringify({
				success: false,
				message:
					"Error! Missing one or more required query parameters. uuid or generatedBy is null.",
			}),
		});
	} else if (typeof uuid !== "string") {
		return Promise.resolve({
			statusCode: 400,
			headers: headers,
			body: JSON.stringify({
				success: false,
				message:
					"Error! Incorrect type for one or more query parameters. uuid and generatedBy should be strings.",
			}),
		});
	}

	try {
		// Define the parameters for the DynamoDB scan operation
		const params = {
			TableName: dbTables.GamechangersCards(),
			FilterExpression: "#uuidKey = :uuidVal",
			ExpressionAttributeNames: {
				"#uuidKey": "uuid",
			},
			ExpressionAttributeValues: {
				":uuidVal": uuid,
			},
		};

		// Retrieve the card items from DynamoDB using scan
		const data = await dynamoDb.scan(params).promise();

		// Check if any items were returned
		if (!data.Items || data.Items.length === 0) {
			if (data.LastEvaluatedKey) {
				const params: DynamoDB.DocumentClient.ScanInput = {
					TableName: dbTables.GamechangersCards(),
					ExclusiveStartKey: data.LastEvaluatedKey,
					FilterExpression: "#uuidKey = :uuidVal",
					ExpressionAttributeNames: {
						"#uuidKey": "uuid",
					},
					ExpressionAttributeValues: {
						":uuidVal": uuid,
					},
				};

				const secondScan = await dynamoDb.scan(params).promise();

				if (secondScan.Items && secondScan.Items.length > 0) {
					return sendResponse(200, secondScan.Items[0] as object);
				}
			}

			return sendResponse(404, { error: "The card does not exist" });
		}

		// If items exist, send the first item back
		return sendResponse(200, data.Items[0] as object);
	} catch (error) {
		console.error("Error:", error);

		// Return an error response with a 500 status code
		return sendResponse(500, {
			error: "An error occurred when retrieving the card",
		});
	}
};
