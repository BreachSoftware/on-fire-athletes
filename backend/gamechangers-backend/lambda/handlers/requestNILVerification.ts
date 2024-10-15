import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { requestNILVerificationEmailBody } from "../utils/requestNILVerificationEmailBody";
import { emailTemplate } from "../utils/emailHtml";
import { SES } from "aws-sdk";

/**
 * Requests a NIL verification for a user.
 *
 * @param {APIGatewayProxyEvent} event - The API Gateway proxy event.
 * @returns {Promise<APIGatewayProxyResult | undefined>} The API Gateway proxy result.
 */
export async function requestNILVerification(
	event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult | undefined> {
	if (!event.body) {
		return {
			statusCode: 500,
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ error: "An unknown error occurred." }),
		};
	}

	const data = JSON.parse(event.body as string);

	if (
		!data.firstName ||
		!data.lastName ||
		!data.email ||
		!data.schoolName ||
		!data.instagram ||
		!data.twitter
	) {
		return {
			statusCode: 400,
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				error: "The request body must contain the first name, last name, email, school name, and social links.",
			}),
		};
	}

	const emailBody = requestNILVerificationEmailBody(
		data.firstName,
		data.lastName,
		data.email,
		data.schoolName,
		data.instagram,
		data.twitter,
	);

	// Set up the email parameters
	const params = {
		Destination: {
			ToAddresses: ["george@breachsoftware.com"],
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
		Source: "Gamechangers Team <matthew@breachsoftware.com>",
		ReplyToAddresses: ["matthew@breachsoftware.com"],
	};

	const sendPromise = new SES({ apiVersion: "2010-12-01" })
		.sendEmail(params)
		.promise();

	try {
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
		console.error("Error sending email: ", error);
		return {
			statusCode: 500,
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ error: "An unknown error occurred." }),
		};
	}
}
