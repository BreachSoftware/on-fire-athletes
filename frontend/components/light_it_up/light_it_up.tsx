/* eslint-disable max-len */
import { Fragment } from 'react';
import { Flex, Grid, Heading, GridItem, VStack } from '@chakra-ui/react';
import LightItUpCard from './light_it_up_card';
import { useAuth } from '@/hooks/useAuth';
import LightItUpDivider from './divider';
import { LightItUpSection } from './types';
import LightItUpCarousel from './light_it_up_carousel';

/**
 * LightItUpComponent displays a list of interactive sections, each with an image, overlay text,
 * title, description, and a button to perform an action. This component encourages users to get involved or partake
 * in an activity. Although the data is mocked within the component, it could be sourced from props or an API
 * in a real-world application.
 *
 * @returns {JSX.Element} The rendered LightItUpComponent.
 */
export default function LightItUp() {
    const auth = useAuth();

    // This array would typically come from props or be fetched from an API. A temporary type is used to define the structure of the data
    const gameSections: LightItUpSection[] = [
        // Array of interactive sections, each would typically have an id, image, imageOverlayText, title, description, buttonTitle, and buttonLink
        {
            id: 1,
            videoUrl: 'ForAthletesPlayingCard.mp4',
            imageOverlaySubtitle: 'FOR',
            imageOverlayTitle: 'ATHLETES',
            title: 'Create a Custom Card',
            description:
                'Create your custom Digital & Physical AR sports cards to Capture, Showcase, Trade & Sell your favorite sports moments.',
            buttonTitle: 'START CREATING',
            buttonLink: '/create',
        },
        {
            id: 2,
            videoUrl: 'ForFansLockerRoomonLaptopandPhone.mp4',
            imageOverlaySubtitle: 'FOR',
            imageOverlayTitle: 'FANS',
            title: 'Shop the Marketplace',
            description:
                "Find tomorrow's stars today in our “Locker Room.” Follow their journey and build a collection of sports cards which helps fund each athletes dreams.",
            buttonTitle: 'START COLLECTING',
            buttonLink: '/lockerroom',
        },
        {
            id: 3,
            image: 'ForEveryoneFaninCirclev1.jpg',
            imageOverlaySubtitle: 'FOR',
            imageOverlayTitle: 'EVERYONE',
            title: 'Win Prizes & Experiences',
            description:
                'Create and Collect for chances to win one-of-a-kind prizes such as memorabilia, apparel, gear, game tickets, exclusive experiences.',
            buttonTitle: 'CREATE PROFILE',
            buttonLink: auth.isAuthenticated ? '/profile' : '/signup',
        },
    ];

    return (
        <Flex
            bgImage="darker-crinkled-paper.png"
            bgColor="gray.1300"
            px={{ base: '24px', lg: '64px', '2xl': '100px' }}
            minH="100vh"
            h="fit-content"
            flexDir="column"
            justifyContent="center"
            alignItems="center"
            py="64px"
        >
            <VStack gap={0} alignItems={'center'} mb={6}>
                <Heading
                    as="b"
                    size="xxl"
                    color="white"
                    textAlign="center"
                    fontFamily={"'Barlow Condensed', sans-serif"}
                    fontWeight={700}
                    letterSpacing={'2.5px'}
                    fontSize={{ base: '30px', lg: '38px', xl: '50px' }}
                    lineHeight={{ base: '32px', lg: '42px', xl: '70px' }}
                    textTransform="uppercase"
                >
                    EVERY SPORT, ATHLETE, LEVEL, AND FAN
                </Heading>
                <Heading
                    as="b"
                    size="xxl"
                    textAlign="center"
                    fontFamily={"'Brotherhood', sans-serif"}
                    fontWeight={100}
                    fontSize={{ base: '48px', xl: '80px' }}
                    fontStyle={'normal'}
                    lineHeight={{ base: 'auto', md: '66px', xl: '113px' }}
                    letterSpacing="4px"
                    color={'green.100'}
                    height="100%"
                >
                    LIGHT IT UP
                </Heading>
            </VStack>
            {/* Carousel of interactive sections for the mobile view */}
            <LightItUpCarousel sections={gameSections} />
            {/* Grid of interactive sections for the desktop view */}
            <Grid
                minW="100dvh"
                display={{ base: 'none', lg: 'grid' }}
                gridTemplateColumns={{
                    lg: '1fr 60px 1fr 60px 1fr',
                    xl: '1fr 100px 1fr 100px 1fr',
                }}
            >
                {gameSections.map((section, index) => {
                    return (
                        <Fragment key={index}>
                            <GridItem>
                                <LightItUpCard
                                    image={section.image || ''}
                                    videoUrl={section.videoUrl || ''}
                                    imageOverlayTitle={
                                        section.imageOverlayTitle
                                    }
                                    imageOverlaySubtitle={
                                        section.imageOverlaySubtitle
                                    }
                                    title={section.title}
                                    description={section.description}
                                    buttonTitle={section.buttonTitle}
                                    buttonLink={section.buttonLink}
                                    key={section.id}
                                />
                            </GridItem>
                            {/* Render divider between first two sections */}
                            {index < gameSections.length - 1 && (
                                <GridItem
                                    key={index + 1}
                                    display={{ base: 'none', md: 'inline' }}
                                >
                                    <LightItUpDivider />
                                </GridItem>
                            )}
                        </Fragment>
                    );
                })}
            </Grid>
        </Flex>
    );
}
