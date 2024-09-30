"use client";

import { Flex, Grid, GridItem, Text, useDisclosure, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody,
	SkeletonText, IconButton, Skeleton, Input, useToast, Spinner, ModalFooter, Button, ModalHeader, ToastId, UseToastOptions,
	AspectRatio, Box } from "@chakra-ui/react";
import { Image as ChakraImage } from "@chakra-ui/react";
// eslint-disable-next-line no-use-before-define
import React, { ChangeEvent, createRef, useEffect, useState } from "react";
import { faX, faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { b64toBlob, uploadAssetToS3 } from "@/components/create/Step3";
import { useAuth } from "@/hooks/useAuth";
import { ProfileInfo } from "../page";
import { apiEndpoints } from "@backend/EnvironmentManager/EnvironmentManager";
import ReactPlayer from "react-player";


interface ProfileBioTabProps {
	profileInfo: ProfileInfo | undefined;
	isLoaded: boolean;
	editable: boolean;
}

enum MediaInteractionType {
	UPLOAD = "upload",
	DELETE = "delete",
}

enum MediaType {
	PHOTO = "photo",
	VIDEO = "video",
}

/**
 * The Profile tab for the About page.
 * @returns The About Tab for the Profile page.
 */
export default function ProfileBioTab({ profileInfo, isLoaded, editable }: ProfileBioTabProps) {

	const [ hoveredIndex, setHoveredIndex ] = useState(-1);

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { isOpen: deleteModalIsOpen, onOpen: deleteModalOnOpen, onClose: deleteModalOnClose } = useDisclosure();

	const auth = useAuth();
	const toast = useToast();
	const fileInputRef = createRef<HTMLInputElement>();

	const [ media, setMedia ] = useState<string[]>(profileInfo?.media ?? []);
	const [ clickedMedia, setClickedMedia ] = useState<string | null>(null);
	const [ fileIsLoading, setFileIsLoading ] = useState(false);
	const [ clickedMediaType, setClickedMediaType ] = useState<string | null>(null);
	const [ pendingDeleteModalOpen, setPendingDeleteModalOpen ] = useState(false);


	const [ isMobile, setIsMobile ] = useState(false);

	useEffect(() => {

		let userAgent = "";
		if (typeof window !== "undefined") {
			userAgent = navigator.userAgent.toLowerCase();
		}
		setIsMobile((/mobile|android|ipad|iphone|ipod|blackberry|iemobile|opera mini/i).test(userAgent));

	}, []);

	// Initial load of media
	useEffect(() => {
		setMedia(profileInfo?.media ?? []);
	}
	, [ profileInfo?.media ]);


	/**
	 * Fetches the updated media array from the backend
	 * @returns a Promise that resolves with the updated media array
	 */
	async function getUpdatedMediaArray(type: string) {
		const user = await auth.currentAuthenticatedUser();
		const userId = user.userId;

		const getUserResponse = await fetch(`${apiEndpoints.getUser()}?uuid=${userId}`, {
			method: "GET",
		});
		if (!getUserResponse.ok && type === MediaInteractionType.UPLOAD) {
			toast({
				title: "Media Upload Failed",
				description: "There was an error uploading your media. Please try again.",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
			return;
		} else if (!getUserResponse.ok && type === MediaInteractionType.DELETE) {
			toast({
				title: "Media Deletion Failed",
				description: "There was an error deleting your media. Please try again.",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
			return;
		}
		const userResponseJson = await getUserResponse.json();
		const userMedia = userResponseJson.media;
		if (userMedia) {
			setMedia(userMedia);
		}
	}

	/**
	 * Adds an image to the media array
	 */
	async function addToMediaArray(uploadedMediaURL: string) {

		// Get the current user's uuid
		const user = await auth.currentAuthenticatedUser();
		const userId = user.userId;

		// Update the backend with the newest media upload
		const response = await fetch(apiEndpoints.users_updateUserProfile(), {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				uuid: userId,
				first_name: profileInfo?.first_name,
				last_name: profileInfo?.last_name,
				position: profileInfo?.position,
				team_hometown: profileInfo?.team_hometown,
				bio: profileInfo?.bio,
				avatar: profileInfo?.avatar,
				facebookLink: profileInfo?.facebookLink,
				instagramLink: profileInfo?.instagramLink,
				xLink: profileInfo?.xLink,
				tiktokLink: profileInfo?.tiktokLink,
				youtubeLink: profileInfo?.youtubeLink,
				snapchatLink: profileInfo?.snapchatLink,
				media: [ ...(media ?? []), uploadedMediaURL ],
			}),
		});

		if (!response.ok) {
			toast({
				title: "Media Upload Failed",
				description: "There was an error uploading your media. Please try again.",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
			setFileIsLoading(false);
			return;
		}
		await getUpdatedMediaArray(MediaInteractionType.UPLOAD);
		toast({
			title: "Media Uploaded",
			description: "Your media has been uploaded successfully.",
			status: "success",
			duration: 5000,
			isClosable: true,
		});
		setFileIsLoading(false);
	}

	/**
	 * Deletes an image from the media array
	 */
	async function deleteFromMediaArray(mediaURL: string) {

		// Get the current user's uuid
		const user = await auth.currentAuthenticatedUser();
		const userId = user.userId;

		// Update the backend with the newest media upload
		const response = await fetch(apiEndpoints.users_updateUserProfile(), {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				uuid: userId,
				first_name: profileInfo?.first_name,
				last_name: profileInfo?.last_name,
				position: profileInfo?.position,
				team_hometown: profileInfo?.team_hometown,
				bio: profileInfo?.bio,
				avatar: profileInfo?.avatar,
				facebookLink: profileInfo?.facebookLink,
				instagramLink: profileInfo?.instagramLink,
				xLink: profileInfo?.xLink,
				tiktokLink: profileInfo?.tiktokLink,
				youtubeLink: profileInfo?.youtubeLink,
				snapchatLink: profileInfo?.snapchatLink,
				media: [ ...(media ?? []).filter((url) => {
					return url !== mediaURL;
				}) ],
			}),
		});
		if (!response.ok) {
			toast({
				title: "Media Deletion Failed",
				description: "There was an error deleting your media. Please try again.",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
			return;
		}
		await getUpdatedMediaArray(MediaInteractionType.DELETE);
		toast({
			title: "Media Deleted",
			description: "Your media has been deleted successfully.",
			status: "success",
			duration: 5000,
			isClosable: true,
		});
	}

	/**
	 * Resizes an image to fit within the given dimensions
	 * @param file the image file to resize
	 * @param maxWidth the maxiumum width of the resized image
	 * @param maxHeight the maximum height of the resized image
	 * @returns a Promise that resolves with the resized image as a data URL
	 */
	async function resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			const img = new Image();

			// Set up onload event handler
			img.onload = () => {
				let width = img.width;
				let height = img.height;

				// Resize the image while maintaining aspect ratio
				if (width > height) {
					if (width > maxWidth) {
						height = height * (maxWidth / width);
						width = maxWidth;
					}
				} else if (height > maxHeight) {
					width = width * (maxHeight / height);
					height = maxHeight;
				}

				// Create a canvas element for resizing
				const canvas = document.createElement("canvas");
				if (!(canvas instanceof HTMLCanvasElement)) {
					reject(new Error("Failed to create canvas element"));
					return;
				}
				canvas.width = width;
				canvas.height = height;

				// Draw the image onto the canvas
				const ctx = canvas.getContext("2d");
				ctx?.drawImage(img, 0, 0, width, height);

				// Get the resized image as data URL
				const resizedPhoto = canvas.toDataURL("image/png");

				// Resolve the Promise with the resized image data URL
				resolve(resizedPhoto);
			};

			// Set up onerror event handler
			img.onerror = () => {
				reject(new Error("Failed to load the image"));
			};

			// Set the src attribute of the image to start loading the image
			img.src = URL.createObjectURL(file);
		});
	}

	/**
	 * Handles the file selection
	 * @param event clicking on the button
	 */
	async function processMediaSelect(files: FileList, mediaType: string): Promise<void> {
		setFileIsLoading(true);

		// Gets the file
		const file = files[0];

		// Determine name of file
		const userDetails = await auth.currentAuthenticatedUser();
		const user_id = userDetails.userId;
		const current_unix_time = Math.floor(Date.now() / 1000);
		let filename = `${user_id}-${current_unix_time}`;

		if (mediaType === MediaType.PHOTO) {
			// Resize photo
			const resizedImage = await resizeImage(file, 750, 750);

			// convert b64 to blob
			const uploadedMediaBlob = await b64toBlob(resizedImage);

			// Put the .png extension on the filename
			filename = `${filename}.png`;

			// Upload the image to S3
			await uploadAssetToS3(filename, uploadedMediaBlob, "profile_media", "image/png");
		} else { // mediaType === MediaType.VIDEO
			// Put the .mp4 extension on the filename
			filename = `${filename}.mp4`;

			// Upload the video to S3
			await uploadAssetToS3(filename, file, "profile_media", "video/mp4");
		}

		// Update the media array
		await addToMediaArray(`https://gamechangers-media-uploads.s3.amazonaws.com/profile_media/${filename}`);
	}

	/**
	 * Handles the asynchronous aspect of photo selection
	 * @param files the photo to be processed
	 */
	async function handleAsyncMediaSelect(files: FileList, mediaType: string): Promise<void> {
		await processMediaSelect(files, mediaType);
	}

	/**
	 * Wrapper function for handling file selection
	 * @param event clicking on the button
	 */
	function handleFileSelectWrapper(
		event: ChangeEvent<HTMLInputElement>,
		mediaType: string,
		onFileSelect: (files: FileList, mediaType: string) => void,
		// onVideoSelect: (files: FileList) => void,
		toast: (options: UseToastOptions) => ToastId | undefined
	): void {
		if (event.target.files) {
			if (!MediaType.PHOTO && !MediaType.VIDEO) {
				toast({
					title: "Unsupported file type",
					description: "Please select a supported file type.",
					status: "error",
					duration: 5000,
					isClosable: true,
				});
				return;
			}
			const files = event.target.files;
			onFileSelect(files, mediaType);
		}
	};

	/**
	 * Makes the file input clickable
	 */
	function handleButtonClick(): void {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	}


	/**
	 * Trigers when modal closes
	 */
	function onPrimaryModalCloseComplete() {
		if (pendingDeleteModalOpen) {
			deleteModalOnOpen(); // Open the delete modal now that the primary modal is fully closed
			setPendingDeleteModalOpen(false); // Reset state
		}
	}

	/**
	 * Toggles the current modal close and sets up the delete modal to open next.
	 */
	function handleDeleteButtonClick() {
		setPendingDeleteModalOpen(true); // Signal that the delete modal should open next
		onClose(); // Trigger closing the current modal
	}


	return (
		<>
			<Flex w="70%" mt="50px" direction="column">
				<Flex direction="column" mb="40px">
					<Text
						fontSize="24px"
						fontFamily="'Barlow Condensed', sans-serif"
						fontStyle="italic"
						fontWeight="600"
						color="green.800"
						letterSpacing={"0.75px"}
						ml="4px"
						mb="6px"
					>
						About
					</Text>
					<SkeletonText isLoaded={isLoaded} noOfLines={3}>
						<Text
							fontSize={{ base: "16px", md: "20px" }}
							fontWeight="500"
							lineHeight="38px"
						>
							{profileInfo?.bio ?? "No bio available."}
						</Text>
					</SkeletonText>
				</Flex>
				<Grid
					templateColumns={{ "base": "repeat(1, 1fr)", "md": "repeat(2, 1fr)", "xl": "repeat(3, 1fr)", "2xl": "repeat(4, 1fr)" }}
					gap="40px"
					mb="40px"
					alignItems={"center"}
				>
					{media.map((media, index) => {
						const mediaType = media.includes(".mp4") || media.includes(".mov") ? MediaType.VIDEO : MediaType.PHOTO;
						return (
							<React.Fragment key={index}>
								<Skeleton isLoaded={isLoaded}>
									<GridItem
										w="100%"
										h="0"
										paddingBottom="100%"
										position="relative"
										_hover={{
											md: {
												zIndex: 1,
												width: "105%",
												height: "105%",
												margin: "-2.5%",
												cursor: "pointer"
											}
										}}
										transition={"width 0.3s, height 0.3s, margin 0.3s"}
										onClick={(e) => {
											e.stopPropagation();
											e.preventDefault();
											setClickedMedia(media);
											setClickedMediaType(mediaType);
											onOpen();
										}}
										onMouseEnter={() => {
											setHoveredIndex(index);
										}}
										onMouseLeave={() => {
											setHoveredIndex(-1);
										}}
									>
										{hoveredIndex === index && editable && !isMobile && (
											<IconButton
												aria-label="Delete image"
												icon={<FontAwesomeIcon icon={faX} />}
												position="absolute"
												top="-10px"
												right="-10px"
												bg="red.600"
												color="white"
												w="40px"
												h="40px"
												zIndex={1}
												_hover={{ md: { bgColor: "red.700" } }}
												onClick={(e) => {
													e.stopPropagation();
													e.preventDefault();
													setClickedMedia(media);
													setClickedMediaType(mediaType);
													deleteModalOnOpen();
												}}
											/>
										)}
										<div style={{
											width: "100%",
											height: "100%",
											position: "absolute",
											top: 0,
											left: 0,
											overflow: "hidden",
											display: "flex",
											alignItems: "center",
											justifyContent: "center"
										}}>
											{mediaType === MediaType.PHOTO ? (
												<ChakraImage
													alt="Bio Image"
													src={media}
													style={{ width: "100%", height: "100%", objectFit: "cover" }}
												/>
											) : (
												<video
													src={media}
													style={{ width: "100%", height: "100%", objectFit: "cover" }}
													autoPlay={true}
													muted={true}
													playsInline={true}
													onPlay={(e) => {
														// As soon as the video starts playing, pause it
														e.currentTarget.pause();
													}}
												/>
											)}
										</div>
									</GridItem>
								</Skeleton>

								{/* Modal for displaying the image */}
								<Modal
									isOpen={isOpen}
									onClose={onClose}
									onCloseComplete={onPrimaryModalCloseComplete}
									isCentered
									size={clickedMediaType === MediaType.PHOTO ? "md" : "none"}>
									<ModalOverlay backdropFilter="blur(5px) hue-rotate(10deg)" />
									<ModalContent
										maxW={{ base:"95vw", md:"60vw" }} maxH="90vh"
										height={"auto"}
										width={"auto"}
									>
										<ModalCloseButton zIndex={1} />
										<ModalBody display="flex" justifyContent="center">
											{ clickedMediaType === MediaType.PHOTO ?
												<ChakraImage
													alt="Bio Image"
													src={clickedMedia!}
													borderRadius="10px"
													mb="10px"
													objectFit="scale-down"
													maxHeight="400px"
													p={"5%"}
												/> :
												<Box paddingTop={{ base: "10%", md: "3%" }}>
													<AspectRatio h={{ base:"55vh", md: "60vh" }} w={{ base: "70vw", md: "50vw" }} ratio={16 / 9}>
														<ReactPlayer
															light={true}
															preload="auto"
															playsinline={true}
															url={clickedMedia!}
															controls={true}
															muted={true}
															width={isMobile ? "none" : "60vw"}
															height={isMobile ? "55vh" : "70vh"}
															style={{ maxWidth: "100%", maxHeight: "100%", padding: "3%" }}

														/>
													</AspectRatio>
												</Box>
											}
										</ModalBody>
										{ editable &&
										<ModalFooter>
											<Flex w="30%">
												<Button
													background="red.600"
													onClick={(e) => {
														e.stopPropagation();
														e.preventDefault();
														handleDeleteButtonClick();
													}}>
												Delete
												</Button>
											</Flex>
										</ModalFooter> }
									</ModalContent>
								</Modal>

								{/* Modal for deleting the media */}
								<Modal
									isOpen={deleteModalIsOpen}
									onClose={deleteModalOnClose}
									isCentered
									size={clickedMediaType === MediaType.PHOTO ? "lg" : "none"}>
									<ModalOverlay backdropFilter="blur(5px) hue-rotate(10deg)" />
									<ModalContent
										maxW={{ base:"95vw", md:"60vw" }} maxH="90vh"
										height={"auto"}
										width={"auto"}>
										<ModalCloseButton zIndex={1} />
										<ModalHeader width="90%">
											Are you sure you want to delete this {clickedMediaType === MediaType.PHOTO ? "photo" : "video"}?
										</ModalHeader>
										<ModalBody display="flex" justifyContent="center">
											{ clickedMediaType === MediaType.PHOTO ?
												<ChakraImage
													alt="Bio Image"
													src={clickedMedia!}
													borderRadius="10px"
													mb="10px"
													objectFit="scale-down"
													maxHeight="400px"
												/> :
												<></>
											}
										</ModalBody>
										<ModalFooter alignItems={{ base: "center", md: "start" }}>
											<Flex gap="20px" w={{ base: "100%", md: "none" }}>
												<Button background="gray.500" onClick={() => {
													deleteModalOnClose();
												}}>
											Cancel
												</Button>
												<Button background="red.600" onClick={() => {
													deleteFromMediaArray(clickedMedia!);
													deleteModalOnClose();
												}}>
											Delete
												</Button>
											</Flex>

										</ModalFooter>
									</ModalContent>
								</Modal>
							</React.Fragment>
						);
					})}
					{ editable && isLoaded && <GridItem w="100%" h="100%" display="grid" alignContent="center" justifyItems="center">
						<Flex
							paddingTop="40px"
							color="white"
							_hover={{ md: { cursor: "pointer", color: "green.100" } }}
							transition="color 0.3s ease-in-out"
							onClick={handleButtonClick}
						>
							{ fileIsLoading ? <Spinner size="xl" color="green.100" emptyColor="gray.200" opacity={"0.75"} /> :
								<FontAwesomeIcon icon={faCirclePlus} size="4x" opacity="0.75" /> }
						</Flex>
					</GridItem>
					}
					<Input
						type="file"
						accept={"image/png, image/jpeg, image/jpg, .mov, .mp4"}
						ref={fileInputRef}
						style={{ display: "none" }}
						onChange={(event) => {
							if (event.target.files && event.target.files.length > 0) {
								handleFileSelectWrapper(
									event,
									event.target.files![0].type.includes("image") ? MediaType.PHOTO : MediaType.VIDEO,
									handleAsyncMediaSelect,
									toast
								);
							}
						}}
					/>
				</Grid>
			</Flex>
		</>
	);
}
