"use client";

import { VStack, Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import { useState } from "react";
import NavBar from "../navbar";
import Sidebar from "@/components/sidebar";
import LoginHeader from "../components/loginHeader";
import WeSentYouACode from "@/components/reset/weSentYouACode";
import ResetYourPassword from "@/components/reset/resetYourPassword";

/**
 * Reset Password component for user registration
 * @returns JSX.Element
 */
export default function Reset() {

	const [ email, setEmail ] = useState("");
	const [ showCode, setShowCode ] = useState(false);

	const showSidebar = useBreakpointValue({ base: false, lg: true });

	return (
		<>
			<Flex
				w="100%"
				h="100vh"
				justify="flex-start"
				direction="row-reverse"
				bgImage="darkpaper.png"
				bgColor="#000000DD"
				bgPosition="center"
				bgRepeat="no-repeat"
				bgSize="cover"
			>
				{showSidebar ? <Sidebar height="100vh" /> : null}
				<Box w="100%">
					<NavBar />
					<LoginHeader title={"ReseT Password"} subtitle={`Enter your ${!showCode ? "email" : "code"} to reset your password`} />
					<Flex w="100%" direction={"column"}>
						<Flex w="100%" justifyContent={"center"}>
							<VStack
								w={{ base: "85%", md: "40%" }}
								backgroundColor={"gray.1000" }
								borderRadius={13}
								padding={{ base: "5%", md: "3%" }}
								style={{ filter: "drop-shadow(0px 3px 16px #000000C7)" }}
							>
								{/* If the user has not entered the code yet, show the reset password form */}
								{/* Otherwise, show the code input form */}
								{!showCode ? (
									<ResetYourPassword
										setShowCode={setShowCode}
										email={email}
										setEmail={setEmail}
									/>
								) : (
									<WeSentYouACode
										email={email}
									/>
								)}
							</VStack>
						</Flex>
					</Flex>
				</Box>
			</Flex>
		</>
	);
}
