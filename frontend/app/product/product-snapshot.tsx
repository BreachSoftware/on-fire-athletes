import SharedStack from "@/components/shared/wrappers/shared-stack";
import { Image, Text } from "@chakra-ui/react";
import React from "react";
import LightItUpCTAButton from "../components/buttons/light-it-up-button";

interface Props {
    imageSrc: string;
    title: string;
    description: string;
    reverse?: boolean;
    pricingComponent: React.ReactNode;
}

export default function ProductSnapshot({
    imageSrc,
    title,
    description,
    reverse = false,
    pricingComponent,
}: Props) {
    const isMVP = title === "MVP PACKAGE";

    if (reverse) {
        return (
            <SharedStack
                direction={{ base: "column-reverse", "2xl": "row" }}
                spacing={{ base: "36px", "2xl": isMVP ? "36px" : "74px" }}
                alignItems="center"
                pl={{ base: 0, "2xl": "96px" }}
                pr={{ base: 0, "2xl": isMVP ? "36px" : "150px" }}
            >
                <SharedStack display={{ base: "flex", "2xl": "none" }}>
                    <StartCreatingButton />
                </SharedStack>
                <SharedStack flex={1} fit gap={8}>
                    <TitleDescription title={title} description={description} />
                    {pricingComponent}
                </SharedStack>
                <SharedStack fit alignItems="center" gap="48px">
                    <Image
                        src={imageSrc}
                        alt={title}
                        w={{
                            base: isMVP ? "350px" : "250px",
                            md: isMVP ? "400px" : "280px",
                            "2xl": isMVP ? "600px" : "424px",
                        }}
                    />
                    <SharedStack
                        display={{ base: "none", "2xl": "flex" }}
                        alignItems={{ "2xl": "center" }}
                    >
                        <StartCreatingButton />
                    </SharedStack>
                </SharedStack>
            </SharedStack>
        );
    }

    return (
        <SharedStack
            direction={{ base: "column", "2xl": "row" }}
            alignItems="center"
            spacing={{ base: "36px", "2xl": "74px" }}
            pl={{ base: 0, "2xl": "36px" }}
            pr={{ base: 0, "2xl": "184px" }}
        >
            <Image
                src={imageSrc}
                alt={title}
                w={{ base: "250px", md: "280px", "2xl": "424px" }}
            />
            <SharedStack gap={8} fit>
                <TitleDescription title={title} description={description} />
                <SharedStack
                    direction={{ base: "column", "2xl": "row" }}
                    gap={8}
                    spaced
                    w="full"
                    alignItems={{ base: "flex-start", "2xl": "center" }}
                >
                    {pricingComponent}
                    <StartCreatingButton />
                </SharedStack>
            </SharedStack>
        </SharedStack>
    );
}

function TitleDescription({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <SharedStack gap={1} fit>
            <Text
                fontFamily="Brotherhood, Regular"
                fontSize={{ base: "30px", "2xl": "90px" }}
                color="green.100"
                letterSpacing="0.9px"
                w="full"
                lineHeight={{ base: "46px", "2xl": "initial" }}
            >
                {title}
            </Text>
            <Text
                fontSize={{ base: "16px", "2xl": "28px" }}
                color="white"
                fontFamily="Barlow Condensed"
                fontWeight="medium"
                fontStyle="italic"
                w="full"
            >
                {description}
            </Text>
        </SharedStack>
    );
}

function StartCreatingButton() {
    return (
        <LightItUpCTAButton
            link="/create/card_creation"
            w={{ base: "200px", "2xl": "330px" }}
            h={{ base: "40px", "2xl": "61px" }}
            fontSize={{ base: "12px", "2xl": "23px" }}
            color="white"
            fontWeight="regular"
        >
            START CREATING
        </LightItUpCTAButton>
    );
}
