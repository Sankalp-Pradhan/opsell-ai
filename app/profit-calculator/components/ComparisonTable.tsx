'use client';

import { useState, useMemo, CSSProperties } from 'react';
import PlatformBadge from './PlatformBadge';
import { PLATFORMS } from '../data/platforms';
import {
  IconArrowUp,
  IconArrowDown,
  IconArrowUpDown,
  IconDownload,
  IconCrown,
  IconCheck,
  IconSparkle,
} from './Icon';

type PlatformId = keyof typeof PLATFORMS;

type SortDirection = 'asc' | 'desc';

type HighlightMetric =
  | 'netProfit'
  | 'profitMargin'
  | 'roi'
  | 'effectiveFeePercent';

type SortKey =
  | 'sellingPrice'
  | 'totalDeductions'
  | 'effectiveFeePercent'
  | 'netPayout'
  | 'netProfit'
  | 'profitMargin'
  | 'roi';

interface ResultItem {
  productId: string;
  productName: string;
  platform: PlatformId;
  sellingPrice: number;
  totalDeductions: number;
  effectiveFeePercent: number;
  netPayout: number;
  netProfit: number;
  profitMargin: number;
  roi: number;
}

interface Summary {
  hasResults: boolean;
  uniquePlatformCount: number;
  bestPlatform: PlatformId | '-';
  avgMargin: number;
}

interface ComparisonTableProps {
  results: ResultItem[];
  summary?: Summary;
}

interface MarginPillProps {
  value: number;
}

interface SortIconProps {
  active: boolean;
  dir: SortDirection;
}

interface Column {
  key: keyof ResultItem | 'platform';
  label: string;
  sortable?: boolean;
  align?: CSSProperties['textAlign'];
}

declare const __BUILD_DATE__: string;

function formatCurrency(
  value: number,
  platformId: PlatformId
): string {
  const p = PLATFORMS[platformId];

  if (!p) return value.toFixed(2);

  if (p.currencySymbol === '$') {
    return `$${value.toFixed(2)}`;
  }

  if (p.currencySymbol === 'AED') {
    return `AED ${value.toFixed(2)}`;
  }

  return `₹${value.toFixed(2)}`;
}

function MarginPill({
  value,
}: MarginPillProps) {
  const cls =
    value >= 20
      ? 'pill-success'
      : value >= 10
      ? 'pill-warning'
      : 'pill-danger';

  return (
    <span className={`pill ${cls}`}>
      {value.toFixed(1)}%
    </span>
  );
}

function SortIcon({
  active,
  dir,
}: SortIconProps) {
  const color = active
    ? 'var(--accent-primary)'
    : 'currentColor';

  const opacity = active ? 1 : 0.35;

  const Icon = !active
    ? IconArrowUpDown
    : dir === 'asc'
    ? IconArrowUp
    : IconArrowDown;

  return (
    <span
      style={{
        marginLeft: 5,
        display: 'inline-flex',
        alignItems: 'center',
        color,
        opacity,
      }}
    >
      <Icon size={10} />
    </span>
  );
}

export default function ComparisonTable({
  results,
  summary,
}: ComparisonTableProps) {
  const [sortKey, setSortKey] =
    useState<SortKey>('netProfit');

  const [sortDir, setSortDir] =
    useState<SortDirection>('desc');

  const [highlightMetric, setHighlight] =
    useState<HighlightMetric>('netProfit');

  const sorted = useMemo(() => {
    return [...results].sort((a, b) => {
      const av = a[sortKey] ?? 0;
      const bv = b[sortKey] ?? 0;

      return sortDir === 'asc'
        ? av - bv
        : bv - av;
    });
  }, [results, sortKey, sortDir]);

  const bestPerProduct = useMemo(() => {
    const map: Record<string, ResultItem> =
      {};

    for (const r of results) {
      const better =
        highlightMetric ===
        'effectiveFeePercent'
          ? !map[r.productId] ||
            r[highlightMetric] <
              map[r.productId][
                highlightMetric
              ]
          : !map[r.productId] ||
            r[highlightMetric] >
              map[r.productId][
                highlightMetric
              ];

      if (better) {
        map[r.productId] = r;
      }
    }

    return new Set(
      Object.values(map).map(
        (r) =>
          `${r.productId}-${r.platform}`
      )
    );
  }, [results, highlightMetric]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) =>
        d === 'asc' ? 'desc' : 'asc'
      );
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const exportCSV = () => {
    const headers = [
      'Product',
      'Platform',
      'Price',
      'Fees',
      'Fee%',
      'Payout',
      'Profit',
      'Margin%',
      'ROI%',
    ];

    const rows = sorted.map((r) =>
      [
        r.productName,
        r.platform,
        r.sellingPrice,
        r.totalDeductions,
        r.effectiveFeePercent,
        r.netPayout,
        r.netProfit,
        r.profitMargin,
        r.roi,
      ].map((v) =>
        typeof v === 'number'
          ? v.toFixed(2)
          : v
      )
    );

    const csv = [
      headers.join(','),
      ...rows.map((r) => r.join(',')),
    ].join('\n');

    const blob = new Blob([csv], {
      type: 'text/csv',
    });

    const a =
      document.createElement('a');

    a.href = URL.createObjectURL(blob);

    a.download =
      'opsellai-profitability-report.csv';

    a.click();
  };

  if (results.length === 0) {
    return (
      <div className="empty-state">
        <div
          style={{
            margin: '0 auto 16px',
            width: 48,
            height: 48,
            borderRadius: '50%',
            background:
              'rgba(148,163,184,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
          }}
        >
          <IconSparkle size={20} />
        </div>

        <p
          style={{
            color: 'var(--text-secondary)',
            fontFamily: 'DM Sans',
            fontSize: 14,
            marginBottom: 6,
          }}
        >
          No results yet
        </p>

        <p
          style={{
            color: 'var(--text-muted)',
            fontFamily: 'DM Sans',
            fontSize: 12,
          }}
        >
          Select platforms and fill in
          product details to see the
          comparison
        </p>
      </div>
    );
  }

  const columns: Column[] = [
    {
      key: 'productName',
      label: 'Product',
      sortable: false,
    },
    {
      key: 'platform',
      label: 'Platform',
      sortable: false,
    },
    {
      key: 'sellingPrice',
      label: 'Price',
      align: 'right',
    },
    {
      key: 'totalDeductions',
      label: 'Fees',
      align: 'right',
    },
    {
      key: 'effectiveFeePercent',
      label: 'Fee %',
      align: 'right',
    },
    {
      key: 'netPayout',
      label: 'Payout',
      align: 'right',
    },
    {
      key: 'netProfit',
      label: 'Profit',
      align: 'right',
    },
    {
      key: 'profitMargin',
      label: 'Margin',
      align: 'right',
    },
    {
      key: 'roi',
      label: 'ROI',
      align: 'right',
    },
  ];

  return (
    <div>
      {summary &&
        summary.hasResults &&
        summary.uniquePlatformCount >=
          2 &&
        summary.bestPlatform !== '-' && (
          <div
            className="animate-card"
            role="region"
            aria-label="Top performing platform"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent:
                'space-between',
              flexWrap: 'wrap',
              gap: 12,
              padding: '16px 20px',
              borderRadius: 16,
              marginBottom: 20,
              background: `linear-gradient(90deg, ${
                PLATFORMS[
                  summary.bestPlatform
                ]?.color
              }15 0%, rgba(255,255,255,0.02) 100%)`,
              border: `1px solid ${
                PLATFORMS[
                  summary.bestPlatform
                ]?.color
              }30`,
              borderLeft: `4px solid ${
                PLATFORMS[
                  summary.bestPlatform
                ]?.color
              }`,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  display:
                    'inline-flex',
                  alignItems: 'center',
                  justifyContent:
                    'center',
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: `${
                    PLATFORMS[
                      summary.bestPlatform
                    ]?.color
                  }22`,
                  color:
                    PLATFORMS[
                      summary.bestPlatform
                    ]?.color,
                }}
              >
                <IconCrown size={20} />
              </span>

              <div>
                <p
                  style={{
                    fontSize: 12,
                    color:
                      'var(--text-muted)',
                  }}
                >
                  Top performing
                  platform
                </p>

                <h3>
                  {
                    PLATFORMS[
                      summary.bestPlatform
                    ]?.name
                  }
                </h3>
              </div>
            </div>

            <div
              style={{
                textAlign: 'right',
              }}
            >
              <p>Avg Margin</p>

              <p>
                {summary.avgMargin.toFixed(
                  1
                )}
                %
              </p>
            </div>
          </div>
        )}
    </div>
  );
}