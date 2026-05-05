"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { CSVIcon, ShopifyIcon, WooCommerceIcon } from "./brandIcons";

// ─── Shared hook ──────────────────────────────────────────────────────────────

const useLoop = (duration: number, active: boolean) => {
  const [cycle, setCycle] = useState(0);
  useEffect(() => {
    if (!active) return;
    const i = setInterval(() => setCycle((c) => c + 1), duration);
    return () => clearInterval(i);
  }, [active, duration]);
  return cycle;
};

// ─── Card shell ───────────────────────────────────────────────────────────────
// Consistent padding (p-6 = 24px), border, shadow across all 4 mockups

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white border border-n-200 rounded-xl p-6 flex flex-col gap-5 shadow-elev-2 min-h-[280px]">
    {children}
  </div>
);

const CardHeader = ({
  dot,
  dotColor = "bg-brand",
  label,
  right,
  icon,
}: {
  dot?: boolean;
  dotColor?: string;
  label: string;
  right?: React.ReactNode;
  icon?: React.ReactNode;
}) => (
  <div className="flex items-center gap-2">
    {dot && <span className={`w-2 h-2 rounded-full shrink-0 ${dotColor} animate-ai-pulse`} />}
    {icon}
    <p className="font-display text-[11px] font-bold text-n-900 uppercase tracking-[0.1em]">
      {label}
    </p>
    {right && <span className="ml-auto">{right}</span>}
  </div>
);

// ─── Step 1: Connect ──────────────────────────────────────────────────────────

const StepConnect = ({ inView }: { inView: boolean }) => {
  const cycle = useLoop(6000, inView);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!inView) return;
    setConnected(false);
    const t = setTimeout(() => setConnected(true), 1200);
    return () => clearTimeout(t);
  }, [cycle, inView]);

  const sources = [
    { name: "Shopify",     Icon: ShopifyIcon },
    { name: "WooCommerce", Icon: WooCommerceIcon },
    { name: "CSV upload",  Icon: CSVIcon },
  ];

  return (
    <Card>
      <CardHeader dot label="Connect store" />

      <div className="flex flex-col gap-2">
        {sources.map((s, i) => {
          const SrcIcon = s.Icon;
          const active = connected && i === 0;
          return (
            <motion.div
              key={s.name + cycle}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={[
                "flex items-center justify-between px-4 py-3 rounded-lg border",
                "font-body text-[14px] font-medium transition-all duration-400 cursor-pointer",
                active
                  ? "border-success bg-success-light text-success"
                  : "border-n-200 bg-n-50 text-n-600 hover:border-brand/40",
              ].join(" ")}
            >
              <span className="flex items-center gap-3">
                <SrcIcon size={17} />
                {s.name}
              </span>
              {active && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <Check size={14} />
                </motion.span>
              )}
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {connected && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-auto flex items-center gap-1.5 text-[12px] font-body text-success font-medium"
          >
            <Check size={12} />
            Catalog synced — 248 SKUs imported
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

// ─── Step 2: Analyze ──────────────────────────────────────────────────────────

const StepAnalyze = ({ inView }: { inView: boolean }) => {
  const cycle = useLoop(7000, inView);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setProgress(0);
    const iv = setInterval(() => setProgress((p) => Math.min(p + 2, 100)), 50);
    return () => clearInterval(iv);
  }, [cycle, inView]);

  const signals = [
    { label: "Competitor pricing",    done: progress > 30 },
    { label: "Demand & seasonality",  done: progress > 55 },
    { label: "Inventory pressure",    done: progress > 75 },
    { label: "SKU health tagging",    done: progress >= 100 },
  ];

  return (
    <Card>
      <CardHeader
        icon={<Sparkles size={12} className="text-brand" />}
        label="AI Analysis"
        right={
          <span className="font-mono text-[12px] text-brand font-medium">
            {progress}%
          </span>
        }
      />

      {/* Progress bar */}
      <div className="h-1.5 bg-n-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-brand rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ ease: "easeOut", duration: 0.15 }}
        />
      </div>

      <div className="flex flex-col gap-3">
        {signals.map((sig) => (
          <div key={sig.label} className="flex items-center gap-2.5">
            <div
              className={[
                "w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300",
                sig.done ? "bg-brand border-brand" : "border-n-300 bg-white",
              ].join(" ")}
            >
              {sig.done && <Check size={9} className="text-white" />}
            </div>
            <span
              className={[
                "font-body text-[13px] transition-colors duration-300",
                sig.done ? "text-n-900" : "text-n-400",
              ].join(" ")}
            >
              {sig.label}
            </span>
          </div>
        ))}
      </div>

      {progress < 100 && (
        <div className="mt-auto flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-brand animate-ai-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      )}
    </Card>
  );
};

// ─── Step 3: Recommend ────────────────────────────────────────────────────────

const StepRecommend = ({ inView }: { inView: boolean }) => {
  const cycle = useLoop(7000, inView);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!inView) return;
    setShow(false);
    const t = setTimeout(() => setShow(true), 1000);
    return () => clearTimeout(t);
  }, [cycle, inView]);

  return (
    <Card>
      <CardHeader dot label="Smart suggestion" />

      <div className="flex items-center gap-2">
        <span className="font-mono text-[11px] text-n-400 bg-n-100 px-2 py-0.5 rounded">
          SKU-4821
        </span>
        <span className="font-body text-[12px] text-n-500">
          Wireless Earbuds Pro
        </span>
      </div>

      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="bg-ai-bg border border-ai-border rounded-xl p-4 flex flex-col gap-3"
          >
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-[28px] font-extrabold text-brand tracking-tight">
                ₹849
              </span>
              <span className="font-body text-[13px] text-n-400 line-through">₹999</span>
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <span className="font-body text-[12px] text-n-500">Confidence</span>
                <span className="font-mono text-[11px] text-success font-medium">87%</span>
              </div>
              <div className="h-1 bg-ai-border rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-success"
                  initial={{ width: 0 }}
                  animate={{ width: "87%" }}
                  transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
                />
              </div>
            </div>

            <span className="bg-success-light text-success self-start inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-semibold font-display">
              +18% predicted sales
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-auto border border-n-200 rounded-lg p-3 bg-n-50"
          >
            <p className="font-body text-[12px] text-n-500 leading-relaxed">
              <span className="text-brand font-medium">Why?</span>{" "}
              Competitors at ₹899 avg. Your inventory is 40% above safety stock —
              discount now to clear before Q4.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

// ─── Step 4: Growth ───────────────────────────────────────────────────────────

const StepGrowth = ({ inView }: { inView: boolean }) => {
  const cycle = useLoop(7000, inView);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!inView) return;
    setShow(false);
    const t = setTimeout(() => setShow(true), 1200);
    return () => clearTimeout(t);
  }, [cycle, inView]);

  const metrics = [
    { label: "Revenue",       value: "+32%", cls: "text-success" },
    { label: "Conversion",    value: "+18%", cls: "text-brand" },
    { label: "Profit margin", value: "+9%",  cls: "text-[#7B73FF]" },
  ];

  const bars = [30, 45, 38, 55, 50, 65, 72, 68, 80, 92, 88, 100];

  return (
    <Card>
      <CardHeader
        dot
        dotColor="bg-success"
        label="Growth dashboard"
        right={
          <span className="font-body text-[11px] text-n-400">Live</span>
        }
      />

      <div className="flex gap-2 flex-wrap">
        {metrics.map((m, i) => (
          <AnimatePresence key={m.label}>
            {show && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12 }}
                className="flex flex-col gap-0.5 px-3 py-2 rounded-lg border border-n-200 bg-n-50"
              >
                <span className={`font-mono text-[15px] font-bold ${m.cls}`}>
                  {m.value}
                </span>
                <span className="font-body text-[11px] text-n-400">{m.label}</span>
              </motion.div>
            )}
          </AnimatePresence>
        ))}
      </div>

      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-auto flex items-end gap-1 h-14"
          >
            {bars.map((h, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-sm bg-brand"
                style={{ opacity: 0.4 + (h / 100) * 0.6 }}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: 0.5 + i * 0.04, duration: 0.4, ease: "easeOut" }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

// ─── Export ───────────────────────────────────────────────────────────────────

export const StepMockup = ({
  step,
  inView,
}: {
  step: number;
  inView: boolean;
}) => {
  const steps = [
    <StepConnect   key="connect"   inView={inView} />,
    <StepAnalyze   key="analyze"   inView={inView} />,
    <StepRecommend key="recommend" inView={inView} />,
    <StepGrowth    key="growth"    inView={inView} />,
  ];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.3 }}
      >
        {steps[step]}
      </motion.div>
    </AnimatePresence>
  );
};