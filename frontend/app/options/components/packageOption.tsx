import { Box, VStack, Heading, Text, Button, List, ListItem, ListIcon, Flex, Divider, HStack, Spacer, useBreakpointValue } from "@chakra-ui/react";
import { CheckIcon, ChevronRightIcon } from "@chakra-ui/icons";
import Image, { StaticImageData } from "next/image";
import { useState } from "react";
import CardDropShadow from "@/components/create/CardDropShadow";

interface PackageOptionProps {
  title: string;
  packageName: string;
  packageNameSrc: StaticImageData;
  packageImageSrc: StaticImageData;
  secondPackageImageSrc?: StaticImageData;
  price: number;
  features: string[];
  addOnPrice: number;
  addOnText: string;
  secondAddOnPrice?: number;
  secondAddOnText?: string;
}

/**
 * Package option component
 * @param PackageOptionProps
 * @returns Package option component
 */
export default function PackageOption({
	title,
	packageName,
	packageNameSrc,
	packageImageSrc,
	secondPackageImageSrc,
	price,
	features,
	addOnPrice,
	addOnText,
	secondAddOnPrice,
	secondAddOnText,
}: PackageOptionProps) {

	const [ arrowAnimation, setArrowAnimation ] = useState("");

	const [ digCardAnimation, setDigCardAnimation ] = useState("");

	const [ digPhysLeftAnimation, setDigPhysLeftAnimation ] = useState("rotate(-15deg)");
	const [ digPhysRightAnimation, setDigPhysRightAnimation ] = useState("rotate(15deg) translateX(-60px) translateY(-20px)");
	const [ dropShadowAnimation, setDropShadowAnimation ] = useState("");

	const DigTitleHeight = useBreakpointValue({ base: 40, sm: 45, md: 50, lg: 55 });
	const DigPhysTitleHeight = useBreakpointValue({ base: 60, sm: 70, md: 80, lg: 90 });

	const DigImageHeight = useBreakpointValue({ base: 250, sm: 280, md: 320, lg: 350 });
	const DigPhysImageHeight = useBreakpointValue({ base: 150, sm: 170, md: 250, lg: 260, xl: 270 });

	return (
		<>
			<Box
				width={{ base: "100%", sm: "100%", md: packageName === "DIGITAL PACKAGE" ? "35%" : "65%" }}
				pb={6} pl={6} pr={6}
			>
				<VStack gap={0} alignItems={"start"} justifyContent={"left"}>
					<Heading size="lg" fontFamily={"Brotherhood"}>{title}</Heading>
					<Flex
						mt={ packageName === "DIGITAL PACKAGE" ? -5 : -9 }
						paddingTop={{ base: "30px", sm: "50px", md: "15px", lg: "10px" }}
						alignItems={"center"}
						flexDirection={{ base: "column", sm: "column", md:"column", lg: "column", xl: "row" }}
						w={"100%"}
						h={"100%"}>
						<Image
							style={{
								marginLeft: "-15px",
							}}
							src={packageNameSrc}
							alt={packageName}
							height={packageName === "DIGITAL PACKAGE" ? DigTitleHeight : DigPhysTitleHeight }/>
						<HStack>
							<VStack w={"auto"}>
								<Heading as="h4" size="xl" pl={"10px"}>${price.toFixed(2)}</Heading>
								<Divider ml={"10%"} borderColor={"green.200"} borderWidth={"2px"} borderRadius={"full"}/>
							</VStack>
							{packageName === "DIGITAL PACKAGE" ? <></> :
								<Text fontFamily={"Barlow Condensed"} fontSize={"14px"} mb={"2%"}>+ S/H</Text>
							}
						</HStack>
					</Flex>
					<Flex
						flexDirection={{ base: "column-reverse", sm: "column-reverse", md: "column-reverse", lg: "row" }}
						alignItems={{ base: "center", md: "start" }}
						w={"100%"}
						h={"100%"}>
						<VStack alignItems={"left"} w={{ base: "100%", sm: packageName === "DIGITAL PACKAGE" ? "45%" : "35%" }} h={"100%"}>
							<List
								spacing={1}
								w={"100%"}
								h={"100%"}
								fontSize={{ base: "lg", sm: "xl", md: "25px" }}
								fontFamily={"Barlow Condensed"} >
								{features.map((feature, index) => {
									return (
										<ListItem key={index}>
											<ListIcon as={CheckIcon} color="white" backgroundColor="green.200" borderRadius="full" mb={1} p={1} boxSize={4} />
											{feature}
										</ListItem>
									);
								})}
							</List>
							<VStack spacing={"2px"} alignItems={"left"} w={"100%"} h={"100%"}>
								<HStack fontStyle={"italic"} fontSize={"lg"} fontFamily={"Barlow Condensed"} >
									<Text>*{addOnText}</Text>
									<Text color={"green.200"}>${addOnPrice.toFixed(2)}</Text>
								</HStack>
								{secondAddOnPrice && secondAddOnText && (
									<HStack fontStyle={"italic"} fontSize={"lg"} fontFamily={"Barlow Condensed"} >
										<Text>*{secondAddOnText} </Text>
										<Text color={"green.200"}>${secondAddOnPrice.toFixed(2)}</Text>
									</HStack>
								)}
								<Text transform={"skewX(-6deg)"} fontSize="xs">*No limit</Text>
							</VStack>
							<Spacer/>
							<Button
								backgroundColor="green.200"
								w={"138px"}
								h={"43px"}
								fontSize={"sm"}
								letterSpacing={"1.5px"}
								fontWeight={"1px"}
								textAlign={"center"}
								pr={"2px"}
								mt={"4px"}
								rightIcon={
									<ChevronRightIcon
										transition={"ease-out 0.3s"}
										animation={"auto"}
										transform={arrowAnimation}
										boxSize={9}
										fontWeight={"2px"} />
								}
								onMouseEnter={() => {
									setArrowAnimation("translateX(5px)");
								}}
								onMouseLeave={() => {
									setArrowAnimation("translateX(0px)");
								}}
								_hover={{
									md: {
										backgroundColor: "green.300",
										fontStyle: "italic",
									}
								}}
							>
								BUY NOW
							</Button>
						</VStack>
						<Spacer/>
						{packageName === "DIGITAL PACKAGE" ?
							<VStack>
								<Image
									style={
										{
											marginTop: "10px",
											marginLeft:  "0px",
											transition: "0.3s ease-out",
											transformOrigin: "left center",
											transform: digCardAnimation,
										}
									}
									onMouseEnter={() => {
										setDigCardAnimation("scale(1.09)");
									}}
									onMouseLeave={() => {
										setDigCardAnimation("scale(1)");
									}}
									src={packageImageSrc}
									alt={packageName}
									height={DigImageHeight} />
								<Box alignSelf="center" ml={"40px"} w={"60%"}>
									<CardDropShadow	opacity={0.7}/>
								</Box>
							</VStack> :
							<Flex alignItems={"center"} flexDirection={"column"} w={"60%"} h={"100%"}>
								<HStack
									mt={"8%"}
									h={"100%"}
									onMouseEnter={() => {
										setDigPhysLeftAnimation("rotate(-15deg) translateX(-5px) translateY(-15px) ");
										setDigPhysRightAnimation("rotate(15deg) translateX(-50px) translateY(-50px)");
										setDropShadowAnimation("translateY(30px)");
									}}
									onMouseLeave={() => {
										setDigPhysLeftAnimation("rotate(-15deg)");
										setDigPhysRightAnimation("rotate(15deg) translateX(-60px) translateY(-20px)");
										setDropShadowAnimation("");
									}}>
									<Image
										style={
											{
												marginTop: "30px",
												marginLeft: "10px",
												transition: "0.3s ease-out",
												transform: digPhysLeftAnimation,
												zIndex: 2,
											}
										}
										src={packageImageSrc}
										alt={packageName}
										height={DigPhysImageHeight} />
									<Image
										style={
											{
												marginTop: "30px",
												marginLeft: "10px",
												transition: "0.3s ease-out",
												transform: digPhysRightAnimation,
												zIndex: 1,
											}
										}
										src={secondPackageImageSrc ? secondPackageImageSrc : packageImageSrc}
										alt={packageName}
										height={DigPhysImageHeight} />
								</HStack>
								<Box transition={"0.3s ease-out"} transform={dropShadowAnimation} alignSelf="center" paddingTop="30px" w={"55%"}>
									<CardDropShadow	opacity={0.7}/>
								</Box>
							</Flex>
						}
						<Spacer/>
						<Spacer/>
					</Flex>
				</VStack>
			</Box>
		</>
	);
};
