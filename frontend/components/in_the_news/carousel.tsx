import { Box } from "@chakra-ui/layout";
import SharedCarousel from "../shared/carousel";
import InTheNewsArticle from "./article";

interface Props {
    items: {
        id: number;
        imageUrl: string;
        headline: string;
        description: string;
        link: string;
    }[];
}

/**
 * InTheNewsCarousel
 * A shared component for the In The News section carousel on mobile views.
 * @param {Props} items
 * @returns {JSX.Element} The rendered InTheNewsCarousel component.
 */
export default function InTheNewsCarousel({ items }: Props) {
    return (
        <SharedCarousel
            containerOverrides={{
                display: { base: "block", lg: "none" },
                w: "100dvw",
                px: "12px",
            }}
            isLightMode
            arrowTopPosition="25%"
        >
            {items.map((item) => {
                return (
                    <Box key={item.id} px="40px">
                        <InTheNewsArticle item={item} />
                    </Box>
                );
            })}
        </SharedCarousel>
    );
}
