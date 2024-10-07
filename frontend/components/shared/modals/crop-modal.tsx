import {
    Modal,
    ModalBody,
    ModalHeader,
    ModalFooter,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
} from "@chakra-ui/modal";
import {
    Slider,
    SliderThumb,
    SliderTrack,
    SliderFilledTrack,
} from "@chakra-ui/slider";
import { useState } from "react";
import { Button } from "@chakra-ui/button";
import { useToast } from "@chakra-ui/toast";
import { Flex, Text, Box } from "@chakra-ui/layout";
import Cropper, { Area, Point } from "react-easy-crop";

interface Props {
    cropShape?: "round" | "rect";
    image: string;
    startCrop?: Point;
    startZoom?: number;
    onSave:
        | ((croppedImage: string) => Promise<void>)
        | ((croppedImage: string, crop: Point, zoom: number) => Promise<void>);
    onCancel: () => void;
    isOpen: boolean;
    onClose: () => void;
}

export default function CropModal({
    cropShape = "round",
    isOpen,
    onClose,
    image,
    startCrop,
    startZoom,
    onSave,
    onCancel,
}: Props) {
    const toast = useToast();
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const [crop, setCrop] = useState<Point>(startCrop || { x: 0, y: 0 });
    const [zoom, setZoom] = useState<number>(startZoom || 1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<
        Area | undefined
    >(undefined);

    function resetState() {
        setCrop(startCrop || { x: 0, y: 0 });
        setZoom(startZoom || 1);
        setCroppedAreaPixels(undefined);
    }

    function handleClose() {
        resetState();
        onClose();
    }

    function onCropComplete(croppedArea: Area, croppedAreaPixels: Area) {
        setCroppedAreaPixels(croppedAreaPixels);
    }

    function showErrorToast() {
        toast({
            title: "Error saving changes",
            description: "Something went wrong. Please try again.",
            status: "error",
        });
    }

    async function createImage(url: string): Promise<HTMLImageElement> {
        console.log(url);

        return new Promise<HTMLImageElement>((resolve, reject) => {
            const image = new Image();
            image.addEventListener("load", () => resolve(image));
            image.addEventListener("error", (error) => reject(error));
            image.src = url;
            image.crossOrigin = "anonymous";
        });
    }

    /**
     * This function continues from processCroppedProfileImage and returns a promise that resolves to the cropped image as a blob
     * @param pixelCrop is the newly selected pixels of cropped image
     * @returns Promise<blobImage> is a promise that resolves to the blob of the image
     */
    async function getCroppedImg(
        imageSrc: string,
        pixelCrop: Area,
    ): Promise<string | null> {
        try {
            setIsSaving(true);
            const image = (await createImage(imageSrc)) as HTMLImageElement;
            const canvas = window.document.createElement(
                "canvas",
            ) as unknown as HTMLCanvasElement;
            const ctx = canvas.getContext("2d");

            if (!ctx) {
                console.log("no ctx");
                setIsSaving(false);
                showErrorToast();
                return null;
            }

            // No rotation, so set canvas size to the original image size
            canvas.width = image.width;
            canvas.height = image.height;

            // No need to translate or rotate the canvas context as we're not rotating the image
            ctx.drawImage(image, 0, 0);

            const croppedCanvas = window.document.createElement(
                "canvas",
            ) as unknown as HTMLCanvasElement;
            const croppedCtx = croppedCanvas.getContext("2d");

            if (!croppedCtx) {
                console.log("no croppedCtx");
                setIsSaving(false);
                showErrorToast();
                return null;
            }

            // Set the size of the cropped canvas to match the specified crop area
            croppedCanvas.width = pixelCrop.width;
            croppedCanvas.height = pixelCrop.height;

            // Draw the cropped image onto the new canvas
            croppedCtx.drawImage(
                canvas,
                pixelCrop.x,
                pixelCrop.y,
                pixelCrop.width,
                pixelCrop.height,
                0,
                0,
                pixelCrop.width,
                pixelCrop.height,
            );

            // Return the cropped image as a blob
            return new Promise((resolve, reject) => {
                croppedCanvas.toBlob((blob) => {
                    if (blob) {
                        console.log("returning");
                        resolve(URL.createObjectURL(blob));
                        setIsSaving(false);
                    } else {
                        showErrorToast();
                        console.error("cannot get cropped canvas");
                        reject(new Error("Canvas to Blob conversion failed"));
                        setIsSaving(false);
                    }
                }, "image/png");
            });
        } catch (e) {
            console.error(e);
            setIsSaving(false);
            showErrorToast();

            return null;
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="full" isCentered>
            <ModalOverlay />
            <ModalContent bg="gray.600">
                <ModalCloseButton color="white" />
                <ModalHeader color="white">Crop Image</ModalHeader>
                <ModalBody p={0} display="flex">
                    <Box position="relative" flex={1} h="calc(100vh - 172px)">
                        {/* Cropper */}
                        <Cropper
                            image={image}
                            cropShape={cropShape}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                            style={{
                                containerStyle: {
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    borderTopRightRadius: "10px",
                                    borderTopLeftRadius: "10px",
                                },
                            }}
                        />
                    </Box>
                </ModalBody>
                <ModalFooter p={0}>
                    <CropControls
                        zoom={zoom}
                        setZoom={setZoom}
                        croppedAreaPixels={croppedAreaPixels}
                        processCroppedProfileImage={async (
                            croppedAreaPixels,
                        ) => {
                            const blob = await getCroppedImg(
                                image,
                                croppedAreaPixels,
                            );
                            if (blob) {
                                await onSave(blob, crop, zoom)
                                    .then(() => {
                                        setIsSaving(false);
                                        handleClose();
                                    })
                                    .catch(() => {
                                        setIsSaving(false);
                                        showErrorToast();
                                    });
                            }
                        }}
                        onCancel={() => {
                            onCancel();
                            handleClose();
                        }}
                        isSaving={isSaving}
                    />
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

function CropControls({
    zoom,
    setZoom,
    croppedAreaPixels,
    processCroppedProfileImage,
    onCancel,
    isSaving,
}: {
    zoom: number;
    setZoom: (value: number) => void;
    croppedAreaPixels?: Area;
    processCroppedProfileImage: (croppedAreaPixels: Area) => Promise<void>;
    onCancel: () => void;
    isSaving: boolean;
}) {
    return (
        <Flex
            width="100%"
            bgColor="gray.500"
            borderBottomRightRadius="10px"
            borderBottomLeftRadius="10px"
            padding="10px"
            justifyContent="space-between"
            alignItems="center"
        >
            <Box flex={1} mr={5} ml={4}>
                <Box display={{ base: "none", lg: "inline" }}>
                    <Text color="white" fontSize="14px" fontWeight="medium">
                        Zoom
                    </Text>
                    <Slider
                        value={zoom}
                        onChange={(value) => {
                            return setZoom(value);
                        }}
                        min={1}
                        max={3}
                        step={0.1}
                        aria-label="zoom"
                        defaultValue={2}
                    >
                        <SliderTrack>
                            <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb />
                    </Slider>
                </Box>
            </Box>
            <Flex>
                <Button
                    bgColor="green.100"
                    color="white"
                    h="28px"
                    w="80px"
                    mr={3}
                    _hover={{
                        md: {
                            backgroundColor: "green.500",
                        },
                    }}
                    letterSpacing="2px"
                    fontSize="12px"
                    isDisabled={!croppedAreaPixels}
                    isLoading={isSaving}
                    onClick={() => {
                        if (croppedAreaPixels !== undefined) {
                            processCroppedProfileImage(croppedAreaPixels);
                        }
                    }}
                >
                    SAVE
                </Button>
                <Button
                    bgColor="red.600"
                    color="white"
                    h="28px"
                    w="80px"
                    _hover={{
                        md: {
                            backgroundColor: "red.700",
                        },
                    }}
                    letterSpacing={"2px"}
                    alignSelf="center"
                    fontSize="12px"
                    isDisabled={isSaving}
                    onClick={() => {
                        onCancel();
                    }}
                >
                    CANCEL
                </Button>
            </Flex>
        </Flex>
    );
}
