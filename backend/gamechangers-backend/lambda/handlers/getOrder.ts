/* eslint-disable func-style */
import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { sendResponse } from "../utils/responseFunctions";
import { dbTables } from "../../EnvironmentManager/EnvironmentManager";

// Create an instance of the DynamoDB DocumentClient
const dynamoDb = new DynamoDB.DocumentClient();

/**
 * Gets all the information of an order based off its uuid
 * @param event - The API Gateway event object.
 * @returns A promise that resolves to the API Gateway proxy result.
 */
export const getOrder: Handler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

	try {
		if (event.body) {
			const body = JSON.parse(event.body || "");
			const { uuid, card_uuid } = body;

			// Check to see if the request body contains a receiver_uuid value
			if (!uuid) {
				return sendResponse(400, { error: "The request body requires a order uuid value" });
			} else if (!card_uuid) {
				return sendResponse(400, { error: "The request body requires a card uuid value" });
			}

			// Define the parameters for the DynamoDB get operation
			const params: DynamoDB.DocumentClient.GetItemInput = {
				TableName: dbTables.GamechangersOrders(),
				Key: {
					uuid: uuid,
					card_uuid: card_uuid,
				},
			};

			// Retrieve the card item from the DynamoDB table
			const data = await dynamoDb.get(params).promise();

			// Check if the card item exists
			if (!data.Item) {
				return sendResponse(404, { error: "The order item does not exist with the given order uuid and card uuid" });
			}

			return sendResponse(200, data.Item as object);

		}

		// Return an error response with a 400 status code if the request body is empty
		return sendResponse(400, { error: "The request body cannot be empty" });

	} catch (error) {
		// Log the error if an exception occurs
		console.error("The following error occurred when retrieving a order: ");
		console.error(error);

		// Return an error response with a 500 status code
		return sendResponse(500, { error: "An error occurred when retrieving the order" });
	}
};
