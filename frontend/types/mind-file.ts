import TradingCardInfo from "@/hooks/TradingCardInfo";

/**
 * Represents the progress state of a mind file compilation
 */
export interface MindFileCompilationProgress {
    progress: number;
    status: "idle" | "loading" | "success" | "error";
    error?: string;
}

/**
 * Interface for the MindAR compiler exposed by the MindAR library
 */
export interface MindARCompiler {
    compileImageTargets: (
        images: HTMLImageElement[],
        callback: (progress: number) => void,
    ) => Promise<void>;
    exportData: () => Promise<ArrayBuffer>;
}

/**
 * Options for mind file compilation
 */
export interface MindFileCompilationOptions {
    onProgress?: (progress: number) => void;
}

/**
 * Extend the Window interface to include MindAR
 */
declare global {
    interface Window {
        MINDAR?: {
            IMAGE?: {
                Compiler: new () => MindARCompiler;
            };
        };
    }
}
