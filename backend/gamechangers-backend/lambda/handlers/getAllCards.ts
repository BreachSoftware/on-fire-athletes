/* eslint-disable func-style */
import {
	Handler,
	APIGatewayProxyEvent,
	APIGatewayProxyResult,
} from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { sendResponse } from "../utils/responseFunctions";
import { dbTables } from "../../EnvironmentManager/EnvironmentManager";

// Create an instance of the DynamoDB DocumentClient
const dynamoDb = new DynamoDB.DocumentClient();

interface PaginationParams {
	page?: number;
	limit?: number;
}

/**
 * Gets all cards from the DynamoDB table, ordered by createdAt attribute.
 * @param event - The API Gateway event object.
 * @returns A promise that resolves to the API Gateway proxy result.
 */
export const getAllCards: Handler = async (
	event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
	console.log("getAllCards event: ", event);

	try {
		const queryParams = event.queryStringParameters || {};
		const paginationParams: PaginationParams = {};

		// Parse and validate limit parameter
		if (queryParams.limit) {
			const limit = parseInt(queryParams.limit, 10);
			if (isNaN(limit) || limit < 1 || limit > 500) {
				return sendResponse(400, {
					error: "Limit parameter must be a number between 1 and 100",
				});
			}
			paginationParams.limit = limit;
		}

		// Parse and validate page parameter
		if (queryParams.page) {
			const page = parseInt(queryParams.page, 10);
			if (isNaN(page) || page < 1) {
				return sendResponse(400, {
					error: "Page parameter must be a positive number",
				});
			}
			paginationParams.page = page;
		}

		// Define the parameters for the DynamoDB scan operation
		const params: DynamoDB.DocumentClient.ScanInput = {
			TableName: dbTables.GamechangersCards(),
			Limit: paginationParams.limit,
		};

		// Retrieve card items from the DynamoDB table
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

		// Apply pagination if parameters are provided
		if (paginationParams.page && paginationParams.limit) {
			const startIndex =
				(paginationParams.page - 1) * paginationParams.limit;
			const paginatedItems = sortedItems.slice(
				startIndex,
				startIndex + paginationParams.limit,
			);
			return sendResponse(200, paginatedItems as object[]);
		}

		return sendResponse(200, sortedItems as object[]);
	} catch (error) {
		// Log the error if an exception occurs
		console.error(
			"The following error occurred when retrieving all cards: ",
			error,
		);

		// Return an error response with a 500 status code
		return sendResponse(500, {
			error: "An error occurred when retrieving all cards",
		});
	}
};
