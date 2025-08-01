import TradingCardInfo from "@/hooks/TradingCardInfo";

export const PREFILLED_TRADING_CARD: TradingCardInfo = {
    uuid: "6a6b7e50-839d-4d36-bb55-94ec4b4d9528",
    generatedBy: "3498a478-6021-70ca-5fd7-5d341bc0ef18",
    cardImage:
        "https://onfireathletes-media-uploads.s3.amazonaws.com/card/lyt3lpi0kt-1736357853308.png",
    cardBackS3URL:
        "https://onfireathletes-media-uploads.s3.amazonaws.com/card-back/3498a478-6021-70ca-5fd7-5d341bc0ef18-1736357904.png",
    stepNumber: 5,
    totalCreated: 0,
    currentlyAvailable: 0,
    createdAt: 1736357643,
    price: 0,
    inputDisabled: false, // Added for completeness since it was missing in the provided data

    // Step 1: Your Information
    cardType: "b",
    firstName: "Ryan",
    lastName: "Ieyoub",
    number: "", // No value provided
    sport: "Esports",
    position: "Super Smash Bros: Ultimate",
    careerLevel: "Professional",
    teamName: "Baton Rouge",
    // Step 2: Upload Media
    frontPhotoURL:
        "https://onfireathletes-media-uploads.s3.amazonaws.com/image/3498a478-6021-70ca-5fd7-5d341bc0ef18-1736357904.png",
    frontPhotoS3URL: "",
    frontPhotoWidth: 958,
    frontPhotoHeight: 887,
    heroXOffset: 6,
    heroYOffset: 106,
    heroWidth: 228,
    cardForegroundS3URL: "",
    cardBackgroundS3URL: "",
    signature: "",
    signatureS3URL: "",
    signatureXOffset: 0,
    signatureYOffset: 0,
    signatureWidth: 150,
    backVideoURL: "https://onfireathletes-media-uploads.s3.amazonaws.com/",
    backVideoS3URL: "",
    backVideoXOffset: 0,
    backVideoYOffset: 0,
    backVideoWidth: 1500,
    backVideoHeight: 843.75,
    backVideoRotation: 0,
    // Step 4: Border/Background/Position/Team Colors
    borderColor: "#27CE00",
    backgroundAccentColor: "#2a2a2a",
    backgroundMainColor: "#090909",
    topCardTextColor: "#FFFFFF",
    backgroundTextColor: "#FFFFFF",
    selectedBackground: 1,
    // Step 5: Finalization
    NFTDescription: "Hello I'm Ryan",
    firstNameSolid: true,
    lastNameSolid: false,
    nameFont: "Uniser-Bold",
    nameColor: "#FFFFFF",
    numberColor: "#67ca3c",
    signatureColor: "#FFFFFF",
    partsToRecolor: [],
    frontIsShowing: true,
    submitted: false,
    paymentStatus: 1,
    tradeStatus: 1,
    isNil: false,
    isHorizontal: true,
    cardPrintS3URL: "",
};
