"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Zap,
  Eye,
  Tag,
  FileText,
  FlaskConical,
} from "lucide-react"

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */

const questions = [
  {
    id: "skus",
    label: "Question 1 of 3",
    title: "How many SKUs do you manage?",
    options: [
      { label: "Under 50", value: "under50" },
      { label: "50 – 500", value: "50to500" },
      { label: "500+", value: "500plus" },
    ],
  },
  {
    id: "revenue",
    label: "Question 2 of 3",
    title: "Annual revenue range?",
    options: [
      { label: "$1M – $5M", value: "1to5" },
      { label: "$5M – $15M", value: "5to15" },
      { label: "$15M+", value: "15plus" },
    ],
  },
  {
    id: "channels",
    label: "Question 3 of 3",
    title: "How many marketplaces do you sell on?",
    options: [
      { label: "1 – 2", value: "1to2" },
      { label: "3 – 5", value: "3to5" },
      { label: "6+", value: "6plus" },
    ],
  },
]

type Answers = {
  skus: string
  revenue: string
  channels: string
}

/* ─────────────────────────────────────────────
   FEATURE RECOMMENDATIONS
───────────────────────────────────────────── */

const features = [
  {
    id: "pricing",
    icon: Zap,
    name: "AI Pricing Engine",
    desc: "Tracks competitor pricing and recommends better prices automatically.",
    result: "+18% GMV uplift",
    triggers: (a: Answers) =>
      a.revenue === "15plus" ||
      a.channels === "6plus" ||
      a.skus === "500plus",
  },
  {
    id: "competitor",
    icon: Eye,
    name: "Competitor Tracker",
    desc: "Monitors rival pricing and catalog changes in real time.",
    result: "2× faster reactions",
    triggers: (a: Answers) =>
      a.channels === "3to5" || a.channels === "6plus",
  },
  {
    id: "bundle",
    icon: Tag,
    name: "Discount Optimizer",
    desc: "Finds smarter offers without killing margin.",
    result: "+23% AOV",
    triggers: (a: Answers) =>
      a.skus === "500plus" || a.revenue === "15plus",
  },
  {
    id: "listing",
    icon: FileText,
    name: "Listing Manager",
    desc: "Keeps titles, images and content synced everywhere.",
    result: "+15% CVR",
    triggers: (a: Answers) =>
      a.channels === "3to5" || a.channels === "6plus",
  },
  {
    id: "experiment",
    icon: FlaskConical,
    name: "Growth Experiments",
    desc: "Continuously tests creatives, offers and titles.",
    result: "Always-on growth",
    triggers: (a: Answers) =>
      a.revenue === "15plus" ||
      a.skus === "500plus",
  },
]

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */

function calcLeak(answers: Partial<Answers>) {
  const revenueBase: Record<string, [number, number]> = {
    "1to5": [12, 28],
    "5to15": [40, 90],
    "15plus": [120, 240],
  }

  const skuMult: Record<string, number> = {
    under50: 0.85,
    "50to500": 1.0,
    "500plus": 1.25,
  }

  const channelMult: Record<string, number> = {
    "1to2": 0.85,
    "3to5": 1.05,
    "6plus": 1.25,
  }

  const [low, high] =
    revenueBase[answers.revenue ?? "1to5"] ?? [12, 28]

  const sku =
    skuMult[answers.skus ?? "under50"] ?? 1

  const channel =
    channelMult[answers.channels ?? "1to2"] ?? 1

  const leakLow = Math.round((low * sku * channel) / 4)
  const leakHigh = Math.round((high * sku * channel) / 4)

  return {
    low: leakLow,
    high: leakHigh,
    formatted: `₹${leakLow}L – ₹${leakHigh}L`,
  }
}

/* ─────────────────────────────────────────────
   RIGHT PANEL
───────────────────────────────────────────── */

function RightPanel({
  answers,
  showResult,
  onRestart,
}: {
  answers: Partial<Answers>
  showResult: boolean
  onRestart: () => void
}) {
  const leak = showResult
    ? calcLeak(answers as Answers)
    : null

  const highlighted = showResult
    ? features.filter((f) => f.triggers(answers as Answers))
    : []

  const answeredCount = Object.keys(answers).length

  return (
    <div className="relative overflow-hidden rounded-3xl bg-n-900 p-8 text-white min-h-[520px]">
      <div
        className="absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle, #5046E5 0%, transparent 70%)",
        }}
      />

      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex h-full flex-col"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-n-400">
              Estimated ₹ at risk / quarter
            </p>

            <div className="mt-8 flex gap-3">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className="h-1.5 flex-1 overflow-hidden rounded-full bg-n-700"
                >
                  <motion.div
                    className="h-full bg-brand"
                    initial={{ width: 0 }}
                    animate={{
                      width:
                        i < answeredCount ? "100%" : "0%",
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="mt-10 text-5xl font-extrabold tracking-tight text-n-700">
              ₹ ——
            </div>

            <p className="mt-auto text-sm leading-relaxed text-n-500">
              Answer all three questions to reveal your
              personalized revenue leakage estimate.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-n-400">
                Estimated ₹ at risk / quarter
              </p>

              <div className="mt-4 text-5xl font-extrabold tracking-tight">
                {leak?.formatted}
              </div>

              <p className="mt-3 max-w-sm text-sm leading-relaxed text-n-400">
                Based on your catalog size, revenue band
                and marketplace spread.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {features.map((f, i) => {
                const active = highlighted.some(
                  (x) => x.id === f.id
                )

                const Icon = f.icon

                return (
                  <motion.div
                    key={f.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{
                      opacity: active ? 1 : 0.35,
                      x: 0,
                    }}
                    transition={{
                      delay: i * 0.05,
                    }}
                    className={`flex items-start gap-3 rounded-2xl border p-4 transition-all ${
                      active
                        ? "border-brand/40 bg-n-800"
                        : "border-n-700 bg-n-800/40"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        active
                          ? "bg-brand/20"
                          : "bg-n-700"
                      }`}
                    >
                      <Icon
                        size={16}
                        className={
                          active
                            ? "text-brand-mid"
                            : "text-n-500"
                        }
                      />
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">
                        {f.name}
                      </p>

                      <p className="mt-1 text-xs leading-relaxed text-n-500">
                        {f.desc}
                      </p>
                    </div>

                    {active && (
                      <span className="text-xs font-semibold text-brand-mid">
                        {f.result}
                      </span>
                    )}
                  </motion.div>
                )
              })}
            </div>

            <div className="pt-2">
              <button className="w-full rounded-2xl bg-brand px-6 py-4 text-sm font-semibold text-white transition hover:scale-[1.01] hover:bg-brand-dark active:scale-[0.99]">
                Start Free Trial
              </button>

              <button
                onClick={onRestart}
                className="mt-4 w-full text-center text-xs text-n-500 transition hover:text-n-300"
              >
                Retake Quiz
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */

export default function RevenueLeakQuiz() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] =
    useState<Partial<Answers>>({})
  const [selected, setSelected] = useState<
    string | null
  >(null)
  const [showResult, setShowResult] =
    useState(false)

  const keys: (keyof Answers)[] = [
    "skus",
    "revenue",
    "channels",
  ]

  function handleSelect(value: string) {
    setSelected(value)

    setTimeout(() => {
      const key = keys[step]

      const next = {
        ...answers,
        [key]: value,
      }

      setAnswers(next)
      setSelected(null)

      if (step < questions.length - 1) {
        setStep((p) => p + 1)
      } else {
        setShowResult(true)
      }
    }, 250)
  }

  function restart() {
    setStep(0)
    setAnswers({})
    setSelected(null)
    setShowResult(false)
  }

  return (
    <section className="min-h-screen bg-white px-6 py-20 sm:px-12 sm:py-24 md:px-16 lg:px-24">
  <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-14">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-brand">
            Revenue Leak Diagnosis
          </p>

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-n-900 md:text-6xl">
              Discover how much revenue your catalog is leaking.
            </h1>

            <p className="max-w-sm text-sm leading-relaxed text-n-500 md:text-right md:text-base">
              Three quick questions. We'll estimate the
              quarterly ₹ at risk and show which Opsell
              systems recover it fastest.
            </p>
          </div>
        </div>

        {/* CARD */}
        <div className="grid gap-6 rounded-[32px] border border-n-border bg-n-50 p-6 shadow-elev-2 md:grid-cols-2 md:p-10">

          {/* LEFT */}
          <div>
            <AnimatePresence mode="wait">
              {!showResult ? (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="flex flex-col gap-8"
                >
                  <div className="flex gap-2">
                    {questions.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                          i <= step
                            ? "bg-brand"
                            : "bg-n-200"
                        }`}
                      />
                    ))}
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-n-400">
                      {questions[step].label}
                    </p>

                    <h2 className="text-3xl font-bold leading-tight text-n-900">
                      {questions[step].title}
                    </h2>
                  </div>

                  <div className="flex flex-col gap-3">
                    {questions[step].options.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() =>
                          handleSelect(opt.value)
                        }
                        className={`group flex items-center rounded-2xl border px-5 py-4 text-left text-sm font-medium transition-all duration-200 ${
                          selected === opt.value
                            ? "border-brand bg-brand text-white shadow-md"
                            : "border-n-border bg-white text-n-800 hover:border-brand hover:bg-brand-light"
                        }`}
                      >
                        <span
                          className={`mr-3 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all ${
                            selected === opt.value
                              ? "border-white bg-white"
                              : "border-n-300 group-hover:border-brand"
                          }`}
                        >
                          {selected === opt.value && (
                            <span className="h-2 w-2 rounded-full bg-brand" />
                          )}
                        </span>

                        {opt.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-6"
                >
                  <div className="inline-flex w-fit items-center gap-2 rounded-full bg-success-light px-4 py-2 text-xs font-semibold text-success">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
                    Analysis Complete
                  </div>

                  <h2 className="text-3xl font-bold leading-tight text-n-900">
                    Your revenue recovery opportunities are ready.
                  </h2>

                  <p className="max-w-lg text-sm leading-relaxed text-n-500">
                    Opsell typically helps brands recover
                    60–80% of detected leakage within the
                    first quarter through pricing,
                    monitoring and catalog optimization.
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {questions.map((q, i) => {
                      const key =
                        keys[i] as keyof Answers

                      const val = answers[key]

                      const opt = q.options.find(
                        (o) => o.value === val
                      )

                      return opt ? (
                        <span
                          key={q.id}
                          className="rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-brand-dark"
                        >
                          {opt.label}
                        </span>
                      ) : null
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT */}
          <RightPanel
            answers={answers}
            showResult={showResult}
            onRestart={restart}
          />
        </div>
      </div>
    </section>
  )
}