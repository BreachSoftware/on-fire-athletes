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
    defaultBagTagCount?: number;
};

const ProspectInfo: PackageType = {
    title: "PROSPECT",
    databaseName: DatabasePackageNames.PROSPECT,
    price: 19.99,
    defaultDigitalCardCount: 0,
    defaultPhysicalCardCount: 0,
    defaultBagTagCount: 1,
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
    defaultBagTagCount: 0,
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
    price: 0,
    defaultDigitalCardCount: 0,
    defaultPhysicalCardCount: 0,
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
    price: 59.99,
    defaultDigitalCardCount: 50,
    defaultPhysicalCardCount: 10,
    defaultBagTagCount: 1,
    details: [
        {
            text: (
                <Text fontFamily="Barlow Condensed" color="green.100">
                    A One-Year ONFIRE INSIDER Subscription (See below for
                    details)
                </Text>
            ),
        },
        { text: "3 Physical Augmented Reality (AR) Cards" },
        {
            text: "One card in Magnetic Case, Two cards in Top Loader Case",
            indent: true,
        },
        {
            text: "25 Digital Cards to Sell / Trade (You received 75% of profit of cards sold)",
        },
        { text: "1 Bag Tag of Your Card Design" },
        { text: "Build Your Own Athlete Profile" },
        {
            text: "Add Additional Physical Augmented Reality (AR) Cards for only $24.99 each",
            isAddOn: true,
        },
        {
            text: "Add Additional Digital Cards $1.00 / 5",
            isAddOn: true,
        },
        {
            text: "Add a Bag Tag for only $19.99",
            isAddOn: true,
        },
    ],
};

export const packages: Record<DatabasePackageNames, PackageType> = {
    prospect: ProspectInfo,
    rookie: RookieInfo,
    allStar: AllStarInfo,
    mvp: MVPInfo,
};
