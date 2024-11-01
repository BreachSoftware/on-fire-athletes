import { Icon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Box, Center, AspectRatio } from "@chakra-ui/layout";
import { Image as ChakraImage } from "@chakra-ui/image";
import { FaX } from "react-icons/fa6";

import { MediaType } from "@/hooks/useMediaProcessing";
import ProfileMediaViewModal from "./viewModal";
import ProfileMediaDeleteModal from "./deleteModal";
import { useRef } from "react";
import ProfileMediaEditModal from "./editModal";
import { ProfileMediaType } from "../types";
import { FaPlayCircle } from "react-icons/fa";

interface Props {
    media: ProfileMediaType | string;
    isEditable: boolean;
    handleEdit: (updatedMedia: ProfileMediaType) => Promise<void>;
    handleDelete: (mediaToDelete: ProfileMediaType) => Promise<void>;
}

/**
 * ProfileBioMedia component
 * This component is responsible for rendering the media section of the profile bio.
 * @returns {JSX.Element}
 */
export default function ProfileBioMedia({
    media,
    isEditable,
    handleEdit,
    handleDelete,
}: Props) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const {
        isOpen: isViewOpen,
        onOpen: onOpenView,
        onClose: onCloseView,
    } = useDisclosure();
    const {
        isOpen: isDeleteOpen,
        onOpen: onOpenDelete,
        onClose: onCloseDelete,
    } = useDisclosure();
    const {
        isOpen: isEditOpen,
        onOpen: onOpenEdit,
        onClose: onCloseEdit,
    } = useDisclosure();

    const mediaType =
        typeof media === "string"
            ? media.includes(".mp4") || media.includes(".mov")
                ? MediaType.VIDEO
                : MediaType.PHOTO
            : media.type;

    const mediaUrl =
        typeof media === "string" ? media : media.cropped || media.url;

    return (
        <>
            <Box
                position="relative"
                w="full"
                display={{ base: "block", md: "none" }}
                h="full"
                onClick={onOpenView}
            >
                <AspectRatio
                    w="full"
                    position="relative"
                    ratio={1}
                    overflow="hidden"
                >
                    {mediaType === MediaType.PHOTO ? (
                        <ChakraImage
                            alt="Bio Image"
                            src={mediaUrl}
                            _groupHover={{ transform: "scale(1.05)" }}
                            transition="transform 0.1s ease-out"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                        />
                    ) : (
                        <Box
                            w="full"
                            h="full"
                            _groupHover={{ transform: "scale(1.05)" }}
                            transition="transform 0.1s ease-out"
                        >
                            <video
                                src={mediaUrl}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                                muted={true}
                                autoPlay={true}
                                playsInline={true}
                                onPlay={(e) => {
                                    // As soon as the video starts playing, pause it
                                    e.currentTarget.pause();
                                }}
                            />
                        </Box>
                    )}
                </AspectRatio>
                {mediaType === MediaType.VIDEO && (
                    <Center
                        position="absolute"
                        top={0}
                        right={0}
                        left={0}
                        bottom={0}
                    >
                        <Icon
                            as={FaPlayCircle}
                            fontSize="64px"
                            color="blackAlpha.700"
                        />
                    </Center>
                )}
            </Box>
            <Box
                position="relative"
                w="full"
                display={{ base: "none", md: "block" }}
                h="full"
                role="group"
                cursor="pointer"
                onClick={onOpenView}
            >
                <IconButton
                    display={isEditable ? "block" : "none"}
                    opacity={0}
                    aria-label="Delete image"
                    icon={<Icon as={FaX} />}
                    position="absolute"
                    top="-10px"
                    right="-10px"
                    bg="red.600"
                    color="white"
                    w="40px"
                    h="40px"
                    zIndex={1}
                    _hover={{ bgColor: "red.700" }}
                    _groupHover={{
                        opacity: 1,
                    }}
                    transition="opacity 0.1s ease-out"
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onOpenDelete();
                    }}
                />
                <AspectRatio
                    w="full"
                    position="relative"
                    ratio={1}
                    overflow="hidden"
                >
                    {mediaType === MediaType.PHOTO ? (
                        <ChakraImage
                            alt="Bio Image"
                            src={mediaUrl}
                            _groupHover={{ transform: "scale(1.025)" }}
                            transition="transform 0.1s ease-out"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                        />
                    ) : (
                        <Box
                            w="full"
                            h="full"
                            _groupHover={{ transform: "scale(1.025)" }}
                            transition="transform 0.1s ease-out"
                            onMouseEnter={() => {
                                if (videoRef.current) {
                                    videoRef.current.play();
                                    videoRef.current.loop = true;
                                }
                            }}
                            onMouseLeave={() => {
                                if (videoRef.current) {
                                    videoRef.current.pause();
                                    videoRef.current.currentTime = 0;
                                    videoRef.current.loop = false;
                                }
                            }}
                        >
                            <video
                                ref={videoRef}
                                src={mediaUrl}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                                muted={true}
                                autoPlay={false}
                                playsInline={true}
                            />
                        </Box>
                    )}
                </AspectRatio>
            </Box>
            <ProfileMediaViewModal
                mediaUrl={typeof media === "string" ? media : media.url}
                mediaType={mediaType}
                isOpen={isViewOpen}
                onClose={onCloseView}
                isEditable={isEditable}
                onOpenEditModal={onOpenEdit}
                onOpenDeleteModal={onOpenDelete}
            />
            <ProfileMediaDeleteModal
                media={media}
                mediaType={mediaType}
                isOpen={isDeleteOpen}
                onClose={onCloseDelete}
                handleDelete={handleDelete}
            />
            <ProfileMediaEditModal
                media={media}
                mediaType={mediaType}
                isOpen={isEditOpen}
                onClose={onCloseEdit}
                onComplete={async (media: ProfileMediaType) => {
                    await handleEdit(media);
                    onCloseView();
                }}
            />
        </>
    );
}
