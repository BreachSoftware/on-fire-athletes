"use client";

import { useRouter } from "next/navigation";
import { Box, Flex } from "@chakra-ui/layout";
import { Button, ButtonProps } from "@chakra-ui/button";
import ChevronRightIcon from "@/components/icons/chevron-right";

interface Props extends ButtonProps {
	link: string;
}

/**
 *  LightItUpCTAButton
 * Shared button component for the Light It Up section to standardize styling and make it easier to refactor.
 * @returns {JSX.Element} Light It Up Card CTA Button.
 */
export default function LightItUpCTAButton({ children, link, ...rest }: Props) {
	const router = useRouter();

	return (
		<Box role="group">
			<Button
				w={{ base: "233px", md: "196px", xl: "233px" }}
				h="44px"
				bg="green.600"
				variant={"infoButton"}
				_groupHover={{
					md: {
						opacity: 0.8,
						boxShadow: "0 0 5px rgba(0,0,0,0.3)",
						fontStyle: "italic",
					},
				}}
				fontSize={{ base: "14px", md: "12px", xl: "14px" }}
				justifyContent="space-between"
				px="18px"
				transition="padding 0.3s ease-out, box-shadow 0.3s ease-out, background 0.3s ease-out"
				letterSpacing="1.5px"
				onClick={() => {
					router.push(link);
				}}
				role="group"
				{...rest}>
				<Flex alignItems="center" w="full" justifyContent="center">
					{children}
					<Box
						maxW="48px"
						w="full"
						_groupHover={{
							maxW: "12px",
						}}
						transition="max-width 0.2s ease-out"
					/>
					<ChevronRightIcon />
				</Flex>
			</Button>
		</Box>
	);
}
