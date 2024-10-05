import { Box } from "@chakra-ui/layout";

import StoryPaper from "@/images/backgrounds/story-paper.png";

export default function TheSparkBackground() {
    return (
        <Box
            position="absolute"
            top={0}
            left={0}
            w="full"
            h="full"
            bgImage={StoryPaper.src}
            bgSize="cover"
            bgPosition="center"
            bgRepeat="no-repeat"
        />
    );
}
