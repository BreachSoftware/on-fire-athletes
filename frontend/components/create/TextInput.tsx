import { Input } from "@chakra-ui/react";

type TextInputProps = {
    title: string;
    placeholder: string;
    maxLength?: number;
    isDisabled?: boolean;
    variant?: string;
    backgroundColor?: string;
    type?: string; 
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
};

function TextInput({
    title,
    onChange,
    placeholder,
    maxLength = 50,
    isDisabled = false,
    variant = "basicInput",
    backgroundColor = "gray.200",
    type = "text", 
}: TextInputProps) {
    const handleLength = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length > maxLength) {
            e.target.value = e.target.value.slice(0, maxLength);
        }
        onChange(e);
    };
    

    return (
        <Input
            title={title}
            placeholder={placeholder}
            maxLength={maxLength} 
            isDisabled={isDisabled}
            variant={variant}
            backgroundColor={backgroundColor}
            onChange={handleLength}
            type={type}

        />
    );
}

export default TextInput;