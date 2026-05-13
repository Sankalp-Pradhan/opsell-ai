"use client";

import { useState, useMemo, useEffect, useCallback } from 'react';
import type { ReactElement } from 'react';
import { useProducts } from './hooks/useProducts';
import { useCalculations } from './hooks/useCalculations';
import CalculatorForm from './components/CalculatorForm';
import SummaryStrip from './components/SummaryStrip';
import ComparisonTable from './components/ComparisonTable';
import BeyondFeesDisclaimer from './components/BeyondFeesDisclaimer';
import FeeBreakdownCard from './components/FeeBreakdownCard';
import Dashboard from './components/Dashboard';
import PlatformSEOBlock from './components/PlatformSEOBlock';
import { PLATFORMS } from './data/platforms';
import {
  IconBrand, IconRefresh, IconPlus, IconTrash, IconMail, IconLink, IconCheck,
  IconSparkle, IconArrowDown, IconClose,
} from './components/Icon';
import HeroSection from './components/hero';
import ResetButton from './components/ResetButton';

declare const __BUILD_DATE__: string | undefined;

// ─────────────────────────────────────────────
// Root App
// ─────────────────────────────────────────────
function App(): ReactElement {
  const {
    products, addProduct, deleteProduct, updateProduct,
    updateGlobalSetting, globalSettings, resetAll,
    clearSampleProduct, loadSampleProduct,
  } = useProducts();

  // AI upsell dismissal (persisted so we never nag twice)
  const [aiTeaserDismissed, setAiTeaserDismissed] = useState<boolean>(() => {
    try { return localStorage.getItem('opsell-ai-teaser-dismissed') === '1'; }
    catch { return false; }
  });

  const dismissAiTeaser = useCallback((): void => {
    setAiTeaserDismissed(true);
    try { localStorage.setItem('opsell-ai-teaser-dismissed', '1'); } catch { }
  }, []);

  const [activeProductId, setActiveProductId] = useState<number | undefined>(products[0]?.id);
  const activeProduct = products.find(p => p.id === activeProductId) ?? products[0];

  useEffect(() => {
    if (!products.find(p => p.id === activeProductId)) {
      setActiveProductId(products[0]?.id);
    }
  }, [products, activeProductId]);

  const { results, summary } = useCalculations(products, globalSettings);
  const [scrolled, setScrolled] = useState<boolean>(false);

  const [renamingId, setRenamingId] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState<string>('');

  const startRename = useCallback((id: number, currentName: string): void => {
    setRenamingId(id);
    setRenameValue(currentName);
  }, []);

  const commitRename = useCallback((): void => {
    if (renamingId === null) return;
    const trimmed = renameValue.trim();
    if (trimmed) updateProduct(renamingId, { name: trimmed } as Parameters<typeof updateProduct>[1]);
    setRenamingId(null);
  }, [renamingId, renameValue, updateProduct]);

  const [email, setEmail] = useState<string>('');
  const [emailStatus, setEmailStatus] = useState<null | 'ok' | 'bad'>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const shareUrl = useMemo<string>(() => {
    if (!activeProduct) return '';
    const params = new URLSearchParams({
      sp: String(activeProduct.sellingPrice ?? ''),
      cogs: String(activeProduct.cogs ?? ''),
      ms: (activeProduct.selectedPlatforms || []).join(','),
    });
    const base = typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}`
      : 'https://opsell.in/commcalc';
    return `${base}?${params.toString()}`;
  }, [activeProduct]);

  const handleEmailSubmit = useCallback((): void => {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!ok) { setEmailStatus('bad'); return; }
    try {
      const leads: Array<{ email: string; at: number; shareUrl: string }> =
        JSON.parse(localStorage.getItem('opsell-leads') || '[]');
      leads.push({ email: email.trim(), at: Date.now(), shareUrl });
      localStorage.setItem('opsell-leads', JSON.stringify(leads));
    } catch { }
    setEmailStatus('ok');
  }, [email, shareUrl]);

  const handleCopy = useCallback((): void => {
    navigator.clipboard?.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [shareUrl]);

  useEffect(() => {
    const handler = (): void => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const groupedResults = useMemo(() => {
    const map: Record<string, { name: string; results: typeof results }> = {};
    for (const r of results) {
      const key = String(r.productId ?? '');
      if (!map[key]) map[key] = { name: r.productName ?? '', results: [] };
      map[key].results.push(r);
    }
    return Object.values(map);
  }, [results]);

  const handleAddProduct = useCallback((): void => {
    addProduct();
    setTimeout(() => {
      document.getElementById('calculator-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, [addProduct]);

  useEffect(() => {
    if (products.length > 1) setActiveProductId(products[products.length - 1].id);
  }, [products.length]);

  useEffect(() => {
    setConfirmDeleteId(null);
  }, [activeProductId]);

  const isMultiProduct = products.length > 1;

  return (
    // ── Page shell ──
    <div className="min-h-screen bg-n-50 relative overflow-x-hidden font-body text-n-900">

      {/* ── Skip link ── */}
      <a
        href="#calculator-form"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50
                   focus:px-3 focus:py-2 focus:rounded-md focus:bg-brand focus:text-white focus:text-ds-body-sm"
      >
        Skip to calculator
      </a>

      {/* ── Hero Band ── */}
      <HeroSection />

      {/* ── Main Content ── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pb-20 relative z-10">

        {/* ── Product Tab Rail ── */}
        <div className="mb-5 animate-fade-up">
          <div
            role="tablist"
            aria-label="Products"
            className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-1 px-1"
          >
            {products.map(p => {
              const active = activeProduct?.id === p.id;
              const isRenaming = renamingId === p.id;

              return (
                <div key={p.id} className="relative flex-shrink-0">
                  {isRenaming ? (
                    // ── Inline rename input ──
                    <input
                      autoFocus
                      type="text"
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onBlur={commitRename}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') commitRename();
                        if (e.key === 'Escape') setRenamingId(null);
                      }}
                      className="px-3 py-2 rounded-lg min-h-[36px] max-w-[160px]
                         border-2 border-brand bg-white text-n-900
                         font-display font-medium text-ds-body-sm
                         focus:outline-none focus:ring-2 focus:ring-brand/30"
                      aria-label="Rename product"
                    />
                  ) : (
                    <button
                      role="tab"
                      aria-selected={active}
                      onClick={() => {
                        if (active) {
                          // clicking active tab triggers rename
                          startRename(p.id, p.name);
                        } else {
                          setActiveProductId(p.id);
                        }
                      }}
                      title={active ? 'Click to rename' : p.name}
                      className={`px-3 sm:px-4 py-2 rounded-lg min-h-[36px] text-ds-body-sm
                          font-display font-medium transition-all duration-200 truncate
                          max-w-[130px] sm:max-w-[180px]
                          ${active
                          ? 'bg-brand text-white shadow-elev-1 cursor-text'
                          : 'bg-white border border-n-border text-n-600 hover:border-n-200'
                        }`}
                    >
                      {p.name}
                      {active && (
                        <span className="ml-1.5 opacity-60 text-[10px] font-body normal-case tracking-normal">
                          ✎
                        </span>
                      )}
                    </button>
                  )}
                </div>
              );
            })}

            {/* ── +New always visible ── */}
            {products.length < 10 && (
              <button
                onClick={handleAddProduct}
                aria-label="Add another product"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg flex-shrink-0
                   min-h-[36px] bg-ai-bg border border-dashed border-ai-border
                   text-brand font-display font-semibold text-ds-body-sm
                   hover:bg-brand-light transition-colors duration-150"
              >
                <IconPlus size={14} /> New
              </button>
            )}

            {/* ── Remove active tab (only when >1 product) ── */}
            {products.length > 1 && activeProduct && (
              <div className="relative flex-shrink-0">
                {confirmDeleteId === activeProduct.id ? (
                  // ── Inline confirm popup ──
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                      bg-error-light border border-error/30 shadow-elev-1">
                    <span className="font-display font-semibold text-ds-caption text-error whitespace-nowrap">
                      Remove?
                    </span>
                    <button
                      onClick={() => {
                        deleteProduct(activeProduct.id);
                        setConfirmDeleteId(null);
                      }}
                      className="px-2 py-0.5 rounded-md bg-error text-white
                     font-display font-semibold text-ds-caption
                     hover:bg-red-700 transition-colors"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-2 py-0.5 rounded-md bg-white border border-n-border
                     text-n-600 font-display font-semibold text-ds-caption
                     hover:bg-n-50 transition-colors"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteId(activeProduct.id)}
                    aria-label={`Remove ${activeProduct.name}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg flex-shrink-0
                   min-h-[36px] bg-error-light border border-error/20
                   text-error font-display font-semibold text-ds-caption
                   hover:bg-red-100 transition-colors duration-150"
                  >
                    <IconTrash size={13} /> Remove
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Calculator Form Card ── */}
        {activeProduct && (
          <div
            id="calculator-form"
            className="bg-white border border-n-border border-l-4 border-l-brand
                       rounded-2xl p-4 sm:p-6 mb-8 shadow-elev-1 animate-fade-up"
          >
            {/* Card header */}
            <div className="flex items-start justify-between flex-wrap gap-2.5 mb-5">
              <div>
                <p className="font-display font-bold text-ds-caption uppercase tracking-widest
                               text-brand mb-1">
                  Step 1 · Your product
                </p>
                <h2 className="font-display font-semibold text-ds-h2 text-n-900 tracking-tight">
                  Enter your numbers
                </h2>
              </div>

              {/* ── Right-side header actions ── */}
              <div className="flex items-center gap-2 flex-wrap">
                {activeProduct.isSample ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                                    bg-warning-light border border-warning/25
                                    text-warning font-display font-semibold text-ds-caption
                                    tracking-wide">
                    <IconSparkle size={11} /> Sample: Cotton T-shirt
                    <button
                      onClick={() => clearSampleProduct(activeProduct.id)}
                      aria-label="Clear sample data"
                      className="ml-1 text-warning font-bold underline underline-offset-2
                                 bg-transparent border-0 cursor-pointer font-display text-ds-caption"
                    >
                      clear
                    </button>
                  </span>
                ) : (
                  <button
                    onClick={() => loadSampleProduct(activeProduct.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                               bg-n-50 border border-n-border text-n-600 font-display
                               font-semibold text-ds-caption hover:bg-n-100 transition-colors"
                    aria-label="Load sample product"
                  >
                    <IconSparkle size={12} /> Load sample
                  </button>
                )}

                {/* ── Reset All button ── */}
                <ResetButton onClick={resetAll} />
              </div>
            </div>

            <CalculatorForm
              key={activeProduct.id}
              product={activeProduct as unknown as Parameters<typeof CalculatorForm>[0]['product']}
              onUpdate={(updates) => updateProduct(activeProduct.id, updates as Parameters<typeof updateProduct>[1])}
              globalSettings={globalSettings}
              onUpdateSetting={updateGlobalSetting as (id: string, setting: Partial<Record<string, unknown>>) => void}
            />
          </div>
        )}

        {/* ── Results ── */}
        {results.length > 0 ? (
          <div className="animate-fade-up">

            {/* Top result callout */}
            {(() => {
              if (!summary?.hasResults || summary.bestPlatform === '-') return null;
              const bestResult = results
                .filter(r => r.platform === summary.bestPlatform)
                .sort((a, b) => b.netProfit - a.netProfit)[0];
              if (!bestResult) return null;
              const platformMeta = (PLATFORMS as unknown as Record<string, { name?: string; currencySymbol?: string }>)[summary.bestPlatform] ?? {};
              const bestPlatformName: string = platformMeta.name ?? summary.bestPlatform;
              const sym: string = platformMeta.currencySymbol ?? '₹';
              const symPrefix: string = sym === 'AED' ? 'AED ' : sym;
              const profit: number = bestResult.netProfit;
              const margin: number = bestResult.profitMargin;
              const healthy: boolean = margin >= 10;
              return (
                <div
                  role="region"
                  aria-label="Your top result"
                  className={`mb-5 p-4 sm:p-5 rounded-xl border transition-all duration-300
                              ${healthy
                      ? 'bg-success-light border-success/25'
                      : 'bg-warning-light border-warning/30'
                    }`}
                >
                  <p className="font-display font-bold text-ds-caption uppercase tracking-widest text-n-400 mb-1.5">
                    {(summary.uniquePlatformCount ?? 1) === 1 ? 'Your result' : 'Your top result'}
                  </p>
                  <h3 className="font-display font-semibold text-n-900 tracking-tight
                                  text-[clamp(15px,4vw,24px)] leading-snug">
                    You&rsquo;d keep{' '}
                    <span className={`font-mono tabular-nums font-bold
                                      ${healthy ? 'text-success' : 'text-warning'}`}>
                      {profit < 0 ? '-' : ''}{symPrefix}{Math.round(Math.abs(profit)).toLocaleString('en-IN')}
                    </span>
                    {' '}per unit on{' '}
                    <span className="text-n-900 font-bold">{bestPlatformName}</span>.
                  </h3>
                  <p className="font-body text-ds-body-sm text-n-500 mt-2">
                    That&rsquo;s a {margin.toFixed(1)}% margin.{' '}
                    {(summary.uniquePlatformCount ?? 1) === 1
                      ? 'Add another marketplace above to see how this compares.'
                      : 'Scroll for the full side-by-side breakdown, fee detail, and break-even chart.'}
                  </p>
                </div>
              );
            })()}

            {/* Summary metrics */}
            <section aria-label="Summary metrics" className="mb-6">
              <SummaryStrip summary={summary} />
            </section>

            {/* AI Upsell Teaser */}
            {!aiTeaserDismissed && (
              <div
                role="complementary"
                aria-label="Opsell AI teaser"
                className="mb-8 p-4 sm:p-5 bg-ai-bg border border-ai-border rounded-xl
                           flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
              >
                <span
                  aria-hidden="true"
                  className="w-10 h-10 rounded-lg flex items-center justify-center
                             bg-brand/10 text-brand flex-shrink-0"
                >
                  <IconSparkle size={18} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold text-ds-body text-n-900 tracking-tight">
                    Forecast next month&rsquo;s margin across all your SKUs.
                  </p>
                  <p className="font-body text-ds-caption text-n-400 mt-0.5">
                    Opsell AI syncs with your seller accounts and predicts profitability per SKU, per platform.
                  </p>
                </div>
                <a
                  href="https://opsell.in?utm_source=calculator&utm_medium=inline-ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto text-center flex-shrink-0 px-4 py-2 rounded-lg
                             bg-brand text-white font-display font-semibold text-ds-caption
                             no-underline hover:bg-brand-dark transition-colors"
                >
                  Try Opsell AI
                </a>
                <button
                  onClick={dismissAiTeaser}
                  type="button"
                  aria-label="Dismiss AI teaser"
                  className="self-end sm:self-auto flex-shrink-0 w-9 h-9 rounded-lg border-0
                             bg-transparent text-n-300 hover:text-n-500 hover:bg-n-100
                             cursor-pointer flex items-center justify-center transition-colors"
                >
                  <IconClose size={16} />
                </button>
              </div>
            )}

            {/* Platform Comparison */}
            <section aria-label="Platform comparison" className="mb-6">
              <SectionHeader
                title={(summary?.uniquePlatformCount ?? 1) === 1 ? 'Your breakdown' : 'Platform Comparison'}
                subtitle={(summary?.uniquePlatformCount ?? 1) === 1
                  ? 'Toggle another marketplace above to compare side-by-side.'
                  : 'Side-by-side margins across every marketplace you selected'}
              />
              <ComparisonTable
                results={results as Parameters<typeof ComparisonTable>[0]['results']}
                summary={summary}
              />
              {(summary?.uniquePlatformCount ?? 1) === 1 && (
                <div
                  role="note"
                  className="mt-3 p-4 bg-ai-bg border border-dashed border-ai-border rounded-xl
                             flex items-center gap-3 flex-wrap
                             font-body text-ds-body-sm text-n-500"
                >
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center
                                   bg-brand/10 text-brand flex-shrink-0">
                    <IconSparkle size={13} />
                  </span>
                  <span className="flex-1 min-w-[220px]">
                    Curious how Flipkart, Meesho, or Noon would look?
                    Tap a second marketplace chip to see side-by-side margins.
                  </span>
                  <a
                    href="#calculator-form"
                    className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-white border border-n-border
                               text-n-600 font-display font-semibold text-ds-caption
                               hover:bg-n-50 transition-colors no-underline"
                  >
                    Pick marketplaces
                  </a>
                </div>
              )}
              <BeyondFeesDisclaimer
                summary={summary}
                onOpenLead={() => {
                  const el = document.getElementById('email-capture');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(() => (el as HTMLElement).focus(), 400);
                  }
                }}
              />
            </section>

            {/* Fee Breakdowns */}
            <section aria-label="Fee breakdowns" className="mb-10">
              <SectionHeader
                title="Detailed Fee Breakdowns"
                subtitle="Line-by-line deductions per platform, including return impact"
              />
              {groupedResults.map(group => (
                <FeeBreakdownCard
                  key={group.name}
                  productName={group.name}
                  results={group.results as unknown as Parameters<typeof FeeBreakdownCard>[0]['results']}
                />
              ))}
            </section>

            {/* Analytics Dashboard */}
            <section aria-label="Analytics" className="mb-12">
              <SectionHeader
                title="Analytics & ROI"
                subtitle="Visualize where your margin lives"
              />
              <Dashboard
                results={results as Parameters<typeof Dashboard>[0]['results']}
                products={products}
              />
            </section>

            {/* SEO block */}
            <PlatformSEOBlock />

            {/* ── TOFU Funnel — Email + Share ── */}
            <div className="mt-8 mb-12 p-5 sm:p-8 bg-white border border-n-border rounded-3xl
                            shadow-elev-1 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">

              {/* Email capture */}
              <div>
                <h4 className="font-display font-semibold text-ds-h3 text-n-900 flex items-center gap-2.5 mb-2">
                  <IconMail size={18} className="text-brand" />
                  Get your full profitability report
                </h4>
                <p className="font-body text-ds-body-sm text-n-400 mb-4">
                  PDF breakdown + monthly AI margin forecasts. No spam &mdash; unsubscribe any time.
                </p>

                {emailStatus === 'ok' ? (
                  <div
                    role="status"
                    aria-live="polite"
                    className="flex items-center gap-2.5 p-3 rounded-lg
                               bg-success-light border border-success/25
                               text-success font-body text-ds-body-sm font-medium"
                  >
                    <IconCheck size={16} />
                    <span>Sent to {email}. Check your inbox in ~1 min.</span>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <label htmlFor="email-capture" className="sr-only">Email address</label>
                      <input
                        id="email-capture"
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        placeholder="seller@brand.com"
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setEmail(e.target.value);
                          if (emailStatus === 'bad') setEmailStatus(null);
                        }}
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                          if (e.key === 'Enter') handleEmailSubmit();
                        }}
                        aria-invalid={emailStatus === 'bad'}
                        aria-describedby={emailStatus === 'bad' ? 'email-error' : undefined}
                        className={`w-full sm:flex-1 min-w-0 px-3.5 py-2.5 rounded-lg border
                                    bg-n-50 text-n-900 font-body text-ds-body-sm
                                    placeholder:text-n-300
                                    focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand
                                    transition-colors
                                    ${emailStatus === 'bad'
                            ? 'border-error/50 focus:ring-error/20 focus:border-error'
                            : 'border-n-border'
                          }`}
                      />
                      <button
                        onClick={handleEmailSubmit}
                        className="w-full sm:w-auto flex-shrink-0 min-w-[96px] px-4 py-2.5 rounded-lg
                                   bg-brand text-white font-display font-semibold text-ds-body-sm
                                   hover:bg-brand-dark transition-colors shadow-elev-1"
                      >
                        Send report
                      </button>
                    </div>
                    <p className="font-body text-ds-caption text-n-300 mt-2">
                      We&rsquo;ll never share your email.
                    </p>
                    {emailStatus === 'bad' && (
                      <p
                        id="email-error"
                        role="alert"
                        className="flex items-center gap-1.5 font-body text-ds-caption text-error mt-2"
                      >
                        <IconSparkle size={12} /> Enter a valid email address
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* Share link */}
              <div>
                <h4 className="font-display font-semibold text-ds-h3 text-n-900 flex items-center gap-2.5 mb-2">
                  <IconLink size={18} className="text-brand-mid" />
                  Share these results
                </h4>
                <p className="font-body text-ds-body-sm text-n-400 mb-4">
                  Copy a link to this exact calculation to share with your team.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <label htmlFor="share-url" className="sr-only">Share URL</label>
                  <input
                    id="share-url"
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="w-full sm:flex-1 min-w-0 px-3.5 py-2.5 rounded-lg border border-n-border
                               bg-n-50 text-n-400 font-mono text-ds-caption
                               focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand
                               transition-colors"
                    onFocus={(e: React.FocusEvent<HTMLInputElement>) => e.currentTarget.select()}
                  />
                  <button
                    onClick={handleCopy}
                    aria-live="polite"
                    className={`w-full sm:w-auto flex-shrink-0 min-w-[110px] px-4 py-2.5 rounded-lg
                                font-display font-semibold text-ds-body-sm border
                                flex items-center justify-center gap-1.5
                                transition-all duration-200
                                ${copied
                        ? 'bg-success-light border-success/35 text-success'
                        : 'bg-white border-n-border text-n-600 hover:bg-n-50'
                      }`}
                  >
                    {copied
                      ? <><IconCheck size={14} /> Copied</>
                      : <><IconLink size={14} /> Copy Link</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <EmptyState message="Select platforms above to see profitability results" />
        )}


      </main>
    </div>
  );
}

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

/** Small coloured dot + text used in hero trust strip */
function TrustPill({ color, label }: { color: string; label: string }): ReactElement {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span aria-hidden="true" className={`w-1.5 h-1.5 rounded-full ${color}`} />
      {label}
    </span>
  );
}

interface SectionHeaderProps { title: string; subtitle?: string; }

function SectionHeader({ title, subtitle }: SectionHeaderProps): ReactElement {
  return (
    <div className="mb-4">
      <h3 className="font-display font-semibold text-ds-h2 text-n-900 tracking-tight">
        {title}
      </h3>
      {subtitle && (
        <p className="font-body text-ds-body-sm text-n-400 mt-1">{subtitle}</p>
      )}
    </div>
  );
}

interface ResetButtonProps { onClick: () => void; }

// function ResetButton({ onClick }: ResetButtonProps): ReactElement {
//   return (
//     <button
//       onClick={() => {
//         if (window.confirm('Clear all settings and start over?')) onClick();
//       }}
//       className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg
//                  bg-error-light border border-error/20 text-error
//                  font-display font-semibold text-ds-caption
//                  hover:bg-red-100 transition-colors duration-150"
//       aria-label="Clear all settings"
//     >
//       <IconRefresh size={14} /> Clear All
//     </button>
//   );
// }

interface EmptyStateProps { message: string; }

function EmptyState({ message }: EmptyStateProps): ReactElement {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-5 mt-6 animate-fade-up">
      <div className="w-14 h-14 rounded-full bg-ai-bg border border-dashed border-ai-border
                      flex items-center justify-center text-brand mb-4">
        <IconArrowDown size={24} />
      </div>
      <p className="font-body text-n-500 text-ds-body text-center mb-1.5">{message}</p>
      <p className="font-body text-ds-caption text-n-300 text-center">
        Enter a selling price and COGS, then toggle one or more marketplaces above.
      </p>
    </div>
  );
}

export default App;
