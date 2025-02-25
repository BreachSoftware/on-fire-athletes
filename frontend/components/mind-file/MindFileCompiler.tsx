"use client";

import React, { useState } from "react";
import {
    Button,
    Progress,
    Text,
    VStack,
    useToast,
    Box,
    Heading,
    Code,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Badge,
    Flex,
} from "@chakra-ui/react";
import { MindFileService } from "@/services/mind-file/mind-file.service";
import {
    MindFileCompilationOptions,
    MindFileCompilationProgress,
} from "@/types/mind-file";
import TradingCardInfo from "@/hooks/TradingCardInfo";
import MindARScriptLoader from "./MindARScriptLoader";

interface MindFileCompilerProps {
    card: TradingCardInfo | undefined;
    hideDebug?: boolean;
}

/**
 * Component for compiling and downloading a .mind file for a trading card
 */
export default function MindFileCompiler({
    card,
    hideDebug = true,
}: MindFileCompilerProps): JSX.Element {
    const [compilationState, setCompilationState] =
        useState<MindFileCompilationProgress>({
            progress: 0,
            status: "idle",
        });
    const [mindArLoaded, setMindArLoaded] = useState<boolean>(false);
    const [debugInfo, setDebugInfo] = useState<string[]>([
        `${new Date().toISOString().slice(11, 19)} - Initializing MindAR compiler`,
    ]);
    const toast = useToast();

    const addDebugInfo = (message: string) => {
        console.log(`[MindFileCompiler] ${message}`);
        setDebugInfo((prev) => [
            ...prev,
            `${new Date().toISOString().slice(11, 19)} - ${message}`,
        ]);
    };

    const handleMindARLoad = () => {
        setMindArLoaded(true);
        addDebugInfo("✅ MindAR library loaded successfully");
    };

    const handleMindARError = (error: Error) => {
        addDebugInfo(`❌ Failed to load MindAR library: ${error.message}`);
        console.error("Failed to load MindAR library:", error);
        toast({
            title: "Error",
            description: "Failed to load MindAR library: " + error.message,
            status: "error",
            duration: 5000,
            isClosable: true,
        });
    };

    const frontImage = card?.cardPrintS3URL || card?.cardImage;

    const handleCompileMindFile = async (): Promise<void> => {
        if (!card) {
            addDebugInfo("Error: No card data available");
            toast({
                title: "Error",
                description: "No card data available",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        if (!mindArLoaded) {
            addDebugInfo("Error: MindAR library not loaded yet");
            toast({
                title: "Error",
                description: "MindAR library not loaded yet",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        setCompilationState({
            progress: 0,
            status: "loading",
        });

        addDebugInfo("Starting mind file compilation");

        try {
            // Verify the card has necessary images
            if (!frontImage || !card.cardBackS3URL) {
                throw new Error(
                    "Card is missing required images for AR tracking",
                );
            }

            addDebugInfo(`Found card images:
- Front: ${frontImage ? "Yes" : "No"}
- Back: ${card.cardBackS3URL ? "Yes" : "No"}`);

            // Compile mind file with progress updates
            const options: MindFileCompilationOptions = {
                onProgress: (progress: number) => {
                    const progressPercent = Math.round(progress * 100);
                    if (progressPercent % 10 === 0) {
                        addDebugInfo(
                            `Compilation progress: ${progressPercent}%`,
                        );
                    }
                    setCompilationState((prev) => ({
                        ...prev,
                        progress: progressPercent,
                    }));
                },
            };

            // We'll skip calling loadMindAR since we're using the script loader component
            addDebugInfo("Calling MindFileService.compileMindFile");
            const buffer = await MindFileService.compileMindFile(card, options);
            addDebugInfo(
                `Compilation complete, buffer size: ${buffer.byteLength} bytes`,
            );

            // Download the compiled file
            const filename = `${card.uuid}.mind`;
            addDebugInfo(`Downloading file as: ${filename}`);
            MindFileService.downloadMindFile(buffer, filename);

            setCompilationState({
                progress: 100,
                status: "success",
            });

            addDebugInfo("Mind file compiled and downloaded successfully");
            toast({
                title: "Success",
                description: "Mind file compiled and downloaded successfully",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Unknown error";
            addDebugInfo(`Error compiling mind file: ${errorMessage}`);
            console.error("Error compiling mind file:", error);

            setCompilationState({
                progress: 0,
                status: "error",
                error: errorMessage,
            });

            toast({
                title: "Error",
                description: `Failed to compile mind file: ${errorMessage}`,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const isLoading = compilationState.status === "loading";

    return (
        <>
            {/* Load the MindAR script */}
            <MindARScriptLoader
                onLoad={handleMindARLoad}
                onError={handleMindARError}
            />

            <VStack spacing={4} align="start" w="full">
                <Heading size="md" color="white">
                    MindAR Compilation
                </Heading>

                <Text color="white">
                    Compile and download a .mind file for augmented reality
                    tracking
                </Text>

                {!hideDebug && (
                    <Flex gap={2} wrap="wrap">
                        <Badge colorScheme={mindArLoaded ? "green" : "red"}>
                            {mindArLoaded
                                ? "✓ MindAR Loaded"
                                : "✗ MindAR Not Loaded"}
                        </Badge>
                        <Badge colorScheme={card ? "green" : "red"}>
                            {card ? "✓ Card Data Available" : "✗ No Card Data"}
                        </Badge>
                        <Badge colorScheme={frontImage ? "green" : "red"}>
                            {frontImage ? "✓ Front Image" : "✗ No Front Image"}
                        </Badge>
                        <Badge
                            colorScheme={card?.cardBackS3URL ? "green" : "red"}
                        >
                            {card?.cardBackS3URL
                                ? "✓ Back Image"
                                : "✗ No Back Image"}
                        </Badge>
                    </Flex>
                )}

                <Button
                    variant="outline"
                    colorScheme="blue"
                    isLoading={isLoading}
                    loadingText="Compiling..."
                    onClick={handleCompileMindFile}
                    isDisabled={!card || !mindArLoaded || isLoading}
                >
                    Compile & Download .mind File
                </Button>

                {isLoading && (
                    <Box w="100%">
                        <Text color="white" mb={2}>
                            Compiling: {compilationState.progress / 100}%
                        </Text>
                        <Progress
                            value={compilationState.progress / 100}
                            size="sm"
                            colorScheme="blue"
                            borderRadius="md"
                        />
                    </Box>
                )}

                {compilationState.status === "error" && (
                    <Text color="red.400">Error: {compilationState.error}</Text>
                )}

                {/* Debug section */}
                {!hideDebug && (
                    <Accordion allowToggle w="100%" mt={4} defaultIndex={0}>
                        <AccordionItem border="none">
                            <h2>
                                <AccordionButton
                                    bg="gray.700"
                                    color="white"
                                    _hover={{ bg: "gray.600" }}
                                    borderRadius="md"
                                >
                                    <Box flex="1" textAlign="left">
                                        Debug Information
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                            </h2>
                            <AccordionPanel
                                pb={4}
                                bg="gray.700"
                                color="gray.200"
                                borderRadius="md"
                            >
                                <Text mb={2} fontSize="sm">
                                    MindAR loaded: {mindArLoaded ? "Yes" : "No"}
                                </Text>
                                <Text mb={2} fontSize="sm">
                                    Compilation status:{" "}
                                    {compilationState.status}
                                </Text>
                                <Box maxH="200px" overflow="auto" w="100%">
                                    <Code
                                        p={2}
                                        display="block"
                                        whiteSpace="pre"
                                        colorScheme="gray"
                                        w="100%"
                                    >
                                        {debugInfo.join("\n")}
                                    </Code>
                                </Box>
                            </AccordionPanel>
                        </AccordionItem>
                    </Accordion>
                )}
            </VStack>
        </>
    );
}
