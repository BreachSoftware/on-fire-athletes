import { Icon, IconProps } from "@chakra-ui/icons";

/**
 * CarouselRightIcon
 * Custom icon for the carousel that matches the chevrons in the mockup
 * @param props @chakra-ui IconProps
 * @returns Icon Component
 */
export default function CarouselRightIcon(props: IconProps) {
	return (
		<Icon viewBox="0 0 24 24" {...props}>
			<path d="M7.74097 1.09106L16.2589 12.0001L7.74097 22.9091" fill="none" stroke="currentColor" strokeWidth="2" />
		</Icon>
	);
}
