import TradingCardInfo from "@/hooks/TradingCardInfo";
import { Button, Flex, Input, Text, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { RequestRedirect } from "node-fetch";
import { useAuth } from "@/hooks/useAuth";
import { CardActionModal } from "./cardActionModal";
import { apiEndpoints } from "@backend/EnvironmentManager/EnvironmentManager";

interface SendMyCardModalProps {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    currentCard: TradingCardInfo;
    fromName: string;
}

/**
 * The modal for sending a card to another user
 */
export default function SendMyCardModal(props: SendMyCardModalProps) {
    const toast = useToast();
    const auth = useAuth();
    const [accountUUID, setAccountUUID] = useState("");
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const card = props.currentCard;

    // Fetch the account UUID of the current user to be the sender of the card
    useEffect(() => {
        /**
         * Fetches the account UUID of the current user
         */
        async function fetchAccountUUID() {
            const user = await auth.currentAuthenticatedUser();
            setAccountUUID(user.userId);
        }

        fetchAccountUUID();
    });

    /**
     * Validates an email address
     * @param email The email to validate
     * @returns If the email is valid
     */
    function isValidEmail(email: string): boolean {
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
        return emailRegex.test(email);
    }

    /**
     * Sends the card to the recipient
     */
    async function tradeCardEmail() {
        // Validate email before sending
        if (!isValidEmail(email)) {
            toast({
                title: "Invalid Email",
                description: "Please enter a valid email address.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        setIsLoading(true);
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const uuidrequestOptions = {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify({ email: email }),
        };

        const response = await fetch(
            apiEndpoints.getUUID(),
            uuidrequestOptions,
        ); // change to prod
        const res = await response.json();
        const fetcheduuid = res.uuid;

        const prenewOwnUUID: string = await fetcheduuid;
        const newOwnUUID = prenewOwnUUID;

        const senderProfileRequestOptions = {
            method: "GET",
            headers: myHeaders,
        };

        const senderProfile = await fetch(
            `${apiEndpoints.getUser()}?uuid=${(await auth.currentAuthenticatedUser()).userId}`,
            senderProfileRequestOptions,
        );
        const senderProfileData = await senderProfile.json();
        const senderEmail = senderProfileData.email;

        const emailHeaders = new Headers();
        emailHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            recepientEmail: email,
            generatedByUUID: card.generatedBy,
            cardUUID: card.uuid,
            recepientUUID: newOwnUUID,
            fromUUID: accountUUID,
            cardFirstName: card.firstName,
            cardLastName: card.lastName,
            cardImage: card.cardImage,
            senderFirstName: props.fromName,
            fromEmail: senderEmail,
        });

        const requestOptions = {
            method: "POST",
            headers: emailHeaders,
            body: raw,
            redirect: "follow" as RequestRedirect,
        };

        if (newOwnUUID === accountUUID) {
            toast({
                title: "Cannot send card to yourself",
                description: "Please enter a valid email address.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });

            setIsLoading(false);
        } else if (newOwnUUID === card.generatedBy) {
            toast({
                title: "Cannot send card to creator",
                description: "Please enter a valid email address.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });

            setIsLoading(false);
        } else {
            await fetch(apiEndpoints.assignCardEmail(), requestOptions)
                .then((response) => {
                    return response.text();
                })
                .then(() => {
                    toast({
                        title: "Card Sent!",
                        description:
                            "Once the recipient accepts the card from their email, it will be added to their collection.",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                    });
                })
                .catch((error) => {
                    toast({
                        title: "Failed to send card",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                    });
                    return console.error("FAILED...", error);
                });

            setIsLoading(false);
            props.onClose();
        }
    }

    const emailInputComponent = (
        <Flex direction={"column"} gap="25px">
            <Flex direction={"column"} mb="1em">
                <Text fontSize="16px" mb="10px">
                    Recipient&apos;s Email Address:
                </Text>
                <Input
                    type="email"
                    placeholder="Enter Email Address"
                    variant={"profile"}
                    value={email}
                    onChange={(e) => {
                        return setEmail(e.target.value);
                    }}
                />
            </Flex>
            <Flex direction="row" w="100%" gap="25px">
                <Button variant="back" onClick={props.onClose}>
                    <Text>Cancel</Text>
                </Button>
                <Button
                    variant="next"
                    isLoading={isLoading}
                    onClick={tradeCardEmail}
                >
                    <Text>Send</Text>
                </Button>
            </Flex>
        </Flex>
    );

    return (
        <CardActionModal
            isOpen={props.isOpen}
            onClose={props.onClose}
            currentCard={props.currentCard}
            fromName={props.fromName}
            currentUserId={props.currentCard.generatedBy}
            cardAction={tradeCardEmail}
            title={"Light it up!"}
            subtitle={
                "Enter the recipient's email address to send them a copy of this card."
            }
            actionButtonText={"REQUEST TRADE"}
        >
            {emailInputComponent}
        </CardActionModal>
    );
}
