"use client";

import { motion } from "framer-motion";
import { GMVCard } from "./gmvCard";
import ImproveMarginsCard from "./marginsCard";
import ConversionCard from "./conversionCard";
import TimeSavedCard from "./TimeCard";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";

export const GrowthOutcomes = () => {
  return (
    <section className="relative w-full overflow-hidden py-14 sm:py-16 md:py-20 bg-n-900">
      {/* Ambient glows */}
      <div
        className="pointer-events-none absolute"
        style={{
          left: "15%",
          top: "10%",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(80,70,229,0.07) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          right: "10%",
          bottom: "15%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(123,115,255,0.05) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Dot grid texture */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-12 md:px-16 lg:px-24">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-10 text-center md:mb-16"
        >
          {/* Heading glow */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: 700,
              height: 400,
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse, rgba(80,70,229,0.18) 0%, rgba(123,115,255,0.08) 40%, transparent 70%)",
              filter: "blur(48px)",
            }}
          />

          {/* Badge */}
          <span
            className="relative mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em]"
            style={{
              border: "1px solid rgba(80,70,229,0.3)",
              background: "rgba(80,70,229,0.08)",
              color: "#7B73FF",
            }}
          >
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: "#7B73FF", animation: "badgePulse 2s ease infinite" }}
            />
            one stop solution to all these problems
          </span>

          {/* Heading */}
          <motion.div
            className="relative mx-4 my-2 flex flex-col items-center justify-center gap-3 text-center sm:mx-0 md:flex-row"
            style={{ fontWeight: 700 }}
          >
            <LayoutTextFlip
              text="Opsell for"
              words={["Growth", "Automation", "Optimization"]}
            />
          </motion.div>
        </motion.div>

        {/* ── Bento grid ── */}
        {/*
          Mobile  (< md): single column stack
          Desktop (md+):  6-col bento  [4|2] top row, [3|3] bottom row
        */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-6">

          {/* Margins — col-span-4 on desktop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="group relative flex overflow-hidden md:col-span-4"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#5046E5]/10 opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />
            <ImproveMarginsCard />
          </motion.div>

          {/* GMV — col-span-2 on desktop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="group relative flex overflow-hidden md:col-span-2"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#7B73FF]/10 opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />
            <GMVCard />
          </motion.div>

          {/* Time saved — col-span-3 on desktop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className="group relative flex overflow-hidden md:col-span-3"
          >
            <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-[#5046E5]/10 opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />
            <TimeSavedCard />
          </motion.div>

          {/* Conversion — col-span-3 on desktop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="group relative flex overflow-hidden md:col-span-3"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#7B73FF]/10 opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />
            <ConversionCard />
          </motion.div>

        </div>

        {/* Bottom rule + footnote */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10 flex flex-col items-center gap-3 md:mt-12"
        >
          <div
            className="h-px w-48"
            style={{
              background: "linear-gradient(to right, transparent, rgba(80,70,229,0.35), transparent)",
            }}
          />
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-n-600 text-center">
            Trusted by D2C &amp; marketplace sellers across India
          </p>
        </motion.div>

      </div>

      <style>{`
        @keyframes badgePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(1.5); }
        }
      `}</style>
    </section>
  );
};