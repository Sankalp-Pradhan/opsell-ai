"use client";

import Link from "next/link";
import { useInView } from "./use-view";

// ─── CTA Section ──────────────────────────────────────────────────────────────


export function CtaSection() {
  const { ref, inView } = useInView();

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      style={{ background: "#0F1114", padding: "100px 40px", textAlign: "center", position: "relative", overflow: "hidden", opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(32px)", transition: "opacity 0.7s, transform 0.7s" }}
    >
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, background: "radial-gradient(ellipse at center, rgba(80,70,229,0.25) 0%, transparent 65%)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 5vw, 64px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.04em", color: "#fff", maxWidth: 700, margin: "0 auto 16px" }}>
          Ready to stop <em style={{ fontStyle: "normal", color: "#7B73FF" }}>reacting</em><br />and start winning?
        </h2>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 17, color: "rgba(255,255,255,0.5)", marginBottom: 40 }}>
          Join the brands growing 30%+ faster with Opsell. Early access spots are limited.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <Link href="https://opsell.neetocal.com/meeting-with-shaurya-gupta">
            <button
              style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600, color: "#fff", background: "#5046E5", border: "none", cursor: "pointer", padding: "13px 32px", borderRadius: 10, boxShadow: "0 8px 24px rgba(80,70,229,0.5)", transition: "transform 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "")}
            >
              Book a Demo
            </button>
          </Link> 
          <button
            style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.75)", background: "none", border: "1.5px solid rgba(255,255,255,0.2)", cursor: "pointer", padding: "13px 32px", borderRadius: 10, transition: "border-color 0.15s" }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)")}
          >
            Get Early Access →
          </button>
        </div>
      </div>
    </section>
  );
}