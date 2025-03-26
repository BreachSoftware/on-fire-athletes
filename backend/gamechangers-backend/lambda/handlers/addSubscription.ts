import {
	APIGatewayProxyEvent,
	APIGatewayProxyResult,
	Handler,
} from "aws-lambda";
import { sendResponse } from "../utils/responseFunctions";
import "dotenv/config";
import { dbTables } from "../../EnvironmentManager/EnvironmentManager";
import { DynamoDB } from "aws-sdk";

// eslint-disable-next-line @typescript-eslint/no-var-requires, no-process-env
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
	apiVersion: "2022-08-01",
});

const packagesWithSubscription = ["mvp"];

const mvpPriceId = "price_1QbmQbCEBFOTy6pMk12hCZb7";

export const SECONDS_IN_DAY = 60 * 60 * 24;
export const SECONDS_IN_YEAR = SECONDS_IN_DAY * 365;

// Create an instance of the DynamoDB DocumentClient
const dynamoDb = new DynamoDB.DocumentClient();

/**
 * Creates a new customer.
 * @param event - The API Gateway event object.
 * @returns A promise that resolves to the API Gateway proxy result.
 */
// eslint-disable-next-line func-style
export const addSubscription: Handler = async (
	event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
	console.log(event);

	const data = JSON.parse(event.body as string);

	// Validation
	if (!data.userId || !data.packageName || data.isGmex === undefined) {
		return sendResponse(400, {
			error: "The request body must contain the userId, packageName properties",
		});
	} else if (
		typeof data.userId !== "string" ||
		typeof data.packageName !== "string"
	) {
		return sendResponse(400, {
			error: "The userId and packageName properties must be of type string",
		});
	} else if (!packagesWithSubscription.includes(data.packageName)) {
		return sendResponse(400, {
			error: `The packageName property must be one of the following: ${packagesWithSubscription.join(
				", ",
			)}`,
		});
	}

	// Check for user
	const params = {
		TableName: dbTables.GamechangersUsers(),
		Key: {
			uuid: data.userId,
		},
	};

	const user = await dynamoDb.get(params).promise();

	if (!user) {
		return sendResponse(400, {
			error: "User not found",
		});
	}

	let subscriptionId = null;
	const purchaseTime = Math.round(Date.now() / 1000);
	const trialEnds = purchaseTime + SECONDS_IN_YEAR;

	// Create a new subscription if Stripe purchase
	if (!data.isGmex) {
		const userStripeCustomerId = user.Item?.stripe_customer_id;
		if (!userStripeCustomerId) {
			return sendResponse(400, {
				error: "User does not have a stripe customer",
			});
		}

		const subscriptionResponse = await stripe.subscriptions.create({
			customer: userStripeCustomerId,
			items: [
				{
					price: mvpPriceId,
				},
			],
			trial_period_days: 365,
		});

		subscriptionId = subscriptionResponse.id;
	}

	// Update user base subscription ends
	const updateParams = {
		TableName: dbTables.GamechangersUsers(),
		Key: {
			uuid: data.userId, // Specify the primary key value
		},
		UpdateExpression:
			"set subscription_expires_at = :tEnds, subscription_id = :sId",
		ExpressionAttributeValues: {
			":tEnds": trialEnds,
			":sId": subscriptionId,
		},
	};

	// Update the item in the DynamoDB table
	const updatedUser = await dynamoDb.update(updateParams).promise();

	if (updatedUser) {
		return sendResponse(200, {
			message: "Subscription successful",
			subscription_ends: trialEnds,
		});
	}

	return sendResponse(500, {
		error: "An error occurred while creating the customer",
	});
};
