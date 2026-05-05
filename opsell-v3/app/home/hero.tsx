"use client";

import { a } from "framer-motion/client";

// ─── Hero Dashboard ───────────────────────────────────────────────────────────

function HeroDashboard() {
  const navItems = [
    { label: "Dashboard", active: true },
    { label: "Listings", active: false },
    { label: "Pricing", active: false },
    { label: "Competitors", active: false },
    { label: "Experiments", active: false },
    { label: "Campaigns", active: false },
    { label: "Analytics", active: false },
  ]

  const stats = [
    { label: "GMV Recovered", val: "₹18.4L", delta: "+12.4% vs last 30d", tone: "up" },
    { label: "Avg Buy-Box Rank", val: "#2.1", delta: "−0.4 ↑", tone: "down" },
    { label: "Live SKUs", val: "214", delta: "+12 this week", tone: "up" },
    { label: "AI Actions Fired", val: "289", delta: "last 30 days", tone: "neutral" },
  ]
  
  const platforms: Record<string, { bg: string; img: string; name: string }> = {
  amazon:   { bg: "#FF9900", img: "/assets/amazon.png",   name: "Amazon"   },
  flipkart: { bg: "#2874F0", img: "/assets/flipkart.png", name: "Flipkart" },
  myntra:   { bg: "#FF3F6C", img: "/assets/myntra.png",   name: "Myntra"   },
  ajio:   { bg: "#11111", img: "/assets/ajio.png",   name: "Ajio"   },
  shopify:    { bg: "#FC2779", img: "/assets/shopify.png",    name: "Shopify"    },
}
  
const PlatformAvatar = ({ id }: { id: string }) => {
  const p = platforms[id]
  return (
    <span
      title={p.name}
      className="inline-flex items-center justify-center w-[30px] h-[30px] rounded-full border-[1.5px] border-white -mr-[5px] last:mr-0 shadow-elev-1 overflow-hidden"
      style={{ background: p.bg }}
    >
      <img
        src={p.img}
        alt={p.name}
        className="w-full h-full object-contain p-[2px]"
      />
    </span>
  )
}

  const rows = [
    {
      name: "Vitamin C Serum 30ml",
      price: "₹649",
      status: "Optimal",
      statusStyle: "bg-success-light text-success",
      platforms: [{ id: "amazon", name: "Amazon" }, { id: "flipkart", name: "Flipkart" }],
      rank: "#1",
    },
    {
      name: "Moisturiser SPF 50",
      price: "₹429",
      status: "Review",
      statusStyle: "bg-warning-light text-warning",
      platforms: [{ id: "flipkart", name: "Flipkart" }, { id: "ajio", name: "Ajio" }],
      rank: "#4",
    },
    {
      name: "Retinol Night Cream 50ml",
      price: "₹1,939",
      status: "Critical",
      statusStyle: "bg-error-light text-error",
      platforms: [{ id: "myntra", name: "Myntra" }, { id: "shopify", name: "Shopify" }, { id: "amazon", name: "Amazon" }],
      rank: "#7",
    },
  ]

  const deltaTone: Record<string, string> = {
    up: "text-success",
    down: "text-error",
    neutral: "text-n-400 font-normal",
  }

  return (
    <div
      className="mt-16 w-full  relative z-[1]"
      style={{ animation: "fadeUp 0.8s 0.32s ease both" }}
    >
      <div className="bg-white border border-n-border rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.10),0_0_0_1px_rgba(0,0,0,0.04)] overflow-hidden">

        {/* Browser bar */}
        <div className="h-11 bg-n-50 border-b border-n-border flex items-center px-4 gap-2">
          <span className="w-[11px] h-[11px] rounded-full bg-[#FF5F57] inline-block" />
          <span className="w-[11px] h-[11px] rounded-full bg-[#FEBC2E] inline-block" />
          <span className="w-[11px] h-[11px] rounded-full bg-[#28C840] inline-block" />
        </div>

        {/* Body */}
        <div className="flex ">

          {/* Sidebar */}
          <div className="hidden lg:flex w-[220px] shrink-0 border-r border-n-border bg-white p-3 flex-col gap-0.5">
            <div className="flex items-center gap-1.5 px-2 mb-5">
              <span className="font-display text-base font-extrabold text-n-900 tracking-tight">
                Opsell<span className="text-brand">.</span>
              </span>
              <span className="w-2 h-2 rounded-full bg-brand animate-ai-pulse" />
            </div>
            {navItems.map((item) => (
              <div
                key={item.label}
                className={`flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg font-display text-[13px] transition-colors ${item.active
                  ? "font-bold text-brand bg-brand-light"
                  : "font-medium text-n-500"
                  }`}
              >
                <span
                  className="w-4 h-4 rounded-[4px] inline-block shrink-0"
                  style={{ background: "currentColor", opacity: item.active ? 1 : 0.25 }}
                />
                {item.label}
              </div>
            ))}
          </div>

          {/* Main */}
          <div className="flex-1 bg-n-50 p-5 flex flex-col gap-3.5 overflow-auto">

            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="font-display text-[22px] font-extrabold text-n-900 tracking-tight flex items-baseline gap-2">
                Overview
                <span className="text-sm font-medium text-n-400">· May 2026</span>
              </h2>
              <button className="font-display text-[12px] font-semibold text-brand bg-brand-light border border-ai-border rounded-full px-3.5 py-1.5 transition hover:bg-[#e4e1ff]">
                + New action
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-2.5">
              {stats.map((s) => (
                <div key={s.label} className="bg-white border border-n-border rounded-xl p-3.5">
                  <div className="font-display text-[10px] font-bold uppercase tracking-[0.08em] text-n-400 mb-1.5">
                    {s.label}
                  </div>
                  <div className="font-mono text-[26px] font-medium text-n-900 leading-none mb-1.5">
                    {s.val}
                  </div>
                  <div className={`font-display text-[11px] font-semibold ${deltaTone[s.tone]}`}>
                    {s.delta}
                  </div>
                </div>
              ))}
            </div>

            {/* Table */}
            <div className="bg-white border border-n-border rounded-xl overflow-hidden">
              <div className="grid grid-cols-[2fr_80px_110px_130px_60px] px-4 py-2.5 border-b border-n-100 bg-n-50">
                {["Product", "Price", "Status", "Multiplatform", "Rank"].map((h) => (
                  <span key={h} className="font-display text-[10px] font-bold uppercase tracking-[0.07em] text-n-400">
                    {h}
                  </span>
                ))}
              </div>
              {rows.map((row) => (
                <div
                  key={row.name}
                  className="grid grid-cols-[2fr_80px_110px_130px_60px] px-4 py-3 border-b border-n-100 items-center last:border-0 hover:bg-n-50 transition-colors"
                >
                  <span className="font-body text-[13px] text-n-700 font-medium truncate pr-2">
                    {row.name}
                  </span>
                  <span className="font-mono text-[13px] text-n-900">{row.price}</span>
                  <span className={`inline-flex items-center px-2.5 py-[3px] rounded-full font-display text-[11px] font-semibold w-fit ${row.statusStyle}`}>
                    {row.status}
                  </span>
                  <div className="flex items-center">
                    {row.platforms.map((p) => (
                      <PlatformAvatar key={p.id} id={p.id} name={p.name} />
                    ))}
                  </div>
                  <span className="font-mono text-[13px] text-n-900">{row.rank}</span>
                </div>
              ))}
            </div>

            {/* AI Panel */}
            <div className="bg-brand-light border border-ai-border rounded-xl p-3 flex items-center gap-3">
              <div className="flex items-center gap-1 shrink-0">
                {[0, 200, 400].map((d) => (
                  <span
                    key={d}
                    className="w-1.5 h-1.5 rounded-full bg-brand inline-block"
                    style={{ animation: `aiPulse 1.2s ease ${d}ms infinite` }}
                  />
                ))}
              </div>
              <span className="font-display text-[11px] font-bold text-brand shrink-0 whitespace-nowrap">
                AI Suggestion · Pricing
              </span>
              <span className="w-px h-4 bg-ai-border shrink-0" />
              <p className="font-body text-[12px] text-n-700 leading-relaxed flex-1">
                <strong className="font-display font-bold text-n-900">Retinol Night Cream</strong> is losing
                buy-box to a competitor at ₹1,760. Drop to ₹1,849 to recover{" "}
                <span className="font-mono text-[14px] font-semibold text-success">+₹5.2L</span> over 14 days.
              </p>
              <button className="shrink-0 font-display text-[13px] font-bold text-white bg-brand rounded-lg px-4 py-2 shadow-[0_4px_12px_rgba(80,70,229,0.3)] hover:bg-brand-dark transition-all hover:-translate-y-px whitespace-nowrap">
                Apply →
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export function PainSection() {
  return (
    <section className="bg-white px-6 py-20 sm:px-10 sm:py-24">
      {/* ── Header ── */}
      <div className="mb-12 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="mb-4 font-display text-[11px] font-bold uppercase tracking-[0.1em] text-brand">
            Where Revenue Leaks
          </p>
          <h2 className="font-display text-[clamp(32px,3.5vw,44px)] font-extrabold leading-[1.08] tracking-[-0.03em] text-n-900">
            The hidden reasons<br />
            brands lose <span className="text-brand">sales</span>.
          </h2>
        </div>
        <p className="font-body text-[15px] leading-[1.7] text-n-500 lg:pt-10">
          Most consumer brands don't lose revenue to bad products — they lose it to
          slow reactions, broken catalog hygiene, and execution gaps no dashboard can close.
        </p>
      </div>

      {/* ── 2×2 Grid ── */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

        {/* Card 1 — Tooling sprawl */}
        <PainCard
          index="01"
          title="Tooling sprawl"
          heading="Your team works across six different tools."
          body="Pricing is in one dashboard, listings in another, competitor tracking in spreadsheets, and performance in agency reports."
          metric="−12 hrs / week reconciling. 0 hrs winning"
        >
          <div className="grid w-full grid-cols-3 gap-1.5">
            {["Pricing Tool","Listings CMS","Comp Tracker","Sheets","Agency PDF","Ads Dash"].map((t, i) => (
              <div
                key={t}
                className="rounded-md border border-dashed border-n-300 bg-white px-2 py-2 text-center font-mono text-[9px] uppercase tracking-[0.05em] text-n-400 transition-colors duration-300 group-hover:border-n-400 group-hover:text-n-600"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {t}
              </div>
            ))}
          </div>
        </PainCard>

        {/* Card 2 — Manual decisions */}
        <PainCard
          index="02"
          title="Manual decisions"
          heading="Pricing decisions still happen on gut feel."
          body="Your team changes prices based on guesswork or stale competitor checks — not real-time signal."
          metric="−12% sales impact per cycle"
        >
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-base text-n-400 line-through decoration-n-300">₹999</span>
            <span className="text-n-300 text-sm">→</span>
            <span className="relative font-mono text-base font-semibold text-error rounded-md border-[1.5px] border-error bg-error-light px-2.5 py-1 shadow-elev-1">
              ₹849
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-error animate-ai-pulse" />
            </span>
            <span className="font-body text-[11px] text-n-400 flex items-center gap-1">
              <span className="text-n-300">·</span> 2 days late
            </span>
          </div>
        </PainCard>

        {/* Card 3 — Slow reactions */}
        <PainCard
          index="03"
          title="Slow reactions"
          heading="Competitors change faster than you can react."
          body="By the time you notice a price drop or a new bundle, you've already lost the buy-box for that day."
          metric="Buy-box lost in <6 hours"
        >
          <div className="flex items-stretch gap-1.5 w-full">
            {[
              { platform: "A", name: "Smart Watch Pro", price: "₹999",   highlight: false },
              { platform: "F", name: "Smartwatch",      price: "₹899",   highlight: true  },
              { platform: "M", name: "Watch Series X",  price: "₹1,849", highlight: false },
            ].map((item) => (
              <div
                key={item.name}
                className={`relative flex flex-1 flex-col items-center gap-1 rounded-lg border p-2.5 transition-all duration-300 ${
                  item.highlight
                    ? "border-error bg-error-light shadow-elev-1"
                    : "border-n-border bg-white group-hover:border-n-300"
                }`}
              >
                {item.highlight && (
                  <span className="absolute -top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-error animate-ai-pulse" />
                )}
                <span className={`font-mono text-[9px] uppercase tracking-[0.06em] ${item.highlight ? "text-error" : "text-n-400"}`}>
                  {item.platform}
                </span>
                <span className="font-body text-[11px] text-n-600 text-center leading-[1.3]">
                  {item.name}
                </span>
                <span className={`font-mono text-[13px] font-semibold ${item.highlight ? "text-error" : "text-n-900"}`}>
                  {item.price}
                </span>
              </div>
            ))}
          </div>
        </PainCard>

        {/* Card 4 — Inconsistent listings */}
        <PainCard
          index="04"
          title="Inconsistent listings"
          heading="Your product listings are different everywhere."
          body="Titles, images, prices, descriptions drift across marketplaces — eroding trust and conversion."
          metric="Up to −18% conversion"
        >
          <div className="flex w-full gap-1.5">
            {[
              { imgClass: "bg-n-200",    text: "men's sneakers white black" },
              { imgClass: "bg-pink-200", text: "RTPE white sneaker pair" },
              { imgClass: "bg-blue-200", text: "Redtape Court Sneakers – Premius" },
            ].map((item, i) => (
              <div key={i} className="flex flex-1 flex-col gap-1.5 rounded-lg bg-white border border-n-border p-2 transition-colors duration-300 group-hover:border-n-300">
                <div className={`h-9 w-full rounded ${item.imgClass}`} />
                <p className="font-body text-[9px] leading-[1.4] text-n-500">{item.text}</p>
              </div>
            ))}
          </div>
        </PainCard>

      </div>
    </section>
  );
}

/* ── Reusable revamped card ── */
function PainCard({
  index,
  title,
  heading,
  body,
  metric,
  children,
}: {
  index: string;
  title: string;
  heading: string;
  body: string;
  metric: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-n-border bg-white p-7 shadow-elev-1 transition-all duration-300 hover:-translate-y-0.5 hover:border-n-300 hover:shadow-elev-3">
      {/* Accent top bar */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-brand via-brand-mid to-brand transition-transform duration-500 group-hover:scale-x-100" />
      {/* Subtle brand glow */}
      <span className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-light opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-70" />

      {/* Eyebrow */}
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] tracking-[0.04em] text-n-400">
          {index} <span className="text-n-300 mx-1.5">/</span> {title}
        </p>
        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-n-300 transition-colors duration-300 group-hover:text-brand">
          Issue
        </span>
      </div>

      <h3 className="font-display text-[18px] font-bold leading-[1.25] tracking-[-0.02em] text-n-900">
        {heading}
      </h3>
      <p className="font-body text-[13px] leading-[1.6] text-n-500">
        {body}
      </p>

      {/* Mini mockup — refined surface */}
      <div className="relative my-1 flex flex-1 items-center justify-center overflow-hidden rounded-[12px] border border-n-border bg-gradient-to-b from-n-50 to-white p-4 min-h-[120px]">
        <span className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,#0F1114_1px,transparent_1px),linear-gradient(to_bottom,#0F1114_1px,transparent_1px)] [background-size:14px_14px]" />
        <div className="relative w-full">{children}</div>
      </div>

      {/* Metric pill */}
      <div className="mt-1 flex items-center gap-2">
        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-error animate-ai-pulse" />
        <p className="font-display text-[12px] font-semibold text-error">
          {metric}
        </p>
      </div>
    </div>
  );
}


// ─── Hero ─────────────────────────────────────────────────────────────────────
export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-white px-6 pb-20 pt-28 sm:px-10 sm:pt-[120px]">

      {/* Grid BG */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(80,70,229,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(80,70,229,0.04) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage:
              "radial-gradient(ellipse 70% 50% at 30% 20%, black 20%, transparent 100%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-[820px]">

        {/* Badge */}
        {/* <div
          className="mb-7 inline-flex items-center gap-2.5 overflow-hidden rounded-full border border-n-border bg-white px-2 py-1.5 shadow-elev-1"
          style={{ animation: "fadeUp 0.5s ease both" }}
        >
          <span className="rounded-full bg-n-900 px-2.5 py-1 font-display text-[11px] font-bold uppercase tracking-widest text-white">
            Soft Waitlist
          </span>
          <span className="pr-1 font-body text-[13px] font-medium text-n-600">
            15+ consumer brands queued for early access
          </span>
        </div> */}

        <div
          className="inline-flex items-center gap-2 px-4 py-[7px] rounded-full border border-[#E2E4E8] bg-white/90 backdrop-blur-sm shadow-[0_1px_3px_rgba(0,0,0,0.06)] font-display text-[13px] font-semibold text-[#4A4F57] mb-2 relative overflow-hidden z-[1]"
          style={{ animation: "fadeUp 0.6s ease both" }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full bg-[#5046E5] inline-block"
            style={{ animation: "aiPulse 1.5s ease infinite" }}
          />
          Your AI growth agent
          <div
            className="absolute top-0 -left-full w-3/5 h-full bg-[linear-gradient(90deg,transparent,rgba(80,70,229,0.15),transparent)]"
            style={{ animation: "pillBeam 3s ease infinite" }}
          />
        </div>

        {/* Eyebrow */}
        {/* <p
          className="mb-4 font-display text-[12px] font-bold uppercase tracking-[0.1em] text-brand"
          style={{ animation: "fadeUp 0.5s 0.04s ease both" }}
        >
          Your AI Growth Agent
        </p> */}

        {/* Headline */}
        <h1
          className="mb-6 font-display text-[clamp(40px,6.5vw,76px)] font-extrabold leading-[1.03] tracking-[-0.04em] text-n-900"
          style={{ animation: "fadeUp 0.55s 0.08s ease both" }}
        >
          Recover lost revenue
          <br />
          <span className="text-brand">across every</span>
          <br />
          marketplace.
        </h1>

        {/* Subtext */}
        <p
          className="mb-10 max-w-[540px] font-body text-[16px] leading-[1.65] text-n-500"
          style={{ animation: "fadeUp 0.55s 0.14s ease both" }}
        >
          Opsell is the AI-led execution layer for consumer brands. We don't
          just recommend actions — we write listings, move prices, fire
          campaigns, and run experiments via API. Less reaction. More revenue.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col items-start gap-3 sm:flex-row sm:items-center"
          style={{ animation: "fadeUp 0.55s 0.21s ease both" }}
        >
          <button className="w-full rounded-[10px] bg-brand px-7 py-3 font-display text-[15px] font-bold text-white shadow-[0_8px_24px_rgba(80,70,229,0.32)] transition-all hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-[0_12px_32px_rgba(80,70,229,0.42)] sm:w-auto">
            Start growing your revenue
          </button>
          <button className="w-full rounded-[10px] border-[1.5px] border-n-200 bg-white px-6 py-3 font-display text-[15px] font-semibold text-n-700 transition-colors hover:border-n-400 hover:text-n-900 sm:w-auto">
            See it execute →
          </button>
        </div>

      </div>

      <HeroDashboard />
      <PainSection />
    </section>
  );
}