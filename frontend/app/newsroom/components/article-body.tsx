import { Box, type BoxProps } from "@chakra-ui/layout";
import CrinkledPaper from "../images/crinkled-paper.png";

export default function ArticleBody({ children, ...rest }: BoxProps) {
    return (
        <Box w="full" position="relative">
            <Box
                position={"absolute"}
                top={"0"}
                left={"0"}
                right={"0"}
                bottom={"0"}
                backgroundImage={CrinkledPaper.src}
                backgroundRepeat="no-repeat"
                backgroundSize="cover"
                backgroundPosition={"center top"}
            />
            <Box
                position={"absolute"}
                top={"0"}
                left={"0"}
                right={"0"}
                bottom={"0"}
                bg="whiteAlpha.400"
            />
            <Box
                position="relative"
                pb={20}
                pt={{ base: "calc(120px + 48px)", xl: "calc(240px + 48px)" }}
                mx="auto"
                maxW="864px"
                color="black"
                px={{ base: "24px", md: 0 }}
                {...rest}
            >
                {children}
            </Box>
        </Box>
    );
}
