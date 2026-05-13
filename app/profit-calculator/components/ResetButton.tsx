"use client";

import { useState, useRef, useEffect } from "react";
import type { ReactElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconRefresh } from "./Icon";


interface ResetButtonProps {
  onClick: () => void;
}

export function ResetButton({ onClick }: ResetButtonProps): ReactElement {
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const handleConfirm = () => {
    setOpen(false);
    onClick();
  };

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        ref={triggerRef}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Clear all settings"
        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg
                   border font-display font-semibold text-ds-caption
                   transition-colors duration-150
                   ${open
            ? "bg-error/10 border-error/40 text-error"
            : "bg-error-light border-error/20 text-error hover:bg-red-100"
          }`}
      >
        <IconRefresh size={14} />
        Clear All
      </button>

      {/* Popover */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={popoverRef}
            role="dialog"
            aria-modal="true"
            aria-label="Confirm reset"
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            // Align to the right edge of the trigger on desktop,
            // and stay within viewport on mobile via left-0 + min-w.
            className="absolute right-0 top-[calc(100%+8px)] z-50
                       w-[260px] sm:w-72
                       bg-white border border-n-border rounded-xl shadow-elev-2
                       p-4 flex flex-col gap-3"
          >
            {/* Arrow */}
            <div
              aria-hidden="true"
              className="absolute -top-[5px] right-4 w-2.5 h-2.5
                         bg-white border-l border-t border-n-border rotate-45"
            />

            {/* Icon + text */}
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg
                               bg-error-light border border-error/20
                               flex items-center justify-center text-error">
                <IconRefresh size={15} />
              </span>
              <div>
                <p className="font-display font-semibold text-ds-body text-n-900 leading-snug">
                  Clear everything?
                </p>
                <p className="font-body text-ds-caption text-n-400 mt-0.5 leading-snug">
                  All products, platforms, and settings will be reset. This can't be undone.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 px-3 py-2 rounded-lg border border-n-border
                           bg-n-50 text-n-600 font-display font-semibold text-ds-caption
                           hover:bg-n-100 transition-colors duration-150"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                autoFocus
                className="flex-1 px-3 py-2 rounded-lg
                           bg-error text-white font-display font-semibold text-ds-caption
                           hover:bg-error/90 transition-colors duration-150
                           focus:outline-none focus:ring-2 focus:ring-error/40"
              >
                Yes, clear all
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ResetButton;