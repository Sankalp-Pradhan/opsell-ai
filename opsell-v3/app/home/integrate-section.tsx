"use client";

import React from "react";
import OrbitApps from "./orbitApps";
import { useInView } from "./use-view";

export function IntegrateSection() {
  const { ref, inView } = useInView();

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="overflow-hidden bg-white px-5 py-14 sm:px-10 sm:py-20"
    >
      <div
        className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-2 lg:items-center lg:gap-[60px]"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "none" : "translateY(32px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        {/* Orbit */}
        <div className="flex w-full items-center justify-center">
          <OrbitApps />
        </div>

        {/* Text */}
        <div>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "#7B73FF",
              marginBottom: 14,
            }}
          >
            Integrations
          </p>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(24px, 3.5vw, 44px)",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "#0f0f1a",
              marginBottom: 16,
            }}
          >
            One hub for every
            <br />
            <em style={{ fontStyle: "normal", color: "#7B73FF" }}>
              e-commerce platform.
            </em>
          </h2>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 15,
              color: "#64748b",
              lineHeight: 1.65,
              marginBottom: 22,
            }}
          >
            Opsell brings together pricing, listings, competitor tracking, and
            execution across every marketplace into one intelligent platform.
            Faster decisions, instant reactions, more profitable growth.
          </p>

          {/* Legend */}
          <div
            className="mb-7 flex items-center gap-5"
            style={{ fontFamily: "var(--font-display)", fontSize: 13 }}
          >
            <span className="flex items-center gap-1.5 font-medium text-[#475569]">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Live now
            </span>
            <span className="flex items-center gap-1.5 font-medium text-[#475569]">
              <span className="h-2 w-2 rounded-full bg-slate-300" />
              Coming soon
            </span>
          </div>

          <button
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 14,
              fontWeight: 600,
              color: "#0f0f1a",
              background: "#fff",
              border: "1.5px solid rgba(0,0,0,0.15)",
              cursor: "pointer",
              padding: "12px 22px",
              borderRadius: 10,
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(0,0,0,0.3)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(0,0,0,0.15)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            See integrations →
          </button>
        </div>
      </div>
    </section>
  );
}