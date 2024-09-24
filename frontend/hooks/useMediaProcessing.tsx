"use client";

import { FC, ReactNode, createContext, useContext, useState, useCallback } from "react";

// Define the shape of the context's value
interface MediaProcessingContextType {
    isProcessingMedia: boolean;
    startProcessing: () => void;
    stopProcessing: () => void;
	mediaType: string
	setMediaType: (mediaType: string) => void;
}

// Props type for the provider component
type Props = {
    children?: ReactNode;
};

// Create the context with a default value
const MediaProcessingContext = createContext<MediaProcessingContextType>({
	isProcessingMedia: false,
	startProcessing: () => {},
	stopProcessing: () => {},
	mediaType: "",
	setMediaType: () => {},
});

/**
 * Custom hook to consume the MediaProcessingContext
 */
export function useMediaProcessing() {
	return useContext(MediaProcessingContext);
}

export enum MediaType {
	PHOTO = "photo",
	VIDEO = "video",
}

/**
 * Custom hook to provide the logic and state for media processing
 * @returns The context provider component
 */
function useProvideMediaProcessing(): MediaProcessingContextType {
	const [ isProcessingMedia, setIsProcessingMedia ] = useState(false);
	const [ mediaType, setMediaType ] = useState("");

	const startProcessing = useCallback(() => {
		return setIsProcessingMedia(true);
	}, []);
	const stopProcessing = useCallback(() => {
		return setIsProcessingMedia(false);
	}, []);

	return {
		isProcessingMedia: isProcessingMedia,
		startProcessing: startProcessing,
		stopProcessing: stopProcessing,
		mediaType: mediaType,
		setMediaType: setMediaType,
	};
}

// Provider component to wrap around parts of the app that need access to the media processing state
// Eslint is disabled due to other hooks using this convention
// eslint-disable-next-line func-style
export const ProvideMediaProcessing: FC<Props> = ({ children }) => {
	const mediaProcessing = useProvideMediaProcessing();
	return (
		<MediaProcessingContext.Provider value={mediaProcessing}>
			{children}
		</MediaProcessingContext.Provider>
	);
};
