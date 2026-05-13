import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight, ShoppingBag, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";

const competitors = [
  {
    name: "Competitor A",
    price: "$24.90",
    trend: "−3%",
    trendClass: "text-brand",
    initials: "CA",
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=competitorA&backgroundColor=fde68a",
  },
  {
    name: "Competitor B",
    price: "$27.50",
    trend: "+1%",
    trendClass: "text-n-400",
    initials: "CB",
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=competitorB&backgroundColor=bfdbfe",
  },
  {
    name: "Your store",
    price: "$25.00",
    trend: "Best",
    trendClass: "text-brand",
    initials: "YS",
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=yourstore&backgroundColor=bbf7d0",
  },
];

const Hero = () => {
  return (
<section className="relative overflow-hidden bg-n-50 px-6 pb-20 pt-16 sm:px-12 sm:pb-24 sm:pt-20 md:px-16 lg:px-24 lg:pt-28">      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand/10 blur-3xl sm:h-96 sm:w-96" />
      <div className="pointer-events-none absolute -left-24 top-40 h-64 w-64 rounded-full bg-brand-mid/10 blur-3xl sm:h-80 sm:w-80" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="space-y-6 text-center lg:text-left animate-slide-in-left">
          <div className="group inline-flex items-center gap-2 rounded-sm bg-brand-light px-3 py-1.5 font-display text-[11px] font-bold uppercase tracking-[0.12em] text-brand transition-all hover:bg-brand hover:text-primary-foreground hover-scale">
            <Sparkles className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:rotate-12" />
            All-in-one growth toolkit
          </div>

          <h1 className="font-display mx-auto max-w-2xl text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] text-n-900 sm:text-5xl lg:mx-0 lg:max-w-xl lg:text-6xl xl:text-7xl">
            Everything You Need to{" "}
            <span className="bg-gradient-to-br from-brand to-brand-mid bg-clip-text text-transparent">
              Grow Sales Smarter
            </span>
          </h1>

          <div className="mx-auto h-1 w-16 rounded-sm bg-brand lg:mx-0" />

          <p className="font-body mx-auto max-w-xl text-ds-body leading-relaxed text-n-500 lg:mx-0">
            Opsell helps you track competitors, improve pricing, and grow revenue
            automatically — without complicated tools.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link 
            href="https://forms.gle/8oyErGWjoFwyHBub7" target="_blank" rel="noopener noreferrer">
            <button className="text-white group font-display inline-flex items-center justify-center gap-2 rounded-md bg-brand px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elev-2 transition-all hover:bg-brand-dark hover:shadow-elev-3 hover:-translate-y-0.5 active:scale-95 sm:px-7 sm:py-3.5 sm:text-base">
              Start Free Trial
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            </Link>
            <Link
            href="https://opsell.neetocal.com/meeting-with-shaurya-gupta" target="_blank" rel="noopener noreferrer"
            >
            <button className="font-display inline-flex items-center justify-center rounded-md border border-n-border bg-background px-6 py-3 text-sm font-semibold text-n-900 shadow-elev-1 transition-all hover:border-brand hover:text-brand hover:-translate-y-0.5 active:scale-95 sm:px-7 sm:py-3.5 sm:text-base">
              Schedule a Call
            </button>
            </Link>
          </div>

          <div className="font-body flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-ds-caption text-n-400 lg:justify-start">
            <span>✓ No credit card</span>
            <span>✓ 14-day free trial</span>
            <span>✓ Cancel anytime</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative rounded-xl border border-n-border bg-background p-4 shadow-elev-3 sm:p-6 lg:ml-auto lg:max-w-xl">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-display text-ds-caption font-bold uppercase tracking-[0.12em] text-n-400">
                  Live Dashboard
                </p>
                <p className="font-display text-ds-h3 font-semibold text-n-900">
                  Today's overview
                </p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-light">
                <TrendingUp className="h-4 w-4 text-brand" />
              </div>
            </div>

            <div className="space-y-3">
              <p className="font-display text-ds-caption font-bold uppercase tracking-[0.12em] text-n-400">
                Competitor prices
              </p>

              {competitors.map((c, idx) => (
                <div
                  key={c.name}
                  style={{ animationDelay: `${idx * 100}ms` }}
                  className="flex items-center justify-between gap-3 rounded-lg bg-brand-light/50 px-3 py-3 animate-fade-in transition-all hover:bg-brand-light hover:translate-x-1 sm:px-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar className="h-8 w-8 shrink-0 border border-n-border">
                      <AvatarImage src={c.avatar} alt={c.name} />
                      <AvatarFallback className="bg-gradient-to-br from-brand-mid to-brand text-[10px] font-bold text-primary-foreground">
                        {c.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-body truncate text-ds-body-sm font-medium text-n-800">
                      {c.name}
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                    <span className="font-mono text-ds-body-sm font-medium text-n-900">
                      {c.price}
                    </span>
                    <span className={`font-display text-ds-caption font-bold ${c.trendClass}`}>
                      {c.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-lg border border-n-border bg-background p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="font-display text-ds-caption font-bold uppercase tracking-[0.12em] text-n-400">
                  Revenue · 7 days
                </span>
                <span className="font-mono text-ds-body-sm font-medium text-brand">+18.4%</span>
              </div>
              <svg viewBox="0 0 200 60" className="h-14 w-full">
                <defs>
                  <linearGradient id="revGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--brand))" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="hsl(var(--brand))" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,45 L25,38 L50,42 L75,30 L100,32 L125,22 L150,25 L175,12 L200,15 L200,60 L0,60 Z"
                  fill="url(#revGrad)"
                />
                <path
                  d="M0,45 L25,38 L50,42 L75,30 L100,32 L125,22 L150,25 L175,12 L200,15"
                  fill="none"
                  stroke="hsl(var(--brand))"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div className="relative mx-auto mt-4 w-full max-w-xs rounded-xl border border-ai-border bg-ai-bg p-4 shadow-elev-2 transition-transform hover:-translate-y-1 animate-float sm:absolute sm:-bottom-6 sm:-left-4 sm:mt-0 sm:max-w-[260px] lg:-left-8">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-light">
                <ShoppingBag className="h-4 w-4 text-brand" />
              </div>
              <div>
                <div className="mb-1 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand animate-ai-pulse" />
                  <span className="h-1.5 w-1.5 rounded-full bg-brand animate-ai-pulse [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-brand animate-ai-pulse [animation-delay:0.4s]" />
                  <p className="font-display text-ds-caption font-bold uppercase tracking-[0.12em] text-brand">
                    AI Suggestion
                  </p>
                </div>
                <p className="font-body text-ds-body-sm leading-snug text-n-700">
                  Bundle "Hat + Tee" — could lift sales by 12%.
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1.5 w-20 overflow-hidden rounded-full bg-n-200">
                    <div className="h-full w-[87%] rounded-full bg-success transition-all duration-700" />
                  </div>
                  <span className="font-mono text-[11px] font-medium text-success">87%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
