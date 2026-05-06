"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const chips = [
  { label: "+12% Orders", delay: 1.2 },
  { label: "+8% AOV", delay: 1.45 },
  { label: "+18% Revenue", delay: 1.7 },
];

export const GMVCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className="group relative w-full overflow-hidden rounded-[28px] border border-white/[0.06] bg-[#10122b] p-5 sm:p-6 md:p-7 shadow-2xl transition-all duration-500"
    >
      {/* Arrow badge */}
      <div className="absolute right-5 top-5 z-10 flex h-8 w-8 items-center justify-center rounded-md bg-brand shadow-[0_0_24px_rgba(80,70,229,0.5)] transition-transform duration-500 group-hover:scale-110">
        <ArrowUpRight className="h-4 w-4 text-white" />
      </div>

      <div className="relative z-10 pr-12">
        <span className="mb-3 inline-block text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-mid">
          Increase GMV
        </span>

        <div className="mb-1 flex items-baseline gap-2">
          <h3 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-none text-white">
            +18%
          </h3>
        </div>

        <p className="mb-1 text-base sm:text-lg font-medium text-n-300">average GMV growth</p>

        <p className="mb-5 text-sm leading-6 text-n-500">
          Smarter pricing, AI-powered bundles, and optimized listings drive sales and faster growth.
        </p>
      </div>

      {/* Chart */}
      <div className="relative z-10 rounded-xl border border-white/[0.05] bg-[#0b0d1e] p-3 h-36 sm:h-40 md:h-48">
        <svg viewBox="0 0 400 200" className="h-full w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lineGradGMV" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7B73FF" />
              <stop offset="100%" stopColor="#5046E5" />
            </linearGradient>
            <linearGradient id="areaGradGMV" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#5046E5" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#5046E5" stopOpacity="0" />
            </linearGradient>
          </defs>

          {[40, 80, 120, 160].map((y) => (
            <line key={y} x1="0" y1={y} x2="400" y2={y}
              stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="3 5" />
          ))}

          <text x="10"  y="195" fill="rgba(107,112,122,0.8)" fontSize="16">Day 0</text>
          <text x="145" y="195" fill="rgba(107,112,122,0.8)" fontSize="16">Day 30</text>
          <text x="285" y="195" fill="rgba(107,112,122,0.8)" fontSize="16">Day 60</text>

          <motion.path
            d="M 0 180 C 60 170, 100 150, 140 140 S 220 110, 260 80 S 340 40, 400 20 L 400 180 L 0 180 Z"
            fill="url(#areaGradGMV)"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.5 }}
          />

          <motion.path
            d="M 0 180 C 60 170, 100 150, 140 140 S 220 110, 260 80 S 340 40, 400 20"
            fill="none"
            stroke="url(#lineGradGMV)"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0.2 }}
            style={{ filter: "drop-shadow(0 0 10px rgba(80,70,229,0.6))" }}
          />

          <motion.circle
            r="5" fill="#7B73FF"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 0.4 }}
            style={{ filter: "drop-shadow(0 0 10px rgba(80,70,229,0.9))" }}
          >
            <animateMotion dur="3s" repeatCount="indefinite"
              path="M 0 180 C 60 170, 100 150, 140 140 S 220 110, 260 80 S 340 40, 400 20" />
          </motion.circle>

          <motion.circle cx="400" cy="20" r="5" fill="#7B73FF"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 2, type: "spring" }}
            style={{ filter: "drop-shadow(0 0 12px rgba(80,70,229,0.9))" }}
          />
        </svg>
      </div>

      {/* Chips */}
      <div className="mt-4 flex flex-wrap gap-2">
        {chips.map((chip) => (
          <motion.span
            key={chip.label}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: chip.delay, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-full border border-brand/25 bg-brand/10 px-3 py-1 text-[11px] font-semibold text-brand-mid"
          >
            {chip.label}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
};