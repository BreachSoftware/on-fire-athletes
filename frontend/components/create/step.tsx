'use client'

// eslint-disable-next-line no-use-before-define
import { Flex, FlexProps, Heading, Text } from '@chakra-ui/react'

export interface StepProps extends FlexProps {
    stepNumber: number
    stepDescription: string
}

/**
 * Renders a section of the info card with a title, description, and button.
 * @param {InfoSectionProps} props - The props for the InfoSection component.
 * @returns {JSX.Element} The rendered InfoSection component.
 */
export default function Step({
    stepNumber,
    stepDescription,
    ...rest
}: StepProps) {
    return (
        <>
            <Flex
                gap="15px"
                alignItems="center"
                flexDirection={'column'}
                width={{ base: '70%', md: '100%' }}
                height={'100%'}
                alignSelf={'center'}
                {...rest}
            >
                <Text
                    fontSize="88px"
                    fontFamily="Roboto"
                    fontWeight="black"
                    fontStyle="italic"
                    letterSpacing="-4.4px"
                    style={{
                        color: 'transparent',
                        WebkitTextStrokeWidth: '1.1pt',
                        WebkitTextStrokeColor: 'white',
                    }}
                >
                    0{stepNumber}
                </Text>
                <Heading
                    fontSize="30px"
                    letterSpacing="0.6px"
                    textColor="white"
                    fontStyle="italic"
                    textAlign="center"
                    fontWeight="semibold"
                    fontFamily="Barlow Condensed"
                >
                    {stepDescription}
                </Heading>
            </Flex>
        </>
    )
}
