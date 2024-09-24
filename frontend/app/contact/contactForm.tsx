import { Box, Flex, Spacer, Stack, VStack, Text, HStack, Button } from "@chakra-ui/react";
import { useState } from "react";
import ContactSubjectDropdown from "./contactSubjectDropdowm";
import DropzoneButton from "@/components/create/dropzoneButton";
import { useToast } from "@chakra-ui/react";
import { BeatLoader } from "react-spinners";
import { RequestRedirect } from "node-fetch";
import { b64toBlob, uploadAssetToS3 } from "@/components/create/Step3";
import { apiEndpoints } from "@backend/EnvironmentManager/EnvironmentManager";
import ContactFormInput from "./contactFormInput";
import ContactFormTextarea from "./contactFormTextarea";
import ContactFormLabel from "./contactFormLabel";

/**
 * the Contact form
 * @returns Contact form componet
 */
export default function ContactForm() {
	const toast = useToast();

	const [ firstName, setFirstName ] = useState("");
	const [ lastName, setLastName ] = useState("");
	const [ email, setEmail ] = useState("");
	const [ subject, setSubject ] = useState("General Questions");
	const [ message, setMessage ] = useState("");
	const [ attachment, setAttachment ] = useState("");

	const [ sendingEmailLoading, setSendingEmailLoading ] = useState(false);

	const [ attachFinshed, setattachFinshed ] = useState(false);
	const [ attachLoading, setattachLoading ] = useState(false);

	// States for handling errors
	const [ errors, setErrors ] = useState({
		firstName: false,
		lastName: false,
		email: false,
		message: false
	});

	/**
	* procces the user selecteing an Image to attach to the file
	*/
	async function processAttachmentSelect(files: FileList) {
		setattachFinshed(false);
		setattachLoading(true);
		const myPhoto = URL.createObjectURL(files[0]);
		const current_unix_time = Math.floor(Date.now() / 1000);
		const filetype = files[0].type;
		const filext = filetype.replace("image/", "");
		const filename = `Hidden-Page-user-attachments-${current_unix_time}.${filext}`;
		await uploadAssetToS3(filename, await b64toBlob(myPhoto), "attachments", filetype);
		setAttachment(`https://gamechangers-media-uploads.s3.amazonaws.com/attachments/${filename}`);
		setattachFinshed(true);
		setattachLoading(false);
	}

	/**
	 * handles the email sending
	 */
	async function sendEmail() {

		setSendingEmailLoading(true);

		const emailHeaders = new Headers();
		emailHeaders.append("Content-Type", "application/json");

		const raw = JSON.stringify({
			firstName: firstName,
			lastName: lastName,
			email: email,
			subject: subject,
			message: message,
			attachment: attachment
		});

		const requestOptions = {
			method: "POST",
			headers: emailHeaders,
			body: raw,
			redirect: "follow" as RequestRedirect
		};

		const contactusRequest = await fetch(apiEndpoints.contactEmail(), requestOptions);
		if (contactusRequest.status === 200) {
			setSendingEmailLoading(false);
			toast({
				title: "Request Sent",
				description: "The OnFire team has been notified of your message.",
				status: "success",
				duration: 5000,
				isClosable: true,
			});
		} else {
			setSendingEmailLoading(false);
			toast({
				title: "Request Failed",
				description: "An error occurred while sending your message. Please try again later.",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		}

	}

	/**
	 * fuction to reset state vars to deafualt states
	 */
	function clearValues() {
		setFirstName("");
		setLastName("");
		setEmail("");
		setSubject("General Questions");
		setMessage("");
		setAttachment("");
		setattachFinshed(false);
	}

	/**
	 * Validates an email address
	 * @param email The email to validate
	 * @returns If the email is valid
	 */
	function isValidEmail(email: string): boolean {
		const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
		return emailRegex.test(email);
	}

	/**
	 * fucntion to handle the submit button click
	 * does error checking on the required value
	 */
	function HandleClick() {
		const newErrors = { ...errors };

		newErrors.firstName = !firstName;
		newErrors.lastName = !lastName;
		newErrors.email = !email;

		setErrors(newErrors);

		// Check if all fields are filled
		const allFieldsFilled = !Object.values(newErrors).includes(true);

		// Optionally show a toast or alert to indicate missing fields
		if (message === "") {
			setErrors({
				...errors,
				message: true
			});
			toast({
				title: "Invalid Message",
				description: "Please enter a message.",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
			return;
		}

		// Optionally show a toast or alert to indicate missing fields
		if (!isValidEmail(email)) {
			setErrors({
				...errors,
				email: true
			});
			toast({
				title: "Invalid Email",
				description: "Please enter a valid email address.",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
			return;
		}

		if(allFieldsFilled) {
			sendEmail();
			clearValues();
		} else {
			toast({
				title: "Required fields missing",
				description: "Please fill all required fields.",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		}
	}


	return (
		<VStack
			w="full"
			h={"100%"}
			maxW={{ base: "none", lg: "932px" }}
			mx="auto"
			color="white"
			rounded="2xl"
			backgroundColor="#171C1B"
			boxShadow={"0px 3px 16px #000000C7"}
			align={"left"}
			spacing={3}
			px={{ base: "24px", lg: "48px" }}
			py={{ base: "24px", lg: "32px" }}
		>
			<ContactFormLabel>Name</ContactFormLabel>
			<Flex flexDir={{ base: "column", md: "row" }} w="100%" gridGap={4}>
				<ContactFormInput
					hasError={errors.firstName}
					placeholder="First Name"
					value={firstName}
					onChange={(event) => {
						setErrors({
							...errors,
							firstName: false
						});
						setFirstName(event.target.value);
					}}
				/>
				<ContactFormInput
					hasError={errors.lastName}
					placeholder="Last Name"
					value={lastName}
					onChange={(event) => {
						setErrors({
							...errors,
							lastName: false
						});
						setLastName(event.target.value);
					}}
				/>
			</Flex>
			<ContactFormLabel>Email</ContactFormLabel>
			<ContactFormInput
				hasError={errors.email}
				value={email}
				placeholder="Email Address*"
				onChange={(event) => {
					setErrors({
						...errors,
						email: false
					});
					setEmail(event.target.value);
				}}
			/>
			<ContactFormLabel>Subject</ContactFormLabel>
			<ContactSubjectDropdown
				options={[
					"General Questions",
					"Support Request",
					"Sales & Pricing",
					"Technical Issue",
					"Product Feedback",
					"Partnership Opportunity",
					"Media & Press",
					"Career & Jobs",
					"Website Feedback",
					"Other"
				]}
				selectedOption={subject}
				setValue={setSubject}
			/>
			<Box>
				<ContactFormLabel>Message</ContactFormLabel>
				<Text alignSelf={"top"} textColor={"#B7B7B7"} fontFamily={"Barlow"} fontSize={"xs"}>
					Please enter the details of your request. A member of our support staff will respond as soon as possible.
				</Text>
			</Box>
			<ContactFormTextarea
				hasError={errors.message}
				placeholder="Message"
				value={message}
				onChange={(e) => {
					setErrors({
						...errors,
						message: false
					});
					setMessage(e.target.value);
				}}
			/>
			<Stack direction={{ base: "column", md: "row" }} spacing={{ base: 0, md: 6 }} mb={1} mt={2}>
				<ContactFormLabel> Attachments (Optional)</ContactFormLabel>
				<Text alignSelf={"top"} textColor={"#B7B7B7"} fontFamily={"Barlow"} fontSize={"xs"}>
						File Specs: PNG, JPG, MAX 25MB
				</Text>
			</Stack>
			<DropzoneButton buttonText="UPLOAD ATTACHMENT" svgcomp="contact"
				onAttachmentSelect={processAttachmentSelect}
				isLoading={attachLoading}
				attachFinshed={attachFinshed}
			/>
			<HStack w={"100%"} paddingTop={8}>
				<Spacer/>
				<Button
					onClick={HandleClick}
					height={"50px"}
					width={"150px"}
					letterSpacing={"1.5px"}
					fontFamily={"Barlow"}
					bgColor={"green.100"}
					_hover={{
						bgColor: "green.300"
					}}
					isDisabled={sendingEmailLoading || attachLoading}
					isLoading={sendingEmailLoading}
					spinner={<BeatLoader color="white" size={8}/>}
				>
					SUBMIT
				</Button>
			</HStack>
		</VStack>
	);
}
