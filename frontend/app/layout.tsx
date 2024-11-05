/* eslint-disable no-undef */
/* eslint-disable require-jsdoc */
import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { Providers } from "./Providers";

export const metadata: Metadata = {
    title: "OnFire Athletes",
    description: "Sports cards for the new era!",
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
            </body>
            <GoogleAnalytics gaId="G-F76G8L172V" />
        </html>
    );
}
