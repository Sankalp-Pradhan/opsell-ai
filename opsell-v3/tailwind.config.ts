import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#5046E5",
          light: "#F0EFFF",
          mid: "#7B73FF",
          dark: "#3B32C4",
          deeper: "#2A2494",
        },
        ai: {
          bg: "#F0EFFF",
          border: "#C7C4FF",
          pulse: "#5046E5",
        },
        n: {
          900: "#0F1114",
          800: "#1C1F24",
          700: "#2E3238",
          600: "#4A4F57",
          500: "#6B707A",
          400: "#8C919A",
          300: "#B0B4BC",
          200: "#D1D4D9",
          border: "#E2E4E8",
          100: "#F0F1F3",
          50:  "#F8F9FA",
        },
        success: {
          DEFAULT: "#16A34A",
          light: "#ECFDF5",
        },
        warning: {
          DEFAULT: "#F59E0B",
          light: "#FFFBEB",
        },
        error: {
          DEFAULT: "#EF4444",
          light: "#FEF2F2",
        },
      },

      fontFamily: {
        display: ["var(--font-display)", "Plus Jakarta Sans", "sans-serif"],
        body:    ["var(--font-body)",    "DM Sans",           "sans-serif"],
        mono:    ["var(--font-mono)",    "JetBrains Mono",    "monospace"],
      },

      fontSize: {
        "ds-display": ["32px", { fontWeight: "800", lineHeight: "1.05" }],
        "ds-h1":      ["24px", { fontWeight: "700", lineHeight: "1.15" }],
        "ds-h2":      ["20px", { fontWeight: "600", lineHeight: "1.2"  }],
        "ds-h3":      ["16px", { fontWeight: "600", lineHeight: "1.3"  }],
        "ds-body":    ["14px", { lineHeight: "1.5" }],
        "ds-body-sm": ["13px", { lineHeight: "1.5" }],
        "ds-caption": ["12px", { lineHeight: "1.4" }],
      },

      borderRadius: {
        sm:   "4px",
        md:   "8px",
        lg:   "12px",
        xl:   "16px",
        "2xl": "20px",
        "3xl": "24px",
      },

      boxShadow: {
        "elev-1": "0 1px 2px rgba(15,17,20,0.06)",
        "elev-2": "0 2px 8px rgba(15,17,20,0.08), 0 1px 2px rgba(15,17,20,0.04)",
        "elev-3": "0 8px 24px rgba(15,17,20,0.10), 0 2px 6px rgba(15,17,20,0.06)",
      },
      

      keyframes: {
        aiPulse: {
          "0%, 100%": { opacity: "0.4" },
          "50%":       { opacity: "1"   },
        },
        aiShimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0"  },
        },
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)"    },
        },
        pillBeam: {
          "0%":   { left: "-60%" },
          "100%": { left: "160%" },
        },
        // ✅ Added marquee keyframe
        marquee: {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },

      animation: {
        "ai-pulse":   "aiPulse 1.2s ease infinite",
        "ai-shimmer": "aiShimmer 2s ease infinite",
        "fade-up":    "fadeUp 0.6s ease both",
        "pill-beam":  "pillBeam 3s ease infinite",
      "pulse-glow": "pulse-glow 5s ease-in-out infinite",
        "marquee":    "marquee 25s linear infinite",
      },

      backgroundImage: {
        "ai-shimmer": "linear-gradient(90deg, #F0F1F3 25%, #F0EFFF 50%, #F0F1F3 75%)",
      },

      backgroundSize: {
        "200%": "200% 100%",
      },
      
    },
  },
  plugins: [],
};

export default config;