import { Flex, Text } from "@chakra-ui/react";

interface PackageHeaderProps {
    title: string;
    price?: string;
}

export default function PackageHeader({ title, price }: PackageHeaderProps) {
    return (
        <Flex
            flexDirection={{ base: "row", xl: "column" }}
            alignItems="flex-start"
            justifyContent={{ base: "space-between", xl: "flex-start" }}
            py={{ base: "16px", xl: "16px" }}
            px={{ base: "24px", xl: "24px" }}
            minW="180px"
            gap="8px"
        >
            <Text
                fontFamily="Barlow Condensed"
                color="white"
                fontWeight="600"
                fontSize={{ base: "30px", xl: "32px" }}
                transform="skew(-5deg)"
                lineHeight="36px"
            >
                {title}
            </Text>
            {price && (
                <Text
                    m={0}
                    fontFamily="Barlow Condensed"
                    color="green.100"
                    fontSize={{ base: "32px", xl: "40px" }}
                    fontWeight="600"
                    transform="skew(-5deg)"
                    lineHeight="36px"
                >
                    ${price}
                </Text>
            )}
        </Flex>
    );
}
