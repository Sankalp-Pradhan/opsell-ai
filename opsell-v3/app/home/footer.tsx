"use client";

import Link from "next/link";

// ─── Config ───────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Privacy",  href: "#" },
  { label: "Terms",    href: "#" },
  { label: "Security", href: "#" },
  { label: "Contact",  href: "https://opsell.neetocal.com/meeting-with-shaurya-gupta" },
];

// ─── Footer ───────────────────────────────────────────────────────────────────

export function Footer() {
  return (
    <footer className="flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] bg-n-900 px-6 py-6 sm:flex-row sm:px-10">

      {/* Wordmark */}
      <div className="flex items-baseline gap-px">
        <span className="font-display text-base font-extrabold tracking-[-0.03em] text-white">
          opsell
        </span>
        <span className="font-display text-base font-extrabold text-brand">.</span>
      </div>

      {/* Copyright */}
      <span className="font-body text-ds-caption text-white/30">
        © 2026 Opsell AI. All rights reserved.
      </span>

      {/* Nav links */}
      <nav className="flex flex-wrap items-center justify-center gap-5 sm:gap-6">
        {NAV_LINKS.map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            className="font-body text-ds-caption text-white/35 transition-colors duration-200 hover:text-white/70"
          >
            {label}
          </Link>
        ))}
      </nav>

    </footer>
  );
}