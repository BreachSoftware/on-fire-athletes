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
	isEditable,
}: Props) {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			isCentered
			size="full" scrollBehavior="inside">
			<ModalOverlay backdropFilter="blur(5px) hue-rotate(10deg)" />
			<ModalContent color="white">
				<ModalCloseButton />
				<ModalHeader />
				<ModalBody maxH="100dvh" display="flex" alignItems="center" justifyContent="center">
					{ mediaType === MediaType.PHOTO ?
						<ChakraImage
							w="full"
							maxW={{ base: "none", lg: "50dvw" }}
							alt="Bio Image"
							src={media}
							objectFit={{ base: "contain", lg: "scale-down" }}
						/> :
						<Box h={{ base:"auto", md: "60vh" }} w={{ base: "full", md: "50vw" }}>
							<AspectRatio w="full" ratio={16 / 9}>
								<video
									src={media}
									style={{ width: "100%", height: "100%", objectFit: "cover" }}
									muted={true}
									autoPlay={true}
									controls={true}
									playsInline={true}
								/>
							</AspectRatio>
						</Box>
					}
				</ModalBody>
				{ isEditable && (
					<ModalFooter>
						<Button
							background="red.600"
							onClick={(e) => {
								e.stopPropagation();
								e.preventDefault();
								onClose();
								onOpenDeleteModal();
							}}>
                                Delete
						</Button>
					</ModalFooter>
				)}
			</ModalContent>
		</Modal>
	);
}
