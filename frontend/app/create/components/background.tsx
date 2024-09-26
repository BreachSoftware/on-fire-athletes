import { Flex } from '@chakra-ui/layout'

export default function CreateBackground() {
    return (
        <Flex
            direction="column"
            position="absolute"
            top="0"
            left="0"
            zIndex={-10}
            h="100%"
        >
            {/* Top Background Image */}
            <Flex
                bgImage="young-athletes-card-array-bw.png"
                bgPosition="center"
                bgRepeat="no-repeat"
                filter={'grayscale(0%)'}
                bgSize="cover"
                bgPos="60% 40%"
                h={{ base: '65vh', lg: '50%' }}
                minH={{ base: '560px', lg: 'none' }}
                w="100vw"
            >
                <Flex
                    bgGradient="linear(#000C, #17760BC3, #058D05C3)"
                    h="100%"
                    w="100%"
                />
            </Flex>
            {/* Bottom Part of the Background */}
            <Flex
                bgGradient={
                    'linear(180deg, gray.1200 0%, gray.1300 100%) 0% 0% no-repeat padding-box;'
                }
                h={{ base: '100%', lg: '50%' }}
                w="100vw"
            />
        </Flex>
    )
}
