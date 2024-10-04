// import { confirmSignUp } from "aws-amplify/auth";
import {
    getWithExpiry,
    setWithExpiry,
} from "@/components/localStorageFunctions";
import { apiEndpoints } from "@backend/EnvironmentManager/EnvironmentManager";
import { RequestRedirect } from "node-fetch";

export enum CardPart {
    EXTERIOR_BORDER = 0,
    INTERIOR_BORDER = 1,
    ACCENT = 2,
    BACKGROUND = 3,
    SIGNATURE = 4,
    PHOTO = 5,
}

export enum PaymentStatus {
    SUCCESS = 1,
    FAILURE = 2,
    PENDING = 3,
    UNKNOWN = 4,
}

export enum TradeStatus {
    TRADE_ONLY = 1,
    SELLABLE = 2,
}

/**
 * Function to get all the parts that can be recolored
 * @returns the array of all the parts that can be recolored
 */
export function allPartsToRecolor(): number[] {
    return Object.keys(CardPart)
        .map(Number)
        .filter((value) => {
            return !Number.isNaN(value);
        });
}

export default class TradingCardInfo {
    uuid: string;
    generatedBy: string;
    cardImage: string;
    cardBackS3URL: string;
    stepNumber: number;
    totalCreated: number;
    currentlyAvailable: number;
    createdAt: number;
    price: number;
    inputDisabled: boolean;
    // Step 1: Your Information
    cardType: string; // "a" or "b"
    firstName: string;
    lastName: string;
    number: string;
    sport: string;
    position: string;
    careerLevel: string;
    teamName: string;
    // Step 2: Upload Media
    frontPhotoURL: string;
    frontPhotoS3URL: string;
    frontPhotoWidth: number;
    frontPhotoHeight: number;
    heroXOffset: number;
    heroYOffset: number;
    heroWidth: number;
    cardForegroundS3URL: string;
    cardBackgroundS3URL: string;
    signature: string; // Assuming this is going to be an S3 link or something
    signatureS3URL: string;
    signatureXOffset: number;
    signatureYOffset: number;
    signatureWidth: number;
    backVideoURL: string;
    backVideoS3URL: string;
    backVideoXOffset: number;
    backVideoYOffset: number;
    backVideoWidth: number;
    backVideoHeight: number;
    backVideoRotation: number;
    // Step 4: Border/Background/Position/Team Colors
    borderColor: string;
    backgroundAccentColor: string;
    backgroundMainColor: string;
    topCardTextColor: string;
    backgroundTextColor: string;
    selectedBackground: number;
    // Step 5: Finalization
    NFTDescription: string; // Not an NFT? NORMAL FREAKING TRADINGCARD DESCRIPTION
    firstNameSolid: boolean;
    lastNameSolid: boolean;
    nameFont: string;
    nameColor: string;
    numberColor: string;
    signatureColor: string; // hex color
    partsToRecolor: number[];
    frontIsShowing: boolean;
    submitted: boolean;
    paymentStatus: PaymentStatus;
    tradeStatus: TradeStatus;

    /**
     * Constructor for the TradingCardInfo class
     */
    constructor(options?: {
        uuid?: string;
        generatedBy?: string;
        cardImage?: string;
        cardBackS3URL?: string;
        stepNumber?: number;
        totalCreated?: number;
        currentlyAvailable?: number;
        createdAt?: number;
        price?: number;
        // Step 1: Your Information
        cardType?: string; // "a" or "b"
        firstName?: string;
        lastName?: string;
        number?: string;
        sport?: string;
        position?: string;
        careerLevel?: string;
        teamName?: string;
        // Step 2: Upload Media
        frontPhotoURL?: string;
        frontPhotoS3URL?: string;
        frontPhotoWidth?: number;
        frontPhotoHeight?: number;
        heroXOffset?: number;
        heroYOffset?: number;
        heroWidth?: number;
        cardForegroundS3URL?: string;
        cardBackgroundS3URL?: string;
        signature?: string;
        signatureS3URL?: string;
        signatureXOffset?: number;
        signatureYOffset?: number;
        signatureWidth?: number;
        backVideoURL?: string;
        backVideoS3URL?: string;
        backVideoXOffset?: number;
        backVideoYOffset?: number;
        backVideoWidth?: number;
        backVideoHeight?: number;
        backVideoRotation?: number;
        // Step 4: Border/Background/Position/Team Colors
        borderColor?: string;
        backgroundAccentColor?: string;
        backgroundMainColor?: string;
        topCardTextColor?: string;
        backgroundTextColor?: string;
        selectedBackground?: number;
        // Step 5: Finalization
        NFTDescription?: string; // Not an NFT? NORMAL FREAKING TRADINGCARD DESCRIPTION
        firstNameSolid?: boolean;
        lastNameSolid?: boolean;
        nameFont?: string;
        nameColor?: string;
        numberColor?: string;
        signatureColor?: string; // hex color
        partsToRecolor?: number[];
        isFlipped?: boolean;
        submitted?: boolean;
        paymentStatus?: PaymentStatus;
        tradeStatus?: TradeStatus;
    }) {
        this.uuid = options?.uuid || "";
        this.generatedBy = options?.generatedBy || "";
        this.cardImage = options?.cardImage || "";
        this.cardBackS3URL = options?.cardBackS3URL || "";
        this.stepNumber = options?.stepNumber || 1;
        this.totalCreated = options?.totalCreated || 0;
        this.currentlyAvailable = options?.currentlyAvailable || 0;
        this.createdAt = Math.floor(options?.createdAt || Date.now() / 1000);
        this.price = options?.price || 0;
        this.inputDisabled = true;
        this.cardType = options?.cardType || "";
        this.firstName = options?.firstName || "";
        this.lastName = options?.lastName || "";
        this.number = options?.number || "";
        this.sport = options?.sport || "";
        this.position = options?.position || "";
        this.careerLevel = options?.careerLevel || "";
        this.teamName = options?.teamName || "";
        this.frontPhotoURL = options?.frontPhotoURL || "";
        this.frontPhotoS3URL = options?.frontPhotoS3URL || "";
        this.frontPhotoWidth = options?.frontPhotoWidth || 0;
        this.frontPhotoHeight = options?.frontPhotoWidth || 0;
        this.heroXOffset = options?.heroXOffset || 0;
        this.heroYOffset = options?.heroYOffset || 0;
        this.heroWidth = options?.heroWidth || 350;
        this.cardForegroundS3URL = options?.cardForegroundS3URL || "";
        this.cardBackgroundS3URL = options?.cardBackgroundS3URL || "";
        this.signature = options?.signature || "";
        this.signatureS3URL = options?.signatureS3URL || "";
        this.signatureXOffset = options?.signatureXOffset || 0;
        this.signatureYOffset = options?.signatureYOffset || 0;
        this.signatureWidth = options?.signatureWidth || 150;
        this.backVideoURL = options?.backVideoURL || "";
        this.backVideoS3URL = options?.backVideoS3URL || "";
        this.backVideoXOffset = options?.backVideoXOffset || 0;
        this.backVideoYOffset = options?.backVideoYOffset || 0;
        this.backVideoWidth = options?.backVideoWidth || 1500; // Leaving the original values here as a reference - 350;
        this.backVideoHeight = options?.backVideoHeight || 843.75; // Leaving the original values here as a reference - 196.875;
        this.backVideoRotation = options?.backVideoRotation || 0;
        this.borderColor = options?.borderColor || "#67ca3c";
        // Found a bug in backgroundAccentColor: the initial color in the card creation is significantly darker than the color configured here.
        this.backgroundAccentColor =
            options?.backgroundAccentColor || "#2a2a2a";
        this.backgroundMainColor = options?.backgroundMainColor || "#090909";
        this.topCardTextColor = options?.topCardTextColor || "#FFFFFF";
        this.backgroundTextColor = options?.backgroundTextColor || "#FFFFFF";
        this.selectedBackground = options?.selectedBackground || 1;
        this.signatureColor = options?.signatureColor || "#FFFFFF";
        this.NFTDescription = options?.NFTDescription || "";
        this.firstNameSolid = options?.firstNameSolid ?? true;
        this.lastNameSolid = options?.lastNameSolid ?? false;
        this.nameFont = options?.nameFont || "Uniser-Bold";
        this.nameColor = options?.nameColor || "#FFFFFF";
        this.numberColor = options?.numberColor || "#67ca3c";
        this.frontIsShowing = options?.isFlipped || true;
        this.submitted = options?.submitted || false;
        this.paymentStatus = options?.paymentStatus || PaymentStatus.UNKNOWN;
        this.tradeStatus = options?.tradeStatus || TradeStatus.TRADE_ONLY;

        // Really complicated way to ensure that this array is populated with all the values of the enum
        this.partsToRecolor = allPartsToRecolor();
    }

    /**
     * Converts the TradingCardInfo object to a string so you can see all its attributes
     */
    static showInfo(cardInfo: TradingCardInfo): string {
        return `
			uuid: ${cardInfo.uuid}
			generatedBy: ${cardInfo.generatedBy}
			cardImage: ${cardInfo.cardImage.substring(0, 100)}
			cardBackS3URL: ${cardInfo.cardBackS3URL.substring(0, 100)}
			stepNumber: ${cardInfo.stepNumber}
			totalCreated: ${cardInfo.totalCreated}
			currentlyAvailable: ${cardInfo.currentlyAvailable}
			createdAt: ${cardInfo.createdAt}
			price: ${cardInfo.price}
			inputDisabled: ${cardInfo.inputDisabled}
			cardType: ${cardInfo.cardType}
			firstName: ${cardInfo.firstName}
			lastName: ${cardInfo.lastName}
			number: ${cardInfo.number}
			sport: ${cardInfo.sport}
			position: ${cardInfo.position}
			careerLevel: ${cardInfo.careerLevel}
			teamName: ${cardInfo.teamName}
		
			frontPhotoURL: ${cardInfo.frontPhotoURL.substring(0, 100)}
			frontPhotoWidth: ${cardInfo.frontPhotoWidth}
			frontPhotoHeight: ${cardInfo.frontPhotoHeight}
			heroXOffset: ${cardInfo.heroXOffset}
			heroYOffset: ${cardInfo.heroYOffset}
			heroWidth: ${cardInfo.heroWidth}
			cardForegroundS3URL: ${cardInfo.cardForegroundS3URL}
			cardBackgroundS3URL: ${cardInfo.cardBackgroundS3URL}
			backVideoURL: ${cardInfo.backVideoURL.substring(0, 100)}
			backVideoS3URL: ${cardInfo.backVideoS3URL}
			backVideoURL: ${cardInfo.backVideoURL.substring(0, 100)}
			backVideoXOffset: ${cardInfo.backVideoXOffset}
			backVideoYOffset: ${cardInfo.backVideoYOffset}
			backVideoWidth: ${cardInfo.backVideoWidth}
			backVideoHeight: ${cardInfo.backVideoHeight}
			backVideoRotation: ${cardInfo.backVideoRotation}
		
			borderColor: ${cardInfo.borderColor}
			backgroundAccentColor: ${cardInfo.backgroundAccentColor}
			backgroundMainColor: ${cardInfo.backgroundMainColor}
			topCardTextColor: ${cardInfo.topCardTextColor}
			backgroundTextColor: ${cardInfo.backgroundTextColor}
			selectedBackground: ${cardInfo.selectedBackground}

			signature: ${cardInfo.signature}
			signatureS3URL: ${cardInfo.signatureS3URL}
			signatureColor: ${cardInfo.signatureColor}
			signatureWidth: ${cardInfo.signatureWidth}
			NFTDescription: ${cardInfo.NFTDescription}

			firstNameSolid: ${cardInfo.firstNameSolid ? "True" : "False"}
			lastNameSolid: ${cardInfo.lastNameSolid ? "True" : "False"}
			nameFont: ${cardInfo.nameFont}
			nameColor: ${cardInfo.nameColor}
			numberColor: ${cardInfo.numberColor}
			isFlipped: ${cardInfo.frontIsShowing}

			partsToRecolor: ${cardInfo.partsToRecolor}
			submitted: ${cardInfo.submitted}
			paid: ${cardInfo.paymentStatus}
			tradeStatus: ${cardInfo.tradeStatus}
			`;
    }

    /**
     *
     * A function to submit a card to the backend
     *
     * @param cardInfo The TradingCardInfo object to submit
     * @param user_id The user's id
     * @param renameMedia A boolean to determine if the media should be renamed
     * @returns The TradingCardInfo object that was submitted
     */
    static async submitCard(
        cardInfo: TradingCardInfo,
        user_id: string,
        renameMedia: boolean = true,
    ): Promise<TradingCardInfo> {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        // Check if the front photo S3 URL is empty, if it is, use the front photo URL
        if (
            cardInfo.frontPhotoS3URL === undefined ||
            cardInfo.frontPhotoS3URL === ""
        ) {
            if (
                cardInfo.frontPhotoURL !== undefined &&
                cardInfo.frontPhotoURL !== ""
            ) {
                cardInfo.frontPhotoS3URL = cardInfo.frontPhotoURL;
            }
        }

        // Check if the back video S3 URL is empty, if it is, use the back video URL
        if (
            cardInfo.backVideoS3URL === undefined ||
            cardInfo.backVideoS3URL === ""
        ) {
            if (
                cardInfo.backVideoURL !== undefined &&
                cardInfo.backVideoURL !== ""
            ) {
                cardInfo.backVideoS3URL = cardInfo.backVideoURL;
            } else {
                cardInfo.backVideoS3URL =
                    "https://onfireathletes-media-uploads.s3.amazonaws.com/";
            }
        }

        // Check if the card back image S3 URL is empty, if it is, use the card back image URL
        if (
            cardInfo.cardBackS3URL === undefined ||
            cardInfo.cardBackS3URL === ""
        ) {
            if (
                cardInfo.cardBackS3URL !== undefined &&
                cardInfo.cardBackS3URL !== ""
            ) {
                cardInfo.cardBackS3URL = cardInfo.cardBackS3URL;
            }
        }

        let frontPhotoS3URL = cardInfo.frontPhotoS3URL;
        let backVideoS3URL = cardInfo.backVideoS3URL;
        let cardBackImageS3URL = cardInfo.cardBackS3URL;

        // If the card is being submitted for the first time, rename the media
        if (renameMedia) {
            // change the name of the S3 objects uploaded for this card
            const frontPhotoKey = cardInfo.frontPhotoS3URL.split(
                "https://onfireathletes-media-uploads.s3.amazonaws.com/",
            )[1];
            const backVideoKey = cardInfo.backVideoS3URL.split(
                "https://onfireathletes-media-uploads.s3.amazonaws.com/",
            )[1];
            const cardBackImageKey = cardInfo.cardBackS3URL.split(
                "https://onfireathletes-media-uploads.s3.amazonaws.com/",
            )[1];

            const newURLs = await TradingCardInfo.renameMedia(
                user_id,
                frontPhotoKey,
                backVideoKey,
                cardBackImageKey,
            );

            // replace image url with the new url the update succeeded
            if (newURLs.cardImage !== undefined && newURLs.cardImage !== "") {
                frontPhotoS3URL = `https://onfireathletes-media-uploads.s3.amazonaws.com/${newURLs.cardImage}`;
            }

            // replace video url with the new url the update succeeded
            if (newURLs.video !== undefined && newURLs.video !== "") {
                backVideoS3URL = `https://onfireathletes-media-uploads.s3.amazonaws.com/${newURLs.video}`;
            }

            // replace card back image url with the new url the update succeeded
            if (
                newURLs.cardBackImage !== undefined &&
                newURLs.cardBackImage !== ""
            ) {
                cardBackImageS3URL = `https://onfireathletes-media-uploads.s3.amazonaws.com/${newURLs.cardBackImage}`;
            }
        }

        // Change some variables to be the new S3 URLs
        cardInfo.submitted = true;
        cardInfo.generatedBy = user_id;
        cardInfo.frontPhotoURL = frontPhotoS3URL;
        cardInfo.backVideoURL = backVideoS3URL;
        cardInfo.cardBackS3URL = cardBackImageS3URL;
        cardInfo.signatureS3URL = cardInfo.signatureS3URL;

        // Stringify the card info
        const raw = JSON.stringify(cardInfo);

        console.log("RAW", raw);

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow" as RequestRedirect,
        };

        // Test with this link, but please comment to change this link to the real one before merged
        const savedCard = await (
            await fetch(apiEndpoints.createCard(), requestOptions)
        ).json();

        console.log("savedCard");

        TradingCardInfo.saveCard(savedCard);

        return savedCard;
    }

    /**
     *
     * A function to save a card to local storage
     *
     * @param cardInfo The TradingCardInfo object to save
     *
     */
    static saveCard(cardInfo: TradingCardInfo): void {
        // Card information will be stored in local storage for 30 minutes
        setWithExpiry("cardInfo", JSON.stringify(cardInfo), 0.5);
    }

    /**
     *
     * A function to load a card from local storage
     *
     */
    static loadCard(): TradingCardInfo {
        return JSON.parse(getWithExpiry("cardInfo"));
    }

    /**
     *
     * A function to test if a card is in local storage
     *
     */
    static cardExistsInLocalStorage(): boolean {
        return getWithExpiry("cardInfo") !== null;
    }

    /**
     *
     * A function to clear the card from local storage
     *
     */
    static clearCard(): void {
        localStorage.removeItem("cardInfo");
    }

    /**
     * A function to rename the media in the S3 bucket with the user's id
     *
     * @param user_id The user's id
     * @param oldKeyNames The old key names of the media (video and image. ex: image/123456.jpg, video/123456.mp4)
     *
     * @returns void
     */
    static async renameMedia(
        user_id: string,
        oldCardImageKey: string,
        oldVideoKey: string,
        oldCardBackImageKey: string,
    ): Promise<{ video: string; cardImage: string; cardBackImage: string }> {
        const returnVal = { video: "", cardImage: "", cardBackImage: "" };

        const renameURLHeaders = new Headers();
        renameURLHeaders.append("Content-Type", "application/json");

        const renameURLRaw = JSON.stringify({
            userId: user_id,
            cardImage: oldCardImageKey,
            video: oldVideoKey,
            cardBackImage: oldCardBackImageKey,
        });

        const renameURLRequestOptions = {
            method: "POST",
            headers: renameURLHeaders,
            body: renameURLRaw,
            redirect: "follow" as RequestRedirect,
        };

        try {
            await fetch(apiEndpoints.renameMedia(), renameURLRequestOptions)
                .then((response) => {
                    return response.json();
                })
                .then((result) => {
                    returnVal.cardImage =
                        result.cardImage !== "" ? result.cardImage : "";
                    returnVal.video = result.video !== "" ? result.video : "";
                    returnVal.cardBackImage =
                        result.cardBackImage !== "" ? result.cardBackImage : "";

                    return returnVal;
                })
                .catch((error) => {
                    console.error(error);
                    returnVal.cardImage = "";
                    returnVal.video = "";
                    returnVal.cardBackImage = "";
                });
        } catch (error) {
            console.error(error);
            returnVal.cardImage = "";
            returnVal.video = "";
            returnVal.cardBackImage = "";
        }

        return Promise.resolve(returnVal);
    }
}
