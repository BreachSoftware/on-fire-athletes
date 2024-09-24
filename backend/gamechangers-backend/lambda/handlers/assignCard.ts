/* eslint-disable func-style */
import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { sendResponse } from "../utils/responseFunctions";
import { dbTables } from "../../EnvironmentManager/EnvironmentManager";

// Create an instance of the DynamoDB DocumentClient
const dynamoDb = new DynamoDB.DocumentClient();

/**
 * Assigns a card to a user.
 * @param event - The API Gateway event object.
 * @returns A promise that resolves to the API Gateway proxy result.
 */
export const assignCard: Handler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

	try {
		if (event.body) {
			// Parse the request body from the event
			const data = JSON.parse(event.body as string);

			console.log("ASSIGN CARD DATA: ", data);

			if (data.uuid === undefined || data.newOwner === undefined || data.generatedBy === undefined) {
				return sendResponse(400, { error: "The request body must contain the uuids for the card, the new owner, and the card creator" });
			} else if (data.uuid === "" || data.newOwner === "" || data.generatedBy === "") {
				return sendResponse(400, { error: "The uuid properties cannot be empty" });
			} else if (typeof data.uuid !== "string" || typeof data.newOwner !== "string" || typeof data.generatedBy !== "string") {
				sendResponse(400, { error: "The uuid properties must be of type string" });
			}

			// Check if new owner uuid exists in the database
			const userParams = {
				TableName: dbTables.GamechangersUsers(),
				Key: {
					uuid: data.newOwner,
				},
			};

			const user = await dynamoDb.get(userParams).promise();
			if (!user.Item) {
				return sendResponse(404, { error: "The new owner does not exist" });
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
				sendResponse(404, { error: "The card does not exist" });
			}

			// Verify that the number of currently available cards is greater than 0
			if (currentCard!.currentlyAvailable <= 0) {
				sendResponse(400, { error: "The card has reached the maximum amount of owners" });
			}

			// Verify user has a cards property and that the user does not already own the card
			if (user.Item && user.Item.cards) {
				console.log("USER CURRENTLY OWNS: ", user.Item.cards);
				console.log("USER IS TRYING TO OWN: ", [ data.uuid, data.generatedBy ]);

				// If the user already has this card, return 403
				if (user.Item.cards.some((cardUUID: string[]) => {
					return cardUUID[0] === data.uuid;
				})) {
					return sendResponse(403, { error: "The new owner already owns the card" });
				}
			}

			let recordedSerialNumber = 0;

			// Search for a serialized card with the same UUID and generatedBy without an owner
			for (let i = 0; i < currentCard!.totalCreated; i++) {
				const serializedCardParams = {
					TableName: dbTables.GamechangersSerialCards(),
					Key: {
						uuid: data.uuid,
						serialNumber: i + 1,
					},
				};

				const serializedCard = await dynamoDb.get(serializedCardParams).promise();
				if (serializedCard.Item && !serializedCard.Item.owner) {
					// Update the cardOwner of the serialized card
					const updatedSerializedCardParams = {
						TableName: dbTables.GamechangersSerialCards(),
						Key: {
							uuid: data.uuid,
							serialNumber: i + 1,
						},
						UpdateExpression: "set #cardOwner = :cardOwner",
						ExpressionAttributeNames: {
							"#cardOwner": "owner",
						},
						ExpressionAttributeValues: {
							":cardOwner": data.newOwner,
						},
					};
					console.log("User claims card number ", i + 1);
					await dynamoDb.update(updatedSerializedCardParams).promise();
					recordedSerialNumber = i + 1;
					break;
				}
			}

			if (recordedSerialNumber === 0) {
				return sendResponse(400, { error: "The card has already been assigned to the maximum number of owners" });
			}

			// Update the number of currently available cards to - be subtracted by 1
			const updatedCardParams = {
				TableName: dbTables.GamechangersCards(),
				Key: {
					generatedBy: data.generatedBy,
					uuid: data.uuid,
				},
				UpdateExpression: "set currentlyAvailable = currentlyAvailable - :val",
				ExpressionAttributeValues: {
					":val": 1,
				},
			};
			await dynamoDb.update(updatedCardParams).promise();

			// Verify user has a cards property
			let userCards: string[][] = [];
			if (user.Item && user.Item.cards) {
				// Filter out any existing instances of the new UUID
				// eslint-disable-next-line arrow-body-style
				userCards = [ ...user.Item.cards.filter((cardUUID: string) => cardUUID !== data.uuid), [ data.uuid, data.generatedBy, recordedSerialNumber ] ];
			} else {
				userCards = [ [ data.uuid, data.generatedBy, recordedSerialNumber ] ];
			}

			// Create a new Item object with updated cards array
			const updatedUserItem = user.Item ?
				{
					...user.Item,
					cards: userCards,
					...(user.Item.cards === undefined ? { cards: userCards } : {}), // Explicitly initialize cards as the userCards if it doesn't exist
				} :
				{
					uuid: data.newOwner,
					cards: userCards,
				};

			// Define the parameters for the DynamoDB put operation
			const updateparams = {
				TableName: dbTables.GamechangersUsers(),
				Item: updatedUserItem,
			};

			// Update the profile in the DynamoDB table
			await dynamoDb.put(updateparams).promise();

			// Return a success response with the created card item
			return sendResponse(200, { message: "The card has been successfully assigned to the new owner" });
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
