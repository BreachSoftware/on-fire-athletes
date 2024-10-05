/* eslint-disable max-len */
"use client";
import React from "react";
import { Box, Center } from "@chakra-ui/layout";
import BackgroundImage from "../images/news1.png";
import ArticleHeader from "../components/article-header";
import ArticleBody from "../components/article-body";
import ArticleParagraph from "../components/paragraph";
import ArticleSpan from "../components/span";
import ArticleSubtitle from "../components/subtitle";
import ReturnHomeButton from "../components/home-button";
/**
 * The article page component.
 * @returns {JSX.Element} The article page component.
 */
export default function Article() {
    return (
        <Box w="full">
            <ArticleHeader
                title="ONFIRE ATHLETES LAUNCHES!"
                image={BackgroundImage.src}
            />
            <ArticleBody>
                <ArticleParagraph>
                    <ArticleSpan fontWeight="bold">
                        ONFIRE Athletes,
                    </ArticleSpan>{" "}
                    fueled by Game Coin, is introducing a platform where
                    athletes of all backgrounds can immortalize their pivotal
                    moments. Whether it's the first time they held a bat, scored
                    a game-winning goal, or achieved a career-defining victory,
                    ONFIRE Athletes offers a way to ensure those memories are
                    never forgotten.
                </ArticleParagraph>
                <ArticleSubtitle>Capturing the Moment</ArticleSubtitle>
                <ArticleParagraph>
                    “Every athlete has a story,” the founders of ONFIRE Athletes
                    explain. “They all have a moment—the one that defines them.
                    Too often, these moments get lost in the noise of social
                    media, swiped away and forgotten.”
                </ArticleParagraph>
                <ArticleParagraph>
                    But ONFIRE Athletes asks a bold question: What if we could
                    capture that moment forever? The platform combines the
                    nostalgia of traditional sports card trading with modern
                    technology, allowing athletes to save and showcase their
                    defining moments in a way that's both tangible and lasting.
                    It's more than just a social media post; it's a personal
                    legacy, held in the palm of your hand.
                </ArticleParagraph>
                <ArticleSubtitle>
                    A New Way to Build Your Legacy
                </ArticleSubtitle>
                <ArticleParagraph>
                    Through ONFIRE Athletes, users can create their own custom
                    sports cards. This isn't just for the elite
                    professionals—it's for everyone. From kids in community
                    leagues to aspiring athletes in high school and college, the
                    platform is designed to democratize the process of building
                    a personal brand. “What if you didn't need a PR firm, an NIL
                    deal, or professional representation?” the creators of
                    ONFIRE Athletes ask. “What if you could create your own
                    hype, your own sports card, and chart your own success?”
                </ArticleParagraph>
                <ArticleParagraph>
                    This revolutionary approach gives athletes full control of
                    their narratives, allowing them to preserve their
                    achievements without gatekeepers.
                </ArticleParagraph>
                <ArticleSubtitle>
                    Empowering the Future of Sports
                </ArticleSubtitle>
                <ArticleParagraph>
                    ONFIRE Athletes is built on a mission to remove barriers and
                    increase access to sports participation for all kids. “Too
                    many young athletes are overlooked or never given a chance
                    to fully participate in sports, despite the clear benefits,”
                    the company emphasizes. By providing a platform where every
                    athlete can shine, ONFIRE Athletes is committed to changing
                    the narrative.
                </ArticleParagraph>
                <ArticleParagraph>
                    The physical, social, and academic benefits of sports are
                    well-documented, yet opportunities often remain limited to
                    certain groups. ONFIRE Athletes aims to bring attention to
                    every athlete, no matter where they come from or which sport
                    they play. “The court, the field, the arena—they don't care
                    where you're from. The athlete is all that matters.”
                </ArticleParagraph>
                <ArticleSubtitle>
                    Combining Nostalgia with Technology
                </ArticleSubtitle>
                <ArticleParagraph>
                    At the heart of ONFIRE Athletes' innovation is a platform
                    that blends the nostalgia of traditional sports cards with
                    cutting-edge technology. Athletes can fully customize their
                    cards, trade them, or sell them on the platform's Locker
                    Room Marketplace. What sets these cards apart is their
                    unique integration with augmented reality (AR), bringing
                    physical sports cards to life in a way that's never been
                    done before.
                </ArticleParagraph>
                <ArticleParagraph>
                    The AR feature allows athletes to showcase their best
                    moments by scanning their physical card, which then plays a
                    video highlight, creating a dynamic and interactive
                    experience. “It's a sports card you can hold, and it's a
                    moment you can relive,” say the founders.
                </ArticleParagraph>
                <ArticleSubtitle>A Global Vision</ArticleSubtitle>
                <ArticleParagraph>
                    With a commitment to inclusion and accessibility, ONFIRE
                    Athletes is making this platform available to athletes
                    across every sport, every level, and every country. This
                    isn't just about building a personal brand—it's about
                    creating a lasting legacy that transcends boundaries. ONFIRE
                    Athletes is leading the way for the future of athlete-driven
                    content, where the story is in their hands—literally.
                </ArticleParagraph>
                <ArticleParagraph>
                    As the sports world continues to evolve, ONFIRE Athletes is
                    setting the stage for a new era, where every athlete, no
                    matter their background, has the opportunity to capture,
                    share, and celebrate their story.
                </ArticleParagraph>
                <Center color="white" pt={6} pb={4}>
                    <ReturnHomeButton size="lg" />
                </Center>
            </ArticleBody>
        </Box>
    );
}
