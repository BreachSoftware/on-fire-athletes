"use client";

import {
    Flex,
    Grid,
    GridItem,
    Text,
    SkeletonText,
    Input,
    useToast,
    ToastId,
    UseToastOptions,
} from "@chakra-ui/react";
import { ChangeEvent, createRef, useEffect, useState } from "react";
import { b64toBlob, uploadAssetToS3 } from "@/components/create/Step3";
import { useAuth } from "@/hooks/useAuth";
import { ProfileInfo } from "../../page";
import { apiEndpoints } from "@backend/EnvironmentManager/EnvironmentManager";
import ProfileBioMedia from "./media";
import ProfileNewMedia from "./newMedia";

interface ProfileBioTabProps {
    profileInfo: ProfileInfo | undefined;
    isLoaded: boolean;
    editable: boolean;
}

enum MediaInteractionType {
    UPLOAD = "upload",
    DELETE = "delete",
    EDIT = "edit",
}

enum MediaType {
    PHOTO = "photo",
    VIDEO = "video",
}

/**
 * The Profile tab for the About page.
 * @returns The About Tab for the Profile page.
 */
export default function ProfileBioTab({
    profileInfo,
    isLoaded,
    editable,
}: ProfileBioTabProps) {
    const auth = useAuth();
    const toast = useToast();
    const fileInputRef = createRef<HTMLInputElement>();

    const [media, setMedia] = useState<string[]>(profileInfo?.media ?? []);
    const [fileIsLoading, setFileIsLoading] = useState(false);

    // Initial load of media
    useEffect(() => {
        setMedia(profileInfo?.media ?? []);
    }, [profileInfo?.media]);

    /**
     * Fetches the updated media array from the backend
     * @returns a Promise that resolves with the updated media array
     */
    async function getUpdatedMediaArray(type: string) {
        const user = await auth.currentAuthenticatedUser();
        const userId = user.userId;

        const getUserResponse = await fetch(
            `${apiEndpoints.getUser()}?uuid=${userId}`,
            {
                method: "GET",
            },
        );
        if (!getUserResponse.ok && type === MediaInteractionType.UPLOAD) {
            toast({
                title: "Media Upload Failed",
                description:
                    "There was an error uploading your media. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            return;
        } else if (
            !getUserResponse.ok &&
            type === MediaInteractionType.DELETE
        ) {
            toast({
                title: "Media Deletion Failed",
                description:
                    "There was an error deleting your media. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            return;
        } else if (!getUserResponse.ok && type === MediaInteractionType.EDIT) {
            toast({
                title: "Media Edit Failed",
                description:
                    "There was an error editing your media. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
        const userResponseJson = await getUserResponse.json();
        const userMedia = userResponseJson.media;
        if (userMedia) {
            setMedia(userMedia);
        }
    }

    /**
     * Adds an image to the media array
     */
    async function addToMediaArray(uploadedMediaURL: string) {
        // Get the current user's uuid
        const user = await auth.currentAuthenticatedUser();
        const userId = user.userId;

        // Update the backend with the newest media upload
        const response = await fetch(apiEndpoints.users_updateUserProfile(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                uuid: userId,
                first_name: profileInfo?.first_name,
                last_name: profileInfo?.last_name,
                position: profileInfo?.position,
                team_hometown: profileInfo?.team_hometown,
                bio: profileInfo?.bio,
                avatar: profileInfo?.avatar,
                facebookLink: profileInfo?.facebookLink,
                instagramLink: profileInfo?.instagramLink,
                xLink: profileInfo?.xLink,
                tiktokLink: profileInfo?.tiktokLink,
                youtubeLink: profileInfo?.youtubeLink,
                snapchatLink: profileInfo?.snapchatLink,
                media: [...(media ?? []), uploadedMediaURL],
            }),
        });

        if (!response.ok) {
            toast({
                title: "Media Upload Failed",
                description:
                    "There was an error uploading your media. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            setFileIsLoading(false);
            return;
        }
        await getUpdatedMediaArray(MediaInteractionType.UPLOAD);
        toast({
            title: "Media Uploaded",
            description: "Your media has been uploaded successfully.",
            status: "success",
            duration: 5000,
            isClosable: true,
        });
        setFileIsLoading(false);
    }

    async function updateCroppedMedia(
        oldMediaUrl: string,
        newMediaUrl: string,
    ) {
        const user = await auth.currentAuthenticatedUser();
        const userId = user.userId;

        const response = await fetch(apiEndpoints.users_updateUserProfile(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                uuid: userId,
                first_name: profileInfo?.first_name,
                last_name: profileInfo?.last_name,
                position: profileInfo?.position,
                team_hometown: profileInfo?.team_hometown,
                bio: profileInfo?.bio,
                avatar: profileInfo?.avatar,
                facebookLink: profileInfo?.facebookLink,
                instagramLink: profileInfo?.instagramLink,
                xLink: profileInfo?.xLink,
                tiktokLink: profileInfo?.tiktokLink,
                youtubeLink: profileInfo?.youtubeLink,
                snapchatLink: profileInfo?.snapchatLink,
                media: [
                    ...(media ?? []).filter((url) => {
                        return url !== oldMediaUrl;
                    }),
                    newMediaUrl,
                ],
            }),
        });

        if (!response.ok) {
            toast({
                title: "Media Deletion Failed",
                description:
                    "There was an error deleting your media. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        await getUpdatedMediaArray(MediaInteractionType.EDIT);
        toast({
            title: "Media Edited",
            description: "Your media has been edited successfully.",
            status: "success",
            duration: 5000,
            isClosable: true,
        });
    }

    /**
     * Deletes an image from the media array
     */
    async function deleteFromMediaArray(mediaURL: string) {
        // Get the current user's uuid
        const user = await auth.currentAuthenticatedUser();
        const userId = user.userId;

        // Update the backend with the newest media upload
        const response = await fetch(apiEndpoints.users_updateUserProfile(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                uuid: userId,
                first_name: profileInfo?.first_name,
                last_name: profileInfo?.last_name,
                position: profileInfo?.position,
                team_hometown: profileInfo?.team_hometown,
                bio: profileInfo?.bio,
                avatar: profileInfo?.avatar,
                facebookLink: profileInfo?.facebookLink,
                instagramLink: profileInfo?.instagramLink,
                xLink: profileInfo?.xLink,
                tiktokLink: profileInfo?.tiktokLink,
                youtubeLink: profileInfo?.youtubeLink,
                snapchatLink: profileInfo?.snapchatLink,
                media: [
                    ...(media ?? []).filter((url) => {
                        return url !== mediaURL;
                    }),
                ],
            }),
        });
        if (!response.ok) {
            toast({
                title: "Media Deletion Failed",
                description:
                    "There was an error deleting your media. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            return;
        }
        await getUpdatedMediaArray(MediaInteractionType.DELETE);
        toast({
            title: "Media Deleted",
            description: "Your media has been deleted successfully.",
            status: "success",
            duration: 5000,
            isClosable: true,
        });
    }

    /**
     * Resizes an image to fit within the given dimensions
     * @param file the image file to resize
     * @param maxWidth the maxiumum width of the resized image
     * @param maxHeight the maximum height of the resized image
     * @returns a Promise that resolves with the resized image as a data URL
     */
    async function resizeImage(
        file: File,
        maxWidth: number,
        maxHeight: number,
    ): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const img = new Image();

            // Set up onload event handler
            img.onload = () => {
                let width = img.width;
                let height = img.height;

                // Resize the image while maintaining aspect ratio
                if (width > height) {
                    if (width > maxWidth) {
                        height = height * (maxWidth / width);
                        width = maxWidth;
                    }
                } else if (height > maxHeight) {
                    width = width * (maxHeight / height);
                    height = maxHeight;
                }

                // Create a canvas element for resizing
                const canvas = document.createElement("canvas");
                if (!(canvas instanceof HTMLCanvasElement)) {
                    reject(new Error("Failed to create canvas element"));
                    return;
                }
                canvas.width = width;
                canvas.height = height;

                // Draw the image onto the canvas
                const ctx = canvas.getContext("2d");
                ctx?.drawImage(img, 0, 0, width, height);

                // Get the resized image as data URL
                const resizedPhoto = canvas.toDataURL("image/png");

                // Resolve the Promise with the resized image data URL
                resolve(resizedPhoto);
            };

            // Set up onerror event handler
            img.onerror = () => {
                reject(new Error("Failed to load the image"));
            };

            // Set the src attribute of the image to start loading the image
            img.src = URL.createObjectURL(file);
        });
    }

    /**
     * Handles the file selection
     * @param event clicking on the button
     */
    async function processMediaSelect(
        files: FileList,
        mediaType: string,
    ): Promise<void> {
        setFileIsLoading(true);

        // Gets the file
        const file = files[0];

        // Determine name of file
        const userDetails = await auth.currentAuthenticatedUser();
        const user_id = userDetails.userId;
        const current_unix_time = Math.floor(Date.now() / 1000);
        let filename = `${user_id}-${current_unix_time}`;

        if (mediaType === MediaType.PHOTO) {
            // Resize photo
            const resizedImage = await resizeImage(file, 750, 750);

            // convert b64 to blob
            const uploadedMediaBlob = await b64toBlob(resizedImage);

            // Put the .png extension on the filename
            filename = `${filename}.png`;

            // Upload the image to S3
            await uploadAssetToS3(
                filename,
                uploadedMediaBlob,
                "profile_media",
                "image/png",
            );
        } else {
            // mediaType === MediaType.VIDEO
            // Put the .mp4 extension on the filename
            filename = `${filename}.mp4`;

            // Upload the video to S3
            await uploadAssetToS3(filename, file, "profile_media", "video/mp4");
        }

        // Update the media array
        await addToMediaArray(
            `https://onfireathletes-media-uploads.s3.amazonaws.com/profile_media/${filename}`,
        );
    }

    /**
     * Handles the asynchronous aspect of photo selection
     * @param files the photo to be processed
     */
    async function handleAsyncMediaSelect(
        files: FileList,
        mediaType: string,
    ): Promise<void> {
        await processMediaSelect(files, mediaType);
    }

    /**
     * Wrapper function for handling file selection
     * @param event clicking on the button
     */
    function handleFileSelectWrapper(
        event: ChangeEvent<HTMLInputElement>,
        mediaType: string,
        onFileSelect: (files: FileList, mediaType: string) => void,
        // onVideoSelect: (files: FileList) => void,
        toast: (options: UseToastOptions) => ToastId | undefined,
    ): void {
        if (event.target.files) {
            if (!MediaType.PHOTO && !MediaType.VIDEO) {
                toast({
                    title: "Unsupported file type",
                    description: "Please select a supported file type.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }
            const files = event.target.files;
            onFileSelect(files, mediaType);
        }
    }

    /**
     * Makes the file input clickable
     */
    function handleButtonClick(): void {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    return (
        <Flex w="full" direction="column">
            <Flex direction="column" mb={{ base: "32px", lg: "80px" }} w="full">
                <Text
                    fontSize="24px"
                    fontFamily="'Barlow Condensed', sans-serif"
                    fontStyle="italic"
                    fontWeight="600"
                    color="green.600"
                    letterSpacing={"0.75px"}
                    mb={{ base: "4px", lg: "12px" }}
                >
                    About
                </Text>
                <SkeletonText isLoaded={isLoaded} noOfLines={3}>
                    <Text fontSize="16px" fontWeight="500" lineHeight="38px">
                        {profileInfo?.bio ?? "No bio available."}
                    </Text>
                </SkeletonText>
            </Flex>
            <Grid
                templateColumns={{
                    base: "repeat(2, 1fr)",
                    md: "repeat(2, 1fr)",
                    lg: "repeat(3, 1fr)",
                    xl: "repeat(4, 1fr)",
                }}
                gap={{ base: "12px", lg: "40px" }}
                mb={{ base: "12px", lg: "40px" }}
                alignItems={"center"}
            >
                {editable && isLoaded && (
                    <GridItem>
                        <ProfileNewMedia
                            isLoading={fileIsLoading}
                            handleClick={handleButtonClick}
                        />
                    </GridItem>
                )}
                {media.map((media, index) => {
                    return (
                        <GridItem key={index}>
                            <ProfileBioMedia
                                media={media}
                                isEditable={editable}
                                handleEdit={updateCroppedMedia}
                                handleDelete={deleteFromMediaArray}
                            />
                        </GridItem>
                    );
                })}
                <Input
                    type="file"
                    accept={"image/png, image/jpeg, image/jpg, .mov, .mp4"}
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={(event) => {
                        if (
                            event.target.files &&
                            event.target.files.length > 0
                        ) {
                            handleFileSelectWrapper(
                                event,
                                event.target.files![0].type.includes("image")
                                    ? MediaType.PHOTO
                                    : MediaType.VIDEO,
                                handleAsyncMediaSelect,
                                toast,
                            );
                        }
                    }}
                />
            </Grid>
        </Flex>
    );
}
