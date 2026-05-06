"use client";

import { useState } from "react";
import {
  Check,
  Clock,
  Bell,
  TrendingUp,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Config ──────────────────────────────────────────────────────────────────

type Plan = {
  name: string;
  description: string;
  monthly: number;
  features: string[];
  cta: string;
  popular: boolean;
};

const plans: Plan[] = [
  {
    name: "Starter",
    description: "Best for new or small stores",
    monthly: 999,
    features: [
      "Track up to 25 products",
      "Automatic price updates",
      "Competitor monitoring",
      "Basic sales insights",
      "Email support",
    ],
    cta: "Start free trial",
    popular: false,
  },
  {
    name: "Growth",
    description: "For stores ready to scale up",
    monthly: 2499,
    features: [
      "Track up to 250 products",
      "Faster automatic updates",
      "Competitor alerts",
      "Smart pricing suggestions",
      "Weekly growth reports",
      "Priority support",
    ],
    cta: "Grow my store",
    popular: true,
  },
  {
    name: "Scale",
    description: "For larger ecommerce businesses",
    monthly: 5999,
    features: [
      "Unlimited products",
      "Advanced competitor tracking",
      "Custom pricing rules",
      "Dedicated support",
      "Team access",
      "Detailed reports",
    ],
    cta: "Book a demo",
    popular: false,
  },
];

type Benefit = {
  icon: React.ElementType;
  title: string;
  desc: string;
};

const benefits: Benefit[] = [
  {
    icon: Clock,
    title: "Save hours every week",
    desc: "Stop manually checking prices and updating listings across stores.",
  },
  {
    icon: Bell,
    title: "Never miss a competitor move",
    desc: "Get notified the moment a competitor changes price or stock.",
  },
  {
    icon: TrendingUp,
    title: "Sell more, automatically",
    desc: "Smart pricing rules that nudge revenue up while you focus on growth.",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatPrice = (monthly: number, yearly: boolean) => {
  const price = yearly ? Math.round(monthly * 0.8) : monthly;
  return `₹${price.toLocaleString("en-IN")}`;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const BillingToggle = ({
  yearly,
  onToggle,
}: {
  yearly: boolean;
  onToggle: () => void;
}) => (
  <div className="mt-10 inline-flex items-center gap-3 rounded-xl border border-n-border bg-white px-4 py-2 shadow-elev-1 animate-fade-up [animation-delay:240ms]">
    <button
      onClick={() => yearly && onToggle()}
      className={cn(
        "rounded-lg px-4 py-2 font-display text-ds-body-sm font-semibold transition-colors",
        !yearly ? "bg-n-900 text-white" : "text-n-500 hover:text-n-700"
      )}
    >
      Monthly
    </button>
    <button
      onClick={() => !yearly && onToggle()}
      className={cn(
        "rounded-lg px-4 py-2 font-display text-ds-body-sm font-semibold transition-colors",
        yearly ? "bg-n-900 text-white" : "text-n-500 hover:text-n-700"
      )}
    >
      Yearly
    </button>
    <span className="rounded-md bg-success-light px-2.5 py-1 font-display text-ds-caption font-bold uppercase tracking-[0.1em] text-success">
      Save 20%
    </span>
  </div>
);

const PlanCard = ({ plan, yearly }: { plan: Plan; yearly: boolean }) => (
  <article
    className={cn(
      "group relative flex flex-col rounded-xl p-8 transition-all duration-300",
      plan.popular
        ? "bg-n-900 shadow-elev-3 md:-translate-y-4"
        : "border border-n-border bg-white shadow-elev-1 hover:shadow-elev-3 hover:-translate-y-1"
    )}
  >
    {/* Popular badge */}
    {plan.popular && (
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
        <div className="relative overflow-hidden rounded-md bg-brand px-4 py-1.5 font-display text-ds-caption font-bold uppercase tracking-[0.12em] text-white shadow-elev-2">
          <span className="relative z-10">Most popular</span>
          <span className="pointer-events-none absolute top-0 h-full w-1/3 -skew-x-12 bg-white/20 animate-pill-beam" />
        </div>
      </div>
    )}

    {/* Header */}
    <header className="flex flex-col gap-1.5">
      <h3
        className={cn(
          "font-display text-ds-h2 font-semibold",
          plan.popular ? "text-white" : "text-n-900"
        )}
      >
        {plan.name}
      </h3>
      <p
        className={cn(
          "font-body text-ds-body-sm",
          plan.popular ? "text-n-300" : "text-n-500"
        )}
      >
        {plan.description}
      </p>
    </header>

    {/* Price */}
    <div className="mt-8 flex items-end gap-1">
      <span
        className={cn(
          "font-display text-5xl font-extrabold tracking-tight",
          plan.popular ? "text-white" : "text-n-900"
        )}
      >
        {formatPrice(plan.monthly, yearly)}
      </span>
      <span
        className={cn(
          "mb-2 font-body text-ds-body-sm",
          plan.popular ? "text-n-400" : "text-n-500"
        )}
      >
        /month
      </span>
    </div>
    <p
      className={cn(
        "mt-1 font-body text-ds-caption",
        plan.popular ? "text-n-400" : "text-n-400"
      )}
    >
      {yearly ? "Billed yearly" : "Billed monthly"}
    </p>

    {/* CTA */}
    <button
      className={cn(
        "mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-lg font-display text-ds-body font-semibold transition-colors group/btn",
        plan.popular
          ? "bg-brand text-white hover:bg-brand-dark shadow-elev-2"
          : "bg-n-900 text-white hover:bg-n-800"
      )}
    >
      {plan.cta}
      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
    </button>

    {/* Features */}
    <ul className="mt-8 flex flex-col gap-3.5">
      {plan.features.map((feature) => (
        <li key={feature} className="flex items-start gap-3">
          <span
            className={cn(
              "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md",
              plan.popular ? "bg-brand-mid/30 text-brand-mid" : "bg-brand-light text-brand"
            )}
          >
            <Check className="h-3 w-3" strokeWidth={3} />
          </span>
          <span
            className={cn(
              "font-body text-ds-body-sm",
              plan.popular ? "text-n-200" : "text-n-700"
            )}
          >
            {feature}
          </span>
        </li>
      ))}
    </ul>
  </article>
);
const BenefitCard = ({ icon: Icon, title, desc }: Benefit) => (
  <div className="group relative overflow-hidden rounded-xl bg-n-900 p-7 shadow-elev-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-elev-3">
    {/* Brand glow blobs — same treatment as CTA strip */}
    <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand/20 blur-2xl" />
    <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-brand-mid/20 blur-2xl" />

    {/* Icon */}
    <div className="relative flex h-11 w-11 items-center justify-center rounded-lg bg-brand/20 text-brand-mid transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
      <Icon className="h-5 w-5" />
    </div>

    {/* Text */}
    <h3 className="relative mt-5 font-display text-ds-h3 font-semibold text-white">
      {title}
    </h3>
    <p className="relative mt-2 font-body text-ds-body-sm text-n-400">
      {desc}
    </p>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);

  return (
    <main className="min-h-screen overflow-x-hidden bg-n-50">

      {/* ── Hero ── */}
      <section className="px-4 pb-16 pt-20 text-center sm:px-6 sm:pt-24 lg:px-8">
        {/* Glow blobs */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-[600px] -translate-x-1/2 rounded-full bg-brand/10 blur-3xl" />

        <div className="relative mx-auto max-w-3xl">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-md border border-ai-border bg-ai-bg px-3 py-1.5 font-display text-ds-caption font-bold uppercase tracking-[0.12em] text-brand animate-fade-up">
            <Sparkles className="h-3.5 w-3.5" />
            Simple pricing for growing stores
          </div>

          {/* Headline */}
          <h1 className="mt-6 font-display text-4xl font-extrabold tracking-[-0.02em] text-n-900 animate-fade-up sm:text-5xl lg:text-6xl [animation-delay:80ms]">
            Pricing that grows{" "}
            <span className="text-brand">with your store.</span>
          </h1>

          {/* Subheading */}
          <p className="mx-auto mt-5 max-w-xl font-body text-ds-body leading-relaxed text-n-500 animate-fade-up [animation-delay:160ms]">
            Save hours every week. Sell more without lifting a finger. Pick a
            plan and start your free trial — no card needed.
          </p>

          {/* Toggle */}
          <div className="flex justify-center">
            <BillingToggle yearly={yearly} onToggle={() => setYearly((y) => !y)} />
          </div>
        </div>
      </section>

      {/* ── Plans ── */}
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} yearly={yearly} />
          ))}
        </div>

        {/* ── Benefits ── */}
        <div className="mx-auto mt-24 max-w-6xl">
          <div className="mb-12 text-center">
            <p className="font-display mb-3 text-ds-caption font-bold uppercase tracking-[0.12em] text-brand">
              Why teams switch
            </p>
            <div className="mx-auto mb-5 h-1 w-10 rounded-sm bg-brand" />
            <h2 className="font-display text-ds-h1 font-bold tracking-[-0.01em] text-n-900 sm:text-4xl">
              Built to give your team back its time.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {benefits.map((item) => (
              <BenefitCard key={item.title} {...item} />
            ))}
          </div>
        </div>

        {/* ── CTA strip ── */}
        <div className="mx-auto mt-24 max-w-6xl">
          <div className="relative overflow-hidden rounded-xl bg-n-900 p-10 shadow-elev-3 md:p-14">
            {/* Subtle brand glow inside strip */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-brand-mid/20 blur-3xl" />

            <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="max-w-xl">
                <h3 className="font-display text-ds-h1 font-bold text-white sm:text-3xl">
                  Try Opsell free for 14 days.
                </h3>
                <p className="mt-3 font-body text-ds-body text-n-300">
                  No credit card. Cancel anytime. Set up in under 5 minutes.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button className="flex h-12 items-center gap-2 rounded-lg bg-white px-6 font-display text-ds-body font-semibold text-n-900 shadow-elev-2 transition-colors hover:bg-n-100">
                  Start free trial
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button className="flex h-12 items-center gap-2 rounded-lg border border-n-700 px-6 font-display text-ds-body font-semibold text-white transition-colors hover:border-n-500 hover:bg-n-800">
                  Talk to sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}