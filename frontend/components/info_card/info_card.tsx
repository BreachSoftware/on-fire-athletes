// eslint-disable-next-line no-use-before-define
import React from "react";
import { Flex, Heading } from "@chakra-ui/react";

interface InfoCardProps {
    infoSections: {
		description: React.ReactNode;
	}[];
}

/**
 * Renders an info card component that has two elements.
 * @param {InfoCardProps} props - The props for the info card.
 * @returns {JSX.Element} The rendered info card.
 */
export default function InfoCard(props: InfoCardProps) {

	return (
		<Flex
			bg="#27CE00"
			borderRadius={6}
			width={"100%"}
			height={{ base: "auto", md: "100%", lg: "auto" }}
			flexDirection={"column"}
			alignItems={"center"}
			px={{ base: "20px", md: "30px" }}
			py={{ base: "30px", md: "36px" }}
			mb={4}
		>
			{/* Title */}
			<Heading
				// The slightest amount of boldness
				style={{
					WebkitTextStrokeWidth: "0.4pt",
					WebkitTextStrokeColor: "white",
				}}
				fontSize={{ base: "24px", md: "30px" }}
				fontWeight={"500"}
				letterSpacing={"1.2px"}
				textColor="white"
				whiteSpace="nowrap"
				mb="15px"
			>
					HOW ONFIRE ATHLETES WORKS:
			</Heading>
			<Flex
				flexDirection={{ base: "column", md: "row" }}
				gap="25px"
				justifyContent={"flex-start"}
				alignItems={"center"}
				width={"100%"}
				mb="4px"
			>
				{
					props.infoSections.map((infoSection, index) => {
						return (
							<Flex
								key={index}
								direction="column"
								margin={"15px 0px"}
								padding={"0px 5px"}
								justifyContent={"space-between"}
								width={"100%"}
							>
								{infoSection.description}
							</Flex>
						);
					})}
			</Flex>
		</Flex>
	);
}
