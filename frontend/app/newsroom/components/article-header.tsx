import { Flex, Box, Center } from "@chakra-ui/layout";

import ArticleTitle from "./title";
import StoryPaper from "@/images/backgrounds/story-paper.png";
import TheNewsRoomTitle from "./the-news-room";
import PhotoFrame from "@/components/in_the_news/photo_frame";

interface Props {
    title: string;
    image: string;
    isVideo?: boolean;
}

export default function ArticleHeader({ title, image, isVideo }: Props) {
    return (
        <Flex
            position="relative"
            h="fit-content"
            w="full"
            px={{ base: "24px", md: "72px" }}
            flexDir="column"
            alignItems="flex-start"
            justifyContent="space-between"
            pt="calc(88px + 48px)"
            overflow="visible"
            gridGap={{ base: "48px", xl: "72px" }}
        >
            <Box
                top={0}
                left={0}
                right={0}
                bottom={0}
                position="absolute" // Ensures proper stacking context
                bgImage={StoryPaper.src}
                bgSize="cover"
                bgPos="center top"
            />
            <Center position="relative" w="full">
                <TheNewsRoomTitle />
            </Center>
            <Flex
                position="relative"
                w="full"
                flexDir="column"
                alignItems="center"
                mb={{ base: "-120px", xl: "-240px" }}
                gridGap="32px"
            >
                <ArticleTitle textAlign="center" mb={0}>
                    {title}
                </ArticleTitle>
                <Box maxW="732px" w="full">
                    <PhotoFrame src={image} alt={title} isVideo={isVideo} />
                </Box>
            </Flex>
        </Flex>
    );
}
