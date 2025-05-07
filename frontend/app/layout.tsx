/* eslint-disable no-undef */
/* eslint-disable require-jsdoc */
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./Providers";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
// Trigger build

export const metadata: Metadata = {
    title: "OnFire Athletes",
    description: "Sports cards for the new era!",
    openGraph: {
        images: [
            "https://onfireathletes-media-uploads.s3.us-east-1.amazonaws.com/content/ofa-metadata-img.png",
        ],
    },
    twitter: {
        card: "summary_large_image",
        images: [
            "https://onfireathletes-media-uploads.s3.us-east-1.amazonaws.com/content/ofa-metadata-img.png",
        ],
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <meta
                    name="viewport"
                    content="height=device-height, width=device-width, initial-scale=1.0, minimum-scale=1.0, target-densitydpi=device-dpi"
                ></meta>
            </head>
            <body>
                <Providers>{children}</Providers>

                <GoogleTagManager gtmId="GTM-NRCRM7QX" />
                <GoogleAnalytics gaId="G-ZJV6CBJX4Q" />
            </body>
        </html>
    );
}
