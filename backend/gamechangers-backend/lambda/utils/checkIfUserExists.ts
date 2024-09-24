import { DynamoDB } from "aws-sdk";
import { sendResponse } from "./responseFunctions";
import { dbTables } from "../../EnvironmentManager/EnvironmentManager";

/**
 * Check if a user exists in the database
 * @param uuid the uuid of the user
 * @param parameter the parameter to check
 * @returns true if the user exists, false otherwise
 */
export async function checkIfUserExists(uuid: string) {
	const docClient = new DynamoDB.DocumentClient();

	const params = {
		TableName: dbTables.GamechangersUsers(),
		Key: {
			uuid: uuid
		}
	};

	try {
		// Check if the uuid is that of the Gamechangers Admin
		if (uuid === "GamechangersAdmin") {
			return sendResponse(200, { message: "The uuid is that of Gamechangers Admin" });
		}

		const data = await docClient.get(params).promise();

		if (!data.Item) {
			return {
				statusCode: 404,
				headers: { "Content-Type": "text/plain" },
				body: JSON.stringify({ error: "The uuid does not exist in the Users database" }),
			};
		}

		return {
			statusCode: 200,
			headers: { "Content-Type": "text/plain" },
			body: JSON.stringify({ message: "The uuid exists in the Users database" }),
		};

	} catch (error) {
		console.error("An error occurred while checking if the user exists in the user database");
		console.error(error);

		// Return an error response with a 500 status code
		return {
			statusCode: 500,
			headers: { "Content-Type": "text/plain" },
			body: JSON.stringify({ error: error }),
		};
	}
}
