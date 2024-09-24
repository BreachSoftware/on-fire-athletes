"use client";

import BuiltForAthletes from "@/components/built_for_athletes";
import { Flex } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import Navbar from "@/app/navbar";
import Sidebar from "@/components/sidebar";
import Footer from "./components/footer";
import TrendingNow from "@/components/trending_now/TrendingNow";
import CaptureCreateCustomize from "@/app/components/CaptureCreateCustomize";
import "@fontsource/water-brush";
import "@fontsource/barlow";
import MobileFrontWrapper from "./components/mobile-front-wrapper";
import { BackToCheckoutModal } from "./components/BackToCheckoutModal";
import InTheNews from "@/components/in_the_news";
import LightItUp from "@/components/light_it_up/light_it_up";
import SideBarHamburger from "@/components/sidebarHamburger";

/**
 * Renders the home screen.
 * @returns {JSX.Element} The rendered home screen.
 */
export default function Index() {
	// Data for the "In The News" section. This array would typically come from props or be fetched from an API

	/* Array of news items, each item would have an id, imageUrl, headline, and description */
	const inTheNewsData = [
		{
			id: 1,
			imageUrl: "in_the_news/news1.jpeg",
			headline: "Headline Here",
			description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
		},
		{
			id: 2,
			imageUrl: "in_the_news/news2.jpeg",
			headline: "Headline Here",
			description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
		},
		{
			id: 3,
			imageUrl: "in_the_news/news3.jpeg",
			headline: "Headline Here",
			description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
		},
		// ...other news items
	];

	return (
		<Flex flexDir="column">
			<BackToCheckoutModal />
			<MobileFrontWrapper />
			<SideBarHamburger />
			<Flex position="absolute" w="full" h="100vh">
				<Box
					as="video"
					src="HomepageBackgroundVideo.mp4"
					loop={false}
					muted={true}
					controls={false}
					autoPlay={true}
					playsInline={true}
					minW="full"
					minH="100vh"
					objectFit="cover"
					position="fixed"
					zIndex={-50}
				/>
			</Flex>
			<Flex flexDirection={"row"} w="100%" position="relative">
				{/* Uses 100dvw to better calculate widths in mobile browsers */}
				<Flex flexDir="column" h="100dvh" position="relative" w={{ base: "100dvw", lg: "calc(100dvw - 140px)" }}>
					<Flex
						w="100%"
						position="relative"
						minH="100dvh"
						direction="column"
						bgGradient={{
							base: "none",
							md: "linear(to-r, #000, #00000000)",
						}}>
						<Navbar />
						<CaptureCreateCustomize />
					</Flex>
					<Flex w="full">
						<BuiltForAthletes />
					</Flex>
					<Box>
						<LightItUp />
					</Box>
					<Box>
						<InTheNews showBackground title="In The News" data={inTheNewsData} />
					</Box>
					<TrendingNow />
					<Footer />
				</Flex>
				<Flex display={{ base: "none", lg: "flex" }} w={"140px"} position="fixed" top="0" right="0" h="100dvh">
					<Sidebar height={"auto"} />
				</Flex>
			</Flex>
		</Flex>
	);
}
