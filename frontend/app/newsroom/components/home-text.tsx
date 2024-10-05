import { Text, Link } from "@chakra-ui/layout";

export default function ReturnHomeText() {
    return (
        <Link href="/">
            <Text
                width={"100%"}
                fontSize={{
                    base: "xs",
                    md: "2xl",
                    lg: "14px",
                }}
                textAlign="center"
                fontFamily={"Roboto.100"}
                fontStyle="italic"
                textColor={"white"}
                letterSpacing={2.8}
            >
                BACK TO HOME
            </Text>
        </Link>
    );
}
