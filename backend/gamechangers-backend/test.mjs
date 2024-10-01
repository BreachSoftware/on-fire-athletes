import Stripe from 'stripe'

go()

async function go() {
    console.log(`Starting test - stripe key - ${process.env.STRIPE_SECRET_KEY}`)

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
        apiVersion: '2024-04-10',
    })
    // const data = JSON.parse(event.body as string);
    const data = { email: 'mjieyoub@gmail.com', name: 'Matthew Ieyoub' }

    // Validation
    if (data.email === undefined || data.name === undefined) {
        throw Error('1')
        // return sendResponse(400, {
        //     error: 'The request body must contain the email and name properties',
        // })
    } else if (data.email === '' || data.name === '') {
        throw Error('2')
        // return sendResponse(400, {
        //     error: 'The email and name properties cannot be empty',
        // })
    } else if (
        typeof data.email !== 'string' ||
        typeof data.name !== 'string'
    ) {
        throw Error('3')
        // return sendResponse(400, {
        //     error: 'The email and name properties must be of type string',
        // })
    }

    // Create a new customer
    const customer = await stripe.customers.create({
        email: data.email,
        name: data.name,
    })
    if (customer) {
        console.log(`Customer created - ${customer.id}`)
        return
    }
    throw Error('4')
    // return sendResponse(500, {
    //     error: 'An error occurred while creating the customer',
    // })
}
