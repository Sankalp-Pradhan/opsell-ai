import { useState } from "react";
import { Plus } from "lucide-react";

const faqs = [
  {
    question: "What does OpsellAI actually do?",
    answer:
      "Opsell helps brands find and fix the places where they are losing revenue across different marketplaces. It automatically tracks competitor pricing, optimizes prices, discounts and bundles, and keeps product listings consistent across every platform. Instead of managing everything manually, Opsell shows you exactly what to change — or can do it for you automatically.",
  },
  {
    question: "Which marketplaces does Opsell support?",
    answer:
      "Opsell works across Amazon, Shopify, Flipkart, Myntra, Meesho and other major sales channels. You can manage pricing and listings from one place.",
  },
  {
    question: "Will Opsell automatically change my prices?",
    answer:
      "Only if you want it to. You can choose between fully automatic updates, suggested recommendations, or approval before anything goes live.",
  },
  {
    question: "Can Opsell lower my margins?",
    answer:
      "No. You can set minimum margin and pricing rules, so Opsell never discounts below the limits you choose.",
  },
  {
    question: "How long does setup take?",
    answer:
      "Most brands connect their stores and start seeing recommendations in under 15 minutes.",
  },
  {
    question: "How quickly will I see results?",
    answer:
      "Most businesses notice pricing opportunities and listing issues within the first few days. Revenue improvements typically appear within 2–4 weeks.",
  },
  {
    question: "What if I already use spreadsheets or another repricer?",
    answer:
      "Opsell can work alongside your current process. Many teams start by using it only for recommendations before switching fully.",
  },
  {
    question: "Do I need a large catalog for this to be useful?",
    answer:
      "No. Opsell helps businesses of all sizes, but it becomes especially valuable once you manage 50+ products or sell on multiple platforms.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes. You can try Opsell for free before deciding whether to automate anything.",
  },
];

// Palette from user's design system
const C = {
  bg: "#0F1114",          // neutral-900
  surface: "#1C1F24",     // neutral-800
  surfaceHover: "#22262C",
  surfaceActive: "#1A1740",
  border: "#2E3238",      // neutral-700
  borderHover: "#4A4F57",
  fg: "#F8F9FA",          // neutral-50
  muted: "#B0B4BC",       // neutral-300
  tertiary: "#8C919A",    // neutral-400
  accent: "#5E5CE6",      // primary
  accentSoft: "#818CF8",  // indigo-400
  grid: "#2E3238",
  chipBg: "rgba(94,92,230,0.12)",
  chipBorder: "rgba(129,140,248,0.35)",
};

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        background: C.bg,
        padding: "96px 24px",
        fontFamily: "var(--font-sans, 'DM Sans', system-ui, sans-serif)",
      }}
    >
      {/* Grid pattern */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(to right, ${C.grid} 1px, transparent 1px), linear-gradient(to bottom, ${C.grid} 1px, transparent 1px)`,
          backgroundSize: "56px 56px",
          opacity: 0.35,
          maskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 85%)",
          pointerEvents: "none",
        }}
      />
      {/* Glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          width: 820,
          height: 420,
          transform: "translateX(-50%)",
          background:
            "radial-gradient(closest-side, rgba(94,92,230,0.35), transparent)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          maxWidth: 760,
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              borderRadius: 999,
              border: `1px solid ${C.chipBorder}`,
              background: C.chipBg,
              color: C.accentSoft,
              fontSize: 12,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: C.accentSoft,
                animation: "faqPulse 1.6s ease-in-out infinite",
              }}
            />
            Support
          </span>

          <h2
            style={{
              margin: "20px 0 16px",
              fontFamily:
                "var(--font-display, 'Plus Jakarta Sans', system-ui, sans-serif)",
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: C.fg,
            }}
          >
            Frequently asked questions
          </h2>

          <p
            style={{
              fontSize: 16,
              lineHeight: 1.6,
              color: C.muted,
              maxWidth: 560,
              margin: "0 auto",
            }}
          >
            Answers to common questions about Opsell and its features. If you
            have other questions, don't hesitate to reach out.
          </p>
        </div>

        {/* Accordion */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                style={{
                  borderRadius: 14,
                  border: `1px solid ${isOpen ? "rgba(129,140,248,0.4)" : C.border}`,
                  background: isOpen ? C.surfaceActive : C.surface,
                  boxShadow: isOpen
                    ? "0 0 0 1px rgba(94,92,230,0.18), 0 24px 60px -28px rgba(94,92,230,0.55)"
                    : "none",
                  transition:
                    "background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isOpen) {
                    e.currentTarget.style.background = C.surfaceHover;
                    e.currentTarget.style.borderColor = C.borderHover;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isOpen) {
                    e.currentTarget.style.background = C.surface;
                    e.currentTarget.style.borderColor = C.border;
                  }
                }}
              >
                <button
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    padding: "20px 24px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    color: C.fg,
                    fontFamily: "inherit",
                  }}
                >
                  <span
                    style={{
                      fontFamily:
                        "var(--font-display, 'Plus Jakarta Sans', system-ui, sans-serif)",
                      fontSize: 17,
                      fontWeight: 600,
                      color: C.fg,
                    }}
                  >
                    {faq.question}
                  </span>
                  <span
                    style={{
                      flexShrink: 0,
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: `1px solid ${isOpen ? C.accent : C.border}`,
                      background: isOpen ? C.accent : "transparent",
                      color: isOpen ? "#ffffff" : C.tertiary,
                      transform: isOpen ? "rotate(45deg)" : "rotate(0)",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <Plus size={16} strokeWidth={2.5} />
                  </span>
                </button>

                <div
                  style={{
                    display: "grid",
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                    transition: "grid-template-rows 0.32s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  <div style={{ overflow: "hidden", minHeight: 0 }}>
                    <p
                      style={{
                        padding: "0 24px 22px",
                        margin: 0,
                        color: C.muted,
                        fontSize: 15,
                        lineHeight: 1.65,
                      }}
                    >
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes faqPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.3); }
        }
      `}</style>
    </section>
  );
}
