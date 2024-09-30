import { Flex, Text, Box } from '@chakra-ui/react'

/**
 * A component that displays the text "CREATE YOUR DIGITAL SPORTS CARD"
 *
 * @returns Create Your Card Text Component
 */
export default function CreateYourCardText() {
    return (
        <Flex
            color="white"
            direction="column"
            fontFamily="Barlow Condensed"
            fontSize={{ base: '54px', xs: '60px', '2xl': '74px' }}
            lineHeight={{ base: '50px', sm: '58px', '2xl': '70px' }}
        >
            <Flex direction={'row'}>
                <Text
                    letterSpacing={{ base: '2.4px', lg: '4px' }}
                    fontWeight={700}
                >
                    CREATE
                </Text>
                <Box w="10px" />
                <Text
                    fontFamily="Brotherhood"
                    color="green.100"
                    fontSize={{ base: '54px', md: '58px', lg: '64px' }}
                    m="4px 0px -4px 6px"
                >
                    YOUR
                </Text>
            </Flex>
            <Text
                letterSpacing={{ base: '2.4px', lg: '4px' }}
                mt={1}
                fontWeight={700}
            >
                {' '}
                SPORTS CARD
            </Text>
        </Flex>
    )
}
