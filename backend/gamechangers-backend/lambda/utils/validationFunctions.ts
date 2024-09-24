import { APIGatewayProxyEvent, APIGatewayProxyEventHeaders } from "aws-lambda";


const CONTENT_TYPE = "application/json";

export type ValidationResponse = {
	valid: boolean;
	message?: string;
}


/**
 * This function checks if the json object is malformed
 *
 * @param json: string - The JSON string to be checked
 * @returns boolean - true for malformed and false for not malformed
 */
export function isMalformedJson(json: string): boolean {

	try {
		JSON.parse(json);
		return false;

	} catch (error) {
		return true;
	}
}


/**
 * This function checks if the valid content type has been passed into the function via the contentType parameter
 *
 * @param contentType: string - The content type of the image ex. application/json
 * @returns boolean - True if the content type is valid, false otherwise
 */
export function validateContentType(contentType: string): boolean 	{
	return contentType === CONTENT_TYPE;
}


/**
 * This function checks if the headers are valid
 *
 * @param headers: APIGatewayProxyEventHeaders - The headers object that contains the headers of the request
 * @returns: ValidationResponse - An object that contains a boolean value and a message
 */
export function validateHeaders(headers: APIGatewayProxyEventHeaders | null): ValidationResponse {

	if (!headers) {
		return {
			valid: false,
			message: "Error! Invalid headers"
		};
	}

	const contentType = headers["Content-Type"] ? headers["Content-Type"] as string : headers["content-type"] as string;

	if (!validateContentType(contentType)) {
		return {
			valid: false,
			message: "Error! Invalid Content-Type header"
		};
	}

	return {
		valid: true
	};


	// will put more validations here as needed ex. validating the authorization header

}


// NOT USED RIGHT NOW BUT WILL BE USED IN MY NEXT PR

/**
 * This function checks if the request body is valid and has the right keys and values
 *
 * @param event: APIGatewayProxyEvent - The event object that contains the request body
 */
export function validatePOST(event: APIGatewayProxyEvent, attributes: {key: string, type: string}[]): ValidationResponse {

	// validate headers
	const headersValidation = validateHeaders(event.headers);

	if (!headersValidation.valid) {
		return {
			valid: false,
			message: headersValidation.message
		};
	}

	// validate body
	if (!event.body) {
		return {
			valid: false,
			message: "Error! No body"
		};
	}

	if (isMalformedJson(event.body)) {
		return {
			valid: false,
			message: "Error! Malformed body"
		};
	}

	const body = JSON.parse(event.body);

	if (!body) {

		return {
			valid: false,
			message: "Error! No body"
		};
	}

	// validate attributes
	for (const attribute of attributes) {
		if (!body[attribute.key] || typeof body[attribute.key] !== attribute.type) {
			return {
				valid: false,
				message: `Error! Missing or incorrect type for ${attribute.key}`
			};
		}
	}

	return {
		valid: true
	};

}


