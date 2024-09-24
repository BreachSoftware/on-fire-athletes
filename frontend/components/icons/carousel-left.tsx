import { Icon, IconProps } from "@chakra-ui/icons";

/**
 * CarouselLeftIcon
 * Custom icon for the carousel that matches the chevrons in the mockup
 * @param props @chakra-ui IconProps
 * @returns Icon Component
 */
export default function CarouselLeftIcon(props: IconProps) {
	return (
		<Icon viewBox="0 0 24 24" {...props}>
			<path d="M16.259 22.9089L7.74109 11.9999L16.259 1.09094" fill="none" stroke="currentColor" strokeWidth="2" />
		</Icon>
	);
}
