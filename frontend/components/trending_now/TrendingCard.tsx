import React from "react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Box,
    Flex,
    IconButton,
    Text,
    VStack,
    Divider,
    Button,
    HStack,
    Icon,
} from "@chakra-ui/react";
import { Link } from "react-scroll";
import { BeatLoader } from "react-spinners";
import { FaRotate } from "react-icons/fa6";

import TradingCardInfo from "@/hooks/TradingCardInfo";
import { OnFireCardRef } from "../create/OnFireCard/OnFireCard";
import { useCurrentFilterInfo } from "@/hooks/useCurrentFilter";
import FilterInfo from "@/hooks/FilterInfo";
import { useAuth } from "@/hooks/useAuth";
import SerializedTradingCard from "@/hooks/SerializedTradingCard";
import { TabName } from "@/app/profile/components/profileAlbumTab";
import TradingCardInBackground from "./TradingCardInBackground";

interface TrendingCardProps {
    passedInCard: TradingCardInfo | SerializedTradingCard;
    slim?: boolean;
    shouldShowButton?: boolean;
    isPageFlipping?: boolean;
    overrideCardClick?:
        | (() => void)
        | ((card: TradingCardInfo | SerializedTradingCard) => void);
    trendingCardWidth?: number | null;
    trendingCardHeight?: number | null;
    trendingCardScale?: number | null;
    // Profile Page Specific Props
    onProfilePage?: boolean;
    tabName?: string;
    currentUserId?: string;
    privateView?: boolean;
    setCurrentCard?: (card: TradingCardInfo) => void;
    onSendCardModalOpen?: () => void;
    loginModalOpen?: () => void;
    onAddToCollectionModalOpen?: () => void;
}

/**
 * The TrendingCard component displays a trading card with the player's name, position, team, and availability.
 * It also recolors a background image and displays the trading card image.
 *
 * @param {TradingCardInfo} passedInCard - The trading card to display.
 * @param {boolean} [slim=false] - Indicates whether to display the card in a slim format.
 * @param {boolean} [shouldShowButton=false] - Indicates whether to show the flip card button.
 * @param {boolean} [isPageFlipping=false] - Indicates whether the page is currently flipping.
 * @param {Function} [overrideCardClick] - Optional function to override the card click behavior.
 * @param {boolean} [onProfilePage=false] - Indicates whether the user is on the profile page.
 * @param {string} [tabName] - The name of the tab on the profile page.
 * @param {string} [currentUserId] - The ID of the current user.
 * @param {boolean} [privateView=false] - Indicates whether the user is in private view.
 * @param {Function} [setCurrentCard] - Function to set the current card.
 * @param {Function} [onSendCardModalOpen] - Function to open the send card modal.
 * @param {Function} [loginModalOpen] - Function to open the login modal.
 * @param {Function} [onAddToCollectionModalOpen] - Function to open the add to collection modal.
 */
export default function TrendingCard({
    passedInCard,
    slim,
    shouldShowButton = false,
    isPageFlipping,
    overrideCardClick: onCardClick,
    onProfilePage,
    tabName,
    currentUserId,
    privateView,
    setCurrentCard,
    onSendCardModalOpen,
    loginModalOpen,
    onAddToCollectionModalOpen,
}: TrendingCardProps) {
    const router = useRouter();

    // Get the current filter information
    const filter = useCurrentFilterInfo();

    // Get the current auth context
    const auth = useAuth();

    // State variables to store the current user
    const [currentUser, setCurrentUser] = useState("");

    // A reference to the OnfireCard component
    const onFireCardRef = useRef<OnFireCardRef | null>(null);

    /**
     * Handles the flip event from outside the component.
     */
    function handleFlipFromOutside() {
        if (onFireCardRef.current) {
            onFireCardRef.current.handleClick();
        }
    }

    // This is the trading card to display
    const card =
        passedInCard instanceof SerializedTradingCard
            ? passedInCard.TradingCardInfo
            : passedInCard;

    const [buttonText, setButtonText] = useState<string | null>(null);
    const [buttonAction, setButtonAction] = useState<(() => void) | null>(null);
    const [disableActionButton, setDisableActionButton] =
        useState<boolean>(false);

    // State variable to store the button clicked status
    const [buttonClicked, setButtonClicked] = useState(false);

    // Sets the current authenticated user when the component mounts
    useEffect(() => {
        /**
         * A function to get the current authenticated user.
         */
        async function getCurrentUser() {
            const user = await auth.currentAuthenticatedUser();
            setCurrentUser(user.userId);
        }

        getCurrentUser();
    });

    /**
     * Sets the button text and action based on the current user and tab ONLY if on the profile page
     */
    useEffect(() => {
        if (onProfilePage) {
            // If the user is in private view and viewing the created tab of a card that has no more available copies, disable the button
            if (tabName === TabName.Created && card.currentlyAvailable <= 0) {
                setButtonText("CARD UNAVAILABLE");
                setButtonAction(() => {});
                setDisableActionButton(true);
            } else if (privateView) {
                // If the user is in private view and viewing a card in the created or traded tab, allow the user to send the card
                // Bought cards shouldn't be able to be sent
                if (tabName === TabName.Created || tabName === TabName.Traded) {
                    setButtonText("SEND CARD");
                    setButtonAction(() => {
                        return () => {
                            setCurrentCard!(card);
                            onSendCardModalOpen!();
                        };
                    });
                    setDisableActionButton(false);
                } else {
                    setButtonText("");
                    setButtonAction(() => {});
                    setDisableActionButton(false);
                }
            } else if (tabName === TabName.Created) {
                // If the user is viewing a buyable card on another profile, allow the user to buy the card
                if (
                    card.price !== 0 &&
                    card.currentlyAvailable > 0 &&
                    currentUser !== card.generatedBy
                ) {
                    setButtonText("BUY NOW");
                    setButtonAction(() => {
                        return () => {
                            setCurrentCard!(card);
                            if (currentUserId) {
                                // Saves the card information to local storage
                                TradingCardInfo.saveCard(card);
                                // Set the button clicked status to true because the user is being redirected
                                setButtonClicked(true);
                                // Redirect the user to the payment page
                                router.push("/checkout?buyingOtherCard=true");
                            } else {
                                loginModalOpen!();
                            }
                        };
                    });
                    setDisableActionButton(false);
                } else {
                    setButtonText("REQUEST TRADE");
                    setButtonAction(() => {
                        return () => {
                            setCurrentCard!(card);
                            if (currentUserId) {
                                onAddToCollectionModalOpen!();
                            } else {
                                loginModalOpen!();
                            }
                        };
                    });
                    setDisableActionButton(false);
                }
            }
        } else {
            // If the user is not on the profile page, show simplified button text
            // If the card is not available, show "Card Unavailable"
            // If the card is available, show "Send Card" if the card was generated by the current user
            // Show "Buy Now" if the card is buyable
            // Show "Request Trade" if the card is not buyable
            setButtonText(
                card.currentlyAvailable <= 0
                    ? "Card Unavailable"
                    : currentUser === card.generatedBy
                      ? "Send Card"
                      : card.price
                        ? "Buy Now"
                        : "Request Trade",
            );
            setDisableActionButton(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        currentUser,
        card,
        tabName,
        setCurrentCard,
        onSendCardModalOpen,
        loginModalOpen,
        onAddToCollectionModalOpen,
        currentUserId,
        onProfilePage,
        privateView,
    ]);

    return (
        <VStack flex={1}>
            {onProfilePage ? (
                <Box h="full" width="full">
                    <Link
                        activeClass="active"
                        to="cardElement"
                        spy
                        smooth
                        offset={-50}
                        duration={500}
                        width="inherit"
                    >
                        <TradingCardInBackground
                            card={card}
                            filter={filter}
                            onCardClick={onCardClick}
                            isPageFlipping={Boolean(isPageFlipping)}
                            passedInCard={card}
                            onFireCardRef={onFireCardRef}
                        />
                    </Link>
                </Box>
            ) : (
                <>
                    {/* Locker Room Trading cards will have slightly bigger backgrounds. */}
                    <TradingCardInBackground
                        card={card}
                        filter={filter}
                        onCardClick={onCardClick}
                        isPageFlipping={false}
                        passedInCard={card}
                        onFireCardRef={onFireCardRef}
                    />
                </>
            )}

            {!slim && (
                <Flex
                    align={"center"}
                    justifyContent={"space-between"}
                    w="100%"
                >
                    {/* VStack component for the trading card details */}
                    <VStack
                        align={"left"}
                        color={"white"}
                        gap={4}
                        fontSize={14}
                        width={"100%"}
                        letterSpacing={"0px"}
                        paddingTop={2}
                        overflowX="hidden"
                    >
                        <HStack justifyContent={"space-between"}>
                            <Text
                                fontSize={"20px"}
                                fontFamily={"Barlow Semi Condensed"}
                                fontWeight={"normal"}
                            >
                                {card?.price
                                    ? `$${card?.price?.toFixed(2)}`
                                    : "TRADE ONLY"}
                            </Text>
                            {shouldShowButton && (
                                <IconButton
                                    onClick={handleFlipFromOutside}
                                    aria-label="Flip Card"
                                    minW="26px"
                                    maxW="26px"
                                    minH="26px"
                                    maxH="26px"
                                    background="#D5D5D5"
                                    marginLeft={5}
                                    icon={
                                        <Icon
                                            as={FaRotate}
                                            color="#121212"
                                            style={{
                                                width: "16px",
                                                height: "16px",
                                            }}
                                        />
                                    }
                                />
                            )}
                        </HStack>
                        <Divider borderColor="#707070" />
                        <VStack align={"left"} gap={0} lineHeight={"20px"}>
                            {/* Text component for the player's name */}
                            <Text
                                textTransform={"uppercase"}
                                fontSize={18}
                                fontFamily={"Barlow"}
                                fontWeight={"semibold"}
                            >
                                {`${card.firstName} ${card.lastName}`}
                            </Text>

                            {/* Text component for the player's sport, position, and team */}
                            <Text noOfLines={1}>
                                {card.position} / {card.teamName}
                            </Text>

                            {passedInCard instanceof SerializedTradingCard ? (
                                <>
                                    {/* Text component for the card number */}
                                    <Text
                                        color={"gray"}
                                    >{`Card Number: ${passedInCard.serialNumber} of ${card.totalCreated}`}</Text>
                                </>
                            ) : (
                                <Text
                                    color={"gray.400"}
                                >{`${card.currentlyAvailable} of ${card.totalCreated} Available`}</Text>
                            )}
                        </VStack>
                        {buttonText && (
                            <Button
                                alignSelf={"center"}
                                w={"100%"}
                                variant={"trendingNow"}
                                bg="#CECECE"
                                color="#121212"
                                fontSize={"18px"}
                                fontWeight={"semibold"}
                                textTransform={"uppercase"}
                                fontFamily={"Barlow Semi Condensed"}
                                h="41px"
                                isDisabled={disableActionButton}
                                isLoading={buttonClicked}
                                spinner={<BeatLoader size={8} color="white" />}
                                onClick={() => {
                                    if (buttonAction) {
                                        buttonAction();
                                    } else {
                                        filter.setCurFilter(new FilterInfo());
                                        setButtonClicked(true);
                                        router.push(
                                            `/profile?user=${card?.generatedBy}&card=${card?.uuid}`,
                                        );
                                    }
                                }}
                            >
                                {buttonText}
                            </Button>
                        )}
                    </VStack>
                </Flex>
            )}
        </VStack>
    );
}
