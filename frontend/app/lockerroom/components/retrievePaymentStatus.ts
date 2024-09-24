import { apiEndpoints } from "@backend/EnvironmentManager/EnvironmentManager";

/**
 *
 * Retrieves the status of a given payment intent
 *
 * @returns the payment status
 *
 */
export async function retrievePaymentStatus(paymentID : string | null) {
	try {
		const myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");

		const raw = JSON.stringify({
			client: paymentID,
		});

		const requestOptions = {
			method: "POST",
			headers: myHeaders,
			body: raw,
		};
		const response = await fetch(apiEndpoints.retrievePaymentStatus(), requestOptions); // change to prod

		const data = await response.json();

		return data.status;
	} catch (error) {
		console.error("Error fetching cards:", error);
		throw error;
	}
}
