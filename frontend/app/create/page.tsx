"use client";

import { AspectRatio, Box, Flex, Image, Spacer, Stack, VStack } from "@chakra-ui/react";
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
			stepDescription: "Create and customize your own card!",
		},
		{
			stepNumber: 2,
			stepDescription: "Pick a digital and/or physical AR package!",
		},
		{
			stepNumber: 3,
			stepDescription: "Showcase, Trade, & Sell your sports cards!",
		},
	];

	const InfoSections = [
		{
			description: <EasyStepsInfoSection steps={EasySteps} />,
		},
	];

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
					h="577px"
					w="100vw"
					position="relative">
					<Flex position="absolute" bgGradient="linear(#000000, #00000015, #00000000)" h="100px" w="100%" />
					<Flex position="absolute" bgGradient="linear(#000000, #17760B, #058D05)" opacity="78%" h="100%" w="100%" />
				</Flex>
				{/* Bottom Part of the Background */}
				<Flex bgGradient={"linear(180deg, gray.1200 0%, gray.1300 100%) 0% 0% no-repeat padding-box;"} h="calc(100% - 500px)" w="100vw" />
			</Flex>

			{/* Main Flexbox */}
			<Flex direction="row-reverse">
				<Box display={{ base: "none", lg: "block" }} position={"sticky"}>
					<Sidebar height="100%" backgroundPresent />
				</Box>
				{/* Everything but the sidebar */}
				<Flex direction="column" w="100%">
					<NavBar noDivider />
					{/* Everything but the navbar (main page contents) */}
					<Stack
						direction={{ base: "column", xl: "row" }}
						w="100%"
						h="100%"
						align="center"
						gap={{ base: 0, xl: "130px" }}
						pl={{ base: 0, lg: 8, xl: 48 }}
						mt={{ base: "20px", lg: "80px" }}>
						{/* Create Your Sports Card + Overview */}
						<VStack w="100vw" maxW="866px" gap="36px">
							<Stack direction={{ base: "column", lg: "row" }} align={{ base: "center", lg: "end" }} w="100%">
								{/* Create Your Card Component */}
								<CreateYourCardText />
								<Spacer />
								<ButtonWithIcon
									title={"START CREATING"}
									link={"/create/card_creation"}
									width={"100%"}
									maxW={{ base: "256px", lg: "350px" }}
									height={{ base: "50px", lg: "65px" }}
									color={"green.100"}
									fontWeight="500"
									letterSpacing={"2px"}
									fontSize={{ base: "20px", lg: "22px" }}
									textAlign="left"
									my="10px"
									px="21px"
								/>
							</Stack>
							{/* Desktop version of How OnFire Athletes works card */}
							<Box
								display={{
									base: "none",
									xl: "block",
								}}
								w="100%">
								<InfoCard infoSections={InfoSections} />
							</Box>
						</VStack>
						{/* Card image and shadow */}
						<Flex
							direction="column"
							align="center"
							px={{ base: "90px", lg: "36px" }}
							mr={{ base: 0, lg: 8, xl: 24 }}
							maxW={{ base: "560px", lg: "400px", xl: "460px" }}
							minW="350px"
							w="100%"
							mt="56px"
							mb="16px">
							<AspectRatio ratio={1100 / 1653} width="100%">
								<Image width="100%" src="step_one_template_cards/demario_a.png" alt="Your Card" objectFit="contain" transform="rotate(12deg)" />
							</AspectRatio>
							<Box mt="10%" width="120%">
								<CardDropShadow />
							</Box>
						</Flex>
						{/* Bottom Content for Mobile, Info sections */}
						<Box
							display={{
								base: "block",
								xl: "none",
							}}>
							<Flex py="10px" px="20px" w="100%">
								<InfoCard infoSections={InfoSections} />
							</Flex>
						</Box>
					</Stack>
				</Flex>
			</Flex>
			<Footer />
		</>
	);
}
