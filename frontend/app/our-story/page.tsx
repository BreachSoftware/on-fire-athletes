import React from "react";
import { Box } from "@chakra-ui/layout";
import OurStoryHero from "./components/hero";
import TheSparkSection from "./components/the-spark";
import WeAreOnFireSection from "./components/we-are-on-fire";
import YourFutureSection from "./components/your-future";

export default function OurStoryPage() {
    return (
        <Box position="relative" w="full" h="full">
            <OurStoryHero />
            <TheSparkSection />
            <WeAreOnFireSection />
            <YourFutureSection />
        </Box>
    );
}
