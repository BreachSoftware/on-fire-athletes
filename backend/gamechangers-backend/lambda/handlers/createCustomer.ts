import {
	APIGatewayProxyEvent,
	APIGatewayProxyResult,
	Handler,
} from "aws-lambda";
import { sendResponse } from "../utils/responseFunctions";
import "dotenv/config";
import { dbTables } from "../../EnvironmentManager/EnvironmentManager";
import { DynamoDB } from "aws-sdk";

// eslint-disable-next-line @typescript-eslint/no-var-requires, no-process-env
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
	apiVersion: "2022-08-01",
});

// Create an instance of the DynamoDB DocumentClient
const dynamoDb = new DynamoDB.DocumentClient();

/**
 * Creates a new customer.
 * @param event - The API Gateway event object.
 * @returns A promise that resolves to the API Gateway proxy result.
 */
// eslint-disable-next-line func-style
export const createCustomer: Handler = async (
	event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
	console.log(event);

	const data = JSON.parse(event.body as string);

	// Validation
	if (data.email === undefined || data.name === undefined) {
		return sendResponse(400, {
			error: "The request body must contain the email and name properties",
		});
	} else if (data.email === "" || data.name === "") {
		return sendResponse(400, {
			error: "The email and name properties cannot be empty",
		});
	} else if (
		typeof data.email !== "string" ||
		typeof data.name !== "string"
	) {
		return sendResponse(400, {
			error: "The email and name properties must be of type string",
		});
	}

	// Create a new customer
	const customer = await stripe.customers.create({
		email: data.email,
		name: data.name,
	});
	if (customer) {
		if (data.userId) {
			const params = {
				TableName: dbTables.GamechangersUsers(),
				Key: {
					uuid: data.userId, // Specify the primary key value
				},
				UpdateExpression: "set stripe_customer_id = :c",
				ExpressionAttributeValues: {
					":c": customer.id,
				},
			};

			// Update the item in the DynamoDB table
			await dynamoDb.update(params).promise();
		}

		return sendResponse(200, customer);
	}
	return sendResponse(500, {
		error: "An error occurred while creating the customer",
	});
};
