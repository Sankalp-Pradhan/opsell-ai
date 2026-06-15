// components/SeoSchema.tsx
//
// Usage on app/agentic-commerce/page.tsx:
//   import { AgenticArticleSchema, AgenticFaqSchema, AgenticBreadcrumbSchema } from "@/components/SeoSchema";
//
//   <AgenticBreadcrumbSchema />
//   <AgenticArticleSchema />
//   <AgenticFaqSchema />
//
// Render order: BreadcrumbList → Article → FAQPage
// Bump dateModified whenever the page content changes.

function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data, null, 0) }}
    />
  );
}

// ---------------------------------------------------------------------------
// 1. BreadcrumbList
//    Helps AI engines (and Google) understand site hierarchy.
// ---------------------------------------------------------------------------
export function AgenticBreadcrumbSchema() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://opsell.ai",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Agentic Commerce",
            item: "https://opsell.ai/agentic-commerce",
          },
        ],
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// 2. Article
//    Signals a citable, authored, dated resource.
//    AI engines weight: author.url, dateModified, wordCount, image dimensions.
// ---------------------------------------------------------------------------
export function AgenticArticleSchema() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline:
          "Win agentic commerce: make your catalog the one AI agents recommend",
        description:
          "How consumer brands grow in agentic commerce by making catalogs agent-ready: complete attributes, consistent listings and sharp pricing across marketplaces.",
        // Typed entities instead of bare strings — stronger topical signal
        about: [
          { "@type": "Thing", name: "Agentic commerce" },
          { "@type": "Thing", name: "Listing optimization" },
          { "@type": "Thing", name: "Ecommerce growth" },
          { "@type": "Thing", name: "AI shopping agents" },
          { "@type": "Thing", name: "Catalog management" },
        ],
        keywords:
          "agentic commerce, AI agents ecommerce, listing optimization, catalog hygiene, agent-ready catalog, Amazon listing score, Flipkart listing, ecommerce India",
        // ImageObject with dimensions for Google rich-result eligibility
        image: {
          "@type": "ImageObject",
          url: "https://opsell.ai/opsell-gi.png",
          width: 1200,
          height: 630,
        },
        author: {
          "@type": "Organization",
          name: "Opsell AI",
          url: "https://opsell.ai/about",
        },
        publisher: {
          "@type": "Organization",
          name: "Opsell AI",
          url: "https://opsell.ai",
          logo: {
            "@type": "ImageObject",
            url: "https://opsell.ai/opsell-gi.png",
            width: 512,
            height: 512,
          },
        },
        // Bump dateModified whenever page content changes
        datePublished: "2026-06-15",
        dateModified: "2026-06-15",
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": "https://opsell.ai/agentic-commerce",
        },
        inLanguage: "en-IN",
        // Approximate word count — update if your page content changes significantly
        wordCount: 1800,
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// 3. FAQPage
//    Text MUST match on-page FAQ copy word for word (Google requirement).
//    Keep this in sync with the rendered FAQ section on the page.
// ---------------------------------------------------------------------------

// Centralise FAQ data so the page component can import + render it
// from the same source — eliminates drift between on-page text and schema.
export const agenticFaqs = [
  {
    q: "What is agentic commerce?",
    a: "Agentic commerce is the shift from people browsing and buying to autonomous AI agents that research, compare and purchase on a shopper's behalf. The agent reads structured product data and recommends the SKU whose listing, attributes, price and availability best fit the request.",
  },
  {
    q: "How does agentic commerce affect ecommerce growth for consumer brands?",
    a: "Growth increasingly depends on whether an AI agent recommends your product. Brands with complete attributes, consistent listings and well-priced, in-stock SKUs get included in agent recommendations and grow. Brands with thin or inconsistent catalogs get filtered out and lose sales they never see.",
  },
  {
    q: "What does it mean for a catalog to be agent-ready?",
    a: "An agent-ready catalog has complete, intent-rich attributes, consistent titles and content across every marketplace, accurate availability, and prices inside the band an agent will recommend. Clean structured data is what lets an agent understand and confidently recommend a product.",
  },
  {
    q: "How does Opsell help brands win in agentic commerce?",
    a: "Opsell scores every listing with its Listing Quality Score (LQS), then optimizes and maintains listings, pricing, discounts and catalog hygiene across Amazon, Flipkart, Myntra, Meesho, Shopify and quick commerce. It fixes the structured data and pricing that decide whether an agent recommends a SKU, and ties every change to revenue, conversion and margin.",
  },
  {
    q: "Which marketplaces does Opsell support for agentic commerce readiness?",
    a: "Opsell works across Amazon, Flipkart, Myntra, Meesho and Shopify, with quick commerce channels expanding. Amazon, Shopify and Meesho are integrated, and Flipkart connectors are live.",
  },
  {
    q: "Is listing optimization still useful if agents are not buying yet?",
    a: "Yes. The same complete attributes, clean catalog and sharp pricing that make you agent-ready also lift discoverability, conversion and sell-through in today's human-driven search and marketplace ranking. You capture revenue now and are positioned for the shift.",
  },
] as const;

export function AgenticFaqSchema() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: agenticFaqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.a,
          },
        })),
      }}
    />
  );
}