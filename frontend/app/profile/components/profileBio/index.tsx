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
import { ChangeEvent, createRef, useState } from "react";
import { ProfileInfo } from "../../page";
import ProfileBioMedia from "./media";
import ProfileNewMedia from "./newMedia";
import { MediaType } from "@/hooks/useMediaProcessing";
import { useProfileMedia } from "./helpers";

interface ProfileBioTabProps {
    profileInfo: ProfileInfo | undefined;
    isLoaded: boolean;
    editable: boolean;
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
    const toast = useToast();
    const fileInputRef = createRef<HTMLInputElement>();

    const [fileIsLoading, setFileIsLoading] = useState(false);
    const { media, addMedia, updateMedia, deleteMedia } =
        useProfileMedia(profileInfo);

    /**
     * Wrapper function for handling file selection
     * @param event clicking on the button
     */
    async function handleFileSelectWrapper(
        event: ChangeEvent<HTMLInputElement>,
        mediaType: MediaType,
        onFileSelect: (files: FileList, mediaType: MediaType) => Promise<void>,
        // onVideoSelect: (files: FileList) => void,
        toast: (options: UseToastOptions) => ToastId | undefined,
    ): Promise<void> {
        setFileIsLoading(true);
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
            await onFileSelect(files, mediaType);
        }
        setFileIsLoading(false);
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
                                handleEdit={updateMedia}
                                handleDelete={deleteMedia}
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
                                addMedia,
                                toast,
                            );
                        }
                    }}
                />
            </Grid>
        </Flex>
    );
}
