import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { SES } from "aws-sdk";
import { emailTemplate } from "../utils/emailHtml";
import { contactEmailBody } from "../utils/contactEmailBody";
import { contactEmailBodyAttachment } from "../utils/contactEmailBodyAttachment";

/**
 * Sends an email to a card creator with a link to allow a user to claim a card.
 *
 * @param {APIGatewayProxyEvent} event - The API Gateway proxy event.
 * @returns {Promise<APIGatewayProxyResult | undefined>} The API Gateway proxy result.
 */
export async function contactEmail(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult | undefined> {
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
			data.firstName === undefined ||
			data.lastName === undefined ||
			data.email === undefined ||
			data.subject === undefined ||
			data.message === undefined
		) {
			return {
				statusCode: 400,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(
					{ error: "The request body must contain the first name, last name, email, subject, message" }
				),
			};
		}

		// Check if required properties are empty
		if (
			data.firstName === "" ||
			data.lastName === "" ||
			data.email === "" ||
			data.subject === "" ||
			data.message === ""
		) {
			return {
				statusCode: 400,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ error: "None of the properties can be empty" }),
			};
		}

		// Check if required properties are of the correct type
		if (
			typeof data.firstName !== "string" ||
			typeof data.lastName !== "string" ||
			typeof data.email !== "string" ||
			typeof data.subject !== "string" ||
			typeof data.message !== "string"
		) {
			return {
				statusCode: 400,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ error: "All properties must be of type string" }),
			};
		}

		const emailBody = data.attachment === "" ?
			contactEmailBody(
				data.firstName,
				data.lastName,
				data.email,
				data.subject,
				data.message,
			) :
			contactEmailBodyAttachment(
				data.firstName,
				data.lastName,
				data.email,
				data.subject,
				data.message,
				data.attachment
			)
		;

		// Set up the email parameters
		const params = {
			Destination: {
				ToAddresses: [ "support@onfireathletes.com" ],
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
					Data: "You have received a message from the OnFireAthletes site",
				},
			},
			Source: "OnFire Contact Form <mail@zenithsoftware.dev>",
		};

		console.log("Sending email ");

		// Create the promise and SES service object
		const sendPromise = new SES({ apiVersion: "2010-12-01" }).sendEmail(params).promise();

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
			console.error("The following error occurred when sending the email: ");
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
};
