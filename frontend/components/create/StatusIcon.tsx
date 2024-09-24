
import { Box } from "@chakra-ui/react";
import { FaXmark, FaCheck } from "react-icons/fa6";

interface StatusIconProps {
	isCheck: boolean;
	isGlowing: boolean;
	iconSize?: number;
	isActive?: boolean;
}

/**
 * This function returns the JS element for the icon button.
 * @param isCheck If the icon button is a checkmark or X mark
 * @param iconSize The size of the icon
 * @param isGlowing If the icon button is glowing
 * @param isActive If the icon button is active in the filter
 * @returns the JS element for the icon button
 */
export default function StatusIcon(props: StatusIconProps) {

	return (
		<>
			{props.isActive ? (
				props.isCheck ? (
					// Green Checkmark icon
					<Box
						border={"1px solid"}
						borderColor={"green.100"}
						backgroundColor={"green.100"}
						borderRadius={"full"}
						boxShadow={props.isGlowing ? "0 0 10px 2px rgba(0, 255, 0, 0.5)" : ""}
						alignItems={"center"}
						justifyContent={"center"}
						padding={1}
					>
						<FaCheck color="white" size={props.iconSize ? props.iconSize : 12} />
					</Box>
				) : (
					// Red X mark icon
					<Box
						border={"1px solid"}
						borderColor={"red.100"}
						backgroundColor={"red.100"}
						borderRadius={"full"}
						boxShadow={props.isGlowing ? "0 0 10px 2px rgba(255, 0, 0, 0.5)" : ""}
						alignItems={"center"}
						justifyContent={"center"}
						padding={1}
					>
						<FaXmark color="white" size={props.iconSize ? props.iconSize : 12} />
					</Box>
				)
			) : (
				// Green outline icon (inactive filter variant)
				<Box
					border={"1px solid"}
					borderColor={"#167400"}
					borderRadius={"full"}
					alignItems={"center"}
					justifyContent={"center"}
					padding={1}
				>
					<FaCheck color="transparent" size={props.iconSize ? props.iconSize : 12} />
				</Box>
			)}
		</>
	);

}
