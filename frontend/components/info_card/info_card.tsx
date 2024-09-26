import { Flex, Heading } from "@chakra-ui/react";
import InfoSection, { InfoSectionProps } from "./info_section";

type InfoSectionAttributes = InfoSectionProps;

interface InfoCardProps {
    infoSections: InfoSectionAttributes[];
}

/**
 * Renders an info card component that has two elements.
 * @param {InfoCardProps} props - The props for the info card.
 * @returns {JSX.Element} The rendered info card.
 */
export default function InfoCard(props: InfoCardProps) {

	return (
		<>
			<Flex
				bg="#27CE00"
				borderRadius={6}
				width={"auto"}
				height={{ base: "auto", md: "100%", lg: "100%" }}
				flexDirection={"column"}
				gap={"25px"}
				justifyContent={"center"}
				alignItems={"center"}
				padding={"25px"}
			>
				{/* Title */}
				<Heading
					// The slightest amount of boldness
					style={{
						WebkitTextStrokeWidth: "0.4pt",
						WebkitTextStrokeColor: "white",
					}}
					fontSize={{ base: "lg", sm: "xl", lg: "xl", xl: "2xl" }}
					fontWeight={"600"}
					letterSpacing={"1.5px"}
					textColor="white"
				>
					HOW ONFIRE ATHLETES WORKS:
				</Heading>
				<Flex
					flexDirection={{ base: "column", md: "row" }}
					gap="25px"
					justifyContent={"flex-start"}
					alignItems={"center"}
				>
					<InfoSection
						description={props.infoSections[0].description}
						buttonTitle={props.infoSections[0].buttonTitle}
						buttonLink={props.infoSections[0].buttonLink}
					/>
				</Flex>
			</Flex>
		</>
	);
}
