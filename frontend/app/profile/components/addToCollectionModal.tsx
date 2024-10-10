import TradingCardInfo from "@/hooks/TradingCardInfo";
import { useToast } from "@chakra-ui/react";
import { RequestRedirect } from "node-fetch";
import { CardActionModal } from "./cardActionModal";
import { apiEndpoints } from "@backend/EnvironmentManager/EnvironmentManager";

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
    const toast = useToast();

    /**
     * Sends the request to add the card to the user's collection
     */
    async function requestCardEmail() {
        try {
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

            const raw = JSON.stringify({
                toEmail: generatedByEmail,
                requesterUUID: props.currentUserId,
                generatedByUUID: props.currentCard.generatedBy,
                cardUUID: props.currentCard.uuid,
                cardFirstName: props.currentCard.firstName,
                cardLastName: props.currentCard.lastName,
                cardImage: props.currentCard.cardImage,
                requesterEmail: requesterEmail,
                recipientFirstName: generatedByProfileData.first_name,
            });

            const requestOptions = {
                method: "POST",
                headers: emailHeaders,
                body: raw,
                redirect: "follow" as RequestRedirect,
            };

            const addToCollectionResponse = await fetch(
                apiEndpoints.addToCollectionEmail(),
                requestOptions,
            );

            if (addToCollectionResponse.status === 200) {
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
