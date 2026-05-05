"use client";

import { ArrowRight, Activity, Tag, Lightbulb, Zap, Check, Bell, Package, BarChart3 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

type Feature = {
  label: string;
  title: string;
  description: string;
  bullets: string[];
  Icon: LucideIcon;
  mockup: React.ReactNode;
};

const products = [
  {
    name: "Wireless Headphones",
    price: "$89.00",
    change: "−$4",
    up: false,
    img: "/assets/headphones.png",
  },
  {
    name: "Smart Watch Pro",
    price: "$149.90",
    change: "+$10",
    up: true,
    img: "/assets/smartwatch.png",
  },
  {
    name: "Bluetooth Speaker",
    price: "$39.50",
    change: "−$2",
    up: false,
    img: "/assets/speaker.png",
  },
];
const Mock1 = () => (
  <div className="space-y-3">
    {products.map((p, i) => (
      <motion.div
        key={p.name}
        initial={{ opacity: 0, x: -16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.45, delay: i * 0.12, ease: "easeOut" }}
        whileHover={{ y: -2, scale: 1.01 }}
        className="flex items-center justify-between rounded-lg bg-brand-light/50 px-4 py-3"
      >
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: [0, -6, 6, 0], scale: 1.08 }}
            transition={{ duration: 0.6 }}
            className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-background to-brand-light/60 ring-1 ring-n-border"
          >


            <Image
              src={p.img}
              alt={p.name}
              width={50}
              height={50}
              className="object-contain"
            />
          </motion.div>
          <div>
            <p className="font-display text-ds-body font-semibold text-n-900">{p.name}</p>
            <p className="font-body text-ds-caption text-n-400">3 competitors tracked</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-mono text-ds-body font-medium text-n-900">{p.price}</p>
          <p className={`font-display text-ds-caption font-bold ${p.up ? "text-n-400" : "text-brand"}`}>{p.change}</p>
        </div>
      </motion.div>
    ))}
  </div>
);

const Mock2 = () => (
  <div className="space-y-4">
    <div className="rounded-lg border border-ai-border bg-ai-bg p-5">
      <p className="font-display text-ds-caption font-bold uppercase tracking-[0.12em] text-brand">
        Recommended price
      </p>
      <p className="font-mono mt-2 text-4xl font-bold text-n-900">$32.90</p>
      <p className="font-body mt-1 text-ds-body-sm text-n-500">Estimated +14% conversions</p>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-lg bg-n-100 p-4">
        <p className="font-display text-ds-caption text-n-400">Current</p>
        <p className="font-mono mt-1 text-lg font-medium text-n-900">$29.90</p>
      </div>
      <div className="rounded-lg bg-n-100 p-4">
        <p className="font-display text-ds-caption text-n-400">Margin</p>
        <p className="font-mono mt-1 text-lg font-medium text-brand">38%</p>
      </div>
    </div>
  </div>
);

const Mock3 = () => (
  <div className="space-y-3">
    {[
      { icon: Package, title: "Bundle T-shirt + Cap", note: "Trending together" },
      { icon: Lightbulb, title: "Promote Summer Collection", note: "High demand week" },
      { icon: BarChart3, title: "Restock Sneakers Black", note: "Low inventory" },
    ].map((s) => (
      <div key={s.title} className="flex items-center gap-3 rounded-lg border border-n-border bg-background p-4 shadow-elev-1">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-light">
          <s.icon className="h-5 w-5 text-brand" />
        </div>
        <div className="flex-1">
          <p className="font-display text-ds-body font-semibold text-n-900">{s.title}</p>
          <p className="font-body text-ds-caption text-n-400">{s.note}</p>
        </div>
        <ArrowRight className="h-4 w-4 text-brand" />
      </div>
    ))}
  </div>
);

const Mock4 = () => (
  <div className="space-y-3">
    <div className="rounded-lg border border-n-border bg-background p-4 shadow-elev-1">
      <div className="mb-3 flex items-center gap-2">
        <Bell className="h-4 w-4 text-brand" />
        <p className="font-display text-ds-body font-semibold text-n-900">When competitor lowers price</p>
      </div>
      <div className="rounded-md bg-brand-light/60 p-3">
        <span className="font-body text-ds-caption text-n-500">→ Match price within 2%</span>
        <span className="ml-2 inline-flex items-center rounded-sm bg-brand px-2 py-0.5 font-display text-[11px] font-bold text-primary-foreground">
          Active
        </span>
      </div>
    </div>
    <div className="rounded-lg border border-n-border bg-background p-4 shadow-elev-1">
      <div className="mb-3 flex items-center gap-2">
        <Zap className="h-4 w-4 text-brand" />
        <p className="font-display text-ds-body font-semibold text-n-900">Weekly performance report</p>
      </div>
      <div className="rounded-md bg-brand-light/60 p-3">
        <span className="font-body text-ds-caption text-n-500">→ Sent every Monday at 9:00 AM</span>
      </div>
    </div>
  </div>
);

const features: Feature[] = [
  {
    label: "Competitor Tracking",
    title: "Track Competitors in Real Time",
    description: "See when competitors change prices, run discounts, or go out of stock — all in one place.",
    bullets: ["Live price tracking", "Competitor alerts", "Stock monitoring"],
    Icon: Activity,
    mockup: <Mock1 />,
  },
  {
    label: "Smart Pricing",
    title: "Know the Best Price to Set",
    description: "Opsell suggests the best price for your products so you can increase sales without lowering profits.",
    bullets: ["Smart price suggestions", "Protect profit margins", "Increase conversions"],
    Icon: Tag,
    mockup: <Mock2 />,
  },
  {
    label: "Growth Insights",
    title: "Get Clear Growth Suggestions",
    description: "Receive simple recommendations like what to bundle, what to promote, and what to restock.",
    bullets: ["Product recommendations", "Bundle suggestions", "Sales insights"],
    Icon: Lightbulb,
    mockup: <Mock3 />,
  },
  {
    label: "Automation",
    title: "Save Time with Automation",
    description: "Set rules once and let Opsell handle repetitive work automatically.",
    bullets: ["Automatic alerts", "Price updates", "Weekly reports"],
    Icon: Zap,
    mockup: <Mock4 />,
  },
];

const MockupShell = ({ children }: { children: React.ReactNode }) => (
  <div className="relative">
    <div className="absolute -inset-4 rounded-xl bg-brand/10 blur-2xl" />
    <div className="relative rounded-xl border border-n-border bg-n-50 p-6 shadow-elev-2 transition-transform duration-500 group-hover:-translate-y-1">
      {children}
    </div>
  </div>
);

const FeatureBlocks = () => {
  return (
    <section id="features" className="bg-background py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="font-display mb-3 text-ds-caption font-bold uppercase tracking-[0.12em] text-brand">
            Core Features
          </p>
          <div className="mx-auto mb-5 h-1 w-10 rounded-sm bg-brand" />
          <h2 className="font-display text-ds-h1 font-bold tracking-[-0.01em] text-n-900 sm:text-4xl">
            Built to make growth feel simple
          </h2>
          <p className="font-body mt-4 text-ds-body leading-relaxed text-n-500">
            Powerful tools, designed for everyday store owners.
          </p>
        </div>

        <div className="space-y-10 lg:space-y-14">
          {features.map((f, i) => {
            const reverse = i % 2 === 1;
            return (
              <motion.article
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="group grid items-center gap-8 rounded-xl border border-n-border bg-background p-5 shadow-elev-1 transition-shadow duration-300 hover:shadow-elev-3 sm:p-8 lg:grid-cols-2 lg:gap-14 lg:p-10"
              >
                <div className={reverse ? "lg:order-2" : ""}>
                  <div className="inline-flex items-center gap-2 rounded-sm bg-brand-light px-3 py-1.5 font-display text-[11px] font-bold uppercase tracking-[0.12em] text-brand">
                    <f.Icon className="h-3.5 w-3.5 shrink-0" />
                    {f.label}
                  </div>

                  <h3 className="font-display mt-4 text-ds-h1 font-bold tracking-[-0.01em] text-n-900 sm:text-3xl lg:text-4xl">
                    {f.title}
                  </h3>

                  <p className="font-body mt-3 text-ds-body leading-relaxed text-n-500">{f.description}</p>

                  <ul className="mt-6 space-y-3">
                    {f.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-brand-light">
                          <Check className="h-3.5 w-3.5 text-brand" />
                        </span>
                        <span className="font-body text-ds-body font-medium text-n-800">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={reverse ? "lg:order-1" : ""}>
                  <MockupShell>{f.mockup}</MockupShell>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeatureBlocks;
