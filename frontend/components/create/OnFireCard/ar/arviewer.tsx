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
import PlayImage from "../../../../public/card_assets/play.png";
import { useCurrentCardInfo } from "@/hooks/useCurrentCardInfo";
import { Result, useZxing } from "react-zxing";
// import { getCard } from "@/app/generate_card_asset/cardFunctions";
import { Box, Button, Center, Text } from "@chakra-ui/react";
import TradingCardInfo from "@/hooks/TradingCardInfo";
import "aframe";
import "mind-ar/dist/mindar-image-aframe.prod.js";
import { apiEndpoints } from "@backend/EnvironmentManager/EnvironmentManager";

/**
 * The MindAR ARViewer component that renders the video on the OnFire card.
 *
 * @returns {JSX.Element} ARViewer component
 */
function ARViewer() {
    const card = useCurrentCardInfo();
    const [isVideoSourceSet, setIsVideoSourceSet] = useState(false);
    const [imgSource, setImgSource] = useState(card.curCard.cardImage);
    const [qrResult, setQRResult] = useState<string>("");
    const sceneRef = useRef<HTMLElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

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
        let found = false;
        let readCard = new TradingCardInfo();
        cards.forEach((fetchedCard) => {
            if (fetchedCard.uuid === cardUUID) {
                readCard = fetchedCard;
                setImgSource(fetchedCard.cardImage);
                console.log(imgSource);
                found = true;
            }
        });

        // Set the card to the card that was scanned
        if (videoRef.current && found) {
            videoRef.current.src = readCard.backVideoURL;
            console.log("Playing: ", readCard.backVideoURL);
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
                    videoRef.current.src = card.curCard.backVideoURL;
                    console.log("Playing: ", card.curCard.backVideoURL);
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
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [card.curCard.backVideoURL]);

    /**
     * A function to determine which mindFile to use for the given card.
     * @returns the URL of the correct mind file
     */
    function determineMindFile() {
        // Get the query parameters from the URL (if any).
        const queryParams = new URLSearchParams(window.location.search);
        const cardUUID = queryParams.get("card");

        if (cardUUID) {
            // This should eventually have guardrails in case the card is not found
            return `https://onfireathletes-media-uploads.s3.amazonaws.com/mind-ar/${cardUUID}.mind`;
        }
        // Something that we just know works. Not really the correct URL.
        return "https://onfireathletes-media-uploads.s3.amazonaws.com/mind-ar/magback.mind";
    }

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

            {/* Render the AR scene */}
            <a-scene
                ref={sceneRef}
                mindar-image={`imageTargetSrc: ${determineMindFile()};`} // Also have front and back
                renderer="colorManagement: true, physicallyCorrectLights"
                vr-mode-ui="enabled: false"
                filterMinCF=".01"
                filterBeta=".001"
                missTolerance="40" // warmupTolerance="100" missTolerance="1000"
                xr-mode-ui="enabled: false"
                device-orientation-permission-ui="enabled: false"
            >
                {/* Define assets */}
                <a-assets>
                    <video
                        ref={videoRef}
                        id="card-video"
                        autoPlay
                        style={{
                            "webkit-playsinline": "true",
                            objectFit: "cover",
                        }}
                        muted
                        playsInline
                        loop
                        crossOrigin="anonymous"
                        src={""}
                        type="video/mp4"
                    ></video>
                    <img
                        id="card-image"
                        src={imgSource}
                        crossOrigin="anonymous"
                        alt="The OnFire card"
                    />
                    <img
                        id="play-image"
                        src={PlayImage.src}
                        alt="Play button"
                    />
                </a-assets>

                {/* Define the camera */}
                <a-camera
                    position="0 0 0"
                    look-controls="enabled: false"
                ></a-camera>

                {/* Back Video (targetIndex 1) */}
                <a-entity mindar-image-target="targetIndex: 1">
                    {/* Render the video if the video source is set */}
                    {isVideoSourceSet && (
                        <a-video src="#card-video" height="1.5"></a-video>
                        // Potentially show a spinner if not loaded or something
                    )}
                    <a-entity
                        obj-model="obj: url(/ar/gcmask-rev.obj); mtl: #obj-mtl"
                        rotation="0 0 -90"
                        position="0 0 0.001"
                        scale="0.058 0.058 0.058"
                        cloak
                    ></a-entity>
                </a-entity>

                {/* Front Image (targetIndex 0) */}
                <a-entity mindar-image-target="targetIndex: 0">
                    {/* Render the video if the video source is set */}
                    {isVideoSourceSet && (
                        <a-plane src="#card-image" height="1.5"></a-plane>
                    )}
                    <a-entity
                        obj-model="obj: url(/ar/gcmask.obj); mtl: #obj-mtl"
                        rotation="0 0 -90"
                        position="0 0 0.001"
                        scale="0.058 0.058 0.058"
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

export default ARViewer;
