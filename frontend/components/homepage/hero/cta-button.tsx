import { Box } from "@chakra-ui/layout";
import { Button, ButtonProps } from "@chakra-ui/button";
import ChevronRightIcon from "@/components/icons/chevron-right";
import { BeatLoader } from "react-spinners";

/**
 * HeroCTAButton
 * Shared component for the homepage CTA buttons to better standardize styling and make it easier to refactor.
 * @returns {JSX.Element} Homepage Hero Call to Action Button
 */
export default function HeroCTAButton({ children, ...rest }: ButtonProps) {
	return (
		<Box w="313px" h="60px" role="group" cursor="pointer">
			{/* Wrap the button in a group with set width so that the hover animation doesn't glitch while the button width changes */}
			<Button
				variant="infoButton"
				_groupHover={{
					opacity: 0.8,
					fontStyle: "italic",
					fontWeight: "bold",
					maxW: "272px",
				}}
				h="60px"
				w="full"
				maxW="313px"
				pl="30px"
				transition="max-width 0.3s ease-out, opacity 0.3s ease-out"
				letterSpacing="1.5px"
				boxShadow="0 0 100px green"
				bg="green.600"
				color="white"
				borderRadius="30px"
				textTransform="uppercase"
				fontSize="sm"
				justifyContent="space-between"
				rightIcon={<ChevronRightIcon boxSize={6} />}
				spinner={<BeatLoader color="white" size={8} />}
				{...rest}>
				{children}
			</Button>
		</Box>
	);
}
