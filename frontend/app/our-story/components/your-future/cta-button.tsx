"use client";

import { PropsWithChildren } from "react";
import { Button } from "@chakra-ui/button";
import { Link } from "@chakra-ui/layout";
import ChevronRightIcon from "@/components/icons/chevron-right";

export default function YourFutureCTAButton({
    children,
    link,
}: PropsWithChildren<{
    link: string;
}>) {
    return (
        <Link href={link}>
            <Button
                variant="infoButton"
                _hover={{
                    opacity: 0.8,
                    fontStyle: "italic",
                    fontWeight: "bold",
                }}
                h="44px"
                w="233px"
                transition="opacity 0.3s ease-out"
                letterSpacing="1.5px"
                boxShadow="0 0 24px #44FF19a0"
                bg="green.600"
                color="white"
                borderRadius="30px"
                textTransform="uppercase"
                fontSize={{ base: "14px", lg: "16px" }}
                justifyContent="space-between"
                rightIcon={<ChevronRightIcon boxSize={6} />}
            >
                {children}
            </Button>
        </Link>
    );
}
