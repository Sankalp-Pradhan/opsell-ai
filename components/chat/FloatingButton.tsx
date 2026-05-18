import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useState } from "react";

export function FloatingButton({ open, onClick }: { open: boolean; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <div className="relative">
      <AnimatePresence>
        {hover && !open && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.9 }}
            className="absolute right-[68px] top-1/2 -translate-y-1/2 whitespace-nowrap glass px-3.5 py-2 rounded-xl text-sm font-medium text-foreground shadow-elevated"
          >
            Need help growing your sales?
            <span className="absolute right-[-5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rotate-45 glass border-l-0 border-b-0" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={onClick}
        onHoverStart={() => setHover(true)}
        onHoverEnd={() => setHover(false)}
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.06 }}
        className={`relative w-14 h-14 rounded-full brand-gradient grid place-items-center text-brand-foreground shadow-elevated ${
          open ? "" : "animate-pulse-glow"
        }`}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "x" : "msg"}
            initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 grid place-items-center"
          >
            {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-6 h-6" />}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
