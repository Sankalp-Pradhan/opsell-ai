"use client";

import { useState } from "react";

import PlatformBadge from "./PlatformBadge";

import { PLATFORMS } from "../data/platforms";

import {
  IconChevronDown,
  IconAlert,
  IconInfo,
} from "./Icon";

import Tip from "./Tip";

import type { PlatformId } from "../engines";

/* -------------------------------------------------------------------------- */
/* TYPES */
/* -------------------------------------------------------------------------- */

interface ResultItem {
  platform: PlatformId;

  sellingPrice: number;

  cogs: number;

  referralFee: number;

  closingFee: number;

  weightHandlingFee: number;

  fulfillmentFee: number;

  shippingFee: number;

  collectionFee: number;

  codFee: number;

  tcs: number;

  gstOnFees: number;

  adsSpend: number;

  returnLogisticsFee: number;

  returnImpact: number;

  otherFees: number;

  totalDeductions: number;

  netPayout: number;

  netProfit: number;

  profitMargin: number;

  roi: number;

  effectiveFeePercent: number;
}

interface MiniBarProps {
  result: ResultItem;
}

interface FeeRowProps {
  label: string;
  amount: number;
  platformId: PlatformId;
  badge?: "Reclaimable" | "Info";
  term?:
    | "referral"
    | "closing"
    | "weight"
    | "fulfillment"
    | "shipping"
    | "collection"
    | "cod"
    | "tcs"
    | "gstFees"
    | "itc"
    | "adsSpend"
    | "returnImpact"
    | "margin"
    | "roi"
    | "effectiveFee"
    | "netPayout"
    | "returnRate";
}

interface PlatformPanelProps {
  r: ResultItem;
}

interface FeeBreakdownCardProps {
  productName: string;
  results: ResultItem[];
}

/* -------------------------------------------------------------------------- */
/* HELPERS */
/* -------------------------------------------------------------------------- */

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function fmt(
  value: number,
  platformId: PlatformId
): string {
  const p = PLATFORMS[platformId];

  if (!p) {
    return value.toFixed(2);
  }

  if (p.currencySymbol === "$") {
    return `$${value.toFixed(2)}`;
  }

  if (p.currencySymbol === "AED") {
    return `AED ${value.toFixed(2)}`;
  }

  return `₹${value.toFixed(2)}`;
}

/* -------------------------------------------------------------------------- */
/* MINI BAR */
/* -------------------------------------------------------------------------- */

function MiniBar({
  result,
}: MiniBarProps) {
  const items = [
    {
      label: "COGS",
      value: result.cogs,
      color: "bg-n-400",
    },

    {
      label: "Referral",
      value: result.referralFee,
      color: "bg-error",
    },

    {
      label: "Shipping",
      value:
        result.shippingFee +
        result.weightHandlingFee +
        result.fulfillmentFee,
      color: "bg-warning",
    },

    {
      label: "Other",
      value:
        result.closingFee +
        result.collectionFee +
        result.codFee +
        result.tcs +
        result.otherFees,
      color: "bg-brand-mid",
    },

    {
      label: "Profit",
      value: Math.max(
        0,
        result.netProfit
      ),
      color: "bg-success",
    },
  ].filter(
    (i) => i.value > 0
  );

  const total = items.reduce(
    (s, i) => s + i.value,
    0
  );

  if (total === 0) {
    return null;
  }

  return (
    <div className="mb-5">
      {/* Bar */}

      <div
        className="
          flex h-2
          overflow-hidden
          rounded-full
          bg-n-100
        "
      >
        {items.map((item, i) => (
          <div
            key={i}
            title={`${item.label}: ${(
              (item.value / total) *
              100
            ).toFixed(0)}%`}
            className={cn(
              "transition-all",
              item.color
            )}
            style={{
              width: `${
                (item.value / total) *
                100
              }%`,
              minWidth:
                item.value > 0
                  ? 6
                  : 0,
            }}
          />
        ))}
      </div>

      {/* Legend */}

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2"
          >
            <span
              className={cn(
                `
                  h-2 w-2
                  rounded-full
                `,
                item.color
              )}
            />

            <span
              className="
                text-ds-caption
                text-n-500
              "
            >
              {item.label}{" "}
              {(
                (item.value / total) *
                100
              ).toFixed(0)}
              %
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* FEE ROW */
/* -------------------------------------------------------------------------- */

function FeeRow({
  label,
  amount,
  platformId,
  badge,
  term,
}: FeeRowProps) {
  const isZero = amount === 0;

  return (
    <div
      className="
        flex items-center justify-between
        border-b border-n-100
        py-3
        last:border-none
      "
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            `
              text-ds-body-sm
            `,
            isZero
              ? "text-n-400"
              : "text-n-700"
          )}
        >
          {label}
        </span>

        {term && (
          <Tip
            term={term}
            size={13}
          />
        )}

        {badge ===
          "Reclaimable" && (
          <span
            className="
              inline-flex items-center
              rounded-full
              border border-success/20
              bg-success-light
              px-2 py-0.5
              text-[10px]
              font-semibold
              uppercase tracking-wide
              text-success
            "
          >
            Reclaimable
          </span>
        )}

        {badge === "Info" && (
          <span
            className="
              inline-flex items-center gap-1
              rounded-full
              border border-brand/20
              bg-brand-light
              px-2 py-0.5
              text-[10px]
              font-semibold
              uppercase tracking-wide
              text-brand
            "
          >
            <IconInfo size={10} />
            ITC
          </span>
        )}
      </div>

      <span
        className={cn(
          `
            font-mono
            text-ds-body-sm
            font-medium
          `,
          isZero
            ? "text-n-300"
            : "text-error"
        )}
      >
        {isZero
          ? "—"
          : `-${fmt(
              amount,
              platformId
            )}`}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* PLATFORM PANEL */
/* -------------------------------------------------------------------------- */

function PlatformPanel({
  r,
}: PlatformPanelProps) {
  return (
    <div
      className="
        rounded-3xl
        border border-n-border
        bg-white
        p-5
        shadow-elev-1
        transition-all
        hover:shadow-elev-2
      "
    >
      {/* Header */}

      <div className="mb-5 flex items-start justify-between">
        <PlatformBadge
          platformId={r.platform}
          size="md"
        />

        <div className="text-right">
          <p
            className={cn(
              `
                font-mono
                text-xl
                font-bold
              `,
              r.netProfit >= 0
                ? "text-success"
                : "text-error"
            )}
          >
            {fmt(
              r.netProfit,
              r.platform
            )}
          </p>

          <p
            className="
              mt-1
              text-ds-caption
              uppercase tracking-wide
              text-n-400
            "
          >
            Net Profit
          </p>
        </div>
      </div>

      {/* Visual */}

      <MiniBar result={r} />

      {/* Fees */}

      <div className="space-y-0">
        <FeeRow
          label="Referral / Commission"
          amount={r.referralFee}
          platformId={r.platform}
          term="referral"
        />

        <FeeRow
          label="Closing / Fixed Fee"
          amount={r.closingFee}
          platformId={r.platform}
          term="closing"
        />

        {r.weightHandlingFee >
          0 && (
          <FeeRow
            label="Weight Handling"
            amount={
              r.weightHandlingFee
            }
            platformId={
              r.platform
            }
            term="weight"
          />
        )}

        {r.fulfillmentFee >
          0 && (
          <FeeRow
            label="Fulfillment Fee"
            amount={
              r.fulfillmentFee
            }
            platformId={
              r.platform
            }
            term="fulfillment"
          />
        )}

        {r.shippingFee > 0 && (
          <FeeRow
            label="Shipping"
            amount={r.shippingFee}
            platformId={
              r.platform
            }
            term="shipping"
          />
        )}

        {r.collectionFee >
          0 && (
          <FeeRow
            label="Collection Fee"
            amount={
              r.collectionFee
            }
            platformId={
              r.platform
            }
            term="collection"
          />
        )}

        {r.codFee > 0 && (
          <FeeRow
            label="COD Fee"
            amount={r.codFee}
            platformId={
              r.platform
            }
            term="cod"
          />
        )}

        {r.tcs > 0 && (
          <FeeRow
            label="TCS (1%)"
            amount={r.tcs}
            platformId={
              r.platform
            }
            badge="Reclaimable"
            term="tcs"
          />
        )}

        {r.gstOnFees > 0 && (
          <FeeRow
            label="GST on Fees"
            amount={r.gstOnFees}
            platformId={
              r.platform
            }
            badge="Info"
            term="gstFees"
          />
        )}

        {r.adsSpend > 0 && (
          <FeeRow
            label="Ads Spend"
            amount={r.adsSpend}
            platformId={
              r.platform
            }
            term="adsSpend"
          />
        )}

        {r.returnImpact > 0 && (
          <FeeRow
            label="Return Impact"
            amount={
              r.returnImpact
            }
            platformId={
              r.platform
            }
            term="returnImpact"
          />
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* MAIN */
/* -------------------------------------------------------------------------- */

export default function FeeBreakdownCard({
  productName,
  results,
}: FeeBreakdownCardProps) {
  const [
    expanded,
    setExpanded,
  ] = useState(true);

  if (
    !results ||
    results.length === 0
  ) {
    return null;
  }

  return (
    <section
      className="
        overflow-hidden
        rounded-3xl
        border border-n-border
        bg-white
        shadow-elev-2
      "
    >
      {/* Header */}

      <button
        onClick={() =>
          setExpanded(!expanded)
        }
        className="
          flex w-full items-center justify-between
          border-b border-n-100
          px-6 py-5
          transition-all
          hover:bg-brand-light/20
        "
      >
        <div className="flex items-center gap-3">
          <div>
            <h3
              className="
                font-display
                text-ds-h3
                text-left
                text-n-900
              "
            >
              {productName}
            </h3>

            <p
              className="
                mt-1
                text-ds-caption
                text-left
                text-n-500
              "
            >
              {results.length} platform
              comparison
            </p>
          </div>
        </div>

        <div
          className={cn(
            `
              flex h-10 w-10
              items-center justify-center
              rounded-xl
              border border-n-border
              bg-white
              text-n-500
              transition-all
            `,
            expanded
              ? "rotate-180"
              : ""
          )}
        >
          <IconChevronDown
            size={18}
          />
        </div>
      </button>

      {/* Content */}

      {expanded && (
        <div className="p-6">
          <div
            className={cn(
              `
                grid gap-5
              `,
              results.length === 1
                ? "grid-cols-1"
                : "grid-cols-1 xl:grid-cols-2"
            )}
          >
            {results.map((r) => (
              <PlatformPanel
                key={r.platform}
                r={r}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}