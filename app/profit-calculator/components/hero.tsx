"use client";

import Link from "next/link";
import Image from "next/image";

// ─── Marketplace chip data ────────────────────────────────────────────────────
const MARKETPLACE_ICONS = [
  {
    id: "amazon",
    href: "",
    label: "Amazon",
    img: "/assets/amazon.png",
    bg: "#FFFFFF",
    border: "#E2E4E8",
    style: "top-[8%] right-[22%]",
    size: "w-16 h-16",
    shadow: "shadow-elev-2",
  },
  {
    id: "flipkart",
    href: "",
    label: "Flipkart",
    img: "/assets/flipkart.png",
    bg: "#F7F7FF",
    border: "#C7C4FF",
    style: "top-[28%] left-[4%]",
    size: "w-16 h-16",
    shadow: "shadow-elev-2",
  },
  {
    id: "ebay",
    href: "",
    label: "eBay",
    img: "/assets/ebay.png",
    bg: "#FFFFFF",
    border: "#E2E4E8",
    style: "bottom-[28%] left-[2%]",
    size: "w-16 h-14",
    shadow: "shadow-elev-1",
  },
  {
    id: "meesho",
    href: "",
    label: "Meesho",
    img: "/assets/meesho1.png",
    bg: "#FFF0F7",
    border: "#F7C4E0",
    style: "top-[10%] right-[2%]",
    size: "w-20 h-12",
    shadow: "shadow-elev-1",
  },
  {
    id: "noon",
    href: "",
    label: "Noon",
    img: "/assets/jiomart.png",
    bg: "#FFFDE7",
    border: "#FFE57F",
    style: "bottom-[10%] right-[8%]",
    size: "w-14 h-14",
    shadow: "shadow-elev-1",
  },
  {
    id: "walmart",
    href: "",
    label: "Walmart",
    img: "/assets/ajio.png",
    bg: "#E8F4FF",
    border: "#90CAF9",
    style: "top-[55%] right-[0%]",
    size: "w-14 h-14",
    shadow: "shadow-elev-1",
  },
];

// ─── Central analytics card ───────────────────────────────────────────────────
function CentralCard() {
  return (
    <div className="relative  z-10 bg-white rounded-2xl shadow-elev-3 p-5 w-[140px]
                    border border-n-border flex flex-col items-center gap-3">
       <Image src="/assets/opsell-icon.png" alt="Analytics" width={50} height={50} />
      <div className="w-full flex flex-col gap-1.5">
        {[
          { color: "bg-brand",     w: "72%" },
          { color: "bg-brand-mid", w: "55%" },
          { color: "bg-success",   w: "85%" },
        ].map(({ color, w }) => (
          <div key={w} className="flex items-center gap-1.5">
            <div className={`h-1.5 rounded-full ${color}`} style={{ width: w }} />
            <div className="h-1.5 rounded-full bg-n-200 flex-1" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Connection lines ─────────────────────────────────────────────────────────
function ConnectionLines() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
      {[
        [200, 200, 290, 55],
        [200, 200, 30,  130],
        [200, 200, 20,  280],
        [200, 200, 360, 45],
        [200, 200, 345, 345],
        [200, 200, 370, 220],
      ].map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="#C7C4FF" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.6" />
      ))}
      <circle cx="200" cy="200" r="6" fill="#5046E5" opacity="0.2"/>
      <circle cx="200" cy="200" r="3" fill="#5046E5"/>
    </svg>
  );
}

// ─── Main Hero ────────────────────────────────────────────────────────────────
export default function HeroSection() {
  return (
    <div className="min-h-screen md:px-40 bg-n-50 font-body text-n-900 overflow-x-hidden">

     

      {/* ── Hero ── */}
      <section className="pt-14 min-h-screen flex items-center">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 w-full
                        grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8
                        py-16 sm:py-20">

          {/* LEFT: Copy */}
          <div className="flex flex-col justify-center">

            <div className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full
                            bg-success-light border border-success/20
                            text-success font-display text-ds-caption font-bold tracking-wide mb-5">
              <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3">
                <polyline points="3,8 6.5,11.5 13,5" stroke="#16A34A" strokeWidth="2.2"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Free forever · No signup · Works in your browser
            </div>

            <h1 className="font-display font-extrabold text-n-900 tracking-tight leading-[1.06]
                           text-[clamp(32px,5vw,52px)] mb-4 max-w-[560px]">
              Instant real-profit view
              <br />
              across all{" "}
              <span className="text-brand">8 marketplaces</span>
            </h1>

            <p className="font-body text-n-500 leading-relaxed
                          text-[clamp(14px,1.8vw,16px)] max-w-[480px] mb-8">
              Enter your selling price and cost. We&rsquo;ll show the real commission,
              shipping, GST, returns and net payout across Amazon, Flipkart,
              Meesho, Noon, Walmart, eBay, and more.
            </p>

            <div className="flex flex-wrap gap-3 items-center mb-8">
              <Link
                href="#calculator-form"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                           bg-brand text-white font-display font-semibold text-ds-body
                           shadow-[0_4px_18px_rgba(80,70,229,0.35)]
                           hover:bg-brand-dark transition-colors duration-150 no-underline"
              >
                Enter your numbers
                <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                  <path d="M8 3l5 5-5 5M3 8h10" stroke="white" strokeWidth="1.8"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>

              <button className="inline-flex items-center gap-2 px-5 py-3 rounded-xl
                                 bg-white border border-n-border text-n-700 font-display font-semibold
                                 text-ds-body hover:bg-n-50 hover:border-n-200 transition-colors duration-150">
                <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                  <path d="M8 2l1.5 3.5 3.5.5-2.5 2.5.5 3.5L8 10.5 5 12l.5-3.5L3 6l3.5-.5z"
                    fill="#F59E0B" stroke="#F59E0B" strokeWidth="0.5" strokeLinejoin="round"/>
                </svg>
                Try with sample product
              </button>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2 items-center font-body text-ds-caption text-n-400">
              <TrustPill color="bg-success"   label="Your data never leaves this browser" />
              <TrustPill color="bg-brand"     label="Fees verified today" />
              <TrustPill color="bg-brand-mid" label="Amazon · Flipkart · Meesho · Noon · Walmart · eBay" />
            </div>
          </div>

          {/* RIGHT: Constellation */}
          <div className="relative flex items-center justify-center lg:justify-end min-h-[360px] sm:min-h-[420px]">

            {/* Radial glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[320px] h-[320px] rounded-full
                              bg-[radial-gradient(circle,rgba(80,70,229,0.08)_0%,transparent_70%)]" />
            </div>

            <div className="relative w-[360px] h-[360px] sm:w-[400px] sm:h-[400px]">
              <ConnectionLines />

              {/* Central card */}
              <div className="absolute inset-0 flex items-center justify-center">
                <CentralCard />
              </div>

              {/* Floating marketplace chips with real images */}
              {MARKETPLACE_ICONS.map((m) => (
                <Link
                  key={m.id}
                  href={m.href}
                  aria-label={m.label}
                  className={`
                    absolute ${m.style} ${m.size}
                    rounded-2xl border flex items-center justify-center overflow-hidden
                    no-underline transition-transform duration-200
                    hover:-translate-y-1 hover:shadow-elev-3
                    animate-fade-up ${m.shadow}
                  `}
                  style={{ background: m.bg, borderColor: m.border }}
                >
                  <Image
                    src={m.img}
                    alt={m.label}
                    width={80}
                    height={48}
                    className="absolute inset-0 h-full w-full object-contain p-2"
                  />
                </Link>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

// ─── TrustPill ───────────────────────────────────────────────────────────────
function TrustPill({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${color}`} />
      {label}
    </span>
  );
}