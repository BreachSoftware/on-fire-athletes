import { useCurrentCardInfo } from '@/hooks/useCurrentCardInfo'
import { RepeatIcon } from '@chakra-ui/icons'
import {
    Box,
    Icon,
    IconButton,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
    VStack,
} from '@chakra-ui/react'
import { useRef, useState, useEffect } from 'react'
import { FaImage, FaVideo } from 'react-icons/fa'
import { FaSignature } from 'react-icons/fa6'

type SliderProps = {
    minValue: number
    maxValue: number
    onChange: (value: number) => void
    startingValue?: number
}

const sliderWidth = '20px'

/**
 * A slider that changes a number. Uses Chakra UI.
 * Requires a state variable to pass in numToChange.
 * @param sliderProps the numToChange, onChange, minValue, and maxValue.
 * @returns The slider component.
 */
function MySlider(sliderProps: SliderProps) {
    const startVal =
        sliderProps.startingValue !== undefined ? sliderProps.startingValue : 50 // Set default value to 50 if startingValue is not provided
    const sliderWidth = 12

    return (
        <>
            <Slider
                aria-label="slider-for-resize"
                defaultValue={startVal}
                orientation="vertical"
                h="160px"
                w={`${sliderWidth}px`}
                min={sliderProps.minValue}
                max={sliderProps.maxValue}
                marginX={'10px'}
                step={(sliderProps.maxValue - sliderProps.minValue) / 100} // may not be needed
                onChange={sliderProps.onChange}
            >
                <SliderTrack
                    bg="gray"
                    w={`${sliderWidth * 1.2}px`}
                    clipPath={'polygon(10% 0, 90% 0, 50% 100%)'}
                >
                    <SliderFilledTrack bg="green.100" />
                </SliderTrack>
                <SliderThumb boxSize={'15px'} />
            </Slider>
        </>
    )
}

/**
 * The slider for the hero.
 * @returns the component for the hero slider.
 */
function HeroSlider({ startingValue }: { startingValue: number }) {
    const cardHook = useCurrentCardInfo()
    return (
        <>
            <MySlider
                onChange={(value) => {
                    cardHook.setCurCard({
                        ...cardHook.curCard,
                        heroWidth: value,
                    })
                }}
                minValue={150}
                maxValue={800}
                startingValue={startingValue}
            />
            <Icon
                mb={'30px'}
                h={sliderWidth}
                w={sliderWidth}
                color={'#27CE00'}
                boxSize={'1.6em'}
                as={FaImage}
            />
        </>
    )
}

/**
 * The slider for the signature.
 * @returns the component for the signature slider.
 */
function SignatureSlider({ startingValue }: { startingValue: number }) {
    const cardHook = useCurrentCardInfo()
    return (
        <>
            <MySlider
                onChange={(value) => {
                    cardHook.setCurCard({
                        ...cardHook.curCard,
                        signatureWidth: value,
                    })
                }}
                minValue={80}
                maxValue={350}
                startingValue={startingValue}
            />
            <Box
                mb={'30px'}
                h={sliderWidth}
                w={sliderWidth}
                transform={'scale(1.3)'}
            >
                <Icon color={'#27CE00'} as={FaSignature} />
            </Box>
        </>
    )
}

/**
 * The slider for the video.
 * @returns the component for the video slider.
 */
function VideoSlider({ startingValue }: { startingValue: number }) {
    const cardHook = useCurrentCardInfo()
    return (
        <>
            <MySlider
                onChange={(value) => {
                    cardHook.setCurCard({
                        ...cardHook.curCard,
                        backVideoWidth: value,
                        backVideoHeight: (value * 9) / 16,
                    })
                }}
                minValue={350}
                maxValue={1500}
                startingValue={startingValue}
            />
            <Icon
                mb={'30px'}
                h={sliderWidth}
                w={sliderWidth}
                color={'#27CE00'}
                boxSize={'1.6em'}
                as={FaVideo}
            />
        </>
    )
}

/**
 * Rotates the ReactPlayer video element
 */
function RotateVideoButton() {
    const cardHook = useCurrentCardInfo()
    return (
        <>
            <IconButton
                icon={<RepeatIcon boxSize={6} />}
                aria-label="rotate-video"
                transform="scaleX(-1)"
                color="#27CE00"
                borderRadius="full"
                minW="12px"
                w="40px"
                h="40px"
                background={'white'}
                onClick={() => {
                    cardHook.setCurCard({
                        ...cardHook.curCard,
                        backVideoRotation:
                            cardHook.curCard.backVideoRotation + 90,
                    })
                }}
            />
        </>
    )
}

/**
 * The array of sliders for the image sliders.
 * @returns the component for the image sliders.
 */
export default function OnFireCardSliders() {
    const cardHook = useCurrentCardInfo()
    const startingHeroWidth = useRef(cardHook.curCard.heroWidth)
    const startingSigWidth = useRef(cardHook.curCard.signatureWidth)
    const [shouldShowPhotoSlider, setShouldShowPhotoSlider] = useState(
        cardHook.curCard.frontPhotoURL !== '',
    )
    const [shouldShowSignatureSlider, setShouldShowSignatureSlider] = useState(
        cardHook.curCard.signature !== '' &&
            cardHook.curCard.signature !== undefined,
    )
    const [shouldShowVideoSlider, setShouldShowVideoSlider] = useState(
        cardHook.curCard.backVideoURL !== '',
    )

    const heroSlider = <HeroSlider startingValue={startingHeroWidth.current} />
    // const sigSlider = <SignatureSlider startingValue={startingSigWidth.current} />;
    const videoSlider = (
        <VideoSlider startingValue={cardHook.curCard.backVideoWidth} />
    )
    const rotateVideoButton = <RotateVideoButton />

    useEffect(() => {
        startingHeroWidth.current = cardHook.curCard.heroWidth
        startingSigWidth.current = cardHook.curCard.signatureWidth
    }, [cardHook.curCard])

    const [hasSetFirst, setHasSetFirst] = useState(false)
    let mediaWasFirst = true

    if (
        (shouldShowPhotoSlider || shouldShowVideoSlider) &&
        !shouldShowSignatureSlider &&
        !hasSetFirst
    ) {
        mediaWasFirst = true
        setHasSetFirst(true)
    } else if (
        !(shouldShowPhotoSlider || shouldShowVideoSlider) &&
        shouldShowSignatureSlider &&
        !hasSetFirst
    ) {
        mediaWasFirst = false
        setHasSetFirst(true)
    }

    useEffect(() => {
        if (cardHook.curCard.stepNumber !== 3) {
            setShouldShowPhotoSlider(false)
            setShouldShowSignatureSlider(false)
            setShouldShowVideoSlider(false)
        } else {
            setShouldShowPhotoSlider(cardHook.curCard.frontPhotoURL !== '')
            setShouldShowSignatureSlider(
                cardHook.curCard.signature !== '' &&
                    cardHook.curCard.signature !== undefined,
            )
            setShouldShowVideoSlider(cardHook.curCard.backVideoURL !== '')
        }
    }, [
        cardHook.curCard.backVideoURL,
        cardHook.curCard.frontIsShowing,
        cardHook.curCard.frontPhotoURL,
        cardHook.curCard.signature,
        cardHook.curCard.stepNumber,
    ])

    /**
     * Determines which slider should be displayed.
     * @returns the slider that should be displayed
     */
    function determineMediaSlider() {
        const thingToShow = cardHook.curCard.frontIsShowing
            ? heroSlider
            : videoSlider
        if (thingToShow === heroSlider && shouldShowPhotoSlider) {
            return thingToShow
        }
        if (thingToShow === videoSlider && shouldShowVideoSlider) {
            return thingToShow
        }
        return null
    }

    return (
        <VStack>
            {mediaWasFirst && hasSetFirst && determineMediaSlider()}
            {shouldShowSignatureSlider &&
                hasSetFirst &&
                cardHook.curCard.frontIsShowing && (
                    <SignatureSlider startingValue={startingSigWidth.current} />
                )}
            {hasSetFirst && !mediaWasFirst && determineMediaSlider()}
            {shouldShowVideoSlider &&
                !cardHook.curCard.frontIsShowing &&
                rotateVideoButton}
        </VStack>
    )
}
