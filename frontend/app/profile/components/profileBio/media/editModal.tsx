import { b64toBlob, uploadAssetToS3 } from "@/components/create/Step3";
import CropModal from "@/components/shared/modals/crop-modal";
import { useAuth } from "@/hooks/useAuth";
import { MediaType } from "@/hooks/useMediaProcessing";
import { ProfileMediaType } from "../types";

interface Props {
    media: ProfileMediaType | string;
    mediaType: MediaType;
    isOpen: boolean;
    onClose: () => void;
    onComplete: (mediaToUpdate: ProfileMediaType) => void;
}

export default function ProfileMediaEditModal({
    media,
    mediaType,
    isOpen,
    onClose,
    onComplete,
}: Props) {
    const { currentAuthenticatedUser } = useAuth();

    async function handleUploadCroppedMedia(
        image: string,
        crop: { x: number; y: number },
        zoom: number,
    ) {
        const resizedPhotoBlob = await b64toBlob(image);

        const user = await currentAuthenticatedUser();
        const user_id = user.userId;
        const current_unix_time = Math.floor(Date.now() / 1000);
        const filename = `${user_id}-${current_unix_time}.png`;

        await uploadAssetToS3(
            filename,
            resizedPhotoBlob,
            "profile_media",
            "image/png",
        );

        const mediaToUpdate =
            typeof media === "string"
                ? {
                      url: media,
                      type: mediaType,
                  }
                : media;

        onComplete({
            ...mediaToUpdate,
            cropped: `https://onfireathletes-media-uploads.s3.amazonaws.com/profile_media/${filename}`,
            cropDimensions: {
                crop,
                zoom,
            },
        });
    }

    if (mediaType !== MediaType.PHOTO) {
        return null;
    }

    return (
        <CropModal
            image={typeof media === "string" ? media : media.url}
            startCrop={
                typeof media !== "string"
                    ? media.cropDimensions?.crop
                    : undefined
            }
            startZoom={
                typeof media !== "string"
                    ? media.cropDimensions?.zoom
                    : undefined
            }
            cropShape="rect"
            isOpen={isOpen}
            onClose={onClose}
            onSave={handleUploadCroppedMedia}
            onCancel={() => {}}
        />
    );
}
