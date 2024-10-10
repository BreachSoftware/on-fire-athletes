// eslint-disable-next-line no-use-before-define
import React from "react";
import {
    Icon,
    InputGroup,
    Input,
    InputRightElement,
    Popover,
    PopoverTrigger,
    Text,
    PopoverContent,
    PopoverAnchor,
    useBreakpointValue,
} from "@chakra-ui/react";
import { FaExclamationCircle, FaCheckCircle } from "react-icons/fa";

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
export default function SocialMediaInput(
    props: SocialMediaInputProps,
): React.ReactElement {
    const popoverTrigger = useBreakpointValue({ base: "click", md: "hover" });

    return (
        <Popover placement="top" trigger={popoverTrigger as "click" | "hover"}>
            <InputGroup>
                <PopoverAnchor>
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
                </PopoverAnchor>
                <InputRightElement>
                    {props.editableSocialMediaLink === "" ||
                    !props.validateSocialLink(
                        props.editableSocialMediaLink,
                        props.validSocialMediaPrefix,
                    ) ? (
                        <PopoverTrigger>
                            <Icon as={FaExclamationCircle} color="orange" />
                        </PopoverTrigger>
                    ) : (
                        <Icon as={FaCheckCircle} color="#27CE00" />
                    )}
                </InputRightElement>
            </InputGroup>
            <PopoverContent bg="orange" p={2} zIndex={99999999}>
                <Text>
                    Your link must start with "{props.validSocialMediaPrefix}"
                </Text>
            </PopoverContent>
        </Popover>
    );
}
