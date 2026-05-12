"use client";

import Link from "next/link";
import Image from "next/image";

/* -------------------------------------------------------------------------- */
/* MARKETPLACE DATA */
/* -------------------------------------------------------------------------- */

const MARKETPLACE_ICONS = [
  {
    id: "amazon",
    href: "",
    label: "Amazon",
    img: "/assets/amazon.png",
    bg: "#FFFFFF",
    border: "#E2E4E8",
    style: "top-[6%] right-[18%] sm:top-[8%] sm:right-[22%]",
    size: "w-12 h-12 sm:w-16 sm:h-16",
    shadow: "shadow-elev-2",
  },
  {
    id: "flipkart",
    href: "",
    label: "Flipkart",
    img: "/assets/flipkart.png",
    bg: "#F7F7FF",
    border: "#C7C4FF",
    style: "top-[28%] left-[2%] sm:left-[4%]",
    size: "w-12 h-12 sm:w-16 sm:h-16",
    shadow: "shadow-elev-2",
  },
  {
    id: "ebay",
    href: "",
    label: "eBay",
    img: "/assets/ebay.png",
    bg: "#FFFFFF",
    border: "#E2E4E8",
    style: "bottom-[24%] left-[1%] sm:left-[2%]",
    size: "w-12 h-10 sm:w-16 sm:h-14",
    shadow: "shadow-elev-1",
  },
  {
    id: "meesho",
    href: "",
    label: "Meesho",
    img: "/assets/meesho1.png",
    bg: "#FFF0F7",
    border: "#F7C4E0",
    style: "top-[10%] right-[2%]",
    size: "w-16 h-10 sm:w-20 sm:h-12",
    shadow: "shadow-elev-1",
  },
  {
    id: "noon",
    href: "",
    label: "Noon",
    img: "/assets/jiomart.png",
    bg: "#FFFDE7",
    border: "#FFE57F",
    style: "bottom-[8%] right-[6%] sm:right-[8%]",
    size: "w-11 h-11 sm:w-14 sm:h-14",
    shadow: "shadow-elev-1",
  },
  {
    id: "walmart",
    href: "",
    label: "Walmart",
    img: "/assets/ajio.png",
    bg: "#E8F4FF",
    border: "#90CAF9",
    style: "top-[56%] right-[0%]",
    size: "w-11 h-11 sm:w-14 sm:h-14",
    shadow: "shadow-elev-1",
  },
];

/* -------------------------------------------------------------------------- */
/* CENTRAL CARD */
/* -------------------------------------------------------------------------- */

function CentralCard() {
  return (
    <div
      className="
        relative z-10
        w-[120px] sm:w-[140px]
        rounded-2xl
        border border-n-border
        bg-white
        p-4 sm:p-5
        shadow-elev-3
        flex flex-col items-center gap-3
      "
    >
      <Image
        src="/assets/opsell-icon.png"
        alt="Analytics"
        width={50}
        height={50}
        className="w-10 h-10 sm:w-[50px] sm:h-[50px]"
      />

      <div className="w-full flex flex-col gap-1.5">
        {[
          { color: "bg-brand", w: "72%" },
          { color: "bg-brand-mid", w: "55%" },
          { color: "bg-success", w: "85%" },
        ].map(({ color, w }) => (
          <div key={w} className="flex items-center gap-1.5">
            <div
              className={`h-1.5 rounded-full ${color}`}
              style={{ width: w }}
            />
            <div className="h-1.5 rounded-full bg-n-200 flex-1" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* CONNECTION LINES */
/* -------------------------------------------------------------------------- */

function ConnectionLines() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 400 400"
    >
      {[
        [200, 200, 290, 55],
        [200, 200, 30, 130],
        [200, 200, 20, 280],
        [200, 200, 360, 45],
        [200, 200, 345, 345],
        [200, 200, 370, 220],
      ].map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#C7C4FF"
          strokeWidth="1.5"
          strokeDasharray="5 4"
          opacity="0.6"
        />
      ))}

      <circle cx="200" cy="200" r="6" fill="#5046E5" opacity="0.2" />
      <circle cx="200" cy="200" r="3" fill="#5046E5" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* HERO SECTION */
/* -------------------------------------------------------------------------- */

export default function HeroSection() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-n-50 font-body text-n-900">
      <section
        className="
          relative
          min-h-screen
          overflow-hidden
          px-6
          pb-20
          pt-24
          sm:px-12
          sm:pt-[120px]
          md:px-16
          lg:px-24
        "
      >
        {/* Background Glow */}

        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(80,70,229,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(80,70,229,0.03) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              maskImage:
                "radial-gradient(ellipse 70% 50% at 30% 20%, black 20%, transparent 100%)",
            }}
          />
        </div>

        {/* Main Layout */}

        <div
          className="
            relative
            z-10
            grid
            grid-cols-1
            items-center
            gap-14
            lg:grid-cols-2
            lg:gap-12
          "
        >
          {/* ---------------------------------------------------------------- */}
          {/* LEFT CONTENT */}
          {/* ---------------------------------------------------------------- */}

          <div
            className="
              order-2
              flex
              max-w-[620px]
              flex-col
              justify-center
              lg:order-1
            "
          >
            {/* Badge */}

            <div
              className="
                inline-flex
                w-fit
                items-center
                gap-2
                rounded-full
                border border-success/20
                bg-success-light
                px-3 py-1.5
                mb-5
                text-[11px]
                sm:text-ds-caption
                font-display
                font-bold
                tracking-wide
                text-success
              "
            >
              <svg
                viewBox="0 0 16 16"
                fill="none"
                className="w-3 h-3"
              >
                <polyline
                  points="3,8 6.5,11.5 13,5"
                  stroke="#16A34A"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              Free forever · No signup · Works in your browser
            </div>

            {/* Heading */}

            <h1
              className="
                mb-6
                max-w-[760px]
                font-display
                text-[clamp(36px,6vw,76px)]
                font-extrabold
                leading-[1.03]
                tracking-[-0.04em]
                text-n-900
              "
            >
              Instant real-profit view
              <br />
              across all{" "}
              <span className="text-brand">8 marketplaces</span>
            </h1>

            {/* Paragraph */}

            <p
              className="
                mb-10
                max-w-[520px]
                text-[15px]
                sm:text-[16px]
                leading-[1.7]
                text-n-500
              "
            >
              Enter your selling price and cost. We&rsquo;ll show the
              real commission, shipping, GST, returns and net payout
              across Amazon, Flipkart, Meesho, Noon, Walmart, eBay,
              and more.
            </p>

            {/* CTA Buttons */}

            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <Link
                href="#calculator-form"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-[10px]
                  bg-brand
                  px-7
                  py-3
                  font-display
                  text-[15px]
                  font-bold
                  text-white
                  shadow-[0_8px_24px_rgba(80,70,229,0.32)]
                  transition-all
                  hover:-translate-y-0.5
                  hover:bg-brand-dark
                  hover:shadow-[0_12px_32px_rgba(80,70,229,0.42)]
                "
              >
                Enter your numbers

                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  className="w-4 h-4"
                >
                  <path
                    d="M8 3l5 5-5 5M3 8h10"
                    stroke="white"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>

              <button
                className="
                  rounded-[10px]
                  border-[1.5px]
                  border-n-200
                  bg-white
                  px-6
                  py-3
                  font-display
                  text-[15px]
                  font-semibold
                  text-n-700
                  transition-colors
                  hover:border-n-400
                  hover:text-n-900
                "
              >
                Try with sample product
              </button>
            </div>

            {/* Trust Pills */}

            <div
              className="
                mt-8
                flex
                flex-col
                gap-y-2
                sm:flex-row
                sm:flex-wrap
                gap-x-5
                text-xs
                text-n-400
              "
            >
              <TrustPill
                color="bg-success"
                label="Your data never leaves this browser"
              />

              <TrustPill
                color="bg-brand"
                label="Fees verified today"
              />

              <TrustPill
                color="bg-brand-mid"
                label="Amazon · Flipkart · Meesho · Noon · Walmart · eBay"
              />
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* RIGHT VISUAL */}
          {/* ---------------------------------------------------------------- */}

          <div
            className="
              order-1
              relative
              flex
              min-h-[320px]
              items-center
              justify-center
              sm:min-h-[420px]
              lg:order-2
              lg:justify-end
            "
          >
            {/* Glow */}

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="
                  w-[260px]
                  h-[260px]
                  sm:w-[320px]
                  sm:h-[320px]
                  rounded-full
                  bg-[radial-gradient(circle,rgba(80,70,229,0.08)_0%,transparent_70%)]
                "
              />
            </div>

            {/* Visual */}

            <div
              className="
                relative
                w-[300px]
                h-[300px]
                sm:w-[400px]
                sm:h-[400px]
              "
            >
              <ConnectionLines />

              {/* Center Card */}

              <div className="absolute inset-0 flex items-center justify-center">
                <CentralCard />
              </div>

              {/* Marketplace Cards */}

              {MARKETPLACE_ICONS.map((m) => (
                <Link
                  key={m.id}
                  href={m.href}
                  aria-label={m.label}
                  className={`
                    absolute
                    ${m.style}
                    ${m.size}
                    ${m.shadow}
                    rounded-2xl
                    border
                    flex
                    items-center
                    justify-center
                    overflow-hidden
                    no-underline
                    transition-all
                    duration-200
                    hover:-translate-y-1
                    hover:shadow-elev-3
                    animate-fade-up
                  `}
                  style={{
                    background: m.bg,
                    borderColor: m.border,
                  }}
                >
                  <Image
                    src={m.img}
                    alt={m.label}
                    width={80}
                    height={48}
                    className="absolute inset-0 h-full w-full object-contain p-2"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* TRUST PILL */
/* -------------------------------------------------------------------------- */

function TrustPill({
  color,
  label,
}: {
  color: string;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${color}`}
      />

      {label}
    </span>
  );
}