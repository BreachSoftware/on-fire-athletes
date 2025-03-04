"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Script from "next/script";
import { MindARCompiler } from "@/types/mind-file";

interface MindARScriptLoaderProps {
    onLoad?: () => void;
    onError?: (error: Error) => void;
}

// Define proper types for the MindAR global
declare global {
    interface Window {
        MINDAR?:
            | { IMAGE?: { Compiler: new () => MindARCompiler } | undefined }
            | undefined;
    }
}

/**
 * Component that loads the MindAR script properly in Next.js
 */
export default function MindARScriptLoader({
    onLoad,
    onError,
}: MindARScriptLoaderProps) {
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const hasCalledOnLoadRef = useRef<boolean>(false);

    // Safe wrapper for onLoad to ensure it's only called once
    const callOnLoadOnce = useCallback(() => {
        if (!hasCalledOnLoadRef.current && onLoad) {
            hasCalledOnLoadRef.current = true;
            onLoad();
        }
    }, [onLoad]);

    // Check if MindAR is already loaded on mount
    useEffect(() => {
        if (
            typeof window !== "undefined" &&
            window.MINDAR &&
            window.MINDAR.IMAGE
        ) {
            console.log("MindAR already loaded on mount");
            setIsLoaded(true);
            callOnLoadOnce();
        }
    }, [callOnLoadOnce]); // Only depends on callOnLoadOnce

    // Don't render the script tags if MindAR is already loaded
    if (isLoaded) {
        return null;
    }

    return (
        <>
            {/* First load AFrame which is required by MindAR */}
            <Script
                id="aframe-script"
                src="https://aframe.io/releases/1.5.0/aframe.min.js"
                strategy="beforeInteractive"
                onLoad={() => console.log("AFrame library loaded")}
                onError={() =>
                    onError?.(new Error("Failed to load AFrame script"))
                }
            />

            <Script
                id="aframe-extras-script"
                src="https://cdn.jsdelivr.net/gh/donmccurdy/aframe-extras@v7.0.0/dist/aframe-extras.min.js"
                strategy="beforeInteractive"
                onLoad={() => console.log("AFrame Extras library loaded")}
                onError={() =>
                    onError?.(new Error("Failed to load AFrame Extras script"))
                }
            />

            {/* Then load the full version of MindAR */}
            <Script
                id="mindar-script"
                src="https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js"
                strategy="afterInteractive"
                onLoad={() => {
                    console.log("MindAR script loaded");

                    // Check if MindAR initialized properly
                    setTimeout(() => {
                        if (window.MINDAR && window.MINDAR.IMAGE) {
                            console.log("MindAR.IMAGE namespace detected");
                            setIsLoaded(true);
                            callOnLoadOnce();
                        } else {
                            const error = new Error(
                                "MindAR loaded but MINDAR.IMAGE not available",
                            );
                            console.error(error.message);
                            onError?.(error);
                        }
                    }, 1000);
                }}
                onError={() => {
                    const error = new Error("Failed to load MindAR script");
                    console.error(error.message);
                    onError?.(error);
                }}
            />
        </>
    );
}
