import { Button } from "@chakra-ui/button";
import { Box, Text } from "@chakra-ui/layout";
import PhotoFrame from "./photo_frame";
import { useRouter } from "next/navigation";

interface Props {
    item: {
        id: number;
        imageUrl: string;
        headline: string;
        description: string;
    };
}

/**
 * InTheNewsArticle
 * A shared component for the In The News section articles.
 * @returns {JSX.Element} The rendered InTheNewsArticle component.
 */
export default function InTheNewsArticle({ item }: Props) {
    const router = useRouter();

    return (
        <Box w="full" maxWidth={{ base: "none", md: "500px" }}>
            <PhotoFrame src={item.imageUrl} alt="News image" />
            <Text
                fontFamily="'Barlow Condensed', sans-serif"
                fontSize={{ base: "28px", xl: "44px" }}
                color="black"
                fontWeight={600}
                fontStyle="italic"
                letterSpacing="0.94px"
                mt={3}
            >
                {item.headline}
            </Text>
            <Text
                fontFamily="'Barlow', sans-serif"
                fontSize={{ base: "18px", md: "16px", xl: "23px" }}
                color="gray.600"
                fontWeight="medium"
                letterSpacing="0.46px"
                mb={4}
            >
                {item.description}
            </Text>
            <Button
                maxW={{ base: "50%", md: "80%", xl: "30%" }}
                _hover={{
                    md: {
                        maxW: { md: "90%", xl: "40%" },
                    },
                }}
                variant="next"
                fontSize="14px"
                fontFamily="'Barlow Condensed', sans-serif"
                letterSpacing="2px"
                onClick={() => {
                    router.push("/newsroom");
                }}
            >
                Learn More
            </Button>
        </Box>
    );
}
