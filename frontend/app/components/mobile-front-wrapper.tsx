"use client";

import { ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Flex, Button, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BeatLoader } from "react-spinners";

/**
 * MobileFrontWrapper
 * Container for the mobile action buttons on the homepage
 * @returns {JSX.Element} An overlay wrapper for the home page.
 */
export default function MobileFrontWrapper() {
	const router = useRouter();
	const [ createButtonLoading, setCreateButtonLoading ] = useState(false);
	const [ collectButtonLoading, setCollectButtonLoading ] = useState(false);

	return (
		<Box position="fixed" display={{ base: "inline", md: "none" }} bottom={0} left={0} right={0} zIndex={10} h="fit-content">
			<Flex
				direction="row"
				w="full"
				pt="64px"
				pb="32px"
				px="40px"
				justifyContent="space-between"
				bgGradient="linear(to-b, #00000000 5%, #00000060, #000000b9, #000 90%)"
				gridGap="20px">
				<Button
					variant="captureYourMomentMobile"
					w="full"
					h="52px"
					rounded="full"
					pl="26px"
					fontWeight="semibold"
					boxShadow="0 0 32px green"
					isLoading={createButtonLoading}
					spinner={<BeatLoader color="white" size={8} />}
					onClick={() => {
						router.push("/create");
						setCreateButtonLoading(true);
					}}
					pointerEvents={"auto"}>
					<Text fontSize="14px">CREATE</Text>
					<ChevronRightIcon boxSize={6} />
				</Button>
				<Button
					variant="captureYourMomentMobile"
					w="full"
					h="52px"
					rounded="full"
					pl="26px"
					fontWeight="semibold"
					boxShadow="0 0 32px green"
					isLoading={collectButtonLoading}
					spinner={<BeatLoader color="white" size={8} />}
					onClick={() => {
						router.push("/lockerroom");
						setCollectButtonLoading(true);
					}}
					pointerEvents={"auto"}>
					<Text fontSize="14px">COLLECT</Text>
					<ChevronRightIcon boxSize={6} />
				</Button>
			</Flex>
		</Box>
	);
}
