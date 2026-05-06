"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "./use-view";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, TrendingDown, TrendingUp, ArrowRight } from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const OUTCOMES = [
  {
    num: "01",
    title: "Sell at the Right Price",
    desc: "Monitors competitor prices 24/7 and adjusts yours automatically within defined rules — no manual checks needed.",
  },
  {
    num: "02",
    title: "Get More Clicks on Listings",
    desc: "Keyword gap analysis, title scoring, and image sequence optimisation — all surfaced with actionable suggestions and confidence scores.",
  },
  {
    num: "03",
    title: "Control all your Ecom platforms at one place",
    desc: "Set rules once. Opsell executes across Amazon, Flipkart, Myntra, and more. Consistent strategy with zero tab-switching.",
  },
  {
    num: "04",
    title: "Stop Hidden Revenue Losses",
    desc: "See sales where your margins are thinning — suppressed listings, out-of-stock windows. Buy the losses — before they compound.",
  },
];

// ─── Shoe SVG ─────────────────────────────────────────────────────────────────

// Replace ShoeSVGBefore and ShoeSVGAfter with these image-based components:

function ShoeBoxBefore() {
  return (
    <div
      style={{
        background: "#0e1020",
        aspectRatio: "4/3",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <img
        src="/assets/shoe.png"
        alt="Unoptimized sneaker listing"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          padding: 8,
          filter: "grayscale(1)",
          opacity: 0.4,
          transform: "scale(1.05)",
        }}
      />
    </div>
  );
}

function ShoeBoxAfter() {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, rgba(80,70,229,0.15) 0%, #0b0d1e 100%)",
        aspectRatio: "4/3",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <img
        src="/assets/shoe.png"
        alt="Optimized sneaker listing"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          padding: 8,
        }}
      />
    </div>
  );
}

// ─── Visuals ──────────────────────────────────────────────────────────────────

function PricingVisual() {
  const competitors = [
    { name: "Competitor A", price: "₹1,249", trend: "↓ 2.4%", color: "#EF4444" },
    { name: "Competitor B", price: "₹1,310", trend: "↑ 0.8%", color: "#16A34A" },
    { name: "Competitor C", price: "₹1,289", trend: "— 0.0%", color: "#8C919A" },
  ];
  return (
    <>
      <p style={{ fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 700, color: "#6B707A" }}>⚡ Live Price Monitor</p>
      <div style={{ background: "#F7F7FB", borderRadius: 10, padding: 20, border: "1px solid #E2E4E8" }}>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#6B707A", marginBottom: 6 }}>Your current price</div>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 800, color: "#0F1114", letterSpacing: "-0.03em" }}>₹1,279</div>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#16A34A", background: "#E8F7EE", padding: "4px 8px", borderRadius: 6, fontWeight: 600 }}>OPTIMAL</span>
        </div>
      </div>
      {competitors.map(c => (
        <div key={c.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #F0F1F3" }}>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#4A4F57" }}>{c.name}</span>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#0F1114", fontWeight: 500 }}>{c.price}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: c.color, minWidth: 48, textAlign: "right" }}>{c.trend}</span>
          </div>
        </div>
      ))}
      <div style={{ background: "#F0EFFF", border: "1px solid #C7C4FF", borderRadius: 10, padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#5046E5", display: "inline-block", animation: "aiPulse 1.5s ease infinite" }} />
          <span style={{ fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 700, color: "#5046E5" }}>Auto Price Rule Triggered</span>
        </div>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#2E3238", lineHeight: 1.5 }}>
          Lowered price by ₹10 to stay within ₹30 of cheapest competitor. Margin protected at 24%.
        </p>
      </div>
    </>
  );
}

// ─── Listing Visual (outcome 02) — before/after comparison ────────────────────

function ListingVisual() {
  return (
    <>
      {/* Header pill */}
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#F0EFFF", border: "1px solid #C7C4FF", borderRadius: 20, padding: "5px 12px" }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: 11, fontWeight: 600, color: "#5046E5", letterSpacing: "0.04em" }}>
          ✦ Listing engine · A9 + Rufus + COSMO
        </span>
      </div>

      {/* Comparison row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 10, alignItems: "center" }}>

        {/* BEFORE card */}
        <div style={{ background: "#F8F9FA", border: "1px solid #E2E4E8", borderRadius: 12, overflow: "hidden" }}>
          {/* Image area */}
          <div style={{ background: "#F0F1F3", aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            {/* Hatching pattern overlay */}
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.35 }} xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="hatch" width="10" height="10" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="10" stroke="#B0B4BC" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hatch)" />
            </svg>
            <div style={{ position: "relative", width: "72%", height: "72%", opacity: 0.55, filter: "grayscale(1)" }}>
              <ShoeBoxBefore />
            </div>
          </div>
          {/* Meta */}
          <div style={{ padding: "10px 12px" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#4A4F57", marginBottom: 6 }}>
              men's sneakers — white/black
            </p>
            <div style={{ display: "flex", gap: 10, marginBottom: 6 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#6B707A" }}>
                CTR <strong style={{ color: "#0F1114" }}>0.6%</strong>
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#6B707A" }}>
                CVR <strong style={{ color: "#0F1114" }}>1.1%</strong>
              </span>
            </div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#FEF2F2", color: "#B91C1C", fontSize: 10, fontFamily: "var(--font-display)", fontWeight: 500, padding: "3px 8px", borderRadius: 6 }}>
              <TrendingDown size={10} />
              Weak title · low engagement
            </span>
          </div>
        </div>

        {/* Arrow */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{ fontSize: 10, fontFamily: "var(--font-display)", fontWeight: 700, color: "#5046E5", whiteSpace: "nowrap", background: "#F0EFFF", border: "1px solid #C7C4FF", borderRadius: 20, padding: "3px 8px" }}>
            +30% CTR
          </div>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#5046E5", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ArrowRight size={14} color="#fff" strokeWidth={2.5} />
          </div>
        </div>

        {/* AFTER card */}
        <div style={{ background: "#fff", border: "1.5px solid #C7C4FF", borderRadius: 12, overflow: "hidden", boxShadow: "0 0 0 3px #F0EFFF" }}>
          {/* Image area */}
          <div style={{ background: "linear-gradient(135deg, #F0EFFF 0%, #E8F4FF 100%)", aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <span style={{  zIndex: 1, position : "absolute", top: 8, right: 8, background: "#5046E5", color: "#fff", fontSize: 9, fontFamily: "var(--font-display)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 10 }}>
              With Opsell
            </span>
            <div style={{ width: "76%", height: "76%" }}>
              <ShoeBoxAfter />
            </div>
          </div>
          {/* Meta */}
          <div style={{ padding: "10px 12px" }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 600, color: "#0F1114", marginBottom: 6, lineHeight: 1.4 }}>
              Redtape Men's Low-Top Court Sneakers — Premium Daily Wear
            </p>
            <div style={{ display: "flex", gap: 10, marginBottom: 6 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#6B707A" }}>
                CTR <strong style={{ color: "#5046E5" }}>0.78%</strong>
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#6B707A" }}>
                CVR <strong style={{ color: "#5046E5" }}>2.3%</strong>
              </span>
            </div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#F0EFFF", color: "#4338CA", fontSize: 10, fontFamily: "var(--font-display)", fontWeight: 500, padding: "3px 8px", borderRadius: 6 }}>
              <TrendingUp size={10} />
              +30% CTR · +1.2pt CVR
            </span>
          </div>
        </div>
      </div>

      {/* Footer callout */}
      <div style={{ background: "#F8F9FA", border: "1px solid #E2E4E8", borderRadius: 10, padding: 16 }}>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#2E3238", lineHeight: 1.6, margin: 0 }}>
          <strong style={{ fontFamily: "var(--font-display)", color: "#0F1114" }}>Triple-algorithm optimisation.</strong>{" "}
          Platform-specific agents rewrite for Amazon's A9 ranker, Rufus conversational search, and COSMO context graphs — in parallel.
        </p>
      </div>
    </>
  );
}

function PlatformsVisual() {
  const platforms = [
    { name: "Amazon SP-API", sub: "142 ACTIONS / 30D", status: "live" },
    { name: "Shopify",       sub: "88 ACTIONS / 30D",  status: "live" },
    { name: "Flipkart",      sub: "BUILDING",           status: "building" },
    { name: "Myntra",        sub: "BUILDING",           status: "building" },
    { name: "Meesho",        sub: "ROADMAP",            status: "roadmap" },
    { name: "Ajio",          sub: "ROADMAP",            status: "roadmap" },
  ];

  const badgeStyle: Record<string, React.CSSProperties> = {
    live:     { background: "#DCFCE7", color: "#16A34A" },
    building: { background: "#FEF9EC", color: "#D97706" },
    roadmap:  { background: "#F0F1F3", color: "#6B707A" },
  };

  return (
    <>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#F0EFFF", border: "1px solid #C7C4FF", borderRadius: 20, padding: "5px 12px", marginBottom: 4 }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 600, color: "#5046E5" }}>
          ⇌ Execution layer · live API
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {platforms.map((p) => (
          <div key={p.name} style={{ background: "#fff", border: "1px solid #E2E4E8", borderRadius: 12, padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600, color: "#0F1114" }}>{p.name}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 500, color: "#8C919A", letterSpacing: "0.06em" }}>{p.sub}</span>
            </div>
            <span style={{ ...badgeStyle[p.status], fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 20, whiteSpace: "nowrap" }}>
              {p.status}
            </span>
          </div>
        ))}
      </div>
      <div style={{ background: "#0F1114", borderRadius: 12, padding: "18px 20px", marginTop: 2 }}>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#fff", lineHeight: 1.6, margin: 0 }}>
          <span style={{ color: "#7B73FF", fontWeight: 600 }}>One ruleset → many marketplaces.</span>
          {" "}Set price floors, bundle logic, listing standards once. Opsell executes consistently across every connected channel.
        </p>
      </div>
    </>
  );
}

function LossesVisual() {
  const issues = [
    { label: "Suppressed listings",   count: 12, loss: "₹84,200",  color: "#EF4444" },
    { label: "Out-of-stock windows",  count: 7,  loss: "₹52,100",  color: "#F59E0B" },
    { label: "Buy Box lost",          count: 23, loss: "₹38,400",  color: "#F59E0B" },
    { label: "Margin erosion",        count: 5,  loss: "₹19,800",  color: "#EF4444" },
  ];
  return (
    <>
      <p style={{ fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 700, color: "#6B707A" }}>⚠ Revenue Leak Monitor</p>
      <div style={{ background: "#FFF1F0", border: "1px solid #FECACA", borderRadius: 10, padding: 20 }}>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#991B1B", marginBottom: 6, fontWeight: 600 }}>Estimated monthly loss</div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 800, color: "#EF4444", letterSpacing: "-0.03em", lineHeight: 1 }}>₹1,94,500</div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#6B707A", marginTop: 6 }}>across 47 issues detected this week</div>
      </div>
      {issues.map(i => (
        <div key={i.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #F0F1F3" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: i.color, display: "inline-block" }} />
            <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#4A4F57" }}>{i.label}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#8C919A", background: "#F0F1F3", padding: "2px 6px", borderRadius: 4 }}>{i.count}</span>
          </div>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#0F1114", fontWeight: 500 }}>−{i.loss}</span>
        </div>
      ))}
      <div style={{ background: "#F0EFFF", border: "1px solid #C7C4FF", borderRadius: 10, padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#5046E5", display: "inline-block", animation: "aiPulse 1.5s ease infinite" }} />
          <span style={{ fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 700, color: "#5046E5" }}>Recovery Action</span>
        </div>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#2E3238", lineHeight: 1.5 }}>
          Auto-relisted 12 suppressed SKUs with corrected compliance fields. Projected recovery: ₹84,200/mo.
        </p>
      </div>
    </>
  );
}

const VISUALS = [PricingVisual, ListingVisual, PlatformsVisual, LossesVisual];

// ─── Section ──────────────────────────────────────────────────────────────────

export function GrowthSection() {
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const { ref, inView } = useInView();
  const ActiveVisual = VISUALS[active];
  const PrevVisual = prev !== null ? VISUALS[prev] : null;

  const handleSelect = (i: number) => {
    if (i === active) return;
    setDirection(i > active ? 1 : -1);
    setPrev(active);
    setActive(i);
  };

  useEffect(() => {
    if (prev === null) return;
    const t = setTimeout(() => setPrev(null), 500);
    return () => clearTimeout(t);
  }, [prev, active]);

  const goPrev = () => handleSelect((active - 1 + OUTCOMES.length) % OUTCOMES.length);
  const goNext = () => handleSelect((active + 1) % OUTCOMES.length);

  return (
    <section ref={ref} className="border-t border-b border-n-border bg-white">
      <div
        className="mx-auto max-w-7xl px-6 py-20 sm:px-12 sm:py-24 md:px-16 lg:px-24"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "none" : "translateY(32px)",
          transition: "opacity 0.7s, transform 0.7s",
        }}
      >
        {/* Section header */}
        <p className="font-display mb-3 text-ds-caption font-bold uppercase tracking-[0.12em] text-brand">
          How Opsell Delivers Growth
        </p>
        <h2 className="font-display text-3xl font-bold leading-[1.1] tracking-[-0.02em] text-n-900 sm:text-4xl lg:text-5xl">
          Sell more.<br />Manage less.
        </h2>

        {/* ── Desktop layout ── */}
        <div className="mt-12 hidden lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">

          {/* Outcome list + vertical arrows */}
          <div className="flex gap-3">
            <div className="flex flex-col gap-2 justify-center">
              {[
                { label: "Previous", fn: goPrev, Icon: ChevronUp },
                { label: "Next",     fn: goNext, Icon: ChevronDown },
              ].map(({ label, fn, Icon }) => (
                <button
                  key={label}
                  aria-label={label}
                  onClick={fn}
                  className="growth-arrow-btn flex h-9 w-9 items-center justify-center rounded-full border border-n-border bg-white text-brand transition-all duration-200"
                >
                  <Icon size={18} strokeWidth={2.25} />
                </button>
              ))}
            </div>

            <div className="flex flex-1 flex-col gap-2">
              {OUTCOMES.map((o, i) => (
                <div
                  key={i}
                  onClick={() => handleSelect(i)}
                  className="cursor-pointer rounded-lg p-5 transition-all duration-200"
                  style={{
                    border: `1px solid ${active === i ? "#C7C4FF" : "transparent"}`,
                    background: active === i ? "#F0EFFF" : "transparent",
                  }}
                >
                  <div className="flex gap-4">
                    <span className="mt-0.5 font-mono text-xs font-medium text-brand">{o.num}</span>
                    <div>
                      <p className="font-display text-lg font-semibold text-n-900">{o.title}</p>
                      <p className="mt-1 font-body text-ds-body text-n-500 leading-relaxed">{o.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual panel */}
          <div
            className="relative overflow-hidden rounded-2xl border border-n-border bg-white shadow-elev-3"
            style={{ minHeight: 520 }}
          >
            {PrevVisual && (
              <div
                key={`prev-${prev}`}
                className="absolute inset-0 flex flex-col gap-5 p-8 pointer-events-none"
                style={{ animation: `growthSlideOut${direction === 1 ? "Up" : "Down"} 0.45s cubic-bezier(0.4,0,0.2,1) forwards` }}
              >
                <PrevVisual />
              </div>
            )}
            <div
              key={`active-${active}`}
              className="growth-active-visual relative flex flex-col gap-5 p-8"
              style={{ animation: `growthSlideIn${direction === 1 ? "Up" : "Down"} 0.5s cubic-bezier(0.4,0,0.2,1) both` }}
            >
              <ActiveVisual />
            </div>
          </div>
        </div>

        {/* ── Mobile layout ── */}
        <div className="mt-10 lg:hidden">
          <div className="mb-5 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {OUTCOMES.map((o, i) => (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                className="shrink-0 rounded-md px-3 py-1.5 font-display text-ds-caption font-semibold transition-all duration-200"
                style={{
                  background: active === i ? "#F0EFFF" : "#F0F1F3",
                  color:      active === i ? "#5046E5" : "#6B707A",
                  border:     `1px solid ${active === i ? "#C7C4FF" : "transparent"}`,
                }}
              >
                {o.num} {o.title}
              </button>
            ))}
          </div>

          <div className="mb-5 rounded-lg border border-n-border bg-n-50 p-4">
            <p className="font-body text-ds-body leading-relaxed text-n-500">{OUTCOMES[active].desc}</p>
          </div>

          <div className="relative overflow-hidden rounded-xl border border-n-border bg-white shadow-elev-2" style={{ minHeight: 420 }}>
            {PrevVisual && (
              <div
                key={`prev-m-${prev}`}
                className="absolute inset-0 flex flex-col gap-4 p-5 pointer-events-none"
                style={{ animation: `growthSlideOut${direction === 1 ? "Up" : "Down"} 0.45s cubic-bezier(0.4,0,0.2,1) forwards` }}
              >
                <PrevVisual />
              </div>
            )}
            <div
              key={`active-m-${active}`}
              className="growth-active-visual relative flex flex-col gap-4 p-5"
              style={{ animation: `growthSlideIn${direction === 1 ? "Up" : "Down"} 0.5s cubic-bezier(0.4,0,0.2,1) both` }}
            >
              <ActiveVisual />
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <button onClick={goPrev} className="growth-arrow-btn flex h-9 w-9 items-center justify-center rounded-full border border-n-border bg-white text-brand">
              <ChevronLeft size={18} strokeWidth={2.25} />
            </button>
            <div className="flex gap-1.5">
              {OUTCOMES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{ width: active === i ? 20 : 6, background: active === i ? "#5046E5" : "#D1D4D9" }}
                />
              ))}
            </div>
            <button onClick={goNext} className="growth-arrow-btn flex h-9 w-9 items-center justify-center rounded-full border border-n-border bg-white text-brand">
              <ChevronRight size={18} strokeWidth={2.25} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes aiPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.4); }
        }
        @keyframes growthSlideInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes growthSlideInDown {
          from { opacity: 0; transform: translateY(-24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes growthSlideOutUp {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(-24px); }
        }
        @keyframes growthSlideOutDown {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(24px); }
        }
        @keyframes growthItemIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .growth-active-visual > * {
          opacity: 0;
          animation: growthItemIn 0.45s cubic-bezier(0.4,0,0.2,1) forwards;
        }
        .growth-active-visual > *:nth-child(1) { animation-delay: 0.08s; }
        .growth-active-visual > *:nth-child(2) { animation-delay: 0.16s; }
        .growth-active-visual > *:nth-child(3) { animation-delay: 0.22s; }
        .growth-active-visual > *:nth-child(4) { animation-delay: 0.28s; }
        .growth-active-visual > *:nth-child(5) { animation-delay: 0.34s; }
        .growth-active-visual > *:nth-child(6) { animation-delay: 0.40s; }
        .growth-active-visual > *:nth-child(7) { animation-delay: 0.46s; }
        .growth-active-visual > *:nth-child(8) { animation-delay: 0.52s; }
        .growth-arrow-btn:hover {
          background: #F0EFFF !important;
          border-color: #C7C4FF !important;
          transform: translateY(-1px);
        }
        .growth-arrow-btn:active { transform: translateY(0); }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}