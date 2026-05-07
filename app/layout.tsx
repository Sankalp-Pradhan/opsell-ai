import type { Metadata } from "next";
import {
  Plus_Jakarta_Sans,
  DM_Sans,
  JetBrains_Mono,
} from "next/font/google";

import "./globals.css";

import Navbar from "./home/nav";
import CTA from "./home/cta";
import Footer from "./home/footer";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://opsell.in"), // replace with actual domain

  title: {
    default: "Opsell | AI Powered Product Platform",
    template: "%s | Opsell",
  },

  description:
    "Opsell is an AI-powered product platform designed to help businesses scale smarter with automation, insights, and intelligent workflows.",

  keywords: [
    "Opsell",
    "AI platform",
    "AI SaaS",
    "automation",
    "AI products",
    "startup",
    "business automation",
    "productivity",
    "analytics",
    "workflow automation",
  ],

  authors: [{ name: "Opsell Team" }],
  creator: "Sankalp Pradhan",
  publisher: "Sankalp Pradhan",

  applicationName: "Opsell",

  category: "technology",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  

  openGraph: {
    title: "Opsell | AI Powered Product Platform",
    description:
      "Scale smarter with AI-powered workflows, automation, and insights.",
    url: "https://opsell.in",
    siteName: "Opsell",
    images: [
      {
        url: "/opsell-gi.png", // place inside /public
        width: 1200,
        height: 630,
        alt: "Opsell",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Opsell | AI Powered Product Platform",
    description:
      "Scale smarter with AI-powered workflows, automation, and insights.",
    creator: "@opsell", // replace if needed
    images: ["/opsell-gi.png"],
  },




  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Opsell",
  },

  formatDetection: {
    telephone: false,
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
      className={`${plusJakarta.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col antialiased bg-white text-n-900 font-body">
        <Navbar />

        <main className="flex-1">{children}</main>

        <CTA />
        <Footer />
      </body>
    </html>
  );
}