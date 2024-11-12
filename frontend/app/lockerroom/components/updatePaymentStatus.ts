import { getCard } from "@/app/generate_card_asset/cardFunctions";
import { apiEndpoints } from "@backend/EnvironmentManager/EnvironmentManager";

/**
 *
 * Updates a card's payment status to the given status
 *
 * @returns The result of the API call
 *
 */
export async function updatePaymentStatus(
    generatedBy: string,
    card_uuid: string,
    paymentStatus: number,
    isNil: boolean,
) {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            generatedBy: generatedBy,
            uuid: card_uuid,
            paymentStatus: paymentStatus,
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
        };

        let paymentStatusData: any;

        if (!isNil) {
            const response = await fetch(
                apiEndpoints.updatePaymentStatus(),
                requestOptions,
            ); // change to prod
            paymentStatusData = await response.json();
        }

        // Get the card data from the card whose payment status was updated
        const cardData = await getCard(card_uuid, generatedBy);

        const serialsToCreate = isNil ? 50 : cardData.totalCreated;

        // Make serialized cards in DynamoDB
        for (let i = 0; i < serialsToCreate; i++) {
            const cardSerializationOptions = {
                method: "POST",
                headers: myHeaders,
                body: JSON.stringify({
                    uuid: cardData.uuid,
                    serialNumber: i + 1, // Serial numbers start at 1
                    generatedBy: cardData.generatedBy,
                }),
            };
            // Create serialized cards in DynamoDB
            await fetch(
                apiEndpoints.createSerializedCard(),
                cardSerializationOptions,
            );
        }

        // Update the amount of cards available
        const updateAvailableCardsOptions = {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify({
                uuid: cardData.uuid,
                generatedBy: cardData.generatedBy,
                totalCreated: cardData.totalCreated,
                currentlyAvailable: cardData.totalCreated,
            }),
        };
        await fetch(
            apiEndpoints.updateTotalCards(),
            updateAvailableCardsOptions,
        );

        return paymentStatusData;
    } catch (error) {
        console.error("Error updating paymentStatus:", error);
        throw error;
    }
}
