// eslint-disable-next-line @typescript-eslint/no-var-requires
const sharp = require("sharp");

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

/**
	 * A function to convert from "#ABCDEF" to [ AB, CD, EF ].
	 * No input validation is done here since the input should be validated when parsing original JSON request.
	 * @param str The hex string to convert.
	 * @returns an array of the RGB integer values based on the numbers in the hex string.
	 */
export function hexToRGB(str: string):number[] {
	const noHashtag = str.replace("#", "");
	return [
		parseInt(noHashtag.substring(0, 2), 16),
		parseInt(noHashtag.substring(2, 4), 16),
		parseInt(noHashtag.substring(4, 6), 16)
	];
}

/**
 * Recolors an image
 * @param imageSrc - The path to the image
 * @returns {Promise<void>}
 */
async function imageRecolor(imageSrc: string, red: number, green: number, blue: number):Promise<string> {

	console.log("Recoloring image...");

	const bufferfrombase64 = Buffer.from(imageSrc, "base64");
	console.log("Buffer from base64: ", bufferfrombase64);

	return sharp(bufferfrombase64)
		.ensureAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true })
		.then(async({ data, info }: { data: Buffer, info: { width:number, height:number, channels: number } }) => {
			console.log("Data: ", data);
			console.log("Info: ", info);
			const { width, height, channels } = info;
			for (let i = 0; i < data.length; i = i + channels) {
				if(data[i + 3] > 0) {
					// Adjust based on the original color
					data[i] = red;
					data[i + 1] = green;
					data[i + 2] = blue;

				}
			}
			const newImage = await sharp(data, { raw: { width: width, height: height, channels: channels } })
				.toFormat("png")
				.png()
				.toBuffer();
			console.log("New image: ", newImage);
			return newImage.toString("base64");
		});

}

/**
 * A function to recolor the image based on the given hex color.
 * @param event is the APIGatewayProxyEvent that contains the JSON image data and the hex color.
 * @returns the base64 string of the recolored image.
 */
export async function recolorImage(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

	console.log("Recoloring image...");

	const data = JSON.parse(event.body ? event.body : "");

	console.log("Data: ", data);

	const imageData = data.imageData;
	console.log("Image data: ", imageData);
	const hexColor = data.hexColor;
	console.log("Hex color: ", hexColor);
	if(!imageData || !hexColor || hexColor.replace("#", "").length !== 6) {
		return Promise.resolve({
			statusCode: 400,
			body: JSON.stringify({
				message: "Invalid request. Please provide an image and a hex color.",
			})
		});
	}

	const rgbColor = hexToRGB(hexColor);
	console.log("RGB color: ", rgbColor);
	// Recolor the image
	const recoloredImage = await imageRecolor(imageData, rgbColor[0], rgbColor[1], rgbColor[2]);
	console.log("Recolored image: ", recoloredImage);


	const response: APIGatewayProxyResult = {
		statusCode: 200,
		body: JSON.stringify({
			message: "Image recolored successfully!",
			imageData: recoloredImage,
		})
	};

	return Promise.resolve(response);

};
