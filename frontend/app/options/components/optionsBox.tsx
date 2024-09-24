import { Box, Heading, Flex, Divider, useBreakpointValue } from "@chakra-ui/react";
import PackageOption from "./packageOption";
import digTitle from "@/public/options/digTitle.png";
import digPhysTitle from "@/public/options/digPhysTitle.png";
import digImage from "@/public/options/digImage.png";
import demarioa from "@/public/step_one_template_cards/demario_a.png";
import demariob from "@/public/step_one_template_cards/demario_b.png";

/**
 * Options box component
 * @returns
 */
export default function OptionsBox() {
	const screenTooSmall = useBreakpointValue({ base: true, lg: false });

	return (
		<>
			<Box bg="#171C1B" color="white" p={8} borderRadius={"13px"} mx={"2%"} px={"4%"} >
				<Heading as="h1" style={{ transform: "skew(-10deg)" }} fontSize={"37px"} fontFamily={"Barlow Semi Condensed"}>
        PURCHASING OPTIONS
				</Heading>

				<Divider borderWidth={1} my={"20px"} w={"100%"}/>
				<Flex h={"100%"} w={"100%"} flexDirection={{ base: "column", sm: "column", md: "row" }} gap={6}>
					<PackageOption
						title="ROOKIE"
						packageName={"DIGITAL PACKAGE"}
						packageNameSrc={digTitle}
						packageImageSrc={digImage}
						price={14.99}
						features={[
							"Create Custom Card",
							"15 Digital Cards",
							"Trade Cards",
							"Collect Cards",
							"Profile",
						]}
						addOnPrice={2.99}
						addOnText="Add 5 Digital Cards"
					/>
					{screenTooSmall ? <></> : <Divider mt={"15px"} orientation="vertical" borderRadius={"full"} borderWidth={1} minH={"600px"} />}
					<PackageOption
						title="ALL STAR"
						packageName={"DIGITAL + PHYSICAL PACKAGE"}
						packageNameSrc={digPhysTitle}
						packageImageSrc={demarioa}
						secondPackageImageSrc={demariob}
						price={34.99}
						features={[
							"Create Custom Card",
							"25 Digital Cards",
							"1 Physical A/R Card",
							"Sell Cards - Athlete Receives 80%",
							"Trade Cards",
							"Collect Cards",
							"Profile",
						]}
						addOnPrice={1.99}
						addOnText="Add 5 Digital Cards"
						secondAddOnPrice={6.99}
						secondAddOnText="Add 1 Physical A/R Card"
					/>
				</Flex>
			</Box>
		</>
	);
}
