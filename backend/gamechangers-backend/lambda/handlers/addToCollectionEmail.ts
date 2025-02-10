import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { SES } from "aws-sdk";
import { emailTemplate } from "../utils/emailHtml";
import { addToCollectionEmailBody } from "../utils/addToCollectionEmailBody";

/**
 * Sends an email to a card creator with a link to allow a user to claim a card.
 *
 * @param {APIGatewayProxyEvent} event - The API Gateway proxy event.
 * @returns {Promise<APIGatewayProxyResult | undefined>} The API Gateway proxy result.
 */
export async function addToCollectionEmail(
	event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult | undefined> {
	try {
		// Check if the event body exists
		if (!event.body) {
			return {
				statusCode: 500,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ error: "An unknown error occurred." }),
			};
		}

		// Parse the request body from the event
		const data = JSON.parse(event.body as string);

		// Check if required properties are missing
		if (
			data.toEmail === undefined ||
			data.requesterUUID === undefined ||
			data.generatedByUUID === undefined ||
			data.cardUUID === undefined ||
			data.cardFirstName === undefined ||
			data.cardLastName === undefined ||
			data.cardImage === undefined ||
			data.recipientFirstName === undefined
		) {
			return {
				statusCode: 400,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					error:
						"The request body must contain the uuids for the creator, the card, the sender, and the recepient's first name," +
						" as well as the card's first name, last name, and image",
				}),
			};
		}

		// Check if required properties are empty
		if (
			data.toEmail === "" ||
			data.requesterUUID === "" ||
			data.generatedByUUID === "" ||
			data.cardUUID === "" ||
			data.cardFirstName === "" ||
			data.cardLastName === "" ||
			data.cardImage === "" ||
			data.recipientFirstName === ""
		) {
			return {
				statusCode: 400,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					error: "None of the properties can be empty",
				}),
			};
		}

		// Check if required properties are of the correct type
		if (
			typeof data.toEmail !== "string" ||
			typeof data.requesterUUID !== "string" ||
			typeof data.generatedByUUID !== "string" ||
			typeof data.cardUUID !== "string" ||
			typeof data.cardFirstName !== "string" ||
			typeof data.cardLastName !== "string" ||
			typeof data.cardImage !== "string" ||
			typeof data.recipientFirstName !== "string"
		) {
			return {
				statusCode: 400,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					error: "All properties must be of type string",
				}),
			};
		}

		// This checks that if the requester doesn't have a full first and last name, they must have an email
		if (data.requesterEmail === undefined || data.requesterEmail === "") {
			return {
				statusCode: 400,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					error: "The request body must contain either the requester's email",
				}),
			};
		}

		const emailBody = addToCollectionEmailBody(
			data.requesterUUID,
			data.generatedByUUID,
			data.cardUUID,
			data.cardFirstName,
			data.cardLastName,
			data.cardImage,
			data.requesterEmail,
			data.recipientFirstName,
		);

		// Set up the email parameters
		const params = {
			Destination: {
				ToAddresses: [data.toEmail],
			},
			Message: {
				Body: {
					Html: {
						Charset: "UTF-8",
						Data: emailTemplate(emailBody),
					},
				},
				Subject: {
					Charset: "UTF-8",
					Data: "A user has requested to add your card to their collection",
				},
			},
			Source: "Gamechangers Team <support@onfireathletes.com>",
			ReplyToAddresses: ["support@onfireathletes.com"],
		};

		console.log("Sending email to: ", data.toEmail);

		// Create the promise and SES service object
		const sendPromise = new SES({ apiVersion: "2010-12-01" })
			.sendEmail(params)
			.promise();

		try {
			// Send the email
			await sendPromise;
			console.log("Email sent successfully");
			return {
				statusCode: 200,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ message: "Email sent successfully" }),
			};
		} catch (error) {
			// Log the error if an exception occurs when sending the email
			console.error(
				"The following error occurred when sending the email: ",
			);
			console.error(error);

			return {
				statusCode: 500,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ error: error }),
			};
		}
	} catch (error) {
		// Log the error if an exception occurs when modifying ownership of a card
		console.error("The following error occurred when sending the email: ");
		console.error(error);

		// Return an error response with a 500 status code
		return {
			statusCode: 500,
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ error: error }),
		};
	}
}
