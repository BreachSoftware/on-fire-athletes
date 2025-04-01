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
 * Updates an existing order.
 * @param event - The API Gateway event object.
 * @returns A promise that resolves to the API Gateway proxy result.
 */
export const updateOrder: Handler = async (
	event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
	try {
		if (event.body) {
			// Parse the request body from the event
			const data = JSON.parse(event.body as string);

			if (data.uuid === undefined || data.card_uuid === undefined) {
				return {
					statusCode: 400,
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						error: "The request body must contain an uuid property",
					}),
				};
			} else if (data.uuid === "" || data.card_uuid === "") {
				return {
					statusCode: 400,
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						error: "The uuid property cannot be empty",
					}),
				};
			} else if (
				typeof data.uuid !== "string" ||
				typeof data.card_uuid !== "string"
			) {
				return {
					statusCode: 400,
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						error: "The uuid property must be of type string",
					}),
				};
			}

			// Define the ExpressionAttributeValues and updateExpressionParts objects
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const ExpressionAttributeValues: any = {};
			const updateExpressionParts: string[] = [];

			Object.entries(data).forEach(([key, value]) => {
				if (key !== "uuid" && key !== "card_uuid") {
					ExpressionAttributeValues[`:${key}`] =
						value !== undefined ? value : "";
					updateExpressionParts.push(`${key} = :${key}`);
				}
			});

			// Join into a single string
			const updateExpression = `set ${updateExpressionParts.join(", ")}`;

			// Define the parameters for the DynamoDB update operation
			const params = {
				TableName: dbTables.GamechangersOrders(), // Update the table name to orders
				Key: {
					uuid: data.uuid, // Specify the primary key value
					card_uuid: data.card_uuid, // Specify the primary key value
				},
				UpdateExpression: updateExpression,
				ExpressionAttributeValues: ExpressionAttributeValues,
			};

			// Update the item in the DynamoDB table
			await dynamoDb.update(params).promise();

			const updatedOrder = await dynamoDb
				.get({
					TableName: dbTables.GamechangersOrders(),
					Key: { uuid: data.uuid, card_uuid: data.card_uuid },
				})
				.promise();

			// Return a success response with the updated order item
			return {
				statusCode: 200,
				body: JSON.stringify(updatedOrder),
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
		console.error("The following error occurred when updating an order: ");
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
