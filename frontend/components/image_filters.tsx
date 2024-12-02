import { apiEndpoints } from "@backend/EnvironmentManager/EnvironmentManager";
import Jimp from "jimp";
import JPEG from "jpeg-js";
import { RequestRedirect } from "node-fetch";
// SAMPLE USAGE:
/*
	const [ maskTest, setMaskTest ] = useState("");

	applyMask("/card_assets/3k.jpg", "/card_assets/card-mask.png").then((result) => {
		if (result) {
			setMaskTest(result);
		}
	});
*/

// add support for very large image files in jimp
Jimp.decoders["image/jpeg"] = (data) => {
    return JPEG.decode(data, {
        maxMemoryUsageInMB: 1000,
    });
};

/**
 * Takes in an image and tints the image with the given color
 * Uses the mix function from Jimp to tint the image
 * @param image
 * @param color
 */
export async function tint(
    imageString: string,
    color: string,
    inHeader: Headers,
    useAPI: boolean,
    inverted?: boolean,
): Promise<string> {
    const shouldBeInverted = inverted ? inverted : false;

    const image = await Jimp.read(imageString);
    // Verify window type (results in  file not found otherwise)
    if (typeof window == "undefined") {
        return "";
    }

    if (useAPI && false) {
        const imagebase64 = await image.getBase64Async(Jimp.MIME_PNG);
        const removedPrefixBase64 = imagebase64.split(",")[1];

        const body = JSON.stringify({
            imageData: removedPrefixBase64,
            hexColor: color,
            inverted: shouldBeInverted,
        });

        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        const req = {
            method: "POST",
            headers: headers,
            body: body,
            redirect: "follow" as RequestRedirect,
        };

        return fetch(apiEndpoints.sharptint(), req)
            .then((response) => {
                return response.json();
            })
            .then((result) => {
                return `data:image/png;base64,${result.imageData}`;
            })
            .catch((error) => {
                return `error: ${error}`;
            });
    }

    // Change the color of the image
    const recolored = await image
        .color([{ apply: "mix", params: [color, 50] }])
        .getBase64Async(Jimp.MIME_PNG);
    if (recolored) {
        return recolored;
    }
    return "DIDNT RECOLOR";
}

/**
 * Takes in an image and completely recolors the image with the given color
 * Any pixel in the image gets replaced by the given color
 * @param image
 * @param color
 */
export async function recolor(
    imageString: string,
    color: string,
    inHeader: Headers | undefined,
    useAPI: boolean,
): Promise<string> {
    const image = await Jimp.read(imageString);
    // Verify window type (results in  file not found otherwise)
    if (typeof window == "undefined" || imageString == "") {
        return "";
    }
    if (useAPI && false) {
        const imagebase64 = await image.getBase64Async(Jimp.MIME_PNG);
        const removedPrefixBase64 = imagebase64.split(",")[1];

        const body = JSON.stringify({
            imageData: removedPrefixBase64,
            hexColor: color,
        });

        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        const req = {
            method: "POST",
            headers: headers,
            body: body,
            redirect: "follow" as RequestRedirect,
        };

        return fetch(apiEndpoints.sharprecolor(), req)
            .then((response) => {
                const text = response.json();
                return text;
            })
            .then((result) => {
                return `data:image/png;base64,${result.imageData}`;
            })
            .catch((error) => {
                console.error(error);
                return `error: ${error}`;
            });
    }

    // Change the color of the image
    const recolored = await image
        .color([{ apply: "mix", params: [color, 100] }])
        .getBase64Async(Jimp.MIME_PNG);

    if (recolored) {
        return recolored;
    }
    return "DIDNT RECOLOR";
}

/**
 * Takes in an image and applies a mirror to the image
 * @param b64Image the base64 image to mirror
 * @returns the base64 image of the mirrored image
 */
export async function flipImageHorizontally(b64Image: string): Promise<string> {
    try {
        const image = await Jimp.read(b64Image);

        // Flip the image horizontally
        image.flip(true, false);

        // Get the base64 string of the flipped image
        const flippedBase64 = await image.getBase64Async(Jimp.MIME_PNG);

        // Remove the data URL part and return only the base64 string
        return flippedBase64;
    } catch (error) {
        throw new Error(`Error flipping image: ${error}`);
    }
}

/** Should be similar to applying a layer mask to an image
 * Takes in two images and applies the second image as a mask to the first image
 */
export async function maskImageToCard(
    imagePath: string,
    maskPath: string,
): Promise<string> {
    // Verify window type (results in  file not found otherwise)
    if (typeof window == "undefined") {
        return "";
    }

    const image = await Jimp.read(imagePath);
    const mask = await Jimp.read(maskPath);

    // Resize the image to be the same size as the mask
    // image.cover(mask.bitmap.width, mask.bitmap.height);

    // Apply the mask to the image
    const masked = await image
        .mask(
            mask,
            image.bitmap.width - mask.bitmap.width,
            image.bitmap.height - mask.bitmap.height,
        )
        .getBase64Async(Jimp.MIME_PNG);

    return masked ? masked : "";
}

/**
 * Takes in an image and resizes the image to the given width and height
 * @param imageString
 * @param width
 * @param height
 */
export async function resize(
    imageString: string,
    width: number | null,
    height: number | null,
): Promise<string> {
    // Verify window type (results in  file not found otherwise)
    if (typeof window == "undefined") {
        return "";
    }

    const image = await Jimp.read(imageString);

    // Resize the image
    const resized = await image
        .resize(width ? width : Jimp.AUTO, height ? height : Jimp.AUTO)
        .getBase64Async(Jimp.MIME_PNG);

    return resized ? resized : "";
}
