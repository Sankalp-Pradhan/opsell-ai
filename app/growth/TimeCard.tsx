"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
  AnimatePresence,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Clock, LayoutDashboard, Sparkles, Check, Zap } from "lucide-react";

function useCountUp(target: number, start: boolean, duration = 1.6, decimals = 0) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (value) => value.toFixed(decimals));
  const [displayValue, setDisplayValue] = useState("0");
  useEffect(() => {
    if (!start) return;
    const controls = animate(motionValue, target, { duration, ease: [0.22, 1, 0.36, 1] });
    const unsubscribe = rounded.on("change", (value) => setDisplayValue(value));
    return () => { controls.stop(); unsubscribe(); };
  }, [start, target, duration, motionValue, rounded]);
  return displayValue;
}

const TASKS = ["Update Prices", "Fix Listing", "Check Competitors", "Sync Platforms"];

export const TimeSavedCard = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const savedHours = useCountUp(10, inView, 1.4);
  const [phase, setPhase] = useState<"tasks" | "automated" | "dashboard">("tasks");
  const [replayKey, setReplayKey] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setPhase("tasks");
    const t1 = setTimeout(() => setPhase("automated"), 1800);
    const t2 = setTimeout(() => setPhase("dashboard"), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [inView, replayKey]);

  return (
    <div ref={ref} className="flex h-full w-full">
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -4 }}
        onHoverStart={() => setReplayKey((c) => c + 1)}
        className="group relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-white/[0.06] bg-[#10122b] p-6 shadow-2xl md:p-7"
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand/8 blur-3xl" />

        {/* Header */}
        {/* <div className="relative flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-brand/12 px-3 text-xs font-medium text-brand-mid">
              <Sparkles className="h-3.5 w-3.5" />
              Save Team Time
            </span>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
              Faster
            </h3>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-4xl font-bold tabular-nums text-white">{savedHours}</span>
              <span className="text-lg font-semibold text-n-500">hrs/week</span>
            </div>
          </div>

          <motion.div
            initial={{ rotate: 0 }}
            animate={inView ? { rotate: [0, 720, 740, 740] } : {}}
            transition={{ duration: 3.4, times: [0, 0.7, 0.9, 1], ease: "easeOut" }}
            className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand/12 text-brand-mid shadow-sm"
          >
            <Clock className="h-7 w-7" />
          </motion.div>
        </div> */}
        <div className="relative z-10 pr-12">
          <span className="mb-3 inline-block text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-mid">
            Increase GMV
          </span>

          <div className="mb-1 flex items-baseline gap-2">
            <h3 className="text-5xl md:text-6xl font-bold leading-none text-white">
              Faster
            </h3>
          </div>

          <p className="mb-1 text-lg font-medium text-n-300">reaction cycle</p>

          <p className="mb-5 text-sm leading-6 text-n-500">
            Catch competitor moves and listing breakages within minutes, not days. Capture revenue before it leaks.
          </p>
        </div>

        <p className="relative mt-4 text-sm text-n-500">
          Automate repetitive pricing, listing updates and competitor tracking — your team focuses on growth.
        </p>

        {/* Dynamic area */}
        <div className="relative mt-5 flex-1 rounded-2xl border border-white/[0.05] bg-[#0b0d1e] p-4 min-h-[180px]">
          <AnimatePresence mode="wait">
            {phase === "tasks" && (
              <motion.div key={`tasks-${replayKey}`} initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-2">
                {TASKS.map((task, index) => (
                  <motion.div
                    key={task}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12, scale: 0.9 }}
                    transition={{ delay: index * 0.15, duration: 0.35 }}
                    className="flex items-center justify-between rounded-lg border border-white/[0.05] bg-[#13152e] px-3 py-2 text-xs font-medium text-n-300 shadow-sm"
                  >
                    <span>{task}</span>
                    <span className="h-2 w-2 animate-pulse rounded-full bg-error" />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {phase === "automated" && (
              <motion.div
                key={`automated-${replayKey}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="flex h-full min-h-[150px] items-center justify-center"
              >
                <div className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-lg">
                  <Check className="h-4 w-4" />
                  Automated
                </div>
              </motion.div>
            )}

            {phase === "dashboard" && (
              <motion.div
                key={`dashboard-${replayKey}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-full flex-col items-center justify-center gap-3 py-2"
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="relative flex h-20 w-32 items-center justify-center rounded-xl border border-white/[0.07] bg-[#13152e] ring-4 ring-brand/10"
                >
                  <LayoutDashboard className="h-8 w-8 text-brand-mid" />
                  <motion.span
                    animate={{ boxShadow: ["0 0 0 0px rgba(80,70,229,0.4)", "0 0 0 10px rgba(80,70,229,0)"] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                    className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-white"
                  >
                    <Check className="h-3 w-3" />
                  </motion.span>
                </motion.div>
                <p className="text-center text-xs font-medium text-n-300">1 dashboard instead of 6 tools</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="relative mt-5 flex items-center justify-between gap-3">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.2 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-brand/25 bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand-mid"
          >
            <Zap className="h-3.5 w-3.5" />
            10 hrs saved every week
          </motion.div>
          <span className="text-[11px] text-n-600">5+ repetitive tasks automated</span>
        </div>
      </motion.article>
    </div>
  );
};

export default TimeSavedCard;