import { Flex, Image } from "@chakra-ui/react";
import Headline from "./headline";

/**
 *
 * @returns
 */
export default function HeadlineSection() {

	return (
		<Flex
			w="100%"
			h="100vh"
			backgroundImage="/crinkled-paper.png"
			overflow={"hidden"}
		>
			<Flex
				w="100%"
				alignItems="center"
				position="relative"
				flexDirection="row"
				wrap="wrap"
				// make gaps for normal and mobile
				gap={{ base: "0px", md: "10px" }}
				justifyContent={{ base: "center", sm: "space-evenly" }}
			>
				<Image
					src="/top-left-corner-elements.png"
					alt="Top Left Corner Elements"
					position="absolute"
					top="-375"
					left="-400"
					zIndex={0}
				/>
				<Image
					src="/bottom-right-corner-elements.png"
					alt="Bottom Right Corner Elements"
					position="absolute"
					bottom="-200"
					right="-225"
					zIndex={0}
				/>
				<Headline
					headlineTitle="Join the Revolution!"
					buttonText="SIGN UP!"
					url="/signup"
				/>
				<Headline
					headlineTitle="Bring Your Fans!"
					buttonText="SHARE ON SOCIAL!"
				/>
			</Flex>
		</Flex>
	);
}
