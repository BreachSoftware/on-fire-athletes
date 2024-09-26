'use client'

import { Flex, Text, Box } from '@chakra-ui/react'
import NavBar from '../navbar'
import Sidebar from '@/components/sidebar'
import FAQAccordion from './components/faq_accordion'
import FAQConstants from './components/faq_constants'
import { useEffect, useState } from 'react'
import { BackToCheckoutModal } from '../components/BackToCheckoutModal'
import Footer from '../components/footer'
import SharedStack from '@/components/shared/wrappers/shared-stack'

// Dictionary of categories
const categories = {
    'The Platform': FAQConstants.FAQ_DATA.THE_PLATFORM,
    GameCoin: FAQConstants.FAQ_DATA.GMEX,
    Legal: FAQConstants.FAQ_DATA.LEGAL,
}

// Styling Color Palette
const leftHeaderColor = 'gray.400'
const headerFont = 'Barlow Semi Condensed'
const headerSpacing = 0.4

const subHeaderFont = 'Barlow Semi Condensed'
const subHeaderSpacing = 2
const subHeaderWeight = 'bold'
const subHeaderFontSize = { base: 16, md: 30 }
const selectedSubHeaderFontSize = { base: 22, md: '40px' }

const limeGreen = 'green.100'

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
                ? Object.keys(categories).find((cat) => {
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
                    <SharedStack
                        overflowY="scroll"
                        gap={0}
                        px={{ base: '24px', md: '72px' }}
                        mt="40px"
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
                            gap={{ md: '168px' }}
                        >
                            {/* Header */}
                            <Flex
                                direction={'column'}
                                gap={5}
                                position="sticky"
                                top={0}
                                w="fit-content"
                                minW={{ xl: '20%' }}
                            >
                                <Text
                                    color={'white'}
                                    fontFamily={headerFont}
                                    fontSize={'20px'}
                                    letterSpacing={headerSpacing}
                                    fontWeight={'semibold'}
                                    textTransform={'uppercase'}
                                >
                                    FAQ Categories
                                </Text>

                                {/* Categories */}
                                <Flex flexDirection={'column'} gap={4}>
                                    {/* Map Categories. The "selected" one is styled, the others are not. */}
                                    {Object.keys(categories).map((category) => {
                                        return (
                                            <Text
                                                key={category}
                                                w={'fit-content'}
                                                display={'inline-block'}
                                                position={'relative'}
                                                textDecoration={'none'}
                                                color={
                                                    category ===
                                                    selectedCategory
                                                        ? limeGreen
                                                        : leftHeaderColor
                                                }
                                                fontFamily={subHeaderFont}
                                                fontSize={
                                                    category ===
                                                    selectedCategory
                                                        ? selectedSubHeaderFontSize
                                                        : subHeaderFontSize
                                                }
                                                fontWeight={subHeaderWeight}
                                                letterSpacing={subHeaderSpacing}
                                                textTransform={'uppercase'}
                                                transform={
                                                    category ===
                                                    selectedCategory
                                                        ? 'skewX(-10deg)'
                                                        : 'none'
                                                }
                                                transition={
                                                    'all 0.2s ease-in-out'
                                                }
                                                _after={{
                                                    content: "''",
                                                    position: 'absolute',
                                                    width: '100%',
                                                    height: '0.2em',
                                                    bottom: 0,
                                                    left: 0,
                                                    background: limeGreen,
                                                    transition:
                                                        'transform 0.25s ease-out',
                                                    // Ensure the underline is always shown for the selected category
                                                    transform:
                                                        category ===
                                                        selectedCategory
                                                            ? 'scaleX(1)'
                                                            : 'scaleX(0)',
                                                    transformOrigin:
                                                        category ===
                                                        selectedCategory
                                                            ? 'bottom left'
                                                            : 'bottom right',
                                                }}
                                                _hover={{
                                                    color: limeGreen,
                                                    cursor: 'pointer',
                                                    _after: {
                                                        transform: 'scaleX(1)',
                                                        transformOrigin:
                                                            'bottom left',
                                                    },
                                                }}
                                                onClick={() => {
                                                    return setSelectedCategory(
                                                        category,
                                                    )
                                                }}
                                            >
                                                {category}
                                            </Text>
                                        )
                                    })}
                                </Flex>
                            </Flex>

                            {/* FAQ */}
                            <Flex
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
                                        categories[
                                            selectedCategory as keyof typeof categories
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
                <Box h="full" display={{ base: 'none', md: 'initial' }}>
                    <Sidebar />
                </Box>
            </SharedStack>
        </SharedStack>
    )
}
