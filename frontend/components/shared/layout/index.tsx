import { BackToCheckoutModal } from '@/app/components/BackToCheckoutModal'
import Footer from '@/app/components/footer'
import NavBar from '@/app/navbar'
import Sidebar from '@/components/sidebar'
import SideBarHamburger from '@/components/sidebarHamburger'
import { Box, Flex } from '@chakra-ui/layout'
import { PropsWithChildren } from 'react'

interface Props {}

export default function PageLayout({ children }: PropsWithChildren<Props>) {
    return (
        <>
            <BackToCheckoutModal />
            <SideBarHamburger />
            <Flex flexDir="row" minH="100dvh">
                <Flex flexDir="column" w="full" minH="100dvh">
                    <Box flex={1} position="relative">
                        <NavBar />
                        {children}
                    </Box>
                    <Footer />
                </Flex>
                <Box
                    position="sticky"
                    top={0}
                    w="140px"
                    h="100dvh"
                    display={{ base: 'none', lg: 'inline' }}
                >
                    <Sidebar height={'100dvh'} />
                </Box>
            </Flex>
        </>
    )
}
