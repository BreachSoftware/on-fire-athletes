import { Metadata } from "next";
import { getCard } from "../generate_card_asset/cardFunctions";

export async function generateMetadata({
    searchParams,
}: {
    searchParams: { card?: string; user?: string };
}): Promise<Metadata> {
    const cardId =
        typeof searchParams.card === "string" ? searchParams.card : undefined;
    const userId =
        typeof searchParams.user === "string" ? searchParams.user : undefined;

    if (cardId && userId) {
        try {
            const card = await getCard(cardId, userId);
            if (card) {
                return {
                    title: `${card.firstName} ${card.lastName}`,
                    description: `View ${card.firstName} ${card.lastName}'s trading card`,
                    openGraph: {
                        title: `${card.firstName} ${card.lastName}`,
                        description: `View ${card.firstName} ${card.lastName}'s trading card`,
                        images: [card.cardImage],
                        type: "profile",
                    },
                    twitter: {
                        card: "summary_large_image",
                        title: `${card.firstName} ${card.lastName}`,
                        description: `View ${card.firstName} ${card.lastName}'s trading card`,
                        images: [card.cardImage],
                    },
                };
            }
        } catch (error) {
            console.error("Error fetching card for metadata:", error);
        }
    }

    return {
        title: "Profile | OnFire Athletes",
        description: "View and manage your athlete profile and trading cards",
        openGraph: {
            title: "Profile | OnFire Athletes",
            description:
                "View and manage your athlete profile and trading cards",
            type: "profile",
            siteName: "OnFire Athletes",
        },
        twitter: {
            card: "summary",
            title: "Profile | OnFire Athletes",
            description:
                "View and manage your athlete profile and trading cards",
        },
    };
}
