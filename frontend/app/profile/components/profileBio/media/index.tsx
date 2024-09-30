import { Icon } from '@chakra-ui/icons'
import { IconButton } from '@chakra-ui/button'
import { useDisclosure } from '@chakra-ui/hooks'
import { Box, AspectRatio } from '@chakra-ui/layout'
import { Image as ChakraImage } from '@chakra-ui/image'
import { FaX } from 'react-icons/fa6'

import { MediaType } from '@/hooks/useMediaProcessing'
import ProfileMediaViewModal from './viewModal'
import ProfileMediaDeleteModal from './deleteModal'
import { useRef } from 'react'

interface Props {
    media: string
    isEditable: boolean
    handleDelete: (media: string) => void
}

/**
 * ProfileBioMedia component
 * This component is responsible for rendering the media section of the profile bio.
 * @returns {JSX.Element}
 */
export default function ProfileBioMedia({
    media,
    isEditable,
    handleDelete,
}: Props) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const {
        isOpen: isViewOpen,
        onOpen: onOpenView,
        onClose: onCloseView,
    } = useDisclosure()
    const {
        isOpen: isDeleteOpen,
        onOpen: onOpenDelete,
        onClose: onCloseDelete,
    } = useDisclosure()

    const mediaType =
        media.includes('.mp4') || media.includes('.mov')
            ? MediaType.VIDEO
            : MediaType.PHOTO

    return (
        <>
            <Box
                position="relative"
                w="full"
                display={{ base: 'block', md: 'none' }}
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
                            src={media}
                            _groupHover={{ transform: 'scale(1.05)' }}
                            transition="transform 0.1s ease-out"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />
                    ) : (
                        <Box
                            w="full"
                            h="full"
                            _groupHover={{ transform: 'scale(1.05)' }}
                            transition="transform 0.1s ease-out"
                        >
                            <video
                                src={media}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                                muted={true}
                                autoPlay={true}
                                playsInline={true}
                                onPlay={(e) => {
                                    // As soon as the video starts playing, pause it
                                    e.currentTarget.pause()
                                }}
                            />
                        </Box>
                    )}
                </AspectRatio>
            </Box>
            <Box
                position="relative"
                w="full"
                display={{ base: 'none', md: 'block' }}
                h="full"
                role="group"
                cursor="pointer"
                onClick={onOpenView}
            >
                <IconButton
                    display={isEditable ? 'block' : 'none'}
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
                    _hover={{ bgColor: 'red.700' }}
                    _groupHover={{
                        opacity: 1,
                    }}
                    transition="opacity 0.1s ease-out"
                    onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        onOpenDelete()
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
                            src={media}
                            _groupHover={{ transform: 'scale(1.025)' }}
                            transition="transform 0.1s ease-out"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />
                    ) : (
                        <Box
                            w="full"
                            h="full"
                            _groupHover={{ transform: 'scale(1.025)' }}
                            transition="transform 0.1s ease-out"
                            onMouseEnter={() => {
                                if (videoRef.current) {
                                    videoRef.current.play()
                                }
                            }}
                            onMouseLeave={() => {
                                if (videoRef.current) {
                                    videoRef.current.pause()
                                    videoRef.current.currentTime = 0
                                }
                            }}
                        >
                            <video
                                ref={videoRef}
                                src={media}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
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
                media={media}
                mediaType={mediaType}
                isOpen={isViewOpen}
                onClose={onCloseView}
                isEditable={isEditable}
                onOpenDeleteModal={onOpenDelete}
            />
            <ProfileMediaDeleteModal
                media={media}
                mediaType={mediaType}
                isOpen={isDeleteOpen}
                onClose={onCloseDelete}
                handleDelete={handleDelete}
            />
        </>
    )
}
