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
import {
    useState,
    useEffect,
    useRef,
    useImperativeHandle,
    forwardRef,
} from "react";
import { recolor } from "@/components/image_filters";
import "@fontsource/barlow";
import TradingCardInfo from "@/hooks/TradingCardInfo";
import { MotionProps, motion } from "framer-motion";
import { delay } from "lodash";
import { imageColors, imagePaths } from "./card_render_config";
import { cardAnimation, cardTopAnimation } from "./card_animation_config";
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
import CardMaskImage from "@/public/card_assets/card-mask.png";
import CardMaskReverseImage from "@/public/card_assets/card-mask-reverse.png";
import CardOutlineShine from "@/public/card_assets/card-outline-shine.png";
import CardInteriorShineA from "@/public/card_assets/card-inner-border-shine.png";
import CardInteriorShineB from "@/public/card_assets/card-inner-border-shine-b.png";
import { FaRotate } from "react-icons/fa6";
import { CardFonts } from "../create-helpers";
import { zIndex } from "./OnFireCardParts/helpers";
import OnFireLogoYear from "./OnFireCardParts/OnFireLogoYear";
import NumberTextB from "./OnFireCardParts/NumberTextB";
import NumberTextA from "./OnFireCardParts/NumberTextA";

const headers: Headers = new Headers();

export interface OnFireCardRef {
    handleClick: () => void;
}

type OnFireCardProps = {
    card?: TradingCardInfo;
    cardFrontRef?: React.RefObject<HTMLDivElement>;
    cardBackRef?: React.RefObject<HTMLDivElement>;
    cardForegroundRef?: React.RefObject<HTMLDivElement>;
    cardBackgroundRef?: React.RefObject<HTMLDivElement>;
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
            showButton = true,
            slim = false,
            shouldFlipOnClick = false,
            mobileFlipButton = false,
            isOnProfile = false,
        },
        ref,
    ) => {
        // console.log({ card });

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
        const [
            exteriorBorder,
            interiorBorder,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            solidBackground,
            background,
            signature,
        ]: (string | undefined)[] = recoloredGamecardImages;

        const cardIsLoaded = recoloredGamecardImages.length !== 0;

        // stop the animation after the first time
        useEffect(() => {
            if (cardIsLoaded && curCard.inputDisabled) {
                setFirstTimeAnimation(true);
                delay(setFirstTimeAnimation, 12000, false);
                delay(setCard, 1000, { ...curCard, inputDisabled: false });
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [recoloredGamecardImages]);

        const [cardGlowColor, setCardGlowColor] = useState(curCard.borderColor);

        useEffect(() => {
            setCardGlowColor(curCard.borderColor);
        }, [curCard.borderColor]);

        useEffect(() => {
            /**
             * Function to recolor the necessary images
             */
            async function recolorNecessaryImages(): Promise<string[]> {
                const imgsToRecolor: string[] = imagePaths(curCard);

                console.log({ imgsToRecolor });
                const colorsToRecolor: string[] = imageColors(curCard);

                console.log({ colorsToRecolor });

                const recoloredImages = await Promise.all(
                    imgsToRecolor.filter(Boolean).map((img, i) => {
                        return recolor(img, colorsToRecolor[i], headers, true);
                    }),
                );

                console.log({ recoloredImages });

                return recoloredImages;
            }

            if (!slim) {
                recolorNecessaryImages()
                    .then((result) => {
                        if (result) {
                            setRecoloredGamecardImages(result);
                        }
                    })
                    .catch((err) => {
                        console.log({ err });
                    });
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [
            curCard.signature,
            curCard.nameColor,
            curCard.borderColor,
            curCard.numberColor,
            curCard.topCardTextColor,
            curCard.selectedBackground,
            curCard.backgroundMainColor,
            curCard.backgroundTextColor,
            curCard.backgroundAccentColor,
        ]);

        const nameLength =
            curCard.firstName.length + curCard.lastName.length + 1;
        const minNameLength = 12;
        const maxNameLength = 24;

        // Calculate the ratio, clamped between 0 and 1
        let ratio =
            (maxNameLength - nameLength) / (maxNameLength - minNameLength);
        ratio = Math.max(0, Math.min(ratio, 1));

        // Compute the letter spacing based on the ratio
        const computedLetterSpacing = ratio * 4 - 2;

        const letterSpacing =
            curCard.cardType === "a"
                ? computedLetterSpacing
                : curCard.nameFont === CardFonts.UniserBold
                  ? 5
                  : 0;

        const nameSolidStyle: CSSProperties = {
            color: curCard.nameColor,
            pointerEvents: "none",
            WebkitTextStrokeWidth: "1.75px",
            WebkitTextStrokeColor: "transparent",
            userSelect: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            letterSpacing: `${letterSpacing}px`,
        };

        const nameOutlineStyle: CSSProperties = {
            color: "transparent",
            pointerEvents: "none",
            WebkitTextStrokeWidth: "1px",
            WebkitTextStrokeColor: curCard.nameColor,
            userSelect: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            letterSpacing: `${letterSpacing}px`,
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

        function ExteriorBorder({ back = false }: { back?: boolean }) {
            return (
                <CardSizeBox
                    src={undefined}
                    bg={curCard.borderColor}
                    style={{
                        maskImage: `url(${exteriorBorder})`,
                        maskSize: "cover",
                        maskPosition: "center",
                        maskRepeat: "no-repeat",
                    }}
                    zIndex={back ? zIndex.cardBackVideo + 1 : zIndex.border}
                    transform={back ? "scaleX(-1)" : "scaleX(1)"}
                />
            );
        }

        function ExteriorBorderShine({ back = false }: { back?: boolean }) {
            return (
                <CardSizeBox
                    src={CardOutlineShine.src}
                    zIndex={back ? zIndex.cardBackVideo + 1 : zIndex.border}
                    opacity={0.25}
                    transform={back ? "scaleX(-1)" : "scaleX(1)"}
                />
            );
        }

        function InteriorBorder() {
            return <CardSizeBox src={interiorBorder} zIndex={zIndex.border} />;
        }

        function InteriorBorderShine() {
            const src =
                curCard.cardType === "a"
                    ? CardInteriorShineA.src
                    : CardInteriorShineB.src;

            return (
                <CardSizeBox
                    src={src}
                    zIndex={zIndex.border + 1}
                    opacity={0.4}
                />
            );
        }

        interface CardBottomLayerProps extends ImageProps {
            flipped?: boolean;
        }

        // Bottom layer of the front of the card
        function CardBottomLayer({
            flipped = false,
            ...rest
        }: CardBottomLayerProps) {
            return cardIsLoaded ? (
                <Box
                    pos="absolute"
                    w="350px"
                    h="490px"
                    // backgroundImage={solidBackground}
                    bg={curCard.backgroundAccentColor}
                    backgroundSize="cover"
                >
                    <Box
                        bg={curCard.backgroundMainColor}
                        pos="absolute"
                        top={0}
                        left={0}
                        w="350px"
                        h="490px"
                        style={{
                            maskImage: `url(${background})`,
                            maskSize: "cover",
                            maskPosition: "center",
                            maskRepeat: "no-repeat",
                            pointerEvents: "none",
                            transform: flipped ? "scaleX(-1)" : "scaleX(1)",
                        }}
                        zIndex={zIndex.background}
                        transition={"filter 1s ease-in"}
                        draggable={false}
                        {...rest}
                    />
                </Box>
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
                        color: "white",
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
                        color: "white",
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
         * Determines the cardType and the number text to render
         * @returns the component to render the number text in its proper position
         */
        function NumberText({ ...rest }: TextProps) {
            return curCard.cardType === "a" ? (
                <NumberTextA card={curCard} {...rest} />
            ) : (
                <NumberTextB card={curCard} {...rest} />
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
                fontFamily: CardFonts.UniserBold,
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
                        {curCard.nameFont.includes("Brotherhood")
                            ? curCard.firstName
                                  .toUpperCase()
                                  .replaceAll("I", "i")
                            : curCard.firstName.toUpperCase()}
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
                        {curCard.nameFont.includes("Brotherhood")
                            ? curCard.lastName
                                  .toUpperCase()
                                  .replaceAll("I", "i")
                            : curCard.lastName.toUpperCase()}
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
                maskSize: "cover",
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

        const isMobile = useBreakpointValue({ base: true, lg: false });

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
            <Center
                {...outerBoxStyling}
                onClick={shouldFlipOnClick ? handleClick : () => {}}
            >
                {/* Front of OnFire card */}
                <motion.div {...frontCardMotionStyling}>
                    <VStack {...frontCardContainerStyling} ref={cardFrontRef}>
                        {cardIsLoaded || slim ? (
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
                                    maskSize: "cover",
                                    maskRepeat: "no-repeat",
                                    // Webkit
                                    WebkitMaskImage: `url(${CardMaskImage.src})`,
                                    WebkitMaskMode: "luminance",
                                    WebkitMaskSize: "contain",
                                    WebkitMaskRepeat: "no-repeat",
                                }}
                            >
                                {slim ? (
                                    <PrerenderedGamecardFrontImage />
                                ) : (
                                    <>
                                        <CardBottomLayer />

                                        <ExteriorBorder />
                                        <ExteriorBorderShine />

                                        <InteriorBorder />
                                        <InteriorBorderShine />

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
                                                    CardFonts.UniserBold
                                                        ? CardFonts.ChakraPetch
                                                        : CardFonts.BrotherhoodSansSerif
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
                                            top={0}
                                            left={0}
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
                                                    onStop={handleHeroDragStop}
                                                    nodeRef={heroRef}
                                                >
                                                    <Center
                                                        verticalAlign={"center"}
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
                                                            draggable={false}
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
                                                onStop={handleSignatureDragStop}
                                                nodeRef={signatureRef}
                                            >
                                                <Image
                                                    hidden={!signature}
                                                    animation={
                                                        shouldAnimate &&
                                                        (cardHover ||
                                                            firstTimeAnimation)
                                                            ? cardTopAnimation
                                                            : "translate(0);"
                                                    }
                                                    src={signature}
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

                                        <PositionText />

                                        <TeamText />

                                        <NumberText />

                                        <OnFireLogoYear card={curCard} />

                                        {curCard.cardType === "a" ? (
                                            <BigTextA />
                                        ) : (
                                            <BigTextB />
                                        )}

                                        {/* Card Shadow */}
                                        <Box
                                            alignSelf="center"
                                            paddingTop="50px"
                                            w={"170%"}
                                            visibility={{
                                                base: "hidden",
                                                md: "visible",
                                            }}
                                        >
                                            <CardDropShadow opacity={0.7} />
                                        </Box>
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
                                                    objectPosition: "center",
                                                }}
                                            />
                                        </Box>
                                    </Draggable>
                                </Box>
                                <ExteriorBorder back />
                                <ExteriorBorderShine back />
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
                            opacity: cardIsLoaded ? 1 : 0,
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
                            right="-74px"
                            onClick={handleClick}
                            aria-label="Flip Card"
                            background={"white"}
                            width="48px"
                            height="48px"
                            style={{
                                opacity: 1,
                                transition: "opacity 1s ease-in",
                            }}
                        >
                            <FlipCardIcon boxSize={7} />
                        </Center>
                    ))}
            </Center>
        );
    },
);

OnFireCard.displayName = "GamechangersCard";

export default OnFireCard;

function CardSizeBox({ src, ...rest }: { src: string | undefined } & BoxProps) {
    return (
        <Box
            pos="absolute"
            top="0"
            left="0"
            w="100%"
            h="100%"
            bgImage={src}
            backgroundSize="cover"
            pointerEvents="none"
            {...rest}
        />
    );
}
