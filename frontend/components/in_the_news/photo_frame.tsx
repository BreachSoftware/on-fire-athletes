import { Box, Image } from "@chakra-ui/react";

interface PhotoFrameProps {
	src: string; // URL of the photo to be framed
	alt: string; // Alternative text for the photo
}

/**
 * PhotoFrame component wraps an Image with a stylized frame
 *
 * @param {PhotoFrameProps} props - The properties for the PhotoFrame component.
 * @param {string} props.src - The source URL of the image.
 * @param {string} props.alt - The alt text for the image for accessibility.
 * @returns The PhotoFrame component with the image and the frame.
 */
function PhotoFrame({ src, alt }: PhotoFrameProps) {
	return (
		<Box
			position="relative"
			display="inline-block"
			p="2" // Adjust the padding to control the frame size
			borderRadius="md" // Making the corners rounded
			overflow="hidden" // This ensures the image won't spill out of the frame
			zIndex={2}
			w="full">
			<Box
				clipPath={"polygon(61% 0, 100% 0, 100% 39%, 39% 100%, 0 100%, 0 61%)"}
				position="absolute"
				top={0}
				left={0}
				w="full"
				h="full"
				bg="green.100" // This is the background color for the frame
				zIndex={1} // Ensures the frame is behind the image
			/>

			{/* Image with border */}
			<Box
				w="full"
				position="relative"
				zIndex={2} // Ensures the image is above the border
				border="8px solid"
				borderColor="green.100" // This is the border color for the frame
			>
				<Image
					src={src}
					alt={alt}
					objectFit="cover"
					w="full"
					position="relative" // Ensures proper stacking context
					zIndex={2} // Ensures the image is above the other elements
					aspectRatio={16 / 11}
					filter="grayscale(1)"
				/>
			</Box>
		</Box>
	);
}

export default PhotoFrame;
