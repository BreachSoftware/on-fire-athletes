import { HStack, Flex, Text, VStack, Box } from "@chakra-ui/react";
import DropzoneButton from "@/components/create/dropzoneButton";
import { useCurrentCardInfo } from "@/hooks/useCurrentCardInfo";
import { useState, useEffect, useRef } from "react";
import SignatureModal from "@/components/create/SignatureModal";
import { resize } from "@/components/image_filters";
import { uploadAssetToS3, b64toBlob } from "@/components/create/Step3";
import { useAuth } from "@/hooks/useAuth";
import { CardPart } from "@/hooks/TradingCardInfo";
import { useCompletedSteps } from "../../../hooks/useMobileProgress";

interface MobileStep3Props {
    type: string;
}

/**
 * THis component contains the content of Step 3 in the card creation process
 *
 * @returns the content of Step 3 in the card creation process
 */
export default function MobileUpload({ type }: MobileStep3Props) {
    const card = useCurrentCardInfo();
    const steps = useCompletedSteps();

    const auth = useAuth();

    const [frontPhotoURL, setFrontPhotoURL] = useState(
        card.curCard.frontPhotoURL,
    );
    const photoFileName = useRef(card.curCard.frontPhotoS3URL);
    const [photoIsLoading, setPhotoIsLoading] = useState(false);
    const [backVideoURL, setBackVideoURL] = useState(card.curCard.backVideoURL);
    const videoFileName = useRef(card.curCard.backVideoS3URL);
    const [videoIsLoading, setVideoIsLoading] = useState(false);
    const [frontPhotoDimensions, setFrontPhotoDimensions] = useState({
        width: 0,
        height: 0,
    });

    // Update the card preview when the component mounts and when the user changes the color
    useEffect(() => {
        card.setCurCard({
            ...card.curCard,
            frontPhotoURL: frontPhotoURL,
            frontPhotoS3URL: photoFileName.current,
            frontPhotoWidth: frontPhotoDimensions.width,
            frontPhotoHeight: frontPhotoDimensions.height,
            backVideoURL: backVideoURL,
            backVideoS3URL: videoFileName.current,
            partsToRecolor: [CardPart.INTERIOR_BORDER], // Hack to force card re-render
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [frontPhotoDimensions, backVideoURL]);

    /**
     * This function processes the photo selection
     * @param files the files to be processed
     */
    async function processPhotoSelect(files: FileList) {
        setPhotoIsLoading(true);
        const myPhoto = URL.createObjectURL(files[0]);
        const resizedPhoto = await resize(myPhoto, 1000, null);

        try {
            const formData = new FormData();

            formData.append("image", (await b64toBlob(resizedPhoto)) as Blob);
            formData.append("format", "result");
            formData.append("processing.mode", "photo");
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
                photoFileName.current = `https://onfireathletes-media-uploads.s3.amazonaws.com/image/${filename}`;

                // Upload the image to S3
                await uploadAssetToS3(filename, blob, "image", "image/png");

                setFrontPhotoDimensions({
                    width: parseInt(imageWidth!),
                    height: parseInt(imageHeight!),
                });
                setFrontPhotoURL(base64data as string);
                card.setCurCard({
                    ...card.curCard,
                    frontIsShowing: true,
                });
                steps.mobileProgress.conditions.set(`${type}Upload`, true); // photoUpload
                setPhotoIsLoading(false);
            };
        } catch (error) {
            console.error("Error:", error);
        }
    }

    /**
     * This function processes the video selection
     * @param files the files to be processed
     */
    async function processVideoSelect(files: FileList) {
        setVideoIsLoading(true);

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
        videoFileName.current = `https://onfireathletes-media-uploads.s3.amazonaws.com/video/${filename}`;
        await uploadAssetToS3(filename, files[0], "video", files[0].type);
        setBackVideoURL(URL.createObjectURL(files[0]));
        card.setCurCard({
            ...card.curCard,
            frontIsShowing: false,
        });
        setVideoIsLoading(false);
    }

    /**
     * This renders a row of the table to let the user upload different things.
     * @param param0 list of props to pass in. Includes stepNum, title, description, and buttonImage.
     * @returns the React component for the row of the table.
     */
    function UploadRow({
        buttonImage,
        isLoading,
        fileName,
    }: {
        buttonImage: string;
        isLoading?: boolean;
        fileName?: string;
    }) {
        return (
            <Flex alignItems={"center"} w={"100%"}>
                <DropzoneButton
                    buttonText={`ADD ${buttonImage.toUpperCase()}`}
                    svgcomp={buttonImage}
                    width={"100%"}
                    height={"48px"}
                    onPhotoSelect={processPhotoSelect}
                    onVideoSelect={processVideoSelect}
                    isLoading={isLoading}
                    inLineIcon
                    uploadComplete={fileName !== ""}
                />
            </Flex>
        );
    }

    /**
     * This renders a row of the table to let the user upload different things.
     * @param param0 list of props to pass in. Includes stepNum, title, description, and buttonImage.
     * @returns the React component for the row of the table.
     * @param param0
     */
    function SignatureRow() {
        return (
            <HStack w={"100%"} h={"48px"}>
                <SignatureModal
                    buttonText="add Signature"
                    width={"100%"}
                    inlineImage
                    height={"100%"}
                    auth={auth}
                />
            </HStack>
        );
    }

    // Render the appropriate upload row based on the type prop
    switch (type) {
        case "photo":
            return (
                <VStack w={"100%"} justifyContent={"center"}>
                    <Box w={"75%"}>
                        <UploadRow
                            buttonImage={"photo"}
                            isLoading={photoIsLoading}
                            fileName={
                                card.curCard.frontPhotoURL !== ""
                                    ? card.curCard.frontPhotoURL
                                    : photoFileName.current
                            }
                        />
                    </Box>
                    <Text
                        mt={1}
                        fontSize={"9px"}
                        fontStyle={"italic"}
                        fontWeight={"bold"}
                    >
                        {" "}
                        File Specs: PNG, JPG, MAX 100MB
                    </Text>
                    <Text
                        fontSize={"9px"}
                        fontStyle={"italic"}
                        fontWeight={"bold"}
                    >
                        Adjust photo size with slider
                    </Text>
                </VStack>
            );
        case "video":
            return (
                <VStack w={"100%"} justifyContent={"center"}>
                    <Box w={"75%"}>
                        <UploadRow
                            buttonImage={"video"}
                            isLoading={videoIsLoading}
                            fileName={
                                card.curCard.backVideoURL !== ""
                                    ? card.curCard.backVideoURL
                                    : videoFileName.current
                            }
                        />
                    </Box>
                    <Text
                        mt={1}
                        fontSize={"9px"}
                        fontStyle={"italic"}
                        fontWeight={"bold"}
                    >
                        {" "}
                        File Specs: MP4, MOV, MAX 100MB
                    </Text>
                    <Text
                        fontSize={"9px"}
                        fontStyle={"italic"}
                        fontWeight={"bold"}
                    >
                        Adjust video size with slider
                    </Text>
                </VStack>
            );
        case "sig":
            return (
                <VStack w={"100%"} justifyContent={"center"}>
                    <Box w={"75%"}>
                        <SignatureRow />
                    </Box>
                    <Text
                        mt={1}
                        fontSize={"9px"}
                        fontStyle={"italic"}
                        fontWeight={"bold"}
                    >
                        {" "}
                        Turn phone sideways
                    </Text>
                </VStack>
            );
        default:
            break;
    }
}
