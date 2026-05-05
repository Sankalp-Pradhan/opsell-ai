"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

const PLATFORMS = [
  { name: "Ajio",     href: "#", src: "/assets/ajio.png" },
  { name: "Flipkart", href: "#", src: "/assets/flipkart.png" },
  { name: "Amazon",   href: "#", src: "/assets/amazon.png" },
  { name: "Blinkit",  href: "#", src: "/assets/blinkit.png" },
  { name: "eBay",     href: "#", src: "/assets/ebay.png" },
  { name: "JioMart",  href: "#", src: "/assets/jiomart.png" },
  { name: "Myntra",   href: "#", src: "/assets/myntra.png" },
  { name: "Meesho",   href: "#", src: "/assets/meesho1.png" },
  { name: "Zepto",    href: "#", src: "/assets/zepto.png" },
  { name: "Shopify",  href: "#", src: "/assets/shopify.png" },
];

const items = [...PLATFORMS, ...PLATFORMS];

const StarField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const draw = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < 60; i++) {
        const x = Math.random() * W;
        const y = Math.random() * H * 0.85;
        const r = Math.random() * 0.9 + 0.25;
        const a = Math.random() * 0.5 + 0.12;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.fill();
      }
    };

    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
};

const PlatformMarquee = () => {
  return (
    <div className="relative overflow-hidden py-8 md:mt-15 bg-[#0B0F1A] border-y border-white/10">

      {/* Star field */}
      <StarField />

      {/* Shooting stars */}
      <span className="meteor" style={{ top: 18, left: "14%", animationDelay: "0s" }} />
      <span className="meteor meteor--sm" style={{ top: 32, left: "58%", animationDelay: "2.2s" }} />
      <span className="meteor" style={{ top: 12, left: "75%", animationDelay: "5.5s" }} />
      <span className="meteor meteor--sm" style={{ top: 24, left: "33%", animationDelay: "8s" }} />

      {/* Centre glow (replaces left→right gradient) */}
      <div
        className="pointer-events-none absolute inset-0 animate-pulse-glow"
        style={{
          background:
            "radial-gradient(ellipse 55% 70% at 50% 100%, rgba(100,90,220,0.28) 0%, transparent 70%)",
        }}
      />

      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0B0F1A] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0B0F1A] to-transparent z-10" />

      {/* Label */}
      <div className="relative z-10 mb-5 text-center">
        <span className="jetbrainsMono text-[11px] tracking-widest uppercase text-white/45">
          Works with every store you sell on
        </span>
      </div>

      {/* Marquee */}
      <div className="relative z-10 overflow-hidden">
        <div className="flex w-max gap-2.5 animate-marquee hover:[animation-play-state:paused]">
          {items.map((p, i) => (
            <Link
              key={p.name + i}
              href={p.href}
              className="group flex items-center gap-3 px-5 py-2.5 rounded-xl
                         bg-white/5 backdrop-blur-md border border-white/10
                         hover:border-[#7B73FF]/55
                         hover:shadow-[0_0_18px_rgba(123,115,255,0.25)]
                         transition-all duration-300"
            >
              <Image
                src={p.src}
                alt={p.name}
                width={26}
                height={26}
                className="object-contain opacity-75 group-hover:opacity-100 transition"
              />
              <span className="text-[13px] font-semibold text-white/75 group-hover:text-white transition">
                {p.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlatformMarquee;