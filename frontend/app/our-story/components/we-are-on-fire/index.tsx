import { Image } from "@chakra-ui/image";
import { Box, Center, Text, SimpleGrid } from "@chakra-ui/layout";

import PhoneAndCard from "@/images/mockups/phone-and-card.png";

export default function WeAreOnFireSection() {
    return (
        <Box
            position="relative"
            bg="#121212"
            px={{ base: "24px", lg: "156px" }}
            py="96px"
        >
            <SimpleGrid columns={{ base: 1, lg: 2 }}>
                <Image src={PhoneAndCard.src} alt="Phone and Card" />
                <Center flexDir="column" gridGap={{ base: "32px", lg: "52px" }}>
                    <Box>
                        <Text
                            fontFamily="Brotherhood"
                            fontSize={{ base: "52px", lg: "90px" }}
                            letterSpacing="0.9px"
                            textAlign="center"
                            color="#27CE01"
                        >
                            WE ARE ONFiRE!
                        </Text>
                        <Text
                            fontFamily="Barlow Condensed"
                            fontWeight="medium"
                            fontStyle="italic"
                            fontSize={{ base: "20px", lg: "28px" }}
                            letterSpacing="0.56px"
                            textAlign="center"
                        >
                            Our mission is to eliminate barriers, improve
                            access, and disrupt the current sports narrative by
                            empowering kids to create an everlasting legacy
                            through our platform.
                        </Text>
                    </Box>
                    <Box
                        rounded="full"
                        w="50%"
                        h="5px"
                        bg="#00DA1F"
                        filter="drop-shadow(0px 0px 15px #44FF19)"
                    />
                    <Text
                        fontFamily="Barlow"
                        fontWeight="medium"
                        fontSize={{ base: "16px", lg: "18px" }}
                        textAlign="center"
                        letterSpacing="0.36px"
                        px={{ base: 0, lg: "24px" }}
                    >
                        Sports participation has many benefits to our young
                        athletes. A few benefits are increased physical activity
                        and health, forming social and community bonds, facing
                        and overcoming challenges, and improving academic
                        potential. Unfortunately, too many kids never get the
                        chance to fully participate in all aspects of sports and
                        can be overlooked. We wanted to shine a light on all
                        athletes, regardless of background.
                    </Text>
                </Center>
            </SimpleGrid>
        </Box>
    );
}
