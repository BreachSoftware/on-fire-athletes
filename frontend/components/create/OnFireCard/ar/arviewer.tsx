/* eslint-disable @next/next/no-img-element */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

"use client";

// Procedure to make a new card now that it's manual:
/*

	1. Create the card and get the images from the S3 bucket, noting the card UUID and generatedBy.
	2. Go to https://hiukim.github.io/mind-ar-js-doc/tools/compile and get that mind file.
		- Be sure to put the card image first, then the OnFireCardBack.png image second.
		- OnFireCardBack found at https://onfireathletes-media-uploads.s3.amazonaws.com/mind-ar/OnFireCardBack.png
	3. Upload the mind file to the S3 bucket, with the filename being {cardUUID}.mind.
		- gamechangers-mediu-uploads/mind-ar/{cardUUID}.mind
	4. Go to the ARViewer page and scan the QR code.
		- https://www.qr-code-generator.com/
		- The URL should be https://{url}/ar?card={cardUUID}
		- Where {url} is the base url of the website. ex `onfireathletes.com`

	** Note if we ever get the automatic card generation working again:
	* If you need to change the card back, all you have to do is change the card back image in the S3 bucket.

*/

// eslint-disable-next-line no-use-before-define
import React, { useEffect, useRef, useState } from "react";
// import { useCurrentCardInfo } from "@/hooks/useCurrentCardInfo";
import { Result, useZxing } from "react-zxing";
// import { getCard } from "@/app/generate_card_asset/cardFunctions";
import { useRouter } from "next/navigation";
import { Box, Button, Center, Text, Image, Link } from "@chakra-ui/react";
import TradingCardInfo from "@/hooks/TradingCardInfo";
import "aframe";
import "mind-ar/dist/mindar-image-aframe.prod.js";
import { apiEndpoints } from "@backend/EnvironmentManager/EnvironmentManager";
import OnFireLogo from "@/images/logos/small-logo-white.png";
import SharedStack from "@/components/shared/wrappers/shared-stack";
import Head from "next/head";

/**
 * The MindAR ARViewer component that renders the video on the OnFire card.
 *
 * @returns {JSX.Element} ARViewer component
 */
function ARViewer() {
    const PIXEL_AFRAME_CONVERSION = 300;
    const HEIGHT_OF_CARD = 1.5;
    const CARD_RATIO = 1 / 1.4;
    const WIDTH_OF_CARD = HEIGHT_OF_CARD * CARD_RATIO;
    const BASE_PIXEL_WIDTH = 1080;
    const BASE_PIXEL_HEIGHT = 1920;

    // const card = useCurrentCardInfo();
    const [userId, setUserId] = useState<string>("");
    const [cardUUID, setCardUUID] = useState<string>("");
    const [shouldShowProfile, setShouldShowProfile] = useState(false);
    const [isVideoSourceSet, setIsVideoSourceSet] = useState(false);
    const [imgSource, setImgSource] = useState("");
    const [qrResult, setQRResult] = useState<string>("");
    const sceneRef = useRef<HTMLElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [videoXOffset, setVideoXOffset] = useState(0);
    const [videoYOffset, setVideoYOffset] = useState(0);
    // const [scale, setScale] = useState(1);
    const [videoRotation, setVideoRotation] = useState(0);
    const [height, setHeight] = useState(HEIGHT_OF_CARD);
    const [width, setWidth] = useState(WIDTH_OF_CARD);
    const [scale, setScale] = useState(1);

    const router = useRouter();

    let found = false;
    let readCard = new TradingCardInfo();
    let isDefaultBack = false;

    useEffect(() => {
        clearCache();

        const currentUrl = window?.location?.href;

        const queryParams = new URLSearchParams(currentUrl?.split("?")[1]);
        const cardUUID = queryParams.get("card");

        const isNotProduction = !currentUrl.includes("onfireathletes.com");
        const misPrintIds = ["ee76a2f7-8c66-453d-bafc-89dfd65c11f2"];

        if (isNotProduction && misPrintIds.includes(cardUUID)) {
            console.log("Misprint detected, redirecting to production...");
            router.replace(`https://onfireathletes.com/ar?card=${cardUUID}`);
        }
    }, []);
    /**
     * A callback function that is called when a QR code is scanned.
     * This sets the cardUUID and generatedByUUID states, then
     * fetches the card from the backend.
     *
     * @param result The result of the QR code scan
     */
    async function onQRResult(result: Result) {
        console.log("Decoded result:", result);

        // Get all the OnFire cards
        const onFireCards = await fetch(apiEndpoints.getAllCards());
        const cards: TradingCardInfo[] = await onFireCards.json();

        // Get the card UUID from the QR code
        const stringedResult =
            typeof result === "string" ? result : result.getText();
        const queryParams = new URLSearchParams(stringedResult.split("?")[1]);
        const cardUUID = queryParams.get("card");

        setQRResult(cardUUID);
        // Find the OnFire card that matches the UUID of the QR code
        found = false;
        readCard = new TradingCardInfo();
        isDefaultBack = false;

        const fetchedCard = cards.find((card) => card.uuid === cardUUID);

        if (!fetchedCard) {
            console.error("Card not found");
            return;
        }

        found = true;
        readCard = fetchedCard;
        isDefaultBack =
            !fetchedCard.backVideoURL ||
            fetchedCard.backVideoURL ===
                "https://onfireathletes-media-uploads.s3.amazonaws.com/";

        setImgSource(fetchedCard.cardImage);
        setUserId(fetchedCard.generatedBy);
        setCardUUID(fetchedCard.uuid);
        setShouldShowProfile(fetchedCard.paymentStatus === 1);
        const backVideoUrl = isDefaultBack
            ? "https://onfireathletes-media-uploads.s3.amazonaws.com/onfire-athletes-back-default.mov"
            : readCard.backVideoURL;

        const { width, height } = await getVideoDimensions(backVideoUrl);

        console.log({ width, height });
        const dbWidth = fetchedCard.backVideoWidth;

        const aspectRatio = width / height;

        let targetHeight = HEIGHT_OF_CARD;
        let targetWidth = targetHeight * aspectRatio;

        const rotation = fetchedCard.backVideoRotation;
        const isRotated = rotation === 90 || rotation === 270;

        console.log("Rotation is", rotation, "isRotated is", isRotated);

        const scale = isDefaultBack
            ? 1
            : dbWidth / (isRotated ? BASE_PIXEL_HEIGHT : BASE_PIXEL_WIDTH);

        console.log("Original scale is", scale);

        const videoXOff =
            fetchedCard.backVideoXOffset / PIXEL_AFRAME_CONVERSION +
            (fetchedCard.arVideoXOffset ?? 0);
        const videoYOff =
            fetchedCard.backVideoYOffset / PIXEL_AFRAME_CONVERSION +
            (fetchedCard.arVideoYOffset ?? 0);

        setScale(scale);

        const effectiveWidth = targetWidth * scale;

        if (!isRotated && effectiveWidth < WIDTH_OF_CARD) {
            console.log("Effective width is less than the card width");
            const widthScaleAdjustment = WIDTH_OF_CARD / effectiveWidth;
            targetWidth = effectiveWidth * widthScaleAdjustment;
            targetHeight *= widthScaleAdjustment;
        }

        if (isRotated && effectiveWidth < HEIGHT_OF_CARD) {
            console.log("Effective width is less than the card height");
            const widthScaleAdjustment = HEIGHT_OF_CARD / effectiveWidth;
            targetWidth = effectiveWidth * widthScaleAdjustment;
            targetHeight *= widthScaleAdjustment;
        }

        console.log({
            width,
            height,
            targetHeight,
            targetWidth,
            dbWidth,
            // dbHeight,
            videoXOff,
            videoYOff,
            scale: dbWidth / width,
            // baseTargetWidth,
        });

        if (isRotated) {
            const temp = targetHeight;
            targetHeight = targetWidth;
            targetWidth = temp;

            const adjustedScale = isDefaultBack
                ? 1
                : dbWidth / BASE_PIXEL_WIDTH;

            console.log({ adjustedScale });
            console.log("Adjusted scale is", adjustedScale);
            setScale(adjustedScale);
        }

        setHeight(targetHeight);
        setWidth(targetWidth);
        setVideoXOffset(videoXOff);
        setVideoYOffset(videoYOff);
        setVideoRotation(fetchedCard.backVideoRotation);

        // Set the card to the card that was scanned
        if (videoRef.current && found) {
            videoRef.current.src = backVideoUrl;
            console.log("Playing: ", backVideoUrl);
            videoRef.current.play();
            setIsVideoSourceSet(true);
        }
    }

    // Use the useZxing hook to handle QR code scanning
    const { ref } = useZxing({
        onDecodeResult: onQRResult,
    });

    useEffect(() => {
        const sceneEl = sceneRef.current;
        if (!sceneEl) {
            return () => {};
        }

        // Get the AR system from the scene element
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const arSystem = (sceneEl as any).systems["mindar-image-system"];

        /**
         * Starts the AR system when the scene is ready.
         */
        function startARSystem() {
            if (arSystem) {
                arSystem.start(); // start AR
                console.info("AR System started");
                if (videoRef.current) {
                    // Wait 1 second before playing the video
                    setTimeout(() => {
                        videoRef.current?.play();
                    }, 1000);
                }
            }
            // Add a click event listener to play the video
            window.addEventListener("click", () => {
                if (videoRef.current) {
                    console.log(videoRef.current.src);
                    videoRef.current.src = readCard.backVideoURL;
                    console.log("Playing: ", readCard.backVideoURL);
                    videoRef.current.play();
                }
            });
        }

        // Here lies the section in which the cloak material used to be loaded. It is now in the patch file.

        // Add a renderstart event listener to start the AR system
        // FOR SOME REASON this renderstart listener doesnt work after the page is reloaded
        // This is true even after the patch, so let's just avoid putting crucial code in this listener
        sceneEl.addEventListener("renderstart", startARSystem);

        // Load the video prematurely for the card scanned to get here
        console.log("Current card: ", window.location.href);
        onQRResult(window.location.href).then(() => {
            // Reset the QR result the first time
            setQRResult("");
        });

        // Clean up the event listener and stop the AR system when the component unmounts
        return () => {
            if (arSystem) {
                arSystem.stop();
            }

            return () => {
                const sceneEl = sceneRef.current;
                if (sceneEl) {
                    if (sceneEl.systems["mindar-image-system"]) {
                        sceneEl.systems["mindar-image-system"].stop();
                    }
                }
            };
        };
    }, []);

    /**
     * A function to determine which mindFile to use for the given card.
     * @returns the URL of the correct mind file
     */
    function determineMindFile(): string {
        // Get the query parameters from the URL (if any).
        const queryParams = new URLSearchParams(window.location.search);
        const cardUUID = queryParams.get("card");

        if (cardUUID) {
            // This should eventually have guardrails in case the card is not found
            return `https://onfireathletes-media-uploads.s3.amazonaws.com/mind-ar/${cardUUID}.mind`;
        }
        // Something that we just know works. Not really the correct URL.
        return `https://onfireathletes-media-uploads.s3.amazonaws.com/mind-ar/magback.mind`;
    }
    //

    /**
     * A function to get a query parameter from the URL.
     * @param param the query parameter to get
     * @returns the value of the query parameter
     */
    function getQueryParam(param: string): string | null {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    /**
     * A function to reload the page with a new card.
     */
    function reloadWithNewCard() {
        window.location.href = window.location.href
            .split("?")[0]
            .concat(`?card=${qrResult}`);
    }

    return (
        <>
            <Head>
                <meta
                    httpEquiv="Cache-Control"
                    content="no-cache, no-store, must-revalidate"
                />
                <meta httpEquiv="Pragma" content="no-cache" />
                <meta httpEquiv="Expires" content="0" />
            </Head>
            {/* Apply global styles */}
            <style>{`
                * {
                    box-sizing: border-box;
                }

                video {
                    max-width: 900% !important;
                }
            `}</style>

            {qrResult !== "" && qrResult !== getQueryParam("card") && (
                <Center>
                    <Button
                        zIndex={3}
                        verticalAlign="center"
                        alignSelf="center"
                        backgroundColor="green.100"
                        borderWidth="1px"
                        borderColor="green.1000"
                        borderRadius="5px"
                        position="absolute"
                        top="80vh"
                        height="10vh"
                        width="90vw"
                        maxW="500px"
                        onClick={reloadWithNewCard}
                    >
                        <Text fontSize="xl" textColor="gray.1400">
                            Scan Different Card
                        </Text>
                    </Button>
                </Center>
            )}
            <SharedStack
                align="stretch"
                row
                spaced
                position="absolute"
                w="calc(100% - 16px)"
                zIndex={3}
                margin="8px"
                bottom="0px"
                fontFamily="Barlow Condensed"
                fontWeight="bold"
                color="white"
                textTransform="uppercase"
                letterSpacing="wide"
            >
                <Link href={`https://onfireathletes.com/`} isExternal>
                    <Center p="8px" rounded="4px" bgColor="rgba(0, 0, 0, 0.2)">
                        <Image
                            src={OnFireLogo.src}
                            alt="OnFire Logo"
                            boxSize="24px"
                        />
                    </Center>
                </Link>
                <Link
                    display="flex"
                    flex={1}
                    href={`https://onfireathletes.com/create/card_creation`}
                    isExternal
                >
                    <Center
                        flex={1}
                        py="8px"
                        px="4px"
                        rounded="4px"
                        bgColor="rgba(0, 0, 0, 0.2)"
                    >
                        <Text>Create Your Card</Text>
                    </Center>
                </Link>
                {shouldShowProfile && (
                    <Link
                        display="flex"
                        flex={1}
                        href={`https://onfireathletes.com/profile?user=${userId}&card=${cardUUID}`}
                        isExternal
                    >
                        <Center
                            flex={1}
                            py="8px"
                            px="4px"
                            rounded="4px"
                            bgColor="rgba(0, 0, 0, 0.2)"
                        >
                            <Text>Athlete Profile</Text>
                        </Center>
                    </Link>
                )}
            </SharedStack>

            {/* Render the AR scene for Front Image */}
            <a-scene
                ref={sceneRef}
                mindar-image={`imageTargetSrc: ${determineMindFile()};`} // Also have front and back
                renderer="colorManagement: true, physicallyCorrectLights"
                vr-mode-ui="enabled: false"
                filterMinCF="0.0001"
                filterBeta="1000"
                missTolerance="20" // warmupTolerance="100" missTolerance="1000"
                xr-mode-ui="enabled: false"
                device-orientation-permission-ui="enabled: false"
            >
                {/* Define assets */}
                <a-assets>
                    <img
                        id="card-image"
                        src={imgSource}
                        crossOrigin="anonymous"
                        alt="The OnFire card"
                    />
                    <video
                        ref={videoRef}
                        id="card-video"
                        autoPlay
                        style={{
                            objectFit: "cover",
                        }}
                        muted
                        playsInline
                        loop
                        crossOrigin="anonymous"
                        src={""}
                        type="video/mp4"
                    ></video>
                </a-assets>

                {/* Define the camera */}
                <a-camera
                    position="0 0 0"
                    look-controls="enabled: false"
                ></a-camera>

                {/* Front Image (targetIndex 0) */}
                <a-entity
                    mindar-image-target="targetIndex: 0"
                    id="front-entity"
                >
                    {/* Render the video if the video source is set */}
                    {isVideoSourceSet && (
                        <a-plane src="#card-image" height="1.5"></a-plane>
                    )}
                    <a-entity
                        obj-model="obj: url(/ar/ofamask-lg.obj); mtl: #obj-mtl"
                        rotation="0 0 -90"
                        position="0 0 0.002"
                        // scale="0.058 0.0576 0.058"
                        scale="0.058 0.0576 0.058"
                        cloak
                    ></a-entity>
                </a-entity>
                {/* Back Video (targetIndex 1) */}
                <a-entity mindar-image-target="targetIndex: 1" id="back-entity">
                    {/* Render the video if the video source is set */}
                    {isVideoSourceSet && (
                        <a-entity
                            position={`${videoXOffset} ${videoYOffset} 0`}
                            rotation={`0 0 -${videoRotation}`}
                            scale={`${scale} ${scale} 1`}
                        >
                            <a-video
                                src="#card-video"
                                height={height}
                                width={width}
                            ></a-video>
                        </a-entity>
                        // Potentially show a spinner if not loaded or something
                        //
                    )}
                    <a-entity
                        obj-model="obj: url(/ar/ofamask-rev-lg.obj); mtl: #obj-mtl"
                        rotation="0 0 -90"
                        position={`0 0 0.01`}
                        scale="0.058 0.058 0.058"
                        cloak
                    ></a-entity>
                </a-entity>
                {/* Front Image Inverted (for Android) (targetIndex 2) */}
                <a-entity
                    mindar-image-target="targetIndex: 2"
                    id="front-entity-invert"
                >
                    {/* Render the video if the video source is set */}
                    {isVideoSourceSet && (
                        <a-plane
                            src="#card-image"
                            height="1.5"
                            scale="-1 1 1"
                        ></a-plane>
                    )}
                    <a-entity
                        obj-model="obj: url(/ar/ofamask-lg.obj); mtl: #obj-mtl"
                        rotation="0 0 -90"
                        position="0 0 0.002"
                        // scale="0.058 0.0576 0.058"
                        scale="0.058 -0.0576 0.058"
                        cloak
                    ></a-entity>
                </a-entity>
                {/* Back Video Inverted for Android (targetIndex 3) */}
                <a-entity
                    mindar-image-target="targetIndex: 3"
                    id="back-entity-invert"
                >
                    {/* Render the video if the video source is set */}
                    {isVideoSourceSet && (
                        <a-entity
                            position={`${videoXOffset} ${videoYOffset} 0`}
                            rotation={`0 0 -${videoRotation}`}
                            scale={`-${scale} ${scale} 1`}
                        >
                            <a-video
                                src="#card-video"
                                height={height}
                                width={width}
                            ></a-video>
                        </a-entity>
                        // Potentially show a spinner if not loaded or something
                    )}
                    <a-entity
                        obj-model="obj: url(/ar/ofamask-rev-lg.obj); mtl: #obj-mtl"
                        rotation="0 0 -90"
                        position={`0 0 0.01`}
                        scale="0.058 -0.058 0.058"
                        cloak
                    ></a-entity>
                </a-entity>
                {/* Bag Tag Back Video (targetIndex 4) */}
                <a-entity mindar-image-target="targetIndex: 4" id="back-entity">
                    {/* Render the video if the video source is set */}
                    {isVideoSourceSet && (
                        <a-entity
                            position={`${videoXOffset} ${videoYOffset} 0`}
                            rotation={`0 0 -${videoRotation}`}
                            scale={`${scale} ${scale} 1`}
                        >
                            <a-video
                                src="#card-video"
                                height={height}
                                width={width}
                            ></a-video>
                        </a-entity>
                    )}
                    <a-entity
                        obj-model="obj: url(/ar/ofamask-rev-lg.obj); mtl: #obj-mtl"
                        rotation="0 0 -90"
                        position={`0 0 0.01`}
                        scale="0.058 0.058 0.058"
                        cloak
                    ></a-entity>
                </a-entity>
                {/* Bag Tag Back Video Inverted for Android (targetIndex 5) */}
                <a-entity
                    mindar-image-target="targetIndex: 5"
                    id="back-entity-invert"
                >
                    {/* Render the video if the video source is set */}
                    {isVideoSourceSet && (
                        <a-entity
                            position={`${videoXOffset} ${videoYOffset} 0`}
                            rotation={`0 0 -${videoRotation}`}
                            scale={`-${scale} ${scale} 1`}
                        >
                            <a-video
                                src="#card-video"
                                height={height}
                                width={width}
                            ></a-video>
                        </a-entity>
                    )}
                    <a-entity
                        obj-model="obj: url(/ar/ofamask-rev-lg.obj); mtl: #obj-mtl"
                        rotation="0 0 -90"
                        position={`0 0 0.01`}
                        scale="0.058 -0.058 0.058"
                        cloak
                    ></a-entity>
                </a-entity>
            </a-scene>

            {/* Render a hidden video element for QR code scanning */}
            <Box hidden>
                <video ref={ref} />
            </Box>
        </>
    );
}

/**
 * Gets the dimensions of a video from its URL
 * @param url URL of the video file
 * @returns Promise that resolves to an object containing width and height
 */
function getVideoDimensions(
    url: string,
): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
        const video = document.createElement("video");

        // Load metadata only, don't download the whole video
        video.preload = "metadata";

        video.onloadedmetadata = () => {
            // Clean up
            video.remove();

            resolve({
                width: video.videoWidth,
                height: video.videoHeight,
            });
        };

        video.onerror = () => {
            // Clean up
            video.remove();
            reject(new Error("Failed to load video metadata"));
        };

        // Set the source and begin loading metadata
        video.src = url;
    });
}

export default ARViewer;

function clearCache() {
    if (typeof caches !== "undefined") {
        caches
            .keys()
            .then((cacheNames) => {
                const deletionPromises = cacheNames.map((cacheName) => {
                    return caches
                        .delete(cacheName)
                        .then(() => console.log(`Cache ${cacheName} deleted`));
                });

                return Promise.all(deletionPromises);
            })
            .then(() => console.log("All caches cleared successfully"))
            .catch((err) => console.error("Failed to clear caches:", err));
    }

    // For browsers that don't support Cache API or as additional measure
    if (window.navigator && navigator.serviceWorker) {
        navigator.serviceWorker
            .getRegistrations()
            .then((registrations) => {
                registrations.forEach((registration) => {
                    registration.unregister();
                });
                console.log("Service workers unregistered");
            })
            .catch((err) =>
                console.error("Error unregistering service workers:", err),
            );
    }
}
