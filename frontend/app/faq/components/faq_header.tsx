import { Flex, Box, Text, FlexProps } from '@chakra-ui/react'
import { FAQ_CATEGORIES } from './faq_constants'

interface Props extends FlexProps {
    selectedCategory: string
    setSelectedCategory: (category: string) => void
}

export default function FAQHeader({
    selectedCategory,
    setSelectedCategory,
    ...props
}: Props) {
    // Styling Color Palette
    const leftHeaderColor = 'gray.400'
    const headerFont = 'Barlow Semi Condensed'
    const headerSpacing = 0.4

    const subHeaderFont = 'Barlow Semi Condensed'
    const subHeaderSpacing = 2
    const subHeaderWeight = 'bold'
    const subHeaderFontSize = { base: 16, lg: 30 }
    const selectedSubHeaderFontSize = { base: 16, lg: '40px' }

    const limeGreen = 'green.100'

    return (
        <Flex
            direction={'column'}
            gap={5}
            position="sticky"
            top={0}
            w={{ base: 'full', lg: 'fit-content' }}
            minW={{ xl: '20%' }}
            zIndex={3}
            display={{ base: 'none', lg: 'flex' }}
            {...props}
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
            <Flex
                flexDirection={{
                    base: 'row',
                    lg: 'column',
                }}
                justify={{
                    base: 'space-evenly',
                    lg: 'flex-start',
                }}
                gap={4}
                mb={{ base: 5, lg: 0 }}
            >
                {/* Map Categories. The "selected" one is styled, the others are not. */}
                {Object.keys(FAQ_CATEGORIES).map((category) => {
                    return (
                        <Flex
                            key={category}
                            flex={1}
                            justify={{
                                base: 'center',
                                lg: 'flex-start',
                            }}
                            textDecoration={'none'}
                            color={
                                category === selectedCategory
                                    ? limeGreen
                                    : leftHeaderColor
                            }
                            fontFamily={subHeaderFont}
                            fontSize={
                                category === selectedCategory
                                    ? selectedSubHeaderFontSize
                                    : subHeaderFontSize
                            }
                            fontWeight={subHeaderWeight}
                            letterSpacing={subHeaderSpacing}
                            textTransform={'uppercase'}
                            transform={{
                                base: 'none',
                                lg:
                                    category === selectedCategory
                                        ? 'skewX(-10deg)'
                                        : 'none',
                            }}
                            transition={'all 0.2s ease-in-out'}
                            onClick={() => {
                                return setSelectedCategory(category)
                            }}
                        >
                            <Box
                                position="relative"
                                w="fit-content"
                                _after={{
                                    content: "''",
                                    position: 'absolute',
                                    width: '100%',
                                    height: '0.2em',
                                    bottom: 0,
                                    left: 0,
                                    background: limeGreen,
                                    transition: 'transform 0.25s ease-out',
                                    // Ensure the underline is always shown for the selected category
                                    transform:
                                        category === selectedCategory
                                            ? 'scaleX(1)'
                                            : 'scaleX(0)',
                                    transformOrigin:
                                        category === selectedCategory
                                            ? 'bottom left'
                                            : 'bottom right',
                                }}
                                _hover={{
                                    color: limeGreen,
                                    cursor: 'pointer',
                                    _after: {
                                        transform: 'scaleX(1)',
                                        transformOrigin: 'bottom left',
                                    },
                                }}
                            >
                                {/* Desktop Category */}
                                <Text
                                    display={{
                                        base: 'none',
                                        lg: 'initial',
                                    }}
                                >
                                    {category}
                                </Text>
                                {/* Mobile Category */}
                                <Text
                                    display={{
                                        lg: 'none',
                                    }}
                                    textAlign="center"
                                >
                                    {category === 'The Platform'
                                        ? 'Platform'
                                        : category}
                                </Text>
                            </Box>
                        </Flex>
                    )
                })}
            </Flex>
        </Flex>
    )
}
