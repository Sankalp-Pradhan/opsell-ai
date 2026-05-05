import { TrendingUp, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";

type Brand = {
  name: string;
  logo: string;
  multiplier: string;
  headline: string;
  description: string;
  footer: string;
};

const brands: Brand[] = [
  {
    name: "TOP SNEAKER BRAND",
    logo: "",
    multiplier: "2.1x",
    headline: "GMV growth via AI suggested Cross-Selling.",
    description:
      "(Opsell AI detected competitor pricing dip and recommended optimized Adidas bundles, increasing total order value).",
    footer: "Opsell recommends next optimal bundle.",
  },
  {
    name: "Leading skincare brand",
    logo: "",
    multiplier: "1.8x",
    headline: "Conversion Rate boost via AI Content Generation.",
    description:
      "(Opsell's AI updated all minimalist. listings across Amazon and Flipkart, resulting in faster checkouts).",
    footer:
      "Content score has been surpassed by our AI-generated product descriptions.",
  },
  {
    name: "Premium denim brand",
    logo: "",
    multiplier: "1.5x",
    headline: "Margin improvement via automated price testing.",
    description:
      "(Opsell AI tested higher price in specific regions, maintaining volume and boosting margins for key dot and key serums).",
    footer: "Regional demand insights implemented in dot and key SKU level pricing.",
  },
];

const BrandLogo = ({ logo, name }: { logo: string; name: string }) => {
  if (!logo) {
    return (
      <span className="font-display text-sm font-bold uppercase tracking-widest text-white/80">
        {name}
      </span>
    );
  }

  return (
    <>
      <img
        src={logo}
        alt={`${name} logo`}
        className="h-8 w-auto object-contain brightness-0 invert sm:h-10"
        loading="lazy"
        onError={(e) => {
          const target = e.currentTarget;
          target.style.display = "none";
          const fallback = target.nextElementSibling as HTMLElement;
          if (fallback) fallback.style.display = "block";
        }}
      />
      <span
        className="font-display text-sm font-bold uppercase tracking-widest text-white/80"
        style={{ display: "none" }}
      >
        {name}
      </span>
    </>
  );
};

const BrandCard = ({ brand }: { brand: Brand }) => (
  <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#1C1F24] to-[#0F1114] p-6 transition-all duration-300 hover:border-[#5E5CE6]/40 hover:shadow-[0_20px_50px_-15px_rgba(94,92,230,0.4)] sm:p-8 h-full flex flex-col">
    <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#5E5CE6]/10 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />

    {/* Logo + headline row */}
    <div className="relative flex items-start justify-between gap-3">
      <div className="flex h-10 shrink-0 items-center sm:h-12">
        <BrandLogo logo={brand.logo} name={brand.name} />
      </div>
    </div>
      <p className="text-xs font-bold   text-white/90 sm:text-lg">
        {brand.headline}
      </p>

    {/* Description */}
    <p className="relative mt-3 text-xs leading-relaxed text-white/50">
      {brand.description}
    </p>

    {/* Multiplier */}
    <div className="relative mt-6 flex items-end gap-2 sm:mt-8">
      <TrendingUp className="mb-1 h-6 w-6 text-[#22C55E] sm:mb-2 sm:h-7 sm:w-7" strokeWidth={2.5} />
      <span className="font-display text-5xl font-bold tracking-tight text-white sm:text-6xl">
        {brand.multiplier}
      </span>
    </div>

    {/* Footer */}
    <div className="relative mt-auto flex items-center gap-2 border-t border-white/10 pt-5 mt-5 sm:pt-6">
      <Sparkles className="h-4 w-4 shrink-0 text-[#A5B4FC]" />
      <p className="text-xs text-[#A5B4FC]">{brand.footer}</p>
    </div>
  </article>
);

const ProblemSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback((index: number) => {
    setActiveIndex(Math.max(0, Math.min(index, brands.length - 1)));
    setDragOffset(0);
  }, []);

  const prev = () => goTo(activeIndex - 1);
  const next = () => goTo(activeIndex + 1);

  // Touch / mouse drag
  const onDragStart = (clientX: number) => {
    setIsDragging(true);
    setDragStartX(clientX);
  };

  const onDragMove = (clientX: number) => {
    if (!isDragging) return;
    setDragOffset(clientX - dragStartX);
  };

  const onDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const threshold = 60;
    if (dragOffset < -threshold) next();
    else if (dragOffset > threshold) prev();
    setDragOffset(0);
  };

  // Keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeIndex]);

  const translateX = `calc(${-activeIndex * 100}% + ${dragOffset}px)`;

  return (
    <section className="relative overflow-hidden bg-[#0F1114] px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: "radial-gradient(circle, #5E5CE6 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* Glow */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[400px] w-[90vw] max-w-[800px] -translate-x-1/2 rounded-full bg-[#5E5CE6]/20 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Heading */}
        <h2 className="mx-auto max-w-4xl text-center font-display text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
          AI{" "}
          <span className="bg-gradient-to-r from-[#A5B4FC] to-[#5E5CE6] bg-clip-text text-transparent">
            Growth Engine
          </span>
          {" "}for Sellers
        </h2>

        {/* ── Desktop grid (md+) ── */}
        <div className="mt-10 hidden gap-5 sm:mt-14 sm:gap-6 md:grid md:grid-cols-3 lg:gap-8">
          {brands.map((brand) => (
            <BrandCard key={brand.name} brand={brand} />
          ))}
        </div>

        {/* ── Mobile slider (< md) ── */}
        <div className="md:hidden mt-8" ref={containerRef}>
          {/* Track */}
          <div
            className="overflow-hidden rounded-2xl"
            style={{ touchAction: "pan-y" }}
          >
            <div
              ref={trackRef}
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
              onTouchMove={(e) => onDragMove(e.touches[0].clientX)}
              onTouchEnd={onDragEnd}
            >
              {brands.map((brand) => (
                <div
                  key={brand.name}
                  className="w-full shrink-0 px-0.5"
                  style={{ userSelect: "none" }}
                >
                  <BrandCard brand={brand} />
                </div>
              ))}
            </div>
          </div>

          {/* Controls row */}
          <div className="mt-5 flex items-center justify-between px-1">
            {/* Prev */}
            <button
              onClick={prev}
              disabled={activeIndex === 0}
              aria-label="Previous"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-all hover:border-[#5E5CE6]/50 hover:bg-[#5E5CE6]/10 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {brands.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className="transition-all duration-300"
                  style={{
                    width: i === activeIndex ? 20 : 6,
                    height: 6,
                    borderRadius: 9999,
                    background: i === activeIndex
                      ? "linear-gradient(90deg, #A5B4FC, #5E5CE6)"
                      : "rgba(255,255,255,0.2)",
                  }}
                />
              ))}
            </div>

            {/* Next */}
            <button
              onClick={next}
              disabled={activeIndex === brands.length - 1}
              aria-label="Next"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-all hover:border-[#5E5CE6]/50 hover:bg-[#5E5CE6]/10 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Slide counter */}
          <p className="mt-2 text-center text-xs text-white/30">
            {activeIndex + 1} / {brands.length}
          </p>
        </div>

        {/* CTA */}
       
      </div>
    </section>
  );
};

export default ProblemSection;