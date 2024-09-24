
import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { TokenResponse, getUserToken } from "../utils/cognitoFunctions";

interface Response {
	headers: { [key: string]: string | number | boolean };
	statusCode: number;
	body: string;
}
// eslint-disable-next-line import/prefer-default-export, func-style
export const getToken: Handler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

	const headers = {
		"Content-Type": "application/json",
	};

	const lambdaResponse: Response = {
		headers: headers,
		statusCode: 200,
		body: JSON.stringify({
			message: "Serverless v3.0! Your function executed successfully!",
			input: event,
		})
	};

	if (!event.body) {
		lambdaResponse.statusCode = 500;
		lambdaResponse.body = JSON.stringify({
			error: "Error! No body",
		});

		return Promise.resolve(lambdaResponse);
	}

	const {
		email,
		password
	} = JSON.parse(event.body);

	if (!email || !password) {
		return Promise.resolve({
			statusCode: 400,
			headers: headers,
			body: JSON.stringify({
				error: "Error! Missing email or password",
			})
		});
	} else if (typeof email !== "string" || typeof password !== "string") {
		return Promise.resolve({
			statusCode: 400,
			headers: headers,
			body: JSON.stringify({
				error: "Error! Email or password is not a string",
			})
		});
	}

	const tokenResponse: TokenResponse = await getUserToken(email, password);

	if (tokenResponse.error) {
		lambdaResponse.statusCode = 500;
		lambdaResponse.body = JSON.stringify({
			error: tokenResponse.error
		});
	} else {
		lambdaResponse.body = JSON.stringify({
			accessToken: tokenResponse.accessToken
		});
	}

	return Promise.resolve(lambdaResponse);

};
