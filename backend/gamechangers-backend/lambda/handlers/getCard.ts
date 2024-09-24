/* eslint-disable func-style */
import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
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
export const getCard: Handler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

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
		})
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
	const generatedBy = queryStringParameters.generatedBy;

	if (!uuid || !generatedBy) {
		return Promise.resolve({
			statusCode: 400,
			headers: headers,
			body: JSON.stringify({
				success: false,
				message: "Error! Missing one or more required query parameters. uuid or generatedBy is null.",
			})
		});
	} else if (typeof uuid !== "string" || typeof generatedBy !== "string") {
		return Promise.resolve({
			statusCode: 400,
			headers: headers,
			body: JSON.stringify({
				success: false,
				message: "Error! Incorrect type for one or more query parameters. uuid and generatedBy should be strings.",
			})
		});
	}


	try {
		// Define the parameters for the DynamoDB get operation
		const params = {
			TableName: dbTables.GamechangersCards(),
			Key: {
				uuid: uuid,
				generatedBy: generatedBy,
			},
		};

		// Retrieve the card item from the DynamoDB table
		const data = await dynamoDb.get(params).promise();

		// Check if the card item exists
		if (!data.Item) {
			return sendResponse(404, { error: "The card does not exist" });
		}

		return sendResponse(200, data.Item as object);

	} catch (error) {

		console.error("Error:", error);

		// Return an error response with a 500 status code
		return sendResponse(500, { error: "An error occurred when retrieving the card" });
	}
};
