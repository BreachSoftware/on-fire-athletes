'use client'

import { Flex, Heading, Text } from '@chakra-ui/react'

export interface InfoItemProps {
    number: number
    description: string
}

export default function InfoItem({ number, description }: InfoItemProps) {
    return (
        <Flex
            alignItems="center"
            flexDirection="column"
            maxW={{ base: '224px', lg: 'none' }}
        >
            <Text
                fontSize={{ base: '50px', lg: '88px' }}
                lineHeight={{ base: '58px', lg: '116px' }}
                fontFamily="Roboto"
                fontWeight="black"
                fontStyle="italic"
                mb="7.5px"
                letterSpacing={{ base: '-2.5px', lg: '-4.4px' }}
                style={{
                    color: 'transparent',
                    WebkitTextStrokeWidth: '1.8px',
                    WebkitTextStrokeColor: 'white',
                }}
            >
                0{number}
            </Text>
            <Heading
                fontSize={{ base: '26px', lg: '30px' }}
                letterSpacing="0.6px"
                textColor="white"
                fontStyle="italic"
                textAlign="center"
                fontWeight="semibold"
                fontFamily="Barlow Condensed"
            >
                {description}
            </Heading>
        </Flex>
    )
}
