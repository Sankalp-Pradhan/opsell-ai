"use client";

import Head from "next/head";

import { usePathname } from "next/navigation";

import {
  IconHelp,
  IconSparkle,
} from "./Icon";

/* -------------------------------------------------------------------------- */
/* TYPES */
/* -------------------------------------------------------------------------- */

interface FAQItem {
  q: string;
  a: string;
}

interface SEOContentItem {
  title: string;
  description: string;
  h2: string;
  content: string;
  changelog: string;
  faq: FAQItem[];
}

type SEOContentMap = Record<
  string,
  SEOContentItem
>;

/* -------------------------------------------------------------------------- */
/* SEO CONTENT */
/* -------------------------------------------------------------------------- */

const SEO_CONTENT: SEOContentMap = {
  "amazon-india-seller-fees-calculator":
    {
      title:
        "Amazon India Seller Fee Calculator 2026 | Profit Margin Tool",

      description:
        "Instantly calculate your true Amazon India net profit margin including referral, closing, and FBA/Easy Ship fees.",

      h2: "Understanding Amazon India Seller Fees in 2026",

      content:
        "Selling on Amazon India requires understanding referral, closing, shipping, GST, return impact, and fulfillment costs. Accurate profit calculations help sellers avoid hidden margin losses.",

      changelog:
        "April 10, 2026: Amazon India restructured shipping weight slabs and FBA handling limits.",

      faq: [
        {
          q: "What is Amazon India's Referral Fee?",
          a: "It is a category-based commission percentage charged on every sale.",
        },

        {
          q: "Does GST apply to Amazon seller fees?",
          a: "Yes. GST is applied on platform service fees and may be claimable as input tax credit.",
        },

        {
          q: "How do returns affect profitability?",
          a: "Returns increase reverse logistics costs and reduce net margins significantly in some categories.",
        },
      ],
    },
};

/* -------------------------------------------------------------------------- */
/* HELPERS */
/* -------------------------------------------------------------------------- */

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

/* -------------------------------------------------------------------------- */
/* COMPONENT */
/* -------------------------------------------------------------------------- */

export default function PlatformSEOBlock() {
  const pathname = usePathname();

  const slug = pathname.replace(
    /^\//,
    ""
  );

  const data =
    SEO_CONTENT[slug];

  if (!data) return null;

  /* ---------------------------------------------------------------------- */
  /* SCHEMA */
  /* ---------------------------------------------------------------------- */

  const schema = {
    "@context":
      "https://schema.org",

    "@graph": [
      {
        "@type":
          "SoftwareApplication",

        name: data.title,

        applicationCategory:
          "BusinessApplication",

        operatingSystem: "Web",

        description:
          data.description,

        offers: {
          "@type": "Offer",

          price: "0",

          priceCurrency: "INR",
        },
      },

      {
        "@type": "FAQPage",

        mainEntity:
          data.faq.map((f) => ({
            "@type":
              "Question",

            name: f.q,

            acceptedAnswer: {
              "@type":
                "Answer",

              text: f.a,
            },
          })),
      },
    ],
  };

  return (
    <>
      {/* SEO */}

      <Head>
        <title>{data.title}</title>

        <meta
          name="description"
          content={
            data.description
          }
        />

        <link
          rel="canonical"
          href={`https://opsell.in/${slug}`}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html:
              JSON.stringify(
                schema
              ),
          }}
        />
      </Head>

      {/* Content */}

      <section
        className="
          mt-14
          overflow-hidden
          rounded-[32px]
          border border-n-border
          bg-white
          shadow-elev-3
        "
      >
        {/* Hero */}

        <div
          className="
            relative overflow-hidden
            border-b border-n-100
            bg-gradient-to-br
            from-brand-light
            via-white
            to-white
            px-8 py-10
          "
        >
          {/* Glow */}

          <div
            className="
              absolute right-0 top-0
              h-48 w-48
              rounded-full
              bg-brand/10
              blur-3xl
            "
          />

          <div className="relative z-10 max-w-3xl">
            <div
              className="
                mb-5
                inline-flex items-center gap-2
                rounded-full
                border border-brand/20
                bg-white/80
                px-3 py-1.5
                text-ds-caption
                font-semibold
                uppercase tracking-wide
                text-brand
                backdrop-blur
              "
            >
              <IconSparkle
                size={14}
              />

              Seller Fee Insights
            </div>

            <h2
              className="
                font-display
                text-ds-h1
                text-n-900
              "
            >
              {data.h2}
            </h2>

            <p
              className="
                mt-5
                max-w-2xl
                text-ds-body
                leading-relaxed
                text-n-600
              "
            >
              {data.content}
            </p>

            {/* Changelog */}

            <div
              className="
                mt-6
                inline-flex items-center gap-2
                rounded-xl
                border border-warning/20
                bg-warning-light
                px-4 py-2
                text-ds-caption
                font-medium
                text-warning
              "
            >
              {data.changelog}
            </div>
          </div>
        </div>

        {/* FAQ */}

        <div className="px-8 py-8">
          <div className="mb-8">
            <h3
              className="
                font-display
                text-ds-h2
                text-n-900
              "
            >
              Frequently Asked Questions
            </h3>

            <p
              className="
                mt-2
                text-ds-body-sm
                text-n-500
              "
            >
              Common questions about
              seller fees, margins,
              returns, GST, and
              profitability.
            </p>
          </div>

          <div
            className="
              grid gap-5
              lg:grid-cols-2
            "
          >
            {data.faq.map(
              (f, i) => (
                <div
                  key={i}
                  className="
                    rounded-2xl
                    border border-n-border
                    bg-n-50
                    p-5
                    transition-all
                    hover:border-brand/20
                    hover:bg-brand-light/20
                  "
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="
                        mt-0.5
                        flex h-9 w-9 shrink-0
                        items-center justify-center
                        rounded-xl
                        bg-brand-light
                        text-brand
                      "
                    >
                      <IconHelp
                        size={16}
                      />
                    </div>

                    <div>
                      <h4
                        className="
                          font-display
                          text-ds-h3
                          text-n-900
                        "
                      >
                        {f.q}
                      </h4>

                      <p
                        className="
                          mt-3
                          text-ds-body-sm
                          leading-relaxed
                          text-n-600
                        "
                      >
                        {f.a}
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>
    </>
  );
}