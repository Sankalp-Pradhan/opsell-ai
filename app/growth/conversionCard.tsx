"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  ArrowDown, ArrowRight, TrendingDown, TrendingUp,
  MousePointerClick, Target, BarChart3,
} from "lucide-react";
import Image from "next/image";

function useCountUp(target: number, start: boolean, duration = 1.6, decimals = 1) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (value) => value.toFixed(decimals));
  const [displayValue, setDisplayValue] = useState("0.0");
  useEffect(() => {
    if (!start) return;
    const controls = animate(motionValue, target, { duration, ease: [0.22, 1, 0.36, 1] });
    const unsubscribe = rounded.on("change", (value) => setDisplayValue(value));
    return () => { controls.stop(); unsubscribe(); };
  }, [start, target, duration, motionValue, rounded]);
  return displayValue;
}

const ProductGlyph = ({ variant }: { variant: "before" | "after" }) => {
  const isAfter = variant === "after";
  return (
    <div
      className={`relative w-full overflow-hidden rounded-lg ${isAfter ? "bg-gradient-to-br from-brand/15 via-[#0b0d1e] to-[#0b0d1e]" : "bg-[#0e1020]"}`}
      style={{ aspectRatio: "4/3" }}
    >
      <Image
        src="/assets/shoe.png"
        alt={isAfter ? "Optimized sneaker listing" : "Unoptimized sneaker listing"}
        width={320} height={240}
        className={`absolute inset-0 h-full w-full object-contain p-2 transition duration-500 ${isAfter ? "" : "scale-105 grayscale blur-[2px] opacity-40"}`}
      />
      {isAfter && (
        <>
          <motion.div
            className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-brand/15 blur-2xl"
            animate={{ scale: [1, 1.15, 1], opacity: [0.45, 0.75, 0.45] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          {[...Array(4)].map((_, index) => (
            <motion.div
              key={index}
              className="absolute h-1 w-1 rounded-full bg-brand-mid"
              style={{ left: `${22 + index * 18}%`, top: `${28 + (index % 2) * 28}%` }}
              animate={{ y: [0, -8, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 2.2, delay: index * 0.3, repeat: Infinity }}
            />
          ))}
        </>
      )}
    </div>
  );
};

const metrics = [
  { icon: MousePointerClick, label: "Product Clicks",     value: "+18%" },
  { icon: Target,            label: "Better CTR",         value: "+30%" },
  { icon: BarChart3,         label: "Higher Conversion",  value: "+1.2%" },
];

const ConversionCard = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const beforeConversion = useCountUp(4.0, inView);
  const afterConversion  = useCountUp(5.2, inView, 1.8);

  return (
    <div ref={ref} className="flex h-full w-full">
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="group/card relative flex h-full w-full flex-col overflow-hidden rounded-[24px] border border-white/[0.06] bg-[#10122b] p-4 sm:p-5 md:p-6 shadow-2xl"
      >
        {/* Header */}
        <div className="relative z-10 pr-10 sm:pr-12">
          <span className="mb-3 inline-block text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-mid">
            Increase conversion rate
          </span>

          <div className="mb-1 flex items-baseline gap-2">
            <h3 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-none text-white">
              Listings
            </h3>
          </div>

          <p className="mb-1 text-base sm:text-lg font-medium text-n-300">optimised by AI</p>

          <p className="mb-4 sm:mb-5 text-sm leading-6 text-n-500">
            AI-rewritten titles, images, and copy turn more visitors into buyers.
          </p>
        </div>

        {/* Before / After comparison
            - Mobile:   stacked vertically (flex-col)
            - Desktop:  side-by-side grid
        */}
        <div className="grid flex-1 grid-cols-1 items-center gap-3 md:grid-cols-[1fr_auto_1fr] md:gap-4">

          {/* Before */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 0.9, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="rounded-xl border border-white/[0.05] bg-[#0b0d1e] p-3"
          >
            <ProductGlyph variant="before" />
            <div className="mt-2.5 space-y-1.5">
              <p className="text-xs font-medium text-n-400 sm:text-sm">Men's Sneakers — White/Black</p>
              <span className="inline-flex items-center gap-1 rounded-full bg-error/10 px-2 py-0.5 text-[10px] font-light text-error">
                <TrendingDown className="h-3 w-3" />
                {beforeConversion}% Conversion
              </span>
              <p className="text-[11px] text-n-600">Weak title. Low engagement.</p>
            </div>
          </motion.div>

          {/* Arrow — vertical on mobile, horizontal on desktop */}
          <div className="flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.45, duration: 0.45 }}
              className="relative flex flex-row items-center gap-1 md:flex-row"
            >
              <div className="hidden h-px w-8 bg-gradient-to-r from-transparent via-white/10 to-white/10 md:block" />
              <div className="relative">
                <motion.div
                  animate={{ y: [0, 3, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white shadow-lg"
                >
                  {/* Always show right arrow — on mobile it still means "next/better" */}
                  <ArrowRight className="h-4 w-4" strokeWidth={3} />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.8 }}
                  className="absolute -top-7 -left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-full border border-brand/25 bg-[#0b0d1e] px-2 py-0.5 text-[10px] font-semibold text-brand-mid shadow-sm md:block"
                >
                  +30% Better CTR
                </motion.div>
              </div>
              <div className="hidden h-px w-8 bg-gradient-to-r from-white/10 via-white/10 to-transparent md:block" />
            </motion.div>
          </div>

          {/* After */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            className="relative rounded-xl border border-brand/25 bg-brand/8 p-3 shadow-[0_0_24px_rgba(80,70,229,0.12)] transition-shadow"
          >
            <span className="absolute -top-2 right-3 rounded-full bg-brand px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white">
              With Opsell
            </span>
            <ProductGlyph variant="after" />
            <div className="mt-2.5 space-y-1.5">
              <p className="text-xs font-semibold text-white sm:text-sm">
                Redtape Men's Low-Top Court Sneakers — Premium Daily Wear
              </p>
              <motion.span
                animate={{ boxShadow: ["0 0 0 0 rgba(80,70,229,0.35)", "0 0 0 6px rgba(80,70,229,0)"] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-light text-success"
              >
                <TrendingUp className="h-3 w-3" />
                {afterConversion}% Conversion
              </motion.span>
              <p className="text-[11px] text-n-600">Optimized title, image and pricing.</p>
            </div>
          </motion.div>
        </div>

        {/* Mobile CTR badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.9 }}
          className="mt-3 flex justify-center md:hidden"
        >
          <span className="rounded-full border border-brand/25 bg-[#0b0d1e] px-3 py-1 text-[11px] font-semibold text-brand-mid shadow-sm">
            +30% Better CTR
          </span>
        </motion.div>

        {/* Footer metrics — 3 cols always, but smaller on mobile */}
        <div className="mt-5 grid grid-cols-3 gap-2 border-t border-white/[0.06] pt-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.95 + index * 0.1 }}
              className="flex flex-col items-start gap-1 rounded-lg bg-[#0b0d1e] px-2 py-2 sm:flex-row sm:items-center sm:gap-2 sm:px-3"
            >
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-brand/12 text-brand-mid sm:h-8 sm:w-8">
                <metric.icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </div>
              <div>
                <div className="text-[11px] font-bold tabular-nums text-white sm:text-sm">{metric.value}</div>
                <div className="text-[9px] leading-tight text-n-500 sm:text-[11px]">{metric.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.article>
    </div>
  );
};

export default ConversionCard;