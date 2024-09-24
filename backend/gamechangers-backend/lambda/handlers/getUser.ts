/* eslint-disable func-style */
import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { sendResponse } from "../utils/responseFunctions";
import { dbTables } from "../../EnvironmentManager/EnvironmentManager";

// Create an instance of the DynamoDB DocumentClient
const dynamoDb = new DynamoDB.DocumentClient();

/**
 * Gets a pre-existing profile page.
 * @param event - The API Gateway event object.
 * @returns A promise that resolves to the API Gateway proxy result.
 */
export const getUser: Handler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	try {
		const uuid = event.queryStringParameters?.uuid;

		// Check to see if the query parameter contains a uuid value
		if (!uuid) {
			return sendResponse(400, { error: "The request requires a uuid query parameter" });
		}

		// Define the parameters for the DynamoDB get operation
		const params = {
			TableName: dbTables.GamechangersUsers(),
			Key: {
				uuid: uuid,
			},
		};

		// Retrieve the card item from the DynamoDB table
		const data = await dynamoDb.get(params).promise();

		// Check if the card item exists
		if (!data.Item) {
			return sendResponse(404, { error: "The profile does not exist" });
		}

		return sendResponse(200, data.Item as object);

	} catch (error) {
		// Log the error if an exception occurs
		console.error("The following error occurred when retrieving a profile: ");
		console.error(error);

		// Return an error response with a 500 status code
		return sendResponse(500, { error: "An error occurred when retrieving a profile" });
	}
};
