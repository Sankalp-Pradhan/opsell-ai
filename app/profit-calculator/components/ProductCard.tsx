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
      "Amazon and Flipkart Plus buyers often pay 1.5–3× more for the same SKU.",

    implication:
      "Higher buyer trust and AOV can outperform lower commission percentages.",
  },

  {
    icon: "returns",

    label:
      "Real-world return rate",

    claim:
      "Fashion on Meesho/Shopsy commonly experiences higher return rates.",

    implication:
      "Returns create reverse logistics costs and destroy net margins quickly.",
  },

  {
    icon: "cashflow",

    label:
      "Settlement speed & cash-flow",

    claim:
      "Settlement cycles vary dramatically across marketplaces.",

    implication:
      "Slow payouts delay inventory reorders and impact scaling speed.",
  },

  {
    icon: "ads",

    label:
      "Ads, CPC & discoverability",

    claim:
      "Competitive categories often require aggressive ad spend.",

    implication:
      "Real CPC and conversion efficiency matter more than headline fee percentages.",
  },

  {
    icon: "brand",

    label:
      "Brand equity & repeat customers",

    claim:
      "Marketplace brand tools create long-term discoverability advantages.",

    implication:
      "Strong brands compound visibility while commodity sellers compete only on price.",
  },

  {
    icon: "risk",

    label:
      "Operational risk & deductions",

    claim:
      "SPF penalties, disputes, claims, and suspensions vary significantly by platform.",

    implication:
      "Operational instability can erase profitability despite healthy margins on paper.",
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
  const styles: Record<
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
        styles[kind]
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
  /* CONTEXT BANNER */
  /* ---------------------------------------------------------------------- */

  const contextBanner =
    useMemo<ContextBanner | null>(
      () => {
        if (
          !summary?.hasResults ||
          !summary.bestPlatform
        ) {
          return null;
        }

        if (
          (summary.uniquePlatformCount ??
            1) < 2
        ) {
          return null;
        }

        const platform =
          PLATFORMS[
            summary.bestPlatform
          ];

        const name =
          platform?.name ??
          summary.bestPlatform;

        if (
          LOW_FEE_HIGH_RETURN.has(
            summary.bestPlatform
          )
        ) {
          return {
            tone: "warning",

            title: `${name} looks cheapest — but that’s only half the story.`,

            body:
              "Lower commissions don’t always mean higher profitability once return rates, AOV, and operational deductions are considered.",
          };
        }

        return {
          tone: "info",

          title: `${name} leads on per-unit profitability.`,

          body:
            "Real platform performance depends on returns, buyer quality, ads, cash-flow cycles, and operational stability.",
        };
      },
      [summary]
    );

  if (!contextBanner) {
    return null;
  }

  /* ---------------------------------------------------------------------- */
  /* BANNER STYLE */
  /* ---------------------------------------------------------------------- */

  const bannerClass =
    contextBanner.tone ===
    "warning"
      ? "border-warning/20 bg-warning-light"
      : "border-brand/20 bg-brand-light/30";

  /* ---------------------------------------------------------------------- */
  /* RENDER */
  /* ---------------------------------------------------------------------- */

  return (
    <section
      className="
        mt-6 space-y-5
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

      {/* Expand Button */}

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
              6 factors beyond
              platform fees
            </p>

            <p
              className="
                mt-0.5
                text-ds-caption
                text-n-500
              "
            >
              Hidden profitability
              drivers
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
                platform ranking?
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
                Opsell analyzes
                your real returns,
                ad spend,
                settlement delays,
                deductions, and
                operational costs
                to calculate actual
                marketplace
                profitability.
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
            Get free catalog
            audit
          </button>
        </div>
      </div>
    </section>
  );
}