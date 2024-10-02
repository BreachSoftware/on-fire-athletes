import { b64toBlob, uploadAssetToS3 } from "@/components/create/Step3";
import CropModal from "@/components/shared/modals/crop-modal";
import { useAuth } from "@/hooks/useAuth";
import { MediaType } from "@/hooks/useMediaProcessing";

interface Props {
    media: string;
    mediaType: MediaType;
    isOpen: boolean;
    onClose: () => void;
    onComplete: (oldMedia: string, newMedia: string) => void;
}

export default function ProfileMediaEditModal({
    media,
    mediaType,
    isOpen,
    onClose,
    onComplete,
}: Props) {
    const { currentAuthenticatedUser } = useAuth();

    async function handleUploadCroppedMedia(image: string) {
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

        onComplete(
            media,
            `https://onfireathletes-media-uploads.s3.amazonaws.com/profile_media/${filename}`,
        );
    }

    if (mediaType !== MediaType.PHOTO) {
        return null;
    }

    return (
        <CropModal
            image={media}
            aspect={undefined}
            cropShape="rect"
            allowResize
            isOpen={isOpen}
            onClose={onClose}
            onSave={handleUploadCroppedMedia}
            onCancel={() => {}}
        />
    );
}
