/* eslint-disable func-style */
import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { CognitoIdentityProviderClient, AdminGetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { sendResponse } from "../utils/responseFunctions";


/**
 * A Lambda handler that retrieves a user's UUID from the Cognito User Pool.
 * @param event - The API Gateway event object.
 * @returns A promise that resolves to the API Gateway proxy result.
 */
export const getUUID: Handler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	try {
		console.log("Received event:", event); // Log the entire event object

		const data = JSON.parse(event.body ? event.body : "");
		const email = data.email;

		console.log("Parsed email from request body:", email); // Log the parsed email

		// Check to see if the query parameter contains a uuid value
		if (!email) {
			console.error("Missing email parameter in request body"); // Log the error
			return sendResponse(400, { error: "The request requires a email body parameter" });
		}

		const client = new CognitoIdentityProviderClient({ region: "us-east-1" });
		const input = {
			UserPoolId: "us-east-1_sz1BIxflj", // required
			Username: email, // required
		};

		console.log("Cognito input:", input); // Log the input for the Cognito command

		const command = new AdminGetUserCommand(input);
		const response = await client.send(command);

		console.log("Cognito response:", response); // Log the response from Cognito

		if (!response.UserAttributes) {
			console.error("No user found for the provided email"); // Log the error
			return sendResponse(404, { error: "No user found" });
		}

		const protectedString = response.UserAttributes[0].Value ? response.UserAttributes[0].Value : "No user found";
		console.log("Retrieved UUID:", protectedString); // Log the retrieved UUID

		return sendResponse(200, { uuid: protectedString });
	} catch (error) {
		// Log the error if an exception occurs
		console.error("The following error occurred when retrieving a profile: ");
		console.error(error);

		// Return an error response with a 500 status code
		return sendResponse(500, { error: "An error occurred when retrieving a profile" });
	}
};
