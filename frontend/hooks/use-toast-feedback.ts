import { useToast } from "@chakra-ui/react";

export function useToastFeedback(successMessage: string, errorMessage: string) {
    const toast = useToast();

    return {
        onCompleted: () => {
            toast({
                status: "success",
                duration: 3000,
                description: successMessage,
                position: "top",
            });
        },
        onError: () => {
            toast({
                status: "error",
                duration: 3000,
                description: errorMessage,
                position: "top",
            });
        },
    };
}
