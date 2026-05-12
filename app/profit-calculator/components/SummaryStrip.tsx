"use client";

import { useEffect, useRef, useState } from "react";
import {
  IconDollar,
  IconPayout,
  IconTrendingUp,
  IconPercent,
} from "./Icon";

interface AnimatedValueProps {
  value: string;
  className?: string;
}

interface MetricCardProps {
  label: string;
  value: string;
  subtext?: string;
  accent: string;
  Icon: React.ComponentType<{ size?: number }>;
  valueClass?: string;
}

export interface SummaryData {
  hasResults: boolean;
  totalRevenue: number;
  totalNetPayout: number;
  totalNetProfit: number;
  avgMargin: number;
}

interface SummaryStripProps {
  summary: SummaryData;
}

function AnimatedValue({
  value,
  className,
}: AnimatedValueProps) {
  const [key, setKey] = useState(0);
  const prevRef = useRef(value);

  useEffect(() => {
    if (prevRef.current !== value) {
      setKey((k) => k + 1);
      prevRef.current = value;
    }
  }, [value]);

  return (
    <span
      key={key}
      className={`animate-fade-up tabular-nums ${className}`}
    >
      {value}
    </span>
  );
}

function MetricCard({
  label,
  value,
  subtext,
  accent,
  Icon,
  valueClass,
}: MetricCardProps) {
  return (
    <div
      className="
        group relative overflow-hidden
        rounded-2xl border border-n-border
        bg-white
        p-5
        shadow-elev-1
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-elev-3
      "
    >
      {/* Top Accent Bar */}
      <div
        className={`absolute inset-x-0 top-0 h-1 ${accent}`}
      />

      <div className="mb-4 flex items-start justify-between">
        <div>
          <p
            className="
              font-display
              text-ds-caption
              uppercase tracking-[0.14em]
              text-n-500
            "
          >
            {label}
          </p>
        </div>

        <div
          className={`
            flex h-11 w-11 items-center justify-center
            rounded-xl
            ${accent}
            bg-opacity-10
          `}
        >
          <Icon size={18} />
        </div>
      </div>

      <AnimatedValue
        value={value}
        className={`
          block
          font-mono
          text-[28px]
          font-semibold
          leading-none
          tracking-[-0.03em]
          ${valueClass}
        `}
      />

      {subtext && (
        <p className="mt-2 text-ds-body-sm text-n-500">
          {subtext}
        </p>
      )}
    </div>
  );
}

export default function SummaryStrip({
  summary,
}: SummaryStripProps) {
  const fmt = (v: number) =>
    v.toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    });

  const marginColor =
    summary.avgMargin >= 20
      ? "text-success"
      : summary.avgMargin >= 10
      ? "text-warning"
      : "text-error";

  const profitColor =
    summary.totalNetProfit >= 0
      ? "text-success"
      : "text-error";

  return (
    <section
      className="
        grid grid-cols-1 gap-4
        md:grid-cols-2
        xl:grid-cols-4
      "
    >
      <MetricCard
        label="Revenue"
        value={
          !summary.hasResults
            ? "—"
            : `₹${fmt(summary.totalRevenue)}`
        }
        subtext="All calculations"
        accent="bg-brand text-brand"
        Icon={IconDollar}
        valueClass="text-n-900"
      />

      <MetricCard
        label="Net Payout"
        value={
          !summary.hasResults
            ? "—"
            : `₹${fmt(summary.totalNetPayout)}`
        }
        subtext="After platform fees"
        accent="bg-cyan-500 text-cyan-600"
        Icon={IconPayout}
        valueClass="text-cyan-600"
      />

      <MetricCard
        label="Net Profit"
        value={
          !summary.hasResults
            ? "—"
            : `₹${fmt(summary.totalNetProfit)}`
        }
        subtext="After all costs"
        accent={
          summary.totalNetProfit >= 0
            ? "bg-success text-success"
            : "bg-error text-error"
        }
        Icon={IconTrendingUp}
        valueClass={profitColor}
      />

      <MetricCard
        label="Avg Margin"
        value={
          !summary.hasResults
            ? "—"
            : `${summary.avgMargin.toFixed(1)}%`
        }
        subtext={
          summary.avgMargin >= 20
            ? "Healthy"
            : summary.avgMargin >= 10
            ? "Tight"
            : "At Risk"
        }
        accent={
          summary.avgMargin >= 20
            ? "bg-success text-success"
            : summary.avgMargin >= 10
            ? "bg-warning text-warning"
            : "bg-error text-error"
        }
        Icon={IconPercent}
        valueClass={marginColor}
      />
    </section>
  );
}