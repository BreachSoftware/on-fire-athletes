
import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { TokenResponse, getUserId, getUserToken } from "../utils/cognitoFunctions";
import { ValidationResponse, validatePOST } from "../utils/validationFunctions";

interface Response {
	headers: { [key: string]: string | number | boolean };
	statusCode: number;
	body: string;
}
// eslint-disable-next-line import/prefer-default-export, func-style
export const rivalsAuthenticate: Handler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

	const headers = {
		"Content-Type": "application/json",
	};

	const lambdaResponse: Response = {
		headers: headers,
		statusCode: 500,
		body: JSON.stringify({
			message: "Error! There was an error authenticating the user.",
			success: false,
			userId: "",
			accessToken: ""
		})
	};

	const params = [
		{
			key: "email",
			type: "string"
		},
		{
			key: "password",
			type: "string"
		}
	];

	const POSTValidation: ValidationResponse = validatePOST(event, params);

	if (!POSTValidation.valid) {
		lambdaResponse.statusCode = 400;
		lambdaResponse.body = JSON.stringify({
			message: POSTValidation.message,
			success: false,
			userId: "",
			accessToken: ""
		});

		return Promise.resolve(lambdaResponse);
	}

	const {
		email,
		password
	} = JSON.parse(event.body ? event.body : "");

	const tokenResponse: TokenResponse = await getUserToken(email, password);

	if (tokenResponse.error) {
		lambdaResponse.statusCode = 500;
		lambdaResponse.body = JSON.stringify({
			message: tokenResponse.error,
			success: false,
			userId: "",
			accessToken: ""
		});

	} else {
		const userId = await getUserId(tokenResponse.accessToken);

		if (!userId) {
			lambdaResponse.statusCode = 500;
			lambdaResponse.body = JSON.stringify({
				message: "Error! No user found",
				success: false,
				userId: "",
				accessToken: ""
			});

		} else {
			lambdaResponse.statusCode = 200;
			lambdaResponse.body = JSON.stringify({
				accessToken: tokenResponse.accessToken,
				userId: userId,
				message: "Success! User authenticated",
				success: true
			});
		}
	}

	return Promise.resolve(lambdaResponse);

};
