import { Flex, Text, Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import RadioButton from "./radioButton";

interface Props {
	isAccepted: boolean;
	setIsAccepted: (isAccepted: boolean) => void;
}

/**
 * The Terms and Conditions agreement checkbox
 * @param toggleAccepted () => void - the function to call when the checkbox is clicked
 * @returns the terms and conditions agreement checkbox
 */
export default function TermsAndConditions({ isAccepted, setIsAccepted }: Props) {
	const router = useRouter();

	return (
		<Flex w="full">
			{/* Radio button */}
			<RadioButton isSelected={isAccepted} setSelected={setIsAccepted} />
			<Flex gap={1} wrap={"wrap"} fontFamily={"Roboto"} fontStyle={"italic"} fontSize={"14px"} letterSpacing={"0.28px"}>
				<Text>I agree to the</Text>

				<Button
					variant="link"
					color="green.600"
					fontSize={"14px"}
					fontStyle={"italic"}
					fontWeight={300}
					onClick={() => {
						router.push("/faq#Legal");
					}}
					textDecorationLine="underline">
					Terms of Service
				</Button>

				<Text>and</Text>

				<Button
					variant="link"
					color="green.600"
					fontSize={"14px"}
					fontStyle={"italic"}
					fontWeight={300}
					onClick={() => {
						router.push("/faq#Legal");
					}}
					textDecorationLine="underline">
					Privacy Policy.
				</Button>
			</Flex>
		</Flex>
	);
}
