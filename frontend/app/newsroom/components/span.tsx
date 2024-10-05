import { Box, type BoxProps } from "@chakra-ui/layout";

export default function ArticleSpan({ children, ...rest }: BoxProps) {
    return (
        <Box as="span" {...rest}>
            {children}
        </Box>
    );
}
