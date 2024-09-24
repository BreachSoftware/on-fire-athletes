"use client";

import { Flex, Box, Heading } from "@chakra-ui/react";
import NavBar from "../navbar";
import Footer from "../components/footer";
import Sidebar from "@/components/sidebar";
import ContactForm from "./contactForm";

/**
 * Contact page component.
 * @returns {JSX.Element} The Contact page component.
 */
export default function Contact() {
	return (
		<>
			{/* Main content layout */}
			<Flex
				w="100vw"
				minH="100dvh"
				justify="flex-start"
				direction="row-reverse"
				bgImage="darkpaper.png"
				bgPosition="center"
				bgRepeat="no-repeat"
				bgSize="cover"
			>
				<Box display={{ base: "none", lg: "inline" }}><Sidebar height="100vh" /></Box>
				<Box flex={1} paddingBottom={{ base: 8, md: 16 }}>
					<NavBar />
					<Flex
						px={{ base: "24px", md: "72px" }}
						marginTop={{ base: 4, md: 16 }}
						flexDir={{ base: "column", sm: "column", lg: "row" }}
						justifyContent="space-between"
						width="100%"
						gridGap={{ base: 2, sm: 2, md: "124px" }}
					>
						<Heading
							fontFamily={"Brotherhood"}
							fontSize={{ base: "54px", md: "76px" }}
							textAlign={"center"}
							color={"white"}
							letterSpacing={"3.8px"}
							fontWeight={"regular"}
							lineHeight={"1"}
							mb={{ base: 4, md: 0 }}
						>
							{"Contact"}
						</Heading>
						<ContactForm />
					</Flex>
				</Box>
			</Flex>
			{/* <Flex bgImage="crinkled-paper.png" bgPos="center" > */}
			<Footer />
			{/* </Flex> */}
		</>
	);
}
