"use client";
import {
    Box,
    Flex,
    HStack,
    useBreakpointValue,
    VStack,
} from "@chakra-ui/react";
import StepWrapper from "@/components/create/StepWrapper";
import Step1 from "@/components/create/Step1";
import Step2 from "@/components/create/Step2";
import Step3 from "@/components/create/Step3";
import Step4 from "@/components/create/Step4";
import Step5 from "@/components/create/Step5";
import Sidebar from "@/components/sidebar";
import NavBar from "@/app/navbar";
import OnfireCard from "@/components/create/OnFireCard/OnFireCard";
import { useCurrentCardInfo } from "@/hooks/useCurrentCardInfo";
import TradingCardInfo from "@/hooks/TradingCardInfo";
import { useEffect, useRef, useState } from "react";
import MobileStepWrapper from "@/components/create/mobile/MobileStepWrapper";

/**
 *
 * @returns the creation overview page
 */
export default function CreationOverview() {
    const currentInfo = useCurrentCardInfo();
    const cardFrontRef = useRef(null);
    const foregroundRef = useRef(null);
    const backgroundRef = useRef(null);
    const cardBackRef = useRef(null);
    useEffect(() => {
        currentInfo.setCurCard(new TradingCardInfo());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isMobile = useBreakpointValue({ base: true, lg: false });

    /**
     * Calculates the scale factor for the OnFire card on mobile screens
     * to ensure that the card fits on the screen
     *
     * @returns the scale factor for mobile screens
     */
    function calcMobileScaleFactor() {
        const cardHeight = 662;
        const navBarHeight = 66;
        const stepHeight = 224;
        const maxScaleFactor = 0.7;

        if (
            window.innerHeight >
            cardHeight * maxScaleFactor + navBarHeight + stepHeight
        ) {
            return maxScaleFactor;
        }

        const heightOfElements = navBarHeight + stepHeight;

        const remainingHeightForCard = window.innerHeight - heightOfElements;
        const scaleFactor = remainingHeightForCard / cardHeight;

        return scaleFactor;
    }

    const [screenScaleFactor, setScreenScaleFactor] = useState(1);
    useEffect(() => {
        // Wait 1 second before calculating the scale factor to ensure that the window has been resized
        setTimeout(() => {
            setScreenScaleFactor(calcMobileScaleFactor());
        }, 100);
    }, []);

    const CardCreationSteps = [
        {
            // Step 1
            step: <Step1 />,
            stepTitle: "SELECT YOUR LAYOUT",
        },
        {
            // Step 2
            step: <Step2 />,
            stepTitle: "YOUR INFORMATION",
        },
        {
            // Step 3
            step: <Step3 />,
            stepTitle: "UPLOAD MEDIA",
        },
        {
            // Step 4
            step: <Step4 />,
            stepTitle: "CUSTOMIZE",
        },
        {
            // Step 5
            step: <Step5 />,
            stepTitle: "Description",
        },
    ];

    return (
        <Box
            w={"100vw"}
            backgroundColor={isMobile ? "black" : "none"}
            bgGradient={
                isMobile
                    ? "none"
                    : "linear(180deg, gray.1200 0%, gray.1300 100%) 0% 0% no-repeat padding-box;"
            }
            minH={typeof window == "undefined" ? "100vh" : window.innerHeight} // making sure that the whole page is on screen at the same time
            overflowY={
                isMobile && currentInfo.curCard.stepNumber == 1
                    ? "hidden"
                    : "scroll"
            }
            overflowX={"hidden"}
        >
            <HStack w="100%" h="100%" align="top" spacing={0}>
                <VStack w="100%" flexGrow={1} height="100%">
                    <Flex
                        w="100%"
                        direction={"column"}
                        h={"100px"}
                        mb={{ base: 0, md: "48px" }}
                    >
                        <NavBar />
                    </Flex>
                    <HStack
                        w="100%"
                        alignItems="flex-start"
                        flexDirection={"row-reverse"}
                        justifyContent={
                            currentInfo.curCard.stepNumber === 1
                                ? "center"
                                : "space-evenly"
                        }
                        mt={"10px"}
                    >
                        {/* Don't show card on side if on step 1 */}
                        {currentInfo.curCard.stepNumber !== 1 && (
                            <Box
                                transform={
                                    isMobile
                                        ? `scale(${screenScaleFactor.toString()})`
                                        : ""
                                }
                                transformOrigin={"top center"}
                            >
                                <OnfireCard
                                    card={
                                        new TradingCardInfo({
                                            uuid: "de6c27b6-289a-4111-b259-d2a52d26804e",
                                            generatedBy:
                                                "f4a273f2-eed5-4be6-a7d8-ebaa60dcf7df",
                                            cardImage:
                                                "https://onfireathletes-media-uploads.s3.amazonaws.com/card/2bd87e66-bd1e-4ecf-aac8-c020b95d6f0a-1730304714012.png",
                                            cardBackS3URL:
                                                "https://onfireathletes-media-uploads.s3.amazonaws.com/card-back/f4a273f2-eed5-4be6-a7d8-ebaa60dcf7df-1730301718.png",
                                            stepNumber: 5,
                                            totalCreated: 15,
                                            currentlyAvailable: 15,
                                            createdAt: 1730221943,
                                            price: 0,
                                            cardType: "b",
                                            firstName: "Bentley",
                                            lastName: "Ramos",
                                            number: "18",
                                            sport: "Baseball",
                                            position: "Center Fielder",
                                            careerLevel: "Youth",
                                            teamName: "Lugnuts",
                                            frontPhotoURL:
                                                "https://i.ibb.co/82Fc8n8/bentley.png",
                                            frontPhotoS3URL: "",
                                            frontPhotoWidth: 251,
                                            frontPhotoHeight: 251,
                                            heroXOffset: 43,
                                            heroYOffset: 24,
                                            heroWidth: 306,
                                            cardForegroundS3URL: "",
                                            cardBackgroundS3URL: "",
                                            signature:
                                                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAiYAAACHCAYAAAAiEZIkAAAMXklEQVR4Ae3BC6zdBWEH4M//TmbLtb2ltEUEH+hE2vLUIlsrlCIPpZRX1PHQEKfTzBGRxYFAEJ+lccEFGc4Yo8vGlEVRoFewhVJKJy8RhsJtC5USZxFK6VrohepAlqVZuqbnnsftuef8zz2/73vVK6+8IiIiIqIMChERERElUYiIiIgoiUJERERESRQiIiIiSqIQERERURKFiIiIiJIoRERERJREISIiIqIkChERERElUYiIiIgoiUJERERESRQiIiIiSqIQERERURKFiIiIiJIoRERERJREISIiIqIkChERERElUYiIiIgoiUJERERESRQiIiIiSqIQERERURIVEd1hHC7DKXgDJmITnsPz2IwHsAy3Y0hERHSdiojyG4+fY7qdTcZkOxyF8223FJ/FvSIiomtURJTfFzFdc07ACViMT+IJERFReoWI8jvNyC3AvZghIiJKrxBRfvvaPdOwEgeLiIhSq4gyOQRb8bgdDsSl+FP8ifoexX34PNYaG8bZfZNxJ47GL0VERClVRKcdgfOxABNVN4h+jTkAB+CDeDduF/9nEpbicDwlIiJKpxCd8g7cjvtwDiYa3gxM1bwfYob4/16L74mIiFKqiHaZhM/iKByErZhidPVjBY7CamPXaZiNE3CY+o7BBfh7ERFRKoVoh/3xEC7ALIzDFO0xBSvwFmPXjbgIh+McvKC+z+FIERFRKhXRKgvwGcxEv3KZhk/jr4x938U6LMEEw5uIe/CvOA+bRURExxWiFebjJsxGv3L6IF6nN9yNE7BZfefgERwoIiI6rhCtcLHyew2u0DvuwVc05nVYgdeLiIiOqohWmKE9rsUiPGJX++NB9KvuCSzQW67GBZiqvmlYjMNERETHVEQr/MHuW4rP4EEjsw434yzV7Y3xmIpn9IatOBbLME19h+J0/EhERHREIVphtcY9b4etuBazcCIetHv+1vDG226R3vIwjsAjGvNhERHRMRXRCldgQGMmYBvejwGttR6bMNnwzsBHlNupuBAztcavcSS+gQ+qbQEmYbOIiGi7QrTCjzVmCDdhJgaMjiVqm6Tc5uMGzEY/+rXGED6E96nvAyIioiMqol3eirVG32dxlu51idF1PZbiBMO7CjfjNyIioq0K0S5rtcda3W260Xe9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dQr+BRPV9jCGxHCW4By1/SWWioiIYVVEoxbhNPQbHWfjbLyAPYy+LViHwzTmHju7F0PoV90Q7tU7LsIpmGB478PxuFVERFRViEatxvuxzejaQ3v04zCN+zs7W46H8JJdvYSHsFzvWI9j8aLalmKGiIioqhDNuBUfxja95Uo8alcn4y5swUt4CVtwF07We+7HLeq7SEREVFURzboO9+FqnGTs+wUuU93zmIt5ONJ292K53vV1nKG294qIiKoqYiQex3zsizMxBzNxgO40hD67+i1OxotqW47l4n8tw314p+FNFRERVVXE7liPK3GlXZ2Jj2Ge8uvDU3itHf4Z52OzaNa5eADjVfesiIioqiJGy3W4TnVvwQycjTOVw2ttdzG+hhfESK3GA5ijutUiIqKqiuiEX+FXWIyL8BG8H9N1xibcjM9jrWiFRVisui+LiIiqKqLTfo3Lcbn2m4HfY61otQEswCWYiZcxiIW4RUREVFURvWxQjKYBDIiIiIYVIiIiIkqiEBEREVEShYiIiIiSKERERESURCEiIiKiJAoRERERJVGIiIiIKIlCREREREkUIiIiIkqiEBEREVEShYiIiIiSKERERESURCEiIiKiJAoRERERJVGIiIiIKIlCREREREkUIiIiIkqiEBEREVEShYiIiIiS+B8xpSTEzOWZqAAAAABJRU5ErkJggg==",
                                            signatureS3URL: "",
                                            signatureXOffset: -117,
                                            signatureYOffset: 69,
                                            signatureWidth: 80,
                                            backVideoURL:
                                                "https://onfireathletes-media-uploads.s3.amazonaws.com/video/f4a273f2-eed5-4be6-a7d8-ebaa60dcf7df-1730301716.mov",
                                            backVideoS3URL: "",
                                            backVideoXOffset: -5,
                                            backVideoYOffset: -27,
                                            backVideoWidth: 1028.5,
                                            backVideoHeight: 578.53125,
                                            backVideoRotation: 360,
                                            borderColor: "#000000",
                                            backgroundAccentColor: "#3b3636",
                                            backgroundMainColor: "#000000",
                                            topCardTextColor: "#e51616",
                                            backgroundTextColor: "#FFFFFF",
                                            selectedBackground: 2,
                                            signatureColor: "#FFFFFF",
                                            NFTDescription:
                                                "Bentley Ramos \nBaton Rouge, LA \nCenter Fielder\n11U",
                                            firstNameSolid: true,
                                            lastNameSolid: true,
                                            nameFont:
                                                "'Brotherhood', sans-serif",
                                            nameColor: "#e51616",
                                            numberColor: "#FFFFFF",
                                            submitted: false,
                                            paymentStatus: 1,
                                            tradeStatus: 1,
                                            partsToRecolor: [0, 1, 2, 3, 4, 5],
                                        })
                                    }
                                    cardFrontRef={cardFrontRef}
                                    cardForegroundRef={foregroundRef}
                                    cardBackgroundRef={backgroundRef}
                                    cardBackRef={cardBackRef}
                                    mobileFlipButton={isMobile}
                                    showButton={!isMobile}
                                />
                            </Box>
                        )}
                        {isMobile && currentInfo.curCard.stepNumber !== 1 ? (
                            <MobileStepWrapper
                                hProp="224px"
                                wProp="100%"
                                entireCardRef={cardFrontRef}
                                cardBackRef={cardBackRef}
                                currentInfo={currentInfo}
                                foregroundRef={foregroundRef}
                                backgroundRef={backgroundRef}
                            />
                        ) : (
                            <Flex
                                w={{ base: undefined, lg: "45vw" }}
                                alignSelf="stretch"
                            >
                                <StepWrapper
                                    numSteps={5}
                                    cardCreationSteps={CardCreationSteps}
                                    entireCardRef={cardFrontRef}
                                    foregroundRef={foregroundRef}
                                    backgroundRef={backgroundRef}
                                    cardBackRef={cardBackRef}
                                />
                            </Flex>
                        )}
                    </HStack>
                </VStack>
                <Box
                    h={{ base: "0vh", md: "100vh" }}
                    display={{ base: "none", sm: "none", md: "inherit" }}
                >
                    <Sidebar height={"auto"} />
                </Box>
            </HStack>
        </Box>
    );
}
