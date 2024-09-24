/* eslint-disable func-style */
import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { dbTables } from "../../EnvironmentManager/EnvironmentManager";

// Create an instance of the DynamoDB DocumentClient
const dynamoDb = new DynamoDB.DocumentClient();

/**
 * Creates a new serialized card.
 * @param event - The API Gateway event object.
 * @returns A promise that resolves to the API Gateway proxy result.
 */
export const createSerializedCard: Handler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	try {
		if (event.body) {
			// Parse the request body from the event
			const data = JSON.parse(event.body as string);

			// Error Checking
			if (data.uuid === undefined || data.serialNumber === undefined || data.generatedBy === undefined) {
				return {
					statusCode: 400,
					headers: { "Content-Type": "text/plain" },
					body: JSON.stringify({ error: "The request body must contain a uuid, serialNumber, and generatedBy properties" }),
				};
			} else if (data.uuid === "" || data.serialNumber === "" || data.generatedBy === "") {
				return {
					statusCode: 400,
					headers: { "Content-Type": "text/plain" },
					body: JSON.stringify({ error: "The uuid, serialNumber, and generatedBy properties cannot be empty" }),
				};
			} else if (typeof data.uuid !== "string" || typeof data.serialNumber !== "number" || typeof data.generatedBy !== "string") {
				return {
					statusCode: 400,
					headers: { "Content-Type": "text/plain" },
					body: JSON.stringify({ error: "The uuid and generatedBy properties must be of type string and " +
						" the serialized number must be of type number" }),
				};
			}

			// Verify that the original card exists
			const cardParams = {
				TableName: dbTables.GamechangersCards(),
				Key: {
					uuid: data.uuid,
					generatedBy: data.generatedBy,
				},
			};
			const cardData = await dynamoDb.get(cardParams).promise();
			if (!cardData.Item) {
				return {
					statusCode: 404,
					headers: { "Content-Type": "text/plain" },
					body: JSON.stringify({ error: "The card does not exist" }),
				};
			}

			// Define the parameters for the DynamoDB put operation
			const params = {
				TableName: dbTables.GamechangersSerialCards(),
				Item: {
					uuid: data.uuid,
					serialNumber: data.serialNumber,
					generatedBy: data.generatedBy,
					owner: data.owner || "",
				},
			};

			// Insert the serialized card item into the DynamoDB table
			await dynamoDb.put(params).promise();

			// Return a success response with the created serialized card item
			return {
				statusCode: 200,
				body: JSON.stringify(params.Item),
			};
		}

		return {
			statusCode: 400,
			headers: { "Content-Type": "text/plain" },
			body: JSON.stringify({ error: "The request body cannot be empty" }),
		};
	} catch (error) {
		// Log the error if an exception occurs
		console.error("The following error occurred when creating a serialized card: ");
		console.error(error);

		// Return an error response with a 500 status code
		return {
			statusCode: 500,
			headers: { "Content-Type": "text/plain" },
			body: JSON.stringify({ error: error }),
		};
	}
};
