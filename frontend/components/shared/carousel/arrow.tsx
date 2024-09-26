import { ReactElement } from 'react'
import { IconButton } from '@chakra-ui/button'

interface Props {
    icon: ReactElement
    topPosition?: string
    isPrev?: boolean
    onClick: () => void
    isDisabled: boolean
    isLightMode?: boolean
}

/**
 * CarouselArrow
 * A custom arrow component for the carousel that allows for custom styling and positioning.
 * @param icon ReactElement - The icon to display in the arrow
 * @param isPrev boolean - Whether the arrow is for the previous slide
 * @param onClick () => void - The function to call when the arrow is clicked
 * @param isDisabled boolean - Whether the arrow is disabled
 * @returns {JSX.Element} The rendered arrow
 */
export default function CarouselArrow({
    icon,
    topPosition,
    isPrev,
    onClick,
    isDisabled,
    isLightMode,
}: Props) {
    return (
        <IconButton
            icon={icon}
            aria-label={isPrev ? 'Previous' : 'Next'}
            onClick={onClick}
            size="sm"
            color={isLightMode ? 'black' : 'white'}
            h="fit-content"
            py={2}
            variant="ghost"
            _focus={{
                bg: isLightMode ? 'blackAlpha.50' : 'whiteAlpha.50',
            }}
            _hover={{
                bg: isLightMode ? 'blackAlpha.200' : 'whiteAlpha.200',
            }}
            _active={{
                bg: 'transparent',
            }}
            fontSize="22px"
            isDisabled={isDisabled}
            position="absolute"
            zIndex={2}
            left={isPrev ? 0 : undefined}
            top={topPosition || '50%'}
            right={isPrev ? undefined : 0}
        />
    )
}
