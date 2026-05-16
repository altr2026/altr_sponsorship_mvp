import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import { PostHogProvider } from "@/components/shared/posthog-provider";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
});

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  "https://altr-sponsorship-mvp.vercel.app";

const DEFAULT_TITLE = "ALTR — Sponsorship OS";
const DEFAULT_DESCRIPTION =
  "Sponsorship infrastructure for APAC and GCC live events, settled on XRPL. Discover events, deal directly with brands, settle in three seconds, measure ROI.";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: DEFAULT_TITLE,
    template: "%s — ALTR",
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: "ALTR",
  authors: [{ name: "ALTR" }],
  keywords: [
    "sponsorship",
    "XRPL",
    "APAC",
    "GCC",
    "live events",
    "brand sponsorship",
    "RLUSD",
  ],
  openGraph: {
    type: "website",
    siteName: "ALTR",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: APP_URL,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    creator: "@altr2026",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: APP_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="font-sans">
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
