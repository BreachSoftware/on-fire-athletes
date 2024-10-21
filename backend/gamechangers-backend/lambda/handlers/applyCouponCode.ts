import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult,
    Handler,
} from 'aws-lambda'
import { sendResponse } from '../utils/responseFunctions'
import 'dotenv/config'

// eslint-disable-next-line @typescript-eslint/no-var-requires, no-process-env
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-08-01',
})

/**
 * Creates a new customer.
 * @param event - The API Gateway event object.
 * @returns A promise that resolves to the API Gateway proxy result.
 */
// eslint-disable-next-line func-style
export const applyCouponCode: Handler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    const data = JSON.parse(event.body as string)

    // Create a new customer
    const existingCouponResponse = await stripe.promotionCodes.list({
        active: true,
        code: data.code,
        limit: 1,
    })
    console.log(existingCouponResponse)

    if (existingCouponResponse.data.length > 0) {
        return sendResponse(200, existingCouponResponse.data[0])
    }
    return sendResponse(500, {
        error: 'Coupon not found',
    })
}
