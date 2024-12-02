import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button, Box } from '@chakra-ui/react';

const CustomConnectButton = () => (
    <ConnectButton.Custom>
        {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            mounted,
        }) => {
            const connected = mounted && account && chain;
            return (
                <Box
                    {...(!mounted && {
                        'aria-hidden': true,
                        opacity: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                    })}
                >
                    {!connected ? (
                        <Button
                            onClick={openConnectModal}
                            colorScheme="grey"
                            variant="outline"
                        >
                            Connect Wallet
                        </Button>
                    ) : chain.unsupported ? (
                        <Button
                            onClick={openChainModal}
                            colorScheme="red"
                            variant="outline"
                        >
                            Wrong Network
                        </Button>
                    ) : (
                        <Button gap={2} alignItems="start" justifyContent={'start'} >
                            <Button onClick={openChainModal} colorScheme='white' variant="plain">
                                {chain.name}
                            </Button>
                            <Button onClick={openAccountModal} colorScheme="white" variant="plain">
                                {account.displayName}
                            </Button>
                        </Button>
                    )}
                </Box>
            );
        }}
    </ConnectButton.Custom>
);

export default CustomConnectButton;
