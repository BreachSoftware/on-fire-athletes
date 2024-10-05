import { Image } from "@chakra-ui/image";
import { Flex, Box, AspectRatio } from "@chakra-ui/layout";

import ArticleTitle from "./title";
import ReturnHomeText from "./home-text";

interface Props {
    title: string;
    image: string;
}

export default function ArticleHeader({ title, image }: Props) {
    return (
        <Flex
            position="relative"
            h="fit-content"
            w="full"
            px={{ base: "24px", md: "72px" }}
            pb="24px"
            flexDir="column"
            alignItems="flex-start"
            justifyContent="space-between"
            pt="calc(88px + 48px)"
            overflow="visible"
            gridGap="48px"
        >
            <Box
                top={0}
                left={0}
                right={0}
                bottom={0}
                position="absolute" // Ensures proper stacking context
                bgGradient="linear(to-b, #000000, #31453D)"
            />
            <Box position="relative">
                <ReturnHomeText />
            </Box>
            <Flex
                position="relative"
                w="full"
                flexDir="column"
                alignItems="center"
                mb="-72px"
                gridGap="24px"
            >
                <ArticleTitle textAlign="center" mb={0}>
                    {title}
                </ArticleTitle>
                <AspectRatio ratio={2} w={{ base: "full", md: "864px" }}>
                    <Image
                        zIndex={2}
                        src={image}
                        alt="title"
                        w="full"
                        h="full"
                        objectFit="cover"
                    />
                </AspectRatio>
            </Flex>
        </Flex>
    );
}
