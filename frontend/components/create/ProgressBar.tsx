import { Box, Flex, Progress } from "@chakra-ui/react";
import { theme } from "../../theming/theme";

interface ProgressBarProps {
	height: number;
	progress: number;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[rest: string]: any; // Not sure how else to define this as something other than any
}

/**
 * This is a progress bar component that can be used to show the progress of a task.
 * @param ProgressBarProps includes height of the bar and its current progress. Subsequent arguments will style the bar.
 * @returns The progress bar component.
 */
export default function ProgressBar({ height, progress, ...rest }: ProgressBarProps) {
	const clampedProgress = Math.max(0, Math.min(100, progress));

	/**
	 * The height string is used to set the height of the progress bar.
	 * It takes a number, converts it to a string, and adds "px" to the end.
	 * @param heightInPx The number to convert
	 * @returns The string with "px" appended
	 */
	function heightString(heightInPx: number): string {
		return `${heightInPx.toString() }px`;
	}
	const heightInPx = height * 2;

	// Get the theme and the hex value of the green color
	const barColor = theme.colors.green["100"];

	return (
		<Flex flexFlow="row nowrap" {...rest}>
			{/* This is the background of the progress bar */}
			<Box
				position="relative"
				height={heightString(heightInPx / 3.5)} // Hard-coded, but should scale based on the height properly
				marginTop={heightString(heightInPx / 2.77)} // Hard-coded, but should scale based on the height properly
				width="100%" // Want to make this the same as the parent Box
				borderRadius={"full"}
				bg="black"
				{...rest}
			/>
			{/*
				This is the Progress bar itself.
				It was modified to give it a blur which is why I need the background bar above.
			*/}
			<Progress
				height={heightString(heightInPx)}
				value={clampedProgress}
				alignItems={"center"}
				background={"transparent"}
				borderRadius={"full"}
				sx={{ // Modifications for the glow.
					"& > div": {
						bg: barColor,
						filter: `drop-shadow(0px 0px ${heightString(heightInPx / 6)} ${barColor})`,
						height: heightString(heightInPx / 4),
						marginTop: heightString(3 * heightInPx / 8),
						borderRadius: "full",
					},
					"& > div:first-of-type": {

						transition: "width 0.8s ease-in-out"
					}
				}}
				marginLeft="-100%"
				width="100%"
				{...rest}
			/>
		</Flex>
	);
}
