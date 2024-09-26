import { Fragment } from 'react'
import { Center, Heading, Flex, Box } from '@chakra-ui/layout'

import InfoItem, { InfoItemProps } from './item'

interface InfoCardProps {
    steps: InfoItemProps[]
}

/**
 * Renders an info card component that has two elements.
 * @param {InfoCardProps} props - The props for the info card.
 * @returns {JSX.Element} The rendered info card.
 */
export default function InfoCard({ steps }: InfoCardProps) {
    return (
        <Center
            pt={{ base: '32px', lg: '36px' }}
            px={{ base: '24px', lg: '48px' }}
            pb="48px"
            bg="#27CE00"
            flexDir="column"
            borderRadius="6px"
            h="fit-content"
            w="full"
        >
            <Heading
                mb={{ base: 6, lg: 8 }}
                fontSize={{ base: '18px', xs: '23px', lg: '30px' }}
                textColor="white"
                fontWeight="semibold"
                letterSpacing="1.5px"
                fontFamily="Barlow Semi Condensed"
            >
                HOW ONFIRE ATHLETES WORKS:
            </Heading>
            <Box
                w="full"
                h="1px"
                bg="white"
                mb={6}
                display={{ base: 'inline', lg: 'none' }}
            />
            <Flex
                flexDir={{ base: 'column', lg: 'row' }}
                h="full"
                w="full"
                gridGap="40px"
                alignItems="center"
                justifyContent="space-between"
            >
                {steps.map((step, i) => {
                    return (
                        <Fragment key={i}>
                            <InfoItem {...step} />
                            {i !== steps.length - 1 && (
                                <Box
                                    h={{ base: '1px', lg: '240px' }}
                                    w={{ base: 'full', lg: '1px' }}
                                    bg="white"
                                />
                            )}
                        </Fragment>
                    )
                })}
            </Flex>
        </Center>
    )
}
