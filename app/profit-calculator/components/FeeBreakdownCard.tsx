"use client";

import { useState } from "react";
import Image from "next/image";

/* -------------------------------------------------------------------------- */
/* TYPES */
/* -------------------------------------------------------------------------- */

type PlatformId = string;

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
/* -------------------------------------------------------------------------- */
/* PLATFORM CONFIG */
/* -------------------------------------------------------------------------- */

interface PlatformConfig {
  name: string;
  logoSrc: string;
  logoAlt: string;
  accentColor: string;
  borderColor: string;
  bgColor: string;
  currencySymbol: string;
}

/* -------------------------------------------------------------------------- */
/* BASE CONFIGS */
/* -------------------------------------------------------------------------- */

const AMAZON_CONFIG: PlatformConfig = {
  name: "Amazon India",
  logoSrc: "/assets/amazon.png",
  logoAlt: "Amazon",
  accentColor: "text-[#FF9900]",
  borderColor: "border-[#FF9900]/20",
  bgColor: "bg-[#FFFBF0]",
  currencySymbol: "₹",
};

const FLIPKART_CONFIG: PlatformConfig = {
  name: "Flipkart",
  logoSrc: "/assets/flipkart.png",
  logoAlt: "Flipkart",
  accentColor: "text-[#2874F0]",
  borderColor: "border-[#2874F0]/20",
  bgColor: "bg-[#F0F5FF]",
  currencySymbol: "₹",
};

const MEESHO_CONFIG: PlatformConfig = {
  name: "Meesho",
  logoSrc: "/assets/meesho1.png",
  logoAlt: "Meesho",
  accentColor: "text-[#F43397]",
  borderColor: "border-[#F43397]/20",
  bgColor: "bg-[#FFF0F7]",
  currencySymbol: "₹",
};

const DEFAULT_CONFIG: PlatformConfig = {
  name: "Unknown Platform",
  logoSrc: "/assets/default.png",
  logoAlt: "Platform",
  accentColor: "text-brand",
  borderColor: "border-brand/20",
  bgColor: "bg-brand-light",
  currencySymbol: "₹",
};
const AMAZON_USA_CONFIG: PlatformConfig = {
  name: "Amazon USA",
  logoSrc: "/assets/amazon.png",
  logoAlt: "Amazon USA",
  accentColor: "text-[#FF9900]",
  borderColor: "border-[#FF9900]/20",
  bgColor: "bg-[#FFFBF0]",
  currencySymbol: "$",
};

const SHOPSY_CONFIG: PlatformConfig = {
  name: "Shopsy",
  logoSrc: "/assets/shopsy.png",
  logoAlt: "Shopsy",
  accentColor: "text-[#E91E63]",
  borderColor: "border-[#E91E63]/20",
  bgColor: "bg-[#FFF0F5]",
  currencySymbol: "₹",
};

const NOON_CONFIG: PlatformConfig = {
  name: "Noon UAE",
  logoSrc: "/assets/noon.png",
  logoAlt: "Noon",
  accentColor: "text-[#FEEE00]",  // noon yellow is dark on white — swap if needed
  borderColor: "border-[#F5C400]/30",
  bgColor: "bg-[#FFFDE7]",
  currencySymbol: "AED ",           // space so "AED 120.00" reads naturally
};

const WALMART_CONFIG: PlatformConfig = {
  name: "Walmart",
  logoSrc: "/assets/walmart.png",
  logoAlt: "Walmart",
  accentColor: "text-[#0071DC]",
  borderColor: "border-[#0071DC]/20",
  bgColor: "bg-[#EFF6FF]",
  currencySymbol: "$",
};

const EBAY_CONFIG: PlatformConfig = {
  name: "eBay",
  logoSrc: "/assets/ebay.png",
  logoAlt: "eBay",
  accentColor: "text-[#E53238]",
  borderColor: "border-[#E53238]/20",
  bgColor: "bg-[#FFF0F0]",
  currencySymbol: "$",
};

const MYNTRA_CONFIG: PlatformConfig = {
  name: "Myntra",
  logoSrc: "/assets/myntra.png",
  logoAlt: "Myntra",
  accentColor: "text-[#FF3F6C]",
  borderColor: "border-[#FF3F6C]/20",
  bgColor: "bg-[#FFF0F4]",
  currencySymbol: "₹",
};



/* -------------------------------------------------------------------------- */
/* PLATFORM MAP */
/* -------------------------------------------------------------------------- */
const PLATFORM_CONFIG: Record<string, PlatformConfig> = {
  /* AMAZON INDIA */
  amazon: AMAZON_CONFIG,
  amazonindia: AMAZON_CONFIG,
  amazon_india: AMAZON_CONFIG,
  amazonin: AMAZON_CONFIG,

  /* AMAZON USA */
  amazonusa: AMAZON_USA_CONFIG,
  amazon_us: AMAZON_USA_CONFIG,
  amazonus: AMAZON_USA_CONFIG,
  amazoncom: AMAZON_USA_CONFIG,
  amazon_usa: AMAZON_USA_CONFIG,

  /* FLIPKART */
  flipkart: FLIPKART_CONFIG,
  fk: FLIPKART_CONFIG,

  /* SHOPSY */
  shopsy: SHOPSY_CONFIG,

  /* MEESHO */
  meesho: MEESHO_CONFIG,
  meesho1: MEESHO_CONFIG,

  /* NOON */
  noon: NOON_CONFIG,
  noonuae: NOON_CONFIG,
  noon_uae: NOON_CONFIG,

  /* WALMART */
  walmart: WALMART_CONFIG,

  /* EBAY */
  ebay: EBAY_CONFIG,

  /* MYNTRA */
  myntra: MYNTRA_CONFIG,
};

/* -------------------------------------------------------------------------- */
/* PLATFORM NORMALIZER */
/* -------------------------------------------------------------------------- */

function normalizePlatformId(platformId: string): string {
  return platformId
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "")
    .replace(/-/g, "")
    .replace(/_/g, "");
}

/* -------------------------------------------------------------------------- */
/* GET CONFIG */
/* -------------------------------------------------------------------------- */

function getPlatformConfig(platformId: PlatformId): PlatformConfig {
  const normalized = normalizePlatformId(platformId);

  return (
    PLATFORM_CONFIG[normalized] ?? {
      ...DEFAULT_CONFIG,
      name: platformId,
      logoAlt: platformId,
    }
  );
}
/* -------------------------------------------------------------------------- */
/* HELPERS */
/* -------------------------------------------------------------------------- */

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function fmt(value: number, platformId: PlatformId): string {
  const cfg = getPlatformConfig(platformId);

  const formatted = Math.abs(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${cfg.currencySymbol}${formatted}`;
}

/* -------------------------------------------------------------------------- */
/* ICONS */
/* -------------------------------------------------------------------------- */

function ChevronUpIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function InfoIcon({ size = 13 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function TrendUpIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function PercentIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="19" y1="5" x2="5" y2="19" />
      <circle cx="6.5" cy="6.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  );
}

function GstIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

function CollectIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* FEE ICON */
/* -------------------------------------------------------------------------- */

type FeeType =
  | "referral"
  | "closing"
  | "weight"
  | "fulfillment"
  | "shipping"
  | "collection"
  | "cod"
  | "tcs"
  | "gst"
  | "ads"
  | "return"
  | "other";

function FeeIcon({ type }: { type: FeeType }) {
  const iconBg: Record<FeeType, string> = {
    referral: "bg-error-light text-error",
    closing: "bg-warning-light text-warning",
    weight: "bg-blue-50 text-blue-500",
    fulfillment: "bg-blue-50 text-blue-500",
    shipping: "bg-blue-50 text-blue-500",
    collection: "bg-green-50 text-success",
    cod: "bg-green-50 text-success",
    tcs: "bg-purple-50 text-brand",
    gst: "bg-purple-50 text-brand",
    ads: "bg-orange-50 text-orange-500",
    return: "bg-error-light text-error",
    other: "bg-n-100 text-n-500",
  };

  const icons: Record<FeeType, React.ReactNode> = {
    referral: <UserIcon />,
    closing: <FileIcon />,
    weight: <TruckIcon />,
    fulfillment: <TruckIcon />,
    shipping: <TruckIcon />,
    collection: <CollectIcon />,
    cod: <CollectIcon />,
    tcs: <PercentIcon />,
    gst: <GstIcon />,
    ads: <PercentIcon />,
    return: <TruckIcon />,
    other: <FileIcon />,
  };

  return (
    <span
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-lg flex-shrink-0",
        iconBg[type]
      )}
    >
      {icons[type]}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* MINI BAR */
/* -------------------------------------------------------------------------- */

function MiniBar({ result }: { result: ResultItem }) {
  const segments = [
    {
      label: "Referral",
      value: result.referralFee,
      color: "#EF4444",
    },
    {
      label: "Shipping",
      value:
        result.shippingFee +
        result.weightHandlingFee +
        result.fulfillmentFee,
      color: "#F59E0B",
    },
    {
      label: "Other",
      value:
        result.closingFee +
        result.collectionFee +
        result.codFee +
        result.tcs +
        result.otherFees,
      color: "#7B73FF",
    },
    {
      label: "Profit",
      value: Math.max(0, result.netProfit),
      color: "#16A34A",
    },
  ].filter((s) => s.value > 0);

  const total = segments.reduce((s, i) => s + i.value, 0);

  if (total === 0) return null;

  return (
    <div className="mb-5">
      <div className="flex h-2 overflow-hidden rounded-full bg-n-100 gap-0.5">
        {segments.map((seg, i) => (
          <div
            key={i}
            style={{
              width: `${(seg.value / total) * 100}%`,
              backgroundColor: seg.color,
            }}
          />
        ))}
      </div>

      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: seg.color }}
            />
            <span className="text-[11px] sm:text-xs text-n-500">
              {seg.label} {((seg.value / total) * 100).toFixed(0)}%
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

interface FeeRowProps {
  label: string;
  amount: number;
  platformId: PlatformId;
  iconType: FeeType;
  badge?: "Reclaimable" | "ITC";
  isLast?: boolean;
}

function FeeRow({
  label,
  amount,
  platformId,
  iconType,
  badge,
  isLast,
}: FeeRowProps) {
  const isZero = amount === 0;

  return (
    <div
      className={cn(
        "flex items-start sm:items-center justify-between gap-3 py-3",
        !isLast && "border-b border-n-100"
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <FeeIcon type={iconType} />

        <span
          className={cn(
            "truncate text-[12px] sm:text-sm",
            isZero ? "text-n-400" : "text-n-700"
          )}
        >
          {label}
        </span>

        <button className="text-n-300 hover:text-n-500">
          <InfoIcon size={12} />
        </button>

        {badge === "Reclaimable" && (
          <span className="hidden sm:inline-flex rounded-full border border-success/20 bg-success-light px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-success">
            Reclaimable
          </span>
        )}

        {badge === "ITC" && (
          <span className="hidden sm:inline-flex rounded-full border border-brand/20 bg-brand-light px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand">
            ITC
          </span>
        )}
      </div>

      <span
        className={cn(
          "font-mono text-[12px] sm:text-sm font-semibold whitespace-nowrap",
          isZero ? "text-n-300" : "text-error"
        )}
      >
        {isZero ? "—" : `-${fmt(amount, platformId)}`}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* PLATFORM PANEL */
/* -------------------------------------------------------------------------- */

function PlatformPanel({ r }: { r: ResultItem }) {
  const cfg = getPlatformConfig(r.platform);

  const feeRows = [
    {
      label: "Referral / Commission",
      amount: r.referralFee,
      iconType: "referral" as FeeType,
    },
    {
      label: "Closing / Fixed Fee",
      amount: r.closingFee,
      iconType: "closing" as FeeType,
    },
    {
      label: "Weight Handling",
      amount: r.weightHandlingFee,
      iconType: "weight" as FeeType,
    },
    {
      label: "Fulfillment Fee",
      amount: r.fulfillmentFee,
      iconType: "fulfillment" as FeeType,
    },
    {
      label: "Shipping",
      amount: r.shippingFee,
      iconType: "shipping" as FeeType,
    },
    {
      label: "Collection Fee",
      amount: r.collectionFee,
      iconType: "collection" as FeeType,
    },
    {
      label: "COD Fee",
      amount: r.codFee,
      iconType: "cod" as FeeType,
    },
    {
      label: "TCS (1%)",
      amount: r.tcs,
      iconType: "tcs" as FeeType,
      badge: "Reclaimable" as const,
    },
    {
      label: "GST on Fees",
      amount: r.gstOnFees,
      iconType: "gst" as FeeType,
      badge: "ITC" as const,
    },
    {
      label: "Ads Spend",
      amount: r.adsSpend,
      iconType: "ads" as FeeType,
    },
    {
      label: "Return Impact",
      amount: r.returnImpact,
      iconType: "return" as FeeType,
    },
  ].filter((row) => row.amount > 0);

  return (
    <div
      className={cn(
        "rounded-xl sm:rounded-2xl border bg-white p-4 sm:p-5 shadow-elev-1 hover:shadow-elev-2 transition-all",
        cfg.borderColor
      )}
    >
      {/* Header */}

      <div className="mb-4 sm:mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div
          className={cn(
            "flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl border px-2.5 py-2 sm:px-3",
            cfg.borderColor,
            cfg.bgColor
          )}
        >
          <div className="relative h-8 w-8 overflow-hidden rounded-lg">
            <Image
              src={cfg.logoSrc}
              alt={cfg.logoAlt}
              fill
              className="object-contain"
            />
          </div>

          <span
            className={cn(
              "text-sm sm:text-base font-semibold",
              cfg.accentColor
            )}
          >
            {cfg.name}
          </span>
        </div>

        <div className="text-left sm:text-right">
          <p
            className={cn(
              "font-mono text-lg sm:text-xl font-bold",
              r.netProfit >= 0 ? "text-success" : "text-error"
            )}
          >
            {fmt(r.netProfit, r.platform)}
          </p>

          <p className="text-[11px] uppercase tracking-wide text-n-400">
            Net Profit
          </p>
        </div>
      </div>

      <MiniBar result={r} />

      <div>
        {feeRows.map((row, i) => (
          <FeeRow
            key={row.label}
            label={row.label}
            amount={row.amount}
            platformId={r.platform}
            iconType={row.iconType}
            badge={row.badge}
            isLast={i === feeRows.length - 1}
          />
        ))}
      </div>

      <div
        className={cn(
          "mt-4 flex items-center justify-between rounded-xl border px-4 py-3",
          cfg.borderColor,
          cfg.bgColor
        )}
      >
        <span
          className={cn(
            "text-[12px] sm:text-sm font-semibold",
            cfg.accentColor
          )}
        >
          Total Deductions
        </span>

        <span
          className={cn(
            "font-mono text-[12px] sm:text-sm font-bold",
            cfg.accentColor
          )}
        >
          -{fmt(r.totalDeductions, r.platform)}
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* WINNER BANNER */
/* -------------------------------------------------------------------------- */

function WinnerBanner({ results }: { results: ResultItem[] }) {
  if (results.length < 2) return null;

  const sorted = [...results].sort((a, b) => b.netProfit - a.netProfit);

  const winner = sorted[0];
  const runnerUp = sorted[1];

  const diff = winner.netProfit - runnerUp.netProfit;

  if (diff <= 0) return null;

  const winnerCfg = getPlatformConfig(winner.platform);

  return (
    <div className="mt-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 rounded-xl sm:rounded-2xl border border-success/20 bg-success-light px-4 py-4 sm:px-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success text-white flex-shrink-0">
          <TrendUpIcon />
        </div>

        <div>
          <p className="text-sm sm:text-base font-semibold text-n-800 leading-relaxed">
            <span className={winnerCfg.accentColor}>
              {winnerCfg.name}
            </span>{" "}
            gives you{" "}
            <span className="font-bold text-success">
              {fmt(diff, winner.platform)} more profit
            </span>
          </p>

          <p className="text-[11px] sm:text-xs text-n-500 mt-1">
            Higher net profit after all fee deductions
          </p>
        </div>
      </div>

      <button className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-xl border border-success/30 bg-white px-4 py-2 text-[13px] sm:text-sm font-semibold text-success shadow-elev-1 hover:shadow-elev-2 hover:bg-success-light/60 transition-all">
        View Comparison

        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* MAIN */
/* -------------------------------------------------------------------------- */

interface FeeBreakdownCardProps {
  productName: string;
  productImageSrc?: string;
  results: ResultItem[];
}

export default function FeeBreakdownCard({
  productName,
  productImageSrc = "/assets/product.jpg",
  results,
}: FeeBreakdownCardProps) {
  const [expanded, setExpanded] = useState(true);

  if (!results || results.length === 0) return null;

  return (
    <section className="overflow-hidden rounded-2xl sm:rounded-3xl border border-n-border bg-white shadow-elev-2">
      {/* Header */}

      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-start sm:items-center justify-between gap-4 border-b border-n-100 px-4 py-4 sm:px-6 sm:py-5 hover:bg-n-50 transition-all"
      >
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
          <div className="relative h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0 overflow-hidden rounded-lg sm:rounded-xl border border-n-border bg-n-50 shadow-elev-1">
            <Image
              src={productImageSrc}
              alt={productName}
              fill
              className="object-contain p-1"
            />
          </div>

          <div className="min-w-0 text-left">
            <h3 className="truncate font-display text-[15px] sm:text-lg font-semibold text-n-900">
              {productName}
            </h3>

            <p className="mt-0.5 flex items-center gap-1.5 text-[11px] sm:text-xs text-n-500">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>

              {results.length} platform comparison
            </p>
          </div>
        </div>

        <div
          className={cn(
            "flex h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0 items-center justify-center rounded-lg sm:rounded-xl border border-n-border bg-white text-n-500 transition-transform duration-200",
            expanded ? "rotate-0" : "rotate-180"
          )}
        >
          {expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </div>
      </button>

      {/* Content */}

      {expanded && (
        <div className="p-4 sm:p-6">
          <div
            className={cn(
              "grid gap-4 sm:gap-5",
              results.length === 1
                ? "grid-cols-1"
                : "grid-cols-1 lg:grid-cols-2"
            )}
          >
            {results.map((r) => (
              <PlatformPanel key={r.platform} r={r} />
            ))}
          </div>

          <WinnerBanner results={results} />
        </div>
      )}
    </section>
  );
}