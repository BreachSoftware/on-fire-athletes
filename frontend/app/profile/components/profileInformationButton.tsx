'use client'

import { Flex, Text } from '@chakra-ui/react'

interface ProfileInformationButtonProps {
    text: string
    isSelected?: boolean
    clickEvent?: () => void
}

/**
 * Custom buttons for the profile information section
 * @returns The Profile Information Buttons Component.
 */
export default function profileInformationButton({
    text = '',
    isSelected,
    clickEvent = () => {},
}: ProfileInformationButtonProps) {
    return (
        <>
            <Flex
                w="96px"
                h={{ base: '40px', md: '41px' }}
                bgColor={isSelected ? 'green.100' : 'transparent'}
                color="white"
                border="3px solid #27CE00"
                borderRadius="24px"
                align="center"
                justify="center"
                _hover={{
                    md: {
                        bgColor: '#CCC',
                        border: '3px solid #CCC',
                        cursor: 'pointer',
                        color: 'black',
                    },
                }}
                transitionDuration="0.2s"
                transitionTimingFunction="ease-in-out"
                onClick={clickEvent}
            >
                <Text
                    fontFamily={'Barlow Semi Condensed'}
                    fontSize="14px"
                    fontWeight="700"
                    textTransform="uppercase"
                    letterSpacing="1.4px"
                >
                    {text}
                </Text>
            </Flex>
        </>
    )
}
