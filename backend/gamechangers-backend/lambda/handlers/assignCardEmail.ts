/* eslint-disable indent */
/* eslint-disable max-len */
// These disables are necessary for the HTML template to be formatted correctly
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { SES } from "aws-sdk";
import { emailTemplate } from "../utils/emailHtml";
import { assignCardEmailBody } from "../utils/assignCardEmailBody";

/**
 * Sends an email to a user with a link to claim a card.
 *
 * @param {APIGatewayProxyEvent} event - The API Gateway proxy event.
 * @returns {Promise<APIGatewayProxyResult | undefined>} The API Gateway proxy result.
 */
export async function assignCardEmail(
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
			data.fromEmail === undefined ||
			data.generatedByUUID === undefined ||
			data.cardUUID === undefined ||
			data.cardFirstName === undefined ||
			data.cardLastName === undefined ||
			data.cardImage === undefined ||
			data.senderFirstName === undefined ||
			data.fromUUID === undefined
		) {
			return {
				statusCode: 400,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					error:
						"The request body must contain the uuids for the creator, the card, the sender, the recepient's first name," +
						" as well as the card's first name, last name, and image",
				}),
			};
		}

		// Check if required properties are empty
		if (
			data.fromEmail === "" ||
			data.generatedByUUID === "" ||
			data.cardUUID === "" ||
			data.cardFirstName === "" ||
			data.cardLastName === "" ||
			data.cardImage === "" ||
			data.senderFirstName === "" ||
			data.fromUUID === ""
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
			typeof data.fromEmail !== "string" ||
			typeof data.generatedByUUID !== "string" ||
			typeof data.cardUUID !== "string" ||
			typeof data.cardFirstName !== "string" ||
			typeof data.cardLastName !== "string" ||
			typeof data.cardImage !== "string" ||
			typeof data.senderFirstName !== "string" ||
			typeof data.fromUUID !== "string"
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

		// This checks that if the recepient has an email
		if (data.recepientEmail === undefined || data.recepientEmail === "") {
			return {
				statusCode: 400,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					error: "The request body must contain either the recepient's email",
				}),
			};
		}

		// Supply the email template with its body
		const emailBody = assignCardEmailBody(
			data.recepientUUID,
			data.generatedByUUID,
			data.cardUUID,
			data.cardFirstName,
			data.cardLastName,
			data.cardImage,
			data.fromEmail,
			data.senderFirstName,
			data.fromUUID,
		);

		// Set up the email parameters
		const params = {
			Destination: {
				ToAddresses: [data.recepientEmail],
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
					Data: "You've been sent an OnFire Athletes trading card!",
				},
			},
			Source: "OnFire Athletes Team <colin@breachsoftware.com>",
			ReplyToAddresses: ["mail@onfireathletes.com"],
		};

		console.log("Sending email to: ", data.toEmail);

		// Create the promise and SES service object
		const sendPromise = new SES({ apiVersion: "2010-12-01" })
			.sendEmail(params)
			.promise();

		try {
			// Send the email
			const res = await sendPromise;

			console.log(res);

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
