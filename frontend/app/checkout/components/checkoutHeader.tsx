import { useCurrentCheckout } from "@/hooks/useCheckout";
import useCreateNavigation from "@/hooks/useCreateNavigation";
import { Box, Divider, Flex, Text, useBreakpointValue } from "@chakra-ui/react";


/**
 * The navigation bar for the checkout page
 * @returns JSX.Element
 */
function NavigationBar() {
	const { checkout, setCheckout } = useCurrentCheckout();
	const CREATE_PAGES = useCreateNavigation();

	return <Box>
		<Flex
			flexWrap="wrap"
			fontFamily="Barlow Condensed"
			fontSize="14px"
			gap="4px"
			letterSpacing="0.56pt"
			my="24px"
			display={{ base: "flex", md: "none" }}
		>
			{CREATE_PAGES.map((page, index) => {
				const { name, isDisabled } = page;
				const isCurrent = checkout.stepNum === page.stepNum;
				const isLast = index === CREATE_PAGES.length - 1;

				return (
					<>
						<Text
							key={name}
							color={isCurrent ? "limegreen" : "white"}
							onClick={isDisabled ? undefined : () => {
								setCheckout({ ...checkout, stepNum: page.stepNum });
							}}
						>
							{name}
						</Text>
						{!isLast && <Text color="white">/</Text>
						}
					</>
				);
			})}
		</Flex>
		<Divider borderColor="#31453D" />
	</Box>;
}

/**
 * The header component for the checkout page
 * @returns JSX.Element
 */
export default function CheckoutHeader() {

	// This variable controls if certain elements are visible in mobile vs desktop
	const screenTooSmall = useBreakpointValue({ base: true, lg: false });

	return (
		<>
			<Box pl={{ base:"0", md: "2" }} pb={{ base: "0", md: "2" }} bg="transparent" >
				<Flex direction={{ base: "row", lg: "row" }} justifyContent={"space-between"} pl="2" bg="transparent" mb="14px">
					<Flex>
						<Text fontFamily="Brotherhood" color="white" fontWeight={"100"} fontSize={{ base: "38px", md: "40px",
							lg: "50px" }} textAlign={{ base: "center", md: "left" }} letterSpacing={"3.0px"}>Checkout</Text>
					</Flex>
					{!screenTooSmall && <Flex fontSize="64px" fontWeight={100}>
						<Text fontWeight={600} fontFamily="Barlow Condensed" letterSpacing={"2.5px"} fontStyle={"italic"}
							color="green" fontSize={{ base:"75%" }} >CHECKOUT</Text>
					</Flex>}
				</Flex>
				<Divider borderColor="#31453D" />
				<NavigationBar />
			</Box>
		</>
	);
}
