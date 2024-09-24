import { Box, Center, CenterProps } from "@chakra-ui/react";

interface Props extends CenterProps {
	isSelected: boolean;
	setSelected: (isSelected: boolean) => void;
}

/**
 * The radio button component
 * @param isSelected - whether the radio button is selected
 * @param setSelected - the function to call when the radio button is clicked
 * @returns the radio button component
 */
export default function RadioButton({ isSelected, setSelected, ...props }: Props) {
	// eslint-disable-next-line require-jsdoc
	function toggleSelected() {
		setSelected(!isSelected);
	}

	return (
		<Center
			tabIndex={0}
			mr={{ base: "8px", md: "28px" }}
			boxSize="fit-content"
			boxShadow={isSelected ? "0px 0px 3px #4e664f" : "none"}
			onClick={toggleSelected}
			onKeyDown={(e) => {
				if (e.key === "Enter") {
					toggleSelected();
				}
			}}
			transition="0.025s"
			borderRadius="full"
			cursor="pointer"
			{...props}>
			<Box
				boxSize="13px"
				border="3px solid"
				borderColor="#2f5327"
				boxSizing="content-box"
				bg={isSelected ? "#27cf00" : "initial"}
				borderRadius="full"
				transition="inherit"
			/>
		</Center>
	);
}
