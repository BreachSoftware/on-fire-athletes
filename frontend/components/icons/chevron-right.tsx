import { Icon, IconProps } from "@chakra-ui/icons";

/**
 * ChevronRightIcon
 * Custom chevron icon that matches the chevrons in the mockup
 * @param props @chakra-ui IconProps
 * @returns Icon Component
 */
export default function ChevronRightIcon(props: IconProps) {
	return (
		<Icon viewBox="0 0 25 25" {...props}>
			<path d="M7 4.6626L18 12.6626L7 20.6626" fill="none" stroke="currentColor" strokeWidth="2" />
		</Icon>
	);
}
