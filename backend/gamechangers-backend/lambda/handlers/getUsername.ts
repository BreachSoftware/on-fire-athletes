/* eslint-disable func-style */
import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { CognitoIdentityServiceProvider } from "aws-sdk";


/**
 * Retrieves the username associated with a given auth token.
 * @param authToken - The auth token to retrieve the username for.
 * @returns A promise that resolves to the username associated with the given auth token.
 */
async function getUsernameFromToken(authToken: string): Promise<string> {
	// Set up AWS Cognito Identity Provider instance
	const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();

	// Create params object for getUserInfo operation
	const params: CognitoIdentityServiceProvider.Types.GetUserRequest = {
		AccessToken: authToken
	};

	try {
		// Call getUser operation to retrieve user info
		const userInfo = await cognitoIdentityServiceProvider.getUser(params).promise();

		return userInfo.UserAttributes.find((attr) => {
			return attr.Name === "email";
		})?.Value || "";
	} catch (error) {
		console.error("Error retrieving user info:", error);
		throw error;
	}
}

/**
 * returns a list of all usernames in the database.
 * @param event - The API Gateway event object.
 * @returns A promise that resolves to the API Gateway proxy result.
 */
export const getUsername: Handler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	// Check if queryStringParameters is null
	if (!event.queryStringParameters || !event.queryStringParameters.authToken) {
		return {
			statusCode: 400,
			body: JSON.stringify({ success: false, message: "Auth token not provided." }),
		};
	}

	const { authToken } = event.queryStringParameters;
	let username = "";
	try {
		username = await getUsernameFromToken(authToken);
		console.log("Username:", username);

		return {
			statusCode: 200,
			body: JSON.stringify({ username: username, success: true, message: "getUsernames handler executed successfully!" }),
		};
	} catch (error) {
		console.error("Error:", error);
		if(username == "") {
			return {
				statusCode: 401,
				body: JSON.stringify({ success: false, message: "Invalid authToken." }),
			};
		}
		return {
			statusCode: 500,
			body: JSON.stringify({ success: false, message: "Internal server error." }),
		};
	}
};
