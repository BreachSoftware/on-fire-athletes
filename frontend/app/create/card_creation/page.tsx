"use client";
import { Box, Flex, HStack, VStack } from "@chakra-ui/react";
import StepWrapper from "@/components/create/StepWrapper";
import Step1 from "@/components/create/Step1";
import Step2 from "@/components/create/Step2";
import Step3 from "@/components/create/Step3";
import Step4 from "@/components/create/Step4";
import Step5 from "@/components/create/Step5";
import Sidebar from "@/components/sidebar";
import NavBar from "@/app/navbar";
import OnFireCard from "@/components/create/OnFireCard/OnFireCard";
import { useCurrentCardInfo } from "@/hooks/useCurrentCardInfo";
import TradingCardInfo from "@/hooks/TradingCardInfo";
import { useEffect, useRef, useState } from "react";
import MobileStepWrapper from "@/components/create/mobile/MobileStepWrapper";

/**
 *
 * @returns the creation overview page
 */
export default function CreationOverview() {
	const currentInfo = useCurrentCardInfo();
	const cardFrontRef = useRef(null);
	const cardBackRef = useRef(null);
	useEffect(() => {
		currentInfo.setCurCard(new TradingCardInfo());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	let isMobile = false;
	if (typeof window !== "undefined") {
		const userAgent = window.navigator.userAgent.toLowerCase();
		isMobile = (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i).test(userAgent);
	}

	/**
	 * Calculates the scale factor for the OnFire card on mobile screens
	 * to ensure that the card fits on the screen
	 *
	 * @returns the scale factor for mobile screens
	 */
	function calcMobileScaleFactor() {

		const cardHeight = 662;
		const navBarHeight = 66;
		const stepHeight = 224;
		const maxScaleFactor = 0.7;

		if (window.innerHeight > (cardHeight * maxScaleFactor) + navBarHeight + stepHeight) {
			return maxScaleFactor;
		}

		const heightOfElements = navBarHeight + stepHeight;

		const remainingHeightForCard = window.innerHeight - heightOfElements;
		const scaleFactor = remainingHeightForCard / cardHeight;

		return scaleFactor;

	}

	const [ screenScaleFactor, setScreenScaleFactor ] = useState(1);
	useEffect(() => {
		// Wait 1 second before calculating the scale factor to ensure that the window has been resized
		setTimeout(() => {
			setScreenScaleFactor(calcMobileScaleFactor());
		}, 100);
	}, []);

	const CardCreationSteps = [
		{
			// Step 1
			step: <Step1 />,
			stepTitle: "SELECT YOUR LAYOUT"
		},
		{
			// Step 2
			step: <Step2 />,
			stepTitle: "YOUR INFORMATION"
		},
		{
			// Step 3
			step: <Step3 />,
			stepTitle: "UPLOAD MEDIA"
		},
		{
			// Step 4
			step: <Step4 />,
			stepTitle: "CUSTOMIZE"
		},
		{
			// Step 5
			step: <Step5 />,
			stepTitle: "Description"
		}
	];

	return (
		<Box w={"100vw"}
			backgroundColor={isMobile ? "black" : "none"}
			bgGradient={isMobile ? "none" : "linear(180deg, gray.1200 0%, gray.1300 100%) 0% 0% no-repeat padding-box;"}
			minH={typeof window == "undefined" ? "100vh" : window.innerHeight} // making sure that the whole page is on screen at the same time
			overflowY={isMobile && currentInfo.curCard.stepNumber == 1 ? "hidden" : "scroll"}
			overflowX={"hidden"}
			bgColor={"gray.1200"} // Fixed a bug where there was a white space on the bottom of the screen on mobile (iPhone 14 Pro Max)
		>
			<HStack w="100%" h="100%" align="top">
				<VStack w="100%" flexGrow={1} height="100%">
					<Flex w="100%" direction={"column"} h={"100px"} pb={isMobile ? "0px" : "120px"}>
						<NavBar />
					</Flex>
					<HStack
						w="100%"
						alignItems="flex-start"
						flexDirection={"row-reverse"}
						justifyContent={currentInfo.curCard.stepNumber === 1 ? "center" : "space-evenly"}
						mt={"10px"}
					>
						{/* Don't show card on side if on step 1 */}
						{currentInfo.curCard.stepNumber !== 1 &&
						<Box transform={isMobile ? `scale(${ screenScaleFactor.toString() })` : ""} transformOrigin={"top center"}>
							<OnFireCard cardFrontRef={cardFrontRef} cardBackRef={cardBackRef} mobileFlipButton={isMobile} showButton={!isMobile}/>
						</Box>
						}
						{isMobile && currentInfo.curCard.stepNumber !== 1 ?
							<MobileStepWrapper
								hProp="224px"
								wProp="100%"
								entireCardRef={cardFrontRef}
								cardBackRef={cardBackRef}
								currentInfo={currentInfo}
							/> :
							<Flex w={{ base: undefined, lg: "45vw" }} alignSelf="stretch">
								<StepWrapper
									numSteps={5}
									cardCreationSteps={CardCreationSteps}
									entireCardRef={cardFrontRef}
									cardBackRef={cardBackRef}
								/>
							</Flex>
						}
					</HStack>
				</VStack>
				<Box h={{ base: "0vh", md:"100vh" }} display={{ base: "none", sm: "none", md: "inherit" }}>
					<Sidebar height={"auto"} backgroundPresent={false} />
				</Box>
			</HStack>
		</Box>
	);
}
