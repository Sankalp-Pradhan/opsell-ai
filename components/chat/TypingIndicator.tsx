import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-bl-md glass w-fit">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}
