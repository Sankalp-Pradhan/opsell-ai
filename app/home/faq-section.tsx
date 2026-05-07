import { useState } from "react";
import {  Plus, X } from "lucide-react";
import Link from "next/link";

const faqs = [
  {
    question: "What does Opsell actually do?",
    answer:
      "Opsell is the AI-led execution layer for consumer brands selling across fragmented commerce channels. It writes listings, moves prices, fires campaigns, and runs experiments via API. Every action is anchored to revenue, conversion, or margin — captures revenue you would otherwise miss.",
  },
  {
    question: "Which marketplaces does Opsell support?",
    answer:
      "Opsell works across Amazon, Shopify, Flipkart, Myntra, Meesho and other major sales channels. You can manage pricing and listings from one place.",
  },
  {
    question: "Will Opsell automatically change my prices?",
    answer:
      "Only if you want it to. You can choose between fully automatic updates, suggested recommendations, or approval before anything goes live.",
  },
  {
    question: "Can Opsell lower my margins?",
    answer:
      "No. You can set minimum margin and pricing rules, so Opsell never discounts below the limits you choose.",
  },
  {
    question: "How long does setup take?",
    answer: "Most brands connect their stores and start seeing recommendations in under 15 minutes.",
  },
  {
    question: "How quickly will I see results?",
    answer:
      "Most businesses notice pricing opportunities and listing issues within the first few days. Revenue improvements typically appear within 2–4 weeks.",
  },
  {
    question: "What if I already use spreadsheets or another repricer?",
    answer:
      "Opsell can work alongside your current process. Many teams start by using it only for recommendations before switching fully.",
  },
  {
    question: "Do I need a large catalog for this to be useful?",
    answer:
      "No. Opsell helps businesses of all sizes, but it becomes especially valuable once you manage 50+ products or sell on multiple platforms.",
  },

];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="bg-white py-20 px-6 sm:px-12 sm:py-24 md:px-16 lg:px-24">
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        {/* Left: Header */}
        <div className="lg:col-span-4">
          <p className="text-brand text-xs font-semibold tracking-[0.18em] uppercase mb-6 mx-2">
            Support
          </p>
          <h2 className="font-display text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight text-n-900">
            Questions,
            <br />
            answered{" "}
            <span className="text-brand">straight.</span>
          </h2>
          <div className="mt-6 mb-5 text-n-400 text-base max-w-sm">
            If we missed yours, the team responds personally within 24 hours.
          </div>

          <Link
            href="https://forms.gle/8oyErGWjoFwyHBub7"
            className="mt-5 rounded-[10px] border-[1.5px] border-n-200  bg-brand px-6 py-3  font-display text-[15px] font-bold text-white transition-colors hover:border-n-400 hover:text-white">
            Contact Support
          </Link>
        </div>

        {/* Right: Accordion */}
        <div className="lg:col-span-8">
          <div className="border-t border-n-border">
            {faqs.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <div key={i} className="border-b border-n-border">
                  <button
                    onClick={() => toggle(i)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-6 py-6 text-left group"
                  >
                    <span className="text-lg md:text-xl font-semibold text-n-900">
                      {faq.question}
                    </span>
                    <span
                      className={`flex-shrink-0 transition-colors ${isOpen ? "text-brand" : "text-n-400 group-hover:text-n-900"
                        }`}
                    >
                      {isOpen ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                    </span>
                  </button>
                  <div
                    className="grid transition-all duration-300 ease-out"
                    style={{
                      gridTemplateRows: isOpen ? "1fr" : "0fr",
                      opacity: isOpen ? 1 : 0,
                    }}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-6 pr-12 text-n-400 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
