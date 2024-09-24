/* eslint-disable func-style */

import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { S3 } from "aws-sdk";
import { getUserId } from "../utils/cognitoFunctions";

interface Response {
    headers: { [key: string]: string | number | boolean };
    statusCode: number;
    body: string;
}

/**
 * This function retrieves a list of object URLs from an S3 bucket that have a certain prefix.
 *
 * @param bucketName - the name of the S3 bucket
 * @param prefix - the prefix of the object
 * @returns - a list of object URLs
 */
const getObjectUrlsByPrefix = async(bucketName: string, prefix: string): Promise<string[]> => {

	const s3 = new S3();

	try {
		const params: S3.ListObjectsV2Request = {
			Bucket: bucketName,
			Prefix: prefix,
		};

		const data = await s3.listObjectsV2(params).promise();

		if (!data.Contents) {
			return [];
		}

		// Filter objects that are inside the "image" folder and start with a certain string
		const objectUrls = data.Contents
			.map((obj) => {
				return `https://${bucketName}.s3.amazonaws.com/${obj.Key}`;
			});

		return objectUrls;
	} catch (error) {
		console.error("Error:", error);
		throw error;
	}
};

// eslint-disable-next-line import/prefer-default-export, func-style
export const assignAvatar: Handler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

	const headers = {
		"Content-Type": "application/json",
	};

	const lambdaResponse: Response = {
		headers: headers,
		statusCode: 400,
		body: JSON.stringify({
			success: false,
			message: "Error getting images for user",
			input: event,
		})
	};

	if (!event.queryStringParameters) {
		lambdaResponse.statusCode = 400;
		lambdaResponse.body = JSON.stringify({
			success: false,
			message: "Error! Required query string parameters are missing!",
		});

		return Promise.resolve(lambdaResponse);
	}

	const queryStringParameters = event.queryStringParameters;

	const userId = queryStringParameters.userId;
	const authToken = queryStringParameters.authToken;

	if (!userId || !authToken) {
		return Promise.resolve({
			statusCode: 400,
			headers: headers,
			body: JSON.stringify({
				success: false,
				message: "Error! Missing one or more required query parameters. authtoken or userId is null.",
			})
		});
	} else if (typeof userId !== "string" || typeof authToken !== "string") {
		return Promise.resolve({
			statusCode: 400,
			headers: headers,
			body: JSON.stringify({
				success: false,
				message: "Error! Incorrect type for one or more query parameters. authToken and userId should be strings.",
			})
		});
	}

	const userIdCheck = await getUserId(authToken);

	if (userIdCheck !== userId) {
		return Promise.resolve({
			statusCode: 403,
			headers: headers,
			body: JSON.stringify({
				success: false,
				message: "Error! Invalid authentication token.",
			})
		});
	}

	try	{
		const bucketName = "gamechangers-media-uploads";
		const prefix = `image/${userId}`;

		const objectUrls = await getObjectUrlsByPrefix(bucketName, prefix);

		const imageArray = objectUrls.map((url) => {
			return {
				url: url,
				type: `image/${url.split(".").pop()}`,
			};
		});

		lambdaResponse.statusCode = 200;
		lambdaResponse.body = JSON.stringify({
			input: imageArray,
			success: true,
			message: `Successfully retrieved avatar images for user ${userId}.`,
		});
	} catch	(error) {
		console.error("Error:", error);
		lambdaResponse.statusCode = 500;
		lambdaResponse.body = JSON.stringify({
			error: "An error occurred while retrieving the object URLs.",
		});
	}


	return Promise.resolve(lambdaResponse);

};
