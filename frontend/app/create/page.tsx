
"use client";

import { AspectRatio, Box, Flex, Image, Spacer, Stack, useBreakpointValue, VStack } from "@chakra-ui/react";
import CardDropShadow from "@/components/create/CardDropShadow";
import EasyStepsInfoSection from "@/components/create/easyStepsInfoSection";
import InfoCard from "@/components/info_card/info_card";
import CreateYourCardText from "@/components/create/CreateYourCardText";
import NavBar from "../navbar";
import Sidebar from "@/components/sidebar";
import { BackToCheckoutModal } from "../components/BackToCheckoutModal";
import ButtonWithIcon from "../components/buttons/button_with_icon";
import Footer from "../components/footer";

/**
 * Main page for the creation process
 * @returns the creation overview page
 */
export default function CreationOverview() {

	const EasySteps = [
		{
			stepNumber: 1,
			stepDescription: "Create and customize your own card!"
		},
		{
			stepNumber: 2,
			stepDescription: "Pick a digital and/or physical AR package!"
		},
		{
			stepNumber: 3,
			stepDescription: "Showcase, Trade, & Sell your sports cards!"
		},
	];

	const InfoSections = [
		{
			description: <EasyStepsInfoSection steps={EasySteps} />
		}
	];

	const isMobile = useBreakpointValue(
		{
			base: true,
			xl: false,
		}
	);

	return (
		<>
			<BackToCheckoutModal />

			{/* Background Flexbox */}
			<Flex direction="column" position="absolute" top="0" left="0" zIndex={-10} h="100%">
				{/* Top Background Image */}
				<Flex
					bgImage="young-athletes-card-array-bw.png"
					bgPosition="center"
					bgRepeat="no-repeat"
					filter={"grayscale(0%)"}
					bgSize="cover"
					bgPos="60% 40%"
					h="500px"
					w="100vw"
				>
					<Flex
						bgGradient="linear(#000C, #17760BC3, #058D05C3)"
						h="100%"
						w="100%"
					/>
				</Flex>
				{/* Bottom Part of the Background */}
				<Flex
					bgGradient={"linear(180deg, gray.1200 0%, gray.1300 100%) 0% 0% no-repeat padding-box;"}
					h="calc(100% - 500px)"
					w="100vw"
				/>
			</Flex>

			{/* Main Flexbox */}
			<Flex direction="row-reverse">
				{ !isMobile ? <Box position={"sticky"}><Sidebar height="100%" backgroundPresent /></Box> : null }
				{/* Everything but the sidebar */}
				<Flex direction="column" w="100%">
					<NavBar noDivider/>
					{/* Everything but the navbar (main page contents) */}
					<Stack
						direction={isMobile ? "column" : "row"}
						w="100%"
						h="100%"
						align="center"
						padding={"5%"}
						gap={isMobile ? "3vh" : "0"}
					>
						{/* Create Your Sports Card + Overview */}
						<VStack w={isMobile ? "100vw" : "45vw"} gap="4vh">
							<Stack
								direction={isMobile ? "column" : "row"}
								align={isMobile ? "center" : "end"}
								w="100%"
							>
								{/* Create Your Card Component */}
								<CreateYourCardText />
								<Spacer />
								<ButtonWithIcon
									title={"START CREATING"}
									link={"/create/card_creation"}
									width={"40%"}
									minWidth={"250px"}
									height={"50px"}
									color={"green.100"}
									letterSpacing={"2.25px"}
									fontSize={{ base:"16px", md:"18px" }}
								/>
							</Stack>
							{/* Desktop version of How OnFire Athletes works card */}
							{ !isMobile && (
								<Box w="100%" height="45vh">
									<InfoCard infoSections={InfoSections} />
								</Box>
							)}
						</VStack>
						{/* Spacer between sections */}
						<Box w="50px"/>
						{/* Card image and shadow */}
						<Flex
							direction="column"
							align="center"
							maxW={isMobile ? "80vw" : "30vw"}
							w={isMobile ? "60vw" : "100%"}
						>
							<AspectRatio ratio={1100 / 1653} width="70%">
								<Image
									src="step_one_template_cards/demario_a.png"
									alt="Your Card"
									objectFit="contain"
									transform="rotate(12deg)"
								/>
							</AspectRatio>
							<Box mt="10%" width="120%">
								<CardDropShadow />
							</Box>
						</Flex>
						{/* Bottom Content for Mobile, Info sections */}
						{ isMobile && (
							<Flex w="90%" py="20px">
								<Box w="100%">
									<InfoCard infoSections={InfoSections} />
								</Box>
							</Flex>
						)}
					</Stack>
				</Flex>
			</Flex>
			<Footer />
		</>
	);
}
