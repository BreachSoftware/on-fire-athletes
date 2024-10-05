import { Box } from "@chakra-ui/layout";

import StadiumLights from "@/images/backgrounds/stadium-lights.jpeg";

export default function OurStoryHeroBackground() {
    return (
        <Box position="absolute" top={0} left={0} w="full" h="full">
            <Box
                position="absolute"
                top={0}
                left={0}
                w="full"
                h="full"
                bgImage={StadiumLights.src}
                bgSize="cover"
                bgPosition="center"
                bgRepeat="no-repeat"
            />
            <Box
                position="absolute"
                top={0}
                left={0}
                w="full"
                h="60%"
                bgGradient="linear(to-b, #000, #00000000)"
            />
            <Box
                position="absolute"
                bottom={0}
                left={0}
                w="full"
                h="60%"
                bgGradient="linear(to-t, #000, #00000000)"
            />
        </Box>
    );
}
