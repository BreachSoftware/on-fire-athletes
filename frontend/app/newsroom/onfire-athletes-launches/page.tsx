/* eslint-disable max-len */
"use client";
import React from "react";
import { Box, Center } from "@chakra-ui/layout";
import BackgroundImage from "../images/news1.png";
import ArticleHeader from "../components/article-header";
import ArticleBody from "../components/article-body";
import ArticleParagraph from "../components/paragraph";
import ArticleSpan from "../components/span";
import ReturnHomeButton from "../components/home-button";
/**
 * The article page component.
 * @returns {JSX.Element} The article page component.
 */
export default function Article() {
    return (
        <Box w="full">
            <ArticleHeader
                title="GAME COIN LAUNCHES PLATFORM!"
                image={BackgroundImage.src}
            />
            <ArticleBody>
                <ArticleParagraph>
                    <ArticleSpan fontWeight="bold">
                    Game Coin Launches its ONFIRE ATHLETES Platform, Merging Digital and Physical Sports Cards with Augmented Reality 
                    </ArticleSpan>{" "}
                </ArticleParagraph>
                <ArticleParagraph>   
                    Game Coin, proudly announces the official launch of its
                        platform, ONFIRE ATHLETES, which incorporates
                        groundbreaking technology with the nostalgia of
                        traditional sports trading cards, combining the best of
                        both worlds. 
                </ArticleParagraph>
                
                <ArticleParagraph>             
                        Years in the making, the ONFIRE ATHLETES
                        platform empowers athletes to create, showcase, share,
                        and print personalized sports cards that come to life
                        through Augmented Reality (AR).     
                </ArticleParagraph>

                <ArticleParagraph>
                    ONFIRE ATHLETES is unlike any other platform, enabling
                    athletes of all levels—from Heisman hopefuls and World
                    Series MVPs to little leaguers and dance teams and every
                    athlete in between —to create and print their own custom
                    cards which can be shared or sold. Each physical card is
                    crafted using high-end materials, and comes with AR capabilities, 
                    giving fans an interactive experience like never before. By 
                    making this advanced technology accessible to every athlete, ONFIRE
                    ATHLETES empowers anyone to build their brand, engage fans,
                    fund raise and create memorable collectibles.
                </ArticleParagraph>

                <ArticleParagraph>
                    “After beta tests and invaluable feedback from our
                    community, I am thrilled to launch ONFIRE ATHLETES,” said
                    David Mahler, Founder and CEO of Game Coin, LLC. “Our
                    platform is built to bring athletes closer to their friends,
                    family, and fans through an immersive and personalized
                    experience. This launch is just the beginning, and we are
                    excited to see ONFIRE ATHLETES evolve as we continue to
                    grow.”
                </ArticleParagraph>
                <ArticleParagraph>
                    Through the end of the year, ONFIRE ATHLETES will
                    concentrate on gathering user insights and refining the
                    platform to ensure a seamless experience for all users. As
                    part of this phase, ONFIRE ATHLETES is also offering NIL
                    (Name, Image, Likeness) partnerships with verified
                    collegiate athletes, allowing them to create their custom
                    sports cards free of charge. This initiative supports
                    college athletes in building their brand while connecting
                    with fans in new ways. The feedback from these users will be
                    vital as ONFIRE ATHLETES prepares for a major marketing and
                    advertising campaign launching in 2025 to reach an even
                    broader audience.
                </ArticleParagraph>

                <ArticleParagraph>
                    Reflecting on the development process, Mahler noted, “In
                    2021 GMEX, a crypto currency now held by nearly 10,000
                    account holders, was launched as a utility token to be used
                    on a platform envisioned to connect athletes with their
                    fans, friends, and family. Bringing that vision to life was
                    slowed by unforeseen obstacles, detours and diligence on how
                    best to implement the platform, which took longer than
                    expected. However, those challenges only made us and the
                    platform better and more resilient. We’re launching a
                    platform that’s not only robust and accessible but
                    sustainable.”
                </ArticleParagraph>
                <ArticleParagraph>
                    In mid-2023, Game Coin strategically acquired VerifiedInk, a
                    platform that enabled athletes to create/mint NFT’s. The
                    acquisition was fueled by VerifiedInk’s impressive,
                    augmented reality (AR) technology, which seamlessly
                    complemented Game Coin’s advanced digital card creation
                    platform.
                </ArticleParagraph>
                <ArticleParagraph>
                    This acquisition of VerifiedInk allowed Game Coin to not
                    just offer a digital asset as originally planned but also to
                    offer a physical sports card with AR capabilities using Game
                    Coin’s robust customization tools. The platform now offers a
                    unique “full circle” experience, where athletes can create
                    not only highly customizable digital sports cards, but also
                    physical cards embedded with digital technology and
                    custom print details.
                </ArticleParagraph>
                <ArticleParagraph>
                    “We've given users not just a unique digital asset but also
                    a one-of-a-kind physical asset enhanced with AR features,”
                    said Mahler. “This combination brings both digital assets
                    and physical cards together, creating an experience that’s
                    unlike anything seen in the sports and collectibles world.”
                </ArticleParagraph>
                <ArticleParagraph>
                    Game Coin’s ONFIRE ATHLETES platform also bridges the gap
                    between crypto and mainstream users by operating as a hybrid
                    platform. “We’ve never seen a platform where athletes can
                    create both custom digital and physical sports cards that
                    connect the crypto and non-crypto payment worlds,” added
                    Mahler. “By accommodating dual payment options, the platform
                    will accommodate a broader user base and a more diverse
                    audience.”
                </ArticleParagraph>

                <ArticleParagraph>
                    By consolidating VerifiedInk’s offerings, Game Coin acquired
                    a competitor in the digital sports card space while
                    enhancing its own product lineup. This strategic acquisition
                    strengthens Game Coin’s position and expands its reach by
                    combining Verified Ink’s loyal user base with nearly 10,000
                    GMEX token holders.
                </ArticleParagraph>
                <ArticleParagraph>
                    Mahler also announced that “GMEX token holders transacting
                    on the ONFIRE ATHLETES platform will receive a 20% discount
                    on their purchases. Additionally, on credit card
                    transactions, 20% of the gross sales will be used to
                    purchase GMEX tokens, which will then be retired, benefiting
                    token holders by increasing the GMEX liquidity pool and
                    creating greater scarcity of the GMEX token.”
                </ArticleParagraph>
                <ArticleParagraph>
                    ONFIRE ATHLETES combines traditional sports cards with an
                    interactive AR experience to make each sports card an
                    authentic and unique physical and digital asset that will
                    redefine the fan-athlete connection for the modern era.
                </ArticleParagraph>
                <Center color="white" pt={6} pb={4}>
                    <ReturnHomeButton size="lg" />
                </Center>
            </ArticleBody>
        </Box>
    );
}
