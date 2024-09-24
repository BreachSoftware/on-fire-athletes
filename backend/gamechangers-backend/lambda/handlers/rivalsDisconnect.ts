
import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { disconnectUser, getUserId } from "../utils/cognitoFunctions";
import { ValidationResponse, validatePOST } from "../utils/validationFunctions";

interface Response {
	headers: { [key: string]: string | number | boolean };
	statusCode: number;
	body: string;
}
// eslint-disable-next-line import/prefer-default-export, func-style
export const rivalsDisconnect: Handler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

	const headers = {
		"Content-Type": "application/json",
	};

	const lambdaResponse: Response = {
		headers: headers,
		statusCode: 500,
		body: JSON.stringify({
			message: "Error! There was an error disconnecting the user.",
			success: false,
		})
	};

	const params = [
		{
			key: "userId",
			type: "string"
		},
		{
			key: "authToken",
			type: "string"
		}
	];

	// validate headers, body, and body attributes
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
		userId,
		authToken
	} = JSON.parse(event.body ? event.body : "");

	const userIdFromAuthToken = await getUserId(authToken);

	if(userIdFromAuthToken !== userId) {
		return Promise.resolve({
			statusCode: 400,
			headers: headers,
			body: JSON.stringify({
				message: "Error! The authToken does not match the userId provided.",
				success: false,
			})
		});
	}

	const disconnectResponse = await disconnectUser(authToken);

	if (disconnectResponse.error) {
		lambdaResponse.statusCode = 500;
		lambdaResponse.body = JSON.stringify({
			message: disconnectResponse.error,
			success: false,
		});
	} else {
		lambdaResponse.statusCode = 200;
		lambdaResponse.body = JSON.stringify({
			message: "Success! User disconnected",
			success: true,
		});
	}

	return Promise.resolve(lambdaResponse);

};
