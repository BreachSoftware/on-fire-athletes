import { Heading, type HeadingProps } from "@chakra-ui/layout";

export default function ArticleSubtitle({ children, ...rest }: HeadingProps) {
    return (
        <Heading
            as="h2"
            size="md"
            textTransform="uppercase"
            fontFamily="Barlow Semi Condensed"
            fontWeight="bold"
            mt={8}
            mb={4}
            {...rest}
        >
            {children}
        </Heading>
    );
}
