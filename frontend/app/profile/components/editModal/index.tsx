import {
    Modal,
    ModalBody,
    ModalHeader,
    ModalFooter,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
} from '@chakra-ui/modal'
import { Avatar } from '@chakra-ui/avatar'
import { Button } from '@chakra-ui/button'
import { useEffect, useState } from 'react'
import { Textarea } from '@chakra-ui/textarea'
import { Text, Flex, Grid, GridItem } from '@chakra-ui/layout'

import EditProfileInput from './input'
import { useAuth } from '@/hooks/useAuth'
import SocialMediaInput from '../socialMediaInput'
import { validateSocialLink } from '../../helpers'
import { resize } from '@/components/image_filters'
import DropzoneButton from '@/components/create/dropzoneButton'
import { b64toBlob, uploadAssetToS3 } from '@/components/create/Step3'

interface Props {
    // Modal Props
    isOpen: boolean
    onClose: () => void

    // Actions
    checkUpdate: () => void
    undoProfileChanges: () => void

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
    const { currentAuthenticatedUser } = useAuth()

    const [uploadComplete, setUploadComplete] = useState(false)

    /**
     * This function processes the photo selection
     * @param files the files to be processed
     */
    async function processProfileImageSelect(files: FileList) {
        const maxResolution = 2160
        const myPhoto = URL.createObjectURL(files[0])

        // Create an image element
        const img: HTMLImageElement = await new Promise<HTMLImageElement>(
            (resolve, reject) => {
                const imgElement: HTMLImageElement = new window.Image() // Use the global Image constructor
                imgElement.onload = () => {
                    return resolve(imgElement)
                }
                imgElement.onerror = reject
                imgElement.src = myPhoto
            },
        )

        // Calculate the new dimensions while preserving aspect ratio
        let newWidth = 0
        let newHeight = 0
        if (img.width > img.height) {
            newWidth = Math.max(img.width, maxResolution)
            newHeight = (newWidth * img.height) / img.width
        } else {
            newHeight = Math.max(img.height, maxResolution)
            newWidth = (newHeight * img.width) / img.height
        }

        const resizedPhoto = await resize(myPhoto, newWidth, newHeight)
        const resizedPhotoBlob = await b64toBlob(resizedPhoto)

        // Upload the photo to S3
        const user = await currentAuthenticatedUser()
        const user_id = user.userId
        const current_unix_time = Math.floor(Date.now() / 1000)
        const filename = `${user_id}-${current_unix_time}.jpeg`

        await uploadAssetToS3(
            filename,
            resizedPhotoBlob,
            'profile_media',
            'image/png',
        )

        setEditableProfilePicture(
            `https://gamechangers-media-uploads.s3.amazonaws.com/profile_media/${filename}`,
        )
        setUploadComplete(true)
    }

    useEffect(() => {
        if (uploadComplete) {
            const timer = setTimeout(() => {
                setUploadComplete(false)
            }, 5000) // Reset after 5 seconds, adjust time as needed

            return () => {
                return clearTimeout(timer)
            } // Cleanup timer
        }

        return () => {}
    }, [uploadComplete])

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
                            <Flex
                                justifyContent="space-between"
                                alignItems="center"
                                mx={{ base: '2%', md: '10%' }}
                            >
                                <Flex flexDir="column" py="10px" mr="20px">
                                    <DropzoneButton
                                        buttonText={'UPLOAD'}
                                        svgcomp={'profile'}
                                        onProfileImageSelect={
                                            processProfileImageSelect
                                        }
                                        uploadComplete={uploadComplete}
                                    />
                                    <Button
                                        bgColor="red.600"
                                        color="white"
                                        h="28px"
                                        w="80px"
                                        _hover={{
                                            md: {
                                                backgroundColor: 'red.700',
                                            },
                                        }}
                                        letterSpacing={'2px'}
                                        alignSelf="center"
                                        fontSize="12px"
                                        onClick={() => {
                                            setEditableProfilePicture(
                                                '/placeholderProfile.jpg',
                                            )
                                        }}
                                    >
                                        REMOVE
                                    </Button>
                                </Flex>
                                <Avatar
                                    size="2xl"
                                    src={
                                        editableProfilePicture ||
                                        '/placeholderProfile.jpg'
                                    }
                                    sx={{
                                        transition: 'filter 0.3s ease-in-out',
                                        aspectRatio: '1 / 1',
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
