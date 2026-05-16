import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import { Footer } from "@/components/shared/footer";
import { TopNav } from "@/components/shared/top-nav";

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

export const metadata: Metadata = {
  title: "ALTR — Sponsorship OS",
  description:
    "Sponsorship infrastructure for APAC and GCC live events, settled on XRPL.",
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
      <body className="flex min-h-screen flex-col font-sans">
        <TopNav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
