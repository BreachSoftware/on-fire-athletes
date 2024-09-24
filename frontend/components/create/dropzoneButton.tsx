import { Text, Button, Icon, Input, useToast, Spinner, Box, Spacer } from "@chakra-ui/react";
import { FaChevronRight, FaImage } from "react-icons/fa";
import { MdFileUpload } from "react-icons/md";
import { FaVideo } from "react-icons/fa";
import { createRef, ChangeEvent, useState, useEffect } from "react";
import { CheckIcon, } from "@chakra-ui/icons";

interface DropzoneProps {
	buttonText: string;
	svgcomp: string;
	width?: string;
	height?: string;
	onPhotoSelect?: (files: FileList) => void;
	onVideoSelect?: (files: FileList) => void;
	onProfileImageSelect?: (files: FileList) => void;
	onAttachmentSelect?: (files: FileList) => void;
	attachFinshed?: boolean;
	isLoading?: boolean;
	inLineIcon?: boolean;
	uploadComplete?: boolean;
}

/**
 * The dropzone component
 * @returns the dropzone button component
 */
export default function DropzoneButton({
	buttonText, svgcomp, width, height, onPhotoSelect,
	onVideoSelect, onProfileImageSelect, onAttachmentSelect,
	attachFinshed, isLoading, inLineIcon, uploadComplete
}: DropzoneProps) {

	const toast = useToast();
	const fileInputRef = createRef<HTMLInputElement>();
	const icon = svgcomp === "photo" ? FaImage : FaVideo;

	const [ pictureIsLoading, setPictureIsLoading ] = useState(false);

	/**
	 * Makes the file input clickable
	 */
	function handleButtonClick(): void {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	}

	useEffect(() => {
		setPictureIsLoading(false);
	}, [ uploadComplete ]);

	/**
 * Handles the file selection
 * @param event clicking on the button
 */
	function handleFileSelect(event: ChangeEvent<HTMLInputElement>): void {
		// i don't think this will happen but just in case
		if (event.target.files && event.target.files.length > 1) {
			toast({
				title: "Multiple Files Selected",
				description: "Please select only one file at a time.",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
			return;
		}
		let fileExtension: string | undefined = undefined;
		if (event.target.files && event.target.files.length === 1) {
			fileExtension = event.target.files[0].name.split(".").pop()?.toLowerCase();
			switch (svgcomp) {
			case "photo":
				if (fileExtension !== "jpeg" && fileExtension !== "jpg" && fileExtension !== "png") {
					toast({
						title: "Invalid File Type",
						description: "Please select a PNG or JPEG file.",
						status: "error",
						duration: 5000,
						isClosable: true,
					});
					return;
				} else if (event.target.files[0].size > 25000000) {
					toast({
						title: "File Too Large",
						description: "Please select a file smaller than 25MB.",
						status: "error",
						duration: 5000,
						isClosable: true,
					});
					return;
				}
				if (onPhotoSelect) {
					onPhotoSelect(event.target.files);
				}
				break;
			case "contact":
				if (fileExtension !== "jpeg" && fileExtension !== "jpg" && fileExtension !== "png") {
					toast({
						title: "Invalid File Type",
						description: "Please select a PNG or JPEG file.",
						status: "error",
						duration: 5000,
						isClosable: true,
					});
					return;
				} else if (event.target.files[0].size > 25000000) {
					toast({
						title: "File Too Large",
						description: "Please select a file smaller than 25MB.",
						status: "error",
						duration: 5000,
						isClosable: true,
					});
					return;
				}
				if (onAttachmentSelect) {
					onAttachmentSelect(event.target.files);
				}
				break;
			case "profile":
				if (fileExtension !== "jpeg" && fileExtension !== "jpg" && fileExtension !== "png") {
					toast({
						title: "Invalid File Type",
						description: "Please select a PNG or JPEG file.",
						status: "error",
						duration: 5000,
						isClosable: true,
					});
					return;
				} else if (event.target.files[0].size > 25000000) {
					toast({
						title: "File Too Large",
						description: "Please select a file smaller than 25MB.",
						status: "error",
						duration: 5000,
						isClosable: true,
					});
					return;
				}
				if (onProfileImageSelect) {
					onProfileImageSelect(event.target.files);
					setPictureIsLoading(true);
				}
				break;
			case "video":
				if (fileExtension !== "mov" && fileExtension !== "mp4") {
					toast({
						title: "Invalid File Type",
						description: "Please select a video file.",
						status: "error",
						duration: 5000,
						isClosable: true,
					});
					return;
				} else if (event.target.files[0].size > 100000000) {
					toast({
						title: "File Too Large",
						description: "Please select a file smaller than 100MB.",
						status: "error",
						duration: 5000,
						isClosable: true,
					});
					return;
				}
				if (onVideoSelect) {
					onVideoSelect(event.target.files);
				}
				break;
			default:
				console.error("Invalid file type");
				break;
			}
		}
	}

	/**
	 * Accepts the file type
	 * @returns the file type
	 */
	function acceptType(): string {
		switch (svgcomp) {
		case "photo":
			return "image/png, image/jpeg";
		case "contact":
			return "image/png, image/jpeg";
		case "profile":
			return "image/png, image/jpeg";
		case "video":
			return ".mov,.mp4";
		default:
			return "";
		}
	}
	return (
		<>
			<Input
				type="file"
				accept={acceptType()}
				ref={fileInputRef}
				style={{ display: "none" }}
				onChange={handleFileSelect}
			/>
			{(svgcomp === "photo" || svgcomp === "video") && (
				<Button
					variant="white"
					fontSize={{ base: "md", md: "md", lg: "16px" }}
					w={width || "90%"}
					h={height || "5vh"}
					px={{ base: "32px", md: "24px", lg: "24px" }}
					onClick={handleButtonClick}
					justifyContent={{ base: "center", sm: "space-between" }}
				>
					<Text fontFamily="Roboto" fontSize={"inherit"} fontWeight="bold">
						{buttonText}
					</Text>
					{inLineIcon ? (
						isLoading ? (
							<Spinner ml={"10px"} size="sm" color="green.100" />
						) : uploadComplete ? (
							<CheckIcon ml={"10px"} boxSize={5} color="green.100" />
						) : (
							<Icon ml={"10px"} color="#27CE00" boxSize={{ base: 5, md: 3, lg: 5 }} as={icon} />
						)
					) : (
						<Icon ml={"10px"} color="#27CE00" boxSize={{ base: 5, md: 3, lg: 5 }} as={icon} />
					)}
				</Button>
			)}
			{svgcomp === "profile" ?
				<Box padding={2}>
					<Button
						_hover={{ md: { opacity: 0.8, boxShadow: "0 0 5px rgba(0,0,0,0.3)", fontStyle: "italic", padding: "0px 25px" } }}
						transition="padding 0.2s ease-out, box-shadow 0.3s ease-out, background 0.3s ease-out"
						backgroundColor={"green.100"}
						letterSpacing={"2px"}
						width={130}
						color={"white"}
						fontSize={14}
						textTransform={"uppercase"}
						fontFamily={"Barlow"}
						onClick={handleButtonClick}
					>
				UPLOAD
						<Spacer />
						{ pictureIsLoading ? <Spinner size="sm" color="green.100" emptyColor="white.100" opacity={"0.75"} /> :
							<Icon as={FaChevronRight} /> }
					</Button>
				</Box> : <></>}
			{svgcomp === "contact" ?
				<Box padding={0}>
					<Button
						backgroundColor={"transparent"}
						border={"1px solid #FFFFFF"}
						borderRadius={"24px"}
						letterSpacing={"1.5px"}
						width={"240px"}
						maxH={"36px"}
						color={"white"}
						fontSize={"15px"}
						textTransform={"uppercase"}
						fontFamily={"Roboto"}
						fontWeight={"bold"}
						onClick={handleButtonClick}
					>
				UPLOAD ATTACHMENT
						<Spacer />
						{attachFinshed ? <CheckIcon ml={"10px"} boxSize={4} color="green.100" /> : (isLoading ?
							<Spinner ml={"10px"} size="sm" color="green.100" /> :
							<Icon boxSize={4} color={"green.100"} as={MdFileUpload} />)}
					</Button>
				</Box> : <></>}

		</>
	);
}
