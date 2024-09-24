import { Button, Grid, GridItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import SocialMediaInput from "./socialMediaInput";

interface EditSocialMediaModalProps {
	isOpen: boolean;
	onClose: () => void;
	undoChanges: () => void;
	checkUpdate: () => void;
	buttonClicked: boolean;
	setButtonClicked: (value: boolean) => void;
	editableFacebookLink: string;
	setEditableFacebookLink: (value: string) => void;
	editableXLink: string;
	setEditableXLink: (value: string) => void;
	editableTiktokLink: string;
	setEditableTiktokLink: (value: string) => void;
	editableInstagramLink: string;
	setEditableInstagramLink: (value: string) => void;
	editableYoutubeLink: string;
	setEditableYoutubeLink: (value: string) => void;
	editableSnapchatLink: string;
	setEditableSnapchatLink: (value: string) => void;
	validateSocialLink: (link: string, prefix: string) => boolean;
}

/**
 * This modal is a more slim version of the Edit Profile that only edits social media
 * @param props - The props of the component
 */
export default function EditSocialMediaModal(props: EditSocialMediaModalProps) {

	return (
		<Modal isOpen={props.isOpen} onClose={props.onClose} isCentered size="md" preserveScrollBarGap closeOnOverlayClick={false}>
			<ModalOverlay />
			<ModalContent
				minW={{ base: "85%", md: "70%", xl: "800px" }}
				maxW={{ base: "85%", md: "70%", xl: "800px" }}
				rounded="xl"
				bg="#1B1B1B"
				color="white"
			>
				<ModalHeader>Edit Social Media</ModalHeader>
				<ModalCloseButton onClick={props.undoChanges} />
				<ModalBody>
					<Grid templateColumns={{ base: "1fr", xl: "repeat(3, 1fr)" }} gap={4}>
						{/* Facebook */}
						<GridItem>
							<SocialMediaInput
								name="Facebook"
								editableSocialMediaLink={props.editableFacebookLink}
								setEditableSocialMediaLink={props.setEditableFacebookLink}
								validSocialMediaPrefix="https://www.facebook.com/"
								validateSocialLink={props.validateSocialLink}
							/>
						</GridItem>
						{/* X */}
						<GridItem>
							<SocialMediaInput
								name="X"
								editableSocialMediaLink={props.editableXLink}
								setEditableSocialMediaLink={props.setEditableXLink}
								validSocialMediaPrefix="https://x.com/"
								validateSocialLink={props.validateSocialLink}
							/>
						</GridItem>
						{/* Tiktok */}
						<GridItem>
							<SocialMediaInput
								name="Tiktok"
								editableSocialMediaLink={props.editableTiktokLink}
								setEditableSocialMediaLink={props.setEditableTiktokLink}
								validSocialMediaPrefix="https://www.tiktok.com/@"
								validateSocialLink={props.validateSocialLink}
							/>
						</GridItem>
						{/* Instagram */}
						<GridItem>
							<SocialMediaInput
								name="Instagram"
								editableSocialMediaLink={props.editableInstagramLink}
								setEditableSocialMediaLink={props.setEditableInstagramLink}
								validSocialMediaPrefix="https://www.instagram.com/"
								validateSocialLink={props.validateSocialLink}
							/>
						</GridItem>
						{/* YouTube */}
						<GridItem>
							<SocialMediaInput
								name="YouTube"
								editableSocialMediaLink={props.editableYoutubeLink}
								setEditableSocialMediaLink={props.setEditableYoutubeLink}
								validSocialMediaPrefix="https://www.youtube.com/channel/"
								validateSocialLink={props.validateSocialLink}
							/>
						</GridItem>
						{/* Snapchat */}
						<GridItem>
							<SocialMediaInput
								name="Snapchat"
								editableSocialMediaLink={props.editableSnapchatLink}
								setEditableSocialMediaLink={props.setEditableSnapchatLink}
								validSocialMediaPrefix="https://www.snapchat.com/add/"
								validateSocialLink={props.validateSocialLink}
							/>
						</GridItem>
					</Grid>
				</ModalBody>
				<ModalFooter>
					<Button variant="next" isLoading={props.buttonClicked} onClick={() => {
						props.setButtonClicked(true);
						props.checkUpdate();
					}}>Save Changes</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
