import { Box, Text, Flex, SimpleGrid } from "@chakra-ui/layout";

import TheSparkBackground from "./background";
import SharedStack from "@/components/shared/wrappers/shared-stack";
import { TextProps } from "@chakra-ui/react";

export default function TheSparkSection() {
    return (
        <Box position="relative">
            <TheSparkBackground />
            <Flex
                position="relative"
                flexDir="column"
                px={{ base: "24px", lg: "212px" }}
                py={{ base: "72px", lg: "156px" }}
                alignItems="center"
                gridGap="48px"
                maxW={{ "2xl": "1720px" }}
                mx={{ "2xl": "auto" }}
            >
                <Box px={{ base: 0, lg: "112px" }}>
                    <Text
                        color="#27CE01"
                        fontFamily="Brotherhood"
                        fontSize={{ base: "64px", lg: "90px" }}
                        letterSpacing="0.9px"
                        textAlign="center"
                    >
                        The Spark
                    </Text>
                    <Text
                        fontFamily="Barlow Condensed"
                        fontStyle="italic"
                        fontSize={{ base: "28px", lg: "48px" }}
                        letterSpacing="0.96px"
                        lineHeight={{ base: "30px", lg: "52px" }}
                        textAlign="center"
                    >
                        Every athlete has a story…where they come from, why they
                        play, who they're playing for.
                    </Text>
                </Box>
                <SimpleGrid
                    columns={{ base: 0, lg: 2 }}
                    spacingX={{ base: 0, lg: "72px" }}
                    spacingY={{ base: 6, lg: 0 }}
                >
                    <SharedStack spacing={6}>
                        <ParagraphText>
                            They all have a moment. A moment when they first
                            held a bat, their first perfect 10, the game-winning
                            kick, won the state championship.
                        </ParagraphText>
                        <ParagraphText>
                            Those moments are too often fleeting. They're seen
                            as a single post on social media, swiped through,
                            and forgotten about. What if we capture that moment?
                            What if it lived forever?
                        </ParagraphText>
                        <ParagraphText>
                            What if the nostalgia of opening a pack of cards,
                            trading with friends, and showcasing your collection
                            met our modern-day lives?
                        </ParagraphText>
                        <ParagraphText>
                            What if you could save that moment and hold it in
                            the palm of your hand?
                        </ParagraphText>
                    </SharedStack>
                    <SharedStack spacing={6}>
                        <ParagraphText>
                            What if everyone could create and share their
                            moment, regardless of background? What if you could
                            chart your path? What if we could leave no athlete
                            behind? What if we created something where you
                            didn't have to hire a PR firm? What if you could
                            make your own sports card and create your own hype?
                            What if you could share your success? What if it
                            didn't matter where you came from?
                        </ParagraphText>
                        <ParagraphText>
                            The court, the field, the gym, the arena…ONFIRE
                            doesn't care. The athlete is all that matters.
                        </ParagraphText>
                        <ParagraphText>
                            These are the questions that sparked us to create
                            ONFIRE Athletes.
                        </ParagraphText>
                    </SharedStack>
                </SimpleGrid>
            </Flex>
        </Box>
    );
}

export function ParagraphText({ children, ...rest }: TextProps) {
    return (
        <Text
            fontFamily="Barlow"
            fontSize="18px"
            fontWeight="medium"
            letterSpacing="0.36px"
            {...rest}
        >
            {children}
        </Text>
    );
}
