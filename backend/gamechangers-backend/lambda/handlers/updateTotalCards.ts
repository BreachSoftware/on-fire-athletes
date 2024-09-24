/* eslint-disable func-style */
import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { dbTables } from "../../EnvironmentManager/EnvironmentManager";

// Create an instance of the DynamoDB DocumentClient
const dynamoDb = new DynamoDB.DocumentClient();

/**
 * Updates the total amount of serialized cards available.
 * @param event - The API Gateway event object.
 * @returns A promise that resolves to the API Gateway proxy result.
 */
export const updateTotalCards: Handler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

	try {
		if (event.body) {
			// Parse the request body from the event
			const data = JSON.parse(event.body as string);

			if (data.uuid === undefined || data.generatedBy === undefined || data.totalCreated === undefined) {
				return {
					statusCode: 400,
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ error: "The request body must contain uuid, generatedBy, and totalCreated properties" }),
				};
			} else if (data.uuid === "" || data.generatedBy === "" || data.totalCreated < 0) {
				return {
					statusCode: 400,
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ error: "The uuid and generatedBy properties cannot be empty." +
						" The totalCreated property cannot be less than 0" }),
				};
			} else if (typeof data.uuid !== "string" || typeof data.generatedBy !== "string" || typeof data.totalCreated !== "number") {
				return {
					statusCode: 400,
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ error: "The uuid, generatedBy properties must be of type string. Total created property must be a number" }),
				};
			}


			// Define the parameters for the DynamoDB update operation
			const params = {
				TableName: dbTables.GamechangersCards(),
				Key: {
					generatedBy: data.generatedBy,
					uuid: data.uuid,
				},
				UpdateExpression: "set totalCreated = :totalCreated, currentlyAvailable = :totalCreated",
				ExpressionAttributeValues: {
					":totalCreated": data.totalCreated,
				},
			};

			// Update the item in the DynamoDB table
			await dynamoDb.update(params).promise();

			// Return a success response with the created card item
			return {
				statusCode: 200,
				body: JSON.stringify(params.ExpressionAttributeValues),
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
		console.error("The following error occurred when creating a card: ");
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
