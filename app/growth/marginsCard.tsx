import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";

function useCountUp(target: number, start: boolean, duration = 1.4, decimals = 0) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => v.toFixed(decimals));
  const [value, setValue] = useState("0");
  useEffect(() => {
    if (!start) return;
    const controls = animate(mv, target, { duration, ease: [0.22, 1, 0.36, 1] });
    const unsubscribe = rounded.on("change", (v) => setValue(v));
    return () => { controls.stop(); unsubscribe(); };
  }, [start, target, duration, mv, rounded]);
  return value;
}

const DATA = [
  { label: "Footwear", before: 18, after: 28 },
  { label: "Apparel", before: 22, after: 32 },
  { label: "Beauty", before: 16, after: 30 },
  { label: "Bags", before: 19, after: 26 },
];

const MAX = 40;

export default function MarginsCard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const margin = useCountUp(12, inView);
  const beforeMargin = useCountUp(18, inView, 1.1);
  const afterMargin = useCountUp(30, inView, 1.5);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="group relative w-full overflow-hidden rounded-[2rem] border border-white/[0.06] bg-[#10122b] p-6 md:p-8 shadow-2xl transition-all duration-500"
    >
      {/* Heading */}
      <div className="mb-6">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-brand-mid">
          Improve Margins
        </p>
        <div className="flex items-baseline gap-2 mb-1">
          <h3 className="text-5xl font-bold tracking-tight text-white">+{margin}%</h3>
        </div>
        <p className="text-lg text-n-300 font-medium">higher profit margins</p>
        <p className="mt-3 text-sm leading-6 text-n-500">
          Smarter discounts and pricing decisions that protect margins while still increasing sales.
        </p>
      </div>

      {/* Horizontal Bar Chart */}
      <div className="rounded-2xl border border-white/[0.05] bg-[#0b0d1e] p-5">
        <div className="flex flex-col gap-4">
          {DATA.map((item, index) => (
            <div key={item.label} className="flex items-center gap-4">
              <span className="w-16 text-[10px] font-bold uppercase tracking-[0.14em] text-n-600 shrink-0">
                {item.label}
              </span>
              <div className="flex flex-1 flex-col gap-1.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${(item.before / MAX) * 100}%` } : {}}
                  transition={{ delay: 0.2 + index * 0.07, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="h-[7px] rounded-full bg-n-700"
                />
                <motion.div
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${(item.after / MAX) * 100}%` } : {}}
                  transition={{ delay: 0.4 + index * 0.07, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="h-[7px] rounded-full bg-brand-mid"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-5 flex items-center gap-6 text-[10px] font-semibold uppercase tracking-wide">
          <span className="flex items-center gap-2 text-n-500">
            <span className="h-[6px] w-5 rounded-full bg-n-700" />
            Before
          </span>
          <span className="flex items-center gap-2 text-brand-mid">
            <span className="h-[6px] w-5 rounded-full bg-brand-mid" />
            With Opsell
          </span>
        </div>
      </div>

      {/* Before vs After */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="rounded-xl border border-white/[0.05] bg-[#0b0d1e] p-4"
        >
          <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.18em] text-n-500">Before Opsell</p>
          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="text-2xl font-bold text-white">{beforeMargin}%</p>
              <p className="mt-1 text-[10px] text-n-500">Random discounts</p>
            </div>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-error/10 text-error">
              <TrendingDown className="h-3.5 w-3.5" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.95 }}
          className="rounded-xl border border-brand/20 bg-brand/10 p-4"
        >
          <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.18em] text-brand-mid">With Opsell</p>
          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="text-2xl font-bold text-white">{afterMargin}%</p>
              <p className="mt-1 text-[10px] text-n-500">Smarter pricing</p>
            </div>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-white">
              <TrendingUp className="h-3.5 w-3.5" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1.05 }}
        className="mt-4 flex flex-wrap items-center justify-center gap-2 rounded-full bg-[#0b0d1e] px-4 py-2.5 text-[10px] font-semibold text-n-400"
      >
        <span>Random Discounts</span>
        <ArrowRight className="h-3.5 w-3.5 text-brand-mid" />
        <span className="text-white">Smart Pricing</span>
      </motion.div>
    </motion.div>
  );
}