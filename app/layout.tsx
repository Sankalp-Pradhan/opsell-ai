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
import Script from "next/script";

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
  metadataBase: new URL("https://opsell.ai"),

  title: {
    default: "Opsell AI | Agentic Commerce & Marketplace Growth Platform",
    template: "%s | Opsell AI",
  },

  description:
    "Opsell makes consumer brands agent-ready through AI-powered listing optimization, pricing, promotions, and catalog intelligence across Amazon, Flipkart, Myntra, Meesho, Shopify, and quick commerce.",

  keywords: [
    "Opsell AI",
    "agentic commerce",
    "AI shopping agents",
    "listing optimization",
    "marketplace optimization",
    "catalog intelligence",
    "AI pricing",
    "dynamic pricing",
    "Amazon optimization",
    "Flipkart optimization",
    "Myntra optimization",
    "Meesho optimization",
    "Shopify optimization",
    "ecommerce growth",
    "marketplace growth",
    "consumer brands",
    "product listing optimization",
    "agent-ready catalog",
  ],

  authors: [{ name: "Opsell AI" }],
  creator: "OPPSELL TECHNOLOGIES PRIVATE LIMITED",
  publisher: "OPPSELL TECHNOLOGIES PRIVATE LIMITED",

  applicationName: "Opsell AI",
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
    title: "Opsell AI | Agentic Commerce & Marketplace Growth Platform",
    description:
      "Make your catalog agent-ready. Optimize listings, pricing, promotions, and catalog quality across marketplaces to increase visibility, conversion, revenue, and margins.",
    url: "https://opsell.ai",
    siteName: "Opsell AI",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://opsell.ai/opsell-gi.png",
        width: 1200,
        height: 630,
        alt: "Opsell AI - Agentic Commerce Platform",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Opsell AI | Agentic Commerce & Marketplace Growth Platform",
    description:
      "Help AI shopping agents and human shoppers discover, recommend, and buy your products.",
    images: ["https://opsell.ai/opsell-gi.png"],
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      {
        url: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Opsell AI",
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


        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Opsell AI",
              alternateName: "Opsell",
              url: "https://opsell.ai",
              logo: "https://opsell.ai/opsell-gi.png",
              email: "sales@opsell.ai",
              description:
                "AI-led growth and execution platform that makes consumer brands agent-ready for agentic commerce.",
            }),
          }}
        />


        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
    window.dataLayer = window.dataLayer || [];

    function gtag(){
      dataLayer.push(arguments);
    }

    window.gtag = gtag;

    gtag('js', new Date());

    gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
  `}
        </Script>
      </body>
    </html>
  );
}