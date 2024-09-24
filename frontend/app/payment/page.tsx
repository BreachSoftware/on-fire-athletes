
"use client";

import {
	VStack,
	Box,
	Heading,
	Flex,
	Center,
	useBreakpointValue,
	Text,
	Tabs,
	Tab,
	TabPanel,
	TabPanels,
	TabList,
} from "@chakra-ui/react";
import NavBar from "../navbar";
import Sidebar from "@/components/sidebar";
import Payment from "./components/Payment";

/**
 * The Stripe Payment Page
 * @returns JSX.Element
 */
export default function PaymentPage() {

	const showSidebar = useBreakpointValue({ base: false, lg: true });

	return (
		<>

			{/* Items around main content */}
			<Flex w="100%" h="100%" minH={"100vh"} justify="flex-start" direction="row-reverse">

				<Flex
					direction="column"
					position="absolute"
					top="0"
					left="0"
					zIndex={-10}
					h="100%"
					w="100%"
				>
					{/* Background Image #1 */}
					<Flex
						bgImage="keith-johnston-card-array.png"
						bgPosition="center"
						bgRepeat="no-repeat"
						bgSize="cover"
						h="100%"
						w="100%"
					>
						<Flex
							bgGradient={"linear(180deg, rgba(0, 0, 0, 0.9) 0%, rgba(49, 69, 61, 0.9) 100%) 0% 0% no-repeat padding-box;"}
							h="100%"
							w="100%"
						/>
					</Flex>
				</Flex>

				{showSidebar ? <Sidebar height="100vh" backgroundPresent={false} /> : null}
				<Box w="100%">
					<NavBar />

					{/* Page content */}
					<VStack	spacing={50}>

						{/* Header */}
						<VStack
							paddingTop={useBreakpointValue({ base: "3vh", sm: "5vh" })}
						>
							<Heading
								fontFamily={"Barlow Semi Condensed"}
								lineHeight={0.1}
								fontWeight={"bold"}
								textTransform={"uppercase"}
								color={"green.100"}
							>
								Get in the Game
							</Heading>
							<Heading
								color={"white"}
								fontSize={useBreakpointValue({ base: "40px", md: "60px" })}
								fontFamily={"'Brotherhood', sans-serif"}
								fontWeight={"normal"}
								textAlign={"center"}
							>
								Choose Your Way to Pay
							</Heading>
						</VStack>

						{/* Pricing Options */}
						<Flex
							gap={6}
							w={useBreakpointValue({ base: "80%", md: "50%" })}
							height={"100%"}
							wrap={"wrap"}
						>

							<Tabs w={"100%"} variant="soft-rounded" colorScheme="green">
								<TabList justifyContent={"center"} gap={10} mb={"50px"}>
									<Tab
										color="white"
										border="3px solid #27CE00"
										borderRadius="24px"
										transitionDuration="0.2s"
										_selected={{
											backgroundColor: "green.100"
										}}
										_hover={{
											bgColor: "#CCC",
											border: "3px solid #CCC",
											cursor: "pointer",
											color: "black",
										}}
									>
										Credit Card
									</Tab>
									<Tab
										color="white"
										border="3px solid #27CE00"
										borderRadius="24px"
										transitionDuration="0.2s"
										_selected={{
											backgroundColor: "green.100"
										}}
										_hover={{
											bgColor: "#CCC",
											border: "3px solid #CCC",
											cursor: "pointer",
											color: "black",
										}}
									>
										GameCoin
									</Tab>
								</TabList>
								<TabPanels>
									<TabPanel>
										<Payment/>
									</TabPanel>
									<TabPanel>
										<Center>
											<Text>Coming Soon!</Text>
										</Center>
									</TabPanel>
								</TabPanels>
							</Tabs>
						</Flex>
					</VStack>
				</Box>
			</Flex>
		</>
	);
}
