/* eslint-disable func-style */
import {
	Handler,
	APIGatewayProxyEvent,
	APIGatewayProxyResult,
} from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { checkIfCardExists } from "../utils/checkIfCardExists";
import { checkIfUserExists } from "../utils/checkIfUserExists";
import { dbTables } from "../../EnvironmentManager/EnvironmentManager";

// Create an instance of the DynamoDB DocumentClient
const dynamoDb = new DynamoDB.DocumentClient();

/**
 * Handles the creation of a gift order.
 * @param data - The data for the gift order.
 * @returns A promise that resolves to the API Gateway proxy result.
 */
async function handleGiftOrder(
	uuid: string,
	currentUnixTime: number,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: any,
) {
	// Verify that the receiver_uuid exists in the database
	const receiverResponse = await checkIfUserExists(data.receiver_uuid);

	if (receiverResponse.statusCode === 404) {
		receiverResponse.body = JSON.stringify({
			error: "The receiver_uuid does not exist in the Users database",
		});
		return receiverResponse;
	}

	// Define the parameters for the DynamoDB put operation
	const params = {
		TableName: dbTables.GamechangersOrders(),
		Item: {
			uuid: uuid,
			card_uuid: "GIFT",
			card_generatedBy: "GIFT",
			cost_paid: data.cost_paid,
			sender_uuid: data.sender_uuid,
			receiver_uuid: data.receiver_uuid,
			physicalCardQuantity: data.physicalCardQuantity,
			digitalCardQuantity: data.digitalCardQuantity,
			bagTagQuantity: data.bagTagQuantity,
			transaction_time: currentUnixTime,
			first_name: data.first_name,
			last_name: data.last_name,
			email: data.email,
			phone_number: data.phone_number,
			shipping_firstName: data.shipping_firstName,
			shipping_lastName: data.shipping_lastName,
			address: data.address,
			city: data.city,
			state: data.state,
			zip_code: data.zip_code,
			coupon_used: data.coupon_used,
			payment_method: data.payment_method,
			package_name: data.package_name,
		},
	};

	console.log("Creating a new gift order with the following parameters: ");
	console.log(params);

	// Insert the card item into the DynamoDB table
	await dynamoDb.put(params).promise();

	// Return a success response with the created order item
	return {
		statusCode: 200,
		body: JSON.stringify(params.Item),
	};
}

/**
 * Creates a new order.
 * @param event - The API Gateway event object.
 * @returns A promise that resolves to the API Gateway proxy result.
 */
export const createOrder: Handler = async (
	event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
	const uuid: string = uuidv4();
	const currentUnixTime: number = Math.floor(Date.now() / 1000);

	try {
		if (event.body) {
			// Parse the request body from the event
			const data = JSON.parse(event.body as string);

			if (data.is_gift) {
				const response = await handleGiftOrder(
					uuid,
					currentUnixTime,
					data,
				);
				return response;
			}

			// Error Checking
			if (
				data.card_uuid === undefined ||
				data.card_generatedBy === undefined ||
				data.cost_paid === undefined ||
				data.sender_uuid === undefined ||
				data.receiver_uuid === undefined
			) {
				return {
					statusCode: 400,
					headers: { "Content-Type": "text/plain" },
					body: JSON.stringify({
						error:
							"The request body must contain the card_uuid, card_generatedBy, cost_paid," +
							" sender_uuid and receiver_uuid properties",
					}),
				};
			} else if (
				data.card_uuid === "" ||
				data.card_generatedBy === "" ||
				data.cost_paid < 0 ||
				data.sender_uuid === "" ||
				data.receiver_uuid === ""
			) {
				return {
					statusCode: 400,
					headers: { "Content-Type": "text/plain" },
					body: JSON.stringify({
						error:
							"The card_uuid, card_generatedBy, sender_uuid," +
							" and receiever_uuid properties cannot be empty. Cost_paid must be more than zero",
					}),
				};
			} else if (
				typeof data.card_uuid !== "string" ||
				typeof data.card_generatedBy !== "string" ||
				typeof data.cost_paid !== "number" ||
				typeof data.sender_uuid !== "string" ||
				typeof data.receiver_uuid !== "string"
			) {
				return {
					statusCode: 400,
					headers: { "Content-Type": "text/plain" },
					body: JSON.stringify({
						error:
							"The card_uuid, card_generatedBy, sender_uuid, and receiver_uuid properties" +
							" must be of type string. cost_paid must be of type number",
					}),
				};
			}

			// Verify that the card_uuid exists in the database
			const cardResponse = await checkIfCardExists(
				data.card_uuid,
				data.card_generatedBy,
			);

			if (cardResponse.statusCode === 404) {
				return cardResponse;
			}

			// Verify that the sender_uuid exists in the database
			const senderResponse = await checkIfUserExists(data.sender_uuid);

			if (senderResponse.statusCode === 404) {
				senderResponse.body = JSON.stringify({
					error: "The sender_uuid does not exist in the Users database",
				});
				return senderResponse;
			}

			// Verify that the receiver_uuid exists in the database
			const receiverResponse = await checkIfUserExists(
				data.receiver_uuid,
			);

			if (receiverResponse.statusCode === 404) {
				receiverResponse.body = JSON.stringify({
					error: "The receiver_uuid does not exist in the Users database",
				});
				return receiverResponse;
			}

			// Define the parameters for the DynamoDB put operation
			const params = {
				TableName: dbTables.GamechangersOrders(),
				Item: {
					uuid: uuid,
					card_uuid: data.card_uuid,
					card_generatedBy: data.card_generatedBy,
					cost_paid: data.cost_paid,
					sender_uuid: data.sender_uuid,
					receiver_uuid: data.receiver_uuid,
					physicalCardQuantity: data.physicalCardQuantity,
					digitalCardQuantity: data.digitalCardQuantity,
					bagTagQuantity: data.bagTagQuantity,
					transaction_time: currentUnixTime,
					first_name: data.first_name,
					last_name: data.last_name,
					email: data.email,
					phone_number: data.phone_number,
					shipping_firstName: data.shipping_firstName,
					shipping_lastName: data.shipping_lastName,
					address: data.address,
					city: data.city,
					state: data.state,
					zip_code: data.zip_code,
					coupon_used: data.coupon_used,
					payment_method: data.payment_method,
					package_name: data.package_name,
				},
			};

			console.log("Creating a new order with the following parameters: ");
			console.log(params);

			// Insert the card item into the DynamoDB table
			await dynamoDb.put(params).promise();

			// Return a success response with the created order item
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
		console.error("The following error occurred when creating an order: ");
		console.error(error);

		// Return an error response with a 500 status code
		return {
			statusCode: 500,
			headers: { "Content-Type": "text/plain" },
			body: JSON.stringify({ error: error }),
		};
	}
};
