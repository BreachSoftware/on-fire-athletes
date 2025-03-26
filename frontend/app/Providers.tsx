/* eslint-disable no-undef */
/* eslint-disable require-jsdoc */
"use client";

import { ProvideCurrentCardInfo } from "../hooks/useCurrentCardInfo";
import { ProvideCurrentFilterInfo } from "@/hooks/useCurrentFilter";
import { ProvideCompletedMobileSteps } from "@/hooks/useMobileProgress";
import { ProvideAuth } from "@/hooks/useAuth";
import { theme } from "@/theming/theme";
import { ChakraProvider } from "@chakra-ui/react";
import "./fonts";
import { ProvideMediaProcessing } from "@/hooks/useMediaProcessing";
import { ProvideCheckout } from "@/hooks/useCheckout";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { bsc } from "wagmi/chains";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProvideTransfer } from "@/hooks/useTransfer";
import { usePathname } from "next/navigation";
// BUILD

export const rainbowKitConfig = getDefaultConfig({
    appName: "onfire-athletes",
    projectId: "04b034b039d6732f839163fef760fee6",
    chains: [bsc],
});
const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isArViewer = pathname.includes("/ar");

    if (isArViewer) {
        return <>{children}</>;
    }

    return (
        <ChakraProvider theme={theme}>
            <MaybeWagmiProvider shouldUse={!isArViewer}>
                <QueryClientProvider client={queryClient}>
                    <ProvideAuth>
                        <ProvideCurrentCardInfo>
                            <ProvideCurrentFilterInfo>
                                <ProvideCompletedMobileSteps>
                                    <ProvideMediaProcessing>
                                        <ProvideCheckout>
                                            <MaybeProvideTransfer
                                                shouldUse={!isArViewer}
                                            >
                                                {children}
                                            </MaybeProvideTransfer>
                                        </ProvideCheckout>
                                    </ProvideMediaProcessing>
                                </ProvideCompletedMobileSteps>
                            </ProvideCurrentFilterInfo>
                        </ProvideCurrentCardInfo>
                    </ProvideAuth>
                </QueryClientProvider>
            </MaybeWagmiProvider>
        </ChakraProvider>
    );
}

function MaybeWagmiProvider({
    shouldUse,
    children,
}: {
    shouldUse: boolean;
    children: React.ReactNode;
}) {
    if (shouldUse) {
        return (
            <WagmiProvider config={rainbowKitConfig}>{children}</WagmiProvider>
        );
    }

    return <>{children}</>;
}

function MaybeProvideTransfer({
    shouldUse,
    children,
}: {
    shouldUse: boolean;
    children: React.ReactNode;
}) {
    if (shouldUse) {
        return <ProvideTransfer>{children}</ProvideTransfer>;
    }

    return <>{children}</>;
}
