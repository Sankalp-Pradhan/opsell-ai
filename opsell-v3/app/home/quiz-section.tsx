"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Zap,
  Eye,
  Tag,
  FileText,
  FlaskConical,
} from "lucide-react"

const questions = [
  {
    id: "skus",
    label: "Question 1 of 3",
    title: "How many SKUs do you manage?",
    options: [
      { label: "Under 50", value: "small" },
      { label: "50 – 500", value: "mid" },
      { label: "500+", value: "large" },
    ],
  },
  {
    id: "platforms",
    label: "Question 2 of 3",
    title: "How many platforms do you sell on?",
    options: [
      { label: "Just 1", value: "one" },
      { label: "2 to 4", value: "multi" },
      { label: "5 or more", value: "omni" },
    ],
  },
  {
    id: "repricing",
    label: "Question 3 of 3",
    title: "How do you handle repricing?",
    options: [
      { label: "Manually", value: "manual" },
      { label: "Basic rules", value: "rules" },
      { label: "Not at all", value: "none" },
    ],
  },
]

const features = [
  {
    id: "pricing",
    icon: Zap,
    name: "AI Pricing Engine",
    desc: "Tracks competitor pricing and recommends better prices automatically.",
    result: "+18% GMV with stronger margins",
    triggers: (a: Answers) =>
      a.repricing === "manual" ||
      a.repricing === "none" ||
      a.skus === "large" ||
      a.skus === "mid",
  },
  {
    id: "competitor",
    icon: Eye,
    name: "Competitor Tracker",
    desc: "Monitors rival pricing and catalog changes in real time.",
    result: "2× faster decisions",
    triggers: (a: Answers) =>
      a.platforms === "multi" ||
      a.platforms === "omni" ||
      a.repricing === "manual",
  },
  {
    id: "bundle",
    icon: Tag,
    name: "Discount Optimizer",
    desc: "Finds smarter offers and bundles without killing margin.",
    result: "+23% average order value",
    triggers: (a: Answers) =>
      a.skus === "large" || a.platforms === "omni",
  },
  {
    id: "listing",
    icon: FileText,
    name: "Listing Manager",
    desc: "Keeps titles, images and content synced everywhere.",
    result: "+15% conversion rate",
    triggers: (a: Answers) =>
      a.platforms === "multi" || a.platforms === "omni",
  },
  {
    id: "experiment",
    icon: FlaskConical,
    name: "Growth Experiments",
    desc: "Continuously tests creatives, offers and titles.",
    result: "Always-on growth",
    triggers: (a: Answers) =>
      a.platforms === "omni" || a.skus === "large",
  },
]

type Answers = {
  skus: string
  platforms: string
  repricing: string
}

function calcLeak(answers: Answers): number {
  const skuBase: Record<string, number> = {
    small: 4000,
    mid: 9000,
    large: 16000,
  }

  const platformMult: Record<string, number> = {
    one: 1,
    multi: 1.4,
    omni: 1.8,
  }

  const repricingAdd: Record<string, number> = {
    manual: 2400,
    rules: 800,
    none: 3600,
  }

  return Math.round(
    (skuBase[answers.skus] ?? 4000) *
    (platformMult[answers.platforms] ?? 1) +
    (repricingAdd[answers.repricing] ?? 800)
  )
}

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0)
  const start = useRef<number | null>(null)
  const frame = useRef<number | null>(null)

  useEffect(() => {
    setValue(0)
    start.current = null

    const animate = (now: number) => {
      if (!start.current) start.current = now

      const progress = Math.min((now - start.current) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)

      setValue(Math.round(target * eased))

      if (progress < 1) {
        frame.current = requestAnimationFrame(animate)
      }
    }

    frame.current = requestAnimationFrame(animate)

    return () => {
      if (frame.current) cancelAnimationFrame(frame.current)
    }
  }, [target, duration])

  return value
}

export default function RevenueLeakQuiz() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Partial<Answers>>({})
  const [selected, setSelected] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)

  const keys: (keyof Answers)[] = ["skus", "platforms", "repricing"]

  const finalAnswers = answers as Answers
  const leak = showResult ? calcLeak(finalAnswers) : 0
  const animatedLeak = useCountUp(leak)

  const highlighted = showResult
    ? features.filter((f) => f.triggers(finalAnswers))
    : []

  function handleSelect(value: string) {
    setSelected(value)

    setTimeout(() => {
      const key = keys[step]
      const next = { ...answers, [key]: value }

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
    <section className="relative overflow-hidden bg-[var(--surface-muted)] py-20 px-4 md:px-8">
      <div className="px-6 py-10 md:px-14 md:py-14">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-caption text-[var(--color-primary)]">
            Revenue Leak Diagnosis
          </p>

          <h2 className="mt-3 font-[var(--font-display)] text-3xl font-bold tracking-tight text-[var(--foreground)] md:text-6xl">
            What’s Costing You Money?
          </h2>

          <p className="mt-4 text-body text-[var(--muted-foreground)] md:text-base">
            Answer 3 quick questions and discover where revenue is slipping.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.35 }}
              className="mx-auto max-w-xl"
            >
              {/* Progress */}
              <div className="mb-8 flex gap-2">
                {questions.map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded-full transition-all ${i <= step
                        ? "bg-[var(--color-primary)]"
                        : "bg-[var(--color-neutral-150)]"
                      }`}
                  />
                ))}
              </div>

              <p className="text-caption text-center text-[var(--color-neutral-400)]">
                {questions[step].label}
              </p>

              <h3 className="mt-3 text-center font-[var(--font-display)] text-2xl font-semibold text-[var(--foreground)] md:text-3xl">
                {questions[step].title}
              </h3>

              <div className="mt-8 space-y-3">
                {questions[step].options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full rounded-2xl border px-5 py-4 text-left text-sm font-medium transition-all duration-200
                        ${selected === opt.value
                        ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                        : "border-[var(--border)] bg-white text-[var(--foreground)] hover:border-[var(--color-primary)] hover:bg-[var(--surface-ai)]"
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              {/* Result */}
              <div className="text-center">
                <p className="text-caption text-[var(--color-neutral-400)]">
                  Estimated monthly revenue leak
                </p>

                <div className="mt-3 font-[var(--font-display)] text-5xl font-bold tracking-tight text-[var(--foreground)] md:text-7xl">
                  ₹{animatedLeak.toLocaleString()}
                </div>

                <p className="mt-3 text-body text-[var(--muted-foreground)]">
                  Based on your answers. Here’s how Opsell helps fix it.
                </p>
              </div>

              {/* Cards */}
              <div className="mt-12 grid gap-4 md:grid-cols-2">
                {features.map((f, i) => {
                  const active = highlighted.some((x) => x.id === f.id)
                  const Icon = f.icon

                  return (
                    <motion.div
                      key={f.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: active ? 1 : 0.45, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className={`rounded-2xl border p-5 transition-all
                        ${active
                          ? "border-[var(--color-primary)] bg-[var(--surface-ai)]"
                          : "border-[var(--border)] bg-white"
                        }`}
                    >
                      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-[var(--shadow-elevated)]">
                        <Icon
                          size={18}
                          className={
                            active
                              ? "text-[var(--color-primary)]"
                              : "text-[var(--color-neutral-400)]"
                          }
                        />
                      </div>

                      <h4 className="font-semibold text-[var(--foreground)]">
                        {f.name}
                      </h4>

                      <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                        {f.desc}
                      </p>

                      <p className="mt-4 text-sm font-medium text-[var(--color-primary)]">
                        ↑ {f.result}
                      </p>
                    </motion.div>
                  )
                })}
              </div>

              {/* CTA */}
              <div className="mt-12 flex flex-col items-center gap-3">
                <button className="rounded-2xl bg-[var(--color-primary)] px-8 py-4 text-sm font-semibold text-white shadow-[var(--shadow-raised)] transition hover:scale-[1.02]">
                  Start Free Trial
                </button>

                <button
                  onClick={restart}
                  className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                >
                  Retake Quiz
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}