"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Plug, Brain, Tag, TrendingUp } from "lucide-react";
import { StepMockup } from "./stepMockup";
import PlatformMarquee from "./platformMarquee";

/* ---------------------- STEPS DATA ---------------------- */
const STEPS = [
  {
    n: "01",
    eyebrow: "Connect in minutes",
    title: "Connect your store",
    body: "Link Shopify, WooCommerce, or upload your product data as CSV. Opsell syncs your catalog in seconds — no code, no engineers.",
    icon: Plug,
    bullets: [
      "1-click Shopify & WooCommerce",
      "CSV import for anything else",
      "Live product sync",
    ],
  },
  {
    n: "02",
    eyebrow: "Let AI do the analysis",
    title: "Opsell analyzes your products",
    body: "Our AI studies competitor pricing, market demand, inventory pressure, and seasonality — then tags every SKU with what it really needs.",
    icon: Brain,
    bullets: [
      "Competitor price tracking",
      "Demand & seasonality signals",
      "Auto SKU health tags",
    ],
  },
  {
    n: "03",
    eyebrow: "Pricing that converts",
    title: "Get smart suggestions",
    body: "Receive recommended prices, discount windows, and bundle ideas — each with predicted impact on conversion and revenue.",
    icon: Tag,
    bullets: [
      "Optimal price per SKU",
      "Smart discount timing",
      "Bundle & upsell ideas",
    ],
  },
  {
    n: "04",
    eyebrow: "Scale without guesswork",
    title: "Track the growth",
    body: "Watch revenue, profit, and conversions improve in a live dashboard. Opsell keeps learning and surfaces new opportunities every week.",
    icon: TrendingUp,
    bullets: [
      "Live revenue dashboard",
      "Weekly opportunity alerts",
      "Profit & conversion lift",
    ],
  },
];

/* ---------------------- COUNT UP ---------------------- */
const CountUp = ({ to, suffix = "" }: { to: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let raf = 0;
    const start = performance.now();
    const duration = 1400;

    const tick = (t: number) => {
      const progress = Math.min(1, (t - start) / duration);
      setVal(Math.round(to * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
};

/* ---------------------- STEP ROW ---------------------- */
const StepRow = ({
  step,
  index,
}: {
  step: (typeof STEPS)[number];
  index: number;
}) => {
  const Icon = step.icon;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-10%" });
  const isLast = index === STEPS.length - 1;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center py-16 ${!isLast ? "border-b border-n-200" : ""
        }`}
    >
      {/* LEFT TEXT */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-brand bg-ai-bg px-2 py-0.5 rounded">
            {step.n}
          </span>
          <Icon size={12} className="text-n-400" />
          <span className="text-[12px] text-n-400 tracking-wide">
            {step.eyebrow}
          </span>
        </div>

        <h3 className="text-[28px] font-semibold text-n-900">
          {step.title}
        </h3>

        <div className="w-10 h-[3px] bg-brand rounded-full" />

        <p className="text-[15px] text-n-600 max-w-[440px]">
          {step.body}
        </p>

        <ul className="flex flex-col gap-2">
          {step.bullets.map((b) => (
            <li key={b} className="flex items-center gap-3 text-[14px]">
              <span className="w-1.5 h-1.5 rounded-full bg-brand" />
              {b}
            </li>
          ))}
        </ul>

        <button className="self-start mt-2 inline-flex items-center gap-2 text-brand font-bold">
          Try this step <ArrowRight size={14} />
        </button>
      </div>

      {/* RIGHT MOCKUP */}
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
        >
          <StepMockup step={index} inView={inView} />
        </motion.div>
      </div>
    </motion.div>
  );
};

/* ---------------------- PAGE ---------------------- */
export default function HowItWorksPage() {
  return (
    <main className="bg-white min-h-screen pb-28">

      {/* HERO */}
      {/* HERO */}
      {/* HERO */}
      <section className="px-4 lg:p-10 mt-5 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
        <div className="mx-auto max-w-3xl text-center">

          {/* Eyebrow pill */}
          <div className="inline-flex items-center gap-2 rounded-md border border-ai-border bg-ai-bg px-3 py-1.5 font-display text-ds-caption font-bold uppercase tracking-[0.12em] text-brand">
            <Plug className="h-3.5 w-3.5 shrink-0" />
            How it works
          </div>

          {/* Headline */}
          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.08] tracking-[-0.02em] text-n-900 sm:text-5xl lg:text-6xl">
            From chaos to clarity{" "}
            <span className="text-brand">in four steps.</span>
          </h1>

          {/* Brand divider */}
          <div className="mx-auto my-6 h-1 w-10 rounded-sm bg-brand" />

          {/* Subheading */}
          <p className="font-body text-ds-body leading-relaxed text-n-500 sm:text-lg">
            Connect your store, let AI do the analysis, act on smart suggestions,
            and watch revenue grow — automatically.
          </p>

          {/* Step breadcrumb */}
          <div className="mt-8 flex flex-wrap mb-10 items-center justify-center gap-2 font-display text-ds-caption font-semibold text-n-400">
            {["Connect", "Analyze", "Act", "Grow"].map((label, i) => (
              <span key={label} className="flex items-center gap-2">
                <span className="rounded-md bg-brand-light px-2.5 py-1 text-brand">
                  {label}
                </span>
                {i < 3 && <ArrowRight className="h-3 w-3 text-n-300" />}
              </span>
            ))}
          </div>

        </div>
        
      </section>

      {/* MARQUEE */}
      <PlatformMarquee  />

      {/* STEPS */}
      <section className="px-6 max-w-6xl mx-auto">
        {STEPS.map((s, i) => (
          <StepRow key={s.n} step={s} index={i} />
        ))}
      </section>

      {/* CTA */}

    </main>
  );
}

