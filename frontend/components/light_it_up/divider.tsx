import { Box, Center } from "@chakra-ui/layout";

/**
 * LightItUpDivider
 * A divider component that is used to separate sections in the LightItUp component.
 * Componentized to make it easier to refactor and maintain.
 * @returns  {JSX.Element} The rendered LightItUpDivider
 */
export default function LightItUpDivider() {
	return (
		<Center h="full" w="full">
			<Box width="1px" height="100%" transform="skew(-8deg)" bg="#788071" />
		</Center>
	);
}
