"use client";

import { useMemo, useState } from "react";

import PlatformBadge from "./PlatformBadge";

import { PLATFORMS } from "../data/platforms";

import {
  IconArrowUp,
  IconArrowDown,
  IconArrowUpDown,
  IconDownload,
  IconCrown,
  IconSparkle,
} from "./Icon";

/* -------------------------------------------------------------------------- */
/* TYPES */
/* -------------------------------------------------------------------------- */

type PlatformId = keyof typeof PLATFORMS;

type SortDirection = "asc" | "desc";

type HighlightMetric =
  | "netProfit"
  | "profitMargin"
  | "roi"
  | "effectiveFeePercent";

type SortKey =
  | "sellingPrice"
  | "totalDeductions"
  | "effectiveFeePercent"
  | "netPayout"
  | "netProfit"
  | "profitMargin"
  | "roi";

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
  bestPlatform: PlatformId | "-";
  avgMargin: number;
}

interface ComparisonTableProps {
  results: ResultItem[];
  summary?: Summary;
}

/* -------------------------------------------------------------------------- */
/* HELPERS */
/* -------------------------------------------------------------------------- */

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function formatCurrency(
  value: number,
  platformId: PlatformId
) {
  const p = PLATFORMS[platformId];

  if (!p) return value.toFixed(2);

  if (p.currencySymbol === "$") {
    return `$${value.toFixed(2)}`;
  }

  if (p.currencySymbol === "AED") {
    return `AED ${value.toFixed(2)}`;
  }

  return `₹${value.toFixed(2)}`;
}

/* -------------------------------------------------------------------------- */
/* MARGIN PILL */
/* -------------------------------------------------------------------------- */

function MarginPill({
  value,
}: {
  value: number;
}) {
  const styles =
    value >= 20
      ? "bg-success-light text-success border-success/20"
      : value >= 10
      ? "bg-warning-light text-warning border-warning/20"
      : "bg-error-light text-error border-error/20";

  return (
    <span
      className={cn(
        `
          inline-flex items-center
          rounded-full border
          px-2.5 py-1
          text-ds-caption
          font-semibold
        `,
        styles
      )}
    >
      {value.toFixed(1)}%
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* SORT ICON */
/* -------------------------------------------------------------------------- */

function SortIcon({
  active,
  dir,
}: {
  active: boolean;
  dir: SortDirection;
}) {
  const Icon = !active
    ? IconArrowUpDown
    : dir === "asc"
    ? IconArrowUp
    : IconArrowDown;

  return (
    <span
      className={cn(
        `
          ml-1 inline-flex items-center
          transition-opacity
        `,
        active
          ? "text-brand opacity-100"
          : "opacity-40"
      )}
    >
      <Icon size={12} />
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* COMPONENT */
/* -------------------------------------------------------------------------- */

export default function ComparisonTable({
  results,
  summary,
}: ComparisonTableProps) {
  const [sortKey, setSortKey] =
    useState<SortKey>("netProfit");

  const [sortDir, setSortDir] =
    useState<SortDirection>("desc");

  const [highlightMetric, setHighlight] =
    useState<HighlightMetric>(
      "netProfit"
    );

  /* ---------------------------------------------------------------------- */
  /* SORTED DATA */
  /* ---------------------------------------------------------------------- */

  const sorted = useMemo(() => {
    return [...results].sort((a, b) => {
      const av = a[sortKey] ?? 0;
      const bv = b[sortKey] ?? 0;

      return sortDir === "asc"
        ? av - bv
        : bv - av;
    });
  }, [results, sortKey, sortDir]);

  /* ---------------------------------------------------------------------- */
  /* BEST ROWS */
  /* ---------------------------------------------------------------------- */

  const bestPerProduct = useMemo(() => {
    const map: Record<
      string,
      ResultItem
    > = {};

    for (const r of results) {
      const better =
        highlightMetric ===
        "effectiveFeePercent"
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

  /* ---------------------------------------------------------------------- */
  /* SORT */
  /* ---------------------------------------------------------------------- */

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) =>
        d === "asc" ? "desc" : "asc"
      );
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  /* ---------------------------------------------------------------------- */
  /* EXPORT */
  /* ---------------------------------------------------------------------- */

  const exportCSV = () => {
    const headers = [
      "Product",
      "Platform",
      "Price",
      "Fees",
      "Fee%",
      "Payout",
      "Profit",
      "Margin%",
      "ROI%",
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
        typeof v === "number"
          ? v.toFixed(2)
          : v
      )
    );

    const csv = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv",
    });

    const a =
      document.createElement("a");

    a.href = URL.createObjectURL(blob);

    a.download =
      "opsell-profit-report.csv";

    a.click();
  };

  /* ---------------------------------------------------------------------- */
  /* EMPTY */
  /* ---------------------------------------------------------------------- */

  if (results.length === 0) {
    return (
      <div
        className="
          rounded-3xl
          border border-dashed border-n-200
          bg-white
          px-8 py-14
          text-center
          shadow-elev-1
        "
      >
        <div
          className="
            mx-auto mb-4
            flex h-14 w-14 items-center justify-center
            rounded-2xl
            bg-brand-light
            text-brand
          "
        >
          <IconSparkle size={24} />
        </div>

        <h3 className="font-display text-ds-h3 text-n-900">
          No results yet
        </h3>

        <p className="mt-2 text-ds-body text-n-500">
          Select platforms and enter
          product details to compare
          profitability.
        </p>
      </div>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* COLUMNS */
  /* ---------------------------------------------------------------------- */

  const columns = [
    {
      key: "productName",
      label: "Product",
    },
    {
      key: "platform",
      label: "Platform",
    },
    {
      key: "sellingPrice",
      label: "Price",
    },
    {
      key: "totalDeductions",
      label: "Fees",
    },
    {
      key: "effectiveFeePercent",
      label: "Fee %",
    },
    {
      key: "netPayout",
      label: "Payout",
    },
    {
      key: "netProfit",
      label: "Profit",
    },
    {
      key: "profitMargin",
      label: "Margin",
    },
    {
      key: "roi",
      label: "ROI",
    },
  ];

  return (
    <section className="space-y-5">
      {/* ------------------------------------------------------------------ */}
      {/* TOP CARD */}
      {/* ------------------------------------------------------------------ */}

      {summary &&
        summary.hasResults &&
        summary.uniquePlatformCount >=
          2 &&
        summary.bestPlatform !== "-" && (
          <div
            className="
              flex flex-col gap-4
              rounded-3xl
              border border-brand/20
              bg-gradient-to-br
              from-brand-light
              to-white
              p-5
              shadow-elev-2
              md:flex-row
              md:items-center
              md:justify-between
            "
          >
            <div className="flex items-center gap-4">
              <div
                className="
                  flex h-12 w-12 items-center justify-center
                  rounded-2xl
                  bg-brand
                  text-white
                  shadow-elev-1
                "
              >
                <IconCrown size={22} />
              </div>

              <div>
                <p className="text-ds-caption uppercase tracking-wide text-n-500">
                  Top Performing Platform
                </p>

                <h3 className="mt-1 font-display text-ds-h2 text-n-900">
                  {
                    PLATFORMS[
                      summary.bestPlatform
                    ]?.name
                  }
                </h3>
              </div>
            </div>

            <div className="rounded-2xl border border-brand/20 bg-white px-5 py-3 text-center shadow-elev-1">
              <p className="text-ds-caption uppercase tracking-wide text-n-500">
                Avg Margin
              </p>

              <p className="mt-1 font-display text-ds-h2 text-brand">
                {summary.avgMargin.toFixed(
                  1
                )}
                %
              </p>
            </div>
          </div>
        )}

      {/* ------------------------------------------------------------------ */}
      {/* CONTROLS */}
      {/* ------------------------------------------------------------------ */}

      <div
        className="
          flex flex-col gap-4
          rounded-3xl
          border border-n-border
          bg-white
          p-5
          shadow-elev-1
          md:flex-row
          md:items-center
          md:justify-between
        "
      >
        <div className="space-y-2">
          <h2 className="font-display text-ds-h2 text-n-900">
            Profitability Comparison
          </h2>

          <p className="text-ds-body-sm text-n-500">
            Compare margins, payouts,
            ROI, and platform fees.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            value={highlightMetric}
            onChange={(e) =>
              setHighlight(
                e.target
                  .value as HighlightMetric
              )
            }
            className="
              h-11
              rounded-xl
              border border-n-border
              bg-white
              px-4
              text-ds-body-sm
              text-n-700
              outline-none
              transition-all
              focus:border-brand
              focus:ring-4
              focus:ring-brand/10
            "
          >
            <option value="netProfit">
              Highlight Profit
            </option>

            <option value="profitMargin">
              Highlight Margin
            </option>

            <option value="roi">
              Highlight ROI
            </option>

            <option value="effectiveFeePercent">
              Lowest Fee %
            </option>
          </select>

          <button
            onClick={exportCSV}
            className="
              inline-flex items-center gap-2
              rounded-xl
              bg-brand
              px-4 py-2.5
              text-ds-body-sm
              font-semibold
              text-white
              shadow-elev-1
              transition-all
              hover:bg-brand-dark
              hover:shadow-elev-2
            "
          >
            <IconDownload size={14} />
            Export CSV
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* TABLE */}
      {/* ------------------------------------------------------------------ */}

      <div
        className="
          overflow-hidden
          rounded-3xl
          border border-n-border
          bg-white
          shadow-elev-2
        "
      >
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            {/* -------------------------------------------------------------- */}
            {/* HEAD */}
            {/* -------------------------------------------------------------- */}

            <thead className="bg-n-50">
              <tr>
                {columns.map((column) => {
                  const sortable =
                    column.key !==
                      "productName" &&
                    column.key !== "platform";

                  const active =
                    sortKey === column.key;

                  return (
                    <th
                      key={column.key}
                      className="
                        border-b border-n-border
                        px-5 py-4
                        text-left
                        text-ds-caption
                        font-semibold
                        uppercase tracking-wide
                        text-n-500
                      "
                    >
                      {sortable ? (
                        <button
                          onClick={() =>
                            handleSort(
                              column.key as SortKey
                            )
                          }
                          className="
                            inline-flex items-center
                            transition-colors
                            hover:text-brand
                          "
                        >
                          {column.label}

                          <SortIcon
                            active={active}
                            dir={sortDir}
                          />
                        </button>
                      ) : (
                        column.label
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* -------------------------------------------------------------- */}
            {/* BODY */}
            {/* -------------------------------------------------------------- */}

            <tbody>
              {sorted.map((r) => {
                const best =
                  bestPerProduct.has(
                    `${r.productId}-${r.platform}`
                  );

                return (
                  <tr
                    key={`${r.productId}-${r.platform}`}
                    className={cn(
                      `
                        border-b border-n-100
                        transition-all
                        hover:bg-brand-light/20
                      `,
                      best
                        ? "bg-brand-light/30"
                        : ""
                    )}
                  >
                    {/* PRODUCT */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {best && (
                          <div
                            className="
                              flex h-7 w-7 items-center justify-center
                              rounded-full
                              bg-brand
                              text-white
                            "
                          >
                            <IconCrown
                              size={12}
                            />
                          </div>
                        )}

                        <div>
                          <p className="font-medium text-n-900">
                            {
                              r.productName
                            }
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* PLATFORM */}
                    <td className="px-5 py-4">
                      <PlatformBadge
                        platformId={
                          r.platform
                        }
                      />
                    </td>

                    {/* PRICE */}
                    <td className="px-5 py-4 text-right font-mono text-sm text-n-700">
                      {formatCurrency(
                        r.sellingPrice,
                        r.platform
                      )}
                    </td>

                    {/* FEES */}
                    <td className="px-5 py-4 text-right font-mono text-sm text-n-700">
                      {formatCurrency(
                        r.totalDeductions,
                        r.platform
                      )}
                    </td>

                    {/* FEE % */}
                    <td className="px-5 py-4 text-right">
                      <span
                        className={cn(
                          `
                            rounded-full
                            px-2.5 py-1
                            text-ds-caption
                            font-semibold
                          `,
                          r.effectiveFeePercent <=
                            15
                            ? "bg-success-light text-success"
                            : r.effectiveFeePercent <=
                              25
                            ? "bg-warning-light text-warning"
                            : "bg-error-light text-error"
                        )}
                      >
                        {r.effectiveFeePercent.toFixed(
                          1
                        )}
                        %
                      </span>
                    </td>

                    {/* PAYOUT */}
                    <td className="px-5 py-4 text-right font-mono text-sm text-n-700">
                      {formatCurrency(
                        r.netPayout,
                        r.platform
                      )}
                    </td>

                    {/* PROFIT */}
                    <td
                      className={cn(
                        `
                          px-5 py-4
                          text-right
                          font-mono text-sm font-semibold
                        `,
                        r.netProfit >= 0
                          ? "text-success"
                          : "text-error"
                      )}
                    >
                      {formatCurrency(
                        r.netProfit,
                        r.platform
                      )}
                    </td>

                    {/* MARGIN */}
                    <td className="px-5 py-4 text-right">
                      <MarginPill
                        value={
                          r.profitMargin
                        }
                      />
                    </td>

                    {/* ROI */}
                    <td className="px-5 py-4 text-right font-mono text-sm font-semibold text-brand">
                      {r.roi.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}