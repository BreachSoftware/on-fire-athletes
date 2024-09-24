import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { renameS3Object } from "../utils/s3Functions";

interface Response {
	statusCode: number;
	body: string;
	headers: { [key: string]: string | number | boolean };
}

// eslint-disable-next-line import/prefer-default-export, func-style
export const renameMedia: Handler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

	const bucketName = "gamechangers-media-uploads";


	const response: Response = {
		statusCode: 200,
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			message: "Serverless v3.0! Your function executed successfully!",
			input: event,
		})
	};

	if (!event.body) {
		response.statusCode = 400;
		response.body = JSON.stringify({
			error: "Error! No body",
		});
		return Promise.resolve(response);
	}

	const data = JSON.parse(event.body);

	// Error Checking
	if (data.userId === undefined || data.video === undefined || data.cardImage === undefined || data.cardBackImage === undefined) {
		return {
			statusCode: 400,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ error: "One or more required attributes is undefined" }),
		};
	} else if (
		typeof data.userId !== "string" || typeof data.cardImage !== "string" || typeof data.video !== "string" || typeof data.cardBackImage !== "string"
	) {
		return {
			statusCode: 400,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ error: "Invalid type for userId or urls" }),
		};
	}

	const userId = data.userId;
	const cardImage = data.cardImage;
	const video = data.video;
	const cardBackImage = data.cardBackImage;

	response.statusCode = 200;

	const videoSuccess = await renameS3Object(bucketName, video, userId);
	const cardImageSuccess = await renameS3Object(bucketName, cardImage, userId);
	const cardBackImageSuccess = await renameS3Object(bucketName, cardBackImage, userId);

	response.body = JSON.stringify({
		video: videoSuccess,
		cardImage: cardImageSuccess,
		cardBackImage: cardBackImageSuccess,
	});


	return Promise.resolve(response);

};

