"use client";

import { Button, Text, Spacer, Icon, Box, ButtonProps } from "@chakra-ui/react";
import { FaChevronRight } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { BeatLoader } from "react-spinners";
import { useState } from "react";

interface ButtonWithIconProps extends ButtonProps {
	title: string;
	link: string;
	color?: string;
	centerTextAndIcon?: boolean;
}

/**
 * This is a button component with an icon that can be used to navigate the app.
 * @param title The text to be displayed on the button.
 * @param link The destination to navigate to.
 * @returns The button with icon component.
 */
export default function ButtonWithIcon({
	title,
	link,
	color,
	centerTextAndIcon = false,
	...rest
}: ButtonWithIconProps) {
	const router = useRouter();
	const [ buttonClicked, setButtonClicked ] = useState(false);

	return (
		<Button
			variant={"infoButton"}
			padding={{ md: "0px 30px" }}
			_hover={{
				md: {
					opacity: 0.8,
					boxShadow: "0 0 5px rgba(0,0,0,0.3)",
					fontStyle: "italic",
					padding: "0px 40px"
				}
			}}
			transition="padding 0.3s ease-out, box-shadow 0.3s ease-out, background 0.3s ease-out"
			letterSpacing="1.5px"
			bg={color}
			textColor="white"
			onClick={() => {
				setButtonClicked(true);
				if (link) {
					router.push(link);
				}
			}}
			isLoading={buttonClicked}
			spinner={<BeatLoader size={8} color="white" />}
			fontSize={{ md: "2xs", xl: "md" }}
			{...rest} // Spread any other props onto the Button component
		>
			<Text>{title}</Text>
			{centerTextAndIcon ? <Box w="10px" /> : <Spacer />}
			<Icon as={FaChevronRight} />
		</Button>
	);
}
