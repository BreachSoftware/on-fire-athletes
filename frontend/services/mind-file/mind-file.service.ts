"use";

import TradingCardInfo from "@/hooks/TradingCardInfo";
import { MindFileCompilationOptions } from "@/types/mind-file";

/**
 * Service for handling mind file compilation operations
 */
export class MindFileService {
    /**
     * Checks if code is running on the client side
     * @returns boolean indicating if we're in a browser environment
     */
    private static isClient(): boolean {
        return typeof window !== "undefined" && typeof document !== "undefined";
    }

    /**
     * Loads the MindAR library dynamically
     * @returns Promise that resolves when the library is loaded
     */
    static async loadMindAR(): Promise<void> {
        // Make sure we're in the client
        if (!this.isClient()) {
            return Promise.reject(
                new Error("Cannot load MindAR in server environment"),
            );
        }

        // Check if already loaded
        if (window.MINDAR && window.MINDAR.IMAGE) {
            return Promise.resolve();
        }

        // Get the script ID to avoid duplicates
        const scriptId = "mindar-script";

        // Check if script is already in the DOM but not yet initialized
        if (document.getElementById(scriptId)) {
            return new Promise<void>((resolve) => {
                const checkIfLoaded = () => {
                    if (window.MINDAR && window.MINDAR.IMAGE) {
                        resolve();
                    } else {
                        // Poll until library initializes
                        setTimeout(checkIfLoaded, 100);
                    }
                };
                checkIfLoaded();
            });
        }

        return new Promise<void>((resolve, reject) => {
            try {
                const script = document.createElement(
                    "script",
                ) as unknown as HTMLScriptElement;
                script.id = scriptId;
                script.src =
                    "https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js";
                script.async = true;
                script.defer = true;

                script.onload = () => {
                    // Give a little time for the library to initialize
                    setTimeout(() => {
                        if (window.MINDAR && window.MINDAR.IMAGE) {
                            resolve();
                        } else {
                            reject(
                                new Error(
                                    "MindAR loaded but MINDAR.IMAGE not available",
                                ),
                            );
                        }
                    }, 200);
                };

                script.onerror = () =>
                    reject(new Error("Failed to load MindAR library"));
                document.head.appendChild(script); // Append to head instead of body
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Fetches images needed for MindAR compilation
     * @param cardData - The card data
     * @returns Promise with array of loaded image elements
     */
    static async getMindFileBaseImages(
        cardData: TradingCardInfo,
    ): Promise<HTMLImageElement[]> {
        // Get image URLs from card data - similar to what compile.js does
        const imageUrls: string[] = [
            cardData.cardPrintS3URL,
            cardData.cardBackS3URL,
        ].filter(Boolean) as string[];

        console.log(`[MindFileService] Getting ${imageUrls.length} images...`);

        // Load each image
        const imagePromises = imageUrls.map(async (imageUrl) => {
            try {
                // Create an image element and wait for it to load
                const img = new Image();
                img.crossOrigin = "anonymous";

                const loadPromise = new Promise<HTMLImageElement>(
                    (resolve, reject) => {
                        img.onload = () => resolve(img);
                        img.onerror = () =>
                            reject(
                                new Error(`Failed to load image: ${imageUrl}`),
                            );
                        img.src = imageUrl;
                    },
                );

                return await loadPromise;
            } catch (error) {
                console.error(`Failed to load image ${imageUrl}:`, error);
                return null;
            }
        });

        const images = await Promise.all(imagePromises);
        return images.filter(Boolean) as HTMLImageElement[];
    }

    /**
     * Creates flipped versions of the provided images
     * @param images - Array of image elements
     * @returns Promise with array of flipped image elements
     */
    static async createFlippedImages(
        images: HTMLImageElement[],
    ): Promise<HTMLImageElement[]> {
        const flippedImagePromises = images.map(async (img) => {
            try {
                // Create a canvas to draw and flip the image
                const canvas = document.createElement(
                    "canvas",
                ) as unknown as HTMLCanvasElement;
                const width = img.width;
                const height = img.height;

                // Set dimensions directly on the element
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext("2d");
                if (!ctx) throw new Error("Failed to get canvas context");

                // Flip vertically
                ctx.translate(0, height);
                ctx.scale(1, -1);
                ctx.drawImage(img, 0, 0);

                // Create a new image from the flipped canvas
                const flippedImg = new Image();
                flippedImg.crossOrigin = "anonymous";

                // Wait for the flipped image to load
                const loadPromise = new Promise<HTMLImageElement>(
                    (resolve, reject) => {
                        flippedImg.onload = () => resolve(flippedImg);
                        flippedImg.onerror = () =>
                            reject(new Error("Failed to load flipped image"));
                        flippedImg.src = canvas.toDataURL("image/jpeg");
                    },
                );

                return await loadPromise;
            } catch (err) {
                console.error("Failed to flip image", err);
                return null;
            }
        });

        const flippedImages = await Promise.all(flippedImagePromises);
        return flippedImages.filter(Boolean) as HTMLImageElement[];
    }

    /**
     * Compiles a .mind file for a given card
     * @param cardData - The card data
     * @param options - Compilation options
     * @returns Promise with the compiled .mind file as an ArrayBuffer
     */
    static async compileMindFile(
        cardData: TradingCardInfo,
        options?: MindFileCompilationOptions,
    ): Promise<ArrayBuffer> {
        // Make sure we're in the client
        if (!this.isClient()) {
            return Promise.reject(
                new Error("Cannot compile MindAR file in server environment"),
            );
        }

        // Verify MindAR is available - we don't call loadMindAR anymore as that's handled by the component
        if (!window.MINDAR || !window.MINDAR.IMAGE) {
            throw new Error("MindAR library is not loaded properly");
        }

        // 1. Get base images
        const images = await this.getMindFileBaseImages(cardData);
        if (images.length === 0) {
            throw new Error("No valid images found for compilation");
        }

        // 2. Create flipped versions (similar to what compile.js does with Sharp)
        const flippedImages = await this.createFlippedImages(images);

        // 3. Combine original + flipped images
        const allImages = [...images, ...flippedImages];
        console.log(
            `[MindFileService] Total images for compilation: ${allImages.length}`,
        );

        // 4. Compile with MindAR
        const compiler = new window.MINDAR.IMAGE.Compiler();

        // Track compilation progress
        const progressCallback =
            options?.onProgress ||
            ((progress: number) => {
                console.log("Compilation progress:", progress);
            });

        try {
            // Compile the images into a .mind file
            await compiler.compileImageTargets(allImages, progressCallback);

            // Export the compiled data
            const exportedBuffer = await compiler.exportData();
            return exportedBuffer;
        } catch (error) {
            console.error("Error during MindAR compilation:", error);
            throw error;
        }
    }

    /**
     * Triggers download of the .mind file
     * @param buffer - The .mind file as an ArrayBuffer
     * @param filename - The filename for the download
     */
    static downloadMindFile(buffer: ArrayBuffer, filename: string): void {
        if (!this.isClient()) {
            console.error("Cannot download file in server environment");
            return;
        }

        try {
            // Create blob from buffer
            const blob = new Blob([buffer], {
                type: "application/octet-stream",
            });

            // Create object URL
            const url = URL.createObjectURL(blob);

            // There are type issues with the DOM in this project, but this functionality works
            // Create and trigger download
            const a = document.createElement("a") as any; // Using any to bypass type issues
            a.href = url;
            a.download = filename;
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();

            // Clean up
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
        } catch (error) {
            console.error("Error downloading mind file:", error);

            // Fallback method if the first approach fails
            try {
                const blob = new Blob([buffer], {
                    type: "application/octet-stream",
                });
                const url = URL.createObjectURL(blob);

                // Try using window.open as a fallback
                const newWindow = window.open(url, "_blank");
                if (!newWindow) {
                    console.error(
                        "Popup blocked. Please allow popups for this site.",
                    );
                }

                // Still clean up the URL
                setTimeout(() => URL.revokeObjectURL(url), 100);
            } catch (fallbackError) {
                console.error("Fallback download also failed:", fallbackError);
            }
        }
    }
}
