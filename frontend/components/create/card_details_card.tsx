import { Box, Button, Divider, Heading, HStack, Spacer, Text, VStack } from "@chakra-ui/react";

interface DetailsCardProps {
	price: string;
	cardsSold: string;
	yearCreated: string;
	discription: string;
}

/**
 * Details card component
 * @returns details card
 */
export default function DetailsCard({ price, cardsSold, yearCreated, discription }: DetailsCardProps) {
	return (
		<Box
			backgroundColor={"#364B47"}
			bgGradient={"linear(to-b, #313634, #46534e)"}
			backdropBlur={30}
			h={{ base: "85%", md: "100%" }}
			w={"100%"}
			maxWidth={900}>
			<VStack
				width={"100%"}
				height={"100%"}
				paddingRight={{ base: 6, md: 12 }}
				paddingLeft={{ base: 6, md: 16 }}
				paddingBottom={{ base: 6, md: 12 }}
				alignItems={"left"}>

				{/* Title */}
				<HStack
					display={"flex"}
					flexDirection={{ base:"column", md: "row" }}
					height={"100%"}
					width={"100%"}
					justifyContent={"space-between"}
					alignItems={"center"}
					paddingY={4}>
					<VStack width={{ base:"100%", md:"50%" }} >
						<Heading alignSelf={"start"}
							fontStyle={"italic"}
							textTransform={"uppercase"}
							fontSize={"x-large"}
							color={"green.100"}>
							Card Details
						</Heading>
						<Text fontSize={"16px"} fontFamily={"Roboto"} color={"white"}>
							{discription}
						</Text>
						<Spacer/>
					</VStack>

					{/* Content */}
					<VStack letterSpacing={"0.05em"} fontWeight={"medium"} fontFamily={"Barlow"} height={"100%"} width={{ base:"100%", md:"50%" }}>
						{/* Step content */}
						<HStack paddingY={"2%"} width={"100%"} justifyContent={"space-between"} alignItems={"center"}>
							<Heading fontSize={{ base:"14px", md: "15px" }} color={"white"}>Price</Heading>
							<Spacer/>
							<Box alignItems={"center"}
								backgroundColor={"#17201E"}
								height={"35px"}
								w={"100%"}
								maxW={"190px"}>
								<Heading fontSize={{ base:"14px", md: "15px" }} paddingLeft={"8px"} paddingTop={"8px"} color={"white"} >{price}</Heading>
							</Box>
						</HStack>

						<HStack width={"100%"} justifyContent={"space-between"} alignItems={"center"} >
							<Heading fontSize={{ base:"14px", md: "15px" }} color={"white"}>Cards Sold</Heading>
							<Spacer/>
							<Box alignItems={"center"}
								backgroundColor={"#17201E"}
								height={"35px"}
								w={"100%"}
								maxW={"190px"}>
								<Heading fontSize={{ base:"14px", md: "15px" }}
									paddingLeft={"8px"}
									paddingTop={"8px"}
									color={"white"} >{cardsSold}</Heading>
							</Box>
						</HStack>

						<HStack width={"100%"} justifyContent={"space-between"} alignItems={"center"} >
							<Heading fontSize={{ base:"14px", md: "15px" }} color={"white"}>Year Created</Heading>
							<Spacer/>
							<Box alignItems={"center"}
								backgroundColor={"#17201E"}
								height={"35px"}
								w={"100%"}
								maxW={"190px"}>
								<Heading fontSize={{ base:"14px", md: "15px" }} paddingLeft={"8px"} paddingTop={"8px"} color={"white"} >{yearCreated}</Heading>
							</Box>
						</HStack>
					</VStack>
				</HStack>

				<Spacer />

				{/* Bottom controls */}
				<Divider marginBottom={"5%"} marginTop={{ base: "1%", md: "6%" }} borderColor={"green.100"} borderRadius={20} borderWidth={"2px"} />
				{/* add button */}
				<HStack>
					<Spacer/>
					<Button fontFamily={"Roboto"}
						fontSize={"12px"}
						textTransform={"uppercase"}
						letterSpacing={"0.2em"}
						color={"white"}
						borderRadius={"24px"}
						backgroundColor={"#27ce00"}>
						add to your collection
					</Button>
				</HStack>

			</VStack>
		</Box>
	);
}
