import ChevronRightIcon from "@/components/icons/chevron-right";
import { Button } from "@chakra-ui/button";
import Link from "next/link";

export default function StartCreatingButton() {
    return (
        <Link href="/create/card_creation">
            <Button
                h={{ base: "44px", lg: "50px", "2xl": "56px" }}
                w={{ base: "233px", md: "196px", xl: "233px" }}
                px={{ base: "22px", lg: "22px", "2xl": "22px" }}
                variant="infoButton"
                justifyContent="space-between"
                bg="green.600"
                color="white"
                fontFamily="Roboto"
                letterSpacing="1.4px"
                fontWeight="medium"
                textTransform="uppercase"
                fontSize={{ base: "16px", md: "16px", "2xl": "16px" }}
                _hover={{
                    bg: "#20A500",
                    boxShadow: "0 0 5px rgba(0,0,0,0.3)",
                    fontStyle: "italic",
                }}
            >
                START CREATING
                <ChevronRightIcon />
            </Button>
        </Link>
    );
}
