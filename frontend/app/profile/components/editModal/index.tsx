import {
    Modal,
    ModalBody,
    ModalHeader,
    ModalFooter,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
} from '@chakra-ui/modal'
import { Button } from '@chakra-ui/button'
import { Textarea } from '@chakra-ui/textarea'
import { Text, Flex, Grid, GridItem } from '@chakra-ui/layout'

import EditProfileInput from './input'
import SocialMediaInput from '../socialMediaInput'
import { validateSocialLink } from '../../helpers'
import ProfileAvatarInput from './avatar'
import { ProfileInfo } from '../../page'

interface Props {
    // Modal Props
    isOpen: boolean
    onClose: () => void

    // Actions
    checkUpdate: () => void
    undoProfileChanges: () => void

    // Profile Info
    profileInfo?: ProfileInfo

    // Values
    editableFirstName: string
    setEditableFirstName: (value: string) => void
    editableLastName: string
    setEditableLastName: (value: string) => void
    editablePosition: string
    setEditablePosition: (value: string) => void
    editableTeamHometown: string
    setEditableTeamHometown: (value: string) => void
    editableBio: string
    setEditableBio: (value: string) => void
    editableProfilePicture: string
    setEditableProfilePicture: (value: string) => void
    editableFacebookLink: string
    setEditableFacebookLink: (value: string) => void
    editableXLink: string
    setEditableXLink: (value: string) => void
    editableTiktokLink: string
    setEditableTiktokLink: (value: string) => void
    editableInstagramLink: string
    setEditableInstagramLink: (value: string) => void
    editableYoutubeLink: string
    setEditableYoutubeLink: (value: string) => void
    editableSnapchatLink: string
    setEditableSnapchatLink: (value: string) => void
}

/**
 * EditProfileModal component
 * The edit profile modal component
 * @param {boolean} isOpen
 * @param {() => void} onClose
 * @returns {JSX.Element}
 */
export default function EditProfileModal({
    isOpen,
    onClose,
    checkUpdate,
    undoProfileChanges,

    profileInfo,

    editableFirstName,
    setEditableFirstName,
    editableLastName,
    setEditableLastName,
    editablePosition,
    setEditablePosition,
    editableTeamHometown,
    setEditableTeamHometown,
    editableBio,
    setEditableBio,
    editableProfilePicture,
    setEditableProfilePicture,
    editableFacebookLink,
    setEditableFacebookLink,
    editableXLink,
    setEditableXLink,
    editableTiktokLink,
    setEditableTiktokLink,
    editableInstagramLink,
    setEditableInstagramLink,
    editableYoutubeLink,
    setEditableYoutubeLink,
    editableSnapchatLink,
    setEditableSnapchatLink,
}: Props) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            isCentered
            size={{ base: 'full', md: 'xl' }}
            preserveScrollBarGap
            scrollBehavior="inside"
            closeOnOverlayClick={false}
        >
            <ModalOverlay />
            <ModalContent
                minW={{ base: '85%', md: '70%', xl: '800px' }}
                maxW={{ base: '85%', md: '70%', xl: '800px' }}
                rounded="xl"
                bg="#1B1B1B"
                color="white"
            >
                <ModalHeader>Edit Your Account</ModalHeader>
                <ModalCloseButton onClick={undoProfileChanges} />
                <ModalBody>
                    <Grid
                        templateColumns={{ base: '1fr', xl: 'repeat(6, 1fr)' }}
                        gap={4}
                    >
                        <GridItem colSpan={{ base: 1, xl: 3 }}>
                            <Text>First Name *</Text>
                            <EditProfileInput
                                placeholder={'First Name *'}
                                value={editableFirstName}
                                onChange={(e) => {
                                    setEditableFirstName(e.target.value)
                                }}
                            />
                        </GridItem>
                        <GridItem colSpan={{ base: 1, xl: 3 }}>
                            <Text>Last Name *</Text>
                            <EditProfileInput
                                placeholder={'Last Name *'}
                                value={editableLastName}
                                onChange={(e) => {
                                    setEditableLastName(e.target.value)
                                }}
                            />
                        </GridItem>
                        <GridItem colSpan={{ base: 1, xl: 3 }}>
                            <Text>Position *</Text>
                            <EditProfileInput
                                placeholder={'Position'}
                                value={editablePosition}
                                onChange={(e) => {
                                    setEditablePosition(e.target.value)
                                }}
                            />
                        </GridItem>
                        <GridItem colSpan={{ base: 1, xl: 3 }}>
                            <Text>Team Name/Hometown *</Text>
                            <EditProfileInput
                                placeholder={'Team Name, State'}
                                value={editableTeamHometown}
                                onChange={(e) => {
                                    setEditableTeamHometown(e.target.value)
                                }}
                            />
                        </GridItem>
                        <GridItem colSpan={{ base: 1, xl: 3 }}>
                            <Text>About You</Text>
                            <Textarea
                                backgroundColor="#2B2B2B"
                                border={'solid 1px #323232'}
                                rounded="md"
                                placeholder={'Write your bio...'}
                                px="20px"
                                py="12px"
                                color={'white'}
                                h="200px"
                                resize="none"
                                value={editableBio}
                                onChange={(e) => {
                                    setEditableBio(e.target.value)
                                }}
                            />
                        </GridItem>
                        <GridItem colSpan={{ base: 1, xl: 3 }}>
                            <Text>Profile Picture</Text>
                            <ProfileAvatarInput
                                profileInfo={profileInfo}
                                editableProfilePicture={editableProfilePicture}
                                setEditableProfilePicture={
                                    setEditableProfilePicture
                                }
                            />
                        </GridItem>

                        {/* Socials */}
                        <GridItem colSpan={{ base: 1, xl: 2 }}>
                            <Text>Social Media</Text>
                            <SocialMediaInput
                                name="Facebook"
                                editableSocialMediaLink={editableFacebookLink}
                                setEditableSocialMediaLink={
                                    setEditableFacebookLink
                                }
                                validSocialMediaPrefix="https://www.facebook.com/"
                                validateSocialLink={validateSocialLink}
                            />
                        </GridItem>
                        <GridItem
                            colSpan={{ base: 1, xl: 2 }}
                            display="flex"
                            alignItems="flex-end"
                        >
                            <SocialMediaInput
                                name="X"
                                editableSocialMediaLink={editableXLink}
                                setEditableSocialMediaLink={setEditableXLink}
                                validSocialMediaPrefix="https://x.com/"
                                validateSocialLink={validateSocialLink}
                            />
                        </GridItem>
                        <GridItem
                            colSpan={{ base: 1, xl: 2 }}
                            display="flex"
                            alignItems="flex-end"
                        >
                            <SocialMediaInput
                                name="TikTok"
                                editableSocialMediaLink={editableTiktokLink}
                                setEditableSocialMediaLink={
                                    setEditableTiktokLink
                                }
                                validSocialMediaPrefix="https://www.tiktok.com/"
                                validateSocialLink={validateSocialLink}
                            />
                        </GridItem>
                        <GridItem
                            colSpan={{ base: 1, xl: 2 }}
                            display="flex"
                            alignItems="flex-end"
                        >
                            <SocialMediaInput
                                name="Instagram"
                                editableSocialMediaLink={editableInstagramLink}
                                setEditableSocialMediaLink={
                                    setEditableInstagramLink
                                }
                                validSocialMediaPrefix="https://www.instagram.com/"
                                validateSocialLink={validateSocialLink}
                            />
                        </GridItem>
                        <GridItem
                            colSpan={{ base: 1, xl: 2 }}
                            display="flex"
                            alignItems="flex-end"
                        >
                            <SocialMediaInput
                                name="YouTube"
                                editableSocialMediaLink={editableYoutubeLink}
                                setEditableSocialMediaLink={
                                    setEditableYoutubeLink
                                }
                                validSocialMediaPrefix="https://www.youtube.com/"
                                validateSocialLink={validateSocialLink}
                            />
                        </GridItem>
                        <GridItem
                            colSpan={{ base: 1, xl: 2 }}
                            display="flex"
                            alignItems="flex-end"
                        >
                            <SocialMediaInput
                                name="Snapchat"
                                editableSocialMediaLink={editableSnapchatLink}
                                setEditableSocialMediaLink={
                                    setEditableSnapchatLink
                                }
                                validSocialMediaPrefix="https://www.snapchat.com/add"
                                validateSocialLink={validateSocialLink}
                            />
                        </GridItem>
                    </Grid>
                </ModalBody>

                <ModalFooter>
                    <Flex justifyContent={'center'} maxW={'100%'} w={'100%'}>
                        <Button
                            maxW={{
                                base: '100%',
                                sm: '75%',
                                md: '60%',
                                lg: '50%',
                            }}
                            variant="next"
                            onClick={() => {
                                checkUpdate()
                            }}
                        >
                            Save Changes
                        </Button>
                    </Flex>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
