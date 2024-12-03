import { Input, InputProps } from "@chakra-ui/react";

interface SharedCreateInputProps extends InputProps {}

export default function SharedCreateInput({
    ...props
}: SharedCreateInputProps) {
    return (
        <Input
            variant={"basicInput"}
            backgroundColor={"gray.200"}
            autoComplete={"off"}
            {...props}
        />
    );
}
