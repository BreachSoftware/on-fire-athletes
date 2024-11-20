/* eslint-disable func-style */
import {
	Handler,
	APIGatewayProxyEvent,
	APIGatewayProxyResult,
} from "aws-lambda";
import "dotenv/config";

// eslint-disable-next-line @typescript-eslint/no-var-requires, no-process-env
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
	apiVersion: "2022-08-01",
});

// Gamechangers keys
const STRIPE_PUBLIC_KEY =
	"pk_test_51PssXyCEBFOTy6pMtubViKDQwVSljNAJRQAk5SkRyexPECtx4w8R3IHLQtI7CSNG1g7hSFk044Pc0STSYtxEWmSW00Y4VLvPII";
/**
 * Creates a payment intent for a new payment.
 */
export const retrievePaymentStatus: Handler = async (
	event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
	console.log(event);
	if (!event.body) {
		return {
			statusCode: 400,
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ error: "The request body cannot be empty" }),
		};
	}

	const body = JSON.parse(event.body as string);

	console.log(body);

	const paymentIntentClientSecret = body.client as string;

	console.log(paymentIntentClientSecret);

	try {
		const paymentIntent = await stripe.paymentIntents.retrieve(
			paymentIntentClientSecret,
		);

		console.log(paymentIntent);

		// Send publishable key and PaymentIntent details to client
		return {
			statusCode: 200,
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				publishableKey: STRIPE_PUBLIC_KEY,
				paymentIntentID: paymentIntent.id,
				paymentIntent: paymentIntent,
				status: paymentIntent.status,
			}),
		};
	} catch (e) {
		// Display error on client
		return {
			statusCode: 500,
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ error: (e as Error).message }),
		};
	}
};
