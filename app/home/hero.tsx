"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// ─── Hero Dashboard ───────────────────────────────────────────────────────────

function HeroDashboard() {
  const navItems = [
    { label: "Dashboard", active: true },
    { label: "Listings", active: false },
    { label: "Pricing", active: false },
    { label: "Competitors", active: false },
    { label: "Experiments", active: false },
    { label: "Campaigns", active: false },
    { label: "Analytics", active: false },
  ];

  const stats = [
    { label: "GMV Recovered", val: "₹18.4L", delta: "+12.4% vs last 30d", tone: "up" },
    { label: "Avg Buy-Box Rank", val: "#2.1", delta: "−0.4 ↑", tone: "down" },
    { label: "Live SKUs", val: "214", delta: "+12 this week", tone: "up" },
    { label: "AI Actions Fired", val: "289", delta: "last 30 days", tone: "neutral" },
  ];

  const platforms: Record<string, { bg: string; img: string; name: string }> = {
    amazon: { bg: "#FF9900", img: "/assets/amazon.png", name: "Amazon" },
    flipkart: { bg: "#2874F0", img: "/assets/flipkart.png", name: "Flipkart" },
    myntra: { bg: "#FF3F6C", img: "/assets/myntra.png", name: "Myntra" },
    ajio: { bg: "#111111", img: "/assets/ajio.png", name: "Ajio" },
    shopify: { bg: "#FC2779", img: "/assets/shopify.png", name: "Shopify" },
  };

  const PlatformAvatar = ({ id, name }: { id: string; name: string }) => {
    const p = platforms[id];
    return (
      <span
        title={p.name}
        className="inline-flex items-center justify-center w-[28px] h-[28px] rounded-full border-[1.5px] border-white -mr-[5px] last:mr-0 shadow-elev-1 overflow-hidden"
        style={{ background: p.bg }}
      >
        <img src={p.img} alt={p.name} className="w-full h-full object-contain p-[2px]" />
      </span>
    );
  };

  const rows = [
    {
      name: "Vitamin C Serum 30ml",
      price: "₹649",
      status: "Optimal",
      statusStyle: "bg-success-light text-success",
      platforms: [{ id: "amazon", name: "Amazon" }, { id: "flipkart", name: "Flipkart" }],
      rank: "#1",
    },
    {
      name: "Moisturiser SPF 50",
      price: "₹429",
      status: "Review",
      statusStyle: "bg-warning-light text-warning",
      platforms: [{ id: "flipkart", name: "Flipkart" }, { id: "ajio", name: "Ajio" }],
      rank: "#4",
    },
    {
      name: "Retinol Night Cream 50ml",
      price: "₹1,939",
      status: "Critical",
      statusStyle: "bg-error-light text-error",
      platforms: [{ id: "myntra", name: "Myntra" }, { id: "shopify", name: "Shopify" }, { id: "amazon", name: "Amazon" }],
      rank: "#7",
    },
  ];

  const deltaTone: Record<string, string> = {
    up: "text-success",
    down: "text-error",
    neutral: "text-n-400 font-normal",
  };

  return (
    <div
      className="mt-14 w-full relative z-[1]"
      style={{ animation: "fadeUp 0.8s 0.32s ease both" }}
    >
      <div className="bg-white border border-n-border rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.10),0_0_0_1px_rgba(0,0,0,0.04)] overflow-hidden">

        {/* Browser bar */}
        <div className="h-10 bg-n-50 border-b border-n-border flex items-center px-4 gap-2">
          <span className="w-[10px] h-[10px] rounded-full bg-[#FF5F57] inline-block" />
          <span className="w-[10px] h-[10px] rounded-full bg-[#FEBC2E] inline-block" />
          <span className="w-[10px] h-[10px] rounded-full bg-[#28C840] inline-block" />
        </div>

        {/* Body */}
        <div className="flex min-h-0">

          {/* Sidebar — hidden below xl */}
          <div className="hidden xl:flex w-[200px] shrink-0 border-r border-n-border bg-white p-3 flex-col gap-0.5">
            <div className="flex items-center gap-1.5 px-2 mb-5">
              <span className="font-display text-base font-extrabold text-n-900 tracking-tight">
                Opsell<span className="text-brand">.</span>
              </span>
              <span className="w-2 h-2 rounded-full bg-brand animate-ai-pulse" />
            </div>
            {navItems.map((item) => (
              <div
                key={item.label}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg font-display text-[12px] transition-colors ${item.active ? "font-bold text-brand bg-brand-light" : "font-medium text-n-500"
                  }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-[3px] inline-block shrink-0"
                  style={{ background: "currentColor", opacity: item.active ? 1 : 0.25 }}
                />
                {item.label}
              </div>
            ))}
          </div>

          {/* Main */}
          <div className="flex-1 bg-n-50 p-4 sm:p-5 flex flex-col gap-3 overflow-auto min-w-0">

            {/* Header */}
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-[18px] sm:text-[20px] font-extrabold text-n-900 tracking-tight flex items-baseline gap-2 whitespace-nowrap">
                Overview
                <span className="text-xs font-medium text-n-400">· May 2026</span>
              </h2>
              <button className="font-display text-[11px] font-semibold text-brand bg-brand-light border border-ai-border rounded-full px-3 py-1.5 transition hover:bg-[#e4e1ff] whitespace-nowrap shrink-0">
                + New action
              </button>
            </div>

            {/* Stats — 2-col on mobile, 4-col on sm+ */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {stats.map((s) => (
                <div key={s.label} className="bg-white border border-n-border rounded-xl p-3">
                  <div className="font-display text-[9px] font-bold uppercase tracking-[0.08em] text-n-400 mb-1.5">
                    {s.label}
                  </div>
                  <div className="font-mono text-[20px] sm:text-[22px] font-medium text-n-900 leading-none mb-1">
                    {s.val}
                  </div>
                  <div className={`font-display text-[10px] font-semibold ${deltaTone[s.tone]}`}>
                    {s.delta}
                  </div>
                </div>
              ))}
            </div>

            {/* Table */}
            <div className="bg-white border border-n-border rounded-xl overflow-hidden">
              <div className="hidden sm:grid sm:grid-cols-[2fr_80px_100px_110px_52px] px-4 py-2 border-b border-n-100 bg-n-50">
                {["Product", "Price", "Status", "Platforms", "Rank"].map((h) => (
                  <span key={h} className="font-display text-[9px] font-bold uppercase tracking-[0.07em] text-n-400">
                    {h}
                  </span>
                ))}
              </div>

              {/* Mobile rows — simplified */}
              <div className="sm:hidden">
                {rows.map((row) => (
                  <div key={row.name} className="flex items-center px-3.5 py-3 border-b border-n-100 last:border-0 gap-2">
                    {/* Name + price */}
                    <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                      <span className="font-body text-[12px] text-n-700 font-medium truncate">{row.name}</span>
                      <span className="font-mono text-[11px] text-n-500">{row.price}</span>
                    </div>
                    {/* Platforms */}
                    <div className="flex items-center shrink-0">
                      {row.platforms.map((p) => (
                        <PlatformAvatar key={p.id} id={p.id} name={p.name} />
                      ))}
                    </div>
                    {/* Status + rank */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`inline-flex items-center px-2 py-[2px] rounded-full font-display text-[10px] font-semibold ${row.statusStyle}`}>
                        {row.status}
                      </span>
                      <span className="font-mono text-[11px] text-n-700">{row.rank}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop rows */}
              <div className="hidden sm:block">
                {rows.map((row) => (
                  <div
                    key={row.name}
                    className="grid grid-cols-[2fr_80px_100px_110px_52px] px-4 py-2.5 border-b border-n-100 items-center last:border-0 hover:bg-n-50 transition-colors"
                  >
                    <span className="font-body text-[12px] text-n-700 font-medium truncate pr-2">{row.name}</span>
                    <span className="font-mono text-[12px] text-n-900">{row.price}</span>
                    <span className={`inline-flex items-center px-2 py-[3px] rounded-full font-display text-[10px] font-semibold w-fit ${row.statusStyle}`}>
                      {row.status}
                    </span>
                    <div className="flex items-center">
                      {row.platforms.map((p) => (
                        <PlatformAvatar key={p.id} id={p.id} name={p.name} />
                      ))}
                    </div>
                    <span className="font-mono text-[12px] text-n-900">{row.rank}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Panel */}
            <div className="bg-brand-light border border-ai-border rounded-xl p-3 flex items-start sm:items-center gap-3">
              <div className="flex items-center gap-1 shrink-0 mt-0.5 sm:mt-0">
                {[0, 200, 400].map((d) => (
                  <span
                    key={d}
                    className="w-1.5 h-1.5 rounded-full bg-brand inline-block"
                    style={{ animation: `aiPulse 1.2s ease ${d}ms infinite` }}
                  />
                ))}
              </div>
              <span className="font-display text-[10px] font-bold text-brand shrink-0 whitespace-nowrap">
                AI Suggestion · Pricing
              </span>
              <span className="hidden sm:block w-px h-4 bg-ai-border shrink-0" />
              <p className="font-body text-[11px] text-n-700 leading-relaxed flex-1">
                <strong className="font-display font-bold text-n-900">Retinol Night Cream</strong> is losing
                buy-box to a competitor at ₹1,760. Drop to ₹1,849 to recover{" "}
                <span className="font-mono text-[13px] font-semibold text-success">+₹5.2L</span> over 14 days.
              </p>
              <button className="hidden sm:block shrink-0 font-display text-[12px] font-bold text-white bg-brand rounded-lg px-3.5 py-1.5 shadow-[0_4px_12px_rgba(80,70,229,0.3)] hover:bg-brand-dark transition-all hover:-translate-y-px whitespace-nowrap">
                Apply →
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Pain card visuals ────────────────────────────────────────────────────────
function ToolingVisual() {
  const tools = [
    { label: "Pricing Tool", color: "#EF4444" },
    { label: "Listings CMS", color: "#F59E0B" },
    { label: "Comp Tracker", color: "#3B82F6" },
    { label: "Sheets", color: "#16A34A" },
    { label: "Agency PDF", color: "#8B5CF6" },
    { label: "Ads Dash", color: "#EC4899" },
  ];
  return (
    <div className="relative w-full" style={{ height: 110 }}>
      <style>{`
        @keyframes toolFloat0 { 0%,100%{transform:translate(0,0) rotate(-2deg)} 50%{transform:translate(3px,-5px) rotate(1deg)} }
        @keyframes toolFloat1 { 0%,100%{transform:translate(0,0) rotate(1deg)} 50%{transform:translate(-4px,-3px) rotate(-2deg)} }
        @keyframes toolFloat2 { 0%,100%{transform:translate(0,0) rotate(-1deg)} 50%{transform:translate(2px,-6px) rotate(2deg)} }
        @keyframes toolFloat3 { 0%,100%{transform:translate(0,0) rotate(2deg)} 50%{transform:translate(-3px,-4px) rotate(-1deg)} }
        @keyframes toolFloat4 { 0%,100%{transform:translate(0,0) rotate(-2deg)} 50%{transform:translate(4px,-3px) rotate(1deg)} }
        @keyframes toolFloat5 { 0%,100%{transform:translate(0,0) rotate(1deg)} 50%{transform:translate(-2px,-5px) rotate(-2deg)} }
        @keyframes connPulse { 0%,100%{opacity:0.15} 50%{opacity:0.45} }
      `}</style>

      {/* Connecting lines between tools */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
        {[
          [16, 20, 50, 20], [50, 20, 83, 20],
          [16, 20, 33, 75], [50, 20, 50, 75],
          [83, 20, 66, 75], [33, 75, 66, 75],
        ].map(([x1, y1, x2, y2], i) => (
          <line
            key={i}
            x1={`${x1}%`} y1={`${y1}%`}
            x2={`${x2}%`} y2={`${y2}%`}
            stroke="#5046E5" strokeWidth="1"
            strokeDasharray="3 3"
            style={{ animation: `connPulse 2s ease ${i * 0.3}s infinite` }}
          />
        ))}
      </svg>

      {/* Tool nodes in two rows */}
      {tools.map((t, i) => {
        const row = i < 3 ? 0 : 1;
        const col = i % 3;
        const left = `${col * 33 + 8}%`;
        const top = row === 0 ? "4px" : "58px";
        return (
          <div
            key={t.label}
            className="absolute flex items-center gap-1.5 rounded-lg border bg-white px-2 py-1.5 shadow-elev-1"
            style={{
              left, top, zIndex: 1,
              borderColor: `${t.color}40`,
              animation: `toolFloat${i} ${2.2 + i * 0.15}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: t.color }} />
            <span className="font-mono text-[8px] uppercase tracking-[0.04em] text-n-500 whitespace-nowrap">
              {t.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function ManualVisual() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => (t + 1) % 4), 900);
    return () => clearInterval(id);
  }, []);
  const dots = ".".repeat(tick + 1);

  return (
    <div className="flex w-full flex-col gap-3">
      <style>{`
        @keyframes strikeThrough { from{width:0} to{width:100%} }
        @keyframes priceSlide { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes lateShake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-2px)} 40%{transform:translateX(2px)} 60%{transform:translateX(-1px)} 80%{transform:translateX(1px)} }
      `}</style>

      {/* Price change row */}
      <div className="flex items-center gap-3">
        {/* Old price with animated strikethrough */}
        <div className="relative">
          <span className="font-mono text-lg text-n-400">₹999</span>
          <span
            className="absolute top-1/2 left-0 h-[2px] bg-n-400"
            style={{ animation: "strikeThrough 0.6s 0.3s ease forwards", width: 0 }}
          />
        </div>

        <span className="text-n-300">→</span>

        {/* New price */}
        <span
          className="relative font-mono text-lg font-bold text-error rounded-lg border-[1.5px] border-error bg-error-light px-3 py-1"
          style={{ animation: "priceSlide 0.5s 0.9s ease both" }}
        >
          ₹849
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-error animate-ai-pulse" />
        </span>
      </div>

      {/* Status row */}
      <div
        className="flex items-center gap-2 rounded-lg border border-error/20 bg-error-light/50 px-3 py-2"
        style={{ animation: "lateShake 0.6s 1.5s ease" }}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-error animate-ai-pulse shrink-0" />
        <span className="font-display text-[11px] font-semibold text-error">Competitor reacted 2 days ago{dots}</span>
      </div>
    </div>
  );
}

function SlowVisual() {
  const [winner, setWinner] = useState(1); // competitor F starts winning
  useEffect(() => {
    const id = setTimeout(() => setWinner(1), 100);
    return () => clearTimeout(id);
  }, []);

  const items = [
    { platform: "You", name: "₹999", sub: "your price", isYou: true },
    { platform: "Comp F", name: "₹899", sub: "−₹100", isYou: false },
    { platform: "Comp M", name: "₹1,049", sub: "+₹50", isYou: false },
  ];

  return (
    <div className="flex w-full flex-col gap-2">
      <style>{`
        @keyframes winnerGlow {
          0%,100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.3); }
          50%      { box-shadow: 0 0 0 6px rgba(239,68,68,0); }
        }
        @keyframes buyBoxIn {
          from { opacity:0; transform:scale(0.8); }
          to   { opacity:1; transform:scale(1); }
        }
      `}</style>
      {items.map((item, i) => {
        const isWinner = i === winner;
        return (
          <div
            key={item.platform}
            className="relative flex items-center justify-between rounded-xl border px-3 py-2.5 transition-all duration-500"
            style={{
              borderColor: isWinner ? "#EF4444" : item.isYou ? "#5046E5" : "#E2E4E8",
              background: isWinner ? "#FEF2F2" : item.isYou ? "#F0EFFF" : "#fff",
              animation: isWinner ? "winnerGlow 1.5s ease infinite" : "none",
            }}
          >
            <div className="flex items-center gap-2">
              <span
                className="flex h-6 w-6 items-center justify-center rounded-md font-mono text-[9px] font-bold"
                style={{
                  background: isWinner ? "#EF4444" : item.isYou ? "#5046E5" : "#F0F1F3",
                  color: isWinner || item.isYou ? "#fff" : "#6B707A",
                }}
              >
                {item.platform.slice(0, 1)}
              </span>
              <div>
                <p className="font-display text-[11px] font-semibold text-n-700">{item.platform}</p>
                <p className="font-mono text-[9px] text-n-400">{item.sub}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[14px] font-bold" style={{ color: isWinner ? "#EF4444" : item.isYou ? "#5046E5" : "#0F1114" }}>
                {item.name}
              </span>
              {isWinner && (
                <span
                  className="rounded-md bg-error px-1.5 py-0.5 font-display text-[8px] font-bold uppercase tracking-wide text-white"
                  style={{ animation: "buyBoxIn 0.4s ease both" }}
                >
                  Buy Box
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
function ListingsVisual() {
  const [scanned, setScanned] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setScanned(true), 600);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="flex w-full gap-2">
      <style>{`
        @keyframes scanLine {
          0%   { top: 0%; opacity: 1; }
          90%  { top: 100%; opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes tagIn {
          from { opacity:0; transform:translateY(4px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>

      {/* BEFORE */}
      <div className="relative flex flex-1 flex-col gap-1.5 overflow-hidden rounded-xl border border-n-border bg-n-50 p-2">
        <div className="relative h-12 w-full overflow-hidden rounded-md bg-[#0e1020]">
          {/* Shoe image — grayscale + blurred like ConversionCard's "before" */}
          <Image
            src="/assets/shoe.png"
            alt="Unoptimized sneaker listing"
            width={160} height={48}
            className="absolute inset-0 h-full w-full object-contain p-1 scale-105 grayscale blur-[2px] opacity-40"
          />

          
          {/* scan line */}
          <div
            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand to-transparent"
            style={{ animation: "scanLine 1.2s ease-out 0.2s both" }}
          />
        </div>
        <p className="font-body text-[8px] leading-[1.3] text-n-400">men's sneakers white black</p>
        <div className="flex items-center gap-1">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-n-200">
            <div
              className="h-full rounded-full bg-warning"
              style={{
                width: scanned ? "42%" : "0%",
                transition: "width 0.8s 1.4s ease",
              }}
            />
          </div>
          <span className="font-mono text-[8px] text-warning font-semibold" style={{ opacity: scanned ? 1 : 0, transition: "opacity 0.4s 2.2s" }}>42</span>
        </div>
        <span
          className="inline-flex items-center gap-1 rounded-md bg-error-light px-1.5 py-0.5 font-display text-[8px] font-semibold text-error"
          style={{ opacity: scanned ? 1 : 0, transition: "opacity 0.4s 2.4s" }}
        >
          Weak
        </span>
      </div>

      {/* Arrow */}
      <div className="flex items-center self-center">
        <div
          className="flex h-6 w-6 items-center justify-center rounded-full bg-brand"
          style={{ opacity: scanned ? 1 : 0, transition: "opacity 0.3s 2.6s" }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5h6M6 3l2 2-2 2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* AFTER */}
      <div className="relative flex flex-1 flex-col gap-1.5 overflow-hidden rounded-xl border bg-white p-2" style={{ borderColor: "#C7C4FF", boxShadow: "0 0 0 3px #F0EFFF" }}>
        <div className="relative h-12 w-full overflow-hidden rounded-md bg-gradient-to-br from-brand/15 via-[#0b0d1e] to-[#0b0d1e]">
          {/* Shoe image — clean like ConversionCard's "after" */}
          <Image
            src="/assets/shoe.png"
            alt="Optimized sneaker listing"
            width={160} height={48}
            className="absolute inset-0 h-full w-full object-contain p-1"
          />
          {/* Subtle glow orb, matching ConversionCard */}
          <div className="absolute -right-3 -top-3 h-10 w-10 rounded-full bg-brand/20 blur-xl" />
        </div>
        <p className="font-display text-[8px] font-semibold leading-[1.3] text-n-800">Redtape Men's Low-Top Court Sneakers</p>
        <div className="flex items-center gap-1">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-n-200">
            <div
              className="h-full rounded-full bg-brand"
              style={{
                width: scanned ? "94%" : "0%",
                transition: "width 0.8s 2.8s ease",
              }}
            />
          </div>
          <span className="font-mono text-[8px] text-brand font-semibold" style={{ opacity: scanned ? 1 : 0, transition: "opacity 0.4s 3.6s" }}>94</span>
        </div>
        <span
          className="inline-flex items-center gap-1 rounded-md bg-brand-light px-1.5 py-0.5 font-display text-[8px] font-semibold text-brand"
          style={{ opacity: scanned ? 1 : 0, transition: "opacity 0.4s 3.8s" }}
        >
          Optimised
        </span>
      </div>
    </div>
  );
}

// ─── Shared PainCard shell ────────────────────────────────────────────────────
function PainCard({
  index, title, heading, body, metric, children,
}: {
  index: string; title: string; heading: string; body: string; metric: string; children: React.ReactNode;
}) {
  return (
    <div className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-n-border bg-white p-6 sm:p-7 shadow-elev-1 transition-all duration-300 hover:-translate-y-0.5 hover:border-n-300 hover:shadow-elev-3 h-full">
      <span className="pointer-events-none absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-brand via-brand-mid to-brand transition-transform duration-500 group-hover:scale-x-100" />
      <span className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-light opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-70" />
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] tracking-[0.04em] text-n-400">
          {index} <span className="text-n-300 mx-1.5">/</span> {title}
        </p>
        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-n-300 transition-colors duration-300 group-hover:text-brand">Issue</span>
      </div>
      <h3 className="font-display text-[17px] sm:text-[18px] font-bold leading-[1.25] tracking-[-0.02em] text-n-900">{heading}</h3>
      <p className="font-body text-[13px] leading-[1.6] text-n-500">{body}</p>
      <div className="relative my-1 flex flex-1 items-center justify-center overflow-hidden rounded-[12px] border border-n-border bg-gradient-to-b from-n-50 to-white p-4 min-h-[110px]">
        <span className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,#0F1114_1px,transparent_1px),linear-gradient(to_bottom,#0F1114_1px,transparent_1px)] [background-size:14px_14px]" />
        <div className="relative w-full">{children}</div>
      </div>
      <div className="mt-1 flex items-center gap-2">
        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-error animate-ai-pulse" />
        <p className="font-display text-[12px] font-semibold text-error">{metric}</p>
      </div>
    </div>
  );
}

// ─── Pain cards data ──────────────────────────────────────────────────────────
const PAIN_CARDS = [
  {
    index: "01", title: "Tooling sprawl",
    heading: "Your team works across six different tools.",
    body: "Pricing is in one dashboard, listings in another, competitor tracking in spreadsheets, and performance in agency reports.",
    metric: "−12 hrs / week reconciling. 0 hrs winning",
    Visual: ToolingVisual,
  },
  {
    index: "02", title: "Manual decisions",
    heading: "Pricing decisions still happen on gut feel.",
    body: "Your team changes prices based on guesswork or stale competitor checks — not real-time signal.",
    metric: "−12% sales impact per cycle",
    Visual: ManualVisual,
  },
  {
    index: "03", title: "Slow reactions",
    heading: "Competitors change faster than you can react.",
    body: "By the time you notice a price drop or a new bundle, you've already lost the buy-box for that day.",
    metric: "Buy-box lost in <6 hours",
    Visual: SlowVisual,
  },
  {
    index: "04", title: "Inconsistent listings",
    heading: "Your product listings are different everywhere.",
    body: "Titles, images, prices, descriptions drift across marketplaces — eroding trust and conversion.",
    metric: "Up to −18% conversion",
    Visual: ListingsVisual,
  },
];

// ─── Pain Section ─────────────────────────────────────────────────────────────
export function PainSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const total = PAIN_CARDS.length;

  const goTo = (i: number) => { setActiveIndex(Math.max(0, Math.min(i, total - 1))); setDragOffset(0); };
  const prev = () => goTo(activeIndex - 1);
  const next = () => goTo(activeIndex + 1);

  const onDragStart = (x: number) => { setIsDragging(true); setDragStartX(x); };
  const onDragMove = (x: number) => { if (!isDragging) return; setDragOffset(x - dragStartX); };
  const onDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset < -60) next();
    else if (dragOffset > 60) prev();
    setDragOffset(0);
  };

  const translateX = `calc(${-activeIndex * 100}% + ${dragOffset}px)`;

  return (
    <section className="-mx-6 sm:-mx-12 md:-mx-16 lg:-mx-24 bg-white px-6 py-20 sm:px-12 md:px-16 lg:px-24 sm:py-24">
      {/* Header */}
      <div className="mb-10 sm:mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="mb-4 font-display text-[11px] font-bold uppercase tracking-[0.1em] text-brand">
            Where Revenue Leaks
          </p>
          <h2 className="font-display text-[clamp(28px,3.5vw,44px)] font-extrabold leading-[1.08] tracking-[-0.03em] text-n-900">
            The hidden reasons<br />brands lose <span className="text-brand">sales</span>.
          </h2>
        </div>
        <p className="font-body text-[15px] leading-[1.7] text-n-500 lg:pt-10">
          Most consumer brands don't lose revenue to bad products — they lose it to
          slow reactions, broken catalog hygiene, and execution gaps no dashboard can close.
        </p>
      </div>

      {/* ── Mobile: drag carousel (< md) ── */}
      <div className="md:hidden">
        <div className="overflow-hidden rounded-2xl" style={{ touchAction: "pan-y" }}>
          <div
            className="flex"
            style={{
              transform: `translateX(${translateX})`,
              transition: isDragging ? "none" : "transform 0.38s cubic-bezier(0.25, 1, 0.5, 1)",
              willChange: "transform",
            }}
            onMouseDown={(e) => onDragStart(e.clientX)}
            onMouseMove={(e) => onDragMove(e.clientX)}
            onMouseUp={onDragEnd}
            onMouseLeave={onDragEnd}
            onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
            onTouchMove={(e) => { e.preventDefault(); onDragMove(e.touches[0].clientX); }}
            onTouchEnd={onDragEnd}
          >
            {PAIN_CARDS.map(({ index, title, heading, body, metric, Visual }) => (
              <div key={index} className="w-full shrink-0 px-0.5" style={{ userSelect: "none" }}>
                <PainCard index={index} title={title} heading={heading} body={body} metric={metric}>
                  <Visual />
                </PainCard>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="mt-5 flex items-center justify-between px-1">
          <button
            onClick={prev}
            disabled={activeIndex === 0}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-n-200 bg-white text-n-400 transition-all hover:border-brand/40 hover:text-brand disabled:opacity-25 disabled:cursor-not-allowed"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            {PAIN_CARDS.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="transition-all duration-300 rounded-full"
                style={{
                  width: i === activeIndex ? 20 : 6,
                  height: 6,
                  background: i === activeIndex ? "#5046E5" : "#D1D4D9",
                }}
              />
            ))}
          </div>
          <button
            onClick={next}
            disabled={activeIndex === total - 1}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-n-200 bg-white text-n-400 transition-all hover:border-brand/40 hover:text-brand disabled:opacity-25 disabled:cursor-not-allowed"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <p className="mt-2 text-center font-body text-xs text-n-300">{activeIndex + 1} / {total}</p>
      </div>

      {/* ── Desktop: 2×2 grid (md+) ── */}
      <div className="hidden md:grid grid-cols-2 gap-5">
        {PAIN_CARDS.map(({ index, title, heading, body, metric, Visual }) => (
          <PainCard key={index} index={index} title={title} heading={heading} body={body} metric={metric}>
            <Visual />
          </PainCard>
        ))}
      </div>
    </section>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-white px-6 pb-20 pt-24 sm:px-12 md:px-16 lg:px-24 sm:pt-[120px]">

      {/* Grid BG */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(80,70,229,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(80,70,229,0.04) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage:
              "radial-gradient(ellipse 70% 50% at 30% 20%, black 20%, transparent 100%)",
          }}
        />
      </div>

      {/* Content — capped width, left-aligned */}
      <div className="relative z-10 max-w-[860px]">

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-[7px] rounded-full border border-[#E2E4E8] bg-white/90 backdrop-blur-sm shadow-[0_1px_3px_rgba(0,0,0,0.06)] font-display text-[13px] font-semibold text-[#4A4F57] mb-6 relative overflow-hidden z-[1]"
          style={{ animation: "fadeUp 0.6s ease both" }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full bg-[#5046E5] inline-block"
            style={{ animation: "aiPulse 1.5s ease infinite" }}
          />
          Your AI growth agent
          <div
            className="absolute top-0 -left-full w-3/5 h-full bg-[linear-gradient(90deg,transparent,rgba(80,70,229,0.15),transparent)]"
            style={{ animation: "pillBeam 3s ease infinite" }}
          />
        </div>

        {/* Headline */}
        <h1
          className="mb-6 font-display text-[clamp(36px,6vw,76px)] font-extrabold leading-[1.03] tracking-[-0.04em] text-n-900"
          style={{ animation: "fadeUp 0.55s 0.08s ease both" }}
        >
          Recover lost revenue
          <br />
          <span className="text-brand">across every</span>
          <br />
          marketplace.
        </h1>

        {/* Subtext */}
        <p
          className="mb-10 max-w-[520px] font-body text-[15px] sm:text-[16px] leading-[1.65] text-n-500"
          style={{ animation: "fadeUp 0.55s 0.14s ease both" }}
        >
          Opsell is the AI-led execution layer for consumer brands. We don't
          just recommend actions — we write listings, move prices, fire
          campaigns, and run experiments via API. Less reaction. More revenue.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
          style={{ animation: "fadeUp 0.55s 0.21s ease both" }}
        >
          <Link
            href="https://forms.gle/8oyErGWjoFwyHBub7"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-[10px] bg-brand px-7 py-3 font-display text-[15px] font-bold text-white shadow-[0_8px_24px_rgba(80,70,229,0.32)] transition-all hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-[0_12px_32px_rgba(80,70,229,0.42)] inline-flex items-center justify-center"
          >
            Start growing your revenue
          </Link>
          <Link
            href="https://opsell.neetocal.com/meeting-with-shaurya-gupta"
            target="_blank"
            rel="noopener noreferrer"
           className="rounded-[10px] text-center border-[1.5px] border-n-200 bg-white px-6 py-3 font-display text-[15px] font-semibold text-n-700 transition-colors hover:border-n-400 hover:text-n-900">
            See it execute →
          </Link>
        </div>

      </div>

      <HeroDashboard />
      <PainSection />
    </section>
  );
}