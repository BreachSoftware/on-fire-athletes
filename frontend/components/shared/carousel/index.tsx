import { Box, BoxProps } from "@chakra-ui/layout";
import { useState, ReactElement } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

import CarouselDots from "./dots";
import CarouselArrow from "./arrow";
import CarouselLeftIcon from "@/components/icons/carousel-left";
import CarouselRightIcon from "@/components/icons/carousel-right";

interface Props {
    children: ReactElement[];
    isLightMode?: boolean;
    containerOverrides?: BoxProps;
    arrowTopPosition?: string;
    hideDots?: boolean;
}

/**
 * SharedCarousel
 * A shared carousel component that can be used in multiple places.
 * @param {React.ReactElement[]} children
 * @returns {JSX.Element} The rendered carousel
 */
export default function SharedCarousel({
    containerOverrides,
    isLightMode,
    hideDots,
    arrowTopPosition,
    children,
}: Props) {
    const [selectedIndex, setSelectedIndex] = useState(0); // State to track the active slide

    return (
        <Box {...containerOverrides}>
            <Carousel
                autoPlay={false}
                axis="horizontal"
                showStatus={false}
                showIndicators={false}
                showThumbs={false}
                swipeable={true}
                emulateTouch={true}
                swipeScrollTolerance={10}
                preventMovementUntilSwipeScrollTolerance={true}
                onChange={(index) => {
                    setSelectedIndex(index);
                }}
                renderArrowPrev={(onClick, hasPrev) => {
                    return (
                        <CarouselArrow
                            icon={<CarouselLeftIcon />}
                            topPosition={arrowTopPosition}
                            isLightMode={isLightMode}
                            isPrev
                            onClick={onClick}
                            isDisabled={!hasPrev}
                        />
                    );
                }}
                renderArrowNext={(onClick, hasNext) => {
                    return (
                        <CarouselArrow
                            icon={<CarouselRightIcon />}
                            topPosition={arrowTopPosition}
                            isLightMode={isLightMode}
                            onClick={onClick}
                            isDisabled={!hasNext}
                        />
                    );
                }}
            >
                {children}
            </Carousel>
            {!hideDots && (
                <CarouselDots
                    selectedIndex={selectedIndex}
                    isLightMode={isLightMode}
                    itemsLength={children.length}
                />
            )}
        </Box>
    );
}
