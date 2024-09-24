/* eslint-disable func-style */
import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { dbTables } from "../../EnvironmentManager/EnvironmentManager";

// Create an instance of the DynamoDB DocumentClient
const dynamoDb = new DynamoDB.DocumentClient();

/**
 * Creates a new card.
 * @param event - The API Gateway event object.
 * @returns A promise that resolves to the API Gateway proxy result.
 */
export const createCard: Handler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	const uuid: string = uuidv4();
	const currentUnixTime: number = Math.floor(Date.now() / 1000);
	try {
		if (event.body) {
			// Parse the request body from the event
			const data = JSON.parse(event.body as string);

			// Error Checking
			if (data.generatedBy === undefined) {
				return {
					statusCode: 400,
					headers: { "Content-Type": "text/plain" },
					body: JSON.stringify({ error: "The request body must contain a generatedBy property" }),
				};
			} else if (data.generatedBy === "") {
				return {
					statusCode: 400,
					headers: { "Content-Type": "text/plain" },
					body: JSON.stringify({ error: "The generatedBy property cannot be empty" }),
				};
			} else if (typeof data.generatedBy !== "string") {
				return {
					statusCode: 400,
					headers: { "Content-Type": "text/plain" },
					body: JSON.stringify({ error: "The generatedBy property must be of type string" }),
				};
			}

			if(data.price > 10000.00) {
				return {
					statusCode: 400,
					headers: { "Content-Type": "text/plain" },
					body: JSON.stringify({ error: "The price must be less than or equal to $10,000" }),
				};
			}

			console.log(data);

			// Define the parameters for the DynamoDB put operation
			const params = {
				TableName: dbTables.GamechangersCards(),
				Item: {
					generatedBy: data.generatedBy,
					uuid: data.uuid || uuid,
					createdAt: data.createdAt || currentUnixTime,
					price: data.price,
					// Trading Card Parameters
					cardImage: data.cardImage, // cardInfo.cardImage
					cardBackS3URL: data.cardBackS3URL, // cardInfo.cardBackS3URL
					stepNumber: data.stepNumber,
					totalCreated: data.totalCreated,
					currentlyAvailable: data.totalCreated,
					// Step 1: Your Information
					cardType: data.cardType, // "a" or "b"
					firstName: data.firstName,
					lastName: data.lastName,
					number: data.number,
					sport: data.sport,
					position: data.position,
					careerLevel: data.careerLevel,
					teamName: data.teamName,
					// Step 2: Upload Media
					frontPhotoURL: data.frontPhotoURL, // cardInfo.frontPhotoURL,
					frontPhotoWidth: data.frontPhotoWidth,
					frontPhotoHeight: data.frontPhotoHeight,
					heroXOffset: data.heroXOffset,
					heroYOffset: data.heroYOffset,
					heroWidth: data.heroWidth,
					signature: data.signature,
					signatureXOffset: data.signatureXOffset,
					signatureYOffset: data.signatureYOffset,
					signatureWidth: data.signatureWidth,
					backVideoURL: data.backVideoURL, // cardInfo.backVideoURL,
					backVideoXOffset: data.backVideoXOffset,
					backVideoYOffset: data.backVideoYOffset,
					backVideoWidth: data.backVideoWidth,
					backVideoHeight: data.backVideoHeight,
					backVideoRotation: data.backVideoRotation,
					// Step 4: Border/Background/Position/Team Colors
					borderColor: data.borderColor,
					backgroundAccentColor: data.backgroundAccentColor,
					backgroundMainColor: data.backgroundMainColor,
					backgroundTextColor: data.backgroundTextColor,
					topCardTextColor: data.topCardTextColor,
					selectedBackground: data.selectedBackground,
					// Step 5: Finalization
					NFTDescription: data.NFTDescription, // Not an NFT? NORMAL FREAKING TRADINGCARD DESCRIPTION
					firstNameSolid: data.firstNameSolid,
					lastNameSolid: data.lastNameSolid,
					nameColor: data.nameColor,
					nameFont: data.nameFont,
					numberColor: data.numberColor,
					signatureColor: data.signatureColor, // hex color
					partsToRecolor: data.partsToRecolor,
					paymentStatus: data.paymentStatus,
					tradeStatus: data.tradeStatus // Trade status parameter
				},
			};

			// Insert the card item into the DynamoDB table
			await dynamoDb.put(params).promise();

			// Return a success response with the created card item
			return {
				statusCode: 200,
				body: JSON.stringify(params.Item),
			};
		}

		return {
			statusCode: 400,
			headers: { "Content-Type": "text/plain" },
			body: JSON.stringify({ error: "The request body cannot be empty" }),
		};
	} catch (error) {
		// Log the error if an exception occurs
		console.error("The following error occurred when creating a card: ");
		console.error(error);

		// Return an error response with a 500 status code
		return {
			statusCode: 500,
			headers: { "Content-Type": "text/plain" },
			body: JSON.stringify({ error: error }),
		};
	}
};
