/* eslint-disable func-style */
import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { sendResponse } from "../utils/responseFunctions";
import { dbTables } from "../../EnvironmentManager/EnvironmentManager";

// Create an instance of the DynamoDB DocumentClient
const dynamoDb = new DynamoDB.DocumentClient();

/**
 * This function assigns an order to a user.
 * @param event - The API Gateway event object.
 * @returns A promise that resolves to the API Gateway proxy result.
 */
export const assignOrder: Handler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

	try {
		if (event.body) {
			// Parse the request body from the event
			const data = JSON.parse(event.body as string);

			console.log("ASSIGN order DATA: ", data);

			if (data.uuid === undefined || data.card_uuid === undefined || data.card_generatedBy === undefined || data.user_id === undefined) {
				return sendResponse(400, {
					error: "The request body must contain the uuids for the order, the card, its creater, and the user receiving the order"
				});
			} else if (data.uuid === "" || data.card_uuid === "" || data.card_generatedBy === "" || data.user_id === "") {
				return sendResponse(400, { error: "The uuid properties cannot be empty" });
			} else if (
				typeof data.uuid !== "string" ||
				typeof data.card_uuid !== "string" ||
				typeof data.card_generatedBy !== "string" ||
				typeof data.user_id !== "string"
			) {
				return sendResponse(400, { error: "The uuid properties must be of type string" });
			}

			// Check if the order uuid exists in the database and matches the card uuid provided
			const orderParams = {
				TableName: dbTables.GamechangersOrders(),
				Key: {
					uuid: data.uuid,
					card_uuid: data.card_uuid,
				},
			};

			const order = await dynamoDb.get(orderParams).promise();
			if (!order.Item) {
				return sendResponse(404, { error: "The order does not exist" });
			} else if (order.Item.card_generatedBy !== data.card_generatedBy) {
				return sendResponse(403, { error: "The card creator does not match the order" });
			} else if (order.Item.receiver_uuid !== data.user_id) {
				return sendResponse(403, { error: "The recipient of the order does not match the provided user" });
			}

			// Check if new owner uuid exists in the database (probably won't get triggered, but just in case)
			const userParams = {
				TableName: dbTables.GamechangersUsers(),
				Key: {
					uuid: data.user_id,
				},
			};

			const user = await dynamoDb.get(userParams).promise();
			if (!user.Item) {
				return sendResponse(404, { error: "The recipient of the order does not exist" });
			}

			// Gets the card to retrieve its information
			const cardParams = {
				TableName: dbTables.GamechangersCards(),
				Key: {
					generatedBy: data.card_generatedBy,
					uuid: data.card_uuid,
				},
			};

			const card = await dynamoDb.get(cardParams).promise();
			const currentCard = card.Item;

			if (!currentCard) {
				return sendResponse(404, { error: "The card does not exist" });
			}

			// Verify that the number of currently available cards is greater than 0
			if (currentCard!.currentlyAvailable <= 0) {
				return sendResponse(400, { error: "The card has already been assigned to the maximum number of owners" });
			}

			let recordedSerialNumber = 0;

			// Search for a serialized card with the same UUID and generatedBy without an owner
			for (let i = 0; i < currentCard!.totalCreated; i++) {
				const serializedCardParams = {
					TableName: dbTables.GamechangersSerialCards(),
					Key: {
						uuid: data.card_uuid,
						serialNumber: i + 1,
					},
				};

				const serializedCard = await dynamoDb.get(serializedCardParams).promise();
				if (serializedCard.Item && !serializedCard.Item.owner) {
					// Update the cardOwner of the serialized card
					const updatedSerializedCardParams = {
						TableName: dbTables.GamechangersSerialCards(),
						Key: {
							uuid: data.card_uuid,
							serialNumber: i + 1,
						},
						UpdateExpression: "set #cardOwner = :cardOwner",
						ExpressionAttributeNames: {
							"#cardOwner": "owner",
						},
						ExpressionAttributeValues: {
							":cardOwner": data.user_id,
						},
					};
					console.log("User claims card number ", i + 1);
					await dynamoDb.update(updatedSerializedCardParams).promise();
					recordedSerialNumber = i + 1;
					break;
				}
			}

			if (recordedSerialNumber === 0) {
				return sendResponse(404, { error: "The card has already been assigned to the maximum number of owners" });
			}

			// Define the parameters for the DynamoDB update operation
			const updatedCardParams = {
				TableName: dbTables.GamechangersCards(),
				Item: {
					generatedBy: data.card_generatedBy,
					uuid: data.card_uuid,
					...currentCard,
					currentlyAvailable: currentCard!.currentlyAvailable - 1,
				},
			};

			// Verify user has a bought_cards property
			let boughtCards: string[][] = [];
			if (user.Item && user.Item.bought_cards) {

				console.log("USER CURRENTLY OWNS: ", user.Item.bought_cards);
				console.log("USER IS TRYING TO OWN: ", [ data.uuid, data.card_uuid, data.card_generatedBy ]);

				// If the user already has this card, return 403
				if (user.Item.bought_cards.some((orderUUID: string[]) => {
					return orderUUID[0] === data.uuid;
				})) {
					return sendResponse(403, { error: "The user has already bought this card" });
				}

				console.log("USER DOES NOT OWN THIS CARD");
				// Filter out any existing instances of the new UUID
				// eslint-disable-next-line arrow-body-style
				boughtCards = [ ...user.Item.bought_cards.filter((orderUUID: string) => orderUUID !== data.uuid),
					[ data.uuid, data.card_uuid, data.card_generatedBy, recordedSerialNumber ] ];
			} else {
				boughtCards = [ [ data.uuid, data.card_uuid, data.card_generatedBy, recordedSerialNumber ] ];
			}

			console.log("USER WILL OWN: ", boughtCards);

			// Create a new Item object with updated cards array
			const updatedUserItem = user.Item ?
				{
					...user.Item,
					bought_cards: boughtCards,
					// Explicitly initialize bought_cards as an empty array if it doesn't exist
					...(user.Item.bought_cards === undefined ? { bought_cards: boughtCards } : {}),
				} :
				{
					uuid: data.user_id,
					bought_cards: boughtCards,
				};

			// Define the parameters for the DynamoDB put operation
			const updateparams = {
				TableName: dbTables.GamechangersUsers(),
				Item: updatedUserItem,
			};

			// Insert the card item into the DynamoDB table
			await dynamoDb.put(updatedCardParams).promise();

			// Update the profile in the DynamoDB table
			await dynamoDb.put(updateparams).promise();

			// Return a success response with the created card item
			return sendResponse(200, { message: "Order successfully assigned to profile" });
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
		console.error("The following error occurred when assigning an order to the user: ");
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
