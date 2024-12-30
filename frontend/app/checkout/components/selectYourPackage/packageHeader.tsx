import { Flex, Text } from "@chakra-ui/react";

interface PackageHeaderProps {
    title: string;
    price: number;
}

export default function PackageHeader({ title, price }: PackageHeaderProps) {
    return (
        <Flex
            flexDirection="column"
            alignItems="flex-start"
            justifyContent="flex-start"
            py="25px"
            px="36px"
            w="30%"
            minW="180px"
        >
            <Text
                fontFamily="Barlow Condensed"
                color="white"
                fontWeight="600"
                fontSize={{ base: "24px", md: "30px", xl: "32px" }}
                transform="skew(-5deg)"
                lineHeight="32px"
            >
                {title}
            </Text>
            <Text
                m={0}
                fontFamily="Barlow Condensed"
                color="green.100"
                fontSize={{ base: "24px", md: "30px", lg: "40px" }}
                fontWeight="600"
                transform="skew(-5deg)"
                lineHeight="42px"
            >
                ${price}
            </Text>
        </Flex>
    );
}
