import { Box, Center, HStack } from '@chakra-ui/layout'

/**
 * Dot
 * @param isSelected boolean - Whether the dot is selected
 * @returns {JSX.Element} The rendered dot
 */
function Dot({
    isSelected,
    isLightMode,
}: {
    isSelected: boolean
    isLightMode?: boolean
}) {
    return (
        <Box
            w="10px"
            h="10px"
            rounded="full"
            borderWidth="1px"
            borderColor={isLightMode ? 'black' : 'white'}
            bgColor="transparent"
            overflow="hidden"
        >
            <Box
                w="100%"
                h="100%"
                bgColor={
                    isSelected
                        ? isLightMode
                            ? 'black'
                            : 'white'
                        : 'transparent'
                }
                transition="background-color 0.2s ease-in"
            />
        </Box>
    )
}

interface Props {
    selectedIndex: number
    itemsLength: number
    isLightMode?: boolean
}

/**
 * CarouselDots
 * @param selectedIndex number - The active index of the carousel
 * @param itemsLength number - The total number of items in the carousel
 * @returns {JSX.Element} The rendered carousel dots
 */
export default function CarouselDots({
    selectedIndex,
    itemsLength,
    isLightMode,
}: Props) {
    return (
        <Center w="full" mt={8}>
            <HStack spacing={4}>
                {Array.from({ length: itemsLength }).map((_n, i) => {
                    return (
                        <Dot
                            key={i}
                            isSelected={i === selectedIndex}
                            isLightMode={isLightMode}
                        />
                    )
                })}
            </HStack>
        </Center>
    )
}
