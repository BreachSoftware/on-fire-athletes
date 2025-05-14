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
 * Gets all orders from the DynamoDB table, ordered by createdAt attribute.
 * @param event - The API Gateway event object.
 * @returns A promise that resolves to the API Gateway proxy result.
 */
export const getAllOrders: Handler = async (
	event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
	console.log("getAllOrders event: ", event);

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
			TableName: dbTables.GamechangersOrders(),
			Limit: paginationParams.limit,
		};

		// Retrieve order items from the DynamoDB table
		let data = await dynamoDb.scan(params).promise();

		// Check if any order items exist
		if (!data.Items || data.Items.length === 0) {
			return sendResponse(404, { error: "No order items found" });
		}

		const retArray = data.Items;

		while (data.LastEvaluatedKey) {
			const params: DynamoDB.DocumentClient.ScanInput = {
				TableName: dbTables.GamechangersOrders(),
				Limit: paginationParams.limit,
				ExclusiveStartKey: data.LastEvaluatedKey,
			};

			data = await dynamoDb.scan(params).promise();
			retArray.push(...(data.Items || []));
		}

		const users = await getAllUsers();
		const usersMap = arrayToMap(users, "uuid");

		const ordersWithSerialNumbers: any[] = retArray.map((order) => {
			const user = usersMap[order.receiver_uuid];

			const cardForSerialNumber = user?.bought_cards?.find(
				(b: [string, string, string, number]) => b.at(0) === order.uuid,
			);

			return {
				...order,
				serial_number: cardForSerialNumber?.at(3),
			};
		});

		// Sort the order items by transaction_time attribute, assuming 0 if missing
		const sortedItems = ordersWithSerialNumbers.sort((a, b) => {
			const createdAtA = a.transaction_time || 0;
			const createdAtB = b.transaction_time || 0;
			return createdAtB - createdAtA;
		});

		return sendResponse(200, sortedItems as object[]);
	} catch (error) {
		// Log the error if an exception occurs
		console.error(
			"The following error occurred when retrieving all orders: ",
			error,
		);

		// Return an error response with a 500 status code
		return sendResponse(500, {
			error: "An error occurred when retrieving all orders",
		});
	}
};

async function getAllUsers(): Promise<any[]> {
	const params: DynamoDB.DocumentClient.ScanInput = {
		TableName: dbTables.GamechangersUsers(),
	};

	// Retrieve order items from the DynamoDB table
	let data = await dynamoDb.scan(params).promise();

	// Check if any order items exist
	if (!data.Items || data.Items.length === 0) {
		return []; // sendResponse(404, { error: "No order items found" });
	}

	const retArray = data.Items;

	while (data.LastEvaluatedKey) {
		const params: DynamoDB.DocumentClient.ScanInput = {
			TableName: dbTables.GamechangersUsers(),
			ExclusiveStartKey: data.LastEvaluatedKey,
		};

		data = await dynamoDb.scan(params).promise();
		retArray.push(...(data.Items || []));
	}

	return retArray;
}

export const arrayToMap = <T extends object, K extends keyof T>(
	array: T[],
	key: K | ((item: T) => string),
): Record<string, T> =>
	array.reduce(
		(acc, item) => {
			const keyValue = typeof key === "function" ? key(item) : item[key];
			if (keyValue && typeof keyValue === "string") {
				acc[keyValue] = item;
			}
			return acc;
		},
		{} as Record<string, T>,
	);
