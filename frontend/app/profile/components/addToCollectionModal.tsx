import emailjs from "@emailjs/browser";

import TradingCardInfo from "@/hooks/TradingCardInfo";
import { useToast } from "@chakra-ui/react";
import { CardActionModal } from "./cardActionModal";
import { apiEndpoints } from "@backend/EnvironmentManager/EnvironmentManager";
import { useState } from "react";

interface AddToCollectionModalProps {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    currentCard: TradingCardInfo;
    fromName: string;
    currentUserId: string;
}

/**
 * The component for requesting a card to be added to your collection
 */
export function AddToCollectionModal(props: AddToCollectionModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    /**
     * Sends the request to add the card to the user's collection
     */
    async function requestCardEmail() {
        try {
            if (isLoading) return;

            setIsLoading(true);

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            // Get the profile of the user who generated the card
            const uuidrequestOptions = {
                method: "GET",
                headers: myHeaders,
            };

            const generatedByProfile = await fetch(
                `${apiEndpoints.getUser()}?uuid=${props.currentCard.generatedBy}`,
                uuidrequestOptions,
            );
            const generatedByProfileData = await generatedByProfile.json();
            const generatedByEmail = generatedByProfileData.email;

            const requesterProfile = await fetch(
                `${apiEndpoints.getUser()}?uuid=${props.currentUserId}`,
                uuidrequestOptions,
            );
            const requesterProfileData = await requesterProfile.json();

            const requesterEmail = requesterProfileData.email;

            // Send the request to the creator of the card for thier card to be added to the user's collection
            const emailHeaders = new Headers();
            emailHeaders.append("Content-Type", "application/json");

            const { currentCard, currentUserId } = props;
            const { generatedBy, uuid, cardImage, firstName, lastName } =
                currentCard;
            const tradeURL = `https://onfireathletes.com/login?generatedByUUID=${generatedBy}&cardUUID=${uuid}&toUUID=${currentUserId}&fromUUID=${generatedBy}&requested=true`;

            const sendResponse = await emailjs.send(
                "service_8rtflzq",
                "template_65hpqx8",
                {
                    from_name: requesterEmail,
                    requesterName: `${requesterProfileData.first_name} ${requesterProfileData.last_name}`,
                    recipientName: generatedByProfileData.first_name,
                    toEmail: generatedByEmail,
                    tradeUrl: tradeURL,
                    cardImage: cardImage,
                    cardFirstName: firstName,
                    cardLastName: lastName,
                },
                { publicKey: "nOgMf7N2DopnucmPc" },
            );

            if (sendResponse.status === 200) {
                toast({
                    title: "Request Sent",
                    description:
                        "The creator has been notified of your request.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                props.onClose();
            } else {
                toast({
                    title: "Request Failed",
                    description:
                        "An error occurred while sending your request. Please try again later.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error("Error requesting card email", error);
            toast({
                title: "Request Failed",
                description:
                    "An error occurred while sending your request. Please try again later.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }

        setIsLoading(false);
    }

    return (
        <CardActionModal
            isOpen={props.isOpen}
            onClose={props.onClose}
            currentCard={props.currentCard}
            fromName={props.fromName}
            currentUserId={props.currentUserId}
            cardAction={requestCardEmail}
            title={"Light it up!"}
            subtitle={`Request to add the "${props.currentCard.firstName} ${props.currentCard.lastName}" card to your collection?`}
            actionButtonText={"REQUEST TRADE"}
        />
    );
}
