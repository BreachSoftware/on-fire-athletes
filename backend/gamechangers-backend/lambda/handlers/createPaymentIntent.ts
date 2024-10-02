/* eslint-disable func-style */
import {
    Handler,
    APIGatewayProxyEvent,
    APIGatewayProxyResult,
} from 'aws-lambda'
import { sendResponse } from '../utils/responseFunctions'
import 'dotenv/config'
import {
    Environment,
    environmentManager,
} from '../../EnvironmentManager/EnvironmentManager'

// eslint-disable-next-line @typescript-eslint/no-var-requires, no-process-env
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-08-01',
})

// Gamechangers keys
const STRIPE_PUBLIC_KEY =
    environmentManager.getApiStage() == Environment.Production
        ? 'pk_live_51PssXyCEBFOTy6pM9DfyGbI7JZUqMoClqRVuFCEAVamp10DYl2O48SqCjiw7vSbeiv8CCmYPZwSgguOTCcJzbY0u00cwKkUFDZ'
        : 'pk_test_51PssXyCEBFOTy6pMtubViKDQwVSljNAJRQAk5SkRyexPECtx4w8R3IHLQtI7CSNG1g7hSFk044Pc0STSYtxEWmSW00Y4VLvPII'

/**
 * Creates or retrieves a customer.
 * @param customerId The customer ID
 * @returns The customer
 */
async function createOrRetrieveCustomer(
    customerId: string | undefined
): Promise<string> {
    if (customerId) {
        // Retrieve existing customer
        return await stripe.customers.retrieve(customerId)
    }
    // Create a new customer
    return await stripe.customers.create()
}

/**
 * Attaches a payment method to a customer.
 * @param paymentMethodId - The payment method ID
 * @param customerId - The customer ID
 * @returns The attached payment method
 */
async function attachPaymentMethodToCustomer(
    paymentMethodId: string,
    customerId: string
): Promise<void> {
    return await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
    })
}

/**
 * Creates a payment intent for a new payment.
 */
export const createPaymentIntent: Handler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    const data = JSON.parse(event.body as string)

    // Validation
    if (
        data.paymentMethodId === undefined ||
        data.customerId === undefined ||
        data.cost === undefined
    ) {
        return sendResponse(400, {
            error: 'The request body must contain the paymentMethodId, customerId, and cost properties',
        })
    } else if (data.paymentMethodId === '' || data.customerId === '') {
        return sendResponse(400, {
            error: 'The paymentMethodId and customerId properties cannot be empty',
        })
    } else if (data.cost <= 0) {
        return sendResponse(400, {
            error: 'The cost property must be greater than 0',
        })
    } else if (
        typeof data.paymentMethodId !== 'string' ||
        typeof data.customerId !== 'string'
    ) {
        return sendResponse(400, {
            error: 'The paymentMethodId and customerId properties must be of type string',
        })
    } else if (typeof data.cost !== 'number') {
        return sendResponse(400, {
            error: 'The cost property must be of type number',
        })
    }

    try {
        // Attach payment method to the customer
        const customer = await createOrRetrieveCustomer(data.customerId)
        console.log(customer)

        // Attach the payment method to the customer
        await attachPaymentMethodToCustomer(
            data.paymentMethodId,
            data.customerId
        )

        const paymentIntent = await stripe.paymentIntents.create({
            currency: 'USD',
            amount: data.cost,
            customer: data.customerId,
            payment_method: data.paymentMethodId,
            automatic_payment_methods: { enabled: true },
        })
        // Send publishable key and PaymentIntent details to client
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                publishableKey: STRIPE_PUBLIC_KEY,
                paymentIntent: paymentIntent,
            }),
        }
    } catch (e) {
        // Display error on client
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ error: (e as Error).message }),
        }
    }
}
