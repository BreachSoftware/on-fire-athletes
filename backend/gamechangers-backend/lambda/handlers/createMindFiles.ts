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
export const createMindFiles: Handler = async (
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

		// Retrieve the card items from DynamoDB using scan
		const data = await dynamoDb.scan(params).promise();

		if (!data.Items || data.Items.length === 0) {
			return {
				statusCode: 404,
				body: JSON.stringify({ error: "Card not found" }),
			};
		}

		const mindFiles = await createMindFiles(data.Items[0]);

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

async function createMindFiles(card: any) {
	// 1. Retrieve image URL from card data
	const imageUrl = card.imageUrl; // Assuming you have a field like this

	// 2. Download image from S3 to /tmp
	const imagePath = await downloadImageFromS3(imageUrl, "/tmp");

	// 3. Compile the image using the modified MindAR compiler
	const mindFileData = await compileMindFile(imagePath);

	// 4. Upload the .mind file to S3
	const mindFileUrl = await uploadMindFileToS3(mindFileData);

	// 5. Update DynamoDB record with the .mind file URL (optional)
	await updateCardWithMindFileUrl(card.uuid, mindFileUrl);

	// 6. Return the .mind file URL
	return {
		statusCode: 200,
		body: JSON.stringify({ mindFileUrl }),
	};
}

// Helper functions for S3 interaction and DynamoDB updates
async function downloadImageFromS3(
	imageUrl: string,
	targetPath: string,
): Promise<string> {
	// ... implementation using AWS SDK
}

async function uploadMindFileToS3(fileData: Buffer): Promise<string> {
	// ... implementation using AWS SDK
}

async function updateCardWithMindFileUrl(
	cardId: string,
	mindFileUrl: string,
): Promise<void> {
	// ... implementation using AWS SDK
}
