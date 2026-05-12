"use client";

import {
  useMemo,
  useState,
} from "react";

import PlatformBadge from "./PlatformBadge";

import {
  IconTrash,
  IconRefresh,
  IconChevronDown,
  IconChevronUp,
} from "./Icon";

import {
  Copy,
  Sparkles,
  TrendingUp,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/* TYPES */
/* -------------------------------------------------------------------------- */

interface Product {
  id: number;
  name: string;
  [key: string]: unknown;
}

interface ProductCardProps {
  product: Product;

  onUpdate: (
    updates: Partial<Product>
  ) => void;

  onDelete: () => void;

  onReset: () => void;

  onDuplicate?: () => void;

  canDelete?: boolean;
}

type FieldType =
  | "text"
  | "number";

interface FieldConfig {
  key: keyof Product | string;

  label: string;

  type?: FieldType;

  placeholder?: string;

  prefix?: string;

  helper?: string;
}

/* -------------------------------------------------------------------------- */
/* HELPERS */
/* -------------------------------------------------------------------------- */

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function safeNumber(
  value: unknown
): number {
  if (
    value === "" ||
    value === null ||
    value === undefined
  ) {
    return 0;
  }

  const n = Number(value);

  return Number.isNaN(n)
    ? 0
    : n;
}

/* -------------------------------------------------------------------------- */
/* FIELD CONFIG */
/* -------------------------------------------------------------------------- */

const CORE_FIELDS: FieldConfig[] =
  [
    {
      key: "name",

      label: "Product Name",

      placeholder:
        "Premium Cotton T-Shirt",
    },

    {
      key: "sellingPrice",

      label: "Selling Price",

      type: "number",

      prefix: "₹",

      placeholder: "999",

      helper:
        "Final marketplace selling price",
    },

    {
      key: "cogs",

      label: "COGS",

      type: "number",

      prefix: "₹",

      placeholder: "350",

      helper:
        "Manufacturing or sourcing cost",
    },

    {
      key: "weight",

      label: "Weight (kg)",

      type: "number",

      placeholder: "0.5",

      helper:
        "Used for shipping & fulfillment",
    },

    {
      key: "adsSpend",

      label: "Ads Spend",

      type: "number",

      prefix: "₹",

      placeholder: "120",

      helper:
        "Estimated ad spend per order",
    },
  ];

/* -------------------------------------------------------------------------- */
/* INPUT FIELD */
/* -------------------------------------------------------------------------- */

function InputField({
  field,
  value,
  onChange,
}: {
  field: FieldConfig;

  value: unknown;

  onChange: (
    value: unknown
  ) => void;
}) {
  return (
    <div className="space-y-2">
      {/* Label */}

      <div className="flex items-center justify-between gap-3">
        <label
          className="
            text-ds-caption
            font-semibold
            uppercase tracking-wide
            text-n-500
          "
        >
          {field.label}
        </label>

        {field.helper && (
          <span
            className="
              text-[11px]
              text-n-400
            "
          >
            {field.helper}
          </span>
        )}
      </div>

      {/* Input */}

      <div className="relative">
        {field.prefix && (
          <span
            className="
              pointer-events-none
              absolute left-4 top-1/2
              -translate-y-1/2
              text-ds-body-sm
              font-medium
              text-n-400
            "
          >
            {field.prefix}
          </span>
        )}

        <input
          type={
            field.type ?? "text"
          }
          value={
            value?.toString() ?? ""
          }
          placeholder={
            field.placeholder
          }
          onChange={(e) =>
            onChange(
              field.type ===
                "number"
                ? safeNumber(
                    e.target.value
                  )
                : e.target.value
            )
          }
          className={cn(
            `
              h-12 w-full
              rounded-2xl
              border border-n-border
              bg-white
              px-4
              text-ds-body-sm
              text-n-800
              outline-none
              transition-all
              placeholder:text-n-300
              focus:border-brand
              focus:ring-4
              focus:ring-brand/10
            `,
            field.prefix
              ? "pl-8"
              : ""
          )}
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* PRODUCT CARD */
/* -------------------------------------------------------------------------- */

function ProductCard({
  product,
  onUpdate,
  onDelete,
  onReset,
  onDuplicate,
  canDelete = true,
}: ProductCardProps) {
  const [
    expanded,
    setExpanded,
  ] = useState(true);

  /* ---------------------------------------------------------------------- */
  /* CALCULATIONS */
  /* ---------------------------------------------------------------------- */

  const completion =
    useMemo(() => {
      const required = [
        "name",
        "sellingPrice",
        "cogs",
      ];

      const filled =
        required.filter(
          (k) =>
            Boolean(product[k])
        ).length;

      return Math.round(
        (filled /
          required.length) *
          100
      );
    }, [product]);

  const estimatedMargin =
    useMemo(() => {
      const price =
        safeNumber(
          product.sellingPrice
        );

      const cogs =
        safeNumber(product.cogs);

      const ads =
        safeNumber(
          product.adsSpend
        );

      if (!price) return 0;

      return Math.max(
        0,
        Math.round(
          ((price -
            cogs -
            ads) /
            price) *
            100
        )
      );
    }, [product]);

  const marginTone =
    estimatedMargin >= 25
      ? "text-success"
      : estimatedMargin >= 10
      ? "text-warning"
      : "text-error";

  /* ---------------------------------------------------------------------- */
  /* RENDER */
  /* ---------------------------------------------------------------------- */

  return (
    <article
      className="
        overflow-hidden
        rounded-3xl
        border border-n-border
        bg-white
        shadow-elev-2
      "
    >
      {/* HEADER */}

      <div
        className="
          border-b border-n-100
          px-6 py-5
        "
      >
        <div
          className="
            flex flex-col gap-5
            lg:flex-row
            lg:items-start
            lg:justify-between
          "
        >
          {/* LEFT */}

          <div className="min-w-0 flex-1">
            {/* Top Pills */}

            <div
              className="
                flex flex-wrap items-center gap-3
              "
            >
              <PlatformBadge
                platformId="amazonIndia"
                size="sm"
              />

              <span
                className="
                  rounded-full
                  border border-success/20
                  bg-success-light
                  px-3 py-1
                  text-ds-caption
                  font-semibold
                  text-success
                "
              >
                {completion}% complete
              </span>
            </div>

            {/* Title */}

            <h2
              className="
                mt-4
                truncate
                font-display
                text-ds-h1
                text-n-900
              "
            >
              {product.name ||
                "Untitled Product"}
            </h2>

            {/* Desc */}

            <p
              className="
                mt-2
                max-w-2xl
                text-ds-body-sm
                leading-relaxed
                text-n-500
              "
            >
              Configure pricing,
              sourcing, shipping,
              and advertising inputs
              to generate accurate
              marketplace
              profitability insights.
            </p>
          </div>

          {/* ACTIONS */}

          <div
            className="
              flex flex-wrap gap-2
            "
          >
            {/* Expand */}

            <button
              onClick={() =>
                setExpanded(
                  !expanded
                )
              }
              className="
                inline-flex items-center gap-2
                rounded-2xl
                border border-n-border
                bg-white
                px-4 py-2.5
                text-ds-body-sm
                font-medium
                text-n-700
                transition-all
                hover:border-brand/20
                hover:bg-brand-light/20
                hover:text-brand
              "
            >
              {expanded ? (
                <IconChevronUp
                  size={15}
                />
              ) : (
                <IconChevronDown
                  size={15}
                />
              )}

              {expanded
                ? "Collapse"
                : "Expand"}
            </button>

            {/* Reset */}

            <button
              onClick={onReset}
              className="
                inline-flex items-center gap-2
                rounded-2xl
                border border-warning/20
                bg-warning-light
                px-4 py-2.5
                text-ds-body-sm
                font-medium
                text-warning
                transition-all
                hover:opacity-90
              "
            >
              <IconRefresh
                size={15}
              />
              Reset
            </button>

            {/* Duplicate */}

            <button
              onClick={
                onDuplicate
              }
              className="
                inline-flex items-center gap-2
                rounded-2xl
                border border-brand/20
                bg-brand-light
                px-4 py-2.5
                text-ds-body-sm
                font-medium
                text-brand
                transition-all
                hover:bg-brand-light/70
              "
            >
              <Copy
                size={15}
                strokeWidth={2}
              />
              Duplicate
            </button>

            {/* Delete */}

            {canDelete && (
              <button
                onClick={
                  onDelete
                }
                className="
                  inline-flex items-center gap-2
                  rounded-2xl
                  border border-error/20
                  bg-error-light
                  px-4 py-2.5
                  text-ds-body-sm
                  font-medium
                  text-error
                  transition-all
                  hover:opacity-90
                "
              >
                <IconTrash
                  size={15}
                />
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {/* BODY */}

      {expanded && (
        <div className="p-6">
          {/* GRID */}

          <div
            className="
              grid gap-5
              md:grid-cols-2
              xl:grid-cols-3
            "
          >
            {CORE_FIELDS.map(
              (field) => (
                <InputField
                  key={field.key}
                  field={field}
                  value={
                    product[
                      field.key
                    ]
                  }
                  onChange={(
                    value
                  ) =>
                    onUpdate({
                      [field.key]:
                        value,
                    })
                  }
                />
              )
            )}
          </div>

          {/* AI INSIGHTS */}

          <div
            className="
              relative overflow-hidden
              mt-8
              rounded-3xl
              border border-brand/20
              bg-gradient-to-br
              from-brand-light
              via-white
              to-white
              p-6
            "
          >
            {/* Glow */}

            <div
              className="
                absolute right-0 top-0
                h-40 w-40
                rounded-full
                bg-brand/10
                blur-3xl
              "
            />

            <div
              className="
                relative z-10
                flex flex-col gap-5
                lg:flex-row
                lg:items-center
                lg:justify-between
              "
            >
              {/* Left */}

              <div>
                <div
                  className="
                    inline-flex items-center gap-2
                    rounded-full
                    border border-brand/20
                    bg-white/80
                    px-3 py-1.5
                    text-ds-caption
                    font-semibold
                    uppercase tracking-wide
                    text-brand
                    backdrop-blur
                  "
                >
                  <Sparkles
                    size={12}
                  />

                  AI Insights
                </div>

                <h3
                  className="
                    mt-4
                    font-display
                    text-ds-h3
                    text-n-900
                  "
                >
                  Profitability
                  Prediction
                </h3>

                <p
                  className="
                    mt-2
                    max-w-2xl
                    text-ds-body-sm
                    leading-relaxed
                    text-n-600
                  "
                >
                  Opsell estimates
                  real profitability
                  using marketplace
                  commissions,
                  logistics exposure,
                  advertising costs,
                  and operational
                  deductions.
                </p>
              </div>

              {/* Right Metrics */}

              <div
                className="
                  flex flex-wrap items-center gap-3
                "
              >
                {/* ROI */}

                <div
                  className="
                    rounded-2xl
                    border border-white/60
                    bg-white/80
                    px-5 py-3
                    text-center
                    shadow-elev-1
                    backdrop-blur
                  "
                >
                  <p
                    className="
                      text-ds-caption
                      uppercase tracking-wide
                      text-n-500
                    "
                  >
                    Estimated ROI
                  </p>

                  <p
                    className="
                      mt-1
                      font-display
                      text-ds-h2
                      text-brand
                    "
                  >
                    {estimatedMargin}
                    %
                  </p>
                </div>

                {/* Health */}

                <div
                  className="
                    rounded-2xl
                    border border-white/60
                    bg-white/80
                    px-5 py-3
                    text-center
                    shadow-elev-1
                    backdrop-blur
                  "
                >
                  <div
                    className="
                      flex items-center justify-center gap-1
                    "
                  >
                    <TrendingUp
                      size={14}
                    />

                    <p
                      className="
                        text-ds-caption
                        uppercase tracking-wide
                        text-n-500
                      "
                    >
                      Margin Health
                    </p>
                  </div>

                  <p
                    className={cn(
                      `
                        mt-1
                        font-display
                        text-ds-h2
                      `,
                      marginTone
                    )}
                  >
                    {estimatedMargin >=
                    25
                      ? "Strong"
                      : estimatedMargin >=
                        10
                      ? "Average"
                      : "Weak"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* EXPORT */
/* -------------------------------------------------------------------------- */

export default ProductCard;