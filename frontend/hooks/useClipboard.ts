import { useState } from "react";

export const useClipboard = (durationInMs: number = 3000) => {
    const [isCopied, setIsCopied] = useState(false);

    const onCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, durationInMs);
    };

    return { isCopied, setIsCopied, onCopy };
};

export default useClipboard;
