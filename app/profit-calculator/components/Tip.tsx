"use client";

import GLOSSARY from "../data/glossary";
import { IconInfoCircle } from "@tabler/icons-react";

interface TipProps {
  term?: keyof typeof GLOSSARY;
  text?: string;
  size?: number;
}

export default function Tip({
  term,
  text,
  size = 16,
}: TipProps) {
  const copy =
    text ?? (term ? GLOSSARY[term]?.text : "") ?? "";

  if (!copy) return null;

  return (
    <span className="group relative ml-1 inline-flex align-middle">
      <button
        type="button"
        aria-label={`Help: ${copy}`}
        className="
          flex items-center justify-center
          rounded-full
          border border-n-border
          bg-n-50
          text-n-500
          transition-all duration-200
          hover:border-brand/30
          hover:bg-brand-light
          hover:text-brand
          focus:outline-none
          focus:ring-2
          focus:ring-brand/20
        "
        style={{
          width: size,
          height: size,
        }}
      >
        <IconInfoCircle
          size={Math.max(10, size - 4)}
          stroke={2.2}
        />
      </button>

      {/* Tooltip */}
      <div
        role="tooltip"
        className="
          pointer-events-none
          absolute left-1/2 top-[calc(100%+10px)]
          z-50
          w-64
          -translate-x-1/2
          rounded-xl
          border border-ai-border
          bg-white/95
          p-3
          text-ds-body-sm
          text-n-700
          shadow-elev-3
          opacity-0
          backdrop-blur-md
          transition-all duration-200
          group-hover:translate-y-0
          group-hover:opacity-100
          group-focus-within:opacity-100
        "
      >
        {/* Glow Accent */}
        <div
          className="
            absolute inset-x-0 top-0 h-1
            rounded-t-xl
            bg-brand
          "
        />

        {/* AI-style subtle shimmer */}
        <div
          className="
            absolute inset-0
            rounded-xl
            bg-ai-shimmer
            bg-200%
            opacity-[0.03]
            animate-ai-shimmer
          "
        />

        <p className="relative leading-relaxed">
          {copy}
        </p>

        {/* Tooltip Arrow */}
        <div
          className="
            absolute left-1/2 top-0
            h-3 w-3
            -translate-x-1/2
            -translate-y-1/2
            rotate-45
            border-l border-t border-ai-border
            bg-white
          "
        />
      </div>
    </span>
  );
}