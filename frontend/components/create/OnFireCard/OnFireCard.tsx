/* eslint-disable no-undef */
import React from "react";
import { useCurrentCardInfo } from "@/hooks/useCurrentCardInfo";
import {
    Image,
    Text,
    HStack,
    VStack,
    Box,
    Button,
    Center,
    TextProps,
    BoxProps,
    StackProps,
    ImageProps,
    IconButton,
    useToast,
    Icon,
    useBreakpointValue,
} from "@chakra-ui/react";
import mergeImages, { ImageSource } from "merge-images";
import {
    useState,
    useEffect,
    useRef,
    useImperativeHandle,
    forwardRef,
} from "react";
import { recolor } from "@/components/image_filters";
import "@fontsource/barlow";
import TradingCardInfo, { CardPart } from "@/hooks/TradingCardInfo";
import { MotionProps, motion } from "framer-motion";
import { delay } from "lodash";
import { cardRenderOrder, imageColors, imagePaths } from "./card_render_config";
import {
    cardAnimation,
    cardBackAnimation,
    cardTopAnimation,
} from "./card_animation_config";
import { darkenHexString } from "./card_utils";
import Draggable, { DraggableEvent } from "react-draggable";
import ReactPlayer from "react-player";
import { Spinner } from "@chakra-ui/react";
import CardDropShadow from "../CardDropShadow";
import { CSSProperties } from "styled-components";
import RepeatingPetch from "./repeating_petch";
import FlipCardIcon from "./flip_card_button";
import { useMediaProcessing } from "@/hooks/useMediaProcessing";
import OnFireCardSliders from "./OnFireCardSliders";
import CardOutline from "@/public/card_assets/card-outline.png";
import CardMaskImage from "@/public/card_assets/card-mask.png";
import CardMaskReverseImage from "@/public/card_assets/card-mask-reverse.png";
import CardOutlineShine from "@/public/card_assets/card-outline-shine.png";
import CardInteriorShineA from "@/public/card_assets/card-inner-border-shine.png";
import { FaRotate } from "react-icons/fa6";

// Use this enum to determine the zIndex of the elements on the card
enum zIndex {
    background = 1,
    petch = 2,
    hero = 3,
    signature = 4,
    text = 5,
    border = 6,
    cardBackVideo = 7,
}

const headers: Headers = new Headers();

/**
 * Function to call recolor() on all the images in the card.
 * Uses both the array of hex values and paths to the images.
 * @param colors The array of hex values to recolor the images with
 * @param paths The array of paths to the images to recolor. The length of this array also determines the number of images to recolor
 */
export async function recolorAllImages(
    colors: string[],
    paths: string[],
    header: Headers,
) {
    const base64arr: string[] = new Array(paths.length);

    // Parallel processing of all the images
    await Promise.all(
        paths.map(async (path, index) => {
            if (path === "" || colors[index] === "") {
                return;
            }

            let parsedImage = null;

            const isBorderColor =
                index == CardPart.EXTERIOR_BORDER ||
                index == CardPart.INTERIOR_BORDER;
            const recolorFunction = isBorderColor ? recolor : recolor;

            // Second true value is for the tint function's inverted parameter
            parsedImage = await recolorFunction(
                path,
                colors[index],
                header,
                true,
            );
            if (parsedImage) {
                base64arr[index] = parsedImage;
            }
        }),
    );

    return base64arr;
}

/**
 * Stacks and loads the image to be displayed on the card
 */
export async function loadImage(
    setGamecardTopLayer: (arg0: string) => void,
    setGamecardTopLayerNoLogo: (arg0: string) => void,
    setGamecardBottomLayer: (arg0: string) => void,
    setGamecardSignatureImage: (arg0: string) => void,
    recoloredGamecardImages: string[],
    partsToRecolor: number[],
    curCard: TradingCardInfo,
    finalRender: boolean = false,
) {
    if (partsToRecolor.length !== 0) {
        // Make sure that you're not waiting on anything
        return;
    }

    const cardRenderFrontArray = cardRenderOrder(
        "front",
        curCard,
        recoloredGamecardImages,
        finalRender,
    );
    const cardRenderBackArray = cardRenderOrder(
        "back",
        curCard,
        recoloredGamecardImages,
    );
    let cardRenderFrontArrayNoLogo: ImageSource[] = cardRenderFrontArray || [];
    const bBorderRecoloredGamecardImages = [...recoloredGamecardImages];

    // Get the B border recolored
    // B Border is used on the back of the card, so that is why we are doing this here.
    const tintResult = await recolor(
        "/card_assets/card-interior-border-b.png",
        curCard.borderColor,
        headers,
        true,
    ).catch((error) => {
        console.error("Error tinting the B border", error);
        return null;
    });

    if (tintResult) {
        // Set up the stack of cards to render, with the interior border as the recolored B border
        // bBorderRecoloredGamecardImages is copied from the current recoloredGamecardImages to reduce backend calls.
        bBorderRecoloredGamecardImages[CardPart.INTERIOR_BORDER] = tintResult;

        // Take out the front element, which is the logo. Forcing card type B to get B's border on the back
        const frontArrayStart = 3;
        const bCard = { ...curCard, cardType: "b" };
        cardRenderFrontArrayNoLogo = (
            cardRenderOrder(
                "front",
                bCard,
                bBorderRecoloredGamecardImages,
                finalRender,
            ) || []
        ).slice(frontArrayStart);

        if (!cardRenderFrontArray || !cardRenderBackArray) {
            console.error("Null Arrays!");
            return;
        }

        const b64FrontNoLogo = await mergeImages(
            cardRenderFrontArrayNoLogo.filter(Boolean),
        ).catch((error) => {
            console.error("Error merging the front image", error);

            return null;
        });

        const b64Front = await mergeImages(
            cardRenderFrontArray.filter(Boolean),
        ).catch((error) => {
            console.error("Error merging the front image", error);
            console.error("Front Array", cardRenderFrontArray);
            return null;
        });

        const b64Back = await mergeImages(
            cardRenderBackArray.filter(Boolean),
        ).catch((error) => {
            console.error("Error merging the back image", error);
            console.error("Back Array", cardRenderBackArray);
            return null;
        });

        if (b64FrontNoLogo && b64Front && b64Back) {
            setGamecardTopLayerNoLogo(b64FrontNoLogo);
            setGamecardTopLayer(b64Front);
            setGamecardBottomLayer(b64Back);
        }

        setGamecardSignatureImage(recoloredGamecardImages[CardPart.SIGNATURE]);
        curCard.signature = recoloredGamecardImages[CardPart.SIGNATURE];
    } else {
        console.error("Something wrong with tinting the B border");
    }
}

export interface OnFireCardRef {
    handleClick: () => void;
}

type OnFireCardProps = {
    card?: TradingCardInfo;
    cardFrontRef?: React.RefObject<HTMLDivElement>;
    cardBackRef?: React.RefObject<HTMLDivElement>;
    cardForegroundRef?: React.RefObject<HTMLDivElement>;
    cardBackgroundRef?: React.RefObject<HTMLDivElement>;
    showShadow?: boolean;
    showButton?: boolean;
    slim?: boolean;
    shouldFlipOnClick?: boolean;
    mobileFlipButton?: boolean;
    isOnProfile?: boolean;
};

/**
 * Renders the OnFireCard card and outputs the image.
 * @returns {JSX.Element} The rendered OnFire card.
 */
const OnFireCard = forwardRef<OnFireCardRef, OnFireCardProps>(
    (
        {
            card,
            cardFrontRef,
            cardBackRef,
            showShadow = true,
            showButton = true,
            slim = false,
            shouldFlipOnClick = false,
            mobileFlipButton = false,
            isOnProfile = false,
        },
        ref,
    ) => {
        const DEFAULT_BACK_VIDEO_URL =
            "https://onfireathletes-media-uploads.s3.amazonaws.com/onfire-athletes-back-default.mov";

        // usingHook should be true only if you are not slim and you did not put in a card.
        const usingHook = card === undefined;
        const cardHook = useCurrentCardInfo();
        const [curCard, setCurrentCard] = useState(
            usingHook ? cardHook.curCard : card,
        );

        headers.append("Content-Type", "application/json");

        const [isFlipped, setIsFlipped] = useState(true);

        const frontCardFlip = {
            visible: { transform: "rotateY(180deg)" },
            hidden: { transform: "rotateY(0deg)" },
        };

        const backCardFlip = {
            visible: { transform: "rotateY(-180deg)" },
            hidden: { transform: "rotateY(0deg)" },
        };

        /**
         * setCard will enable universal setting of the card, regardless of whether the hook is being used or not.
         * @param newCardAttributes
         */
        function setCard(newCardAttributes: TradingCardInfo) {
            if (usingHook) {
                cardHook.setCurCard(newCardAttributes);
            } else {
                setCurrentCard(newCardAttributes);
            }
        }

        const { isProcessingMedia } = useMediaProcessing();
        const toast = useToast();

        /**
         * Function to handle the flip of the card
         * @param isFlipped The boolean value to set the card to
         */
        function handleFlip(flip: boolean) {
            if (isProcessingMedia) {
                toast({
                    title: "Please wait for the media to finish processing",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                    position: "bottom-left",
                });
                return;
            }
            setCard({ ...curCard, frontIsShowing: flip });
            setIsFlipped(flip);
        }

        /**
         *
         * Handles card flips
         *
         * @param e The event triggered
         */
        function handleClick() {
            handleFlip(!isFlipped);
        }

        useEffect(() => {
            console.log({ isFlipped });
        }, [isFlipped]);

        useEffect(() => {
            setIsFlipped(cardHook.curCard.frontIsShowing);
            // We only want to run this once, so we don't need to add handleFlip to the dependencies
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [cardHook.curCard.frontIsShowing]);
        // Update state variable when cardHook changes
        useEffect(() => {
            if (usingHook) {
                // Potential guardrails
                setCurrentCard(cardHook.curCard);
            }

            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [cardHook.curCard]);

        useEffect(() => {
            // if (curCard.partsToRecolor.length > 0) {
            setPartsToRecolor(curCard.partsToRecolor);
            // }
        }, [curCard.partsToRecolor]);

        // useEffect(() => {

        // )}

        const [cardHover, setCardHover] = useState(false);

        const [firstTimeAnimation, setFirstTimeAnimation] = useState(false);

        const shouldAnimate = false;

        /*
         * An array of base64 strings of the recolored images.
         * This is in a state variable to allow the component to re-render when the user edits card colors.
         */
        const [recoloredGamecardImages, setRecoloredGamecardImages] = useState<
            string[]
        >([]);

        // The string for the b64 of the front layer. This is the borders and the logo
        const [gamecardTopLayer, setGamecardTopLayer] = useState("");
        // The b64 of the front layer without the logo
        const [gamecardTopLayerNoLogo, setGamecardTopLayerNoLogo] =
            useState("");
        // The string for the b64 of the back layer. This is the background p much
        const [gamecardBottomLayer, setGamecardBottomLayer] = useState("");
        // The string for the b64 of the signature
        const [gamecardSignatureImage, setGamecardSignatureImage] =
            useState("");

        // State for partsToRecolor
        const [partsToRecolor, setPartsToRecolor] = useState<number[]>(
            curCard.partsToRecolor,
        );

        // stop the animation after the first time
        useEffect(() => {
            if (gamecardTopLayer && gamecardBottomLayer) {
                setFirstTimeAnimation(true);
                delay(setFirstTimeAnimation, 12000, false);
                delay(setCard, 1000, { ...curCard, inputDisabled: false });
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [gamecardBottomLayer, gamecardTopLayer]);

        const [cardGlowColor, setCardGlowColor] = useState(curCard.borderColor);

        useEffect(() => {
            /**
             * Function to recolor the necessary images. Taken out to make things easier to understand.
             */
            function recolorNecessaryImages() {
                const partsLeft = partsToRecolor;
                for (let i = 0; i < partsLeft.length; i++) {
                    const recolorFunction =
                        partsLeft[0] === CardPart.EXTERIOR_BORDER ||
                        partsLeft[0] === CardPart.INTERIOR_BORDER
                            ? recolor
                            : recolor;
                    // Take the first element of the list to recolor
                    // Create the small array of recolored images
                    const temp = recoloredGamecardImages;
                    // Second true value is for the tint function's inverted parameter
                    recolorFunction(
                        imagePaths(curCard)[partsLeft[0]],
                        imageColors(curCard)[partsLeft[0]],
                        headers,
                        true,
                    ).then((result) => {
                        if (result) {
                            // Add the new card
                            temp[partsLeft[0]] = result;
                            // Set the glow color to the border color if the border is being recolored
                            if (partsLeft[0] === CardPart.EXTERIOR_BORDER) {
                                setCardGlowColor(curCard.borderColor);
                            }
                            // Remove the first element of the list
                            setPartsToRecolor(partsToRecolor.slice(1));
                            // Set the state variable to the new array after everything is recolored
                            setRecoloredGamecardImages(temp);
                        } else {
                            console.error(
                                "Error recoloring in recolorFunction",
                            );
                        }
                    });
                }
            }

            const needToRecolor = partsToRecolor.length !== 0;
            if (needToRecolor && !slim) {
                // Object.keys(CardPart).length / 2 is the number of elements in the enum due to some 'reverse mapping' thing
                const keysInCardPartEnum = Object.keys(CardPart).length / 2;
                if (partsToRecolor.length === keysInCardPartEnum) {
                    recolorAllImages(
                        imageColors(curCard),
                        imagePaths(curCard),
                        headers,
                    ).then((result) => {
                        if (result) {
                            setRecoloredGamecardImages(result);
                            setPartsToRecolor([]);
                            setCardGlowColor(curCard.borderColor);
                        } else {
                            console.error(
                                "Error recoloring in recolorAllImages",
                            );
                        }
                    });
                } else {
                    recolorNecessaryImages();
                }
            } else if (!slim) {
                loadImage(
                    setGamecardTopLayer,
                    setGamecardTopLayerNoLogo,
                    setGamecardBottomLayer,
                    setGamecardSignatureImage,
                    recoloredGamecardImages,
                    partsToRecolor,
                    curCard,
                );
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [partsToRecolor.length]);

        const nameSolidStyle: CSSProperties = {
            color: curCard.nameColor,
            pointerEvents: "none",
            WebkitTextStrokeWidth: "1.75px",
            WebkitTextStrokeColor: "transparent",
            userSelect: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
        };

        const nameOutlineStyle: CSSProperties = {
            color: "transparent",
            pointerEvents: "none",
            WebkitTextStrokeWidth: "0.5px",
            WebkitTextStrokeColor: curCard.nameColor,
            userSelect: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
        };

        const petchOutlineStyle: CSSProperties = {
            color: "transparent",
            pointerEvents: "none",
            WebkitTextStrokeWidth: "1px",
            WebkitTextStrokeColor: curCard.backgroundTextColor,
            userSelect: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
        };

        /**
         * Function to handle the drag stop event.
         * @param _e The event that triggered the drag stop
         * @param data The data from the drag stop
         */
        function handleHeroDragStop(
            _e: DraggableEvent,
            data: { x: number; y: number },
        ) {
            // Set the state variable to the new position
            setCard({ ...curCard, heroXOffset: data.x, heroYOffset: data.y });
        }

        /**
         * Function to handle the drag stop event.
         * @param _e The event that triggered the drag stop
         * @param data The data from the drag stop
         */
        function handleSignatureDragStop(
            _e: DraggableEvent,
            data: { x: number; y: number },
        ) {
            // Set the state variable to the new position
            setCard({
                ...curCard,
                signatureXOffset: data.x,
                signatureYOffset: data.y,
            });
        }

        /**
         * Function to handle the drag stop event.
         * @param _e The event that triggered the drag stop
         * @param data The data from the drag stop
         */
        function handleVideoDragStop(
            _e: DraggableEvent,
            data: { x: number; y: number },
        ) {
            // Set the state variable to the new position
            setCard({
                ...curCard,
                backVideoXOffset: data.x,
                backVideoYOffset: data.y,
            });
        }

        /**
         * The Image function to render the front image of the card
         * THIS IS NOT THE FRONT OF THE CARD, BUT THE FRONT LAYER OF THE CARD WITH BORDERS ETC.
         * @returns the component to render the front image
         */
        function CardTopLayerImage({
            flipped = false,
            noLogo = false,
        }: {
            flipped?: boolean;
            noLogo?: boolean;
        }) {
            return (noLogo ? gamecardTopLayerNoLogo : gamecardTopLayer) &&
                gamecardBottomLayer ? (
                <Image
                    animation={
                        shouldAnimate && (cardHover || firstTimeAnimation)
                            ? cardTopAnimation
                            : "translate(0);"
                    }
                    src={`${noLogo ? gamecardTopLayerNoLogo : gamecardTopLayer}`}
                    alt="Merged Front Image"
                    maxWidth={"350px"}
                    zIndex={zIndex.border}
                    position={"absolute"}
                    draggable={false}
                    style={{
                        pointerEvents: "none",
                        transform: flipped ? "scaleX(-1)" : "scaleX(1)",
                    }}
                />
            ) : null;
        }

        interface CardBottomLayerProps extends ImageProps {
            flipped?: boolean;
        }

        /**
         * Back image of the card
         * THIS IS NOT THE BACK OF THE CARD, BUT THE BACK LAYER OF THE CARD WITH BACKGROUND ETC.
         * @returns the component to render the back image
         */
        function CardBottomLayer({
            flipped = false,
            ...rest
        }: CardBottomLayerProps) {
            return gamecardTopLayer && gamecardBottomLayer ? (
                <Image
                    animation={
                        shouldAnimate && (cardHover || firstTimeAnimation)
                            ? cardBackAnimation
                            : "translate(0);"
                    }
                    src={`${gamecardBottomLayer}`}
                    alt="Merged Back Image"
                    maxWidth={"350px"}
                    zIndex={zIndex.background}
                    transition={"filter 1s ease-in"}
                    draggable={false}
                    style={{
                        pointerEvents: "none",
                        transform: flipped ? "scaleX(-1)" : "scaleX(1)",
                    }}
                    {...rest}
                />
            ) : null;
        }

        /**
         * The Position text to render
         * @returns the component to render the position text in its proper position
         */
        function PositionText({ ...rest }: TextProps) {
            return (
                <Text
                    as={motion.div}
                    zIndex={zIndex.text}
                    animation={
                        shouldAnimate && (cardHover || firstTimeAnimation)
                            ? cardTopAnimation
                            : "translate(0);"
                    }
                    position="absolute"
                    top={curCard.cardType === "a" ? "422px" : "40px"}
                    left={curCard.cardType === "a" ? "81px" : "42px"}
                    fontFamily={"'Barlow', sans-serif;"}
                    fontSize={"12px"}
                    fontWeight="500"
                    style={{
                        color: curCard.topCardTextColor,
                        pointerEvents: "none",
                    }}
                    transition={"color 0.5s ease-in-out"}
                    letterSpacing={"2px"}
                    {...rest}
                >
                    {curCard.position.toUpperCase()}
                </Text>
            );
        }

        /**
         * The Team text to render
         * @returns the component to render the team text in its proper position
         */
        function TeamText({ ...rest }: TextProps) {
            return (
                <Text
                    as={motion.div}
                    animation={
                        shouldAnimate && (cardHover || firstTimeAnimation)
                            ? cardTopAnimation
                            : "translate(0);"
                    }
                    zIndex={zIndex.text}
                    position="absolute"
                    top={curCard.cardType === "a" ? "437px" : "55px"}
                    left={curCard.cardType === "a" ? "81px" : "42px"}
                    fontFamily={"'Barlow', sans-serif;"}
                    fontSize={"12px"}
                    fontWeight="500"
                    style={{
                        color: curCard.topCardTextColor,
                        pointerEvents: "none",
                    }}
                    transition={"color 0.5s ease-in-out"}
                    letterSpacing={"2px"}
                    {...rest}
                >
                    {curCard.teamName.toUpperCase()}
                </Text>
            );
        }

        /**
         * The Number text to render for cardType A
         * @returns the component to render the number text in its proper position
         */
        function NumberTextA({ ...rest }: TextProps) {
            return (
                <Text
                    as={motion.div}
                    animation={
                        shouldAnimate && (cardHover || firstTimeAnimation)
                            ? cardTopAnimation
                            : "translate(0);"
                    }
                    zIndex={zIndex.text}
                    position="absolute"
                    top={"440px"}
                    left={"15px"}
                    width={"50px"}
                    fontFamily={"'Barlow', sans-serif;"}
                    fontWeight={"600"}
                    textAlign={"center"}
                    fontSize={"21px"}
                    transition={"color 0.5s ease-in-out"}
                    style={{
                        color: curCard.numberColor,
                        pointerEvents: "none",
                    }}
                    {...rest}
                >
                    {typeof curCard !== "undefined"
                        ? curCard.number !== ""
                            ? `#${curCard.number.substring(0, 2)}`
                            : null
                        : null}
                </Text>
            );
        }

        /**
         * The Number text to render for cardType B
         * @returns the component to render the number text in its proper position
         */
        function NumberTextB({ ...rest }: TextProps) {
            return (
                <Text
                    as={motion.div}
                    animation={
                        shouldAnimate && (cardHover || firstTimeAnimation)
                            ? cardTopAnimation
                            : "translate(0);"
                    }
                    zIndex={zIndex.text}
                    position="absolute"
                    top={"319px"}
                    left={"42px"}
                    fontFamily={"'Barlow', sans-serif;"}
                    fontWeight={"500"}
                    textAlign={"center"}
                    fontSize={"21px"}
                    letterSpacing={"-1.5px"}
                    transition={"color 0.5s ease-in-out"}
                    style={{
                        color: curCard.numberColor,
                        pointerEvents: "none",
                    }}
                    {...rest}
                >
                    {typeof curCard !== "undefined"
                        ? curCard.number !== ""
                            ? `#${curCard.number}`
                            : null
                        : null}
                </Text>
            );
        }

        /**
         * Determines the cardType and the number text to render
         * @returns the component to render the number text in its proper position
         */
        function NumberText({ ...rest }: TextProps) {
            return curCard.cardType === "a" ? (
                <NumberTextA {...rest} />
            ) : (
                <NumberTextB {...rest} />
            );
        }

        /**
         * The BigTextA function to render the first and last name in big text for cardType A
         * @returns the component to render the first and last name in big text
         */
        function BigTextA() {
            const textAttributes: TextProps = {
                as: motion.div,
                animation:
                    shouldAnimate && (cardHover || firstTimeAnimation)
                        ? cardTopAnimation
                        : "translate(0);",
                fontFamily: "Uniser-Bold",
                letterSpacing: "4.4px",
                fontSize: "45px",
                style: curCard.firstNameSolid
                    ? nameSolidStyle
                    : nameOutlineStyle,
                transition:
                    "color 0.5s ease-in-out, " +
                    "-webkit-text-stroke-color 0.5s ease-in-out, " +
                    "-webkit-text-stroke-width 0.5s ease-in-out",
            };

            if (slim && usingHook) {
                console.error(
                    "If you are generating slim cards, you must pass in a card!",
                );
                return <></>;
            }
            return (
                <HStack
                    style={{
                        transform: "rotate(-90deg)",
                        transformOrigin: "0 0",
                    }}
                    zIndex={zIndex.text}
                    position="absolute"
                    top={"436px"} // Higher = More Down
                    left={"10px"} // Higher = More Right
                >
                    <Text
                        {...textAttributes}
                        style={
                            curCard.firstNameSolid
                                ? nameSolidStyle
                                : nameOutlineStyle
                        }
                        transition={
                            "color 0.5s ease-in-out, " +
                            "-webkit-text-stroke-color 0.5s ease-in-out, " +
                            "-webkit-text-stroke-width 0.5s ease-in-out"
                        }
                    >
                        {curCard.firstName.toUpperCase()}
                    </Text>
                    <Text
                        {...textAttributes}
                        style={
                            curCard.lastNameSolid
                                ? nameSolidStyle
                                : nameOutlineStyle
                        }
                        transition={
                            "color 0.5s ease-in-out, " +
                            "-webkit-text-stroke-color 0.5s ease-in-out, " +
                            "-webkit-text-stroke-width 0.5s ease-in-out"
                        }
                    >
                        {curCard.lastName.toUpperCase()}
                    </Text>
                </HStack>
            );
        }

        /**
         * The BigTextB function to render the first and last name in big text for cardType B
         * @returns the component to render the first and last name in big text for cardType B
         */
        function BigTextB() {
            const textAttributes: TextProps = {
                as: motion.div,
                zIndex: zIndex.text,
                animation:
                    shouldAnimate && (cardHover || firstTimeAnimation)
                        ? cardTopAnimation
                        : "translate(0);",
                position: "absolute",
                top: "334px",
                left: "42px",
                fontFamily: curCard.nameFont,
                letterSpacing: "5px",
                fontSize: "55px",
            };

            return (
                <>
                    <Text
                        {...textAttributes}
                        style={
                            curCard.firstNameSolid
                                ? nameSolidStyle
                                : nameOutlineStyle
                        }
                        transition={
                            "color 0.5s ease-in-out, " +
                            "-webkit-text-stroke-color 0.5s ease-in-out, " +
                            "-webkit-text-stroke-width 0.5s ease-in-out"
                        }
                    >
                        {curCard.firstName.toUpperCase()}
                    </Text>
                    <Text
                        {...textAttributes}
                        top={"385px"}
                        style={
                            curCard.lastNameSolid
                                ? nameSolidStyle
                                : nameOutlineStyle
                        }
                        transition={
                            "color 0.5s ease-in-out, " +
                            "-webkit-text-stroke-color 0.5s ease-in-out, " +
                            "-webkit-text-stroke-width 0.5s ease-in-out"
                        }
                    >
                        {curCard.lastName.toUpperCase()}
                    </Text>
                </>
            );
        }

        /**
         * The function that displays an image if the card is slim
         * @returns The Image to show for the front of the gamecard
         */
        function PrerenderedGamecardFrontImage() {
            return (
                <Image
                    animation={
                        shouldAnimate && (cardHover || firstTimeAnimation)
                            ? cardTopAnimation
                            : "translate(0);"
                    }
                    src={`${curCard.cardImage}`}
                    alt={`${curCard.firstName} ${curCard.lastName}`}
                    maxWidth={"350px"}
                    zIndex={zIndex.border}
                    position={"absolute"}
                    left={0}
                    right={0}
                    top={0}
                    bottom={0}
                    draggable={false}
                    style={{ pointerEvents: "none" }}
                />
            );
        }

        /**
         * The function that displays a back image if the card is slim
         * The image comes from the S3 bucket
         * @returns The Image to show for the back of the gamecard
         */
        function PrerenderedGamecardBackImage() {
            return (
                <Image
                    animation={
                        shouldAnimate && (cardHover || firstTimeAnimation)
                            ? cardBackAnimation
                            : "translate(0);"
                    }
                    src={`${curCard.cardBackS3URL}`}
                    alt={`Back of ${curCard.firstName} ${curCard.lastName}'s card`}
                    maxWidth={"350px"}
                    zIndex={zIndex.background}
                    position={"absolute"}
                    left={0}
                    right={0}
                    top={0}
                    bottom={0}
                    transition={"filter 1s ease-in"}
                    draggable={false}
                    style={{ pointerEvents: "none" }}
                />
            );
        }

        const outerBoxStyling: BoxProps = {
            id: "card",
            position: "relative",
            w: "100%",
            h: "490px",
            minW: "350px",
            style: {
                transformStyle: "preserve-3d",
                perspective: "1000px",
            },
        };
        if (slim) {
            outerBoxStyling.onClick = handleClick;
        }

        const frontCardMotionStyling: MotionProps = {
            variants: frontCardFlip,
            animate: isFlipped ? "hidden" : "visible",
            transition: { duration: 0.5 },
            style: {
                position: "absolute",
                height: "100%",
                width: "100%",
                backfaceVisibility: "hidden",
                color: "white",
                filter: `drop-shadow(0px 0px 8px ${darkenHexString(cardGlowColor)})`,
                transition: "filter 1s ease-in",
            },
        };

        const frontCardContainerStyling: StackProps & MotionProps = {
            alignItems: "left",
            animation:
                shouldAnimate && (cardHover || firstTimeAnimation)
                    ? cardAnimation
                    : "rotate(0);",
            as: motion.div,
            w: "100%",
            maxWidth: "400px",
            height: "490px",
            onHoverStart: () => {
                setCardHover(true);
            },
            onHoverEnd: () => {
                setCardHover(false);
            },
            position: "relative",
            overflow: "hidden",
            style: { transformStyle: "preserve-3d" },
        };

        const backCardMotionStyling: MotionProps = {
            variants: backCardFlip,
            animate: !isFlipped ? "hidden" : "visible",
            transition: { duration: 0.5 },
            style: {
                position: "absolute",
                height: "100%",
                width: "100%",
                backfaceVisibility: "hidden",
                color: "white",
                transform: "rotateY(180deg)",
                filter: `drop-shadow(0px 0px 8px ${darkenHexString(cardGlowColor)})`,
            },
        };

        const backCardContainerStyling: StackProps & MotionProps = {
            alignItems: "left",
            animation:
                shouldAnimate && (cardHover || firstTimeAnimation)
                    ? cardAnimation
                    : "rotate(0);",
            as: motion.div,
            w: "100%",
            maxWidth: "400px",
            height: "490px",
            onHoverStart: () => {
                setCardHover(true);
            },
            onHoverEnd: () => {
                setCardHover(false);
            },
            position: "relative",
            overflow: "hidden",
            css: {
                maskImage: `url(${CardMaskReverseImage.src})`,
                // White is visible, black is not
                maskMode: "luminance",
                maskSize: "contain",
                maskRepeat: "no-repeat",
                transformStyle: "preserve-3d",
                // Webkit
                WebkitMaskImage: `url(${CardMaskReverseImage.src})`,
                WebkitMaskMode: "luminance",
                WebkitMaskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
            },
        };

        const heroRef = useRef(null);
        const signatureRef = useRef(null);
        const videoRef = useRef(null);

        const isMobile = useBreakpointValue({ base: true, md: false });

        // If the slim card is hovered over, the card will flip
        if (slim && !isMobile) {
            outerBoxStyling.onMouseEnter = () => {
                handleFlip(false);
            };
            outerBoxStyling.onMouseLeave = () => {
                handleFlip(true);
            };
        }

        useImperativeHandle(ref, () => {
            return {
                handleClick: handleClick,
            };
        });

        const hasBackVideo =
            curCard?.backVideoURL?.split("com/").at(1) ||
            curCard?.backVideoS3URL?.split("com/").at(1);

        return (
            <div>
                <Center
                    {...outerBoxStyling}
                    onClick={shouldFlipOnClick ? handleClick : () => {}}
                >
                    {/* Front of OnFire card */}
                    <motion.div {...frontCardMotionStyling}>
                        <VStack
                            {...frontCardContainerStyling}
                            ref={cardFrontRef}
                        >
                            {(gamecardTopLayer && gamecardBottomLayer) ||
                            slim ? (
                                <Box
                                    as={motion.div}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition="opacity 0.5s"
                                    width={"100%"}
                                    position={"relative"}
                                    height={"100%"}
                                    css={{
                                        // White is visible, black is not
                                        maskImage: `url(${CardMaskImage.src})`,
                                        maskMode: "luminance",
                                        maskSize: "contain",
                                        maskRepeat: "no-repeat",
                                        // Webkit
                                        WebkitMaskImage: `url(${CardMaskImage.src})`,
                                        WebkitMaskMode: "luminance",
                                        WebkitMaskSize: "contain",
                                        WebkitMaskRepeat: "no-repeat",
                                    }}
                                >
                                    <Box
                                        pos="absolute"
                                        zIndex="10"
                                        top="0"
                                        left="0"
                                        w="100%"
                                        h="100%"
                                        bgImage={CardOutlineShine.src}
                                        backgroundSize="cover"
                                        opacity="0.25"
                                        pointerEvents="none"
                                    />
                                    <Box
                                        pos="absolute"
                                        zIndex="10"
                                        top="0"
                                        left="0"
                                        w="100%"
                                        h="100%"
                                        bgImage={CardInteriorShineA.src}
                                        backgroundSize="cover"
                                        opacity="0.4"
                                        pointerEvents="none"
                                    />
                                    {/* <Box
                                        pos="absolute"
                                        zIndex="10"
                                        top="0"
                                        left="0"
                                        w="100%"
                                        h="100%"
                                        bgGradient="linear(80deg, rgba(0,0,0,0), rgba(255,255,255,1), rgba(0,0,0,0), rgba(255,255,255,1), rgba(0,0,0,0))"
                                        backgroundSize="contain"
                                        opacity="0.25"
                                        pointerEvents="none"
                                    /> */}
                                    {slim ? (
                                        <PrerenderedGamecardFrontImage />
                                    ) : (
                                        <>
                                            <CardBottomLayer position="absolute" />

                                            {/* Not its own element because it causes Petch text to jump around */}
                                            {curCard.cardType === "a" && (
                                                <RepeatingPetch
                                                    as={motion.div}
                                                    animation={
                                                        shouldAnimate &&
                                                        (cardHover ||
                                                            firstTimeAnimation)
                                                            ? cardTopAnimation
                                                            : "translate(0);"
                                                    }
                                                    text={curCard.lastName}
                                                    position="absolute"
                                                    height="fit-content"
                                                    style={petchOutlineStyle}
                                                    fontFam={
                                                        curCard.nameFont ===
                                                        "Uniser-Bold"
                                                            ? "Chakra Petch"
                                                            : "'Brotherhood', sans-serif"
                                                    }
                                                    zIndex={zIndex.petch}
                                                />
                                            )}

                                            {/* Not its own element because the Draggable snaps back when it is */}
                                            <Box
                                                w={"100%"}
                                                h={"100%"}
                                                zIndex={zIndex.hero}
                                                position={"absolute"}
                                                style={{
                                                    maskImage: `url(${gamecardBottomLayer})`,
                                                    maskSize: "contain",
                                                    maskRepeat: "no-repeat",
                                                }}
                                            >
                                                {/* Draggable Hero */}
                                                {curCard.frontPhotoURL && (
                                                    <Draggable
                                                        defaultPosition={{
                                                            x: curCard.heroXOffset,
                                                            y: curCard.heroYOffset,
                                                        }}
                                                        bounds={{
                                                            top: -500,
                                                            left: -300,
                                                            right: 300,
                                                            bottom: 500,
                                                        }}
                                                        onStop={
                                                            handleHeroDragStop
                                                        }
                                                        nodeRef={heroRef}
                                                    >
                                                        <Center
                                                            verticalAlign={
                                                                "center"
                                                            }
                                                            ref={heroRef}
                                                        >
                                                            <Image
                                                                animation={
                                                                    shouldAnimate &&
                                                                    (cardHover ||
                                                                        firstTimeAnimation)
                                                                        ? cardTopAnimation
                                                                        : "translate(0);"
                                                                }
                                                                src={`${curCard.frontPhotoURL}`}
                                                                alt="Player Hero"
                                                                maxWidth={`${curCard.heroWidth}px`}
                                                                top={"-5px"}
                                                                left={"0px"}
                                                                draggable={
                                                                    false
                                                                }
                                                                style={{
                                                                    filter: "drop-shadow(0px 0px 2px #000000)",
                                                                }}
                                                            />
                                                        </Center>
                                                    </Draggable>
                                                )}

                                                {/* Draggable Signature */}
                                                <Draggable
                                                    defaultPosition={{
                                                        x: curCard.signatureXOffset,
                                                        y: curCard.signatureYOffset,
                                                    }}
                                                    bounds={{
                                                        top: -400,
                                                        left: -300,
                                                        right: 300,
                                                        bottom: 400,
                                                    }}
                                                    onStop={
                                                        handleSignatureDragStop
                                                    }
                                                    nodeRef={signatureRef}
                                                >
                                                    <Image
                                                        hidden={
                                                            gamecardSignatureImage ==
                                                                undefined ||
                                                            gamecardSignatureImage ===
                                                                ""
                                                        }
                                                        animation={
                                                            shouldAnimate &&
                                                            (cardHover ||
                                                                firstTimeAnimation)
                                                                ? cardTopAnimation
                                                                : "translate(0);"
                                                        }
                                                        src={`${gamecardSignatureImage}`}
                                                        alt="Player Signature"
                                                        maxWidth={`${curCard.signatureWidth}px`}
                                                        position="absolute"
                                                        top={"380px"}
                                                        left={"75px"}
                                                        draggable={false}
                                                        alignSelf="center"
                                                        justifySelf="center"
                                                        style={{
                                                            filter: "drop-shadow(0px 0px 2px #000000)",
                                                        }}
                                                        ref={signatureRef}
                                                    />
                                                </Draggable>
                                            </Box>

                                            <CardTopLayerImage />

                                            <PositionText />

                                            <TeamText />

                                            <NumberText />

                                            {curCard.cardType === "a" ? (
                                                <BigTextA />
                                            ) : (
                                                <BigTextB />
                                            )}

                                            {/* Card Shadow */}
                                            {showShadow === true && (
                                                <Box
                                                    alignSelf="center"
                                                    paddingTop="50px"
                                                    w={"170%"}
                                                    visibility={{
                                                        base: "hidden",
                                                        md: "visible",
                                                    }}
                                                >
                                                    <CardDropShadow
                                                        opacity={0.7}
                                                    />
                                                </Box>
                                            )}
                                        </>
                                    )}
                                </Box>
                            ) : (
                                <Spinner
                                    speed={"0.75s"}
                                    color="white"
                                    w="150px"
                                    h="150px"
                                    margin={"auto"}
                                    marginTop={"30%"}
                                />
                            )}
                        </VStack>
                    </motion.div>

                    {/* Back of OnFire card */}
                    <motion.div {...backCardMotionStyling}>
                        <VStack {...backCardContainerStyling}>
                            <Box
                                position="relative"
                                overflow="hidden"
                                maxWidth="350px"
                                maxHeight="490px"
                                h="490px"
                                display="grid"
                                gridTemplateColumns="1fr"
                                gridTemplateRows="1fr"
                            >
                                <>
                                    {slim ? (
                                        <Box
                                            gridColumn="1"
                                            gridRow="1"
                                            ref={cardBackRef}
                                        >
                                            <PrerenderedGamecardBackImage />
                                        </Box>
                                    ) : (
                                        <Box
                                            gridColumn="1"
                                            gridRow="1"
                                            ref={cardBackRef}
                                        >
                                            <CardTopLayerImage flipped noLogo />
                                            <CardBottomLayer flipped />
                                        </Box>
                                    )}

                                    {/* The back video */}
                                    <Box
                                        zIndex={zIndex.cardBackVideo}
                                        width="350px"
                                        height="490px"
                                        position="absolute"
                                        top={0}
                                        left={0}
                                        overflow="hidden"
                                        display={"block"}
                                    >
                                        <Draggable
                                            defaultPosition={{
                                                x: curCard.backVideoXOffset,
                                                y: curCard.backVideoYOffset,
                                            }}
                                            bounds={{
                                                top: -500,
                                                left: -600,
                                                right: 600,
                                                bottom: 500,
                                            }}
                                            onStop={handleVideoDragStop}
                                            nodeRef={videoRef}
                                            disabled={slim}
                                        >
                                            {/* The display is a grid so that the resize can be done from the top-center, while also
											allowing the width to bleed outside the card */}
                                            <Box
                                                display="grid"
                                                alignItems={"center"}
                                                justifyContent={"center"}
                                                ref={videoRef}
                                            >
                                                <ReactPlayer
                                                    pip={false}
                                                    width={
                                                        hasBackVideo
                                                            ? `${curCard.backVideoWidth}px`
                                                            : "100%"
                                                    }
                                                    height={
                                                        hasBackVideo
                                                            ? `${curCard.backVideoHeight}px`
                                                            : "100%"
                                                    }
                                                    playing={true}
                                                    playsinline
                                                    muted={true}
                                                    loop={true}
                                                    url={
                                                        hasBackVideo
                                                            ? curCard.backVideoURL
                                                            : DEFAULT_BACK_VIDEO_URL
                                                    }
                                                    style={{
                                                        rotate: `${curCard.backVideoRotation}deg`,
                                                        objectFit: "cover",
                                                        objectPosition:
                                                            "center",
                                                    }}
                                                />
                                            </Box>
                                        </Draggable>
                                    </Box>
                                    <ExteriorBorder
                                        color={curCard.borderColor}
                                        mirrored
                                    />
                                </>
                            </Box>
                        </VStack>
                    </motion.div>

                    {!slim && showButton && !mobileFlipButton && (
                        <Button
                            onClick={handleClick}
                            variant={"white"}
                            bottom={"-350px"}
                            width={"70%"}
                            style={{
                                opacity:
                                    gamecardTopLayer && gamecardBottomLayer
                                        ? 1
                                        : 0,
                                transition: "opacity 1s ease-in",
                            }}
                            rightIcon={<FlipCardIcon />}
                            iconSpacing={4}
                        >
                            FLIP CARD
                        </Button>
                    )}

                    {!slim && (
                        <Box top={"0px"} right={"-70px"} pos={"absolute"}>
                            <OnFireCardSliders />
                        </Box>
                    )}

                    {mobileFlipButton &&
                        (isOnProfile ? (
                            <IconButton
                                onClick={handleClick}
                                aria-label="Flip Card"
                                pos="absolute"
                                bottom="-50px"
                                right="-30px"
                                minW="32px"
                                maxW="32px"
                                minH="32px"
                                maxH="32px"
                                background="#D5D5D5"
                                marginLeft={5}
                                icon={
                                    <Icon
                                        as={FaRotate}
                                        color="#121212"
                                        style={{
                                            width: "22px",
                                            height: "22px",
                                        }}
                                    />
                                }
                            />
                        ) : (
                            <Center
                                rounded="full"
                                tabIndex={0}
                                pos="absolute"
                                bottom="-50px"
                                right="-30px"
                                onClick={handleClick}
                                aria-label="Flip Card"
                                background={"white"}
                                width="32px"
                                height="32px"
                                style={{
                                    opacity: 1,
                                    transition: "opacity 1s ease-in",
                                }}
                            >
                                <FlipCardIcon boxSize={5} />
                            </Center>
                        ))}
                </Center>
            </div>
        );
    },
);

OnFireCard.displayName = "GamechangersCard";

export default OnFireCard;

function ExteriorBorder({
    color,
    mirrored,
}: {
    color: string;
    mirrored: boolean;
}) {
    return (
        <Box
            // mirror
            transform={mirrored ? "scaleX(-1)" : "scaleX(1)"}
            position="absolute"
            zIndex={zIndex.cardBackVideo + 1}
            top={0}
            left={0}
            w="100%"
            h="100%"
            pointerEvents="none"
            userSelect="none"
        >
            <Box
                position="absolute"
                top={0}
                left={0}
                w="100%"
                h="100%"
                bg={color}
                css={{
                    maskImage: `url(${CardOutline.src})`,
                    maskSize: "cover",
                    maskRepeat: "no-repeat",
                    WebkitMaskImage: `url(${CardOutline.src})`,
                    WebkitMaskSize: "cover",
                    WebkitMaskRepeat: "no-repeat",
                }}
            />
            <Box
                position="absolute"
                top={0}
                left={0}
                w="100%"
                h="100%"
                // shine
                bgImage={CardOutlineShine.src}
                bgPos="center"
                bgSize="cover"
                opacity="0.25"
            />
        </Box>
    );
}
