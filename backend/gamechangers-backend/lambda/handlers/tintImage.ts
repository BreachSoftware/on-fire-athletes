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
async function imageTint(imageSrc: string, red: number, green: number, blue: number, inverted: boolean):Promise<string> {

	const bufferfrombase64 = Buffer.from(imageSrc, "base64");

	const tintBrightness = red * 0.299 + green * 0.587 + blue * 0.114;

	return sharp(bufferfrombase64)
		.ensureAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true })
		.then(async({ data, info }: { data: Buffer, info: { width:number, height:number, channels: number } }) => {
			const { width, height, channels } = info;
			for (let i = 0; i < data.length; i = i + channels) {
				// i+3 is the alpha channel
				if(data[i + 3] > 0) {
					// Adjust based on the original value by lerping the original color with the tint color
					// data[i] is red, data[i+1] is green, data[i+2] is blue
					// https://stackoverflow.com/questions/596216/formula-to-determine-perceived-brightness-of-rgb-color
					const value = // If the pixel is grayscale, use the grayscale value instead of spending time calculating it
						data[i] === data[i + 1] && data[i + 1] === data[i + 2] ?
							data[i] :
							data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;

					// value / 256 is the percentage of lerpage to the tint color
					let t = (value / 256);

					// Adjust the amount to tint by the brightness of the tint color
					// https://www.desmos.com/calculator/wycdc03a8h
					t = t * (1 - (25.5 + 0.15 * tintBrightness) / 255);

					// Invert the t value if needed to tint according to white or black
					// Not inverted = black will remain, OG white pixels will become tint color
					// Inverted = white will remain, OG black pixels will become tint color
					t = inverted ? 1 - t : t;

					// lerp(a, b, t) = a + (b - a) * t
					// a = original color, b = tint color, t = value / 256
					data[i] = Math.floor(data[i] + (red - data[i]) * t);
					data[i + 1] = Math.floor(data[i + 1] + (green - data[i + 1]) * t);
					data[i + 2] = Math.floor(data[i + 2] + (blue - data[i + 2]) * t);

				}
			}
			const newImage = await sharp(data, { raw: { width: width, height: height, channels: channels } })
				.toFormat("png")
				.png()
				.toBuffer();
			return newImage.toString("base64");
		});

}

/**
 * A function to tint the image based on the given hex color.
 * Will take into account the alpha channel and darkness of pixels.
 * @param event is the APIGatewayProxyEvent that contains the JSON image data and the hex color.
 * @returns the base64 string of the recolored image.
 */
export async function tintImage(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

	const data = event.body ? JSON.parse(event.body) : {};

	const imageData = data.imageData;
	const hexColor = data.hexColor;
	const inverted = data.inverted;

	if(!imageData || !hexColor) {
		return Promise.resolve({
			statusCode: 400,
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				message: "Missing required parameters. Please provide imageData and hexColor.",
			})
		});
	}

	const rgbColor = hexToRGB(hexColor);
	// Recolor the image
	const tintedImage = await imageTint(imageData, rgbColor[0], rgbColor[1], rgbColor[2], inverted);


	const response: APIGatewayProxyResult = {
		statusCode: 200,
		body: JSON.stringify({
			message: "Image tinted successfully",
			imageData: tintedImage,
		})
	};

	return Promise.resolve(response);

};
