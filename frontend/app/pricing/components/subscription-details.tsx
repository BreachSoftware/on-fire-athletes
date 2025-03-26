import SharedStack from "@/components/shared/wrappers/shared-stack";
import { Box, StackProps, Text } from "@chakra-ui/react";

export default function SubscriptionDetails() {
    return (
        <SharedStack
            pl={{ base: "16px", lg: "54px" }}
            gap={0}
            color="white"
            fontSize="10px"
            fontFamily="Barlow"
            fontWeight="medium"
            maxW="340px"
        >
            <Label>INCLUDES</Label>
            <BulletedList
                labels={[
                    "Create an Unlimited Amount of Digital Cards to Sell & Trade",
                    "First Access to new backgrounds and special drops",
                    "Ability to participate and win prizes in Player of the Week",
                    "Special Discounts on future purchases",
                ]}
            />
            <Box pl="16px">
                <Label hasBullet>Physical AR Card:</Label>
                <BulletedList
                    labels={[
                        "Buy AR cards for only $14.99 each. (Save 50% off retail!)",
                        "Buy 6 or more AR cards for only $9.99 each. (Save over 60% off retail!)",
                    ]}
                    pl="16px"
                />
                <Label hasBullet>Bag Tags:</Label>
                <BulletedList
                    labels={["$14.99 each (Save 25% off retail!)"]}
                    pl="16px"
                />
            </Box>
            <BulletedList
                labels={[
                    "Subscription Auto-Renews one year from date of purchase for $5.99 per month",
                ]}
            />
        </SharedStack>
    );
}

function Label({
    children,
    hasBullet,
}: {
    children: React.ReactNode;
    hasBullet?: boolean;
}) {
    return (
        <Text>
            {hasBullet ? "•" : ""}{" "}
            <Text as="span" textDecoration="underline">
                {children}
            </Text>
        </Text>
    );
}

function BulletedList({ labels, ...rest }: { labels: string[] } & StackProps) {
    return (
        <SharedStack gap={0} {...rest}>
            {labels.map((label) => (
                <Text fontSize="10px" color="white" key={label}>
                    • {label}
                </Text>
            ))}
        </SharedStack>
    );
}
