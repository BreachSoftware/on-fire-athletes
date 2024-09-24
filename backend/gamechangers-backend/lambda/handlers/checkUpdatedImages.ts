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
const getObjectUrlsByPrefix = async(bucketName: string, prefix: string, lastCheckedDate: Date): Promise<string[]> => {

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
		const objectUrls = data.Contents.filter((obj) => {
			return obj.LastModified! >= lastCheckedDate;
		})
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
export const checkUpdatedImages: Handler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

	const headers = {
		"Content-Type": "application/json",
	};

	const lambdaResponse: Response = {
		headers: headers,
		statusCode: 400,
		body: JSON.stringify({
			success: false,
			message: "Error getting media for user",
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
	const lastChecked = queryStringParameters.lastChecked;

	if (!userId || !authToken || !lastChecked) {
		return Promise.resolve({
			statusCode: 400,
			headers: headers,
			body: JSON.stringify({
				success: false,
				message: "Error! Missing one or more required query parameters. authToken, userId, or lastChecked is null.",
			})
		});
	} else if (typeof userId !== "string" || typeof authToken !== "string" || typeof lastChecked !== "string") {
		return Promise.resolve({
			statusCode: 400,
			headers: headers,
			body: JSON.stringify({
				success: false,
				message: "Error! Incorrect type for one or more query parameters. authToken, userId, and lastChecked should be strings.",
			})
		});
	}

	// Convert lastChecked to a Date object
	// eslint-disable-next-line init-declarations
	let lastCheckedDate: Date;
	try {
		lastCheckedDate = new Date(queryStringParameters.lastChecked!);
		console.log(lastCheckedDate);
	} catch (error) {
		console.error("Error:", error);
		lambdaResponse.statusCode = 400;
		lambdaResponse.body = JSON.stringify({
			success: false,
			message: "Error! Invalid date format for lastChecked.",
		});

		return Promise.resolve(lambdaResponse);
	}

	// Check if lastChecked is a valid date
	if (lastCheckedDate.toString() === "Invalid Date") {
		return Promise.resolve({
			statusCode: 400,
			headers: headers,
			body: JSON.stringify({
				success: false,
				message: "Error! Invalid date format for lastChecked.",
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

		const objectUrls = await getObjectUrlsByPrefix(bucketName, prefix, lastCheckedDate);

		const mediaArray = objectUrls.map((url) => {
			return {
				url: url,
				type: `${lastChecked}/${url.split(".").pop()}`,
			};
		});

		if (mediaArray.length === 0) {
			lambdaResponse.statusCode = 200;
			lambdaResponse.body = JSON.stringify({
				mediaArray: mediaArray,
				success: true,
				message: `No new images found for user ${userId}.`,
			});
		} else {
			lambdaResponse.statusCode = 200;
			lambdaResponse.body = JSON.stringify({
				media: mediaArray,
				success: true,
				message: `Successfully retrieved images for user ${userId}.`,
			});
		}
	} catch	(error) {
		console.error("Error:", error);
		lambdaResponse.statusCode = 500;
		lambdaResponse.body = JSON.stringify({
			error: "An error occurred while retrieving the object URLs.",
		});
	}


	return Promise.resolve(lambdaResponse);

};
