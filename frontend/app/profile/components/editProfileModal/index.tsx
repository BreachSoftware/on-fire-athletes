import { Input } from "@chakra-ui/input";
import { Button } from "@chakra-ui/button";
import { Flex, Text, Grid, GridItem } from "@chakra-ui/layout";
import { Modal, ModalOverlay, ModalContent, ModalBody, ModalHeader, ModalFooter, ModalCloseButton } from "@chakra-ui/modal";

interface Props {
	isOpen: boolean;
	onClose: () => void;
}

/**
 * EditProfileModal
 * @param {boolean} isOpen
 * @param {function} onClose
 * @returns {JSX.Element} A modal component for editing your profile
 */
export default function EditProfileModal({ isOpen, onClose }: Props) {
	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered size="xl" preserveScrollBarGap closeOnOverlayClick={false} >
			<ModalOverlay />
			<ModalContent
				minW={{ base: "85%", md: "70%", xl: "800px" }}
				maxW={{ base: "85%", md: "70%", xl: "800px" }}
				bgGradient={"linear(to-b, gray.500, gray.200)"}
			>
				<ModalHeader>Edit Your Account</ModalHeader>
				<ModalCloseButton onClick={undoProfileChanges} />
				<ModalBody>
					<Grid templateColumns={{ base: "1fr", xl: "repeat(6, 1fr)" }} gap={4}>
						<GridItem colSpan={{ base: 1, xl: 3 }}>
							<Text>First Name *</Text>
							<Input
								variant={"basicInput"}
								backgroundColor={"gray.200"}
								border={"solid 1px #88888888"}
								placeholder={"First Name *"}
								value={editableFirstName}
								onChange={(e) => {
									setEditableFirstName(e.target.value);
								}}
							/>
						</GridItem>
						<GridItem colSpan={{ base: 1, xl: 3 }}>
							<Text>Last Name *</Text>
							<Input
								variant={"basicInput"}
								backgroundColor={"gray.200"}
								border={"solid 1px #88888888"}
								placeholder={"Last Name *"}
								value={editableLastName}
								onChange={(e) => {
									setEditableLastName(e.target.value);
								}}
							/>
						</GridItem>
						<GridItem colSpan={{ base: 1, xl: 3 }}>
							<Text>Position *</Text>
							<Input
								variant={"basicInput"}
								backgroundColor={"gray.200"}
								border={"solid 1px #88888888"}
								placeholder={"Position"}
								value={editablePosition}
								onChange={(e) => {
									setEditablePosition(e.target.value);
								}}
							/>
						</GridItem>
						<GridItem colSpan={{ base: 1, xl: 3 }}>
							<Text>Team Name/Hometown *</Text>
							<Input
								variant={"basicInput"}
								backgroundColor={"gray.200"}
								border={"solid 1px #88888888"}
								placeholder={"Team Name, State"}
								value={editableTeamHometown}
								onChange={(e) => {
									setEditableTeamHometown(e.target.value);
								}}
							/>
						</GridItem>
						<GridItem colSpan={{ base: 1, xl: 3 }}>
							<Text>About You</Text>
							<Textarea
								backgroundColor={"gray.200"}
								placeholder={"Write your bio..."}
								borderRadius={"none"}
								px="20px"
								py="12px"
								color={"white"}
								border={"solid 1px #88888888"}
								h="200px"
								resize="none"
								value={editableBio}
								onChange={(e) => {
									setEditableBio(e.target.value);
								}}
							/>
						</GridItem>
						<GridItem colSpan={{ base: 1, xl: 3 }}>
							<Text>Profile Picture</Text>
							<Flex justifyContent="space-between" alignItems="center" mx={{ base: "2%", md: "10%" }}>
								<Flex flexDir="column" py="10px" mr="20px">
									<DropzoneButton
										buttonText={"UPLOAD"}
										svgcomp={"profile"}
										onProfileImageSelect={processProfileImageSelect}
										uploadComplete={uploadComplete}
									/>
									<Button
										bgColor="red.600"
										color="white"
										h="28px"
										w="80px"
										_hover={{
											md: {
												backgroundColor: "red.700",
											}
										}}
										letterSpacing={"2px"}
										alignSelf="center"
										fontSize="12px"
										onClick={() => {
											setEditableProfilePicture("/placeholderProfile.jpg");
										}}
									>
											REMOVE
									</Button>
									<Spacer/>
								</Flex>
								<Avatar
									size="2xl"
									src={editableProfilePicture || "/placeholderProfile.jpg"}
									sx={{
										transition: "filter 0.3s ease-in-out",
										aspectRatio: "1 / 1",
									}}
								/>
							</Flex>
						</GridItem>

						{/* Socials */}
						<GridItem colSpan={{ base: 1, xl: 2 }}>
							<Text>Social Media</Text>
							<SocialMediaInput
								name="Facebook"
								editableSocialMediaLink={editableFacebookLink}
								setEditableSocialMediaLink={setEditableFacebookLink}
								validSocialMediaPrefix="https://www.facebook.com/"
								validateSocialLink={validateSocialLink}
							/>
						</GridItem>
						<GridItem colSpan={{ base: 1, xl: 2 }} display="flex" alignItems="flex-end">
							<SocialMediaInput
								name="X"
								editableSocialMediaLink={editableXLink}
								setEditableSocialMediaLink={setEditableXLink}
								validSocialMediaPrefix="https://x.com/"
								validateSocialLink={validateSocialLink}
							/>
						</GridItem>
						<GridItem colSpan={{ base: 1, xl: 2 }} display="flex" alignItems="flex-end">
							<SocialMediaInput
								name="TikTok"
								editableSocialMediaLink={editableTiktokLink}
								setEditableSocialMediaLink={setEditableTiktokLink}
								validSocialMediaPrefix="https://www.tiktok.com/"
								validateSocialLink={validateSocialLink}
							/>
						</GridItem>
						<GridItem colSpan={{ base: 1, xl: 2 }} display="flex" alignItems="flex-end">
							<SocialMediaInput
								name="Instagram"
								editableSocialMediaLink={editableInstagramLink}
								setEditableSocialMediaLink={setEditableInstagramLink}
								validSocialMediaPrefix="https://www.instagram.com/"
								validateSocialLink={validateSocialLink}
							/>
						</GridItem>
						<GridItem colSpan={{ base: 1, xl: 2 }} display="flex" alignItems="flex-end">
							<SocialMediaInput
								name="YouTube"
								editableSocialMediaLink={editableYoutubeLink}
								setEditableSocialMediaLink={setEditableYoutubeLink}
								validSocialMediaPrefix="https://www.youtube.com/"
								validateSocialLink={validateSocialLink}
							/>
						</GridItem>
						<GridItem colSpan={{ base: 1, xl: 2 }} display="flex" alignItems="flex-end">
							<SocialMediaInput
								name="Snapchat"
								editableSocialMediaLink={editableSnapchatLink}
								setEditableSocialMediaLink={setEditableSnapchatLink}
								validSocialMediaPrefix="https://www.snapchat.com/add"
								validateSocialLink={validateSocialLink}
							/>
						</GridItem>
					</Grid>
				</ModalBody>

				<ModalFooter>
					<Flex justifyContent={"center"} maxW={"100%"} w={"100%"} >
						<Button maxW={{ base: "100%", sm:"75%", md:"60%", lg:"50%" }} variant="next" isLoading={buttonClicked} onClick={() => {
							setButtonClicked(true);
							checkUpdate();
						}}>Save Changes</Button>
					</Flex>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
