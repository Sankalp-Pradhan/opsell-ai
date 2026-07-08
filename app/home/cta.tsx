import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="bg-white px-6 md:px-12 lg:px-20 pb-12">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl bg-n-900 px-8 py-16 md:px-16 md:py-20">
          {/* Glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/3"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(80,70,229,0.45) 0%, transparent 65%)",
            }}
          />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8">
              <p className="text-brand text-xs font-semibold tracking-[0.18em] uppercase mb-6">
                Early Access · 15+ Brands Queued
              </p>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight text-white">
                Stop reacting.{" "}
                <span className="text-brand-mid">
                  Start
                  <br />
                  recovering revenue.
                </span>
              </h2>
              <p className="mt-6 max-w-xl text-base text-white/55 leading-relaxed">
                30-minute revenue audit on your live catalog: suppressed listings, margin
                drift, repricing lag, lost buy-box windows — quantified in ₹ at risk and a
                90-day recovery plan. No slides.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3 lg:items-end">
              <a
                href="https://forms.gle/8oyErGWjoFwyHBub7"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-4 font-display text-[15px] font-semibold text-brand shadow-[0_8px_24px_rgba(80,70,229,0.35)] transition-transform hover:-translate-y-0.5 w-full lg:w-auto"
              >
                Get my revenue audit <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="https://dev.opsell.ai/" className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-transparent px-7 py-4 font-display text-[15px] font-semibold text-white/80 transition-colors hover:border-white/40 hover:text-white w-full lg:w-auto"
              >
                See it execute
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
