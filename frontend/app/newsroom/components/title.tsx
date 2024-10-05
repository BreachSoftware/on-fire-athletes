import { Heading, type HeadingProps } from "@chakra-ui/layout";

export default function ArticleTitle({ children, ...rest }: HeadingProps) {
    return (
        <Heading
            as="h1"
            size="2xl"
            color="green.600"
            textTransform="uppercase"
            fontFamily="Barlow Semi Condensed"
            fontWeight="bold"
            textAlign="center"
            mb={6}
            {...rest}
        >
            {children}
        </Heading>
    );
}
