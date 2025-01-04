import TradingCardInfo from "@/hooks/TradingCardInfo";
import { apiEndpoints } from "@backend/EnvironmentManager/EnvironmentManager";

/**
 * Fetches the card from the backend
 *
 * @param uuid: string - The UUID of the card
 * @param generatedBy: string - The UUID of the user who generated the card
 * @returns The card object
 */
export async function getCard(uuid: string, generatedBy?: string) {
    try {
        const apiUrl = new URL(apiEndpoints.getCard());
        apiUrl.searchParams.set("uuid", uuid);
        if (generatedBy) {
            apiUrl.searchParams.set("generatedBy", generatedBy);
        }

        const response = await fetch(apiUrl.toString());
        const data = await response.json();

        return new TradingCardInfo({
            ...data,
        });
    } catch (error) {
        console.error("Error fetching cards:", error);
        throw error;
    }
}

/**
 * An async function to load the card back image
 * @param src the b64 image
 * @returns the Image object
 */
export async function loadImageObject(src: string) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            return resolve(img);
        };
        img.onerror = reject;
        img.crossOrigin = "anonymous";
    });
}

/**
 * Fetches the card back from the backend
 *
 * @returns The card back image as an Image element
 **/
export async function getCardBack(): Promise<HTMLImageElement> {
    // This will just return the proper S3 image for now
    return loadImageObject(
        "https://onfireathletes-media-uploads.s3.amazonaws.com/mind-ar/OnFireCardBack.png",
    ) as Promise<HTMLImageElement>;
}
