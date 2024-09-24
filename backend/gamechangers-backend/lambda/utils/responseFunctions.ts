import { APIGatewayProxyResult } from "aws-lambda";

/**
 * A helper function to send a response to the client
 *
 * @param statusCode - The status code of the response
 * @param body - The body of the response
 * @returns - The response object
 */
export function sendResponse(statusCode: number, body: object): APIGatewayProxyResult {
	return {
		statusCode: statusCode,
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body)
	};
}
