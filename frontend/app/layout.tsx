/* eslint-disable no-undef */
/* eslint-disable require-jsdoc */
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./Providers";

export const metadata: Metadata = {
	title: "OnFire Athletes",
	description: "Sports cards for the new era!",
};

export default function RootLayout({
	children,
}: {
  children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
