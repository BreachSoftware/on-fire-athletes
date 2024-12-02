import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@chakra-ui/toast";

import { ProfileInfo } from "@/app/profile/components/profile.client";
import { ProfileMediaType } from "./types";
import { MediaType } from "@/hooks/useMediaProcessing";
import { b64toBlob, uploadAssetToS3 } from "@/components/create/Step3";
import { apiEndpoints } from "@backend/EnvironmentManager/EnvironmentManager";

enum MediaInteractionType {
    UPLOAD = "upload",
    DELETE = "delete",
    EDIT = "edit",
}

type ProfileMediaHookReturnType = {
    media: (ProfileMediaType | string)[];
    addMedia: (file: FileList, mediaType: MediaType) => Promise<void>;
    deleteMedia: (mediaToDelete: ProfileMediaType) => Promise<void>;
    updateMedia: (updatedMedia: ProfileMediaType) => Promise<void>;
};

export function useProfileMedia(
    profileInfo: ProfileInfo | undefined,
): ProfileMediaHookReturnType {
    const auth = useAuth();
    const toast = useToast();

    const [media, setMedia] = useState<(ProfileMediaType | string)[]>([]);

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
        mediaType: MediaType,
    ): Promise<void> {
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
        await addMedia({
            url: `https://onfireathletes-media-uploads.s3.amazonaws.com/profile_media/${filename}`,
            type: mediaType,
        });
    }

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
    async function addMedia(newMedia: ProfileMediaType) {
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
                media: [...(media ?? []), newMedia],
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
    }

    async function updateMedia(updatedMedia: ProfileMediaType) {
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
                    ...(media ?? []).map((m) => {
                        if (typeof m === "string") {
                            return {
                                url: m,
                                mediaType: m.includes(".mp4")
                                    ? MediaType.VIDEO
                                    : MediaType.PHOTO,
                            };
                        } else if (m.url === updatedMedia.url) {
                            return updatedMedia;
                        }

                        return m;
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
    async function deleteMedia(mediaToDelete: ProfileMediaType) {
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
                    ...(media ?? []).filter((m) => {
                        if (typeof m === "string") {
                            return m !== mediaToDelete.url;
                        } else {
                            return m.url !== mediaToDelete.url;
                        }
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

    // Initial load of media
    useEffect(() => {
        setMedia(profileInfo?.media ?? []);
    }, [profileInfo?.media]);

    return {
        media,
        addMedia: processMediaSelect,
        deleteMedia,
        updateMedia,
    };
}
