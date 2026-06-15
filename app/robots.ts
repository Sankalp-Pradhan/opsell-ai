import type { MetadataRoute } from "next";

// Destination: app/robots.ts  (serves at https://opsell.ai/robots.txt)
// UPDATED version of the Fix Package robots.ts: adds the newer shopping and
// answer-engine crawlers so Opsell is explicitly allowed for agentic commerce
// discovery. Allowing these bots is what lets AI engines read and cite the
// /agentic-commerce page.

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      // Answer engines / LLM crawlers
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Perplexity-User", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "Claude-User", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },
      { userAgent: "Amazonbot", allow: "/" },
      { userAgent: "Bingbot", allow: "/" },
    ],
    sitemap: "https://opsell.ai/sitemap.xml",
    host: "https://opsell.ai",
  };
}
