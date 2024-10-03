/* eslint-disable func-style */
/* eslint-disable no-unused-vars */
import {
	Handler,
	APIGatewayProxyEvent,
	APIGatewayProxyResult,
} from "aws-lambda";
import { S3 } from "aws-sdk";

/**
 * Generates a pre-signed URL for uploading an object to an S3 bucket.
 *
 * @param event - The API Gateway event object.
 *
 * @attribute filename - The name of the file to be uploaded.
 * @attribute filetype - The type of file to be uploaded.
 * @attribute mediatype - describes how the media should be categroized (avatar, card, profile media, etc.)
 *
 * @returns A promise that resolves to the API Gateway proxy result.
 *
 */
// eslint-disable-next-line import/prefer-default-export, func-style
export const generatePresignedURL: Handler = async (
	event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
	// check for empty body
	if (!event.body) {
		return {
			statusCode: 400,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ error: "Empty request body found" }),
		};
	}

	// Parse the request body from the event
	const data = JSON.parse(event.body as string);

	if (
		data.filename === undefined ||
		data.mediatype === undefined ||
		data.filetype === undefined
	) {
		return {
			statusCode: 400,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				error: "The request body must contain a 'mediatype', 'filetype', and 'filename'",
			}),
		};
	} else if (
		data.mediatype === "" ||
		data.filename === "" ||
		data.filetype === ""
	) {
		return {
			statusCode: 400,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				error: "The 'mediatype', 'filetype', and 'filename' properties must not be empty",
			}),
		};
	} else if (
		typeof data.filename !== "string" ||
		typeof data.mediatype !== "string" ||
		typeof data.filetype !== "string"
	) {
		return {
			statusCode: 400,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				error: "The ''mediatype', 'filetype', and 'filename' properties must be strings",
			}),
		};
	}

	const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION } =
		process.env;

	const s3 = new S3({
		region: AWS_REGION,
		accessKeyId: AWS_ACCESS_KEY_ID,
		secretAccessKey: AWS_SECRET_ACCESS_KEY,
		signatureVersion: "v4",
	});

	// Define parameters for generating pre-signed URL
	const params = {
		Bucket: "onfireathletes-media-uploads",
		Key: `${data.mediatype}/${data.filename}`, // This is the key (path) where the object will be stored in your bucket
		ContentType: data.filetype, // Adjust content type as needed
		Expires: 3600, // URL expiration time in seconds (e.g., 1 hour)
	};

	try {
		const uploadUrl = await s3.getSignedUrlPromise("putObject", params);

		return {
			statusCode: 200,
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				url: uploadUrl,
			}),
		};
	} catch (error) {
		return {
			statusCode: 500,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				error: "An error occurred while generating the pre-signed URL",
			}),
		};
	}
};
