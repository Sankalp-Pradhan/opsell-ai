// import React, {
//   useMemo,
//   useState,
// } from 'react';

// import { PLATFORMS } from '../data/platforms';

// import {
//   IconSparkle,
//   IconCheck,
//   IconAlert,
//   IconHelp,
// } from './Icon';

// /* -------------------------------------------------------------------------- */
// /* TYPES */
// /* -------------------------------------------------------------------------- */

// type FactorKind =
//   | 'buyers'
//   | 'returns'
//   | 'cashflow'
//   | 'ads'
//   | 'brand'
//   | 'risk';

// type PlatformKey =
//   keyof typeof PLATFORMS;

// interface Factor {
//   icon: FactorKind;
//   label: string;
//   claim: string;
//   implication: string;
// }

// interface Summary {
//   hasResults?: boolean;
//   bestPlatform?:
//     | PlatformKey
//     | '-';
//   uniquePlatformCount?: number;
// }

// interface BeyondFeesDisclaimerProps {
//   summary: Summary;
//   onOpenLead: () => void;
// }

// interface FactorIconProps {
//   kind: FactorKind;
// }

// interface ContextBanner {
//   tone: 'warning' | 'info';
//   title: string;
//   body: string;
// }

// /* -------------------------------------------------------------------------- */
// /* CONSTANTS */
// /* -------------------------------------------------------------------------- */

// const LOW_FEE_HIGH_RETURN =
//   new Set<
//     PlatformKey | 'shopsy'
//   >(['meesho', 'shopsy']);

// const FACTORS: Factor[] = [
//   {
//     icon: 'buyers',
//     label:
//       'Buyer intent & average order value',
//     claim:
//       'Amazon and Flipkart Plus buyers pay 1.5-3x more for the same SKU.',
//     implication:
//       'A lower fee % on a ₹299 Meesho sale rarely beats a 15% cut of a ₹899 Amazon sale — price elasticity matters.',
//   },
//   {
//     icon: 'returns',
//     label:
//       'Real-world return rate',
//     claim:
//       'Fashion on Meesho/Shopsy averages 25-40% returns; Amazon sits closer to 8-12%.',
//     implication:
//       'Returns double-bill you: reverse logistics + lost SKU. Model your platform-specific return rate, not a flat 5%.',
//   },
//   {
//     icon: 'cashflow',
//     label:
//       'Settlement speed & cash-flow',
//     claim:
//       'Settlement cycles range from T+7 (Amazon) to T+15 (Meesho) to T+21 (COD-heavy SKUs).',
//     implication:
//       'Slow settlements choke reorder budgets. "More profit on paper" on a 15-day cycle can starve a fast-moving catalog.',
//   },
//   {
//     icon: 'ads',
//     label:
//       'Ads, CPC and discovery',
//     claim:
//       'Amazon Ads can eat 10-18% of GMV in competitive categories; Meesho has no formal ads platform.',
//     implication:
//       "The calculator's Ads Spend field is your knob — but the realistic CPC per platform is what decides the ranking.",
//   },
//   {
//     icon: 'brand',
//     label:
//       'Brand equity & repeat customers',
//     claim:
//       'Only Amazon (Brand Registry) and Flipkart (Brand Store) give you a moat beyond price.',
//     implication:
//       'A commodity seller on Meesho competes on ₹ every day. A branded seller on Amazon compounds organic rank.',
//   },
//   {
//     icon: 'risk',
//     label:
//       'Operational risk & account health',
//     claim:
//       'Suspension rates, quality claims, SPF deductions, and GST disputes vary 3-5x by platform.',
//     implication:
//       'A single Amazon suspension or Meesho quality-deduction wave can reset a month of net profit to zero.',
//   },
// ];

// /* -------------------------------------------------------------------------- */
// /* ICON */
// /* -------------------------------------------------------------------------- */

// function FactorIcon({
//   kind,
// }: FactorIconProps) {
//   const colorMap: Record<
//     FactorKind,
//     string
//   > = {
//     buyers:
//       'var(--accent-primary)',
//     returns:
//       'var(--accent-danger)',
//     cashflow:
//       'var(--accent-warning)',
//     ads:
//       'var(--accent-secondary)',
//     brand:
//       'var(--accent-success)',
//     risk:
//       'var(--accent-danger)',
//   };

//   return (
//     <span
//       aria-hidden="true"
//       style={{
//         width: 30,
//         height: 30,
//         borderRadius: 8,
//         display: 'inline-flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         background:
//           'rgba(255,255,255,0.03)',
//         border:
//           '1px solid rgba(255,255,255,0.08)',
//         color: colorMap[kind],
//         flexShrink: 0,
//       }}
//     >
//       <IconSparkle size={14} />
//     </span>
//   );
// }

// /* -------------------------------------------------------------------------- */
// /* COMPONENT */
// /* -------------------------------------------------------------------------- */

// export default function BeyondFeesDisclaimer({
//   summary,
//   onOpenLead,
// }: BeyondFeesDisclaimerProps) {
//   const [expanded, setExpanded] =
//     useState(true);

//   const contextBanner =
//     useMemo<ContextBanner | null>(
//       () => {
//         if (
//           !summary?.hasResults ||
//           !summary.bestPlatform ||
//           summary.bestPlatform ===
//             '-'
//         ) {
//           return null;
//         }

//         if (
//           (summary.uniquePlatformCount ??
//             1) < 2
//         ) {
//           return null;
//         }

//         const bestMeta =
//           PLATFORMS[
//             summary.bestPlatform
//           ];

//         const name =
//           bestMeta?.name ??
//           summary.bestPlatform;

//         if (
//           LOW_FEE_HIGH_RETURN.has(
//             summary.bestPlatform
//           )
//         ) {
//           return {
//             tone: 'warning',
//             title: `${name} looks cheapest — but that's only half the story.`,
//             body:
//               `${name} wins on raw fees because commissions are flat and there's no ads auction. ` +
//               `On a typical fashion SKU, returns can reach 25-40%, which flips a 60% paper margin into a 15-20% real margin. ` +
//               `Weigh the factors below before concentrating volume here.`,
//           };
//         }

//         return {
//           tone: 'info',
//           title: `${name} leads on per-unit profit — here's what fees don't show.`,
//           body:
//             'The comparison above ranks platforms by net payout. In practice, returns, buyer intent, ads, settlement speed, and account risk shift the real winner. Skim the six factors below.',
//         };
//       },
//       [summary]
//     );

//   if (!contextBanner) {
//     return null;
//   }

//   const bannerStyles =
//     contextBanner.tone ===
//     'warning'
//       ? {
//           background:
//             'linear-gradient(135deg, rgba(245,158,11,0.10) 0%, rgba(245,158,11,0.02) 100%)',
//           border:
//             '1px solid rgba(245,158,11,0.28)',
//           color:
//             'var(--accent-warning)',
//         }
//       : {
//           background:
//             'linear-gradient(135deg, rgba(34,211,238,0.08) 0%, rgba(99,102,241,0.04) 100%)',
//           border:
//             '1px solid rgba(34,211,238,0.22)',
//           color:
//             'var(--accent-secondary)',
//         };

//   return (
//     <div
//       role="region"
//       aria-label="Factors beyond platform fees"
//       style={{
//         marginTop: 14,
//         marginBottom: 32,
//       }}
//     >
//       {/* Banner */}
//       <div
//         className="animate-pop"
//         style={{
//           padding: '14px 18px',
//           borderRadius: 14,
//           display: 'flex',
//           alignItems: 'flex-start',
//           gap: 12,
//           ...bannerStyles,
//         }}
//       >
//         <span
//           aria-hidden="true"
//           style={{
//             width: 30,
//             height: 30,
//             borderRadius: 8,
//             display: 'inline-flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             background:
//               'rgba(255,255,255,0.04)',
//             color:
//               bannerStyles.color,
//             flexShrink: 0,
//             marginTop: 2,
//           }}
//         >
//           <IconAlert size={15} />
//         </span>

//         <div
//           style={{
//             flex: 1,
//             minWidth: 0,
//           }}
//         >
//           <p
//             style={{
//               fontFamily: 'Sora',
//               fontWeight: 600,
//               fontSize:
//                 'var(--fs-body, 15px)',
//               color:
//                 'var(--text-primary)',
//               letterSpacing:
//                 '-0.01em',
//               marginBottom: 4,
//             }}
//           >
//             {contextBanner.title}
//           </p>

//           <p
//             style={{
//               fontFamily:
//                 'DM Sans',
//               fontSize:
//                 'var(--fs-label, 13px)',
//               color:
//                 'var(--text-secondary)',
//               lineHeight: 1.55,
//             }}
//           >
//             {contextBanner.body}
//           </p>
//         </div>
//       </div>

//       {/* Expand Toggle */}
//       <button
//         onClick={() =>
//           setExpanded(
//             (prev) => !prev
//           )
//         }
//         aria-expanded={expanded}
//         aria-controls="beyond-fees-body"
//         style={{
//           marginTop: 14,
//           display: 'flex',
//           alignItems: 'center',
//           gap: 10,
//           width: '100%',
//           padding: '10px 14px',
//           background: 'transparent',
//           border:
//             '1px solid var(--glass-border)',
//           borderRadius: 12,
//           cursor: 'pointer',
//           color:
//             'var(--text-secondary)',
//           fontFamily: 'DM Sans',
//           fontSize:
//             'var(--fs-label, 13px)',
//           fontWeight: 500,
//           justifyContent:
//             'space-between',
//         }}
//       >
//         <span
//           style={{
//             display: 'inline-flex',
//             alignItems: 'center',
//             gap: 8,
//           }}
//         >
//           <IconHelp size={14} />
//           6 factors the fee
//           comparison can’t see
//         </span>

//         <span
//           aria-hidden="true"
//           style={{
//             fontSize: 11,
//             color:
//               'var(--text-muted)',
//             fontFamily:
//               'DM Sans',
//             textTransform:
//               'uppercase',
//             letterSpacing:
//               '0.08em',
//           }}
//         >
//           {expanded
//             ? 'Hide'
//             : 'Show'}
//         </span>
//       </button>

//       {/* Factors */}
//       {expanded && (
//         <div
//           id="beyond-fees-body"
//           className="animate-in"
//           style={{
//             marginTop: 12,
//             display: 'grid',
//             gridTemplateColumns:
//               'repeat(auto-fit, minmax(280px, 1fr))',
//             gap: 10,
//           }}
//         >
//           {FACTORS.map(
//             (factor) => (
//               <article
//                 key={factor.label}
//                 style={{
//                   padding: '14px',
//                   borderRadius: 12,
//                   background:
//                     'var(--glass-bg)',
//                   border:
//                     '1px solid var(--glass-border)',
//                   display: 'flex',
//                   gap: 10,
//                   alignItems:
//                     'flex-start',
//                 }}
//               >
//                 <FactorIcon
//                   kind={
//                     factor.icon
//                   }
//                 />

//                 <div
//                   style={{
//                     flex: 1,
//                     minWidth: 0,
//                   }}
//                 >
//                   <p
//                     style={{
//                       fontFamily:
//                         'DM Sans',
//                       fontWeight: 600,
//                       fontSize:
//                         'var(--fs-label, 13px)',
//                       color:
//                         'var(--text-primary)',
//                       marginBottom: 4,
//                     }}
//                   >
//                     {factor.label}
//                   </p>

//                   <p
//                     style={{
//                       fontFamily:
//                         'DM Sans',
//                       fontSize: 12,
//                       color:
//                         'var(--text-secondary)',
//                       lineHeight: 1.5,
//                       marginBottom: 6,
//                     }}
//                   >
//                     {factor.claim}
//                   </p>

//                   <p
//                     style={{
//                       fontFamily:
//                         'DM Sans',
//                       fontSize: 12,
//                       color:
//                         'var(--text-muted)',
//                       lineHeight: 1.5,
//                       paddingTop: 6,
//                       borderTop:
//                         '1px dashed rgba(255,255,255,0.06)',
//                     }}
//                   >
//                     <span
//                       style={{
//                         color:
//                           'var(--accent-primary)',
//                         fontWeight: 600,
//                       }}
//                     >
//                       So what:{' '}
//                     </span>

//                     {
//                       factor.implication
//                     }
//                   </p>
//                 </div>
//               </article>
//             )
//           )}
//         </div>
//       )}

//       {/* CTA */}
//       <div
//         role="complementary"
//         aria-label="Model these factors with Opsell"
//         style={{
//           marginTop: 18,
//           padding: '16px 18px',
//           background:
//             'linear-gradient(135deg, rgba(99,102,241,0.10) 0%, rgba(34,211,238,0.05) 100%)',
//           border:
//             '1px solid rgba(99,102,241,0.24)',
//           borderRadius: 14,
//           display: 'flex',
//           alignItems: 'center',
//           gap: 14,
//           flexWrap: 'wrap',
//         }}
//       >
//         <span
//           aria-hidden="true"
//           style={{
//             width: 40,
//             height: 40,
//             borderRadius: 12,
//             display: 'inline-flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             background:
//               'rgba(99,102,241,0.16)',
//             color:
//               'var(--accent-primary)',
//             flexShrink: 0,
//           }}
//         >
//           <IconSparkle size={20} />
//         </span>

//         <div
//           style={{
//             flex: '1 1 280px',
//             minWidth: 0,
//           }}
//         >
//           <p
//             style={{
//               fontFamily: 'Sora',
//               fontWeight: 600,
//               fontSize:
//                 'var(--fs-body, 15px)',
//               color:
//                 'var(--text-primary)',
//               letterSpacing:
//                 '-0.01em',
//               marginBottom: 4,
//             }}
//           >
//             Want the real ranking
//             for <em>your</em>{' '}
//             catalog?
//           </p>

//           <p
//             style={{
//               fontFamily:
//                 'DM Sans',
//               fontSize:
//                 'var(--fs-label, 13px)',
//               color:
//                 'var(--text-muted)',
//               lineHeight: 1.55,
//             }}
//           >
//             Opsell pulls your
//             actual returns,
//             settlement, ads,
//             and SPF deductions
//             per SKU and ranks
//             platforms the way
//             your P&amp;L would.
//             Free catalog audit
//             for sellers doing
//             50+ orders/day.
//           </p>
//         </div>

//         <button
//           onClick={onOpenLead}
//           className="btn btn-primary"
//           style={{
//             flex: '0 0 auto',
//             minHeight: 40,
//             padding: '10px 18px',
//             fontSize:
//               'var(--fs-label, 13px)',
//           }}
//         >
//           <IconCheck size={14} />
//           {' '}Get a free catalog
//           audit
//         </button>
//       </div>
//     </div>
//   );
// }

"use client";

import { useMemo, useState } from "react";
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

type FactorKind =
  | "buyers"
  | "returns"
  | "cashflow"
  | "ads"
  | "brand"
  | "risk";

type PlatformKey = keyof typeof PLATFORMS;

interface Factor {
  icon: FactorKind;
  label: string;
  claim: string;
  implication: string;
}

interface Summary {
  hasResults?: boolean;
  bestPlatform?: PlatformKey | "-";
  uniquePlatformCount?: number;
}

interface BeyondFeesDisclaimerProps {
  summary: Summary;
  onOpenLead: () => void;
}

interface ContextBanner {
  tone: "warning" | "info";
  title: string;
  body: string;
}

/* -------------------------------------------------------------------------- */
/* CONSTANTS */
/* -------------------------------------------------------------------------- */

const LOW_FEE_HIGH_RETURN = new Set<
  PlatformKey | "shopsy"
>(["meesho", "shopsy"]);

const FACTORS: Factor[] = [
  {
    icon: "buyers",
    label: "Buyer intent & average order value",
    claim:
      "Amazon and Flipkart Plus buyers pay 1.5-3x more for the same SKU.",
    implication:
      "A lower fee % on a ₹299 Meesho sale rarely beats a 15% cut of a ₹899 Amazon sale.",
  },
  {
    icon: "returns",
    label: "Real-world return rate",
    claim:
      "Fashion on Meesho/Shopsy averages 25-40% returns.",
    implication:
      "Returns double-bill you through reverse logistics and lost inventory.",
  },
  {
    icon: "cashflow",
    label: "Settlement speed & cash-flow",
    claim:
      "Settlement cycles range from T+7 to T+21 depending on platform.",
    implication:
      "Slow settlements choke reorder budgets for fast-moving catalogs.",
  },
  {
    icon: "ads",
    label: "Ads, CPC and discovery",
    claim:
      "Amazon Ads can consume 10-18% of GMV in competitive categories.",
    implication:
      "Realistic CPC determines platform profitability.",
  },
  {
    icon: "brand",
    label: "Brand equity & repeat customers",
    claim:
      "Amazon and Flipkart provide stronger long-term brand leverage.",
    implication:
      "Branded sellers compound organic rank over time.",
  },
  {
    icon: "risk",
    label: "Operational risk & account health",
    claim:
      "Suspension rates and deductions vary heavily by platform.",
    implication:
      "Operational risk can erase monthly profit unexpectedly.",
  },
];

/* -------------------------------------------------------------------------- */
/* ICON */
/* -------------------------------------------------------------------------- */

function FactorIcon({ kind }: { kind: FactorKind }) {
  const styles: Record<FactorKind, string> = {
    buyers: "text-brand",
    returns: "text-error",
    cashflow: "text-warning",
    ads: "text-brand-mid",
    brand: "text-success",
    risk: "text-error",
  };

  return (
    <div
      className={`
        h-10 w-10 shrink-0
        rounded-lg
        border border-n-border
        bg-n-50
        flex items-center justify-center
        ${styles[kind]}
      `}
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
  const [expanded, setExpanded] = useState(true);

  const contextBanner = useMemo<ContextBanner | null>(() => {
    if (
      !summary?.hasResults ||
      !summary.bestPlatform ||
      summary.bestPlatform === "-"
    ) {
      return null;
    }

    if ((summary.uniquePlatformCount ?? 1) < 2) {
      return null;
    }

    const bestMeta = PLATFORMS[summary.bestPlatform];
    const name =
      bestMeta?.name ?? summary.bestPlatform;

    if (
      LOW_FEE_HIGH_RETURN.has(summary.bestPlatform)
    ) {
      return {
        tone: "warning",
        title: `${name} looks cheapest — but that's only half the story.`,
        body:
          `${name} wins on raw fees, but high returns can destroy actual margins.`,
      };
    }

    return {
      tone: "info",
      title: `${name} leads on per-unit profit.`,
      body:
        "Returns, buyer intent, ads, settlement speed, and operational risk still affect actual profitability.",
    };
  }, [summary]);

  if (!contextBanner) return null;

  const bannerClass =
    contextBanner.tone === "warning"
      ? "border-warning/30 bg-warning-light"
      : "border-brand/20 bg-ai-bg";

  return (
    <section className="mt-4 mb-8 space-y-4 animate-fade-up">
      {/* Banner */}
      <div
        className={`
          rounded-2xl
          border
          p-5
          shadow-elev-1
          flex gap-4
          ${bannerClass}
        `}
      >
        <div
          className={`
            h-10 w-10 shrink-0
            rounded-xl
            flex items-center justify-center
            ${
              contextBanner.tone === "warning"
                ? "bg-warning/10 text-warning"
                : "bg-brand-light text-brand"
            }
          `}
        >
          <IconAlert size={18} />
        </div>

        <div className="space-y-2">
          <h3 className="font-display text-ds-h3 text-n-900">
            {contextBanner.title}
          </h3>

          <p className="font-body text-ds-body text-n-600 leading-relaxed">
            {contextBanner.body}
          </p>
        </div>
      </div>

      {/* Toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="
          w-full
          flex items-center justify-between
          rounded-xl
          border border-n-border
          bg-white
          px-4 py-3
          text-ds-body-sm
          text-n-600
          transition-all
          hover:border-brand/30
          hover:bg-brand-light/40
        "
      >
        <div className="flex items-center gap-2 font-medium">
          <IconHelp size={15} />
          <span>
            6 factors the fee comparison can’t see
          </span>
        </div>

        <span className="text-ds-caption uppercase tracking-wide text-n-400">
          {expanded ? "Hide" : "Show"}
        </span>
      </button>

      {/* Factors */}
      {expanded && (
        <div
          className="
            grid gap-3
            md:grid-cols-2
            xl:grid-cols-3
          "
        >
          {FACTORS.map((factor) => (
            <article
              key={factor.label}
              className="
                rounded-2xl
                border border-n-border
                bg-white
                p-4
                shadow-elev-1
                transition-all
                hover:shadow-elev-2
                hover:-translate-y-[2px]
              "
            >
              <div className="flex gap-3">
                <FactorIcon kind={factor.icon} />

                <div className="space-y-2">
                  <h4 className="font-display text-ds-body font-semibold text-n-900">
                    {factor.label}
                  </h4>

                  <p className="text-ds-body-sm text-n-600 leading-relaxed">
                    {factor.claim}
                  </p>

                  <div className="border-t border-dashed border-n-200 pt-2">
                    <span className="text-brand font-semibold text-ds-body-sm">
                      So what:
                    </span>

                    <p className="mt-1 text-ds-body-sm text-n-500 leading-relaxed">
                      {factor.implication}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* CTA */}
      <div
        className="
          rounded-2xl
          border border-brand/20
          bg-gradient-to-br
          from-brand-light
          to-white
          p-5
          shadow-elev-2
          flex flex-col gap-4
          md:flex-row md:items-center md:justify-between
        "
      >
        <div className="flex gap-4">
          <div
            className="
              h-12 w-12 shrink-0
              rounded-xl
              bg-brand-light
              text-brand
              flex items-center justify-center
            "
          >
            <IconSparkle size={22} />
          </div>

          <div className="space-y-2 max-w-2xl">
            <h3 className="font-display text-ds-h3 text-n-900">
              Want the real ranking for your catalog?
            </h3>

            <p className="text-ds-body-sm text-n-600 leading-relaxed">
              Opsell models actual returns, settlement delays,
              ads, deductions, and operational costs to
              determine real profitability across platforms.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenLead}
          className="
            inline-flex items-center gap-2
            rounded-xl
            bg-brand
            px-5 py-3
            text-white
            text-ds-body-sm
            font-semibold
            shadow-elev-2
            transition-all
            hover:bg-brand-dark
            hover:shadow-elev-3
          "
        >
          <IconCheck size={15} />
          Get a free catalog audit
        </button>
      </div>
    </section>
  );
}