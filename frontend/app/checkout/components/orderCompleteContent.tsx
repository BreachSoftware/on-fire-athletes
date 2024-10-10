import { useAuth } from "@/hooks/useAuth";
import { ChevronRightIcon } from "@chakra-ui/icons";
import {
    VStack,
    Button,
    Link,
    Text,
    Flex,
    useToast,
    useBreakpointValue,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";

interface OrderCompleteContentProps {
    cardUUID: string;
    generatedByUUID: string;
    buyingOtherCard: boolean;
}

/**
 * The content for the right side of the Order Complete page
 * @returns JSX.Element
 */
export default function OrderCompleteContent(props: OrderCompleteContentProps) {
    const router = useRouter();
    const toast = useToast();
    const auth = useAuth();

    const [userId, setUserId] = useState("");

    const isMobile = useBreakpointValue({ base: true, md: false });

    const [createNewCardButtonLoading, setCreateNewCardButtonLoading] =
        useState(false);
    const [viewLockerRoomButtonLoading, setViewLockerRoomButtonLoading] =
        useState(false);

    useEffect(() => {
        /**
         * This function gets the UUID of the current user
         */
        async function getUUID() {
            const user = await auth.currentAuthenticatedUser();
            const userId = user.userId;
            return userId;
        }

        getUUID().then((userId) => {
            setUserId(userId);
        });
    }, [auth]);

    /**
     * This function shares the card on social media
     */
    function shareCardOnSocialMedia() {
        if (typeof window !== "undefined" && navigator.share) {
            navigator
                .share({
                    title: "Check out my new OnFire card!",
                    text: "I just created a new OnFire card. Check it out!",
                    url: `https://on-fire-athletes.netlify.app/profile?user=${props.generatedByUUID}&card=${props.cardUUID}`,
                })
                .then(() => {
                    toast({
                        title: "Card shared successfully!",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                    });
                })
                .catch((error) => {
                    console.error("Error sharing card: ", error);
                });
        } else {
            // Fallback to copy the link to the clipboard
            navigator.clipboard
                .writeText(
                    `https://on-fire-athletes.netlify.app/profile?user=${props.generatedByUUID}&card=${props.cardUUID}`,
                )
                .then(() => {
                    toast({
                        title: "Card link copied to clipboard!",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                    });
                })
                .catch((error) => {
                    console.error(
                        "Error copying card link to clipboard: ",
                        error,
                    );
                    toast({
                        title: "Error copying card link to clipboard",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                    });
                });
        }
    }

    return (
        <>
            <VStack gap="20px">
                <VStack alignItems={"center"}>
                    <Text
                        textColor="green.100"
                        fontFamily={"Barlow Condensed"}
                        fontWeight={"light"}
                        fontStyle={"italic"}
                        fontSize={{
                            base: "20px",
                            md: "25px",
                            lg: "32px",
                            xl: "44px",
                        }}
                        marginBottom={isMobile ? "15px" : "-15px"}
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
                        pb={isMobile ? "15px" : "0"}
                    >
                        Order Complete
                    </Text>
                </VStack>
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
                            if (props.buyingOtherCard) {
                                router.push(
                                    `/profile?user=${userId}&card=${props.cardUUID}&tab=bought`,
                                );
                            } else {
                                router.push("/lockerroom");
                            }
                        }}
                        isLoading={createNewCardButtonLoading}
                        spinner={<BeatLoader color="white" size={8} />}
                    >
                        <Flex alignItems={"center"}>
                            <Text
                                letterSpacing={"2px"}
                                textTransform={"uppercase"}
                            >
                                {props.buyingOtherCard
                                    ? "VIEW BOUGHT CARD"
                                    : "START COLLECTING"}
                            </Text>
                            <ChevronRightIcon boxSize={"30px"} mr={"-10px"} />
                        </Flex>
                    </Button>
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
                            setViewLockerRoomButtonLoading(true);
                            router.push("/create/card_creation");
                        }}
                        isLoading={viewLockerRoomButtonLoading}
                        spinner={<BeatLoader color="white" size={8} />}
                    >
                        <Flex alignItems={"center"}>
                            <Text letterSpacing={"2px"}>CREATE A NEW CARD</Text>
                            <ChevronRightIcon boxSize={"30px"} mr={"-10px"} />
                        </Flex>
                    </Button>
                </VStack>
                <Link
                    marginTop={"20px"}
                    fontSize={"medium"}
                    letterSpacing={"2px"}
                    textDecoration={"underline"}
                    onClick={shareCardOnSocialMedia}
                >
                    SHARE CARD ON SOCIAL
                </Link>
            </VStack>
        </>
    );
}
