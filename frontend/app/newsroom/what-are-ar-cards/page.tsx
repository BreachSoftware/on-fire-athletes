/* eslint-disable max-len */
"use client";
import React from "react";
import { Box, Center, UnorderedList, OrderedList } from "@chakra-ui/layout";
import ArticleParagraph from "../components/paragraph";
import ArticleSubtitle from "../components/subtitle";
import ArticleListItem from "../components/list-item";
import ArticleSpan from "../components/span";
import ArticleBody from "../components/article-body";
import ArticleHeader from "../components/article-header";
import ReturnHomeButton from "../components/home-button";
/**
 * The article page component.
 * @returns {JSX.Element} The article page component.
 */
export default function Article() {
    return (
        <Box w="full">
            <ArticleHeader
                title="What are “AR” Cards?"
                image={
                    "https://onfireathletes-media-uploads.s3.us-east-1.amazonaws.com/content/OA+-+AR+Blog+Featured+Image+-+Video+v2.mp4"
                }
                isVideo
            />
            <ArticleBody>
                <ArticleParagraph>
                    In today's world of digital innovation, Augmented Reality
                    (AR) is transforming the way we interact with both digital
                    and physical spaces. ONFIRE Athletes is harnessing this
                    technology to give users a cutting-edge experience with
                    personalized sports cards. Imagine owning a physical sports
                    card of yourself or a memorable athletic moment, and with a
                    simple scan, you can relive a video highlight directly from
                    that card. This is how ONFIRE Athletes is taking AR to the
                    next level by allowing athletes to merge physical
                    memorabilia with interactive digital content.
                </ArticleParagraph>
                <ArticleSubtitle>What is Augmented Reality?</ArticleSubtitle>
                <ArticleParagraph>
                    Augmented Reality (AR) enhances the real world by overlaying
                    digital content—such as images, animations, or videos—onto
                    physical objects, viewable through your phone. Unlike
                    Virtual Reality (VR), which immerses you in a completely
                    artificial world, AR enhances your physical surroundings
                    with interactive digital elements.
                </ArticleParagraph>
                <ArticleParagraph>
                    ONFIRE Athletes has tapped into AR technology to make sports
                    cards more than just collectibles. They've created a dynamic
                    way for athletes to showcase their skills and relive their
                    greatest moments right from a physical card.
                </ArticleParagraph>
                <ArticleSubtitle>
                    How ONFIRE Athletes Brings Sports Cards to Life
                </ArticleSubtitle>
                <ArticleParagraph>
                    Let's break down how the process works when you create a
                    personalized sports card with ONFIRE Athletes and how
                    Augmented Reality makes it more interactive:
                </ArticleParagraph>
                <OrderedList pl={{ base: 3, md: 12 }} spacing={4}>
                    <ArticleListItem>
                        <ArticleSpan fontWeight="bold">
                            Create Your Own Sports Card
                        </ArticleSpan>{" "}
                        ONFIRE Athletes allows users to design their own custom
                        sports cards. You can upload your favorite action shots
                        and personalize the card's design to reflect your style.
                        But what makes these cards stand out is the ability to
                        upload a highlight video. Whether it's a game-winning
                        goal, a stunning play, or a career highlight, this video
                        becomes an integral part of your card's digital
                        experience.
                    </ArticleListItem>
                    <ArticleListItem>
                        <ArticleSpan fontWeight="bold">
                            The QR Code: Your AR Trigger
                        </ArticleSpan>{" "}
                        Once your custom card is printed, it's not just a
                        regular card—it comes with a QR code on the back. This
                        QR code is the key to activating the Augmented Reality
                        experience. When your physical card arrives, you can
                        scan the QR code with your smartphone's camera,
                        launching the AR feature through the ONFIRE Athletes
                        platform.
                    </ArticleListItem>
                    <ArticleListItem>
                        <ArticleSpan fontWeight="bold">
                            Augmented Reality: Bringing the Video to Life
                        </ArticleSpan>{" "}
                        After scanning the QR code, the ONFIRE Athletes app
                        recognizes your specific card and triggers the AR
                        experience. Your card “comes to life” as the platform
                        overlays the video you uploaded directly onto your
                        phone's screen. Imagine showing your friends a physical
                        card and then watching their amazement as you scan it
                        and your highlight reel plays instantly on the screen.
                    </ArticleListItem>
                    <ArticleListItem>
                        <ArticleSpan fontWeight="bold">
                            Seamless Interaction
                        </ArticleSpan>{" "}
                        Not only does AR make your card more interactive, but it
                        also bridges the gap between physical and digital
                        memorabilia. With just a scan, you can showcase your
                        best athletic moments on your phone. This feature makes
                        your card a living memory, allowing others to view your
                        top plays whenever they see the card. It's a unique way
                        to blend the tangible satisfaction of owning a sports
                        card with the dynamic capabilities of modern technology.
                    </ArticleListItem>
                </OrderedList>
                <ArticleSubtitle>
                    The Technology Behind ONFIRE Athletes AR Experience
                </ArticleSubtitle>
                <ArticleParagraph>
                    ONFIRE Athletes uses AR technology to create a seamless
                    connection between your physical card and its digital
                    content. Here's how it works:
                </ArticleParagraph>
                <UnorderedList pl={{ base: 3, md: 12 }} spacing={4} mb={4}>
                    <ArticleListItem>
                        <ArticleSpan fontWeight="bold">
                            QR Code as a Trigger:
                        </ArticleSpan>{" "}
                        The QR code on the back of your card serves as the
                        “trigger” for the AR experience. When scanned, it tells
                        the app which video to pull from the database.
                    </ArticleListItem>
                    <ArticleListItem>
                        <ArticleSpan fontWeight="bold">
                            Recognition and Response:
                        </ArticleSpan>{" "}
                        The app uses the information from the QR code to
                        identify your card and link it to the specific video you
                        uploaded. This happens in real-time, ensuring a smooth
                        user experience.
                    </ArticleListItem>
                    <ArticleListItem>
                        <ArticleSpan fontWeight="bold">
                            Rendering the Video:
                        </ArticleSpan>{" "}
                        Once the video is identified, the app overlays it onto
                        your phone screen, creating the appearance that the
                        video is playing directly from your physical card. This
                        seamless blend of physical and digital content makes the
                        interaction feel immediate and immersive.
                    </ArticleListItem>
                </UnorderedList>
                <ArticleParagraph>
                    Traditional sports cards are cherished for their ability to
                    capture a moment in time, but ONFIRE Athletes has taken it a
                    step further. By integrating Augmented Reality, these cards
                    are no longer just static keepsakes—they're a dynamic,
                    living showcase.
                </ArticleParagraph>
                <Center color="white" pt={6}>
                    <ReturnHomeButton size="lg" />
                </Center>
            </ArticleBody>
        </Box>
    );
}
