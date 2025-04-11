import { useState } from "react";

export const useClipboard = () => {
    const [isCopied, setIsCopied] = useState(false);

    const onCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setIsCopied(true);
    };

    return { isCopied, setIsCopied, onCopy };
};

export default useClipboard;
