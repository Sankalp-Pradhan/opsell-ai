"use client";

import {
  useMemo,
  useState,
} from "react";

import { PLATFORMS } from "../data/platforms";

import {
  IconSparkle,
  IconCheck,
  IconAlert,
  IconHelp,
} from "./Icon";

/* -------------------------------------------------------------------------- */
/* TYPES */
/* -------------------------------------------------------------------------- */

type PlatformKey =
  keyof typeof PLATFORMS;

interface Summary {
  hasResults?: boolean;
  bestPlatform?: PlatformKey;
  uniquePlatformCount?: number;
}

interface BeyondFeesDisclaimerProps {
  summary: Summary;
  onOpenLead: () => void;
}

type FactorIconKind =
  | "buyers"
  | "returns"
  | "cashflow"
  | "ads"
  | "brand"
  | "risk";

interface Factor {
  icon: FactorIconKind;
  label: string;
  claim: string;
  implication: string;
}

interface ContextBanner {
  tone: "warning" | "info";
  title: string;
  body: string;
}

/* -------------------------------------------------------------------------- */
/* HELPERS */
/* -------------------------------------------------------------------------- */

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

/* -------------------------------------------------------------------------- */
/* DATA */
/* -------------------------------------------------------------------------- */

const LOW_FEE_HIGH_RETURN =
  new Set<PlatformKey>([
    "meesho",
    "shopsy",
  ]);

const FACTORS: Factor[] = [
  {
    icon: "buyers",

    label:
      "Buyer intent & average order value",

    claim:
      "Amazon and Flipkart Plus buyers typically pay 1.5–3× more for the same SKU.",

    implication:
      "A lower fee % on a ₹299 sale rarely beats a premium buyer paying ₹899 on a higher-converting platform.",
  },

  {
    icon: "returns",

    label:
      "Real-world return rate",

    claim:
      "Fashion on Meesho/Shopsy often sees 25–40% returns while Amazon averages much lower.",

    implication:
      "Returns create reverse logistics costs and margin erosion that raw fee calculators don't show.",
  },

  {
    icon: "cashflow",

    label:
      "Settlement speed & cash-flow",

    claim:
      "Settlement cycles range from T+7 to T+21 depending on COD exposure and platform policy.",

    implication:
      "Slow settlements can block inventory reorders and choke working capital.",
  },

  {
    icon: "ads",

    label:
      "Ads, CPC & discoverability",

    claim:
      "Amazon Ads can consume 10–18% of GMV in competitive categories.",

    implication:
      "Your real CPC and conversion rate determine profitability more than fee percentages alone.",
  },

  {
    icon: "brand",

    label:
      "Brand equity & repeat customers",

    claim:
      "Brand Registry and Storefront ecosystems help sellers build long-term defensibility.",

    implication:
      "Branded sellers compound organic visibility while commodity sellers compete only on price.",
  },

  {
    icon: "risk",

    label:
      "Operational risk & deductions",

    claim:
      "Suspensions, quality claims, SPF deductions, and GST disputes vary significantly by marketplace.",

    implication:
      "Operational instability can wipe out monthly profitability unexpectedly.",
  },
];

/* -------------------------------------------------------------------------- */
/* ICON */
/* -------------------------------------------------------------------------- */

function FactorIcon({
  kind,
}: {
  kind: FactorIconKind;
}) {
  const colorMap: Record<
    FactorIconKind,
    string
  > = {
    buyers:
      "bg-brand-light text-brand",

    returns:
      "bg-error-light text-error",

    cashflow:
      "bg-warning-light text-warning",

    ads: "bg-brand-light text-brand-mid",

    brand:
      "bg-success-light text-success",

    risk:
      "bg-error-light text-error",
  };

  return (
    <div
      className={cn(
        `
          flex h-10 w-10 shrink-0
          items-center justify-center
          rounded-xl
          border border-n-border
        `,
        colorMap[kind]
      )}
    >
      <IconSparkle size={16} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* COMPONENT */
/* -------------------------------------------------------------------------- */

export default function BeyondFeesDisclaimer({
  summary,
  onOpenLead,
}: BeyondFeesDisclaimerProps) {
  const [
    expanded,
    setExpanded,
  ] = useState(true);

  /* ---------------------------------------------------------------------- */
  /* CONTEXT */
  /* ---------------------------------------------------------------------- */

  const contextBanner =
    useMemo<ContextBanner | null>(
      () => {
        if (
          !summary?.hasResults ||
          summary.bestPlatform ===
            undefined
        ) {
          return null;
        }

        if (
          (summary.uniquePlatformCount ??
            1) < 2
        ) {
          return null;
        }

        const bestMeta =
          PLATFORMS[
            summary.bestPlatform
          ];

        const name =
          bestMeta?.name ??
          summary.bestPlatform;

        if (
          LOW_FEE_HIGH_RETURN.has(
            summary.bestPlatform
          )
        ) {
          return {
            tone: "warning",

            title: `${name} looks cheapest — but that's only half the story.`,

            body:
              `${name} wins on raw fee percentage, but high returns, lower AOV, and operational deductions can heavily impact actual margins.`,
          };
        }

        return {
          tone: "info",

          title: `${name} leads on per-unit profit.`,

          body:
            "Real profitability also depends on return rates, buyer intent, ads, settlement cycles, and account health.",
        };
      },
      [summary]
    );

  if (!contextBanner) {
    return null;
  }

  /* ---------------------------------------------------------------------- */
  /* STYLES */
  /* ---------------------------------------------------------------------- */

  const bannerClass =
    contextBanner.tone ===
    "warning"
      ? "border-warning/20 bg-warning-light"
      : "border-brand/20 bg-brand-light/40";

  /* ---------------------------------------------------------------------- */
  /* RENDER */
  /* ---------------------------------------------------------------------- */

  return (
    <section
      className="
        mt-5 space-y-5
      "
    >
      {/* Banner */}

      <div
        className={cn(
          `
            rounded-3xl
            border
            p-5
            shadow-elev-1
            animate-fade-up
          `,
          bannerClass
        )}
      >
        <div className="flex gap-4">
          <div
            className={cn(
              `
                flex h-11 w-11 shrink-0
                items-center justify-center
                rounded-2xl
              `,
              contextBanner.tone ===
                "warning"
                ? "bg-warning/10 text-warning"
                : "bg-brand/10 text-brand"
            )}
          >
            <IconAlert size={18} />
          </div>

          <div className="min-w-0 flex-1">
            <h3
              className="
                font-display
                text-ds-h3
                text-n-900
              "
            >
              {contextBanner.title}
            </h3>

            <p
              className="
                mt-2
                text-ds-body
                leading-relaxed
                text-n-600
              "
            >
              {contextBanner.body}
            </p>
          </div>
        </div>
      </div>

      {/* Expand Toggle */}

      <button
        onClick={() =>
          setExpanded(
            (prev) => !prev
          )
        }
        className="
          flex w-full items-center justify-between
          rounded-2xl
          border border-n-border
          bg-white
          px-5 py-4
          shadow-elev-1
          transition-all
          hover:border-brand/20
          hover:bg-brand-light/20
        "
      >
        <div className="flex items-center gap-3">
          <div
            className="
              flex h-9 w-9
              items-center justify-center
              rounded-xl
              bg-brand-light
              text-brand
            "
          >
            <IconHelp size={16} />
          </div>

          <div className="text-left">
            <p
              className="
                font-medium
                text-n-900
              "
            >
              6 factors the fee
              comparison can’t see
            </p>

            <p
              className="
                mt-0.5
                text-ds-caption
                text-n-500
              "
            >
              Beyond platform fee %
            </p>
          </div>
        </div>

        <span
          className="
            text-ds-caption
            font-semibold
            uppercase tracking-wide
            text-n-400
          "
        >
          {expanded
            ? "Hide"
            : "Show"}
        </span>
      </button>

      {/* Factors */}

      {expanded && (
        <div
          className="
            grid gap-4
            md:grid-cols-2
            xl:grid-cols-3
          "
        >
          {FACTORS.map(
            (factor) => (
              <article
                key={
                  factor.label
                }
                className="
                  rounded-3xl
                  border border-n-border
                  bg-white
                  p-5
                  shadow-elev-1
                  transition-all
                  hover:-translate-y-0.5
                  hover:shadow-elev-2
                "
              >
                <div className="flex gap-4">
                  <FactorIcon
                    kind={
                      factor.icon
                    }
                  />

                  <div className="min-w-0 flex-1">
                    <h4
                      className="
                        font-display
                        text-ds-body
                        text-n-900
                      "
                    >
                      {
                        factor.label
                      }
                    </h4>

                    <p
                      className="
                        mt-2
                        text-ds-body-sm
                        leading-relaxed
                        text-n-600
                      "
                    >
                      {
                        factor.claim
                      }
                    </p>

                    <div
                      className="
                        mt-4
                        border-t border-dashed border-n-200
                        pt-3
                      "
                    >
                      <p
                        className="
                          text-ds-body-sm
                          leading-relaxed
                          text-n-500
                        "
                      >
                        <span
                          className="
                            font-semibold
                            text-brand
                          "
                        >
                          So what:
                        </span>{" "}
                        {
                          factor.implication
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            )
          )}
        </div>
      )}

      {/* CTA */}

      <div
        className="
          relative overflow-hidden
          rounded-3xl
          border border-brand/20
          bg-gradient-to-br
          from-brand-light
          via-white
          to-white
          p-6
          shadow-elev-2
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
          <div className="flex gap-4">
            <div
              className="
                flex h-14 w-14 shrink-0
                items-center justify-center
                rounded-2xl
                bg-brand-light
                text-brand
              "
            >
              <IconSparkle size={24} />
            </div>

            <div>
              <h3
                className="
                  font-display
                  text-ds-h2
                  text-n-900
                "
              >
                Want the real
                ranking for your
                catalog?
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
                Opsell models your
                actual returns,
                ads, deductions,
                settlement delays,
                and operational
                costs to rank
                platforms based on
                true profitability.
              </p>
            </div>
          </div>

          <button
            onClick={
              onOpenLead
            }
            className="
              inline-flex items-center justify-center gap-2
              rounded-2xl
              bg-brand
              px-6 py-3
              text-ds-body-sm
              font-semibold
              text-white
              shadow-elev-2
              transition-all
              hover:bg-brand-dark
              hover:shadow-elev-3
            "
          >
            <IconCheck
              size={15}
            />
            Get a free catalog
            audit
          </button>
        </div>
      </div>
    </section>
  );
}