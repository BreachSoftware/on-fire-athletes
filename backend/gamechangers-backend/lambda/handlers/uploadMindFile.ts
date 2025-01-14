/* eslint-disable func-style */
import { dbTables } from "@/EnvironmentManager/EnvironmentManager";
import {
	Handler,
	APIGatewayProxyEvent,
	APIGatewayProxyResult,
} from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { z } from "zod";
import { S3 } from "aws-sdk";

// Create an instance of the DynamoDB DocumentClient
const dynamoDb = new DynamoDB.DocumentClient();

/**
 * Creates mind files for a new card
 * @param event - The API Gateway event object.
 * @returns A promise that resolves to the API Gateway proxy result.
 */
export const uploadMindFile: Handler = async (
	event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
	try {
		const body = z.object({
			cardId: z.string(),
		});

		const { cardId } = body.parse(event.body);

		// Define the parameters for the DynamoDB scan operation
		const params = {
			TableName: dbTables.GamechangersCards(),
			FilterExpression: "#uuidKey = :uuidVal",
			ExpressionAttributeNames: {
				"#uuidKey": "uuid",
			},
			ExpressionAttributeValues: {
				":uuidVal": cardId,
			},
		};

		return {
			statusCode: 200,
			body: JSON.stringify(mindFiles),
		};
	} catch (error) {
		// Log the error if an exception occurs
		console.error(
			"The following error occurred when creating mind files: ",
		);
		console.error(error);

		// Return an error response with a 500 status code
		return {
			statusCode: 500,
			headers: { "Content-Type": "text/plain" },
			body: JSON.stringify({ error: error }),
		};
	}
};
