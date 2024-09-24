/* eslint-disable func-style */
import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { dbTables } from "../../EnvironmentManager/EnvironmentManager";

// Create an instance of the DynamoDB DocumentClient
const dynamoDb = new DynamoDB.DocumentClient();

/**
 * Creates a new user.
 * @param event - The API Gateway event object.
 * @returns A promise that resolves to the API Gateway proxy result.
 */
export const createUser: Handler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

	try {
		if (event.body) {
			// Parse the request body from the event
			const data = JSON.parse(event.body as string);

			if (data.uuid === undefined) {
				return {
					statusCode: 400,
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ error: "The request body must contain a uuid property" }),
				};
			} else if (data.uuid === "") {
				return {
					statusCode: 400,
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ error: "The uuid property cannot be empty" }),
				};
			} else if (typeof data.uuid !== "string") {
				return {
					statusCode: 400,
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ error: "The uuid property must be of type string" }),
				};
			}

			// Define the parameters for the DynamoDB put operation
			const params = {
				TableName: dbTables.GamechangersUsers(),
				Item: {
					uuid: data.uuid,
					// User Parameters
					email: data.email,
					first_name: data.first_name ? data.first_name : null,
					last_name: data.last_name ? data.last_name : null,
					cards: data.cards ? data.cards : [],
					avatar: data.avatar ? data.avatar : null,
					position: data.position ? data.position : null,
					team_hometown: data.team_hometown ? data.team_hometown : null,
					media: data.media ? data.media : null,
					bio: data.bio ? data.bio : null,
					socials: data.socials ? data.socials : null,
					generated: data.generated ? data.generated : null,
					bought_cards: data.bought_cards ? data.bought_cards : [],
				},
			};

			// Insert the card item into the DynamoDB table
			await dynamoDb.put(params).promise();

			// Return a success response with the created card item
			return {
				statusCode: 200,
				body: JSON.stringify(params.Item),
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
