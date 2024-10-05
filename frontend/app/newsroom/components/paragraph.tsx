import { Text, type TextProps } from "@chakra-ui/layout";

export default function ArticleParagraph({ children, ...rest }: TextProps) {
    return (
        <Text fontFamily="Helvetica Neue" textIndent="2em" mb={4} {...rest}>
            {children}
        </Text>
    );
}
