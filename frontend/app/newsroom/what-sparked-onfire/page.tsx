/* eslint-disable max-len */
"use client";
import React from "react";
import { Box, Center } from "@chakra-ui/layout";
import BackgroundImage from "../images/news3.png";
// import ArticleParagraph from "../components/paragraph";
// import ArticleSubtitle from "../components/subtitle";
// import ArticleListItem from "../components/list-item";
// import ArticleSpan from "../components/span";
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
                title="What Sparked ONFIRE?"
                image={BackgroundImage.src}
            />
            <ArticleBody>
                <Center color="white" pt={6}>
                    <ReturnHomeButton size="lg" />
                </Center>
            </ArticleBody>
        </Box>
    );
}
