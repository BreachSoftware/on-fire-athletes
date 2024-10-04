"use client";

import {
    Divider,
    Collapse,
    Flex,
    Grid,
    Text,
    useDisclosure,
    useToast,
    Box,
    Spinner,
} from "@chakra-ui/react";
import CardDropShadow from "@/components/create/CardDropShadow";
import { useEffect, useRef, useState } from "react";
import { Element } from "react-scroll";
// eslint-disable-next-line no-use-before-define
import React from "react";
import TradingCardInfo from "@/hooks/TradingCardInfo";
import SendMyCardModal from "./sendMyCardModal";
import CardListGrid from "./CardListGrid";
import OnFireCard, {
    OnFireCardRef,
} from "@/components/create/OnFireCard/OnFireCard";
import LoginModal from "@/components/loginModal";
import { AddToCollectionModal } from "./addToCollectionModal";
import ViewedCardActionButton from "./viewedCardActionButton";
import SerializedTradingCard from "@/hooks/SerializedTradingCard";
import { useRouter } from "next/navigation";

export enum TabName {
    Created = "CREATED",
    Traded = "TRADED",
    Bought = "BOUGHT",
}

interface ProfileAlbumProps {
    currentProfileId: string;
    currentUserName: string;
    currentUserId: string;
    createdCardList: TradingCardInfo[];
    tradedCardList: SerializedTradingCard[];
    boughtCardList: SerializedTradingCard[];
    privateView: boolean;
}

/**
 * The Album tab component on the Profile page.
 * @param props The props for the ProfileAlbumTab component.
 * @returns The rendered ProfileAlbumTab component.
 */
export default function ProfileAlbumTab(props: ProfileAlbumProps) {
    const toast = useToast();
    const router = useRouter();
    const [currentTab, setCurrentTab] = useState(TabName.Created);
    const [currentCard, setCurrentCard] = useState(new TradingCardInfo({}));
    const [currentSerializedCard, setCurrentSerializedCard] = useState(
        new SerializedTradingCard(0, new TradingCardInfo({})),
    );
    const [viewCardClicked, setViewCardClicked] = useState(false);
    const [firstVisitFromRedirect, setFirstVisitFromRedirect] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const queryParams = new URLSearchParams(window.location.search);
    const currentCardYearCreated = new Date(
        currentCard.createdAt * 1000,
    ).getFullYear();
    const onFireCardRef = useRef<OnFireCardRef | null>(null);
    const isBuyableCard =
        currentCard.price !== 0 &&
        currentCard.currentlyAvailable > 0 &&
        !props.privateView;

    // Scroll to the top of the page when the page changes if the page didn't just load
    const navigateToTopOfList = useRef<HTMLDivElement>(null);

    // Detect the user agent to determine if the user is on a mobile device
    let userAgent = "";
    if (typeof window !== "undefined" && navigator) {
        userAgent = navigator.userAgent.toLowerCase();
    }
    const isMobile =
        /mobile|android|ipad|iphone|ipod|blackberry|iemobile|opera mini/i.test(
            userAgent,
        );

    // Handle the first visit from a redirect with a card ID in the query params
    useEffect(() => {
        if (firstVisitFromRedirect) {
            const cardId = queryParams.get("card");
            if (cardId) {
                const card = props.createdCardList.find((card) => {
                    return card.uuid === cardId;
                });
                if (card) {
                    setCurrentCard(card);
                    setViewCardClicked(true);
                    setFirstVisitFromRedirect(false);
                }
            }
        }
    }, [firstVisitFromRedirect, props.createdCardList, queryParams]);

    // Handle the first visit from a redirect with a tab and card ID in the query params
    useEffect(() => {
        const tabSelected = queryParams.get("tab");
        if (tabSelected && firstVisitFromRedirect) {
            const cardId = queryParams.get("card");
            let card = null;
            switch (tabSelected) {
                case "created":
                    setCurrentTab(TabName.Created);
                    card = props.createdCardList.find((card) => {
                        return card.uuid === cardId;
                    });
                    break;
                case "traded":
                    setCurrentTab(TabName.Traded);
                    card = props.tradedCardList.find((card) => {
                        return card.TradingCardInfo.uuid === cardId;
                    });
                    break;
                case "bought":
                    setCurrentTab(TabName.Bought);
                    card = props.boughtCardList.find((card) => {
                        return card.TradingCardInfo.uuid === cardId;
                    });
                    break;
                default:
                    break;
            }
            if (card instanceof SerializedTradingCard) {
                setCurrentSerializedCard(card);
                setViewCardClicked(true);
                setFirstVisitFromRedirect(false);
            } else if (card instanceof TradingCardInfo) {
                setCurrentCard(card);
                setViewCardClicked(true);
                setFirstVisitFromRedirect(false);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryParams]);

    // When a serialized card is clicked, set the current card to the serialized card's TradingCardInfo
    useEffect(() => {
        if (currentSerializedCard.TradingCardInfo.uuid) {
            setCurrentCard(currentSerializedCard.TradingCardInfo);
        }
    }, [currentSerializedCard]);
    // stop the spinner after 3 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);
        return () => {
            clearTimeout(timer);
        };
    }, [currentTab]);

    // when the page is flipped, reset the spinner
    useEffect(() => {
        setIsLoading(true);
    }, [currentTab]);

    const sendCardModal = useDisclosure();
    const loginModal = useDisclosure();
    const addToCollectionModal = useDisclosure();

    // Determine if the button should be disabled based on the current tab and card availability
    const buttonShouldBeDisabled = props.privateView
        ? currentTab === TabName.Created && currentCard.currentlyAvailable <= 0
        : currentCard.currentlyAvailable <= 0;

    /**
     * Function to verify opening the SendMyCardModal.
     */
    function processSendCardModalOpen() {
        if (props.privateView) {
            sendCardModal.onOpen();
        }
    }

    /**
     * This function is used to share the card via the Web Share API.
     */
    async function tradeCardShare() {
        const senderUUID = props.currentUserId;
        const generatedByUUID = currentCard.generatedBy;
        const cardUUID = currentCard.uuid;

        if (!senderUUID || !generatedByUUID || !cardUUID) {
            console.error(
                "Error sharing: No user UUID, no generatedBy UUID, or card UUID found",
            );
            toast({
                title: "Error Sharing!",
                description:
                    "An error occurred while sharing the card. Please try again later.",
                duration: 5000,
                isClosable: true,
                status: "error",
            });
            return;
        }

        const sharedData = {
            title: "OnFire Trading Card",
            text: "Click here to accept my OnFire Trading trading card!",
            url: `https://gamechangers.zenithsoftware.dev/signup?generatedByUUID=${generatedByUUID}&fromUUID=${senderUUID}&cardUUID=${cardUUID}`,
        };

        try {
            if (typeof window !== "undefined" && navigator.share) {
                await navigator.share(sharedData);
            }
            // If the share was successful, show a success message
            toast({
                title: "Card Shared!",
                duration: 5000,
                isClosable: true,
                status: "success",
            });
        } catch (err) {
            console.error(`Error sharing: ${err}`);
        }
    }

    /**
     * Function to handle the what kind of action button to show
     */
    function actionButtonUI() {
        // If there are no cards available, the button should be disabled
        if (buttonShouldBeDisabled) {
            return (
                <ViewedCardActionButton
                    opacity="0.4"
                    hover={{ cursor: "not-allowed" }}
                    onClick={() => {}}
                >
                    <Text
                        fontFamily={"Barlow"}
                        fontSize="16px"
                        fontWeight="600"
                        letterSpacing="2px"
                    >
                        CARD UNAVAILABLE
                    </Text>
                </ViewedCardActionButton>
            );
        } else if (props.privateView) {
            // If the user is on their account, they should be able to sell their cards, regardless of the price
            if (
                currentTab === TabName.Created ||
                currentTab === TabName.Traded
            ) {
                return (
                    <ViewedCardActionButton
                        opacity={"1"}
                        hover={{
                            bgColor: "#CCC",
                            cursor: "pointer",
                            color: "black",
                        }}
                        onClick={
                            isMobile ? tradeCardShare : processSendCardModalOpen
                        }
                    >
                        <Text
                            fontFamily={"Barlow"}
                            fontSize="18px"
                            fontWeight="600"
                            letterSpacing="2px"
                        >
                            SEND MY CARD
                        </Text>
                    </ViewedCardActionButton>
                );
            }
            // If the user is viewing the bought tab, the button should not appear
            return null;
        }

        // If the user is not viewing the private view
        if (currentTab === TabName.Created) {
            if (isBuyableCard) {
                return (
                    <Flex
                        width={"100%"}
                        alignItems={"center"}
                        direction={{ base: "column", md: "row" }}
                        backgroundColor={"gray.1100"}
                        borderRadius={"8px"}
                        padding={"20px"}
                        paddingX={"30px"}
                        gap={{ base: "20px", md: "40px" }}
                    >
                        <ViewedCardActionButton
                            opacity={"1"}
                            hover={{
                                bgColor: "#CCC",
                                cursor: "pointer",
                                color: "black",
                            }}
                            onClick={() => {
                                if (props.currentUserId) {
                                    // Saves the card information to local storage
                                    TradingCardInfo.saveCard(currentCard);

                                    // Redirect the user to the payment page
                                    router.push(
                                        "/checkout?buyingOtherCard=true",
                                    );
                                } else {
                                    loginModal.onOpen();
                                }
                            }}
                            alignSelf="center"
                        >
                            <Text
                                fontFamily={"Barlow"}
                                fontSize="18px"
                                fontWeight="600"
                                letterSpacing="2.5px"
                            >
                                BUY NOW
                            </Text>
                        </ViewedCardActionButton>

                        <Text
                            maxW={{ base: "100%", md: "60%" }}
                            fontFamily={"Barlow"}
                            fontSize={"16px"}
                            fontWeight="medium"
                            letterSpacing="0.32px"
                            lineHeight={"19px"}
                            color={"white.100"}
                        >
                            By purchasing a digital card, you will also receive
                            a physical card in the mail.
                        </Text>
                    </Flex>
                );
            }
            return (
                <ViewedCardActionButton
                    opacity={"1"}
                    hover={{
                        bgColor: "#CCC",
                        cursor: "pointer",
                        color: "black",
                    }}
                    onClick={() => {
                        if (props.currentUserId) {
                            addToCollectionModal.onOpen();
                        } else {
                            loginModal.onOpen();
                        }
                    }}
                >
                    <Text
                        fontFamily={"Barlow"}
                        fontSize="18px"
                        fontWeight="600"
                        letterSpacing="2px"
                    >
                        REQUEST TRADE
                    </Text>
                </ViewedCardActionButton>
            );
        }
        // If the user is viewing the traded tab or bought tab, the button should not appear
        return null;
    }

    return (
        <>
            <Flex w="full" direction="column" align="center">
                <Box w="full">
                    <Collapse in={viewCardClicked} animateOpacity>
                        <Box w="full">
                            <Flex
                                direction="column"
                                w="full"
                                align="center"
                                mt="-50px"
                            >
                                <Flex
                                    w="max-content"
                                    borderRadius="10px"
                                    direction={{ base: "column", xl: "row" }}
                                    alignItems="center"
                                    gap={{ base: "0px", sm: "15px" }}
                                >
                                    {/* Container for the Card */}
                                    <Flex
                                        w={{ base: "100%", md: "331px" }}
                                        aspectRatio={2 / 3}
                                        borderRadius="20px"
                                        gridGap={{ base: "8px", md: "24px" }}
                                        direction="column"
                                        align="center"
                                        mt={{ sm: "50px" }}
                                        mb="24px"
                                        position="relative"
                                    >
                                        <Element
                                            name="cardElement"
                                            className="element"
                                        />
                                        <Box
                                            position="relative"
                                            w="full"
                                            h="full"
                                            transform={{
                                                base: "scale(0.775)",
                                                md: "none",
                                            }}
                                        >
                                            <OnFireCard
                                                key={currentCard.uuid}
                                                slim
                                                card={currentCard}
                                                showButton={false}
                                                ref={onFireCardRef}
                                                shouldFlipOnClick
                                            />
                                        </Box>
                                        <CardDropShadow />
                                    </Flex>
                                    <Flex w="100px" h="100%" />
                                    <Flex
                                        direction="column"
                                        w="75vw"
                                        maxW="500px"
                                        justify="center"
                                        mb={{ base: "10px", md: "60px" }}
                                        userSelect={"none"}
                                    >
                                        <Text
                                            fontFamily="'Barlow Condensed', sans-serif"
                                            fontSize="24px"
                                            color="green.100"
                                            fontStyle="italic"
                                            fontWeight="semibold"
                                            letterSpacing={"2px"}
                                            textTransform={"uppercase"}
                                            lineHeight={"16px"}
                                            mb="8px"
                                        >
                                            {currentCard.firstName}{" "}
                                            {currentCard.lastName},
                                        </Text>
                                        <Text
                                            fontFamily="'Barlow Condensed', sans-serif"
                                            fontSize="24px"
                                            color="green.100"
                                            fontStyle="italic"
                                            fontWeight="semibold"
                                            letterSpacing={"0.48px"}
                                            mb="8px"
                                        >
                                            {currentCard.sport},{" "}
                                            {currentCard.position} /{" "}
                                            {currentCard.teamName}
                                        </Text>
                                        <Text
                                            lineHeight="30px"
                                            letterSpacing="0.25px"
                                            mb="30px"
                                        >
                                            {currentCard.NFTDescription}
                                        </Text>
                                        <Grid
                                            templateColumns="3fr 3fr"
                                            templateRows="repeat(1, 1fr)"
                                            alignItems="center"
                                            w={{ base: "100%", xl: "500px" }}
                                            gap="25px"
                                            fontSize="18px"
                                            color="white"
                                            mb="32px"
                                        >
                                            {currentCard.price !== 0 ? (
                                                <>
                                                    <Text
                                                        fontFamily="Barlow"
                                                        fontWeight={500}
                                                    >
                                                        Price
                                                    </Text>
                                                    <Text
                                                        color={"gray.400"}
                                                        fontFamily="Barlow"
                                                        fontWeight={400}
                                                    >
                                                        $
                                                        {currentCard?.price?.toFixed(
                                                            2,
                                                        )}
                                                    </Text>
                                                </>
                                            ) : null}
                                            {currentTab !== TabName.Created &&
                                            currentSerializedCard.serialNumber ? (
                                                <>
                                                    <Text
                                                        fontFamily="Barlow"
                                                        fontWeight={500}
                                                    >
                                                        Card Number
                                                    </Text>
                                                    <Text
                                                        color={"gray.400"}
                                                        fontFamily="Barlow"
                                                        fontWeight={400}
                                                    >
                                                        {
                                                            currentSerializedCard.serialNumber
                                                        }{" "}
                                                        of{" "}
                                                        {
                                                            currentCard.totalCreated
                                                        }
                                                    </Text>
                                                </>
                                            ) : (
                                                <>
                                                    <Text
                                                        fontFamily="Barlow"
                                                        fontWeight={500}
                                                    >
                                                        Cards Available
                                                    </Text>
                                                    <Text
                                                        color={"gray.400"}
                                                        fontFamily="Barlow"
                                                        fontWeight={400}
                                                    >
                                                        {
                                                            currentCard.currentlyAvailable
                                                        }{" "}
                                                        of{" "}
                                                        {
                                                            currentCard.totalCreated
                                                        }
                                                    </Text>
                                                </>
                                            )}
                                            <Text
                                                fontFamily="Barlow"
                                                fontWeight={500}
                                            >
                                                Year Created / Package Type
                                            </Text>
                                            <Text
                                                color={"gray.400"}
                                                fontFamily="Barlow"
                                                fontWeight={400}
                                            >
                                                {currentCardYearCreated} /{" "}
                                                {currentCard.price == 0
                                                    ? "Rookie Package"
                                                    : "All-Star Package"}
                                            </Text>
                                        </Grid>
                                        {/* Button code */}
                                        {actionButtonUI()}
                                        {/* Add the AddToCollection Modal */}
                                        {!isMobile ? (
                                            <SendMyCardModal
                                                fromName={props.currentUserName}
                                                isOpen={sendCardModal.isOpen}
                                                onOpen={
                                                    processSendCardModalOpen
                                                }
                                                onClose={sendCardModal.onClose}
                                                currentCard={currentCard}
                                            />
                                        ) : null}
                                        {/* Add the Login Modal */}
                                        <LoginModal
                                            isOpen={loginModal.isOpen}
                                            onOpen={loginModal.onOpen}
                                            onClose={loginModal.onClose}
                                        />
                                        {/* Add the AddToCollection Modal */}
                                        <AddToCollectionModal
                                            isOpen={addToCollectionModal.isOpen}
                                            onOpen={addToCollectionModal.onOpen}
                                            onClose={
                                                addToCollectionModal.onClose
                                            }
                                            currentCard={currentCard}
                                            fromName={props.currentUserName}
                                            currentUserId={props.currentUserId}
                                        />
                                    </Flex>
                                </Flex>
                                <Divider
                                    w="full"
                                    h="2px"
                                    borderRadius="full"
                                    bgColor="gray.100"
                                    opacity="25%"
                                    my="20px"
                                />
                            </Flex>
                        </Box>
                    </Collapse>
                </Box>
                <Flex
                    w="full"
                    gap={{ base: "50px", md: "0px" }}
                    mt={{ base: "30px", md: "0px" }}
                    mb={{ base: "30px", md: "80px" }}
                    direction={"row"}
                    align={{ base: "center", md: "flex-start" }}
                    justifyContent={{ base: "center", sm: "flex-start" }}
                >
                    <Text
                        mr={{ base: "0px", md: "40px" }}
                        fontSize="20px"
                        _hover={{ cursor: "pointer" }}
                        textColor={
                            currentTab === TabName.Created
                                ? "green.100"
                                : "white"
                        }
                        textDecor={
                            currentTab === TabName.Created
                                ? "underline"
                                : "none"
                        }
                        onClick={() => {
                            setCurrentTab(TabName.Created);
                            setViewCardClicked(false);
                            setCurrentCard(new TradingCardInfo({}));
                            setCurrentSerializedCard(
                                new SerializedTradingCard(
                                    0,
                                    new TradingCardInfo({}),
                                ),
                            );
                        }}
                    >
                        Created
                    </Text>
                    <Text
                        mr={{ base: "0px", md: "40px" }}
                        fontSize="20px"
                        _hover={{ cursor: "pointer" }}
                        textColor={
                            currentTab === TabName.Traded
                                ? "green.100"
                                : "white"
                        }
                        textDecor={
                            currentTab === TabName.Traded ? "underline" : "none"
                        }
                        onClick={() => {
                            setCurrentTab(TabName.Traded);
                            setViewCardClicked(false);
                            setCurrentCard(new TradingCardInfo({}));
                            setCurrentSerializedCard(
                                new SerializedTradingCard(
                                    0,
                                    new TradingCardInfo({}),
                                ),
                            );
                        }}
                    >
                        Traded
                    </Text>
                    <Text
                        mr={{ base: "0px", md: "40px" }}
                        fontSize="20px"
                        _hover={{ cursor: "pointer" }}
                        textColor={
                            currentTab === TabName.Bought
                                ? "green.100"
                                : "white"
                        }
                        textDecor={
                            currentTab === TabName.Bought ? "underline" : "none"
                        }
                        onClick={() => {
                            setCurrentTab(TabName.Bought);
                            setViewCardClicked(false);
                            setCurrentCard(new TradingCardInfo({}));
                            setCurrentSerializedCard(
                                new SerializedTradingCard(
                                    0,
                                    new TradingCardInfo({}),
                                ),
                            );
                        }}
                        ref={navigateToTopOfList}
                    >
                        Bought
                    </Text>
                </Flex>

                {/* Card Grid for Created Cards */}
                {currentTab === TabName.Created &&
                    (isLoading ? (
                        <Spinner
                            speed={"0.75s"}
                            color="white"
                            w="150px"
                            h="150px"
                            margin={"auto"}
                        />
                    ) : (
                        <CardListGrid
                            cardList={props.createdCardList}
                            currentUserId={props.currentUserId}
                            currentCard={currentCard}
                            setCurrentCard={setCurrentCard}
                            privateView={props.privateView}
                            onSendCardModalOpen={
                                isMobile
                                    ? tradeCardShare
                                    : processSendCardModalOpen
                            }
                            loginModalOpen={loginModal.onOpen}
                            onAddToCollectionModalOpen={
                                addToCollectionModal.onOpen
                            }
                            setViewCardClicked={setViewCardClicked}
                            itemsPerPage={6}
                            tabName={TabName.Created}
                            navigateToTopOfList={navigateToTopOfList}
                        />
                    ))}

                {/* Card Grid for Traded Cards */}
                {currentTab === TabName.Traded &&
                    (isLoading ? (
                        <Spinner
                            speed={"0.75s"}
                            color="white"
                            w="150px"
                            h="150px"
                            margin={"auto"}
                        />
                    ) : (
                        <CardListGrid
                            cardList={props.tradedCardList}
                            currentUserId={props.currentUserId}
                            currentCard={currentCard}
                            setCurrentCard={setCurrentCard}
                            setCurrentSerializedCard={setCurrentSerializedCard}
                            privateView={props.privateView}
                            onSendCardModalOpen={
                                isMobile
                                    ? tradeCardShare
                                    : processSendCardModalOpen
                            }
                            loginModalOpen={loginModal.onOpen}
                            onAddToCollectionModalOpen={
                                addToCollectionModal.onOpen
                            }
                            setViewCardClicked={setViewCardClicked}
                            itemsPerPage={6}
                            tabName={TabName.Traded}
                            navigateToTopOfList={navigateToTopOfList}
                        />
                    ))}

                {/* Card Grid for Bought Cards */}
                {currentTab === TabName.Bought &&
                    (isLoading ? (
                        <Spinner
                            speed={"0.75s"}
                            color="white"
                            w="150px"
                            h="150px"
                            margin={"auto"}
                        />
                    ) : (
                        <CardListGrid
                            cardList={props.boughtCardList}
                            currentUserId={props.currentUserId}
                            currentCard={currentCard}
                            setCurrentCard={setCurrentCard}
                            setCurrentSerializedCard={setCurrentSerializedCard}
                            privateView={props.privateView}
                            onSendCardModalOpen={
                                isMobile
                                    ? tradeCardShare
                                    : processSendCardModalOpen
                            }
                            loginModalOpen={loginModal.onOpen}
                            onAddToCollectionModalOpen={
                                addToCollectionModal.onOpen
                            }
                            setViewCardClicked={setViewCardClicked}
                            itemsPerPage={6}
                            tabName={TabName.Bought}
                            navigateToTopOfList={navigateToTopOfList}
                        />
                    ))}
            </Flex>
        </>
    );
}
