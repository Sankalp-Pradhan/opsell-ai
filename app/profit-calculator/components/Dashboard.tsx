'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line, Cell, ReferenceLine,
} from 'recharts';
import { PLATFORMS } from '../data/platforms';
import { IconSparkle } from './Icon';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CalcResult {
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

export interface Product {
  id: number;
  name: string;
}

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

interface ResultsProps {
  results: CalcResult[];
}

interface WaterfallProps {
  results: CalcResult[];
  products: Product[];
}

interface DashboardProps {
  results: CalcResult[];
  products: Product[];
}

interface PlatformAvg {
  profit: number;
  margin: number;
  roi:    number;
  fee:    number;
  settle: number;
}

interface WaterfallEntry {
  name: string;
  value: number;
  fill: string;
}

// ---------------------------------------------------------------------------
// PLATFORMS safe accessor — avoids TS7053 on string-indexed access
// ---------------------------------------------------------------------------

const P = PLATFORMS as Record<string, typeof PLATFORMS[keyof typeof PLATFORMS]>;

// ---------------------------------------------------------------------------
// CSS token helpers
// ---------------------------------------------------------------------------

function readToken(name: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  const val = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return val || fallback;
}

const TOKENS = {
  chart1:    readToken('--chart-1',         '#6366f1'),
  chart2:    readToken('--chart-2',         '#22d3ee'),
  chart3:    readToken('--chart-3',         '#10b981'),
  chart4:    readToken('--chart-4',         '#a855f7'),
  chart5:    readToken('--chart-5',         '#f97316'),
  danger:    readToken('--accent-danger',   '#ef4444'),
  warning:   readToken('--accent-warning',  '#f59e0b'),
  success:   readToken('--accent-success',  '#10b981'),
  muted:     readToken('--text-muted',      '#475569'),
  secondary: readToken('--text-secondary',  '#94a3b8'),
  primary:   readToken('--text-primary',    '#f1f5f9'),
  surface2:  readToken('--bg-surface-2',    '#1a1a2e'),
};

const PLATFORM_COLORS: Record<string, string> = Object.fromEntries(
  Object.entries(PLATFORMS).map(([id, p]) => [id, p.color])
);

const FEE_COLORS = [TOKENS.chart1, TOKENS.danger, TOKENS.chart5, TOKENS.chart2, TOKENS.chart4];

// ---------------------------------------------------------------------------
// Reduced-motion hook
// ---------------------------------------------------------------------------

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  return reduced;
}

function chartAnim(reduced: boolean) {
  return { animationBegin: 0, animationDuration: reduced ? 0 : 900 };
}

// ---------------------------------------------------------------------------
// Shared chart config
// ---------------------------------------------------------------------------

const tooltipStyle = {
  contentStyle: {
    backgroundColor: TOKENS.surface2,
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12,
    color: TOKENS.primary,
    fontSize: 12,
    boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
    backdropFilter: 'blur(20px)',
    fontFamily: 'DM Sans, sans-serif',
  },
  itemStyle: { color: TOKENS.secondary },
  labelStyle: { color: TOKENS.primary, fontWeight: 600, fontFamily: 'Sora, sans-serif' },
  cursor: { fill: 'rgba(255,255,255,0.03)' },
};

const axisProps = {
  tick: { fill: TOKENS.muted, fontSize: 11, fontFamily: 'DM Sans' },
  axisLine: { stroke: 'rgba(255,255,255,0.05)' },
  tickLine: false as const,
};

const legendStyle: React.CSSProperties = {
  fontSize: 11,
  color: TOKENS.secondary,
  fontFamily: 'DM Sans',
  paddingTop: '20px',
};

const gridProps = {
  strokeDasharray: '3 3',
  stroke: 'rgba(255,255,255,0.04)',
  vertical: false as const,
};

// ---------------------------------------------------------------------------
// ChartCard
// ---------------------------------------------------------------------------

function ChartCard({ title, subtitle, children }: ChartCardProps) {
  return (
    <div className="chart-card">
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', marginBottom: 4 }}>
          {title}
        </h3>
        {subtitle && (
          <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'DM Sans' }}>{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 1. Profit Comparison
// ---------------------------------------------------------------------------

function ProfitComparisonChart({ results }: ResultsProps) {
  const reduced = useReducedMotion();

  const data = useMemo(() => {
    const m: Record<string, Record<string, unknown>> = {};
    for (const r of results) {
      if (!m[r.productName]) m[r.productName] = { name: r.productName };
      m[r.productName][r.platform] = r.netProfit;
    }
    return Object.values(m);
  }, [results]);

  const platforms = useMemo(() => [...new Set(results.map(r => r.platform))], [results]);

  return (
    <ChartCard title="Profit by Platform" subtitle="Net profit comparison across all selected platforms">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 4, right: 16, left: 4, bottom: 36 }}>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="name" {...axisProps} angle={-20} textAnchor="end" interval={0} />
          <YAxis {...axisProps} />
          <Tooltip {...tooltipStyle} />
          <Legend wrapperStyle={legendStyle} />
          {platforms.map(p => (
            <Bar
              key={p}
              dataKey={p}
              name={P[p]?.name ?? p}
              fill={PLATFORM_COLORS[p] ?? TOKENS.chart1}
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

// ---------------------------------------------------------------------------
// 2. Fee Breakdown Stacked
// ---------------------------------------------------------------------------

function FeeBreakdownStackedChart({ results }: ResultsProps) {
  const reduced = useReducedMotion();

  const data = useMemo(() => results.map(r => ({
    name:       `${r.productName.substring(0, 16)}·${(P[r.platform]?.name ?? '').substring(0, 8)}`,
    Referral:   r.referralFee,
    Closing:    r.closingFee ?? 0,
    Shipping:   (r.shippingFee ?? 0) + (r.weightHandlingFee ?? 0) + (r.fulfillmentFee ?? 0),
    Collection: r.collectionFee ?? 0,
    Other:      (r.codFee ?? 0) + (r.tcs ?? 0) + (r.otherFees ?? 0),
  })), [results]);

  const feeTypes = ['Referral', 'Closing', 'Shipping', 'Collection', 'Other'] as const;

  return (
    <ChartCard title="Fee Composition" subtitle="Stacked breakdown of platform fee types">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 4, right: 16, left: 4, bottom: 36 }}>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="name" {...axisProps} angle={-20} textAnchor="end" interval={0} />
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

// ---------------------------------------------------------------------------
// 3. Platform Radar
// ---------------------------------------------------------------------------

function PlatformRadarChart({ results }: ResultsProps) {
  const reduced = useReducedMotion();
  const platforms = useMemo(() => [...new Set(results.map(r => r.platform))], [results]);

  const data = useMemo(() => {
    if (platforms.length < 2) return [];

    const avgs: Record<string, PlatformAvg> = {};
    for (const pid of platforms) {
      const pr = results.filter(r => r.platform === pid);
      if (!pr.length) continue;
      avgs[pid] = {
        profit: pr.reduce((s, r) => s + r.netProfit, 0)          / pr.length,
        margin: pr.reduce((s, r) => s + r.profitMargin, 0)        / pr.length,
        roi:    pr.reduce((s, r) => s + r.roi, 0)                 / pr.length,
        fee:    pr.reduce((s, r) => s + r.effectiveFeePercent, 0) / pr.length,
        settle: P[pid]?.settlementDays ?? 7,
      };
    }

    const mx = {
      profit: Math.max(...Object.values(avgs).map(a => Math.abs(a.profit)), 1),
      margin: Math.max(...Object.values(avgs).map(a => Math.abs(a.margin)), 1),
      roi:    Math.max(...Object.values(avgs).map(a => Math.abs(a.roi)),    1),
      fee:    Math.max(...Object.values(avgs).map(a => a.fee),              1),
      settle: Math.max(...Object.values(avgs).map(a => a.settle),           1),
    };

    return [
      { metric: 'Profit',     ...Object.fromEntries(platforms.map(p => [p, Math.max(0, ((avgs[p]?.profit ?? 0) / mx.profit) * 100)])) },
      { metric: 'Margin',     ...Object.fromEntries(platforms.map(p => [p, Math.max(0, ((avgs[p]?.margin ?? 0) / mx.margin) * 100)])) },
      { metric: 'ROI',        ...Object.fromEntries(platforms.map(p => [p, Math.max(0, ((avgs[p]?.roi    ?? 0) / mx.roi)    * 100)])) },
      { metric: 'Low Fees',   ...Object.fromEntries(platforms.map(p => [p, Math.max(0, (1 - (avgs[p]?.fee    ?? 0) / mx.fee)    * 100)])) },
      { metric: 'Settlement', ...Object.fromEntries(platforms.map(p => [p, Math.max(0, (1 - (avgs[p]?.settle ?? 0) / mx.settle) * 100)])) },
    ];
  }, [results, platforms]);

  if (platforms.length < 2) {
    return (
      <ChartCard title="Platform Radar" subtitle="Multi-dimensional platform performance score">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
          <p style={{ color: 'var(--text-muted)', fontFamily: 'DM Sans', fontSize: 13 }}>
            Select 2+ platforms to compare
          </p>
        </div>
      </ChartCard>
    );
  }

  return (
    <ChartCard title="Platform Radar" subtitle="Relative performance across 5 axes — higher = better">
      <ResponsiveContainer width="100%" height={320}>
        <RadarChart data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.06)" />
          <PolarAngleAxis dataKey="metric" tick={{ fill: TOKENS.muted, fontSize: 11, fontFamily: 'DM Sans' }} />
          <PolarRadiusAxis tick={false} domain={[0, 100]} />
          {platforms.map(pid => (
            <Radar
              key={pid}
              name={P[pid]?.name ?? pid}
              dataKey={pid}
              stroke={PLATFORM_COLORS[pid]}
              fill={PLATFORM_COLORS[pid]}
              fillOpacity={0.1}
              strokeWidth={2}
              {...chartAnim(reduced)}
            />
          ))}
          <Legend wrapperStyle={{ fontSize: 11, color: TOKENS.secondary, fontFamily: 'DM Sans' }} />
          <Tooltip {...tooltipStyle} />
        </RadarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// ---------------------------------------------------------------------------
// 4. Waterfall Chart
// ---------------------------------------------------------------------------

function WaterfallChart({ results, products }: WaterfallProps) {
  const reduced = useReducedMotion();
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const activeId = selectedProductId ?? products[0]?.id;
  const pr = results.filter(r => r.productId === activeId);

  const data = useMemo<WaterfallEntry[]>(() => {
    if (!pr.length) return [];
    const r = pr[0];
    return [
      { name: 'Price',    value: r.sellingPrice,                                                                              fill: TOKENS.chart1  },
      { name: 'Referral', value: -r.referralFee,                                                                              fill: TOKENS.danger  },
      { name: 'Closing',  value: -(r.closingFee ?? 0),                                                                        fill: TOKENS.warning },
      { name: 'Shipping', value: -((r.shippingFee ?? 0) + (r.weightHandlingFee ?? 0) + (r.fulfillmentFee ?? 0)),              fill: TOKENS.chart5  },
      { name: 'Other',    value: -((r.collectionFee ?? 0) + (r.codFee ?? 0) + (r.tcs ?? 0) + (r.otherFees ?? 0)),            fill: TOKENS.chart4  },
      { name: 'Payout',   value: r.netPayout,                                                                                 fill: TOKENS.chart2  },
      { name: 'COGS',     value: -(r.cogs ?? 0),                                                                              fill: TOKENS.muted   },
      { name: 'Profit',   value: r.netProfit,                                                                                 fill: r.netProfit >= 0 ? TOKENS.success : TOKENS.danger },
    ].filter(i => i.value !== 0 || ['Price', 'Payout', 'Profit'].includes(i.name));
  }, [pr]);

  return (
    <ChartCard title="Payout Waterfall" subtitle="Revenue flow from selling price to net profit">
      <div style={{ marginBottom: 16 }}>
        <select
          value={activeId ?? ''}
          onChange={e => setSelectedProductId(Number(e.target.value))}
          aria-label="Select product for waterfall chart"
          className="input-field select-base"
          style={{ width: 'auto', fontSize: 12, padding: '6px 28px 6px 10px' }}
        >
          {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 4, right: 16, left: 4, bottom: 4 }}>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="name" {...axisProps} />
          <YAxis {...axisProps} />
          <Tooltip {...tooltipStyle} />
          <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} {...chartAnim(reduced)}>
            {data.map((e, i) => <Cell key={i} fill={e.fill} opacity={0.88} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// ---------------------------------------------------------------------------
// 5. Break-Even Chart
// ---------------------------------------------------------------------------

function BreakEvenChart({ results }: ResultsProps) {
  const reduced = useReducedMotion();
  const [fixedCost, setFixedCost] = useState<number>(0);
  const platforms = useMemo(() => [...new Set(results.map(r => r.platform))], [results]);

  const perUnit = useMemo<Record<string, number>>(() => {
    const out: Record<string, number> = {};
    for (const pid of platforms) {
      const pr = results.filter(r => r.platform === pid);
      if (!pr.length) continue;
      out[pid] = pr.reduce((s, r) => s + r.netProfit, 0) / pr.length;
    }
    return out;
  }, [results, platforms]);

  const breakEven = useMemo<Record<string, number | null>>(() => {
    const out: Record<string, number | null> = {};
    for (const pid of platforms) {
      const pu = perUnit[pid];
      if (pu == null) continue;
      if (fixedCost <= 0) { out[pid] = 0; continue; }
      out[pid] = pu > 0 ? Math.ceil(fixedCost / pu) : null;
    }
    return out;
  }, [perUnit, fixedCost, platforms]);

  const maxUnit = useMemo<number>(() => {
    const bes = Object.values(breakEven).filter((v): v is number => v != null && v > 0);
    if (!bes.length) return 200;
    return Math.min(10000, Math.max(100, Math.ceil(Math.max(...bes) * 1.6)));
  }, [breakEven]);

  const data = useMemo(() => {
    const pts: Record<string, number>[] = [];
    const step = Math.max(1, Math.round(maxUnit / 80));
    for (let u = 0; u <= maxUnit; u += step) {
      const pt: Record<string, number> = { units: u };
      for (const pid of platforms) {
        const pu = perUnit[pid];
        if (pu == null) continue;
        pt[pid] = pu * u - fixedCost;
      }
      pts.push(pt);
    }
    return pts;
  }, [maxUnit, platforms, perUnit, fixedCost]);

  const hasNegativePerUnit = Object.values(perUnit).some(v => v <= 0);

  return (
    <ChartCard
      title="Break-Even Analysis"
      subtitle="Units you need to sell each month to cover your fixed costs"
    >
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
          padding: '10px 12px', marginBottom: 14,
          background: 'rgba(99,102,241,0.06)',
          border: '1px solid rgba(99,102,241,0.18)',
          borderRadius: 10,
        }}
      >
        <label
          htmlFor="breakeven-fixed-cost"
          style={{ fontFamily: 'DM Sans', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}
        >
          Monthly fixed costs
        </label>
        <div style={{ position: 'relative' }}>
          <span
            aria-hidden="true"
            style={{
              position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
              color: 'var(--text-muted)', fontFamily: 'DM Mono', fontSize: 13,
            }}
          >
            ₹
          </span>
          <input
            id="breakeven-fixed-cost"
            type="number"
            min={0}
            inputMode="numeric"
            value={fixedCost || ''}
            placeholder="0"
            onChange={e => setFixedCost(Math.max(0, Number(e.target.value) || 0))}
            className="input-field"
            style={{ width: 120, padding: '6px 10px 6px 24px', fontSize: 13 }}
          />
        </div>
        <span
          style={{
            flex: '1 1 200px', minWidth: 200,
            fontSize: 11, color: 'var(--text-muted)', fontFamily: 'DM Sans', lineHeight: 1.5,
          }}
        >
          Software, storage, brand fees, fixed ad retainers — costs you pay
          even if you sell 0 units this month. Per-unit ads already live in
          the product form.
        </span>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 4, right: 16, left: 4, bottom: 4 }}>
          <CartesianGrid {...gridProps} />
          <XAxis
            dataKey="units"
            {...axisProps}
            label={{ value: 'Monthly units sold', position: 'insideBottom', offset: -2, fill: TOKENS.muted, fontSize: 10, fontFamily: 'DM Sans' }}
          />
          <YAxis
            {...axisProps}
            tickFormatter={(v: number) =>
              v >= 1000 || v <= -1000 ? `${(v / 1000).toFixed(1)}k` : String(v)
            }
          />
          <ReferenceLine
            y={0}
            stroke="rgba(239,68,68,0.35)"
            strokeDasharray="4 4"
            label={{ value: 'Break-even', fill: TOKENS.danger, fontSize: 10, fontFamily: 'DM Sans', position: 'insideTopRight' }}
          />
          <Tooltip
            {...tooltipStyle}
            formatter={(v) => {
              const n = typeof v === 'number' ? v : 0;
              return [`₹${Math.round(n).toLocaleString('en-IN')}`, ''] as [string, string];
            }}
            labelFormatter={(u) => `${u} units/month`}
          />
          <Legend wrapperStyle={{ fontSize: 11, color: TOKENS.secondary, fontFamily: 'DM Sans' }} />
          {platforms.map(pid => (
            <Line
              key={pid}
              type="monotone"
              dataKey={pid}
              name={P[pid]?.name ?? pid}
              stroke={PLATFORM_COLORS[pid]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
              animationBegin={0}
              animationDuration={reduced ? 0 : 1200}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      <div
        role="note"
        aria-label="Break-even summary"
        style={{
          marginTop: 14, display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8,
        }}
      >
        {platforms.map(pid => {
          const be = breakEven[pid];
          const pu = perUnit[pid];
          const color = PLATFORM_COLORS[pid];

          let valueEl: React.ReactNode;
          if (fixedCost <= 0) {
            valueEl = <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Enter fixed costs →</span>;
          } else if (pu <= 0) {
            valueEl = <span style={{ color: TOKENS.danger, fontSize: 12, fontWeight: 600 }}>Loss-making per sale</span>;
          } else {
            valueEl = (
              <span style={{ fontFamily: 'DM Mono', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
                {(be as number).toLocaleString('en-IN')}{' '}
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, fontFamily: 'DM Sans' }}>units / mo</span>
              </span>
            );
          }

          return (
            <div
              key={pid}
              style={{
                padding: '10px 12px', borderRadius: 10,
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                borderLeft: `3px solid ${color}`,
              }}
            >
              <p style={{
                fontFamily: 'DM Sans', fontSize: 11, color: 'var(--text-muted)',
                textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2,
              }}>
                {P[pid]?.name ?? pid}
              </p>
              {valueEl}
            </div>
          );
        })}
      </div>

      {hasNegativePerUnit && fixedCost > 0 && (
        <p
          role="alert"
          style={{
            marginTop: 10, padding: '8px 12px', borderRadius: 8,
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.22)',
            color: TOKENS.danger, fontFamily: 'DM Sans', fontSize: 12, lineHeight: 1.5,
          }}
        >
          One or more platforms have negative profit per sale — no monthly volume
          will cover fixed costs. Revisit COGS, ads, or pricing before scaling.
        </p>
      )}
    </ChartCard>
  );
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

type DashboardView = 'profit' | 'fees' | 'radar' | 'waterfall' | 'breakeven';

const DASHBOARD_VIEWS: { id: DashboardView; label: string }[] = [
  { id: 'profit',    label: 'Profit'     },
  { id: 'fees',      label: 'Fees'       },
  { id: 'radar',     label: 'Radar'      },
  { id: 'waterfall', label: 'Waterfall'  },
  { id: 'breakeven', label: 'Break-Even' },
];

export default function Dashboard({ results, products }: DashboardProps) {
  const [view, setView] = useState<DashboardView>('profit');

  if (results.length === 0) {
    return (
      <div className="empty-state">
        <div style={{
          margin: '0 auto 16px', width: 56, height: 56, borderRadius: '50%',
          background: 'rgba(148,163,184,0.06)',
          border: '1px dashed rgba(148,163,184,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-muted)',
        }}>
          <IconSparkle size={24} />
        </div>
        <p style={{ color: 'var(--text-secondary)', fontFamily: 'DM Sans', fontSize: 14, marginBottom: 6 }}>
          No data yet
        </p>
        <p style={{ color: 'var(--text-muted)', fontFamily: 'DM Sans', fontSize: 12 }}>
          Add products and select platforms to unlock analytics
        </p>
      </div>
    );
  }

  return (
    <div className="animate-in">
      <div
        role="tablist"
        aria-label="Dashboard views"
        style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16, overflowX: 'auto' }}
        className="scrollbar-none"
      >
        {DASHBOARD_VIEWS.map(v => {
          const active = view === v.id;
          return (
            <button
              key={v.id}
              role="tab"
              aria-selected={active}
              onClick={() => setView(v.id)}
              className={active ? 'tab-btn active' : 'tab-btn'}
              style={{ flex: '0 0 auto' }}
            >
              {v.label}
            </button>
          );
        })}
      </div>

      {view === 'profit'    && <ProfitComparisonChart    results={results} />}
      {view === 'fees'      && <FeeBreakdownStackedChart results={results} />}
      {view === 'radar'     && <PlatformRadarChart       results={results} />}
      {view === 'waterfall' && <WaterfallChart           results={results} products={products} />}
      {view === 'breakeven' && <BreakEvenChart           results={results} />}
    </div>
  );
}