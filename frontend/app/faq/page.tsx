'use client'

import { Flex, Box } from '@chakra-ui/react'
import NavBar from '../navbar'
import Sidebar from '@/components/sidebar'
import FAQAccordion from './components/faq_accordion'
import { useEffect, useState } from 'react'
import { BackToCheckoutModal } from '../components/BackToCheckoutModal'
import Footer from '../components/footer'
import SharedStack from '@/components/shared/wrappers/shared-stack'
import { FAQ_CATEGORIES } from './components/faq_constants'
import FAQHeader from './components/faq_header'

/**
 * FAQ page component.
 * @returns {JSX.Element} The FAQ page component.
 */
export default function FAQPage() {
    // state variable for selected category and item
    const [selectedCategory, setSelectedCategory] = useState('The Platform')
    const [activeIndex, setActiveIndex] = useState<number | undefined>(
        undefined,
    )

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search)
            const categoryParam = urlParams.get('category')
            const itemParam = parseInt(urlParams.get('item') ?? '', 10)

            const matchingCategory = categoryParam
                ? Object.keys(FAQ_CATEGORIES).find((cat) => {
                      return cat.toLowerCase() === categoryParam.toLowerCase()
                  })
                : undefined

            if (matchingCategory) {
                setSelectedCategory(matchingCategory)
            }

            if (!isNaN(itemParam)) {
                setActiveIndex(itemParam)
            }
        }
    }, [])

    return (
        <SharedStack
            gap={0}
            h="100vh"
            overflowY="hidden"
            w="100%"
            backgroundColor={'black'}
            backgroundImage={"url('/darkpaper.png')"}
            backgroundRepeat={'repeat'}
        >
            <BackToCheckoutModal />
            {/* Main content */}
            <SharedStack row gap={0} flex={1} overflowY="hidden">
                <SharedStack
                    w="full"
                    h="full"
                    flex={1}
                    justify="space-between"
                    gap={0}
                >
                    <Flex w="100%" direction={'column'} h="fit-content">
                        <NavBar />
                    </Flex>
                    <FAQHeader
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        display={{ base: 'flex', lg: 'none' }}
                        px="24px"
                        mt="24px"
                    />
                    <SharedStack
                        overflowY="scroll"
                        gap={0}
                        px={{ base: '24px', lg: '72px' }}
                        mt={{ base: '24px', lg: '40px' }}
                        pb="40px"
                        h="full"
                        __css={{ '::-webkit-scrollbar': { display: 'none' } }}
                    >
                        {/* Main FAQ content */}
                        <Flex
                            direction={{ base: 'column', lg: 'row' }}
                            alignItems={{ base: 'center', lg: 'flex-start' }}
                            justifyContent={'center'}
                            wrap={'wrap'}
                            userSelect={'none'}
                            w="full"
                            gap={{ lg: '168px' }}
                        >
                            <FAQHeader
                                selectedCategory={selectedCategory}
                                setSelectedCategory={setSelectedCategory}
                                display={{ base: 'none', lg: 'flex' }}
                            />
                            {/* FAQ */}
                            <Flex
                                w="full"
                                flex={1}
                                transition={'all 0.3s ease-in-out'}
                                overflowY={'auto'}
                                css={{
                                    // Getting rid of default scrollbar
                                    msOverflowStyle: 'none',
                                    // Creating custom scrollbar.
                                    // Unfortunately the colors from themes don't work here so you have to hard code
                                    '&::-webkit-scrollbar': {
                                        width: '0.75rem',
                                    },
                                    '&::-webkit-scrollbar-track': {
                                        backgroundColor: '#1E2423',
                                        borderRadius: '5rem',
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                        backgroundColor: '#2A302F',
                                        borderRadius: '5rem',
                                    },
                                    '&::-webkit-scrollbar-thumb:hover': {
                                        backgroundColor: '#363C3B',
                                    },
                                }}
                            >
                                <FAQAccordion
                                    data={
                                        FAQ_CATEGORIES[
                                            selectedCategory as keyof typeof FAQ_CATEGORIES
                                        ]
                                    }
                                    activeIndex={activeIndex}
                                    setActiveIndex={setActiveIndex}
                                />
                            </Flex>
                        </Flex>
                    </SharedStack>
                    <Footer />
                </SharedStack>
                <Box h="full" display={{ base: 'none', lg: 'initial' }}>
                    <Sidebar />
                </Box>
            </SharedStack>
        </SharedStack>
    )
}
