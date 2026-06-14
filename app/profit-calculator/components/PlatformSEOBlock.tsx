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

  "amazon-usa-seller-fees-calculator": {
    title: "Amazon USA Seller Fee Calculator 2026 | FBA & Referral Fee Tool",
    description:
      "Calculate your true Amazon USA net profit including referral fees, FBA fulfillment, and advertising costs. Built for US marketplace sellers.",
    h2: "Understanding Amazon USA Seller Fees in 2026",
    content:
      "Selling on Amazon USA involves referral fees, FBA or self-ship fulfillment costs, and optional advertising spend. Accurate margin tracking helps US sellers stay profitable across competitive categories.",
    changelog:
      "March 15, 2026: Amazon USA updated FBA weight handling rates and introduced new inbound placement fees.",
    faq: [
      {
        q: "What is Amazon USA's referral fee?",
        a: "It ranges from 6% to 45% depending on category. Most categories fall between 8% and 15%.",
      },
      {
        q: "How does FBA affect my profit margin?",
        a: "FBA fees cover pick, pack, and ship but can significantly erode margins on low-ASP products. Compare self-ship vs FBA carefully.",
      },
      {
        q: "Is GST or TCS applicable for Amazon USA?",
        a: "No. Amazon USA operates under US tax rules. GST and TCS are India-specific obligations.",
      },
    ],
  },

  "flipkart-seller-fees-calculator": {
    title: "Flipkart Seller Fee Calculator 2026 | Commission & Profit Tool",
    description:
      "Calculate Flipkart referral fees, shipping charges, GST, TCS, and net payout instantly. Know your real profit before you list.",
    h2: "Understanding Flipkart Seller Fees in 2026",
    content:
      "Flipkart charges referral fees, collection fees, shipping fees based on weight and zone, and applies GST on services. Seller tier (Bronze to Platinum) also affects your commission rate in some categories.",
    changelog:
      "February 20, 2026: Flipkart revised zonal shipping slabs and updated collection fee thresholds.",
    faq: [
      {
        q: "How does Flipkart's seller tier affect fees?",
        a: "Higher tiers (Gold, Platinum) attract lower referral rates in select categories. Tier is based on seller performance metrics.",
      },
      {
        q: "What is Flipkart's collection fee?",
        a: "A payment gateway fee charged per order, typically a percentage of the selling price.",
      },
      {
        q: "Does Flipkart charge GST on its fees?",
        a: "Yes, 18% GST applies on Flipkart's platform service fees. It may be claimable as input tax credit if you are GST registered.",
      },
    ],
  },

  "shopsy-seller-fees-calculator": {
    title: "Shopsy Seller Fee Calculator 2026 | Flipkart Shopsy Profit Tool",
    description:
      "Calculate Shopsy by Flipkart seller fees, commission rates, and net profit. Understand your true margin on India's value commerce platform.",
    h2: "Understanding Shopsy by Flipkart Seller Fees in 2026",
    content:
      "Shopsy is Flipkart's social commerce and value-segment platform. It shares infrastructure with Flipkart but targets budget buyers, meaning higher volume at lower ASPs. Fee structures mirror Flipkart's with category-specific differences.",
    changelog:
      "January 5, 2026: Shopsy revised category commission rates for fashion and home segments.",
    faq: [
      {
        q: "Is Shopsy the same as Flipkart for sellers?",
        a: "Shopsy shares Flipkart's backend but is a separate storefront targeting value-conscious buyers. Some fee rates differ by category.",
      },
      {
        q: "Does Shopsy support COD orders?",
        a: "Yes, COD is supported and incurs an additional handling charge per order.",
      },
      {
        q: "What categories perform best on Shopsy?",
        a: "Fashion, home essentials, and daily-use products tend to have higher sell-through given Shopsy's value-first buyer base.",
      },
    ],
  },

  "noon-uae-seller-fees-calculator": {
    title: "Noon UAE Seller Fee Calculator 2026 | AED Commission & Profit Tool",
    description:
      "Calculate Noon UAE seller fees in AED including referral commissions, FBN fulfillment, and net payout. Built for UAE marketplace sellers.",
    h2: "Understanding Noon UAE Seller Fees in 2026",
    content:
      "Noon UAE is the Middle East's leading marketplace. Sellers pay referral commissions and optional Fulfilled by Noon (FBN) logistics fees. No GST or TCS applies — VAT treatment depends on your UAE registration status.",
    changelog:
      "March 1, 2026: Noon UAE updated FBN fulfillment rates across electronics and fashion categories.",
    faq: [
      {
        q: "Does Noon UAE charge VAT on seller fees?",
        a: "UAE VAT (5%) may apply depending on your business registration. Noon's platform fees are subject to VAT for registered entities.",
      },
      {
        q: "What is FBN (Fulfilled by Noon)?",
        a: "FBN is Noon's warehousing and fulfillment program, similar to FBA. Sellers send inventory to Noon's warehouse and Noon handles delivery.",
      },
      {
        q: "What is Noon's settlement cycle?",
        a: "Noon UAE typically settles payments within 30 days of order delivery, longer than Indian platforms.",
      },
    ],
  },

  "walmart-seller-fees-calculator": {
    title: "Walmart Marketplace Seller Fee Calculator 2026 | Commission Tool",
    description:
      "Calculate Walmart Marketplace referral fees, WFS fulfillment costs, and net profit in USD. Accurate fee breakdowns for US sellers.",
    h2: "Understanding Walmart Marketplace Seller Fees in 2026",
    content:
      "Walmart Marketplace charges referral fees based on category, with optional Walmart Fulfillment Services (WFS) for storage and shipping. There are no monthly subscription fees, making it accessible for sellers of all sizes.",
    changelog:
      "April 2, 2026: Walmart updated WFS storage rates and introduced new category-level referral fee tiers.",
    faq: [
      {
        q: "Does Walmart charge a monthly seller fee?",
        a: "No. Unlike Amazon, Walmart Marketplace has no monthly subscription fee. You only pay referral fees per sale.",
      },
      {
        q: "What is WFS (Walmart Fulfillment Services)?",
        a: "WFS is Walmart's equivalent of FBA. Sellers ship inventory to Walmart's fulfillment centers and Walmart handles last-mile delivery.",
      },
      {
        q: "How long does Walmart take to pay sellers?",
        a: "Walmart typically settles within 7 business days after order delivery confirmation.",
      },
    ],
  },

  "ebay-seller-fees-calculator": {
    title: "eBay Seller Fee Calculator 2026 | Final Value Fee & Profit Tool",
    description:
      "Calculate eBay Final Value Fees, store subscription savings, and net profit in USD. Understand your true margin across all eBay store tiers.",
    h2: "Understanding eBay Seller Fees in 2026",
    content:
      "eBay charges a Final Value Fee (FVF) per sale, which varies by category and store subscription tier. Higher store tiers (Basic, Premium, Anchor) reduce per-sale fees but require monthly subscriptions. Accurate fee modelling must account for your store level.",
    changelog:
      "January 20, 2026: eBay revised Final Value Fee rates for collectibles and trading cards.",
    faq: [
      {
        q: "What is eBay's Final Value Fee?",
        a: "FVF is a percentage of the total sale amount (including shipping charged to buyer) collected by eBay after each transaction.",
      },
      {
        q: "Does having an eBay store reduce my fees?",
        a: "Yes. Store subscribers pay lower FVFs and get free insertion credits per month. Higher tiers offer greater per-listing savings.",
      },
      {
        q: "Is GST or TCS applicable on eBay sales?",
        a: "No. eBay operates under USD and US/international tax rules. GST and TCS are India-specific obligations.",
      },
    ],
  },

  "meesho-seller-fees-calculator": {
    title: "Meesho Seller Fee Calculator 2026 | Commission & Profit Tool",
    description:
      "Calculate Meesho referral fees, logistics charges, GST, TCS, and net profit instantly. Know your real margin on India's reseller marketplace.",
    h2: "Understanding Meesho Seller Fees in 2026",
    content:
      "Meesho is India's largest social commerce platform targeting Tier 2 and Tier 3 markets. It charges low referral commissions but logistics fees vary by weight and shipping zone. High return rates in fashion categories are a key margin risk.",
    changelog:
      "February 28, 2026: Meesho revised logistics fee slabs and updated return policy handling charges.",
    faq: [
      {
        q: "Does Meesho charge referral fees?",
        a: "Yes, Meesho charges category-based commission rates, generally lower than Amazon or Flipkart to attract small sellers.",
      },
      {
        q: "How are logistics fees calculated on Meesho?",
        a: "Meesho charges weight-based logistics fees that vary by shipping zone (Local, Zonal, National).",
      },
      {
        q: "What is the return rate risk on Meesho?",
        a: "Fashion categories on Meesho can see return rates of 20–35%. Our calculator factors in reverse logistics and COGS loss impact.",
      },
    ],
  },

  "myntra-seller-fees-calculator": {
    title: "Myntra Seller Fee Calculator 2026 | Commission & Profit Tool",
    description:
      "Calculate Myntra referral fees, logistics deductions, COD charges, TCS, and true net profit. Built for fashion sellers on India's top fashion marketplace.",
    h2: "Understanding Myntra Seller Fees in 2026",
    content:
      "Myntra is India's leading fashion marketplace with premium brand positioning. Sellers face high referral commissions (20–25%) in fashion categories, weight-based logistics fees, and significant return rate exposure. Accurate margin modelling is critical given Myntra's return-heavy buyer behaviour.",
    changelog:
      "March 10, 2026: Myntra updated logistics fee slabs and revised COD handling charges for fashion categories.",
    faq: [
      {
        q: "What referral fee does Myntra charge?",
        a: "Myntra's referral fees range from 15% to 25% depending on category. Women's fashion and accessories attract the highest rates at 25%.",
      },
      {
        q: "Why are return rates so high on Myntra?",
        a: "Fashion buyers frequently order multiple sizes or styles intending to return some. Return rates of 30–40% are common in apparel on Myntra.",
      },
      {
        q: "Does Myntra charge TCS?",
        a: "Yes. As an Indian marketplace, Myntra deducts 1% TCS under Section 194-O on gross sales, which is claimable while filing your ITR.",
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