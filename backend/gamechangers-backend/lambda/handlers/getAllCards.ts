/* eslint-disable func-style */
import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { sendResponse } from "../utils/responseFunctions";
import { dbTables } from "../../EnvironmentManager/EnvironmentManager";

// Create an instance of the DynamoDB DocumentClient
const dynamoDb = new DynamoDB.DocumentClient();

/**
 * Gets all cards from the DynamoDB table, ordered by createdAt attribute.
 * @param event - The API Gateway event object.
 * @returns A promise that resolves to the API Gateway proxy result.
 */
export const getAllCards: Handler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

	console.log("getAllCards event: ", event);

	try {
		// Define the parameters for the DynamoDB scan operation
		const params = {
			TableName: dbTables.GamechangersCards(),
		};

		// Retrieve all card items from the DynamoDB table
		const data = await dynamoDb.scan(params).promise();

		// Check if any card items exist
		if (!data.Items || data.Items.length === 0) {
			return sendResponse(404, { error: "No card items found" });
		}

		// Sort the card items by createdAt attribute, assuming 0 if missing
		const sortedItems = data.Items.sort((a, b) => {
			const createdAtA = a.createdAt || 0;
			const createdAtB = b.createdAt || 0;
			return createdAtB - createdAtA;
		});

		return sendResponse(200, sortedItems as object[]);
	} catch (error) {
		// Log the error if an exception occurs
		console.error("The following error occurred when retrieving all cards: ");
		console.error(error);

		// Return an error response with a 500 status code
		return sendResponse(500, { error: "An error occurred when retrieving all cards" });
	}
};
