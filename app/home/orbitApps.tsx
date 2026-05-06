"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { OrbitingCircles } from "./orbiting-circles";

function radiiForWidth(width: number) {
  return {
    inner: width < 640 ? 62 : width < 1024 ? 120 : 150,
    outer: width < 640 ? 108 : width < 1024 ? 180 : 230,
    iconSize: width < 640 ? 36 : 56,
  };
}

type IconProps = {
  src: string;
  alt: string;
  live?: boolean;
};

function OrbitIcon({ src, alt, live = false }: IconProps) {
  return (
    <div
      className="flex items-center justify-center rounded-2xl bg-white"
      style={{
        width: 52,
        height: 52,
        boxShadow: live
          ? "0 0 0 2px rgba(34,197,94,0.6), 0 0 14px 5px rgba(34,197,94,0.22), 0 2px 8px rgba(0,0,0,0.08)"
          : "0 2px 8px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.06)",
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={32}
        height={32}
        className="object-contain"
        style={{
          width: 32,
          height: 32,
          filter: live ? "none" : "grayscale(1) opacity(0.45)",
        }}
      />
    </div>
  );
}

const OrbitApps = () => {
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  const { inner, outer, iconSize } = useMemo(
    () => radiiForWidth(width ?? 1024),
    [width]
  );

  return (
    <div className="relative flex h-[260px] sm:h-[420px] lg:h-[500px] w-full items-center justify-center overflow-hidden">
      {/* Grid background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(100,116,139,0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(100,116,139,0.3) 1px, transparent 1px)
          `,
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse at center, black 50%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 50%, transparent 100%)",
        }}
      />

      {/* Center hub */}
      <div className="pointer-events-none z-10 flex flex-col items-center gap-2">
        <span className="text-sm sm:text-5xl p-10 font-bold tracking-tight bg-gradient-to-br from-brand-dark to-black bg-clip-text text-transparent">
          opsell.
        </span>
      </div>

      {/* Inner orbit — live */}
      <OrbitingCircles radius={inner} duration={20} iconSize={iconSize}>
        <OrbitIcon src="/assets/amazon.png" alt="Amazon" live />
        <OrbitIcon src="/assets/flipkart.png" alt="Flipkart" live />
        <OrbitIcon src="/assets/shopify.png" alt="Shopify" live />
        <OrbitIcon src="/assets/meesho1.png" alt="Meesho" live />
      </OrbitingCircles>

      {/* Outer orbit — mixed */}
      <OrbitingCircles radius={outer} duration={28} reverse iconSize={iconSize}>
        <OrbitIcon src="/assets/ajio.png" alt="Ajio" />
        <OrbitIcon src="/assets/zepto.png" alt="Zepto" />
        <OrbitIcon src="/assets/blinkit.png" alt="Blinkit" />

        <OrbitIcon src="/assets/myntra.png" alt="Myntra" />
        <OrbitIcon src="/assets/jiomart.png" alt="JioMart" />
        <OrbitIcon src="/assets/instamart.png" alt="inst" />
      </OrbitingCircles>
    </div>
  );
};

export default OrbitApps;