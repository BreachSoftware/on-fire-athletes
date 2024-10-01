import {
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalContent,
    ModalOverlay,
    ModalCloseButton,
} from "@chakra-ui/modal";
import { Button } from "@chakra-ui/button";
import { AspectRatio, Box } from "@chakra-ui/layout";
import { Image as ChakraImage } from "@chakra-ui/image";

import { MediaType } from "@/hooks/useMediaProcessing";

interface Props {
    media: string;
    mediaType: MediaType;
    isOpen: boolean;
    onClose: () => void;
    onOpenDeleteModal: () => void;
    onOpenEditModal: () => void;
    isEditable: boolean;
}

/**
 * ProfileMediaViewModal component
 * This component is responsible for rendering the view modal for the media section of the profile bio.
 * @returns {JSX.Element}
 */
export default function ProfileMediaViewModal({
    media,
    mediaType,
    isOpen,
    onClose,
    onOpenDeleteModal,
    onOpenEditModal,
    isEditable,
}: Props) {
    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                isCentered
                size="full"
                scrollBehavior="inside"
            >
                <ModalOverlay backdropFilter="blur(5px) hue-rotate(10deg)" />
                <ModalContent color="white">
                    <ModalCloseButton />
                    <ModalHeader />
                    <ModalBody
                        maxH="100dvh"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        {mediaType === MediaType.PHOTO ? (
                            <ChakraImage
                                w="full"
                                maxW={{ base: "none", lg: "50dvw" }}
                                alt="Bio Image"
                                src={media}
                                objectFit={{
                                    base: "contain",
                                    lg: "scale-down",
                                }}
                            />
                        ) : (
                            <Box
                                h={{ base: "auto", md: "60vh" }}
                                w={{ base: "full", md: "50vw" }}
                            >
                                <AspectRatio w="full" ratio={16 / 9}>
                                    <video
                                        src={media}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                        }}
                                        muted={true}
                                        autoPlay={true}
                                        controls={true}
                                        playsInline={true}
                                    />
                                </AspectRatio>
                            </Box>
                        )}
                    </ModalBody>
                    {isEditable && (
                        <ModalFooter
                            w="full"
                            alignItems="center"
                            justifyContent="space-between"
                        >
                            {mediaType === MediaType.PHOTO && (
                                <Button
                                    variant="outline"
                                    _hover={{
                                        bg: "whiteAlpha.400",
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        onOpenEditModal();
                                    }}
                                >
                                    EDIT
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                borderColor="red.500"
                                color="red.500"
                                _hover={{
                                    bg: "red.900",
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    onClose();
                                    onOpenDeleteModal();
                                }}
                            >
                                DELETE
                            </Button>
                        </ModalFooter>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
