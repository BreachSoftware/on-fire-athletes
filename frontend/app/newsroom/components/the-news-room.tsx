import Image from "next/image";
import { Text, HStack } from "@chakra-ui/layout";
import { Image as ChakraImage } from "@chakra-ui/image";

import the from "../../../public/the_locker_room/The.svg";

export default function TheNewsRoomTitle() {
    return (
        <HStack alignItems="flex-start" w="fit-content">
            <ChakraImage
                as={Image}
                src={the}
                alt="The"
                height={{
                    base: "54px",
                    sm: "72px",
                    md: "80px",
                    xl: "132px",
                }}
                w="fit-content"
            />
            <Text
                fontFamily="Barlow Condensed"
                fontSize={{ base: "56px", sm: "72px", md: "80px", xl: "125px" }}
                fontWeight="bold"
                letterSpacing={{ base: "1.25px", xl: "6.25px" }}
                color="#313131"
                lineHeight="90%"
                style={{
                    WebkitTextStrokeWidth: "1px",
                    WebkitTextStrokeColor: "#27CE00",
                    textShadow: "0px 0px 10px #27CE00BF",
                }}
            >
                NEWS ROOM
            </Text>
        </HStack>
    );
}
