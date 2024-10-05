import { Box } from "@chakra-ui/layout";

import StoryPaper from "@/images/backgrounds/story-paper.png";

export default function YourFutureBackground() {
    return (
        <Box
            position="absolute"
            top={0}
            left={0}
            w="full"
            h="full"
            bgImage={StoryPaper.src}
            bgRepeat="no-repeat"
            bgSize="cover"
            bgPos="center"
        />
    );
}
