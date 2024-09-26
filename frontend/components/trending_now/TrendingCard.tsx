import {
    Box,
    Flex,
    IconButton,
    Text,
    VStack,
    Divider,
    Button,
    Icon,
    HStack,
    Center,
} from '@chakra-ui/react'
import LockerRoomBackground from '../../public/card_assets/locker-room-background.png'
import TradingCardInfo from '@/hooks/TradingCardInfo'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import OnFireCard from '../create/OnFireCard/OnFireCard'
import { OnFireCardRef } from '../create/OnFireCard/OnFireCard'
import { useCurrentFilterInfo } from '@/hooks/useCurrentFilter'
import FilterInfo from '@/hooks/FilterInfo'
import {
    hexToRgb,
    hslToRgb,
    rgbToHex,
    rgbToHsl,
    saturateHex,
} from '../create/OnFireCard/card_utils'
import { useAuth } from '@/hooks/useAuth'
import { FaArrowsRotate } from 'react-icons/fa6'
import SerializedTradingCard from '@/hooks/SerializedTradingCard'
import { TabName } from '@/app/profile/components/profileAlbumTab'
import { Link } from 'react-scroll'
import { BeatLoader } from 'react-spinners'

interface TrendingCardProps {
    passedInCard: TradingCardInfo | SerializedTradingCard
    slim?: boolean
    shouldShowButton?: boolean
    isPageFlipping?: boolean
    overrideCardClick?:
        | (() => void)
        | ((card: TradingCardInfo | SerializedTradingCard) => void)
    trendingCardWidth?: number | null
    // Profile Page Specific Props
    onProfilePage?: boolean
    tabName?: string
    currentUserId?: string
    privateView?: boolean
    setCurrentCard?: (card: TradingCardInfo) => void
    onSendCardModalOpen?: () => void
    loginModalOpen?: () => void
    onAddToCollectionModalOpen?: () => void
}

// This is used by the scale function since it always needs to be a constant in there.
export const defaultTrendingCardWidth = 386
export const pixelsToShaveOffOfEachSide = 16

/**
 * The TrendingCard component displays a trading card with the player's name, position, team, and availability.
 * It also recolors a background image and displays the trading card image.
 *
 * @param {TradingCardInfo} passedInCard - The trading card to display.
 * @param {boolean} [slim=false] - Indicates whether to display the card in a slim format.
 * @param {boolean} [shouldShowButton=false] - Indicates whether to show the flip card button.
 * @param {boolean} [isPageFlipping=false] - Indicates whether the page is currently flipping.
 * @param {Function} [overrideCardClick] - Optional function to override the card click behavior.
 * @param {string} [trendingCardWidth] - The width of the trending card.
 * @param {boolean} [onProfilePage=false] - Indicates whether the user is on the profile page.
 * @param {string} [tabName] - The name of the tab on the profile page.
 * @param {string} [currentUserId] - The ID of the current user.
 * @param {boolean} [privateView=false] - Indicates whether the user is in private view.
 * @param {Function} [setCurrentCard] - Function to set the current card.
 * @param {Function} [onSendCardModalOpen] - Function to open the send card modal.
 * @param {Function} [loginModalOpen] - Function to open the login modal.
 * @param {Function} [onAddToCollectionModalOpen] - Function to open the add to collection modal.
 */
export default function TrendingCard({
    passedInCard,
    slim,
    shouldShowButton = false,
    overrideCardClick: onCardClick,
    trendingCardWidth,
    onProfilePage,
    tabName,
    currentUserId,
    privateView,
    setCurrentCard,
    onSendCardModalOpen,
    loginModalOpen,
    onAddToCollectionModalOpen,
}: TrendingCardProps) {
    // Set the default background image
    const defaultBackground = LockerRoomBackground

    let windowAdjustedDefaultWidth = defaultTrendingCardWidth

    // More of a global variable (hence the capitalization) that determines if the card should be dynamically sized based on the card's container.
    // It overrides any custom width that is passed in.
    const DYNAMIC_SIZING = true

    if (typeof window !== 'undefined') {
        // This ensures that the card never gets larger than the phone screen that it's showing on.
        windowAdjustedDefaultWidth = Math.min(
            windowAdjustedDefaultWidth,
            window.innerWidth * 0.9,
        )
    }

    // A reference to the OnFireCard component
    const onFireCardRef = useRef<OnFireCardRef | null>(null)

    // Get the current filter information
    const filter = useCurrentFilterInfo()

    // Get the current auth context
    const auth = useAuth()

    // State variables to store the current user
    const [currentUser, setCurrentUser] = useState('')

    const router = useRouter()

    // This is the trading card to display
    const card =
        passedInCard instanceof SerializedTradingCard
            ? passedInCard.TradingCardInfo
            : passedInCard

    const [buttonText, setButtonText] = useState<string | null>(null)
    const [buttonAction, setButtonAction] = useState<(() => void) | null>(null)
    const [disableActionButton, setDisableActionButton] =
        useState<boolean>(false)

    // State variable to store the button clicked status
    const [buttonClicked, setButtonClicked] = useState(false)

    /**
     * Handles the flip event from outside the component.
     */
    function handleFlipFromOutside() {
        if (onFireCardRef.current) {
            onFireCardRef.current.handleClick()
        }
    }

    // Sets the current authenticated user when the component mounts
    useEffect(() => {
        /**
         * A function to get the current authenticated user.
         */
        async function getCurrentUser() {
            const user = await auth.currentAuthenticatedUser()
            setCurrentUser(user.userId)
        }

        getCurrentUser()
    })

    /**
     * Sets the button text and action based on the current user and tab ONLY if on the profile page
     */
    useEffect(() => {
        if (onProfilePage) {
            // If the user is in private view and viewing the created tab of a card that has no more available copies, disable the button
            if (tabName === TabName.Created && card.currentlyAvailable <= 0) {
                setButtonText('CARD UNAVAILABLE')
                setButtonAction(() => {})
                setDisableActionButton(true)
            } else if (privateView) {
                // If the user is in private view and viewing a card in the created or traded tab, allow the user to send the card
                // Bought cards shouldn't be able to be sent
                if (tabName === TabName.Created || tabName === TabName.Traded) {
                    setButtonText('SEND CARD')
                    setButtonAction(() => {
                        return () => {
                            setCurrentCard!(card)
                            onSendCardModalOpen!()
                        }
                    })
                    setDisableActionButton(false)
                } else {
                    setButtonText('')
                    setButtonAction(() => {})
                    setDisableActionButton(false)
                }
            } else if (tabName === TabName.Created) {
                // If the user is viewing a buyable card on another profile, allow the user to buy the card
                if (
                    card.price !== 0 &&
                    card.currentlyAvailable > 0 &&
                    currentUser !== card.generatedBy
                ) {
                    setButtonText('BUY NOW')
                    setButtonAction(() => {
                        return () => {
                            setCurrentCard!(card)
                            if (currentUserId) {
                                // Saves the card information to local storage
                                TradingCardInfo.saveCard(card)
                                // Set the button clicked status to true because the user is being redirected
                                setButtonClicked(true)
                                // Redirect the user to the payment page
                                router.push('/checkout?buyingOtherCard=true')
                            } else {
                                loginModalOpen!()
                            }
                        }
                    })
                    setDisableActionButton(false)
                } else {
                    setButtonText('REQUEST TRADE')
                    setButtonAction(() => {
                        return () => {
                            setCurrentCard!(card)
                            if (currentUserId) {
                                onAddToCollectionModalOpen!()
                            } else {
                                loginModalOpen!()
                            }
                        }
                    })
                    setDisableActionButton(false)
                }
            }
        } else {
            // If the user is not on the profile page, show simplified button text
            // If the card is not available, show "Card Unavailable"
            // If the card is available, show "Send Card" if the card was generated by the current user
            // Show "Buy Now" if the card is buyable
            // Show "Request Trade" if the card is not buyable
            setButtonText(
                card.currentlyAvailable <= 0
                    ? 'Card Unavailable'
                    : currentUser === card.generatedBy
                      ? 'Send Card'
                      : card.price
                        ? 'Buy Now'
                        : 'Request Trade',
            )
            setDisableActionButton(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        currentUser,
        card,
        tabName,
        setCurrentCard,
        onSendCardModalOpen,
        loginModalOpen,
        onAddToCollectionModalOpen,
        currentUserId,
        onProfilePage,
        privateView,
    ])

    /**
     * Function that determines if a color is too dark to be used as a background color
     * @param hex the string to check
     * @returns true if the color is too dark, false otherwise
     */
    function colorTooDark(hex: string, threshold: number = 125): boolean {
        const rgb = hexToRgb(hex)
        const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000
        return brightness < threshold
    }

    /**
     * Lightens a hex string if it is too dark
     * @param hex the hex string to lighten
     * @returns the lightened hex string
     */
    function lightenColor(hex: string, minimum: number = 125): string {
        // Convert hex to RGB
        const rgb = hexToRgb(hex)

        // Convert RGB to HSL
        const hsl = rgbToHsl(rgb[0], rgb[1], rgb[2])

        // Adjust the lightness (L) to 125 (assuming L is in the range 0-255)
        hsl[2] = minimum / 255 // Convert to the HSL scale (0-1)

        // Convert back to RGB
        const newRgb = hslToRgb(hsl[0], hsl[1], hsl[2])

        // Convert the new RGB back to hex
        return rgbToHex(newRgb[0], newRgb[1], newRgb[2])
    }

    /**
     * A function to recolor the background image of the trading card
     * Bases the color off of the border color of the card
     * @returns the hex string of the color to use
     */
    function decideColor() {
        let chosenColor = card.borderColor

        const threshold = 150
        if (colorTooDark(chosenColor, threshold)) {
            chosenColor = lightenColor(chosenColor, threshold)
        }

        return saturateHex(chosenColor, 1.6)
    }

    /**
     * A function to display the trading card in the background
     * @param customWidth - The width of the trading card IN PIXELS. -1 autoscales the width.
     * @param customHeight - The height of the trading card IN PIXELS. -1 autoscales the height.
     * @returns the trading card in the background
     */
    function tradingCardInBackground() {
        // Tailored to get the proper scale for the card according to the XD file.
        const defaultScale = 0.57
        // Set the value to scale the card by, which is the number of pixels that the background ends up being.
        const valueToScaleBy = windowAdjustedDefaultWidth
        return (
            <Box
                boxShadow={'0 8px 0.75rem #0000004f'}
                w={{
                    base: '100%',
                    lg: DYNAMIC_SIZING
                        ? (trendingCardWidth ?? windowAdjustedDefaultWidth)
                        : windowAdjustedDefaultWidth,
                }}
                maxW={windowAdjustedDefaultWidth}
                // It is a square card, so the height is the same as the width
                h={windowAdjustedDefaultWidth}
                cursor="pointer"
                transition={'background-color 0.5s ease-in-out'}
                onClick={() => {
                    if (onCardClick) {
                        onCardClick(passedInCard)
                    } else {
                        filter.setCurFilter(new FilterInfo())
                        router.push(
                            `/profile?user=${card?.generatedBy}&card=${card?.uuid}`,
                        )
                    }
                }}
                display="flex"
                justifyContent="center"
                alignItems="center"
                backgroundColor={decideColor()}
                backgroundImage={defaultBackground.src}
                backgroundSize={'auto 100%'}
                backgroundPosition={'center'}
                backgroundBlendMode={'multiply'}
                // Clip the background image barely barely to fix a weird background color bug
                clipPath={
                    'polygon(0.01% 0.01%, 99.99% 0.01%, 99.99% 99.99%, 0.01% 99.99%)'
                }
            >
                <Center
                    w="full"
                    h="full"
                    transform={`scale(${valueToScaleBy * (defaultScale / defaultTrendingCardWidth)})`}
                    mixBlendMode={'normal'}
                >
                    {/* Image component for the trading card image */}
                    {/* <Skeleton
                        w="full"
                        // h="full"
                        isLoaded={!isPageFlipping}
                        fadeDuration={1}
                        borderRadius={'12'}
                    > */}
                    <OnFireCard
                        key={card.uuid}
                        slim
                        card={card}
                        showButton={false}
                        ref={onFireCardRef}
                        shouldFlipOnClick
                    />
                    {/* </Skeleton> */}
                </Center>
            </Box>
        )
    }

    return (
        <>
            <VStack
                width={{
                    base: 'full',
                    lg: trendingCardWidth
                        ? DYNAMIC_SIZING
                            ? trendingCardWidth
                            : windowAdjustedDefaultWidth
                        : 'auto',
                }}
            >
                {onProfilePage ? (
                    <>
                        <Link
                            activeClass="active"
                            to="cardElement"
                            spy
                            smooth
                            offset={-50}
                            duration={500}
                            width="inherit"
                        >
                            {tradingCardInBackground()}
                        </Link>
                    </>
                ) : (
                    <>
                        {/* Locker Room Trading cards will have slightly bigger backgrounds. */}
                        {tradingCardInBackground()}
                    </>
                )}

                {!slim && (
                    <Flex
                        align={'center'}
                        justifyContent={'space-between'}
                        w={{
                            base: 'full',
                            lg: DYNAMIC_SIZING
                                ? (trendingCardWidth ??
                                  windowAdjustedDefaultWidth)
                                : windowAdjustedDefaultWidth,
                        }}
                        // maxW={windowAdjustedDefaultWidth}
                    >
                        {/* VStack component for the trading card details */}
                        <VStack
                            align={'left'}
                            color={'white'}
                            gap={4}
                            fontSize={14}
                            width={'100%'}
                            letterSpacing={'0px'}
                            paddingTop={2}
                            overflowX="hidden"
                        >
                            <HStack justifyContent={'space-between'}>
                                <Text
                                    fontSize={18}
                                    fontFamily={'Barlow Semi Condensed'}
                                    fontWeight={'bold'}
                                >
                                    {card.price
                                        ? `$${card.price}`
                                        : 'TRADE ONLY'}
                                </Text>
                                {shouldShowButton && (
                                    <IconButton
                                        onClick={handleFlipFromOutside}
                                        aria-label="Flip Card"
                                        size="xs"
                                        w="5%"
                                        background={'white'}
                                        marginLeft={5}
                                        icon={
                                            <Icon
                                                as={FaArrowsRotate}
                                                color="black"
                                                style={{
                                                    width: '15px',
                                                    height: '15px',
                                                }}
                                            />
                                        }
                                    />
                                )}
                            </HStack>
                            <Divider borderColor="white" />
                            <VStack align={'left'} gap={0} lineHeight={'20px'}>
                                {/* Text component for the player's name */}
                                <Text
                                    textTransform={'uppercase'}
                                    fontSize={18}
                                    fontFamily={'Helvetica'}
                                    fontWeight={'bolder'}
                                >
                                    {`${card.firstName} ${card.lastName}`}
                                </Text>

                                {/* Text component for the player's sport, position, and team */}
                                <Text>
                                    {card.position} / {card.teamName}
                                </Text>

                                {passedInCard instanceof
                                SerializedTradingCard ? (
                                    <>
                                        {/* Text component for the card number */}
                                        <Text
                                            color={'gray'}
                                        >{`Card Number: ${passedInCard.serialNumber} of ${card.totalCreated}`}</Text>
                                    </>
                                ) : (
                                    <Text
                                        color={'gray'}
                                    >{`${card.currentlyAvailable} of ${card.totalCreated} available`}</Text>
                                )}
                            </VStack>
                            {buttonText && (
                                <Button
                                    alignSelf={'center'}
                                    w={'100%'}
                                    variant={'trendingNow'}
                                    fontSize={14}
                                    textTransform={'uppercase'}
                                    fontFamily={'Barlow Semi Condensed'}
                                    isDisabled={disableActionButton}
                                    isLoading={buttonClicked}
                                    spinner={
                                        <BeatLoader size={8} color="white" />
                                    }
                                    onClick={() => {
                                        if (buttonAction) {
                                            buttonAction()
                                        } else {
                                            filter.setCurFilter(
                                                new FilterInfo(),
                                            )
                                            setButtonClicked(true)
                                            router.push(
                                                `/profile?user=${card?.generatedBy}&card=${card?.uuid}`,
                                            )
                                        }
                                    }}
                                >
                                    {buttonText}
                                </Button>
                            )}
                        </VStack>
                    </Flex>
                )}
            </VStack>
        </>
    )
}
