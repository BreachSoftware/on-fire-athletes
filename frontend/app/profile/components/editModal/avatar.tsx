import { Flex } from "@chakra-ui/layout";
import { Avatar } from "@chakra-ui/avatar";
import { Button } from "@chakra-ui/button";
import { useState, useEffect } from "react";

import { useAuth } from "@/hooks/useAuth";
import { resize } from "@/components/image_filters";
import DropzoneButton from "@/components/create/dropzoneButton";
import { b64toBlob, uploadAssetToS3 } from "@/components/create/Step3";
import CropModal from "@/components/shared/modals/crop-modal";
import { ProfileInfo } from "../../page";
import { useDisclosure } from "@chakra-ui/react";

interface Props {
    profileInfo?: ProfileInfo;
    editableProfilePicture: string;
    setEditableProfilePicture: (value: string) => void;
}

export default function ProfileAvatarInput({
    profileInfo,
    editableProfilePicture,
    setEditableProfilePicture,
}: Props) {
    const { currentAuthenticatedUser } = useAuth();
    const [uploadComplete, setUploadComplete] = useState(false);

    const { isOpen, onOpen, onClose } = useDisclosure();

    /**
     * This function processes the photo selection
     * @param files the files to be processed
     */
    async function processProfileImageSelect(files: FileList) {
        const maxResolution = 2160;
        const myPhoto = URL.createObjectURL(files[0]);

        // Create an image element
        const img: HTMLImageElement = await new Promise<HTMLImageElement>(
            (resolve, reject) => {
                const imgElement: HTMLImageElement = new window.Image(); // Use the global Image constructor
                imgElement.onload = () => {
                    return resolve(imgElement);
                };
                imgElement.onerror = reject;
                imgElement.src = myPhoto;
            },
        );

        // Calculate the new dimensions while preserving aspect ratio
        let newWidth = 0;
        let newHeight = 0;
        if (img.width > img.height) {
            newWidth = Math.max(img.width, maxResolution);
            newHeight = (newWidth * img.height) / img.width;
        } else {
            newHeight = Math.max(img.height, maxResolution);
            newWidth = (newHeight * img.width) / img.height;
        }

        const resizedPhoto = await resize(myPhoto, newWidth, newHeight);
        const resizedPhotoBlob = await b64toBlob(resizedPhoto);

        // Upload the photo to S3
        const user = await currentAuthenticatedUser();
        const user_id = user.userId;
        const current_unix_time = Math.floor(Date.now() / 1000);
        const filename = `${user_id}-${current_unix_time}.jpeg`;

        await uploadAssetToS3(
            filename,
            resizedPhotoBlob,
            "profile_media",
            "image/png",
        );

        setEditableProfilePicture(
            `https://onfireathletes-media-uploads.s3.amazonaws.com/profile_media/${filename}`,
        );
        setUploadComplete(true);
    }

    /**
     * This function processes cropped images
     * @param croppedImagePixels is the value of the newly cropped image in the form of an Area
     */
    async function processCroppedProfileImage(croppedImage: string) {
        const resizedPhotoBlob = await b64toBlob(croppedImage);
        console.log({ resizedPhotoBlob });

        // Upload the photo to S3
        const user = await currentAuthenticatedUser();
        const user_id = user.userId;
        const current_unix_time = Math.floor(Date.now() / 1000);
        const filename = `${user_id}-${current_unix_time}.jpeg`;

        await uploadAssetToS3(
            filename,
            resizedPhotoBlob,
            "profile_media",
            "image/png",
        );

        console.log("Uploading");

        setEditableProfilePicture(
            `https://onfireathletes-media-uploads.s3.amazonaws.com/profile_media/${filename}`,
        );
    }

    useEffect(() => {
        if (uploadComplete) {
            const timer = setTimeout(() => {
                setUploadComplete(false);
            }, 5000); // Reset after 5 seconds, adjust time as needed

            return () => {
                return clearTimeout(timer);
            }; // Cleanup timer
        }

        return () => {};
    }, [uploadComplete]);

    return (
        <>
            <Flex
                justifyContent="space-between"
                alignItems="center"
                flexDir="column"
                gridGap={4}
            >
                <Avatar
                    size="2xl"
                    src={editableProfilePicture || "/placeholderProfile.jpg"}
                    sx={{
                        transition: "filter 0.3s ease-in-out",
                        aspectRatio: "1 / 1",
                    }}
                />
                <Flex
                    flexDir="column"
                    w="fit-content"
                    alignItems="center"
                    gridGap={4}
                >
                    <DropzoneButton
                        buttonText={"UPLOAD"}
                        svgcomp={"profile"}
                        width="100%"
                        onProfileImageSelect={processProfileImageSelect}
                        uploadComplete={uploadComplete}
                    />
                    <Flex flexDir="row" w="fit-content" gridGap={4}>
                        <Button
                            w="full"
                            color="white"
                            fontSize="12px"
                            variant="outline"
                            onClick={onOpen}
                        >
                            EDIT
                        </Button>
                        <Button
                            w="full"
                            color="red.400"
                            borderColor="red.500"
                            variant="outline"
                            fontSize="12px"
                            onClick={() => {
                                setEditableProfilePicture(
                                    "/placeholderProfile.jpg",
                                );
                            }}
                        >
                            REMOVE
                        </Button>
                    </Flex>
                </Flex>
            </Flex>
            <CropModal
                image={editableProfilePicture}
                onSave={processCroppedProfileImage}
                onCancel={() => {
                    setEditableProfilePicture(profileInfo?.avatar || "");
                }}
                isOpen={isOpen}
                onClose={onClose}
            />
        </>
    );
}
