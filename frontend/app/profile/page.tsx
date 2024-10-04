"use client";

import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Flex,
    Skeleton,
    Text,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import NavBar from "../navbar";
import Sidebar from "@/components/sidebar";
import "@fontsource/barlow-condensed/500-italic.css"; // SemiBold Italic style
import ProfileBioTab from "./components/profileBio";
import ProfileAlbumTab from "./components/profileAlbumTab";
import ProfileInformationButton from "./components/profileInformationButton";
import { useAuth } from "@/hooks/useAuth";
import { getCard } from "../generate_card_asset/cardFunctions";
import TradingCardInfo, { PaymentStatus } from "@/hooks/TradingCardInfo";
import EditSocialMediaModal from "./components/editSocialMediaModal";
import SerializedTradingCard from "@/hooks/SerializedTradingCard";
import { BackToCheckoutModal } from "../components/BackToCheckoutModal";
import Footer from "../components/footer";
import { apiEndpoints } from "@backend/EnvironmentManager/EnvironmentManager";
import EditProfileModal from "./components/editModal";
import { validateSocialLink } from "./helpers";
import ProfileHeaderBackground from "./components/header/header-background";
import ProfileAvatar from "./components/header/avatar";
import SharedStack from "@/components/shared/wrappers/shared-stack";
import UserSocialLinks from "./components/header/social-links";

export interface ProfileInfo {
    first_name: string;
    last_name: string;
    team_hometown: string;
    position: string;
    bio: string;
    avatar: string;
    media: string[];
    facebookLink: string;
    xLink: string;
    instagramLink: string;
    youtubeLink: string;
    tiktokLink: string;
    snapchatLink: string;
}

enum PageName {
    Bio = "BIO",
    Album = "ALBUM",
}

/**
 * Returns the Profile page.
 * @returns {JSX.Element} The Profile page.
 */
export default function Profile() {
    const [currentSelection, setCurrentSelection] = useState(PageName.Bio);
    const { currentAuthenticatedUser } = useAuth();
    const [profileInfo, setProfileInfo] = useState<ProfileInfo>();
    const [isLoaded, setIsLoaded] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const slimSocialMediaModal = useDisclosure();
    const [currentUserId, setCurrentUserId] = useState("");
    const [viewedPlayerId, setViewedPlayerId] = useState("");
    const [loadPrivateProfile, setLoadPrivateProfile] = useState(false);
    const [buttonClicked, setButtonClicked] = useState(false);
    const toast = useToast();

    const [editableFirstName, setEditableFirstName] = useState(
        profileInfo?.first_name || "",
    );
    const [editableLastName, setEditableLastName] = useState(
        profileInfo?.last_name || "",
    );
    const [editablePosition, setEditablePosition] = useState(
        profileInfo?.position || "",
    );
    const [editableTeamHometown, setEditableTeamHometown] = useState(
        profileInfo?.team_hometown || "",
    );
    const [editableBio, setEditableBio] = useState(
        profileInfo?.bio || "No bio available.",
    );
    const [editableProfilePicture, setEditableProfilePicture] = useState(
        profileInfo?.avatar || "",
    );
    const [editableFacebookLink, setEditableFacebookLink] = useState(
        profileInfo?.facebookLink || "",
    );
    const [editableXLink, setEditableXLink] = useState(
        profileInfo?.xLink || "",
    );
    const [editableTiktokLink, setEditableTiktokLink] = useState(
        profileInfo?.tiktokLink || "",
    );
    const [editableInstagramLink, setEditableInstagramLink] = useState(
        profileInfo?.instagramLink || "",
    );
    const [editableYoutubeLink, setEditableYoutubeLink] = useState(
        profileInfo?.youtubeLink || "",
    );
    const [editableSnapchatLink, setEditableSnapchatLink] = useState(
        profileInfo?.snapchatLink || "",
    );

    const [createdCardList, setCreatedCardList] = useState([]);
    const [tradedCardList, setTradedCardList] = useState<
        SerializedTradingCard[]
    >([]);
    const [boughtCardList, setBoughtCardList] = useState<
        SerializedTradingCard[]
    >([]);
    const [alreadyPopulatedTradedCards, setAlreadyPopulatedTradedCards] =
        useState(false);

    // /**
    //  * Utility function to convert Blob to Base64
    //  * @param blob the image blob
    //  * @returns blob resolves to a base64string
    //  */
    // async function blobToBase64(blob: Blob) {
    // 	return new Promise((resolve, reject) => {
    // 		const reader = new FileReader();
    // 		reader.onload = () => {
    // 			return resolve(reader.result as string);
    // 		};
    // 		reader.onerror = (error) => {
    // 			return reject(error);
    // 		};
    // 		reader.readAsDataURL(blob);
    // 	});
    // };

    // Fetch the user's profile information and cards on page load
    useEffect(() => {
        /**
         * Gets the currently logged in user's ID.
         * @returns The currently logged in user's ID.
         */
        async function getLoggedInUserID() {
            const username = await currentAuthenticatedUser();
            setCurrentUserId(username.userId);
        }
        const queryParams = new URLSearchParams(window.location.search);
        getLoggedInUserID();
        const viewedPlayerId = queryParams.get("user");
        const selectedCardId = queryParams.get("card");
        if (viewedPlayerId !== null) {
            setViewedPlayerId(viewedPlayerId);
            setLoadPrivateProfile(currentUserId === viewedPlayerId);
        } else {
            setViewedPlayerId(currentUserId);
            setLoadPrivateProfile(true);
        }

        if (selectedCardId !== null) {
            setCurrentSelection(PageName.Album);
        }
    }, [currentAuthenticatedUser, currentUserId]);

    /**
     * Updates the profile information.
     */
    async function updateProfile() {
        // Update the profile
        const username = await currentAuthenticatedUser();
        if (
            editableFirstName === "" ||
            editableLastName === "" ||
            editablePosition === "" ||
            editableTeamHometown === ""
        ) {
            toast({
                title: "Profile Update Failed",
                description:
                    "Please ensure all required fields (*) are filled out.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            setButtonClicked(false);
            return;
        }
        await fetch(apiEndpoints.users_updateUserProfile(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                uuid: username.userId,
                first_name: editableFirstName || "",
                last_name: editableLastName || "",
                position: editablePosition || "",
                team_hometown: editableTeamHometown || "",
                bio: editableBio || "No bio available.",
                avatar: editableProfilePicture,
                facebookLink: editableFacebookLink,
                xLink: editableXLink,
                tiktokLink: editableTiktokLink,
                instagramLink: editableInstagramLink,
                youtubeLink: editableYoutubeLink,
                snapchatLink: editableSnapchatLink,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    toast({
                        title: "Profile Updated",
                        description:
                            "Your profile has been successfully updated.",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                    });
                } else {
                    toast({
                        title: "Profile Update Failed",
                        description:
                            "An error occurred while updating your profile.",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                    });
                    console.error("Error updating profile:", response.text());
                }
            })
            .catch((error) => {
                console.error("Error updating profile:", error);
                toast({
                    title: "Profile Update Failed",
                    description:
                        "An error occurred while updating your profile.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            });

        setProfileInfo({
            first_name: editableFirstName || "",
            last_name: editableLastName || "",
            position: editablePosition || "",
            team_hometown: editableTeamHometown || "",
            bio: editableBio || "No bio available.",
            avatar: editableProfilePicture,
            media: profileInfo?.media || [],
            facebookLink: editableFacebookLink,
            xLink: editableXLink,
            instagramLink: editableInstagramLink,
            youtubeLink: editableYoutubeLink,
            tiktokLink: editableTiktokLink,
            snapchatLink: editableSnapchatLink,
        });
        setButtonClicked(false);
        onClose();
        slimSocialMediaModal.onClose();
    }

    useEffect(() => {
        /**
         * Fetches the player's profile information.
         */
        async function fetchProfileInfo() {
            try {
                const response = await fetch(
                    `${apiEndpoints.getUser()}?uuid=${viewedPlayerId}`,
                    {
                        method: "GET",
                    },
                );
                const data = await response.json();
                const loggedInUserID = await currentAuthenticatedUser();
                // Setting the data to the profile info
                // We aren't using the profileInfo state variable yet because we don't have to wait for the state to update
                setProfileInfo(data);
                if (
                    (data.first_name === null ||
                        data.last_name === null ||
                        data.position === null ||
                        data.team_hometown === null) &&
                    viewedPlayerId === loggedInUserID.userId
                ) {
                    toast({
                        title: "Profile is Incomplete",
                        description:
                            'Please complete your profile information by clicking \n"Edit Profile" at the ' +
                            "top right of the page.",
                        status: "error",
                        duration: 8000,
                        isClosable: true,
                    });
                } else {
                    setEditableFirstName(data.first_name || "");
                    setEditableLastName(data.last_name || "");
                    setEditablePosition(data.position || "");
                    setEditableTeamHometown(data.team_hometown || "");
                    setEditableBio(data.bio || "No bio available.");
                    setEditableProfilePicture(data.avatar || "");
                    setEditableFacebookLink(data.facebookLink || "");
                    setEditableXLink(data.xLink || "");
                    setEditableTiktokLink(data.tiktokLink || "");
                    setEditableInstagramLink(data.instagramLink || "");
                    setEditableYoutubeLink(data.youtubeLink || "");
                    setEditableSnapchatLink(data.snapchatLink || "");
                }
                setIsLoaded(true);
            } catch (error) {
                console.error("Error fetching profile information:", error);
            }
        }
        if (viewedPlayerId !== "") {
            fetchProfileInfo();
        }

        // Linting is disabled to prevent decrease amount of times profileInfo is fetched.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentAuthenticatedUser, viewedPlayerId]);

    useEffect(() => {
        /**
         * Fetches the card with the given user UUID.
         * @param typeOfCard - The type of card to fetch (traded or bought)
         * @returns The cards of the given type.
         */
        async function getCards(typeOfCard: string) {
            try {
                if (viewedPlayerId === "") {
                    const loggedInUserID = await currentAuthenticatedUser();
                    setViewedPlayerId(loggedInUserID.userId);
                }
                const url = `${apiEndpoints.getUser()}?uuid=${viewedPlayerId}`;
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const data = await response.json();
                if (data.error) {
                    console.error(`Error fetching traded cards: ${data.error}`);
                    return null;
                }
                const cardsToReturn =
                    typeOfCard === "traded" ? data.cards : data.bought_cards;

                return cardsToReturn;
            } catch (error) {
                console.error("Error fetching traded cards:", error);
                return null;
            }
        }

        /**
         * Fetches the cards created by the user.
         */
        async function populateCreatedCardList() {
            try {
                if (viewedPlayerId === "") {
                    const loggedInUserID = await currentAuthenticatedUser();
                    setViewedPlayerId(loggedInUserID.userId);
                }
                const response = await fetch(apiEndpoints.getCreatedCards(), {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        generatedBy: viewedPlayerId,
                    }),
                });
                const data = await response.json();
                if (data) {
                    const publishedCreatedCards = data.filter(
                        (card: TradingCardInfo) => {
                            return card.paymentStatus === PaymentStatus.SUCCESS;
                        },
                    );

                    setCreatedCardList(publishedCreatedCards);
                }
            } catch (error) {
                console.error("Error fetching created cards:", error);
            }
        }

        /**
         * Fetches the cards created by the user.
         */
        async function populateTradedCardList() {
            if (alreadyPopulatedTradedCards) {
                return;
            }

            const tradedCards = await getCards("traded");
            if (tradedCards === null) {
                console.error("Error fetching traded cards");
            } else if (tradedCards === undefined || tradedCards.length === 0) {
                setTradedCardList([]);
                setAlreadyPopulatedTradedCards(true);
            } else {
                // Take all non-array elements out of the array
                // Only necessary because there are some traded
                // cards in AWS from before we added card creator UUID
                for (let i = 0; i < tradedCards.length; i++) {
                    if (!Array.isArray(tradedCards[i])) {
                        tradedCards.splice(i, 1);
                        i--;
                    }
                }

                const cardObjects: SerializedTradingCard[] = [];
                for (const card of tradedCards) {
                    // card[0] is the card UUID, card[1] is the user UUID of the card creator
                    const cardInfo = await getCard(card[0], card[1]);
                    // card[2] is the serial number of the card
                    const serializedCard = new SerializedTradingCard(
                        card[2],
                        cardInfo,
                    );
                    // Check if the card info for the card still exists
                    if (serializedCard.TradingCardInfo.firstName === "") {
                        console.error(
                            "Error fetching traded card info for card UUID:",
                            card[0],
                        );
                        continue;
                    }
                    cardObjects.push(serializedCard);
                }

                // Sort the cards by most recently created
                cardObjects.sort((a, b) => {
                    return (
                        b.TradingCardInfo.createdAt -
                        a.TradingCardInfo.createdAt
                    );
                });
                setTradedCardList(cardObjects);
                setAlreadyPopulatedTradedCards(true);
            }
        }

        /**
         * Populates the bought card list in the profile page.
         */
        async function populateBoughtCardList() {
            const boughtCards = await getCards("bought");
            if (boughtCards === null) {
                console.error("Error fetching bought cards");
            } else if (boughtCards === undefined || boughtCards.length === 0) {
                setBoughtCardList([]);
            } else {
                // Take all non-array elements out of the array
                // Only necessary because there are some bought
                // cards in AWS from before we added card creator UUID
                for (let i = 0; i < boughtCards.length; i++) {
                    if (!Array.isArray(boughtCards[i])) {
                        boughtCards.splice(i, 1);
                        i--;
                    }
                }

                const cardObjects: SerializedTradingCard[] = [];
                for (const card of boughtCards) {
                    // card[1] is the card UUID, card[2] is the user UUID of the card creator
                    const cardInfo = await getCard(card[1], card[2]);
                    // card[3] is the serial number of the card
                    const serializedCard = new SerializedTradingCard(
                        card[3],
                        cardInfo,
                    );
                    // Check if the card info for the card still exists
                    if (serializedCard.TradingCardInfo.firstName === "") {
                        console.error(
                            "Error fetching traded card info for card UUID:",
                            card[0],
                        );
                        continue;
                    }
                    cardObjects.push(serializedCard);
                }

                // Sort the cards by most recently created
                cardObjects.sort((a, b) => {
                    return (
                        b.TradingCardInfo.createdAt -
                        a.TradingCardInfo.createdAt
                    );
                });

                setBoughtCardList(cardObjects);
            }
        }

        if (viewedPlayerId !== "") {
            populateCreatedCardList();
            populateTradedCardList();
            populateBoughtCardList();
        }
        // THIS DEPENDENCY LIST COULD PROBABLY JUST BE REPLACED WITH profileInfo INSTEAD OF EACH INDIVIDUAL FIELD BUT I AM UNSURE
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        viewedPlayerId,
        currentAuthenticatedUser,
        profileInfo?.avatar,
        profileInfo?.bio,
        profileInfo?.facebookLink,
        profileInfo?.first_name,
        profileInfo?.instagramLink,
        profileInfo?.last_name,
        profileInfo?.position,
        profileInfo?.team_hometown,
        profileInfo?.tiktokLink,
        profileInfo?.xLink,
        profileInfo?.youtubeLink,
    ]);

    /**
     * Resets each value to its previous value.
     */
    function undoProfileChanges() {
        // Update the profile
        // This will need to be hooked up to the back-end
        setEditableFirstName(profileInfo?.first_name || "");
        setEditableLastName(profileInfo?.last_name || "");
        setEditablePosition(profileInfo?.position || "");
        setEditableTeamHometown(profileInfo?.team_hometown || "");
        setEditableBio(profileInfo?.bio || "No bio available.");
        setEditableProfilePicture(profileInfo?.avatar || "");
        setEditableFacebookLink(profileInfo?.facebookLink || "");
        setEditableXLink(profileInfo?.xLink || "");
        setEditableTiktokLink(profileInfo?.tiktokLink || "");
        setEditableInstagramLink(profileInfo?.instagramLink || "");
        setEditableYoutubeLink(profileInfo?.youtubeLink || "");
        setEditableSnapchatLink(profileInfo?.snapchatLink || "");
        onClose();
    }

    /**
     * Checks if the user can update their profile.
     */
    function checkUpdate() {
        const validFacebook =
            validateSocialLink(
                editableFacebookLink,
                "https://www.facebook.com/",
            ) || editableFacebookLink === "";
        const validX =
            validateSocialLink(editableXLink, "https://x.com/") ||
            editableXLink === "";
        const validTiktok =
            validateSocialLink(editableTiktokLink, "https://www.tiktok.com/") ||
            editableTiktokLink === "";
        const validInstagram =
            validateSocialLink(
                editableInstagramLink,
                "https://www.instagram.com/",
            ) || editableInstagramLink === "";
        const validYoutube =
            validateSocialLink(
                editableYoutubeLink,
                "https://www.youtube.com/",
            ) || editableYoutubeLink === "";
        const validSnapchat =
            validateSocialLink(
                editableSnapchatLink,
                "https://www.snapchat.com/add",
            ) || editableSnapchatLink === "";

        if (
            !validFacebook ||
            !validX ||
            !validTiktok ||
            !validInstagram ||
            !validYoutube ||
            !validSnapchat
        ) {
            toast({
                title: "Invalid Social Media Link",
                description:
                    "Please ensure that the social media links are valid.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            setButtonClicked(false);
            return;
        }
        updateProfile();
    }

    return (
        <>
            <BackToCheckoutModal />
            <Flex flexDir="row" minH="100dvh" w="full" bg="#121212">
                <Flex flexDir="column" w="full" minH="100dvh">
                    <Box position="relative">
                        <ProfileHeaderBackground />
                        <NavBar bgGradient="none" />
                        <Flex
                            position="relative"
                            px={{ base: "32px", xs: "50px", xl: "212px" }}
                            py={{ base: "40px", lg: "44px" }}
                            w="full"
                            gridGap={{ base: "32px", md: 0 }}
                            flexDir={{ base: "column", md: "row" }}
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <SharedStack
                                row
                                fit
                                spacing={{ base: "40px", lg: "52px" }}
                            >
                                <ProfileAvatar
                                    profileInfo={profileInfo}
                                    isLoaded={isLoaded}
                                    isOnPrivateProfile={loadPrivateProfile}
                                    onOpen={onOpen}
                                />
                                <SharedStack spacing={{ base: 3, md: 2 }}>
                                    <Box>
                                        <UserSocialLinks
                                            profileInfo={profileInfo}
                                            isOnPrivateProfile={
                                                loadPrivateProfile
                                            }
                                            onOpen={slimSocialMediaModal.onOpen}
                                        />
                                        <Skeleton
                                            isLoaded={isLoaded}
                                            mt={{ base: 3, md: "1px" }}
                                        >
                                            <Text
                                                fontFamily="'Barlow Condensed', sans-serif"
                                                fontStyle="italic"
                                                fontWeight="600"
                                                fontSize={{
                                                    base: "30px",
                                                    lg: "40px",
                                                }}
                                                color="green.100"
                                                letterSpacing="2px"
                                                lineHeight={{
                                                    base: "30px",
                                                    lg: "48px",
                                                }}
                                                textTransform="uppercase"
                                            >
                                                {profileInfo?.first_name || ""}{" "}
                                                {profileInfo?.last_name || ""}
                                            </Text>
                                        </Skeleton>
                                    </Box>
                                    <Skeleton isLoaded={isLoaded}>
                                        <Text
                                            fontSize={{
                                                base: "14px",
                                                lg: "16px",
                                            }}
                                            fontWeight="700"
                                            color="white"
                                            fontFamily="Helvetica Neue"
                                        >
                                            {profileInfo?.position || ""}
                                            {profileInfo?.position
                                                ? ","
                                                : null}{" "}
                                            <Box as="span" fontWeight="400">
                                                {profileInfo?.team_hometown ||
                                                    ""}
                                            </Box>
                                        </Text>
                                    </Skeleton>
                                </SharedStack>
                            </SharedStack>
                            <Flex gap="12px" w="fit-content" direction="column">
                                {/* Top Row of Buttons */}
                                <Flex
                                    align="center"
                                    justify="center"
                                    gap="12px"
                                >
                                    {/* Bio Button */}
                                    <ProfileInformationButton
                                        text="bio"
                                        clickEvent={() => {
                                            setCurrentSelection(PageName.Bio);
                                        }}
                                        isSelected={
                                            currentSelection === PageName.Bio
                                        }
                                    />
                                    {/* Album Button */}
                                    <ProfileInformationButton
                                        text="album"
                                        clickEvent={() => {
                                            setCurrentSelection(PageName.Album);
                                        }}
                                        isSelected={
                                            currentSelection === PageName.Album
                                        }
                                    />
                                </Flex>
                                {loadPrivateProfile && (
                                    // Edit Profile Button
                                    <Button
                                        bgColor="transparent"
                                        border="solid 3px #27CE00"
                                        width="100%"
                                        fontFamily={"Barlow Semi Condensed"}
                                        fontSize="14px"
                                        fontWeight="600"
                                        letterSpacing="1.5px"
                                        color="white"
                                        _hover={{
                                            md: {
                                                bgColor: "#CCC",
                                                border: "3px solid #CCC",
                                                cursor: "pointer",
                                                color: "black",
                                            },
                                        }}
                                        onClick={() => {
                                            setButtonClicked(false);
                                            onOpen();
                                        }}
                                    >
                                        EDIT PROFILE
                                    </Button>
                                )}
                            </Flex>
                        </Flex>
                    </Box>
                    <Box flex={1} position="relative">
                        <Box
                            h="460px"
                            w="100dvw"
                            position="absolute"
                            top={0}
                            left={0}
                            bgGradient="linear(to-b, #000000, #00000000)"
                        />
                        <Box
                            w="100%"
                            px={{ base: "32px", xs: "50px", xl: "212px" }}
                            pt="34px"
                            pb="64px"
                            position="relative"
                            color="white"
                        >
                            {currentSelection === PageName.Bio && (
                                <ProfileBioTab
                                    profileInfo={profileInfo}
                                    isLoaded={isLoaded}
                                    editable={loadPrivateProfile}
                                />
                            )}
                            {currentSelection === PageName.Album && (
                                <ProfileAlbumTab
                                    currentProfileId={viewedPlayerId}
                                    currentUserName={
                                        profileInfo?.first_name
                                            ? profileInfo?.first_name
                                            : ""
                                    }
                                    currentUserId={currentUserId}
                                    createdCardList={createdCardList}
                                    tradedCardList={tradedCardList}
                                    boughtCardList={boughtCardList}
                                    privateView={loadPrivateProfile}
                                />
                            )}
                        </Box>
                    </Box>
                    <Footer />
                </Flex>
                <Box
                    display={{ base: "none", lg: "inline" }}
                    h="full"
                    position="sticky"
                    top={0}
                >
                    <Sidebar height="100dvh" backgroundPresent={true} />
                </Box>
            </Flex>
            <EditProfileModal
                isOpen={isOpen}
                onClose={onClose}
                undoProfileChanges={undoProfileChanges}
                checkUpdate={checkUpdate}
                profileInfo={profileInfo}
                editableFirstName={editableFirstName}
                setEditableFirstName={setEditableFirstName}
                editableLastName={editableLastName}
                setEditableLastName={setEditableLastName}
                editablePosition={editablePosition}
                setEditablePosition={setEditablePosition}
                editableTeamHometown={editableTeamHometown}
                setEditableTeamHometown={setEditableTeamHometown}
                editableBio={editableBio}
                setEditableBio={setEditableBio}
                editableProfilePicture={editableProfilePicture}
                setEditableProfilePicture={setEditableProfilePicture}
                editableFacebookLink={editableFacebookLink}
                setEditableFacebookLink={setEditableFacebookLink}
                editableXLink={editableXLink}
                setEditableXLink={setEditableXLink}
                editableTiktokLink={editableTiktokLink}
                setEditableTiktokLink={setEditableTiktokLink}
                editableInstagramLink={editableInstagramLink}
                setEditableInstagramLink={setEditableInstagramLink}
                editableYoutubeLink={editableYoutubeLink}
                setEditableYoutubeLink={setEditableYoutubeLink}
                editableSnapchatLink={editableSnapchatLink}
                setEditableSnapchatLink={setEditableSnapchatLink}
            />

            {/* Slimmer Modal for social media only */}
            <EditSocialMediaModal
                isOpen={slimSocialMediaModal.isOpen}
                onClose={slimSocialMediaModal.onClose}
                undoChanges={undoProfileChanges}
                checkUpdate={checkUpdate}
                buttonClicked={buttonClicked}
                setButtonClicked={setButtonClicked}
                editableFacebookLink={editableFacebookLink}
                setEditableFacebookLink={setEditableFacebookLink}
                editableXLink={editableXLink}
                setEditableXLink={setEditableXLink}
                editableTiktokLink={editableTiktokLink}
                setEditableTiktokLink={setEditableTiktokLink}
                editableInstagramLink={editableInstagramLink}
                setEditableInstagramLink={setEditableInstagramLink}
                editableYoutubeLink={editableYoutubeLink}
                setEditableYoutubeLink={setEditableYoutubeLink}
                editableSnapchatLink={editableSnapchatLink}
                setEditableSnapchatLink={setEditableSnapchatLink}
                validateSocialLink={validateSocialLink}
            />
        </>
    );
}
