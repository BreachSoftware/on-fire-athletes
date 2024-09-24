/* eslint-disable @typescript-eslint/no-var-requires */
const sharp = require("sharp");

// import { Image, createCanvas } from "canvas";

import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";


/**
 * Recolors an image
 * @param imageSrc - The path to the image
 * @returns {Promise<void>}
 */
async function imageResize(imageSrc: string, width: number | null, height: number | null):Promise<string> {

	const bufferfrombase64 = Buffer.from(imageSrc, "base64");

	return sharp(bufferfrombase64)
		.resize({ width: width, height: height, fit: sharp.fit.fill })
		.toBuffer()
		.then((data: Buffer) => {
			return data.toString("base64");
		});

}


// eslint-disable-next-line import/prefer-default-export, func-style
export const resizeImage: Handler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

	const data = JSON.parse(event.body ? event.body : "");

	const imageData = data.imageData;
	if(!imageData) {
		return Promise.resolve({
			statusCode: 400,
			body: JSON.stringify({
				message: "No image data provided",
			})
		});
	}

	const width = data.width ? parseInt(data.width) : null;

	const height = data.height ? parseInt(data.height) : null;

	if(!width && !height) {
		return Promise.resolve({
			statusCode: 400,
			body: JSON.stringify({
				message: "No width or height provided",
			})
		});
	}

	// Recolor the image
	const resizedImage = await imageResize(imageData, width, height);


	const response: APIGatewayProxyResult = {
		statusCode: 200,
		body: JSON.stringify({
			message: "Image resized successfully",
			imageData: resizedImage,
		})
	};

	return Promise.resolve(response);

};
