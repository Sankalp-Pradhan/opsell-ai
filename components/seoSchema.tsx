function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}

export function AgenticArticleSchema() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline:
          "Win Agentic Commerce: Make Your Catalog the One AI Agents Recommend",
        description:
          "How consumer brands grow in agentic commerce through agent-ready catalogs, listing optimization, structured product data, and marketplace pricing strategies.",
        url: "https://opsell.ai/agentic-commerce",
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": "https://opsell.ai/agentic-commerce",
        },
        about: [
          "Agentic Commerce",
          "Marketplace Optimization",
          "Listing Optimization",
          "AI Shopping Agents",
          "Ecommerce Growth",
        ],
        author: {
          "@type": "Organization",
          name: "Opsell AI",
          url: "https://opsell.ai",
        },
        publisher: {
          "@type": "Organization",
          name: "Opsell AI",
          logo: {
            "@type": "ImageObject",
            url: "https://opsell.ai/opsell-gi.png",
          },
        },
        image: "https://opsell.ai/opsell-gi.png",
        datePublished: "2026-06-15",
        dateModified: "2026-06-15",
      }}
    />
  );
}

export function AgenticFaqSchema() {
  const faqs = [
    {
      question: "What is agentic commerce?",
      answer:
        "Agentic commerce is the shift from people browsing and buying to autonomous AI agents that research, compare and purchase on a shopper's behalf. The agent reads structured product data and recommends the SKU whose listing, attributes, price and availability best fit the request.",
    },
    {
      question:
        "How does agentic commerce affect ecommerce growth for consumer brands?",
      answer:
        "Growth increasingly depends on whether an AI agent recommends your product. Brands with complete attributes, consistent listings and well-priced, in-stock SKUs get included in agent recommendations and grow. Brands with thin or inconsistent catalogs get filtered out and lose sales they never see.",
    },
    {
      question: "What does it mean for a catalog to be agent-ready?",
      answer:
        "An agent-ready catalog has complete, intent-rich attributes, consistent titles and content across every marketplace, accurate availability, and prices inside the band an agent will recommend. Clean structured data allows AI agents to understand and confidently recommend products.",
    },
    {
      question: "How does Opsell help brands win in agentic commerce?",
      answer:
        "Opsell optimizes listings, pricing, promotions, bundles and catalog hygiene across marketplaces. It continuously improves the structured data and pricing signals that influence whether AI agents recommend a product.",
    },
    {
      question:
        "Which marketplaces does Opsell support for agentic commerce readiness?",
      answer:
        "Opsell supports Amazon, Flipkart, Myntra, Meesho and Shopify, with quick-commerce integrations expanding.",
    },
    {
      question:
        "Is listing optimization still useful if AI agents are not buying yet?",
      answer:
        "Yes. The same improvements that make a catalog agent-ready also improve marketplace rankings, discoverability, conversion rates and revenue today.",
    },
  ];

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      }}
    />
  );
}