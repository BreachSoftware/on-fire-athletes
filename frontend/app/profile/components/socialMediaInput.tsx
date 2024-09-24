// eslint-disable-next-line no-use-before-define
import React from "react";
import { InputGroup, Input, InputRightElement, Tooltip } from "@chakra-ui/react";
import { faExclamationCircle, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface SocialMediaInputProps {
	name: string;
	editableSocialMediaLink: string;
	setEditableSocialMediaLink: (value: string) => void;
	validSocialMediaPrefix: string;
	validateSocialLink: (link: string, prefix: string) => boolean;
}

/**
 * This component is used to input the social media links of the user.
 * @returns The social media input component
 */
export default function SocialMediaInput(props: SocialMediaInputProps): React.ReactElement {
	return (
		<InputGroup>
			<Input
				variant={"basicInput"}
				rounded="md"
				backgroundColor="#2B2B2B"
				border={"solid 1px #323232"}
				placeholder={`${props.name}`}
				value={props.editableSocialMediaLink}
				onChange={(e) => {
					props.setEditableSocialMediaLink(e.target.value);
				}}
				pr="32px"
			/>
			<InputRightElement>
				{props.editableSocialMediaLink !== "" && !props.validateSocialLink(props.editableSocialMediaLink, props.validSocialMediaPrefix) ?
					<Tooltip
						variant="warning"
						label={`Your link must start with "${props.validSocialMediaPrefix}"`}
						w="230px"
						placement="right"
					>
						<FontAwesomeIcon icon={faExclamationCircle} color="orange" />
					</Tooltip> :
					<FontAwesomeIcon icon={faCheckCircle} color="#27CE00" />
				}
			</InputRightElement>
		</InputGroup>
	);
}
