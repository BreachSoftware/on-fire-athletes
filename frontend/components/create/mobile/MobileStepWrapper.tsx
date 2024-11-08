// eslint-disable-next-line no-use-before-define
import React, { useEffect } from "react";
import { useState } from "react";
import {
    Text,
    HStack,
    IconButton,
    VStack,
    Divider,
    Box,
    useDisclosure,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    CloseButton,
    Spacer,
} from "@chakra-ui/react";
import {
    mobileCardCreationSteps,
    mobileCardCreationStepTitles,
} from "@/components/create/mobile/mobileSteps";
import BackButton from "@/app/components/buttons/back_button";
import NextButton from "@/app/components/buttons/next_button";
import { FaList } from "react-icons/fa";
import { SubmitResult, submitCardWithAuth } from "../StepWrapper";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import {
    useCurrentCardInfo,
    useCurrentCardInfoProperties,
} from "@/hooks/useCurrentCardInfo";
import { useCompletedSteps } from "../../../hooks/useMobileProgress";
import StepProgressTracker from "./StepProgressTracker";
import { useMediaProcessing, MediaType } from "@/hooks/useMediaProcessing";

interface MobileStepWrapperProps {
    wProp?: string;
    hProp?: string;
    rightButtonIsDisabled?: boolean;
    entireCardRef: React.RefObject<HTMLDivElement>;
    cardBackRef: React.RefObject<HTMLDivElement>;
    foregroundRef: React.RefObject<HTMLDivElement>;
    backgroundRef: React.RefObject<HTMLDivElement>;
    currentInfo: useCurrentCardInfoProperties;
    isNil: boolean;
}

/**
 *
 * The MobileStepWrapper component is a UI component that displays the steps for creating
 * a card on a mobile device. It includes navigation buttons to move between steps,
 * and displays the current step number and title.
 *
 * @param props The props for the MobileStepWrapper component
 * @returns The MobileStepWrapper component
 *
 */
export default function MobileStepWrapper(props: MobileStepWrapperProps) {
    // Use state to keep track of the current step number
    const [stepNumber, setStepNumber] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [nextButtonisDisabled, setNextButtonIsDisabled] = useState(true);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const auth = useAuth();
    const router = useRouter();
    const currentInfo = useCurrentCardInfo();

    // Keep track of which steps are completed
    const stepHook = useCompletedSteps();
    const mobileProgress = stepHook.mobileProgress;

    const onLastStep = stepNumber === mobileCardCreationSteps.length - 1;

    useEffect(() => {
        setNextButtonIsDisabled(
            !stepHook.mobileProgress.completedSteps[stepNumber],
        );
    }, [stepHook.mobileProgress.completedSteps, stepNumber, currentInfo]);

    const { setMediaType } = useMediaProcessing();

    /**
     * This useEffect hook updates the desktop step number when using the mobile step wrapper for the media sliders to show up on the correct steps
     */
    useEffect(() => {
        if (stepNumber >= 0 && stepNumber <= 1) {
            currentInfo.setCurCard({
                ...currentInfo.curCard,
                stepNumber: 2,
            });
        } else if (stepNumber === 2) {
            currentInfo.setCurCard({
                ...currentInfo.curCard,
                stepNumber: 3,
                frontIsShowing: true,
            });
        } else if (stepNumber === 3) {
            currentInfo.setCurCard({
                ...currentInfo.curCard,
                stepNumber: 3,
                frontIsShowing: false,
            });
        } else if (stepNumber === 4) {
            currentInfo.setCurCard({
                ...currentInfo.curCard,
                stepNumber: 3,
                frontIsShowing: true,
            });
        } else if (stepNumber >= 5 && stepNumber <= 8) {
            currentInfo.setCurCard({
                ...currentInfo.curCard,
                stepNumber: 4,
            });
        } else if (stepNumber === 9) {
            currentInfo.setCurCard({
                ...currentInfo.curCard,
                stepNumber: 5,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stepNumber]);

    useEffect(() => {
        if (stepNumber === 2) {
            setMediaType(MediaType.PHOTO);
        } else if (stepNumber === 3) {
            setMediaType(MediaType.VIDEO);
        } else if (stepNumber === 4) {
            setMediaType(MediaType.PHOTO);
        }
        // This is a dependency array that only should be called when the step number changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stepNumber]);

    /**
     * This is the array of Buttons that navigate to each step
     */
    function NavigationButtonArray() {
        /**
         * A function that navigates and closes the modal.
         */
        function changeStepAndClose(step: number) {
            // You need to check if you can navigate to the step by checking if the PREVIOUS step is completed.
            // What a revelation.
            if (step <= mobileProgress.lastContiguousStep() + 1) {
                setStepNumber(step);
                onClose();
            }
        }

        // Map mobileCardCreationStepTitles to buttons
        return mobileCardCreationStepTitles.map((title, index) => {
            return (
                // There is no nice way to format this due to lint lol
                <Text
                    key={index}
                    onClick={() => {
                        changeStepAndClose(index);
                    }}
                    fontWeight={"800"}
                    fontSize={"24"}
                    fontFamily={"Barlow"}
                    paddingBottom={"15px"}
                    color={
                        index - 1 <= mobileProgress.lastContiguousStep()
                            ? "white"
                            : "gray.400"
                    }
                >
                    {(index + 1).toString().padStart(2, "0")}. {title}
                </Text>
            );
        });
    }

    /**
     * NavigationModal is a modal that displays the navigation options for the user
     * @returns The NavigationModal component
     */
    function NavigationModal() {
        const margin = "3%";
        return (
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                isCentered
                motionPreset="slideInLeft"
            >
                <ModalOverlay
                    bgColor={"#00000000"}
                    backdropFilter="blur(30px)"
                />
                <ModalContent w="100%" h="100%" borderRadius={0} bg="#00000000">
                    <ModalHeader>
                        <HStack
                            paddingLeft={margin}
                            paddingRight={margin}
                            paddingTop="8%"
                            alignItems="center"
                            align="center"
                        >
                            <Text
                                fontSize="28"
                                fontStyle="italic"
                                fontFamily="'Barlow Condensed', sans-serif"
                                textColor="green.100"
                            >
                                JUMP TO STEP
                            </Text>
                            <Spacer />
                            <CloseButton onClick={onClose} size="xl" />
                        </HStack>
                        <Divider
                            marginTop="14px"
                            marginBottom="4%"
                            bgColor="gray.400"
                        />
                    </ModalHeader>
                    <ModalBody>
                        <Box paddingLeft={margin} paddingRight={margin}>
                            <NavigationButtonArray />
                        </Box>
                    </ModalBody>
                    {/* A ModalFooter can go here if needed */}
                </ModalContent>
            </Modal>
        );
    }

    return (
        <>
            {/* Render a vertical stack */}
            <VStack
                backgroundColor={"#171C1B"}
                w={props.wProp}
                h={props.hProp}
                justifyContent={"space-between"}
                paddingY={"12px"}
                paddingX={"31px"}
                position={"fixed"}
                bottom={0}
                left={0}
                right={0}
                gap={0}
                // overflow="hidden"
            >
                {/* Render a horizontal stack with the step title and step number */}
                <HStack
                    w={"100%"}
                    justifyContent={"space-between"}
                    marginBottom={"15px"}
                >
                    {/* Display the step title */}
                    <Text
                        fontSize="xl"
                        fontWeight="bold"
                        color="white"
                        fontFamily={"Barlow"}
                    >
                        {mobileCardCreationStepTitles[stepNumber]}
                    </Text>
                    {/* Display the step number and total number of steps */}
                    <HStack>
                        <Text
                            fontSize="xl"
                            fontWeight="bold"
                            color="white"
                            letterSpacing="0.1em"
                            fontFamily={"Barlow"}
                        >
                            {(stepNumber + 1).toString().padStart(2, "0")}
                        </Text>
                        <Box
                            pt={1}
                            width="1px"
                            height="30px"
                            transform="skew(-15deg)"
                            bg="rgb(127,137,133)"
                            zIndex={1}
                        />
                        <Text
                            fontSize="xl"
                            fontWeight="bold"
                            color="rgb(127,137,133)"
                            letterSpacing="0.1em"
                            fontFamily={"Barlow"}
                        >
                            {mobileCardCreationSteps.length}
                        </Text>
                    </HStack>
                </HStack>
                {/* Render the current step */}
                <VStack w="100%" h={"100%"} justify={"center"}>
                    {mobileCardCreationSteps[stepNumber]}
                </VStack>

                <Divider mt={"17px"} mb={"6px"} />

                {/* Render a horizontal stack with navigation buttons */}
                <HStack w="100%" justify="space-between">
                    {/* Render the list button */}
                    <IconButton
                        fontSize={"3xl"}
                        color={"rgb(50,53,54)"}
                        backgroundColor={"rgba(0,0,0,0)"}
                        aria-label="Jump to Section Menu"
                        icon={<FaList />}
                        onClick={() => {
                            onOpen();
                        }}
                        variant="ghost"
                    />
                    {/* Render back and next buttons */}
                    <HStack>
                        <BackButton
                            text="Back"
                            onClick={() => {
                                if (stepNumber !== 0) {
                                    setStepNumber(stepNumber - 1);
                                } else {
                                    currentInfo.setCurCard({
                                        ...currentInfo.curCard,
                                        stepNumber: 1,
                                    });
                                }
                            }}
                        />
                        <NextButton
                            disableHoverGrow
                            text={onLastStep ? "Submit" : "Next"}
                            isLoading={isLoading}
                            isDisabled={nextButtonisDisabled}
                            onClick={async () => {
                                if (!onLastStep) {
                                    setStepNumber(stepNumber + 1);
                                } else {
                                    setIsLoading(true);

                                    /*

										IF USER IS SIGNED IN, REDIRECT TO THE PRICING PAGE

										IF USER IS NOT SIGNED IN, REDIRECT TO THE SIGN IN PAGE

									*/

                                    // Get the current authenticated user
                                    const user =
                                        await auth.currentAuthenticatedUser();

                                    // Get the user's ID
                                    const userID = user.userId;
                                    const result = await submitCardWithAuth({
                                        entireCardRef: props.entireCardRef,
                                        foregroundRef: props.foregroundRef,
                                        backgroundRef: props.backgroundRef,
                                        cardBackRef: props.cardBackRef,
                                        currentInfo: props.currentInfo,
                                        userID,
                                        isNil: props.isNil,
                                    });

                                    if (result === SubmitResult.GoToCheckout) {
                                        router.push("/checkout");
                                    } else if (
                                        result === SubmitResult.GoToSignup
                                    ) {
                                        router.push("/signup");
                                    } else if (
                                        result === SubmitResult.SkipCheckout
                                    ) {
                                        router.push(
                                            "/checkout/success?nil=true",
                                        );
                                    } else {
                                        console.error("Error submitting card!");
                                        setIsLoading(false);
                                    }
                                }
                            }}
                        />
                    </HStack>
                </HStack>
            </VStack>

            {/* Render the modal */}
            <NavigationModal />

            {/* Add the step progress tracker */}
            <StepProgressTracker />
        </>
    );
}
