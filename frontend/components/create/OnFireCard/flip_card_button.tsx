import { Icon } from "@chakra-ui/react";

interface FlipCardIconProps {
	boxSize?: number;
}

/**
 *
 * The icon for the flip card button
 *
 * @returns The FlipCardIcon component
 */
export default function FlipCardIcon({ boxSize = 4 }: FlipCardIconProps) {
	return (
		<Icon boxSize={boxSize}>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
				<path
					fill="#27CE00"
					d="M884.3,357.6c116.8,117.7,151.7,277-362.2,320V496.4L243.2,763.8L522,1031.3V860.8C828.8,839.4,1244.9,604.5,884.3,357.6z"
				/>
				<path
					fill="#27CE00"
					d="M557.8,288.2v138.4l230.8-213.4L557.8,0v142.8c-309.2,15.6-792.1,253.6-426.5,503.8C13.6,527.9,30,330.1,557.8,288.2z"
				/>
			</svg>
		</Icon>
	);
}
