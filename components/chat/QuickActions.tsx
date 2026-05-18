import { motion } from "framer-motion";
import type { QuickAction } from "./types";

export function QuickActions({
  actions,
  onSelect,
}: {
  actions: QuickAction[];
  onSelect: (value: string, label: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 pl-9">
      {actions.map((a, i) => (
        <motion.button
          key={a.value}
          initial={{ opacity: 0, y: 6, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -1, scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelect(a.value, a.label)}
          className="px-3.5 py-1.5 text-xs font-medium rounded-full glass hover:bg-accent/60 hover:border-brand/40 transition-colors text-foreground"
        >
          {a.label}
        </motion.button>
      ))}
    </div>
  );
}
