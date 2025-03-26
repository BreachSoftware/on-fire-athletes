/* eslint-disable func-style */
import {
	Handler,
	APIGatewayProxyEvent,
	APIGatewayProxyResult,
} from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { dbTables } from "../../EnvironmentManager/EnvironmentManager";

// Create an instance of the DynamoDB DocumentClient
const dynamoDb = new DynamoDB.DocumentClient();

/**
 * Updates an existing card.
 * @param event - The API Gateway event object.
 * @returns A promise that resolves to the API Gateway proxy result.
 */
export const updateCard: Handler = async (
	event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
	try {
		if (event.body) {
			// Parse the request body from the event
			const data = JSON.parse(event.body as string);

			if (data.generatedBy === undefined || data.uuid === undefined) {
				return {
					statusCode: 400,
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						error: "The request body must contain a generatedBy and uuid property",
					}),
				};
			} else if (data.generatedBy === "" || data.uuid === "") {
				return {
					statusCode: 400,
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						error: "The generatedBy and uuid property cannot be empty",
					}),
				};
			} else if (
				typeof data.generatedBy !== "string" ||
				typeof data.uuid !== "string"
			) {
				return {
					statusCode: 400,
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						error: "The generatedBy and uuid property must be of type string",
					}),
				};
			}

			// Define the ExpressionAttributeValues and updateExpressionParts objects
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const ExpressionAttributeValues: any = {};
			const updateExpressionParts: string[] = [];

			Object.entries(data).forEach(([key, value]) => {
				if (key !== "generatedBy" && key !== "uuid") {
					// If the key is "position", add it to the ExpressionAttributeNames object
					ExpressionAttributeValues[`:${key}`] =
						value !== undefined ? value : "";
					updateExpressionParts.push(`${key} = :${key}`);
				}
			});

			// Join into a single string
			const updateExpression = `set ${updateExpressionParts.join(", ")}`;

			// Define the parameters for the DynamoDB update operation
			const params = {
				TableName: dbTables.GamechangersCards(), // Update to the cards table
				Key: {
					generatedBy: data.generatedBy, // Specify the primary key value
					uuid: data.uuid, // Specify the primary key value
				},
				UpdateExpression: updateExpression,
				ExpressionAttributeValues: ExpressionAttributeValues,
			};

			// Update the item in the DynamoDB table
			await dynamoDb.update(params).promise();

			const updatedCard = await dynamoDb
				.get({
					TableName: dbTables.GamechangersCards(),
					Key: { generatedBy: data.generatedBy, uuid: data.uuid },
				})
				.promise();

			// Return a success response with the updated card item
			return {
				statusCode: 200,
				body: JSON.stringify(updatedCard.Item),
				headers: {
					"Content-Type": "application/json",
				},
			};
		}

		return {
			statusCode: 400,
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ error: "The request body cannot be empty" }),
		};
	} catch (error) {
		// Log the error if an exception occurs
		console.error("The following error occurred when updating a card: ");
		console.error(error);

		// Return an error response with a 500 status code
		return {
			statusCode: 500,
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ error: error }),
		};
	}
};
