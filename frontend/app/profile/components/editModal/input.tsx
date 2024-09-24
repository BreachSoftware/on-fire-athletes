import { Input, InputProps } from "@chakra-ui/input";

/**
 * EditProfileInput component
 * A shared input component for the edit profile modal to make styling consistent
 * @param {InputProps} props
 * @returns {JSX.Element}
 */
export default function EditProfileInput(props: InputProps) {
	return (
		<Input
			variant={"basicInput"}
			rounded="md"
			backgroundColor="#2B2B2B"
			border={"solid 1px #323232"}
			{...props}
		/>
	);
}
