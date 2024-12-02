import { Box } from "@chakra-ui/layout";
import HeaderBackground from "@/images/backgrounds/Header-Abstract-Background.jpg";

export default function ProfileHeaderBackground() {
    return (
        <Box
            position="absolute"
            top={0}
            left={0}
            bottom={0}
            w="100dvw"
            bgImage={HeaderBackground.src}
            backgroundPosition="center"
            opacity={0.36}
            mixBlendMode="luminosity"
            bgSize="cover"
        >
            <Box
                // bgGradient="linear-gradient(90deg, #00000088, #00000077 25%, #00000077 75%, #00000088 100%)"
                w="100%"
                h="100%"
            />
        </Box>
    );
}
