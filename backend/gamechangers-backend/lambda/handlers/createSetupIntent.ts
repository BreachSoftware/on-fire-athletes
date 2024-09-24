import { Handler, APIGatewayProxyResult, APIGatewayProxyEvent } from "aws-lambda";
import { sendResponse } from "../utils/responseFunctions";
import "dotenv/config";
import { Environment, environmentManager } from "../../EnvironmentManager/EnvironmentManager";

// Initialize Stripe with your secret key
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-process-env
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
	apiVersion: "2022-08-01",
});

// Gamechangers keys
const STRIPE_PUBLIC_KEY = environmentManager.getApiStage() == Environment.Production ?
	"pk_live_51PssXyCEBFOTy6pM9DfyGbI7JZUqMoClqRVuFCEAVamp10DYl2O48SqCjiw7vSbeiv8CCmYPZwSgguOTCcJzbY0u00cwKkUFDZ" :
	"pk_test_51PssXyCEBFOTy6pMtubViKDQwVSljNAJRQAk5SkRyexPECtx4w8R3IHLQtI7CSNG1g7hSFk044Pc0STSYtxEWmSW00Y4VLvPII";

/**
 * Creates a setup intent for saving payment details
 */
// eslint-disable-next-line func-style
export const createSetupIntent: Handler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

	const data = JSON.parse(event.body as string);

	// Validation
	if (data.customerId === undefined) {
		return sendResponse(400, { error: "The request body must contain the customerId property" });
	} else if (data.customerId === "") {
		return sendResponse(400, { error: "The customerId property cannot be empty" });
	} else if (typeof data.customerId !== "string") {
		return sendResponse(400, { error: "The customerId property must be of type string" });
	}

	try {
		const setupIntent = await stripe.setupIntents.create({
			customer: data.customerId,
			payment_method_types: [ "card" ],
			usage: "on_session"
		});

		// Send publishable key and SetupIntent details to client
		return {
			statusCode: 200,
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				publishableKey: STRIPE_PUBLIC_KEY,
				setupIntent: setupIntent,
			}),
		};
	} catch (e) {
		// Display error on client
		return {
			statusCode: 500,
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ error: e.message }),
		};
	}
};
