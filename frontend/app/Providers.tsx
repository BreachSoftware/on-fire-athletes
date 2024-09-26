/* eslint-disable no-undef */
/* eslint-disable require-jsdoc */
'use client'

import { ProvideCurrentCardInfo } from '../hooks/useCurrentCardInfo'
import { ProvideCurrentFilterInfo } from '@/hooks/useCurrentFilter'
import { ProvideCompletedMobileSteps } from '@/hooks/useMobileProgress'
import { ProvideAuth } from '@/hooks/useAuth'
import { theme } from '@/theming/theme'
import { ChakraProvider } from '@chakra-ui/react'
import './fonts'
import { ProvideMediaProcessing } from '@/hooks/useMediaProcessing'
import { ProvideCheckout } from '@/hooks/useCheckout'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { bsc } from 'wagmi/chains'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ProvideTransfer } from '@/hooks/useTransfer'

export const rainbowKitConfig = getDefaultConfig({
    appName: 'OnFire Athletes',
    projectId: '72f5d80525bd261bb92a76b1426b1ce0',
    chains: [bsc],
    ssr: true,
})
const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <>
            <WagmiProvider config={rainbowKitConfig}>
                <QueryClientProvider client={queryClient}>
                    <ChakraProvider theme={theme}>
                        <ProvideAuth>
                            <ProvideCurrentCardInfo>
                                <ProvideCurrentFilterInfo>
                                    <ProvideCompletedMobileSteps>
                                        <ProvideMediaProcessing>
                                            <ProvideCheckout>
                                                <ProvideTransfer>
                                                    {children}
                                                </ProvideTransfer>
                                            </ProvideCheckout>
                                        </ProvideMediaProcessing>
                                    </ProvideCompletedMobileSteps>
                                </ProvideCurrentFilterInfo>
                            </ProvideCurrentCardInfo>
                        </ProvideAuth>
                    </ChakraProvider>
                </QueryClientProvider>
            </WagmiProvider>
        </>
    )
}
