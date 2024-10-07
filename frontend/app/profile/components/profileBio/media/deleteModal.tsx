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
import { Image as ChakraImage } from "@chakra-ui/image";

import { MediaType } from "@/hooks/useMediaProcessing";
import { ProfileMediaType } from "../types";

interface Props {
    media: ProfileMediaType | string;
    mediaType: MediaType;
    isOpen: boolean;
    onClose: () => void;
    handleDelete: (media: ProfileMediaType) => void;
}

/**
 * ProfileMediaDeleteModal component
 * This component is responsible for rendering the delete modal for the media section of the profile bio.
 * @returns {JSX.Element}
 */
export default function ProfileMediaDeleteModal({
    media,
    mediaType,
    isOpen,
    onClose,
    handleDelete,
}: Props) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            isCentered
            size={mediaType === MediaType.PHOTO ? "lg" : "none"}
        >
            <ModalOverlay backdropFilter="blur(5px) hue-rotate(10deg)" />
            <ModalContent
                rounded="xl"
                bg="#1B1B1B"
                color="white"
                maxW={{ base: "95vw", md: "60vw" }}
                maxH="90vh"
                height={"auto"}
                width={"auto"}
            >
                <ModalCloseButton zIndex={1} />
                <ModalHeader width="90%">
                    Are you sure you want to delete this{" "}
                    {mediaType === MediaType.PHOTO ? "photo" : "video"}?
                </ModalHeader>
                <ModalBody display="flex" justifyContent="center">
                    {mediaType === MediaType.PHOTO ? (
                        <ChakraImage
                            alt="Bio Image"
                            src={typeof media === "string" ? media : media.url}
                            borderRadius="10px"
                            mb="10px"
                            objectFit="scale-down"
                            maxHeight="400px"
                        />
                    ) : (
                        <></>
                    )}
                </ModalBody>
                <ModalFooter
                    alignItems="center"
                    justifyContent="space-between"
                    display="flex"
                >
                    <Button
                        bgColor="#323232"
                        _hover={{ bgColor: "#2B2B2B" }}
                        onClick={() => {
                            onClose();
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        background="red.600"
                        onClick={() => {
                            handleDelete(
                                typeof media === "string"
                                    ? {
                                          url: media,
                                          type: mediaType,
                                      }
                                    : media,
                            );
                            onClose();
                        }}
                    >
                        Delete
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
