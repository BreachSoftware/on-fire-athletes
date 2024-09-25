import { ChevronRightIcon } from '@chakra-ui/icons'
import {
    Box,
    Icon,
    Button,
    Flex,
    HStack,
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    useBreakpointValue,
    Text,
} from '@chakra-ui/react'
import { FaInfoCircle } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useCurrentCheckout } from '@/hooks/useCheckout'
import { useTransferContext } from '@/hooks/useTransfer'
import { useRouter } from 'next/navigation'
import { handlePurchase } from './completeOrder/stripeHandlePurchase'
import { useAuth } from '@/hooks/useAuth'

/**
 * The Game Coin button component for the checkout page
 * @returns JSX.Element
 */
export default function GameCoinButton() {
    // Hook variables
    const auth = useAuth()
    const curCheckout = useCurrentCheckout()
    const transferContext = useTransferContext()
    const router = useRouter()

    // This variable controls if certain elements are visible in mobile vs desktop
    const screenTooSmall = useBreakpointValue({ base: true, lg: false })

    // These variables are for controlling button animation on the Game Coin button
    const [onHover, setOnHover] = useState(false)
    const [buttonText, setButtonText] = useState('Game Coin')

    // This effect is used to change the button text when the user hovers over the button
    useEffect(() => {
        setTimeout(() => {
            setButtonText(onHover ? 'Connect Wallet' : 'Game Coin')
        }, 200)
    }, [onHover])

    // If a wallet address is present, we can assume the wallet is connected
    // This is used to let the NavBar know that the wallet is connected and to show their balance
    useEffect(() => {
        if (transferContext.address) {
            curCheckout.setCheckout({
                ...curCheckout.checkout,
                cryptoWalletConnected: true,
            })
        } else {
            curCheckout.setCheckout({
                ...curCheckout.checkout,
                cryptoWalletConnected: false,
            })
        }
        // We only want to run this effect when the address changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transferContext.address])

    // This will redirect the user to the success page when the Game Coin transfer is complete
    useEffect(() => {
        if (transferContext.isComplete) {
            handlePurchase(
                curCheckout.checkout,
                curCheckout.checkout.onFireCard,
                null,
                router,
                curCheckout.checkout.packageName === null,
                auth,
                transferContext.hash,
            )
        }
        // We only want to run this effect when the isComplete variable changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transferContext.isComplete])

    return (
        <HStack>
            {/* Invisible Icon for spacing purposes */}
            {screenTooSmall && (
                <Box visibility={'hidden'}>
                    <Icon as={FaInfoCircle} color={'#27CE00'} />
                </Box>
            )}
            {/* Game Coin Button */}
            <Flex alignItems="end">
                {transferContext.address ? (
                    <Button
                        id="submit"
                        type="submit"
                        disabled={
                            transferContext.isFetching ||
                            transferContext.isPending
                        }
                        variant="back"
                        // If the transfer is fetching or pending and didn't finish (such as an error occurring), we want to show the loading spinner
                        isLoading={
                            (transferContext.isFetching ||
                                transferContext.isPending) &&
                            !transferContext.isComplete
                        }
                        textColor={'white'}
                        onClick={() => {
                            transferContext.onTransfer()
                        }}
                        style={{
                            transition: 'all 0.15s ease-in-out',
                            width: onHover ? '155px' : '145px',
                            transformOrigin: 'right center',
                        }}
                    >
                        Pay with GMEX
                        <Flex alignItems={'center'}>
                            <ChevronRightIcon
                                boxSize={'30px'}
                                mr={'-10px'}
                                color={'#27CE00'}
                            />
                        </Flex>
                    </Button>
                ) : (
                    <ConnectButton.Custom>
                        {({ openConnectModal }) => {
                            return (
                                <Button
                                    id="submit"
                                    type="submit"
                                    disabled={
                                        transferContext.isFetching ||
                                        transferContext.isPending
                                    }
                                    variant="back"
                                    isLoading={
                                        transferContext.isFetching ||
                                        transferContext.isPending
                                    }
                                    textColor={'white'}
                                    onMouseEnter={() => {
                                        if (screenTooSmall) {
                                            return setOnHover(false)
                                        }
                                        return setOnHover(true)
                                    }}
                                    onMouseLeave={() => {
                                        return setOnHover(false)
                                    }}
                                    onClick={openConnectModal}
                                    style={{
                                        transition: 'all 0.15s ease-in-out',
                                        width: onHover ? '155px' : '145px',
                                        transformOrigin: 'right center',
                                        marginLeft: '-10px',
                                    }}
                                >
                                    {buttonText}
                                    <Flex alignItems={'center'}>
                                        <ChevronRightIcon
                                            boxSize={'30px'}
                                            mr={'-10px'}
                                            color={'#27CE00'}
                                        />
                                    </Flex>
                                </Button>
                            )
                        }}
                    </ConnectButton.Custom>
                )}
            </Flex>
            {/* Icon for information about GMEX Tokens */}
            <Popover placement={screenTooSmall ? 'auto' : 'right'}>
                <PopoverTrigger>
                    <Box
                        _hover={{
                            md: {
                                cursor: 'pointer',
                            },
                        }}
                    >
                        <Icon as={FaInfoCircle} color={'#27CE00'} />
                    </Box>
                </PopoverTrigger>
                <PopoverContent bgColor="green.600">
                    <PopoverBody>
                        <Text
                            color="white"
                            fontWeight={'medium'}
                            fontSize={'20px'}
                            fontStyle={'italic'}
                            fontFamily={'Barlow Condensed'}
                        >
                            Use your GMEX tokens for a 20% discount!
                        </Text>
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </HStack>
    )
}
