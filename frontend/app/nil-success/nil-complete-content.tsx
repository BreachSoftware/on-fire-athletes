import { ChevronRightIcon } from "@chakra-ui/icons";
import { VStack, Flex, Text, Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BeatLoader } from "react-spinners";
import { ParagraphText } from "../our-story/components/the-spark";

export default function NilCompleteContent() {
    const router = useRouter();

    const [createNewCardButtonLoading, setCreateNewCardButtonLoading] =
        useState(false);

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
                        Card is Submitted
                    </Text>
                </VStack>
                <ParagraphText maxW="480px" textAlign="center" mb={4}>
                Once approved, you will receive an email that your card has been added to your profile and listed in the Locker Room for sale. This process typically takes 24hrs. 
                </ParagraphText>
                <VStack gap="20px">
                    <Button
                        variant={"next"}
                        w="100%"
                        _hover={{
                            filter: "none",
                            width: "100%",
                            fontStyle: "italic",
                            bg: "#27CE00AA",
                            borderColor: "#27CE00AA",
                        }}
                        onClick={() => {
                            setCreateNewCardButtonLoading(true);
                            router.push("/lockerroom");
                        }}
                        isLoading={createNewCardButtonLoading}
                        spinner={<BeatLoader color="white" size={8} />}
                    >
                        <Flex alignItems={"center"}>
                            <Text
                                letterSpacing={"2px"}
                                textTransform={"uppercase"}
                            >
                                {"START COLLECTING"}
                            </Text>
                            <ChevronRightIcon boxSize={"30px"} mr={"-10px"} />
                        </Flex>
                    </Button>
                </VStack>
            </VStack>
        </>
    );
}
