/* eslint-disable func-style */
import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { sendResponse } from "../utils/responseFunctions";
import { dbTables } from "../../EnvironmentManager/EnvironmentManager";

// Create an instance of the DynamoDB DocumentClient
const dynamoDb = new DynamoDB.DocumentClient();

/**
 * Transfers ownership of a card from one user to another.
 * @param event - The API Gateway event object.
 * @returns A promise that resolves to the API Gateway proxy result.
 */
export const reassignCard: Handler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

	try {
		if (event.body) {
			// Parse the request body from the event
			const data = JSON.parse(event.body as string);

			/*
				uuid: the UUID of the card to be reassigned
				newOwner: the UUID of the new owner of the card
				generatedBy: the UUID of the user who originally generated the card
				sender: the UUID of the user who is sending the card
			*/

			if (data.uuid === undefined || data.newOwner === undefined || data.generatedBy === undefined || data.sender === undefined) {
				return sendResponse(400, { error: "The request body must contain the uuids for the card, the new owner, the card creator, and the sender" });
			} else if (data.uuid === "" || data.newOwner === "" || data.generatedBy === "" || data.sender === "") {
				return sendResponse(400, { error: "The uuid properties cannot be empty" });
			} else if (typeof data.uuid !== "string" || typeof data.newOwner !== "string" ||
				typeof data.generatedBy !== "string" || typeof data.sender !== "string") {
				return sendResponse(400, { error: "The uuid properties must be of type string" });
			}

			// Gets the card to retrieve its information
			const cardParams = {
				TableName: dbTables.GamechangersCards(),
				Key: {
					generatedBy: data.generatedBy,
					uuid: data.uuid,
				},
			};

			const card = await dynamoDb.get(cardParams).promise();
			const currentCard = card.Item;

			if (!currentCard) {
				return sendResponse(404, { error: "The card does not exist" });
			}

			// Check if the sender owns the card they are trying to reassign
			const senderParams = {
				TableName: dbTables.GamechangersUsers(),
				Key: {
					uuid: data.sender,
				},
			};

			const sender = await dynamoDb.get(senderParams).promise();
			if (!sender.Item || !sender.Item.cards || !sender.Item.cards.some((card: string[]) => {
				return card[0] === data.uuid && card[1] === data.generatedBy;
			})) {
				return sendResponse(403, { error: "The sender does not own the card" });
			}

			// Check if new owner uuid exists in the database
			const newOwnerParams = {
				TableName: dbTables.GamechangersUsers(),
				Key: {
					uuid: data.newOwner,
				},
			};

			const newOwner = await dynamoDb.get(newOwnerParams).promise();
			if (!newOwner.Item) {
				return sendResponse(404, { error: "The new owner does not exist" });
			}

			// Check if the new owner already owns the card
			if (newOwner.Item.cards && newOwner.Item.cards.some((card: string[]) => {
				return card[0] === data.uuid && card[1] === data.generatedBy;
			})) {
				return sendResponse(403, { error: "The new owner already owns the card" });
			}

			// Search for a serialized card with the same UUID and generatedBy that is owned by the sender
			let recordedSerialNumber = 0;

			for (let i = 0; i < currentCard!.totalCreated; i++) {
				const serializedCardParams = {
					TableName: dbTables.GamechangersSerialCards(),
					Key: {
						uuid: data.uuid,
						serialNumber: i + 1,
					},
				};

				const serializedCard = await dynamoDb.get(serializedCardParams).promise();
				if (serializedCard.Item && serializedCard.Item.owner === data.sender) {
					recordedSerialNumber = i + 1;
					break;
				}
			}

			if (recordedSerialNumber === 0) {
				return sendResponse(403, { error: "The sender does not own the card" });
			}

			// Update the cardOwner of the serialized card
			const updatedSerializedCardParams = {
				TableName: dbTables.GamechangersSerialCards(),
				Key: {
					uuid: data.uuid,
					serialNumber: recordedSerialNumber,
				},
				UpdateExpression: "set #cardOwner = :cardOwner",
				ExpressionAttributeNames: {
					"#cardOwner": "owner",
				},
				ExpressionAttributeValues: {
					":cardOwner": data.newOwner,
				},
			};

			// Update the owner of the serialized card
			await dynamoDb.update(updatedSerializedCardParams).promise();

			// Verify new owner has a cards property
			let userCards: string[][] = [];
			if (newOwner.Item && newOwner.Item.cards) {
				// Filter out any existing instances of the new UUID
				userCards =
				[ ...newOwner.Item.cards.filter((cardUUID: string) => {
					return cardUUID !== data.uuid;
				}), [ data.uuid, data.generatedBy, recordedSerialNumber ] ];
			} else {
				userCards = [ [ data.uuid, data.generatedBy, recordedSerialNumber ] ];
			}

			// Create a new Item object for sender with updated cards array
			const updatedSenderItem = {
				...sender.Item,
				cards: sender.Item.cards.filter((card: string[]) => {
					return card[0] !== data.uuid || card[1] !== data.generatedBy;
				}),
			};

			// Create a new Item object with updated cards array
			const updatedReceiverItem = newOwner.Item ?
				{
					...newOwner.Item,
					cards: userCards,
					...(newOwner.Item.cards === undefined ? { cards: userCards } : {}), // Explicitly initialize cards as an empty array if it doesn't exist
				} :
				{
					uuid: data.newOwner,
					cards: userCards,
				};

			// Define the parameters for the DynamoDB put operation
			const updateSenderParams = {
				TableName: dbTables.GamechangersUsers(),
				Item: updatedSenderItem,
			};

			// Define the parameters for the DynamoDB put operation
			const updateReceiverParams = {
				TableName: dbTables.GamechangersUsers(),
				Item: updatedReceiverItem,
			};

			// Update both users in the DynamoDB table
			await dynamoDb.put(updateSenderParams).promise();
			await dynamoDb.put(updateReceiverParams).promise();

			// Return a success response with the created card item
			return sendResponse(200, { message: "The card has been successfully reassigned" });
		}

		return sendResponse(400, { error: "The request body cannot be empty" });
	} catch (error) {
		// Log the error if an exception occurs
		console.error("The following error occurred when modifying ownership of a card: ");
		console.error(error);

		// Return an error response with a 500 status code
		return sendResponse(500, { error: error });
	}
};
