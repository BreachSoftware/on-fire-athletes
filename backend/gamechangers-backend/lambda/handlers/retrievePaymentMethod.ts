/* eslint-disable func-style */
import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import "dotenv/config";

// Initialize Stripe with your secret key
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-process-env
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
	apiVersion: "2022-08-01",
});

/**
 * Retrieves the payment method details.
 */
export const retrievePaymentMethod: Handler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	try {
		const { paymentMethodId } = JSON.parse(event.body as string);

		if (!paymentMethodId) {
			return {
				statusCode: 400,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ error: "The request body must contain the paymentMethodId property" }),
			};
		}

		// Retrieve the payment method from Stripe
		const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

		return {
			statusCode: 200,
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ paymentMethod: paymentMethod }),
		};
	} catch (error) {
		return {
			statusCode: 500,
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ error: (error as Error).message }),
		};
	}
};
