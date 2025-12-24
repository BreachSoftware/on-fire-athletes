import { Text } from "@chakra-ui/react";

interface ClearAllButtonProps {
    onClick: () => void;
    tagsActive: boolean;
}

export default function ClearAllButton({
    onClick,
    tagsActive,
}: ClearAllButtonProps) {
    if (!tagsActive) return null;

    return (
        <Text
            fontSize={"16"}
            letterSpacing={"0.44px"}
            paddingLeft={"8px"}
            fontFamily={"Barlow Semi Condensed"}
            textDecoration={"underline"}
            color={"green.100"}
            cursor={"pointer"}
            onClick={onClick}
        >
            Clear All
        </Text>
    );
}
