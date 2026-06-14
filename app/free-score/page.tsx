"use client";

import { useState, useEffect } from "react";

// ── Skeleton shimmer ──────────────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`rounded-md bg-n-200 overflow-hidden relative ${className}`}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
          backgroundSize: "200% 100%",
          animation: "aiShimmer 1.6s ease infinite",
        }}
      />
    </div>
  );
}

// ── Skeleton: gauge card ──────────────────────────────────────────────────────
function GaugeSkeleton() {
  return (
    <div className="flex-1 flex flex-col items-center gap-2 px-6 py-4 bg-white rounded-lg border border-n-border shadow-elev-1">
      <Skeleton className="w-[72px] h-[40px]" />
      <Skeleton className="w-16 h-4 mt-1" />
      <Skeleton className="w-20 h-3" />
    </div>
  );
}

// ── Skeleton: finding card ────────────────────────────────────────────────────
function FindingSkeleton() {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-n-border bg-white px-5 py-4 shadow-elev-1">
      <div className="flex items-start gap-3 flex-1">
        <Skeleton className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full" />
        <div className="flex-1 flex flex-col gap-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>
      <Skeleton className="h-6 w-24 rounded-full" />
    </div>
  );
}

// ── Skeleton: fix row ─────────────────────────────────────────────────────────
function FixRowSkeleton() {
  return (
    <div className="rounded-lg border border-n-border bg-white px-5 py-4 shadow-elev-1">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Skeleton className="w-5 h-3" />
          <Skeleton className="w-64 h-4" />
        </div>
        <Skeleton className="w-20 h-3" />
      </div>
      <Skeleton className="h-1.5 w-full" />
    </div>
  );
}

// ── Radial arc gauge ──────────────────────────────────────────────────────────
function ArcGauge({
  value,
  label,
  sub,
}: {
  value: number;
  label: string;
  sub: string;
}) {
  const circumference = Math.PI * 28;
  const offset = circumference * (1 - value / 100);
  const color =
    value >= 70 ? "#16A34A" : value >= 40 ? "#F59E0B" : "#EF4444";

  return (
    <div className="flex-1 flex flex-col items-center gap-1 px-6 py-4 bg-white rounded-lg border border-n-border shadow-elev-1">
      <div className="relative w-[72px] h-[40px] overflow-visible">
        <svg width="72" height="44" viewBox="0 0 72 44" fill="none" className="overflow-visible">
          <path d="M 8 36 A 28 28 0 0 1 64 36" stroke="#E2E4E8" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path
            d="M 8 36 A 28 28 0 0 1 64 36"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={`${circumference}`}
            strokeDashoffset={`${offset}`}
            fill="none"
            style={{ transition: "stroke-dashoffset 0.8s ease" }}
          />
        </svg>
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 font-display font-bold text-[15px] leading-none" style={{ color }}>
          {value}
        </span>
      </div>
      <p className="font-display font-semibold text-ds-h3 text-n-900 mt-1">{label}</p>
      <p className="font-body text-ds-caption text-n-400">{sub}</p>
    </div>
  );
}

// ── Impact badge ─────────────────────────────────────────────────────────────
function ImpactBadge({ level }: { level: "high" | "medium" | "strength" }) {
  const map = {
    high: { label: "High Impact", bg: "bg-error-light", text: "text-error" },
    medium: {
      label: "Medium Impact",
      bg: "bg-warning-light",
      text: "text-warning",
    },
    strength: {
      label: "Strength",
      bg: "bg-success-light",
      text: "text-success",
    },
  } as const;
  const { label, bg, text } = map[level];
  return (
    <span
      className={`text-ds-caption font-body font-semibold px-2.5 py-0.5 rounded-full ${bg} ${text}`}
    >
      {label}
    </span>
  );
}

// ── Finding card ─────────────────────────────────────────────────────────────
function FindingCard({
  dot,
  title,
  body,
  impact,
}: {
  dot: string;
  title: string;
  body: string;
  impact: "high" | "medium" | "strength";
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-n-border bg-white px-5 py-4 shadow-elev-1">
      <div className="flex items-start gap-3">
        <span
          className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: dot }}
        />
        <div>
          <p className="font-display font-semibold text-ds-h3 text-n-900">
            {title}
          </p>
          <p className="mt-1 font-body text-ds-body-sm text-n-500 max-w-[480px]">
            {body}
          </p>
        </div>
      </div>
      <ImpactBadge level={impact} />
    </div>
  );
}

// ── Fix row ───────────────────────────────────────────────────────────────────
function FixRow({
  num,
  title,
  barW,
}: {
  num: string;
  title: string;
  barW: string;
}) {
  return (
    <div className="rounded-lg border border-n-border bg-white px-5 py-4 shadow-elev-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-body text-ds-caption text-n-400 w-5 shrink-0">
            {num}
          </span>
          <p className="font-display font-semibold text-ds-h3 text-n-900">
            {title}
          </p>
        </div>
        <span className="font-body text-ds-caption text-brand font-semibold">
          +₹ XXXX/mo
        </span>
      </div>
      <div className="mt-3 h-1.5 w-full rounded-full bg-n-100">
        <div
          className="h-full rounded-full bg-brand"
          style={{ width: barW }}
        />
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function FreeScorePage() {
  const [scoreAnother] = useState(false);

  return (
    <div className="min-h-screen bg-n-50 font-body">
     

      {/* ── Live pill ── */}
      <div className="flex justify-center pt-8">
        <div className="flex items-center gap-2 rounded-full bg-success-light border border-success/20 px-4 py-1.5">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span className="font-body text-ds-caption text-success font-medium">
            23 sellers scored their listings in the last hour
          </span>
        </div>
      </div>

      {/* ── Score another listing link ── */}
      <div className="mx-auto mt-6 max-w-4xl px-6">
        <a
          href="#"
          className="font-body text-ds-body text-brand hover:underline"
        >
          Score another listing
        </a>

        {/* ── Listing meta ── */}
        <div className="mt-2 flex flex-wrap items-center gap-2 text-ds-body-sm font-body">
          <span className="rounded-full bg-n-200 px-2.5 py-0.5 text-ds-caption font-semibold text-n-700">
            Electronics
          </span>
          <span className="text-n-400">amazon.in/dp/B0G2MM7VH9</span>
          <span className="font-semibold text-n-900">₹51,800</span>
          <span className="text-success font-semibold">(34% off)</span>
          <span className="text-n-300">|</span>
          <span className="text-warning font-semibold">2.9 ★</span>
          <span className="text-n-400">(2 reviews)</span>
        </div>

        {/* ── Product title ── */}
        <h1 className="mt-3 font-display text-[28px] font-extrabold leading-tight text-n-900">
          HP 15 (2025) AMD Ryzen 3 7335U Laptop
        </h1>
      </div>

      {/* ── Score cards ── */}
      <div className="mx-auto mt-6 max-w-4xl px-6">
        <div className="flex flex-wrap gap-3">
          <ArcGauge value={75.5} label="LQS" sub="best-in-cat 88" />
          <ArcGauge value={40.6} label="Est. CTR" sub="best-in-cat 88" />
          <ArcGauge value={34.2} label="Est. CVR" sub="best-in-cat 88" />
        </div>
      </div>

      {/* ── Revenue leak banner ── */}
      <div className="mx-auto mt-5 max-w-4xl px-6">
        <div className="rounded-xl bg-n-900 px-6 py-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-body text-ds-caption text-n-400">
              Estimated revenue being left behind
            </p>
            <p className="mt-1 font-display text-[32px] font-extrabold text-warning leading-none">
              ~14–22%
            </p>
            <p className="mt-2 font-body text-ds-body-sm text-n-400 max-w-xs">
              At category-average AOV and traffic, this listing is leaking
              revenue every month.
            </p>
          </div>
          <button className="shrink-0 rounded-lg border border-n-600 bg-transparent px-4 py-2.5 font-display font-semibold text-ds-body text-white hover:bg-n-800 transition-colors">
            See how to fix this →
          </button>
        </div>
      </div>

      {/* ── RPI ── */}
      <div className="mx-auto mt-5 max-w-4xl px-6">
        <div className="flex items-center justify-between rounded-lg border border-n-border bg-white px-5 py-3 shadow-elev-1">
          <span className="font-body text-ds-body text-n-600">
            Revenue Potential Index (RPI)
          </span>
          <span className="font-display font-bold text-ds-h3 text-n-900">
            7,192.53
          </span>
        </div>
      </div>

      {/* ── What we found ── */}
      <div className="mx-auto mt-8 max-w-4xl px-6">
        <h2 className="font-display font-bold text-ds-h2 text-n-900 mb-4">
          What we found
        </h2>
        <div className="flex flex-col gap-3">
          <FindingCard
            dot="#EF4444"
            title="Review count is critically low"
            body="2 reviews with a 2.9 rating. This is the single biggest conversion blocker for this listing — buyers see the low star count and bounce before they read a word."
            impact="high"
          />
          <FindingCard
            dot="#F59E0B"
            title="Strong discount partially offsets weak trust signals"
            body="The 34% discount is aggressive and likely driving click-throughs, but the poor rating is cancelling out that advantage at the conversion stage."
            impact="medium"
          />
          <FindingCard
            dot="#16A34A"
            title="Price competitiveness looks solid"
            body="At ₹51,800 with a 34% markdown, this product sits in a competitive band for the category. Pricing is not the problem here."
            impact="strength"
          />
        </div>
      </div>

      {/* ── Top priority card ── */}
      <div className="mx-auto mt-5 max-w-4xl px-6">
        <div className="rounded-xl border border-brand/30 bg-brand-light px-5 py-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand font-display font-bold text-ds-caption text-white">
              3
            </span>
            <span className="font-body text-ds-caption font-semibold text-brand uppercase tracking-wide">
              Top priority
            </span>
          </div>
          <p className="font-display font-bold text-ds-h3 text-n-900">
            Fix the review problem first
          </p>
          <p className="mt-1 font-body text-ds-body-sm text-n-500 max-w-md">
            Solicit more reviews and address whatever is driving the 2.9-star
            rating. This is the single biggest lever for this listing —
            everything else is secondary until trust signals improve.
          </p>
        </div>
      </div>

      {/* ── More fixes ── */}
      <div className="mx-auto mt-8 max-w-4xl px-6 pb-16">
        <h2 className="font-display font-bold text-ds-h2 text-n-900">
          More fixes for this listing
        </h2>
        <p className="font-body text-ds-body-sm text-n-400 mb-4 mt-0.5">
          Ranked by estimated revenue impact
        </p>
        <div className="flex flex-col gap-3">
          <FixRow
            num="02"
            title="Lead the title with the processor + RAM spec"
            barW="45%"
          />
          <FixRow
            num="03"
            title="Add 4 missing high-volume category keywords"
            barW="62%"
          />
          <FixRow
            num="04"
            title="Expand A+ content from 2 to 6 modules"
            barW="30%"
          />
        </div>
      </div>
    </div>
  );
}