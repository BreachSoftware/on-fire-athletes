"use client";

import { useEffect, useState } from "react";
import { Avatar, Button, Center, Flex, HStack, IconButton, Link, Skeleton, SkeletonCircle, Spacer, Text, Tooltip,
	useDisclosure, useToast } from "@chakra-ui/react";
import NavBar from "../navbar";
import Sidebar from "@/components/sidebar";
import "@fontsource/barlow-condensed/500-italic.css"; // SemiBold Italic style
import ProfileBioTab from "./components/profileBio";
import ProfileAlbumTab from "./components/profileAlbumTab";
import ProfileInformationButton from "./components/profileInformationButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faXTwitter, faInstagram, faYoutube, faTiktok, faSnapchat } from "@fortawesome/free-brands-svg-icons";
import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";
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

const headerImage = "Header-Abstract-Background.jpg"; // May be permanent now.

// The height of the header image (Parameterized for easier changes)
const headerHeight = { base: "550px", xl: "350px" };

enum PageName {
	Bio = "BIO",
	Album = "ALBUM",
}

/**
 * Returns the Profile page.
 * @returns {JSX.Element} The Profile page.
 */
export default function Profile() {

	const [ currentSelection, setCurrentSelection ] = useState(PageName.Bio);
	const { currentAuthenticatedUser } = useAuth();
	const [ profileInfo, setProfileInfo ] = useState<ProfileInfo>();
	const [ isLoaded, setIsLoaded ] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const slimSocialMediaModal = useDisclosure();
	const [ currentUserId, setCurrentUserId ] = useState("");
	const [ viewedPlayerId, setViewedPlayerId ] = useState("");
	const [ loadPrivateProfile, setLoadPrivateProfile ] = useState(false);
	const [ buttonClicked, setButtonClicked ] = useState(false);
	const toast = useToast();

	const iconSize = "12px";
	const socialMediaIconSpacing = 3;
	const iconColor = "white";
	const socialIconHoverColor = "green.600";

	const [ editableFirstName, setEditableFirstName ] = useState(profileInfo?.first_name || "");
	const [ editableLastName, setEditableLastName ] = useState(profileInfo?.last_name || "");
	const [ editablePosition, setEditablePosition ] = useState(profileInfo?.position || "");
	const [ editableTeamHometown, setEditableTeamHometown ] = useState(profileInfo?.team_hometown || "");
	const [ editableBio, setEditableBio ] = useState(profileInfo?.bio || "No bio available.");
	const [ editableProfilePicture, setEditableProfilePicture ] = useState(profileInfo?.avatar || "");
	const [ editableFacebookLink, setEditableFacebookLink ] = useState(profileInfo?.facebookLink || "");
	const [ editableXLink, setEditableXLink ] = useState(profileInfo?.xLink || "");
	const [ editableTiktokLink, setEditableTiktokLink ] = useState(profileInfo?.tiktokLink || "");
	const [ editableInstagramLink, setEditableInstagramLink ] = useState(profileInfo?.instagramLink || "");
	const [ editableYoutubeLink, setEditableYoutubeLink ] = useState(profileInfo?.youtubeLink || "");
	const [ editableSnapchatLink, setEditableSnapchatLink ] = useState(profileInfo?.snapchatLink || "");

	const [ createdCardList, setCreatedCardList ] = useState([]);
	const [ tradedCardList, setTradedCardList ] = useState<SerializedTradingCard[]>([]);
	const [ boughtCardList, setBoughtCardList ] = useState<SerializedTradingCard[]>([]);
	const [ alreadyPopulatedTradedCards, setAlreadyPopulatedTradedCards ] = useState(false);

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

	}, [ currentAuthenticatedUser, currentUserId ]);

	/**
	 * Updates the profile information.
	 */
	async function updateProfile() {
		// Update the profile
		const username = await currentAuthenticatedUser();
		if (editableFirstName === "" || editableLastName === "" || editablePosition === "" || editableTeamHometown === "") {
			toast({
				title: "Profile Update Failed",
				description: "Please ensure all required fields (*) are filled out.",
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
				snapchatLink: editableSnapchatLink
			}),
		}).then((response) => {
			if (response.ok) {
				toast({
					title: "Profile Updated",
					description: "Your profile has been successfully updated.",
					status: "success",
					duration: 5000,
					isClosable: true,
				});
			} else {
				toast({
					title: "Profile Update Failed",
					description: "An error occurred while updating your profile.",
					status: "error",
					duration: 5000,
					isClosable: true,
				});
				console.error("Error updating profile:", response.text());
			}
		}).catch((error) => {
			console.error("Error updating profile:", error);
			toast({
				title: "Profile Update Failed",
				description: "An error occurred while updating your profile.",
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
			snapchatLink: editableSnapchatLink
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
				const response = await fetch(`${apiEndpoints.getUser()}?uuid=${viewedPlayerId}`, {
					method: "GET",
				});
				const data = await response.json();
				const loggedInUserID = await currentAuthenticatedUser();
				// Setting the data to the profile info
				// We aren't using the profileInfo state variable yet because we don't have to wait for the state to update
				setProfileInfo(data);
				if (
					(
						data.first_name === null ||
						data.last_name === null ||
						data.position === null ||
						data.team_hometown === null
					) &&
					viewedPlayerId === loggedInUserID.userId
				) {
					toast({
						title: "Profile is Incomplete",
						description: "Please complete your profile information by clicking \n\"Edit Profile\" at the " +
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
		};
		if (viewedPlayerId !== "") {
			fetchProfileInfo();
		}

	// Linting is disabled to prevent decrease amount of times profileInfo is fetched.
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ currentAuthenticatedUser, viewedPlayerId ]);


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
					}
				});

				const data = await response.json();
				if(data.error) {
					console.error(`Error fetching traded cards: ${data.error}`);
					return null;
				}
				const cardsToReturn = typeOfCard === "traded" ? data.cards : data.bought_cards;

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
						generatedBy: viewedPlayerId
					})
				});
				const data = await response.json();
				if (data) {
					const publishedCreatedCards = data.filter((card: TradingCardInfo) => {
						return (card.paymentStatus === PaymentStatus.SUCCESS);
					});

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
			if(alreadyPopulatedTradedCards) {
				return;
			}

			const tradedCards = await getCards("traded");
			if(tradedCards === null) {
				console.error("Error fetching traded cards");
			} else if (tradedCards === undefined || tradedCards.length === 0) {
				setTradedCardList([]);
				setAlreadyPopulatedTradedCards(true);
			} else {
				// Take all non-array elements out of the array
				// Only necessary because there are some traded
				// cards in AWS from before we added card creator UUID
				for(let i = 0; i < tradedCards.length; i++) {
					if(!Array.isArray(tradedCards[i])) {
						tradedCards.splice(i, 1);
						i--;
					}
				}

				const cardObjects: SerializedTradingCard[] = [];
				for(const card of tradedCards) {
					// card[0] is the card UUID, card[1] is the user UUID of the card creator
					const cardInfo = await getCard(card[0], card[1]);
					// card[2] is the serial number of the card
					const serializedCard = new SerializedTradingCard(card[2], cardInfo);
					// Check if the card info for the card still exists
					if (serializedCard.TradingCardInfo.firstName === "") {
						console.error("Error fetching traded card info for card UUID:", card[0]);
						continue;
					}
					cardObjects.push(serializedCard);
				}

				// Sort the cards by most recently created
				cardObjects.sort((a, b) => {
					return b.TradingCardInfo.createdAt - a.TradingCardInfo.createdAt;
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
			if(boughtCards === null) {
				console.error("Error fetching bought cards");
			} else if (boughtCards === undefined || boughtCards.length === 0) {
				setBoughtCardList([]);

			} else {
				// Take all non-array elements out of the array
				// Only necessary because there are some bought
				// cards in AWS from before we added card creator UUID
				for(let i = 0; i < boughtCards.length; i++) {
					if(!Array.isArray(boughtCards[i])) {
						boughtCards.splice(i, 1);
						i--;
					}
				}

				const cardObjects: SerializedTradingCard[] = [];
				for(const card of boughtCards) {
					// card[1] is the card UUID, card[2] is the user UUID of the card creator
					const cardInfo = await getCard(card[1], card[2]);
					// card[3] is the serial number of the card
					const serializedCard = new SerializedTradingCard(card[3], cardInfo);
					// Check if the card info for the card still exists
					if (serializedCard.TradingCardInfo.firstName === "") {
						console.error("Error fetching traded card info for card UUID:", card[0]);
						continue;
					}
					cardObjects.push(serializedCard);
				}

				// Sort the cards by most recently created
				cardObjects.sort((a, b) => {
					return b.TradingCardInfo.createdAt - a.TradingCardInfo.createdAt;
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
	}, [ viewedPlayerId, currentAuthenticatedUser, profileInfo?.avatar, profileInfo?.bio, profileInfo?.facebookLink, profileInfo?.first_name,
		profileInfo?.instagramLink, profileInfo?.last_name, profileInfo?.position, profileInfo?.team_hometown, profileInfo?.tiktokLink,
		profileInfo?.xLink, profileInfo?.youtubeLink ]);

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
		const validFacebook = validateSocialLink(editableFacebookLink, "https://www.facebook.com/") || editableFacebookLink === "";
		const validX = validateSocialLink(editableXLink, "https://x.com/") || editableXLink === "";
		const validTiktok = validateSocialLink(editableTiktokLink, "https://www.tiktok.com/") || editableTiktokLink === "";
		const validInstagram = validateSocialLink(editableInstagramLink, "https://www.instagram.com/") || editableInstagramLink === "";
		const validYoutube = validateSocialLink(editableYoutubeLink, "https://www.youtube.com/") || editableYoutubeLink === "";
		const validSnapchat = validateSocialLink(editableSnapchatLink, "https://www.snapchat.com/add") || editableSnapchatLink === "";

		if (!validFacebook || !validX || !validTiktok || !validInstagram || !validYoutube || !validSnapchat) {
			toast({
				title: "Invalid Social Media Link",
				description: "Please ensure that the social media links are valid.",
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
			{/* Absolute Navbar */}
			<Flex position="absolute" w={{ base: "100vw", lg: "calc(100vw - 140px)" }} direction="column" zIndex={20}>
				<NavBar />
			</Flex>

			{/* Absolute Sidebar */}
			<Flex position="absolute" w="140px" direction="column" left="calc(100vw - 140px)" zIndex={20} display={{ base: "none", lg: "flex" }}>
				<Sidebar height="100vh" backgroundPresent={false} />
			</Flex>

			{/* If the user is viewing another person's profile, load this. */}
			<Flex minH="100vh" minW="100vw" direction="column" bgColor="#121212" color="white">
				{/* The Header Image */}
				<Flex
					h="max-content"
					bgImage={headerImage}
					backgroundPosition="center"
					bgSize="cover"
					w="100%"
				>
					<Flex
						bgGradient="linear-gradient(90deg, #00000088, #00000077 25%, #00000077 75%, #00000088 100%)"
						w="100%"
						h="100%"
						justify="center"
						align="flex-end"
						pt={{ base: "115px", md: "150px" }}
					>
						{/* Player Information */}
						<Flex mb="50px" w={{ base: "80%", md: "70%" }} maxW="1500px" direction={{ base: "column", xl: "row" }} alignItems="center">
							<Flex gap={{ base: "24px", md: "53px" }} direction={{ base: "column", md: "row" }} align="center">
								{/* Headshot */}
								<SkeletonCircle isLoaded={isLoaded} width={"116px"} height={"116px"}>
									<Avatar
										width="116px"
										height="116px"
										src={profileInfo?.avatar || "/placeholderProfile.jpg"}
										_hover={loadPrivateProfile ?
											{
												md: {
													filter: "brightness(0.5)",
													cursor: "pointer",
												}
											} : {}}
										sx={{
											transition: "filter 0.3s ease-in-out",
											aspectRatio: "1 / 1",
										}}
										onClick={loadPrivateProfile ? onOpen : () => {}}
									/>
								</SkeletonCircle>
								{/* Text Stack */}
								{/* Socials */}
								<Flex
									direction="column"
									w="100%"
									gap={{ base: 2, md: 1 }}
								>
									<HStack spacing={socialMediaIconSpacing} m="2px 0px -8px 2px" mb={{ base: "-2px", md: "0px" }}>
										{[
											{ icon: faXTwitter, label: "Twitter", href: profileInfo?.xLink },
											{ icon: faTiktok, label: "TikTok", href: profileInfo?.tiktokLink },
											{ icon: faFacebookF, label: "Facebook", href: profileInfo?.facebookLink },
											{ icon: faInstagram, label: "Instagram", href: profileInfo?.instagramLink },
											{ icon: faYoutube, label: "YouTube", href: profileInfo?.youtubeLink },
											{ icon: faSnapchat, label: "Snapchat", href: profileInfo?.snapchatLink },
										].map((social, index) => {
											return (
												// Only show the social media icon if the link is provided
												(social.href !== "" && social.href !== null && social.href !== undefined) &&
												<Center key={index} w="22px">
													<Link href={social.href} isExternal>
														<IconButton
															variant="ghost"
															aria-label={social.label}
															icon={<FontAwesomeIcon icon={social.icon} style={{ width: "18px", height: "18px" }} />}
															isRound
															boxSize={iconSize}
															color={iconColor}
															_hover={{ md: { color: socialIconHoverColor } }}
														/>
													</Link>
												</Center>
											);
										})}
										{loadPrivateProfile &&
											<Center w="22px">
												<Tooltip label="Add social links" placement="right" mt="-8px" ml="-4px" closeDelay={250}>
													<IconButton
														variant="ghost"
														aria-label="Add Social Media"
														icon={<FontAwesomeIcon icon={faSquarePlus} style={{ width: "18px", height: "18px" }} />}
														isRound
														boxSize={iconSize}
														color="green.100"
														_hover={{ md: { color: "white" } }}
														onClick={() => {
															setButtonClicked(false);
															slimSocialMediaModal.onOpen();
														}}
													/>
												</Tooltip>
											</Center>}
									</HStack>

									{/* Name */}
									<Skeleton
										isLoaded={isLoaded}
										// noOfLines={1}
										// marginTop={2}
									>
										<Text
											fontFamily="'Barlow Condensed', sans-serif"
											fontStyle="italic"
											fontWeight="600"
											fontSize={{ base: "30px", md: "40px" }}
											color="green.100"
											letterSpacing="2px"
											lineHeight={{ base: "30px", md: "48px" }}
											maxW="90vw"
											textTransform="uppercase"
										>
											{profileInfo?.first_name || ""} {profileInfo?.last_name || ""}
										</Text>
									</Skeleton >

									{/* Team */}
									<Skeleton isLoaded={isLoaded} >
										<Flex
											direction={{ "base": "column", "md": "row", "xl": "column", "2xl": "row" }}
											mb="10px"
											lineHeight={{ base: "16px", md: "18px" }}
										>
											{/* Position */}
											<Text fontSize={{ base: "14px", md: "16px" }} fontWeight="700" color="white" maxW="90vw">
												{profileInfo?.position || ""}{profileInfo?.position ? "," : null}&nbsp;
											</Text>
											{/* Hometown */}
											<Text fontSize={{ base: "14px", md: "16px" }} color="white" maxW="90vw">
												{profileInfo?.team_hometown || ""}
											</Text>
										</Flex>
									</Skeleton>
								</Flex >
							</Flex>

							<Spacer />
							{/* Buttons */}
							<Flex
								direction="column"
								gap={{ base: "12px", xl: "16px" }}
								width={{ base: "75%", xl: "20%" }}
							>
								{/* Top Row of Buttons */}
								<Flex
									align="center"
									justify="center"
									mt={{ base: "16px", xl: "0px" }}
									gap="16px"
									width="100%"
								>
									{/* Bio Button */}
									<Flex
										w={"50%"}
									>
										<ProfileInformationButton
											text="bio"
											clickEvent={() => {
												setCurrentSelection(PageName.Bio);
											}}
											isSelected={currentSelection === PageName.Bio}
										/>
									</Flex>
									{/* Album Button */}
									<Flex
										w={"50%"}
									>
										<ProfileInformationButton
											text="album"
											clickEvent={() => {
												setCurrentSelection(PageName.Album);
											}}
											isSelected={currentSelection === PageName.Album}
										/>
									</Flex>
								</Flex>
								{loadPrivateProfile &&
									// Edit Profile Button
									<Button
										bgColor="transparent"
										border="solid 3px #27CE00"
										width="100%"
										fontFamily={"Barlow Semi Condensed"}
										fontSize="14px"
										fontWeight="600"
										letterSpacing="1.5px"
										_hover={{
											md: {
												bgColor: "#CCC",
												border: "3px solid #CCC",
												cursor: "pointer",
												color: "black",
											}
										}}
										onClick={() => {
											setButtonClicked(false);
											onOpen();
										}}
									>
										EDIT PROFILE
									</Button>
								}
							</Flex>
						</Flex>
					</Flex>
				</Flex>
				<Flex
					w="100%"
					h="100%"
					minH="70vh"
					justify="center"
				>
					<Flex
						position="absolute"
						w="100vw"
						h="70vh"
						bgGradient={"linear(180deg, gray.1200 0%, gray.1300 100%) 0% 0% no-repeat padding-box;"}
						zIndex={1}
					/>
					<Flex w="100%" justify="center" maxW="1500px" zIndex={2} minH={`calc(100vh - ${headerHeight})`} mb="100px">
						{currentSelection === PageName.Bio &&
							<ProfileBioTab
								profileInfo={profileInfo}
								isLoaded={isLoaded}
								editable={loadPrivateProfile}/>
						}
						{currentSelection === PageName.Album &&
							<ProfileAlbumTab
								currentProfileId={viewedPlayerId}
								currentUserName={profileInfo?.first_name ? profileInfo?.first_name : ""}
								currentUserId={currentUserId}
								createdCardList={createdCardList}
								tradedCardList={tradedCardList}
								boughtCardList={boughtCardList}
								privateView={loadPrivateProfile}
							/>
						}
					</Flex>
				</Flex>
			</Flex >
			<EditProfileModal
				isOpen={isOpen}
				onClose={onClose}
				undoProfileChanges={undoProfileChanges}
				checkUpdate={checkUpdate}
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
			<Footer />
		</>
	);
}
