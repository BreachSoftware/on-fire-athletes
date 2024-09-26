'use client'

import BuiltForAthletes from '@/components/built_for_athletes'
import { Flex } from '@chakra-ui/react'
import { Box } from '@chakra-ui/react'
import Navbar from '@/app/navbar'
import Sidebar from '@/components/sidebar'
import Footer from './components/footer'
import TrendingNow from '@/components/trending_now/TrendingNow'
import CaptureCreateCustomize from '@/app/components/CaptureCreateCustomize'
import '@fontsource/water-brush'
import '@fontsource/barlow'
import MobileFrontWrapper from './components/mobile-front-wrapper'
import { BackToCheckoutModal } from './components/BackToCheckoutModal'
import InTheNews from '@/components/in_the_news'
import LightItUp from '@/components/light_it_up/light_it_up'
import SideBarHamburger from '@/components/sidebarHamburger'

/**
 * Renders the home screen.
 * @returns {JSX.Element} The rendered home screen.
 */
export default function Index() {
    // Data for the "In The News" section. This array would typically come from props or be fetched from an API

    /* Array of news items, each item would have an id, imageUrl, headline, and description */
    const inTheNewsData = [
        {
            id: 1,
            imageUrl: 'in_the_news/news1.jpeg',
            headline: 'Headline Here',
            description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        },
        {
            id: 2,
            imageUrl: 'in_the_news/news2.jpeg',
            headline: 'Headline Here',
            description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        },
        {
            id: 3,
            imageUrl: 'in_the_news/news3.jpeg',
            headline: 'Headline Here',
            description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        },
        // ...other news items
    ]

    return (
        <>
            <Box minH="100dvh" w="full" position="relative">
                <Flex flexDir="row" w="full" h="full">
                    <Box w="full">
                        <Box
                            as="video"
                            src="HomepageBackgroundVideo.mp4"
                            loop={false}
                            muted={true}
                            controls={false}
                            autoPlay={true}
                            playsInline={true}
                            minW="full"
                            minH="100dvh"
                            objectFit="cover"
                            position="fixed"
                            top={0}
                            right={0}
                            left={0}
                            bottom={0}
                        />
                        <Box position="relative">
                            <Flex
                                w="100%"
                                position="relative"
                                h="100dvh"
                                direction="column"
                                bgGradient={{
                                    base: 'none',
                                    md: 'linear(to-r, #000, #00000000)',
                                }}
                            >
                                <Navbar />
                                <CaptureCreateCustomize />
                            </Flex>
                            <BuiltForAthletes />
                            <MobileFrontWrapper />
                        </Box>
                        <Box position="relative">
                            <LightItUp />
                            <InTheNews
                                showBackground
                                title="In The News"
                                data={inTheNewsData}
                            />
                            <TrendingNow />
                            <Footer />
                        </Box>
                    </Box>
                    <Box
                        position="sticky"
                        top={0}
                        w="140px"
                        h="100dvh"
                        display={{ base: 'none', md: 'inline' }}
                    >
                        <Sidebar height={'100dvh'} />
                    </Box>
                </Flex>
            </Box>
            <BackToCheckoutModal />
            <SideBarHamburger />
        </>
    )
}
