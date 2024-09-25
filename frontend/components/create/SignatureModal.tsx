import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    Icon,
    ModalBody,
    ModalCloseButton,
    Text,
    useDisclosure,
    VStack,
} from '@chakra-ui/react'
import { useLayoutEffect, useRef, useState, useEffect } from 'react'
import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas'
import { useCurrentCardInfo } from '@/hooks/useCurrentCardInfo'
import { CardPart } from '@/hooks/TradingCardInfo'
import { FaSignature } from 'react-icons/fa6'
import { recolor } from '../image_filters'
import { CheckIcon } from '@chakra-ui/icons'
import { b64toBlob, uploadAssetToS3 } from './Step3'
import { useAuthProps } from '@/hooks/useAuth'

/**
 * A function that returns the size of the window. Refreshes on page resize.
 * @returns the size of the window, in an array of two numbers.
 */
export function useWindowSize() {
    const [size, setSize] = useState([0, 0])
    useLayoutEffect(() => {
        /**
         * Function to be called when the window is resized.
         */
        function updateSize() {
            const defaultWidth = 600
            const defaultHeight = 150
            const newWidth = Math.min(defaultWidth, window.innerWidth - 100)
            const newHeight = Math.min(newWidth * (150 / 600), defaultHeight)
            setSize([newWidth, newHeight])
        }
        window.addEventListener('resize', updateSize)
        updateSize()
        return () => {
            return window.removeEventListener('resize', updateSize)
        }
    }, [])
    return size
}

interface SignatureModalProps {
    buttonText?: string
    inlineImage?: boolean
    width?: string
    height?: string
    auth: useAuthProps
}

/**
 * All contents within the signature modal.
 * @returns the React component for the signature modal.
 */
function SignatureModal(props: SignatureModalProps, { ...rest }) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const currentInfo = useCurrentCardInfo()

    const [width, windowHeight] = useWindowSize()

    const canvasStyle = {
        border: '0.0625rem solid #9c9c9c',
        borderRadius: '0.25rem',
    }

    /**
     * Function to be called when the modal is opened.
     * This clears the eraser
     */
    function handleOnOpen() {
        onOpen()
        // Sleep for 100ms to allow the canvas to load
        setTimeout(() => {
            const canvas_with_mask = document.querySelector(
                '#react-sketch-canvas__stroke-group-0',
            )
            canvas_with_mask?.removeAttribute('mask')
        }, 100)
    }

    /**
     * Converts a number to a string with "px" appended.
     * @param n the number to change
     * @returns the string with "px" appended
     */
    function toPx(n: number) {
        return `${n}px`
    }

    /**
     * Uploads the signature to S3.
     * @param base64 the base64 string of the signature
     * @returns the filename of the signature
     */
    async function uploadSignatureToS3(base64: string) {
        const blob = await b64toBlob(base64)
        let username = (await props.auth.currentAuthenticatedUser()).username
        if (username === '') {
            username = `${Math.random() * 100000000000000000}`
        }

        const current_unix_time = Math.floor(Date.now() / 1000)
        const filename = `${username}-${current_unix_time}.png`
        await uploadAssetToS3(filename, blob, 'signature', 'image/png')

        return filename
    }

    /**
     * Ref for the contents of the signature modal.
     * @returns the React component for the contents of the signature modal.
     */
    function ModalContents() {
        const contentsRef = useRef<ReactSketchCanvasRef>(null)
        useEffect(() => {
            // Load the previous drawing
            const savedData = localStorage.getItem('prevdrawing')
            if (savedData && contentsRef.current) {
                contentsRef.current.loadPaths(JSON.parse(savedData))
            }
        }, [])
        const screenThreshold = 350
        const headers: Headers = new Headers()
        headers.append('Content-Type', 'application/json')
        return (
            <ModalContent
                backgroundColor={'grey.700'}
                maxW={{ base: '600px', md: '700px' }}
                h={'auto'}
                color={'white'}
            >
                {width < screenThreshold ? (
                    <>
                        <ModalBody>
                            Screen too narrow! Rotate your device to sign your
                            card.
                        </ModalBody>
                        <ModalCloseButton />
                    </>
                ) : (
                    <>
                        <ModalHeader alignSelf="center">
                            Add a Signature
                        </ModalHeader>
                        <ModalBody>
                            <VStack alignContent={'center'}>
                                <Text>
                                    Use the box below to sign your card!
                                </Text>
                                <ReactSketchCanvas
                                    ref={contentsRef}
                                    style={canvasStyle}
                                    width={toPx(width - 50)}
                                    height={toPx(windowHeight - 15)}
                                    strokeWidth={8}
                                    strokeColor={
                                        currentInfo.curCard.signatureColor
                                            ? currentInfo.curCard.signatureColor
                                            : 'white'
                                    }
                                    canvasColor="transparent"
                                    // backgroundImage="https://i.postimg.cc/mD8xwJJS/Signature.png"
                                    preserveBackgroundImageAspectRatio="xMinYMid slice"
                                    exportWithBackgroundImage={false}
                                />
                            </VStack>
                        </ModalBody>
                        <ModalCloseButton />
                    </>
                )}

                <ModalFooter>
                    {width >= screenThreshold ? (
                        <>
                            <Button
                                colorScheme="blue"
                                mr={3}
                                onClick={() => {
                                    contentsRef.current?.clearCanvas() // Access the ref object
                                }}
                            >
                                Clear Drawing
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    // Export paths
                                    contentsRef.current
                                        ?.exportPaths()
                                        .then((canvasPath) => {
                                            localStorage.setItem(
                                                'prevdrawing',
                                                JSON.stringify(canvasPath),
                                            )
                                        })
                                        .catch((error) => {
                                            console.error(
                                                'Error exporting paths:',
                                                error,
                                            )
                                        })
                                    // Export PNG. Broken when backgroundImage is set
                                    contentsRef.current
                                        ?.exportImage('png')
                                        .then((URL: string) => {
                                            recolor(
                                                URL,
                                                currentInfo.curCard
                                                    .signatureColor
                                                    ? currentInfo.curCard
                                                          .signatureColor
                                                    : 'white',
                                                headers,
                                                true,
                                            ).then(async (newURL) => {
                                                const filename =
                                                    await uploadSignatureToS3(
                                                        newURL,
                                                    )
                                                currentInfo.setCurCard({
                                                    ...currentInfo.curCard,
                                                    signature: newURL,
                                                    frontIsShowing: true,
                                                    signatureS3URL: `https://gamechangers-media-uploads.s3.amazonaws.com/signature/${filename}`,
                                                    partsToRecolor: [
                                                        ...currentInfo.curCard
                                                            .partsToRecolor,
                                                        CardPart.SIGNATURE,
                                                    ],
                                                })
                                            })
                                        })
                                        .catch((e: Error) => {
                                            console.error(e)
                                        })
                                    onClose()
                                }}
                            >
                                Upload
                            </Button>
                        </>
                    ) : null}
                </ModalFooter>
            </ModalContent>
        )
    }

    return (
        <>
            {/* Can give this button a variant if you need to style it different */}
            <Button
                variant={'white'}
                fontSize={{ base: 'md', md: 'md', lg: '16px' }}
                fontFamily={'Roboto'}
                {...rest}
                onClick={handleOnOpen}
                justifyContent={{ base: 'center', sm: 'space-between' }}
                px={'24px'}
                {...(props.height ? { height: props.height } : {})}
                {...(props.width ? { width: props.width } : {})}
            >
                {props.buttonText}
                {props.inlineImage ? (
                    currentInfo.curCard.signature ? (
                        <CheckIcon
                            paddingRight={1}
                            boxSize={5}
                            color="green.100"
                        />
                    ) : (
                        <Icon
                            color={'#27CE00'}
                            as={FaSignature}
                            style={{ marginLeft: '10px' }}
                        />
                    )
                ) : (
                    <Icon color={'#27CE00'} as={FaSignature} />
                )}
            </Button>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContents />
            </Modal>
        </>
    )
}

export default SignatureModal
