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
import { useEffect, useState } from "react";
import { Button } from "@chakra-ui/button";
import { useToast } from "@chakra-ui/toast";
import { Flex, Text, Box } from "@chakra-ui/layout";
import Cropper, { Area, Point } from "react-easy-crop";

interface Props {
    aspect?: number;
    cropShape?: "round" | "rect";
    allowResize?: boolean;
    image: string;
    onSave: (croppedImage: string) => Promise<void>;
    onCancel: () => void;
    isOpen: boolean;
    onClose: () => void;
}

export default function CropModal({
    aspect = 1,
    cropShape = "round",
    allowResize = false,
    isOpen,
    onClose,
    image,
    onSave,
    onCancel,
}: Props) {
    const toast = useToast();
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState<number>(1);
    const [cropSize, setCropSize] = useState<{ width: number; height: number }>(
        {
            width: 200,
            height: 200,
        },
    );
    const [maxWidth, setMaxWidth] = useState<number>(200);
    const [maxHeight, setMaxHeight] = useState<number>(200);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<
        Area | undefined
    >(undefined);

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
                        setIsSaving(false);
                        resolve(URL.createObjectURL(blob));
                    } else {
                        showErrorToast();
                        setIsSaving(false);
                        console.error("cannot get cropped canvas");
                        reject(new Error("Canvas to Blob conversion failed"));
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

    useEffect(() => {
        if (allowResize) {
            try {
                const imageElement = new Image();
                imageElement.src = image;

                imageElement.onload = () => {
                    const { width, height } = imageElement;
                    setMaxWidth(width);
                    setMaxHeight(height);
                };
                imageElement.onerror = () => {
                    showErrorToast();
                };
            } catch (e) {
                console.error(e);
                showErrorToast();
            }
        }
    }, []);

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered>
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
                            cropSize={allowResize ? cropSize : undefined}
                            aspect={aspect}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                            onCropSizeChange={setCropSize}
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
                        allowResize={allowResize}
                        size={cropSize}
                        setSize={setCropSize}
                        maxHeight={maxHeight}
                        maxWidth={maxWidth}
                        croppedAreaPixels={croppedAreaPixels}
                        processCroppedProfileImage={async (
                            croppedAreaPixels,
                        ) => {
                            const blob = await getCroppedImg(
                                image,
                                croppedAreaPixels,
                            );
                            if (blob) {
                                await onSave(blob)
                                    .then(() => {
                                        setIsSaving(false);
                                        onClose();
                                    })
                                    .catch(() => {
                                        setIsSaving(false);
                                        showErrorToast();
                                    });
                            }
                        }}
                        onCancel={() => {
                            onCancel();
                            onClose();
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
    allowResize = false,
    size,
    setSize,
    maxWidth,
    maxHeight,
    onCancel,
    isSaving,
}: {
    zoom: number;
    setZoom: (value: number) => void;
    croppedAreaPixels?: Area;
    processCroppedProfileImage: (croppedAreaPixels: Area) => Promise<void>;
    onCancel: () => void;
    allowResize?: boolean;
    size: { width: number; height: number };
    setSize: (size: { width: number; height: number }) => void;
    maxWidth: number;
    maxHeight: number;
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
                {allowResize && (
                    <Flex w="full" gridGap={8}>
                        <Box flex={1}>
                            <Text
                                color="white"
                                fontSize="14px"
                                fontWeight="medium"
                            >
                                Width
                            </Text>
                            <Slider
                                value={size.width}
                                onChange={(value) => {
                                    setSize({
                                        width: value,
                                        height: size.height,
                                    });
                                }}
                                min={100}
                                max={maxWidth}
                                step={10}
                                aria-label="width"
                                defaultValue={maxWidth}
                            >
                                <SliderTrack>
                                    <SliderFilledTrack />
                                </SliderTrack>
                                <SliderThumb />
                            </Slider>
                        </Box>
                        <Box flex={1}>
                            <Text
                                color="white"
                                fontSize="14px"
                                fontWeight="medium"
                            >
                                Height
                            </Text>
                            <Slider
                                value={size.height}
                                onChange={(value) => {
                                    setSize({
                                        width: size.width,
                                        height: value,
                                    });
                                }}
                                min={100}
                                max={maxHeight}
                                step={10}
                                aria-label="height"
                                defaultValue={maxHeight}
                            >
                                <SliderTrack>
                                    <SliderFilledTrack />
                                </SliderTrack>
                                <SliderThumb />
                            </Slider>
                        </Box>
                    </Flex>
                )}
                <Box>
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
