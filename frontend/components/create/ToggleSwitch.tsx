"use client";

/* eslint-disable func-style */
import { HStack, Text, Box } from "@chakra-ui/react";
import { useState } from "react";

// eslint-disable-next-line require-jsdoc
export default function NewToggleSwitch() {

	const [ shifted, setShifted ] = useState(false);

	const handleButtonClick = () => {
		setShifted((prevShifted) => {
			return !prevShifted;
		});
	};

	return (
		<>
			{/* Container */}
			<Box
				height={"36px"}
				width={"100%"}
				borderRadius={18}
				border={"1px solid white"}
				backgroundColor={"gray.400"}
				onClick={handleButtonClick}
			>
				{/* Text options */}
				<HStack
					height={"100%"}
					fontSize={15}
					fontWeight="bold"
					color="white"
					fontFamily={"Roboto"}
					textAlign={"center"}
					justifyContent={"space-between"}
					paddingRight={"10%"}
					paddingLeft={"10%"}
					gap={"0"}
				>
					<Text color={shifted ? "gray.900" : "white"}
						transition={"color 0.3s ease-in-out"}
						width={"50%"} textAlign={"center"}
						zIndex={2} flexGrow={1}>ON</Text>
					<Text color={shifted ? "white" : "gray.900"}
						transition={"color 0.3s ease-in-out"}
						width={"50%"} textAlign={"center"}
						zIndex={2} flexGrow={1}>OFF</Text>
				</HStack>

				{/* Slider */}
				<Box
					zIndex={1}
					position={"relative"}
					width={"60%"}
					height={"100%"}
					borderRadius={18}
					backgroundColor={"green.100"}
					border={"1px solid white"}
					bottom={"100%"}
					left={shifted ? "40%" : "0%"}
					transition="left 0.3s ease-in-out"
					// _after={{ transform: "translateX(100%)" }}
				/>
			</Box>
		</>
	);

}
