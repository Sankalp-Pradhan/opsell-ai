import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { Message } from "./types";

export function MessageBubble({ message }: { message: Message }) {
  const isBot = message.role === "bot";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={`flex gap-2 ${isBot ? "justify-start" : "justify-end"}`}
    >
      {isBot && (
        <div className="shrink-0 w-7 h-7 rounded-full brand-gradient grid place-items-center shadow-glow">
          <Sparkles className="w-3.5 h-3.5 text-brand-foreground" />
        </div>
      )}
      <div
        className={`max-w-[80%] px-4 py-2.5 text-sm leading-relaxed rounded-2xl ${
          isBot
            ? "glass text-foreground rounded-bl-md"
            : "brand-gradient text-brand-foreground rounded-br-md shadow-glow"
        }`}
      >
        {message.content}
      </div>
    </motion.div>
  );
}
