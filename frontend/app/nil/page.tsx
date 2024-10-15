import React from "react";
import { Box } from "@chakra-ui/layout";
import NILHero from "./components/hero";
import NILApplicationForm from "./components/form";
import NILBenefits from "./components/benefits";

export default function NILPage() {
    return (
        <Box w="full">
            <NILHero />
            <NILApplicationForm />
            <NILBenefits />
        </Box>
    );
}
