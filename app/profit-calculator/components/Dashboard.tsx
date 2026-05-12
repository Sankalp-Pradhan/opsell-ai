"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  Cell,
  ReferenceLine,
} from "recharts";

import { IconSparkle } from "./Icon";
import { PLATFORMS } from "../data/platforms";

/* -------------------------------------------------------------------------- */
/* TYPES */
/* -------------------------------------------------------------------------- */

type PlatformId = keyof typeof PLATFORMS;

type DashboardView = "profit" | "fees" | "radar" | "waterfall" | "breakeven";

interface CalcResult {
  productId: number;
  productName: string;
  platform: string;
  sellingPrice: number;
  netProfit: number;
  netPayout: number;
  profitMargin: number;
  roi: number;
  effectiveFeePercent: number;
  referralFee: number;
  closingFee?: number;
  shippingFee?: number;
  weightHandlingFee?: number;
  fulfillmentFee?: number;
  collectionFee?: number;
  codFee?: number;
  tcs?: number;
  otherFees?: number;
  cogs?: number;
}

interface Product {
  id: number;
  name: string;
}

interface DashboardProps {
  results: CalcResult[];
  products: Product[];
}

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

interface PlatformAvg {
  profit: number;
  margin: number;
  roi: number;
  fee: number;
  settle: number;
}

interface WaterfallEntry {
  name: string;
  value: number;
  base: number;
  fill: string;
  isTotal?: boolean;
}

/* -------------------------------------------------------------------------- */
/* DESIGN TOKENS */
/* -------------------------------------------------------------------------- */

function readToken(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const val = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return val || fallback;
}

const TOKENS = {
  chart1: readToken("--chart-1", "#5046E5"),
  chart2: readToken("--chart-2", "#22d3ee"),
  chart3: readToken("--chart-3", "#10b981"),
  chart4: readToken("--chart-4", "#a855f7"),
  chart5: readToken("--chart-5", "#f97316"),
  danger: readToken("--accent-danger", "#ef4444"),
  warning: readToken("--accent-warning", "#f59e0b"),
  success: readToken("--accent-success", "#10b981"),
  muted: readToken("--text-muted", "#475569"),
  secondary: readToken("--text-secondary", "#94a3b8"),
  primary: readToken("--text-primary", "#f1f5f9"),
  surface2: readToken("--bg-surface-2", "#1a1a2e"),
};

const PLATFORM_COLORS: Record<string, string> = Object.fromEntries(
  Object.entries(PLATFORMS).map(([id, p]) => [id, (p as any).color])
);

const FEE_COLORS = [
  TOKENS.chart1,
  TOKENS.danger,
  TOKENS.chart5,
  TOKENS.chart2,
  TOKENS.chart4,
];

/* -------------------------------------------------------------------------- */
/* REDUCED MOTION HOOK */
/* -------------------------------------------------------------------------- */

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);

  return reduced;
}

function chartAnim(reduced: boolean) {
  return {
    animationBegin: 0,
    animationDuration: reduced ? 0 : 900,
  };
}

/* -------------------------------------------------------------------------- */
/* TOOLTIP & AXIS STYLES */
/* -------------------------------------------------------------------------- */

const tooltipStyle = {
  contentStyle: {
    backgroundColor: TOKENS.surface2,
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12,
    color: TOKENS.primary,
    fontSize: 12,
    boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
    backdropFilter: "blur(20px)",
    fontFamily: "DM Sans, sans-serif",
  },
  itemStyle: { color: TOKENS.secondary },
  labelStyle: { color: TOKENS.primary, fontWeight: 600, fontFamily: "Sora, sans-serif" },
  cursor: { fill: "rgba(255,255,255,0.03)" },
};

const axisProps = {
  tick: { fill: TOKENS.muted, fontSize: 11, fontFamily: "DM Sans" },
  axisLine: { stroke: "rgba(255,255,255,0.05)" },
  tickLine: false,
};

const legendStyle = {
  fontSize: 11,
  color: TOKENS.secondary,
  fontFamily: "DM Sans",
  paddingTop: "20px",
};

const gridProps = {
  strokeDasharray: "3 3",
  stroke: "rgba(255,255,255,0.04)",
  vertical: false,
};

/* -------------------------------------------------------------------------- */
/* CHART CARD WRAPPER */
/* -------------------------------------------------------------------------- */

function ChartCard({ title, subtitle, children }: ChartCardProps) {
  return (
    <div className="rounded-3xl border border-n-border bg-white p-6 shadow-elev-2">
      <div style={{ marginBottom: 20 }}>
        <h3 className="font-display text-ds-h3 text-n-900 mb-1">
          {title}
        </h3>
        {subtitle && (
          <p className="text-ds-body-sm text-n-500">
            {subtitle}
          </p>
        )}
      </div>
      <div className="rounded-2xl bg-n-50 p-4">
        {children}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 1. PROFIT COMPARISON CHART */
/* -------------------------------------------------------------------------- */

function ProfitComparisonChart({ results }: { results: CalcResult[] }) {
  const reduced = useReducedMotion();

  const data = useMemo(() => {
    const m: Record<string, Record<string, any>> = {};
    for (const r of results) {
      if (!m[r.productName]) m[r.productName] = { name: r.productName };
      m[r.productName][r.platform] = r.netProfit;
    }
    return Object.values(m);
  }, [results]);

  const platforms = useMemo(
    () => [...new Set(results.map((r) => r.platform))],
    [results]
  );

  return (
    <ChartCard
      title="Profit by Platform"
      subtitle="Net profit comparison across all selected platforms"
    >
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 4, right: 16, left: 4, bottom: 36 }}>
          <CartesianGrid {...gridProps} />
          <XAxis
            dataKey="name"
            {...axisProps}
            angle={-20}
            textAnchor="end"
            interval={0}
          />
          <YAxis {...axisProps} />
          <Tooltip {...tooltipStyle} />
          <Legend wrapperStyle={legendStyle} />
          {platforms.map((p) => (
            <Bar
              key={p}
              dataKey={p}
              name={(PLATFORMS[p as PlatformId] as any)?.name || p}
              fill={PLATFORM_COLORS[p] || TOKENS.chart1}
              radius={[6, 6, 0, 0]}
              opacity={0.88}
              {...chartAnim(reduced)}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/* -------------------------------------------------------------------------- */
/* 2. FEE BREAKDOWN STACKED CHART */
/* -------------------------------------------------------------------------- */

function FeeBreakdownStackedChart({ results }: { results: CalcResult[] }) {
  const reduced = useReducedMotion();

  const data = useMemo(() => {
    return results.map((r) => ({
      name: `${r.productName.substring(0, 16)}·${(
        (PLATFORMS[r.platform as PlatformId] as any)?.name || ""
      ).substring(0, 8)}`,
      Referral: r.referralFee,
      Closing: r.closingFee || 0,
      Shipping:
        (r.shippingFee || 0) +
        (r.weightHandlingFee || 0) +
        (r.fulfillmentFee || 0),
      Collection: r.collectionFee || 0,
      Other: (r.codFee || 0) + (r.tcs || 0) + (r.otherFees || 0),
    }));
  }, [results]);

  const feeTypes = ["Referral", "Closing", "Shipping", "Collection", "Other"] as const;

  return (
    <ChartCard
      title="Fee Composition"
      subtitle="Stacked breakdown of platform fee types"
    >
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 4, right: 16, left: 4, bottom: 36 }}>
          <CartesianGrid {...gridProps} />
          <XAxis
            dataKey="name"
            {...axisProps}
            angle={-20}
            textAnchor="end"
            interval={0}
          />
          <YAxis {...axisProps} />
          <Tooltip {...tooltipStyle} />
          <Legend wrapperStyle={legendStyle} />
          {feeTypes.map((ft, i) => (
            <Bar
              key={ft}
              dataKey={ft}
              stackId="fees"
              fill={FEE_COLORS[i]}
              opacity={0.85}
              radius={i === feeTypes.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
              {...chartAnim(reduced)}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/* -------------------------------------------------------------------------- */
/* 3. PLATFORM RADAR CHART */
/* -------------------------------------------------------------------------- */

function PlatformRadarChart({ results }: { results: CalcResult[] }) {
  const reduced = useReducedMotion();

  const platforms = useMemo(
    () => [...new Set(results.map((r) => r.platform))],
    [results]
  );

  const data = useMemo(() => {
    if (platforms.length < 2) return [];

    const avgs: Record<string, PlatformAvg> = {};

    for (const pid of platforms) {
      const pr = results.filter((r) => r.platform === pid);
      if (!pr.length) continue;

      avgs[pid] = {
        profit:
          pr.reduce((s, r) => s + r.netProfit, 0) / pr.length,
        margin:
          pr.reduce((s, r) => s + r.profitMargin, 0) / pr.length,
        roi: pr.reduce((s, r) => s + r.roi, 0) / pr.length,
        fee:
          pr.reduce((s, r) => s + r.effectiveFeePercent, 0) /
          pr.length,
        settle: (PLATFORMS[pid as PlatformId] as any)?.settlementDays || 7,
      };
    }

    const mx = {
      profit: Math.max(
        ...Object.values(avgs).map((a) => Math.abs(a.profit)),
        1
      ),
      margin: Math.max(
        ...Object.values(avgs).map((a) => Math.abs(a.margin)),
        1
      ),
      roi: Math.max(...Object.values(avgs).map((a) => Math.abs(a.roi)), 1),
      fee: Math.max(...Object.values(avgs).map((a) => a.fee), 1),
      settle: Math.max(...Object.values(avgs).map((a) => a.settle), 1),
    };

    return [
      {
        metric: "Profit",
        ...Object.fromEntries(
          platforms.map((p) => [
            p,
            Math.max(0, (avgs[p]?.profit / mx.profit) * 100),
          ])
        ),
      },
      {
        metric: "Margin",
        ...Object.fromEntries(
          platforms.map((p) => [
            p,
            Math.max(0, (avgs[p]?.margin / mx.margin) * 100),
          ])
        ),
      },
      {
        metric: "ROI",
        ...Object.fromEntries(
          platforms.map((p) => [
            p,
            Math.max(0, (avgs[p]?.roi / mx.roi) * 100),
          ])
        ),
      },
      {
        metric: "Low Fees",
        ...Object.fromEntries(
          platforms.map((p) => [
            p,
            Math.max(0, (1 - avgs[p]?.fee / mx.fee) * 100),
          ])
        ),
      },
      {
        metric: "Settlement",
        ...Object.fromEntries(
          platforms.map((p) => [
            p,
            Math.max(0, (1 - avgs[p]?.settle / mx.settle) * 100),
          ])
        ),
      },
    ];
  }, [results, platforms]);

  if (platforms.length < 2) {
    return (
      <ChartCard
        title="Platform Radar"
        subtitle="Multi-dimensional platform performance score"
      >
        <div className="flex h-[200px] items-center justify-center">
          <p className="text-ds-body-sm text-n-500">
            Select 2+ platforms to compare
          </p>
        </div>
      </ChartCard>
    );
  }

  return (
    <ChartCard
      title="Platform Radar"
      subtitle="Relative performance across 5 axes — higher = better"
    >
      <ResponsiveContainer width="100%" height={320}>
        <RadarChart data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.06)" />
          <PolarAngleAxis
            dataKey="metric"
            tick={{
              fill: TOKENS.muted,
              fontSize: 11,
              fontFamily: "DM Sans",
            }}
          />
          <PolarRadiusAxis tick={false} domain={[0, 100]} />
          {platforms.map((pid) => (
            <Radar
              key={pid}
              name={
                (PLATFORMS[pid as PlatformId] as any)?.name || pid
              }
              dataKey={pid}
              stroke={PLATFORM_COLORS[pid]}
              fill={PLATFORM_COLORS[pid]}
              fillOpacity={0.1}
              strokeWidth={2}
              {...chartAnim(reduced)}
            />
          ))}
          <Legend
            wrapperStyle={{
              fontSize: 11,
              color: TOKENS.secondary,
              fontFamily: "DM Sans",
            }}
          />
          <Tooltip {...tooltipStyle} />
        </RadarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/* -------------------------------------------------------------------------- */
/* 4. WATERFALL CHART */
/* -------------------------------------------------------------------------- */

function WaterfallChart({
  results,
  products,
}: {
  results: CalcResult[];
  products: Product[];
}) {
  const reduced = useReducedMotion();
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  const activeProductId = selectedProductId || products[0]?.id;
  
  // Get platforms available for this product
  const availablePlatformsForProduct = useMemo(() => {
    return [
      ...new Set(
        results
          .filter((r) => r.productId === activeProductId)
          .map((r) => r.platform)
      ),
    ];
  }, [results, activeProductId]);

  // Set default platform when product changes or if selected platform is not available
  const activePlatform = useMemo(() => {
    if (selectedPlatform && availablePlatformsForProduct.includes(selectedPlatform)) {
      return selectedPlatform;
    }
    return availablePlatformsForProduct[0] || null;
  }, [selectedPlatform, availablePlatformsForProduct]);

  // Update selected platform when it's no longer available
  useEffect(() => {
    if (activePlatform !== selectedPlatform) {
      setSelectedPlatform(activePlatform);
    }
  }, [activePlatform, selectedPlatform]);

  // Get the result for the selected product + platform combination
  const selectedResult = useMemo(() => {
    return results.find(
      (r) => r.productId === activeProductId && r.platform === activePlatform
    );
  }, [results, activeProductId, activePlatform]);

  const data = useMemo(() => {
    if (!selectedResult) return [];

    const r = selectedResult;

    return [
      {
        name: "Price",
        value: r.sellingPrice,
        fill: TOKENS.chart1,
      },
      {
        name: "Referral",
        value: -r.referralFee,
        fill: TOKENS.danger,
      },
      {
        name: "Closing",
        value: -(r.closingFee || 0),
        fill: TOKENS.warning,
      },
      {
        name: "Shipping",
        value: -(
          (r.shippingFee || 0) +
          (r.weightHandlingFee || 0) +
          (r.fulfillmentFee || 0)
        ),
        fill: TOKENS.chart5,
      },
      {
        name: "Other",
        value: -(
          (r.collectionFee || 0) +
          (r.codFee || 0) +
          (r.tcs || 0) +
          (r.otherFees || 0)
        ),
        fill: TOKENS.chart4,
      },
      {
        name: "Payout",
        value: r.netPayout,
        fill: TOKENS.chart2,
      },
      {
        name: "COGS",
        value: -(r.cogs || 0),
        fill: TOKENS.muted,
      },
      {
        name: "Profit",
        value: r.netProfit,
        fill: r.netProfit >= 0 ? TOKENS.success : TOKENS.danger,
      },
    ].filter((i) => i.value !== 0 || ["Price", "Payout", "Profit"].includes(i.name));
  }, [selectedResult]);

  return (
    <ChartCard
      title="Payout Waterfall"
      subtitle="Revenue flow from selling price to net profit"
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        {/* Product Selector */}
        <div className="flex-1">
          <label className="block text-xs font-semibold text-n-600 mb-1">
            Product
          </label>
          <select
            value={activeProductId || ""}
            onChange={(e) => setSelectedProductId(Number(e.target.value))}
            aria-label="Select product for waterfall chart"
            className="w-full rounded-lg border border-n-border bg-white px-3 py-2 text-ds-body-sm text-n-900 transition-colors hover:border-brand/30 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Platform Selector - Only show if multiple platforms available */}
        {availablePlatformsForProduct.length > 1 && (
          <div className="flex-1">
            <label className="block text-xs font-semibold text-n-600 mb-1">
              Platform
            </label>
            <select
              value={activePlatform || ""}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              aria-label="Select platform for waterfall chart"
              className="w-full rounded-lg border border-n-border bg-white px-3 py-2 text-ds-body-sm text-n-900 transition-colors hover:border-brand/30 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10"
            >
              {availablePlatformsForProduct.map((pid) => (
                <option key={pid} value={pid}>
                  {(PLATFORMS[pid as PlatformId] as any)?.name || pid}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {selectedResult ? (
        <>
          {/* Platform info badge */}
          {availablePlatformsForProduct.length === 1 && (
            <div className="mb-4 inline-flex items-center gap-2 rounded-lg px-3 py-2" 
              style={{ 
                backgroundColor: `${PLATFORM_COLORS[activePlatform!] || '#5046E5'}10`,
                borderLeft: `3px solid ${PLATFORM_COLORS[activePlatform!] || '#5046E5'}`
              }}>
              <span className="text-xs font-semibold text-n-600">
                {(PLATFORMS[activePlatform as PlatformId] as any)?.name || activePlatform}
              </span>
            </div>
          )}

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data} margin={{ top: 4, right: 16, left: 4, bottom: 4 }}>
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="name" {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip {...tooltipStyle} />
              <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} {...chartAnim(reduced)}>
                {data.map((entry: any, i: number) => (
                  <Cell key={`cell-${i}`} fill={entry.fill} opacity={0.88} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </>
      ) : (
        <div className="flex h-[260px] items-center justify-center">
          <p className="text-ds-body-sm text-n-500">
            No data available for this selection
          </p>
        </div>
      )}
    </ChartCard>
  );
}

/* -------------------------------------------------------------------------- */
/* 5. BREAK-EVEN CHART */
/* -------------------------------------------------------------------------- */

function BreakEvenChart({ results }: { results: CalcResult[] }) {
  const reduced = useReducedMotion();
  const [fixedCost, setFixedCost] = useState<number>(0);

  const platforms = useMemo(
    () => [...new Set(results.map((r) => r.platform))],
    [results]
  );

  // Per-platform average profit per unit
  const perUnit = useMemo(() => {
    const out: Record<string, number> = {};
    for (const pid of platforms) {
      const pr = results.filter((r) => r.platform === pid);
      if (!pr.length) continue;
      out[pid] = pr.reduce((s, r) => s + r.netProfit, 0) / pr.length;
    }
    return out;
  }, [results, platforms]);

  // Break-even unit per platform
  const breakEven = useMemo(() => {
    const out: Record<string, number | null> = {};
    for (const pid of platforms) {
      const pu = perUnit[pid];
      if (pu == null) continue;
      if (fixedCost <= 0) {
        out[pid] = 0;
        continue;
      }
      out[pid] = pu > 0 ? Math.ceil(fixedCost / pu) : null;
    }
    return out;
  }, [perUnit, fixedCost, platforms]);

  // X-axis range calculation
  const maxUnit = useMemo(() => {
    const bes = Object.values(breakEven).filter(
      (v) => v != null && v > 0
    ) as number[];
    if (!bes.length) return 200;
    return Math.min(10000, Math.max(100, Math.ceil(Math.max(...bes) * 1.6)));
  }, [breakEven]);

  const data = useMemo(() => {
    const pts: Record<string, any>[] = [];
    const step = Math.max(1, Math.round(maxUnit / 80));

    for (let u = 0; u <= maxUnit; u += step) {
      const pt: Record<string, any> = { units: u };
      for (const pid of platforms) {
        const pu = perUnit[pid];
        if (pu == null) continue;
        pt[pid] = pu * u - fixedCost;
      }
      pts.push(pt);
    }
    return pts;
  }, [maxUnit, platforms, perUnit, fixedCost]);

  const hasNegativePerUnit = Object.values(perUnit).some((v) => v <= 0);

  return (
    <ChartCard
      title="Break-Even Analysis"
      subtitle="Units you need to sell each month to cover your fixed costs"
    >
      {/* Fixed-cost control */}
      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-brand/18 bg-brand/6 p-3">
        <label
          htmlFor="breakeven-fixed-cost"
          className="font-display text-ds-body-sm font-semibold text-n-600"
        >
          Monthly fixed costs
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 font-mono text-ds-body-sm text-n-500">
            ₹
          </span>
          <input
            id="breakeven-fixed-cost"
            type="number"
            min={0}
            inputMode="numeric"
            value={fixedCost || ""}
            placeholder="0"
            onChange={(e) =>
              setFixedCost(Math.max(0, Number(e.target.value) || 0))
            }
            className="w-28 rounded-lg border border-n-200 bg-white py-1.5 pl-7 pr-2 text-ds-body-sm text-n-900 placeholder-n-400 transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10"
          />
        </div>
        <span className="flex-1 text-xs text-n-500">
          Software, storage, brand fees, fixed ad retainers — costs you pay
          even if you sell 0 units this month.
        </span>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 4, right: 16, left: 4, bottom: 4 }}>
          <CartesianGrid {...gridProps} />
          <XAxis
            dataKey="units"
            {...axisProps}
            label={{
              value: "Monthly units sold",
              position: "insideBottom",
              offset: -2,
              fill: TOKENS.muted,
              fontSize: 10,
              fontFamily: "DM Sans",
            }}
          />
          <YAxis
            {...axisProps}
            tickFormatter={(v: number): string => {
              if (v >= 1000 || v <= -1000) {
                return `${(v / 1000).toFixed(1)}k`;
              }
              return String(v);
            }}
          />
          <ReferenceLine
            y={0}
            stroke="rgba(239,68,68,0.35)"
            strokeDasharray="4 4"
            label={{
              value: "Break-even",
              fill: TOKENS.danger,
              fontSize: 10,
              fontFamily: "DM Sans",
              position: "insideTopRight",
            }}
          />
          <Tooltip
            {...tooltipStyle}
            formatter={(v: any) => [
              `₹${Math.round(v).toLocaleString("en-IN")}`,
              "",
            ]}
            labelFormatter={(u: any) => `${u} units/month`}
          />
          <Legend
            wrapperStyle={{
              fontSize: 11,
              color: TOKENS.secondary,
              fontFamily: "DM Sans",
            }}
          />
          {platforms.map((pid) => (
            <Line
              key={pid}
              type="monotone"
              dataKey={pid}
              name={
                (PLATFORMS[pid as PlatformId] as any)?.name || pid
              }
              stroke={PLATFORM_COLORS[pid]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
              {...chartAnim(reduced)}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      {/* Break-even summary */}
      <div
        role="note"
        aria-label="Break-even summary"
        className="mt-4 grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      >
        {platforms.map((pid) => {
          const be = breakEven[pid];
          const pu = perUnit[pid];
          const color = PLATFORM_COLORS[pid];

          let valueEl: React.ReactNode;
          if (fixedCost <= 0) {
            valueEl = (
              <span className="text-xs text-n-500">
                Enter fixed costs →
              </span>
            );
          } else if (pu <= 0) {
            valueEl = (
              <span className="text-xs font-semibold text-error">
                Loss-making per sale
              </span>
            );
          } else {
            valueEl = (
              <span className="font-mono text-base font-bold text-n-900 tabular-nums">
                {be?.toLocaleString("en-IN")}{" "}
                <span className="text-xs font-medium text-n-500">
                  units/mo
                </span>
              </span>
            );
          }

          return (
            <div
              key={pid}
              className="rounded-lg border p-3 transition-all"
              style={{
                borderColor: color,
                borderLeftWidth: "3px",
                backgroundColor: `${color}08`,
              }}
            >
              <p className="font-display text-xs font-bold uppercase tracking-wide text-n-600 mb-1">
                {(PLATFORMS[pid as PlatformId] as any)?.name || pid}
              </p>
              {valueEl}
            </div>
          );
        })}
      </div>

      {hasNegativePerUnit && fixedCost > 0 && (
        <p
          role="alert"
          className="mt-3 rounded-lg border border-error/22 bg-error/8 px-3 py-2 text-xs text-error"
        >
          One or more platforms have negative profit per sale — no monthly
          volume will cover fixed costs. Revisit COGS, ads, or pricing before
          scaling.
        </p>
      )}
    </ChartCard>
  );
}

/* -------------------------------------------------------------------------- */
/* DASHBOARD VIEWS */
/* -------------------------------------------------------------------------- */

const DASHBOARD_VIEWS: Array<{ id: DashboardView; label: string }> = [
  { id: "profit", label: "Profit" },
  { id: "fees", label: "Fees" },
  { id: "radar", label: "Radar" },
  { id: "waterfall", label: "Waterfall" },
  { id: "breakeven", label: "Break-Even" },
];

/* -------------------------------------------------------------------------- */
/* MAIN DASHBOARD COMPONENT */
/* -------------------------------------------------------------------------- */

export default function Dashboard({ results, products }: DashboardProps) {
  const [view, setView] = useState<DashboardView>("profit");

  if (results.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-n-200 bg-white px-8 py-16 text-center shadow-elev-1">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-light text-brand">
          <IconSparkle size={24} />
        </div>
        <h3 className="font-display text-ds-h3 text-n-900">
          No analytics yet
        </h3>
        <p className="mt-2 text-ds-body text-n-500">
          Add products and platforms to unlock analytics.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 rounded-2xl border border-n-border bg-white p-2 shadow-elev-1">
        {DASHBOARD_VIEWS.map((v) => {
          const active = view === v.id;
          return (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              aria-selected={active}
              className={`transition-all duration-200 rounded-xl px-4 py-2.5 text-ds-body-sm font-semibold ${
                active
                  ? "bg-brand text-white shadow-elev-1"
                  : "border border-n-border bg-white text-n-600 hover:border-brand/30 hover:text-brand active:scale-95"
              }`}
            >
              {v.label}
            </button>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-6">
        {view === "profit" && <ProfitComparisonChart results={results} />}
        {view === "fees" && <FeeBreakdownStackedChart results={results} />}
        {view === "radar" && <PlatformRadarChart results={results} />}
        {view === "waterfall" && (
          <WaterfallChart results={results} products={products} />
        )}
        {view === "breakeven" && <BreakEvenChart results={results} />}
      </div>
    </div>
  );
}
