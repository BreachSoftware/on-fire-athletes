import { Link } from "@chakra-ui/layout";
import { Button, type ButtonProps } from "@chakra-ui/button";
import { ChevronLeftIcon } from "@chakra-ui/icons";

export default function ReturnHomeButton({ ...rest }: ButtonProps) {
    return (
        <Link href="/">
            <Button
                size="sm"
                bg="green.600"
                rounded="full"
                boxShadow="0px 0px 10px #28BC06"
                leftIcon={<ChevronLeftIcon />}
                {...rest}
            >
                Return to Homepage
            </Button>
        </Link>
    );
}
