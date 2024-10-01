import { CardPart } from "@/hooks/TradingCardInfo";
import { useCurrentCardInfo } from "@/hooks/useCurrentCardInfo";
import {
    Button,
    Image,
    Modal,
    ModalBody,
    ModalContent,
    ModalOverlay,
    useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { CARD_BACKGROUNDS } from "../card-backgrounds";

/**
 * This component is used to pick the background for the mobile view of the create page.
 */
export default function MobileBackgroundPicker() {
    const [selectedBackground, setSelectedBackground] = useState(0);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const cardHook = useCurrentCardInfo();

    /**
     *
     * A function to render a background selector button
     *
     * @param index The index of the background to render
     * @returns the background selector button
     */
    function backgroundSelector(index: number) {
        return (
            <Button
                key={index}
                height={"100px"}
                width={"30%"}
                border={
                    selectedBackground === index
                        ? "2px solid var(--chakra-colors-green-100)"
                        : ""
                }
                borderRadius={"5px"}
                p="5px"
                onClick={() => {
                    const myArr = cardHook.curCard.partsToRecolor;
                    if (!myArr.includes(CardPart.BACKGROUND)) {
                        myArr.push(CardPart.BACKGROUND);
                    }
                    cardHook.setCurCard({
                        ...cardHook.curCard,
                        selectedBackground: index,
                        partsToRecolor: myArr,
                    });
                    cardHook.curCard.selectedBackground = index;
                    return setSelectedBackground(index);
                }}
            >
                <Image
                    src={`/card_backgrounds/${CARD_BACKGROUNDS[index].src}`}
                    bg={"#888"}
                    objectFit={"cover"}
                    height={"100%"}
                    width={"100%"}
                    alt={`Background ${index + 1}`}
                    borderRadius={"5px"}
                    style={{
                        filter: `brightness(${selectedBackground === index ? "100%" : "70%"})`,
                    }}
                    draggable={false}
                />
            </Button>
        );
    }

    return (
        <>
            <Button onClick={onOpen} variant="white">
                Select Background
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalBody>
                        {Array.from({ length: 6 }, (_, i) => {
                            return backgroundSelector(i);
                        })}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}
