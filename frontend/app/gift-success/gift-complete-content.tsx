import { VStack, Text } from "@chakra-ui/react";
import { ParagraphText } from "../our-story/components/the-spark";

export default function GiftCompleteContent() {
    return (
        <>
            <VStack gap="20px">
                <VStack alignItems={"center"}>
                    <Text
                        textAlign="center"
                        fontFamily="Barlow Semi Condensed"
                        fontWeight="semibold"
                        fontStyle="italic"
                        letterSpacing="3.9px"
                        lineHeight={{ base: "29px", lg: "31px" }}
                        transform="uppercase"
                        color="#27CE01"
                        textColor="green.100"
                        fontSize={{
                            base: "20px",
                            md: "25px",
                            lg: "32px",
                            xl: "44px",
                        }}
                        marginBottom={{ base: "15px", md: "-15px" }}
                    >
                        YOU&rsquo;RE ONFIRE!
                    </Text>
                    <Text
                        fontFamily={"'Brotherhood', sans-serif"}
                        fontWeight={"medium"}
                        fontSize={{
                            base: "45px",
                            md: "50px",
                            lg: "60px",
                            xl: "79px",
                        }}
                        textAlign="center"
                        lineHeight={"1.2"}
                        pb={{ base: "15px", md: "0" }}
                    >
                        Gift successfully purchased!
                    </Text>
                </VStack>
                <ParagraphText maxW="480px" textAlign="center" mb={4}>
                    You will receive an email containing your one-time digital
                    coupon to share. This process typically takes 24hrs.
                </ParagraphText>
            </VStack>
        </>
    );
}
