import { MediaType } from "@/hooks/useMediaProcessing";

export type ProfileMediaType = {
    url: string;
    type: MediaType;
    cropped?: string;
    cropDimensions?: {
        crop: { x: number; y: number };
        zoom: number;
    };
};
