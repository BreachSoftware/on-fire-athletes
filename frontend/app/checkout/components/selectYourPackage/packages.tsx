import { DatabasePackageNames } from "@/hooks/CheckoutInfo";
import { Box, Text } from "@chakra-ui/react";

export type PackageType = {
    title: string;
    databaseName: DatabasePackageNames;
    price: number;
    details: {
        text: string | React.ReactNode;
        indent?: boolean;
        isAddOn?: boolean;
    }[];
    defaultDigitalCardCount?: number;
    defaultPhysicalCardCount?: number;
};

const ProspectInfo: PackageType = {
    title: "PROSPECT",
    databaseName: DatabasePackageNames.PROSPECT,
    price: 19.99,
    defaultDigitalCardCount: 0,
    defaultPhysicalCardCount: 0,
    details: [
        {
            text: "1 Bag Tag of Your Card Design",
        },
        {
            text: "Build Your Own Athlete Profile",
        },
        {
            text: (
                <Text fontFamily="Barlow Condensed">
                    Add Additional Bag Tags to Your Purchase{" "}
                    <Box as="span" color="green.100">
                        for Only $19.99
                    </Box>
                </Text>
            ),
        },
    ],
};

// Our Rookie Package Information
const RookieInfo: PackageType = {
    title: "ROOKIE",
    databaseName: DatabasePackageNames.ROOKIE,
    price: 29.99,
    defaultDigitalCardCount: 0,
    defaultPhysicalCardCount: 1,
    details: [
        {
            text: "1 Physical Augmented Reality (AR) Card in Magnetic Case",
        },
        { text: "Build Your Own Athlete Profile" },
        {
            text: (
                <Text fontFamily="Barlow Condensed">
                    Add Additional Physical Augmented Reality (AR) Cards{" "}
                    <Box as="span" color="green.100">
                        for Only $24.99 Each
                    </Box>
                </Text>
            ),
            isAddOn: true,
        },
        {
            text: (
                <Text fontFamily="Barlow Condensed">
                    Add a Bag Tag{" "}
                    <Box as="span" color="green.100">
                        for Only $19.99
                    </Box>
                </Text>
            ),
            isAddOn: true,
        },
    ],
};

// Our All-Star Package Information
const AllStarInfo: PackageType = {
    title: "ALL-STAR",
    databaseName: DatabasePackageNames.ALL_STAR,
    price: 39.99,
    defaultDigitalCardCount: 15,
    defaultPhysicalCardCount: 1,
    details: [
        {
            text: "1 Physical Augmented Reality (AR) Card in Magnetic Case",
        },
        {
            text: "15 Digital Cards to Sell / Trade (You receive 75% of profit of cards sold)",
        },
        { text: "Build Your Own Athlete Profile" },
        {
            text: (
                <Text fontFamily="Barlow Condensed">
                    Add Additional Physical Augmented Reality (AR) Cards{" "}
                    <Box as="span" color="green.100">
                        for Only $24.99 Each
                    </Box>
                </Text>
            ),
            isAddOn: true,
        },
        {
            text: (
                <Text fontFamily="Barlow Condensed">
                    Add a Bag Tag{" "}
                    <Box as="span" color="green.100">
                        for Only $19.99
                    </Box>
                </Text>
            ),
            isAddOn: true,
        },
    ],
};

// Our AR Package Information
const MVPInfo: PackageType = {
    title: "MVP",
    databaseName: DatabasePackageNames.MVP,
    price: 79.99,
    defaultDigitalCardCount: 25,
    defaultPhysicalCardCount: 3,
    details: [
        {
            text: "Receive 10 Physical Cards With 3D and A/R Interactivity",
        },
        { text: "Receive 50 Digital Cards" },
        { text: "Ability to SELL and/or Trade Your Cards" },
        { text: "Athlete Receives 75% of Profits*", indent: true },
        { text: "Ability to Collect Cards" },
        { text: "Build Your Own Athlete Profile" },
    ],
};

export const packages: Record<DatabasePackageNames, PackageType> = {
    prospect: ProspectInfo,
    rookie: RookieInfo,
    allStar: AllStarInfo,
    mvp: MVPInfo,
};
