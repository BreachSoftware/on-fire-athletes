import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

interface Response {
	statusCode: number;
	body: string;
}
// eslint-disable-next-line import/prefer-default-export, func-style
export const hello: Handler = (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

	const response: Response = {
		statusCode: 200,
		body: JSON.stringify({
			message: "Serverless v3.0! Your function executed successfully!",
			input: event,
		})
	};

	if (event.body) {
		const data = JSON.parse(event.body);
		console.log(data);

		if (data.hasOwnProperty("test")) {
			response.statusCode = 200;
			response.body = JSON.stringify({
				message: "Serverless v3.0! Your function executed successfully!",
				input: data.test,
			});
		} else {
			response.statusCode = 400;
			response.body = JSON.stringify({
				error: "Error! No test property",
			});
		}
	} else {
		response.statusCode = 400;
		response.body = JSON.stringify({
			error: "Error! No body",
		});
	}


	return Promise.resolve(response);

};

