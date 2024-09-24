import { CognitoIdentityServiceProvider } from "aws-sdk";

export interface TokenResponse {
    accessToken: string,
    error: string
}

/**
 * Gets the access token if the user exists and correct credentials are provided
 * @param email the email of the user
 * @param password the password of the user
 *
 * @returns the access token for the user and an error if any
 */
export async function getUserToken(email: string, password: string): Promise<TokenResponse> {

	const tokenResponse: TokenResponse = {
		accessToken: "",
		error: ""
	};

	const cognito = new CognitoIdentityServiceProvider({
		region: "us-east-1"
	});

	const params = {
		AuthFlow: "USER_PASSWORD_AUTH",
		ClientId: "201jn51bb4jt2suoi1lbchicj6",
		AuthParameters: {
			USERNAME: email,
			PASSWORD: password
		},
	};

	try {
		const response = await cognito.initiateAuth(params).promise();
		const accessToken = response.AuthenticationResult!.AccessToken;

		tokenResponse.accessToken = accessToken ?? "";
	} catch	(error) {
		tokenResponse.error = error;
	}

	return tokenResponse;

}

/**
 * This function get the userId given an authorization token
 *
 * @param authToken the user authorization token
 * @returns The userId of the user
 */
export async function getUserId(authToken: string): Promise<string> {

	const cognito = new CognitoIdentityServiceProvider();

	try {

		// Decode the token to get user information
		const decodedToken = await cognito.getUser({ AccessToken: authToken }).promise();

		// Extract the user ID from the decoded token
		const userId = decodedToken.UserAttributes.find((attr) => {
			return attr.Name === "sub";
		})?.Value;

		if (!userId) {
			return "";
		}

		return userId;

	} catch (error) {
		console.error("Error:", error);
		return "";
	}
}

/**
 * This function disconnects the user from the application
 * @param userId - the user id
 * @param authToken - the user authorization token
 * @returns an error if any
 */
export async function disconnectUser(authToken: string): Promise<{ error: string }> {

	const cognito = new CognitoIdentityServiceProvider();

	const params = {
		AccessToken: authToken
	};

	try {
		await cognito.globalSignOut(params).promise();
		return { error: "" };
	} catch (error) {
		return { error: error };
	}
}
