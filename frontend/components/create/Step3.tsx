import {
    HStack,
    Divider,
    Text,
    VStack,
    Spacer,
    Spinner,
} from "@chakra-ui/react";
import DropzoneButton from "@/components/create/dropzoneButton";
import { useCurrentCardInfo } from "@/hooks/useCurrentCardInfo";
import { useState, useRef } from "react";
import SignatureModal from "./SignatureModal";
import { resize } from "../image_filters";
import RequestRedirect from "node-fetch";
import { useAuth } from "@/hooks/useAuth";
import { CardPart } from "@/hooks/TradingCardInfo";
import { CheckIcon } from "@chakra-ui/icons";
import { useMediaProcessing, MediaType } from "@/hooks/useMediaProcessing";
import { apiEndpoints } from "@backend/EnvironmentManager/EnvironmentManager";

/**
 * This function converts a base64 string to a blob
 */
export function b64toBlob(base64: string) {
    return fetch(`${base64}`).then((res) => {
        return res.blob();
    });
}

/**
 *  This function checks if the signature should be shown
 * @param signature
 * @returns
 */
export function shouldShow(signature: string) {
    if (signature === "" || signature === undefined) {
        return false;
    }

    return signature.charAt(0) === "d";
}

/**
 *
 * Uploads a given file to S3
 *
 * @param filename The filename to upload to S3
 * @param blob The blob to upload to S3
 *
 */
export async function uploadAssetToS3(
    filename: string,
    asset: File | Blob,
    mediatype: string,
    filetype: string,
) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        mediatype: mediatype,
        filename: filename,
        filetype: filetype,
    });

    const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow" as RequestRedirect,
    };

    const presignedURL = await fetch(
        apiEndpoints.media_generatePresignedURL(),
        requestOptions,
    );

    const presignedURLJSON = await presignedURL.json();

    const presignedURLString = presignedURLJSON.url;

    // If the asset is a File, convert it to a Blob
    if (asset instanceof File) {
        // eslint-disable-next-line no-param-reassign
        asset = new Blob([asset], { type: filetype });
    }
    await fetch(presignedURLString, {
        method: "PUT",
        body: asset,
    });
}

/**
 * THis component contains the content of Step 3 in the card creation process
 *
 * @returns the content of Step 3 in the card creation process
 */
export default function Step3() {
    const card = useCurrentCardInfo();

    const auth = useAuth();

    const photoFileName = useRef("");
    const [photoIsLoading, setPhotoIsLoading] = useState(false);
    const videoFileName = useRef("");
    const [videoIsLoading, setVideoIsLoading] = useState(false);

    const { startProcessing, stopProcessing, setMediaType } =
        useMediaProcessing();

    /**
     * This function processes the photo selection
     * @param files the files to be processed
     */
    async function processPhotoSelect(files: FileList) {
        setPhotoIsLoading(true);
        startProcessing();
        const myPhoto = URL.createObjectURL(files[0]);
        const resizedPhoto = await resize(myPhoto, 1000, null);

        try {
            const formData = new FormData();

            formData.append("image", (await b64toBlob(resizedPhoto)) as Blob);
            formData.append("format", "result");
            formData.append("processing.mode", "photo");
            formData.append("fit.toResult", "true");
            formData.append("fit.paddingPixels", "10");
            // Comment out this line to enable test mode with watermark
            // formData.append("test", "true");

            const response = await fetch(
                "https://clippingmagic.com/api/v1/images",
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: `Basic ${btoa("18367:bq7lgcfg41c985umg3n6l2a6keh15uddi8fec2gbtgqdr1fv2i7l")}`,
                        "Content-Encoding": "null",
                    },
                    redirect: "follow",
                },
            );

            if (!response.ok) {
                stopProcessing();
                throw new Error(
                    `Request failed with status ${response.status}`,
                );
            }

            const imageWidth = response.headers.get("x-amz-meta-width");
            const imageHeight = response.headers.get("x-amz-meta-height");

            const blob = await response.blob();
            // Convert blob to base64 string
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = async () => {
                const base64data = reader.result;

                const userDetails = await auth.currentAuthenticatedUser();
                let user_id = userDetails.userId;
                if (user_id === "") {
                    user_id = `${Math.random() * 100000000000000000}`;
                }

                const current_unix_time = Math.floor(Date.now() / 1000);
                const filename = `${user_id}-${current_unix_time}.png`;
                photoFileName.current = filename;

                // Upload the image to S3
                await uploadAssetToS3(filename, blob, "image", "image/png");

                card.setCurCard({
                    ...card.curCard,
                    frontPhotoURL: base64data as string,
                    frontPhotoS3URL: `https://onfireathletes-media-uploads.s3.amazonaws.com/image/${filename}`,
                    frontPhotoWidth: parseInt(imageWidth!),
                    frontPhotoHeight: parseInt(imageHeight!),
                    frontIsShowing: true,
                    partsToRecolor: [CardPart.INTERIOR_BORDER], // Hack to force card re-render
                });
                setPhotoIsLoading(false);
                stopProcessing();
                setMediaType(MediaType.PHOTO);
            };
        } catch (error) {
            console.error("Error:", error);
            stopProcessing();
        }
    }

    /**
     * This function processes the video selection
     * @param files the files to be processed
     */
    async function processVideoSelect(files: FileList) {
        setVideoIsLoading(true);
        startProcessing();

        const userDetails = await auth.currentAuthenticatedUser();
        let user_id = userDetails.userId;
        if (user_id === "") {
            user_id = `${Math.random() * 100000000000000000}`;
        }

        const current_unix_time = Math.floor(Date.now() / 1000);
        let fileExtension = files[0].type.split("/")[1];
        if (fileExtension == "quicktime") {
            fileExtension = "mov";
        }
        const filename = `${user_id}-${current_unix_time}.${fileExtension}`;
        videoFileName.current = filename;

        await uploadAssetToS3(filename, files[0], "video", files[0].type);

        card.setCurCard({
            ...card.curCard,
            backVideoURL: URL.createObjectURL(files[0]),
            backVideoS3URL: `https://onfireathletes-media-uploads.s3.amazonaws.com/video/${filename}`,
            frontIsShowing: false,
            partsToRecolor: [CardPart.INTERIOR_BORDER], // Hack to force card re-render
        });
        setVideoIsLoading(false);
        stopProcessing();
        setMediaType(MediaType.VIDEO);
    }

    /**
     * This renders a row of the table to let the user upload different things.
     * @param param0 list of props to pass in. Includes stepNum, title, description, and buttonImage.
     * @returns the React component for the row of the table.
     */
    function UploadRow({
        stepNum,
        title,
        description,
        buttonImage,
        isLoading,
        fileName,
    }: {
        stepNum: string;
        title: string;
        description: string;
        buttonImage: string;
        isLoading?: boolean;
        fileName?: string;
    }) {
        return (
            <HStack>
                <HStack alignItems={"top"}>
                    <Text
                        fontSize={"14px"}
                        fontStyle={"italic"}
                        fontWeight={"bold"}
                    >
                        {stepNum}.
                    </Text>
                    <VStack alignItems={"left"} spacing={"0px"}>
                        <Text
                            fontFamily="'Barlow', sans-serif"
                            fontSize={"14px"}
                            fontStyle={"italic"}
                            fontWeight={"bold"}
                        >
                            {title}:
                        </Text>
                        <Text
                            color={"grey"}
                            fontSize={"10px"}
                            fontStyle={"italic"}
                            fontWeight={"bold"}
                        >
                            {description}
                        </Text>
                        <Text
                            color={"grey"}
                            fontSize={"10px"}
                            fontStyle={"italic"}
                            fontWeight={"bold"}
                        >
                            Adjust {buttonImage} size with slider
                        </Text>
                    </VStack>
                </HStack>
                <Spacer />
                {isLoading && <Spinner size="sm" color="green.100" mr={2} />}
                {!isLoading && fileName !== "" && (
                    <CheckIcon paddingRight={1} boxSize={5} color="green.100" />
                )}
                <DropzoneButton
                    buttonText={`UPLOAD ${buttonImage.toUpperCase()}`}
                    svgcomp={buttonImage}
                    width={"40%"}
                    height={"36px"}
                    onPhotoSelect={processPhotoSelect}
                    onVideoSelect={processVideoSelect}
                />
            </HStack>
        );
    }

    /**
     * This renders a row of the table to let the user upload different things.
     * @param param0 list of props to pass in. Includes stepNum, title, description, and buttonImage.
     * @returns the React component for the row of the table.
     * @param param0
     */
    function SignatureRow({
        stepNum,
        title,
        signature,
    }: {
        stepNum: string;
        title: string;
        signature: string;
    }) {
        return (
            <HStack>
                <HStack alignItems={"top"}>
                    <Text
                        fontSize={"14px"}
                        fontStyle={"italic"}
                        fontWeight={"bold"}
                    >
                        {stepNum}.
                    </Text>
                    <VStack alignItems={"left"} spacing={"0px"}>
                        <Text
                            fontFamily="'Barlow', sans-serif"
                            fontSize={"14px"}
                            fontStyle={"italic"}
                            fontWeight={"bold"}
                        >
                            {title}:
                        </Text>
                    </VStack>
                </HStack>
                <Spacer />
                {shouldShow(signature) && (
                    <CheckIcon paddingRight={1} boxSize={5} color="green.100" />
                )}
                <SignatureModal
                    buttonText="Sign now"
                    width={"40%"}
                    auth={auth}
                />
            </HStack>
        );
    }

    return (
        <>
            <VStack
                width={"100%"}
                height={"100%"}
                alignItems={"left"}
                justifyContent={"space-evenly"}
                // paddingTop={8}
                gap={8}
                color={"white"}
                fontFamily={"Barlow Semi Condensed"}
            >
                <UploadRow
                    stepNum={"1"}
                    title={"Front Photo"}
                    description={"File Specs: PNG or JPG, MAX 25MB"}
                    buttonImage={"photo"}
                    isLoading={photoIsLoading}
                    fileName={card.curCard.frontPhotoURL}
                />
                <Divider borderColor={"grey"} />
                <UploadRow
                    stepNum={"2"}
                    title={"Back Video (Optional)"}
                    description={"File Specs: MP4 or MOV, MAX 100MB"}
                    buttonImage={"video"}
                    isLoading={videoIsLoading}
                    fileName={card.curCard.backVideoURL}
                />
                <Divider borderColor={"grey"} />
                <SignatureRow
                    signature={card.curCard.signature}
                    stepNum={"3"}
                    title="Signature (Optional)"
                />
            </VStack>
        </>
    );
}
