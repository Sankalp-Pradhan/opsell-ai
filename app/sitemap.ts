import type { MetadataRoute } from "next";

// Destination: app/sitemap.ts  (serves at https://opsell.ai/sitemap.xml)
// Keep lastModified honest — AI engines and Google both weight freshness.
// changeFrequency is ignored by most crawlers; lastModified is what matters.

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://opsell.ai/",
      lastModified: new Date("2026-06-15"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://opsell.ai/agentic-commerce",
      lastModified: new Date("2026-06-15"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://opsell.ai/features",
      lastModified: new Date("2026-06-15"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://opsell.ai/profit-calculator",
      lastModified: new Date("2026-06-15"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://opsell.ai/works",
      lastModified: new Date("2026-06-15"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    // Uncomment once /pricing ships (high commercial intent → 0.8):
    // {
    //   url: "https://opsell.ai/pricing",
    //   lastModified: new Date("2026-06-15"),
    //   changeFrequency: "monthly",
    //   priority: 0.8,
    // },
  ];
}