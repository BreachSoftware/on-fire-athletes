import { Flex, Text, } from "@chakra-ui/react";
import "@fontsource/water-brush";
import "@fontsource/barlow-condensed";

interface NewEraTextProps {
	type: number;
}

const DescriptionText = [
	[
		"Create custom digital and physical sports cards to sell, share, and play",
		"Grow your brand and build your hype",
		"Earn income to help fund your dreams"
	],
	[
		"Discover rising stars and superstars worldwide",
		"Collect digital sports cards to buy, sell, and share",
		"Support athletes at any level to help fund their future"
	]
];

/**
 * Text for the New Era section of the landing page
 * @param {NewEraTextProps} props
 * @returns The New Era text
 */
export default function NewEraText(props: NewEraTextProps) {

	return (
		<>
			<Flex
				direction="column"
				color="white"
				justifyContent={"space-around"}
				gap={"20px"}
			>
				{DescriptionText[props.type].map((text, index) => {
					const [ firstWord, ...restWords ] = text.split(" ");
					return (
						<Text
							key={index}
							fontFamily="Barlow Condensed"
							fontSize="xl"
						>
							<Text as="span" fontWeight="bold">
								{`${ firstWord } `}
							</Text>
							{restWords.join(" ")}
						</Text>
					);
				})}
			</Flex>
		</>
	);
}
