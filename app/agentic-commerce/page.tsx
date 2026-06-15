"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AgenticArticleSchema,
  AgenticBreadcrumbSchema,
  AgenticFaqSchema,
  agenticFaqs,
} from "@/components/seoSchema";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const AGENT_READY_PILLARS = [
  {
    label: "Complete attributes",
    body: "Every relevant field filled — material, size, use case, compatibility. Agents filter on attributes; missing fields are elimination criteria, not minor gaps.",
  },
  {
    label: "Consistent titles & content",
    body: "The same product described differently across Amazon, Flipkart, and Meesho confuses agent context windows. Uniform, intent-rich copy across channels wins.",
  },
  {
    label: "Accurate availability",
    body: "An out-of-stock SKU is invisible to an agent. Real-time inventory sync keeps you in the recommendation pool.",
  },
  {
    label: "Sharp, in-band pricing",
    body: "Agents are price-aware. A price too far above comparable SKUs gets filtered out before a human ever sees the recommendation.",
  },
];

const HOW_OPSELL_HELPS = [
  {
    stat: "LQS",
    label: "Listing Quality Score",
    body: "Every SKU gets a score across content, discoverability, and conversion signals — so you know exactly what to fix and in what order.",
  },
  {
    stat: "6+",
    label: "Marketplaces supported",
    body: "Amazon, Flipkart, Myntra, Meesho, Shopify and quick commerce — one platform, all channels.",
  },
  {
    stat: "↑ CVR",
    label: "Tied to revenue",
    body: "Every recommended fix is mapped to its projected impact on conversion rate and revenue. Not vanity metrics — actual margin.",
  },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="ds-label-sm text-brand-primary uppercase tracking-widest mb-3">
      {children}
    </p>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="ds-title-lg text-n-900 font-semibold leading-tight mb-4">
      {children}
    </h2>
  );
}

function SectionSubhead({ children }: { children: React.ReactNode }) {
  return (
    <p className="ds-body-md text-n-500 max-w-2xl mx-auto">{children}</p>
  );
}

// ---------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------

function Hero() {
  return (
    <section className="relative overflow-hidden bg-n-950 pt-24 pb-20 px-4 text-center">
      {/* Subtle radial glow — the one signature element */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="w-[600px] h-[600px] rounded-full bg-brand-primary/10 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <p className="ds-label-sm text-brand-primary uppercase tracking-widest mb-5">
          Agentic commerce
        </p>

        <h1 className="ds-display text-n-50 font-bold leading-[1.1] mb-6">
          The next shopper isn't a person.{" "}
          <span className="text-brand-primary">Is your catalog ready?</span>
        </h1>

        <p className="ds-body-lg text-n-400 mb-10 max-w-2xl mx-auto">
          AI agents are already researching, comparing and buying on shoppers'
          behalf. Brands with clean, complete, well-priced listings get
          recommended. Everyone else gets filtered out silently.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/score"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-brand-primary text-white ds-label-md font-semibold hover:bg-brand-primary/90 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
          >
            Score your listing free
          </Link>
          <Link
            href="#what-is-agentic-commerce"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-n-700 text-n-300 ds-label-md font-semibold hover:border-n-500 hover:text-n-100 transition-colors"
          >
            Learn how it works ↓
          </Link>
        </div>
      </div>
    </section>
  );
}

function WhatIsSection() {
  return (
    <section
      id="what-is-agentic-commerce"
      className="bg-n-50 py-20 px-4"
    >
      <div className="max-w-3xl mx-auto">
        <SectionEyebrow>What is agentic commerce?</SectionEyebrow>
        <SectionHeading>Shopping without a shopper</SectionHeading>

        <div className="ds-body-md text-n-600 space-y-4">
          <p>
            Agentic commerce is the shift from people browsing and buying to
            autonomous AI agents that research, compare and purchase on a
            shopper's behalf. A user tells their AI assistant "find me the best
            non-stick kadai under ₹1,500 with good reviews" — and the agent
            does the rest: it queries multiple marketplaces, parses structured
            product data, compares attributes, checks prices and availability,
            and surfaces one or two recommendations.
          </p>
          <p>
            The agent never sees your brand story. It reads your listing. It
            weighs your attributes, your price, your stock status, your review
            signals — and in under a second it decides whether your SKU makes
            the shortlist or not. Most brands will never know they were
            evaluated and eliminated.
          </p>
          <p>
            This is not a future scenario. Agents are live today inside Google,
            Perplexity, ChatGPT shopping, and an expanding set of consumer
            apps. The shift is already underway.
          </p>
        </div>
      </div>
    </section>
  );
}

function WhyItMattersSection() {
  return (
    <section className="bg-white py-20 px-4 border-t border-n-100">
      <div className="max-w-5xl mx-auto text-center">
        <SectionEyebrow>Why it matters</SectionEyebrow>
        <SectionHeading>Lost sales you'll never see</SectionHeading>
        <SectionSubhead>
          When an agent filters your SKU out, no one clicks away, no one
          bounces. The sale simply goes to a competitor and you have no signal
          it happened.
        </SectionSubhead>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[
            {
              heading: "Thin attributes = eliminated",
              body: "A kadai listed without material, induction-compatibility, or base thickness gets dropped the moment a query specifies any of those. Agents don't guess.",
            },
            {
              heading: "Inconsistent listings = low confidence",
              body: "If your product title on Amazon says '24cm' and Flipkart says 'medium', the agent can't resolve the conflict. It moves to a listing it can trust.",
            },
            {
              heading: "Wrong price band = filtered out",
              body: "Agents are increasingly price-aware. A SKU priced significantly above comparable alternatives doesn't get a second look — it gets excluded from the shortlist entirely.",
            },
          ].map((card) => (
            <div
              key={card.heading}
              className="rounded-xl border border-n-100 bg-n-50 p-6 elev-1"
            >
              <h3 className="ds-label-lg text-n-900 font-semibold mb-2">
                {card.heading}
              </h3>
              <p className="ds-body-sm text-n-500">{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AgentReadySection() {
  return (
    <section className="bg-n-50 py-20 px-4 border-t border-n-100">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <SectionEyebrow>Agent-ready catalog</SectionEyebrow>
          <SectionHeading>What agents actually look for</SectionHeading>
          <SectionSubhead>
            Four things determine whether an agent recommends your SKU or skips
            it.
          </SectionSubhead>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {AGENT_READY_PILLARS.map((pillar) => (
            <div
              key={pillar.label}
              className="flex gap-4 rounded-xl border border-n-100 bg-white p-6 elev-1"
            >
              <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-brand-primary" />
              <div>
                <h3 className="ds-label-md text-n-900 font-semibold mb-1">
                  {pillar.label}
                </h3>
                <p className="ds-body-sm text-n-500">{pillar.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowOpsellHelpsSection() {
  return (
    <section className="bg-n-950 py-20 px-4 border-t border-n-800">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <SectionEyebrow>How Opsell helps</SectionEyebrow>
          <h2 className="ds-title-lg text-n-50 font-semibold leading-tight mb-4">
            Fix what agents measure. Track what it earns.
          </h2>
          <p className="ds-body-md text-n-400 max-w-2xl mx-auto">
            Opsell scores every listing, surfaces exactly what's holding it
            back, fixes it across all your channels, and shows you the revenue
            impact — not just the listing health score.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {HOW_OPSELL_HELPS.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-n-800 bg-n-900 p-6"
            >
              <p className="ds-display-sm text-brand-primary font-bold mb-1">
                {item.stat}
              </p>
              <p className="ds-label-sm text-n-300 font-semibold uppercase tracking-wider mb-3">
                {item.label}
              </p>
              <p className="ds-body-sm text-n-400">{item.body}</p>
            </div>
          ))}
        </div>

        {/* Marketplace logos row */}
        <div className="text-center">
          <p className="ds-label-sm text-n-500 uppercase tracking-widest mb-5">
            Supported channels
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 ds-body-sm text-n-400 font-medium">
            {["Amazon", "Flipkart", "Myntra", "Meesho", "Shopify", "Quick commerce"].map(
              (ch) => (
                <span key={ch}>{ch}</span>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-white py-20 px-4 border-t border-n-100">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <SectionEyebrow>FAQ</SectionEyebrow>
          <SectionHeading>Common questions</SectionHeading>
        </div>

        <div className="divide-y divide-n-100">
          {agenticFaqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={faq.q}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex justify-between items-start gap-4 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-primary rounded"
                  aria-expanded={isOpen}
                >
                  <span className="ds-body-md text-n-900 font-medium">
                    {faq.q}
                  </span>
                  <span
                    aria-hidden
                    className={`flex-shrink-0 mt-0.5 text-n-400 transition-transform duration-200 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>

                {isOpen && (
                  <p className="pb-5 ds-body-sm text-n-500 leading-relaxed">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="bg-brand-primary/5 border-t border-brand-primary/20 py-20 px-4 text-center">
      <div className="max-w-2xl mx-auto">
        <SectionEyebrow>Get started</SectionEyebrow>
        <h2 className="ds-title-lg text-n-900 font-semibold leading-tight mb-4">
          See how agent-ready your catalog is — right now
        </h2>
        <p className="ds-body-md text-n-500 mb-8">
          Paste any Amazon listing URL. Get your LQS, a breakdown of what's
          holding it back, and a prioritized fix list — free, in under 60
          seconds.
        </p>
        <Link
          href="/score"
          className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-brand-primary text-white ds-label-md font-semibold hover:bg-brand-primary/90 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
        >
          Score your listing free →
        </Link>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AgenticCommercePage() {
  return (
    <>
      {/* Schema */}
      <AgenticBreadcrumbSchema />
      <AgenticArticleSchema />
      <AgenticFaqSchema />

      {/* Page */}
      <main>
        <Hero />
        <WhatIsSection />
        <WhyItMattersSection />
        <AgentReadySection />
        <HowOpsellHelpsSection />
        <FaqSection />
        <CtaSection />
      </main>
    </>
  );
}