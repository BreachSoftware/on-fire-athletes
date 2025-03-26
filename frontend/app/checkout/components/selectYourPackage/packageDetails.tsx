import { Flex, Text } from "@chakra-ui/react";
import { PackageType } from "@/app/checkout/components/selectYourPackage/packages";
import SharedStack from "@/components/shared/wrappers/shared-stack";
import PackageHeader from "./packageHeader";

export default function PackageDetails({}: { pkg: PackageType }) {
    return (
        <Flex
            flexDirection="column"
            alignItems="flex-start"
            px={{ base: "25px", xl: "25px" }}
            pt={{ base: 0, xl: "25px" }}
            pb={{ base: "18px", xl: "30px" }}
            fontSize={{ base: "12px", lg: "14px" }}
            h="max-content"
        >
            <Text
                fontFamily="Barlow Condensed"
                textColor="green.200"
                marginBottom="5px"
                textDecoration="underline"
            >
                INCLUDES:
            </Text>
            <SharedStack>
                {["50 digital cards", "10 physical AR cards", "1 bag tag"].map(
                    (item) => (
                        <PackageHeader key={item} title={item} />
                    ),
                )}
            </SharedStack>
        </Flex>
    );
}
