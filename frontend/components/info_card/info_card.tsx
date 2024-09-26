import { Flex, Center, Heading } from '@chakra-ui/react'
import InfoSection, { InfoSectionProps } from './info_section'

type InfoSectionAttributes = InfoSectionProps

interface InfoCardProps {
    infoSections: InfoSectionAttributes[]
}

/**
 * Renders an info card component that has two elements.
 * @param {InfoCardProps} props - The props for the info card.
 * @returns {JSX.Element} The rendered info card.
 */
export default function InfoCard(props: InfoCardProps) {
    return (
        <>
            <Center
                px="48px"
                py="36px"
                bg="#27CE00"
                flexDir="column"
                borderRadius="6px"
            >
                <Heading
                    fontSize="30px"
                    textColor="white"
                    fontWeight="semibold"
                    letterSpacing="1.5px"
                    fontFamily="Barlow Semi Condensed"
                >
                    HOW ONFIRE ATHLETES WORKS:
                </Heading>
                <Flex
                    alignItems="center"
                    justifyContent="flex-start"
                    flexDirection={{ base: 'column', md: 'row' }}
                >
                    <InfoSection
                        description={props.infoSections[0].description}
                        buttonTitle={props.infoSections[0].buttonTitle}
                        buttonLink={props.infoSections[0].buttonLink}
                    />
                </Flex>
            </Center>
        </>
    )
}
