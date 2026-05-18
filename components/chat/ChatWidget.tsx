"use client"

import emailjs from "@emailjs/browser";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { Sparkles, TrendingUp, X, Send, MessageCircleIcon, Loader2, CheckCircle, Calendar, User, Mail, Phone } from "lucide-react";

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

// ─── Types ────────────────────────────────────────────────────────────────────

interface QuickAction { label: string; value: string; }
interface Message {
  id: string;
  role: "bot" | "user";
  content: string;
  actions?: QuickAction[];
  form?: boolean;
  success?: boolean;
}

// ─── FloatingButton ───────────────────────────────────────────────────────────

function FloatingButton({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={open ? "Close chat" : "Open chat"}
      className="w-14 h-14 rounded-full bg-brand hover:bg-brand-dark text-white flex items-center justify-center shadow-elev-3 transition-all duration-200 hover:scale-105 active:scale-95 border-0 cursor-pointer"
    >
      {open ? <X size={22} /> : <MessageCircleIcon size={22} />}
    </button>
  );
}

// ─── MessageBubble ────────────────────────────────────────────────────────────

function MessageBubble({ message }: { message: Message }) {
  const isBot = message.role === "bot";
  return (
    <div className={`flex gap-2 items-end ${isBot ? "justify-start" : "justify-end"}`}>
      {isBot && (
        <div aria-hidden className="w-7 h-7 rounded-full shrink-0 bg-brand flex items-center justify-center">
          <MessageCircleIcon size={13} className="text-white" />
        </div>
      )}
      <div className={`max-w-[75%] px-3.5 py-2.5 text-ds-body leading-relaxed ${isBot ? "bg-n-100 text-n-900 rounded-sm rounded-tr-2xl rounded-br-2xl rounded-bl-2xl" : "bg-brand text-white rounded-2xl rounded-br-sm"}`}>
        {message.content}
        {message.success && (
          <p className={`mt-1.5 text-ds-body-sm ${isBot ? "text-success" : "text-green-200"}`}>✓ You&apos;re all set!</p>
        )}
      </div>
    </div>
  );
}

// ─── QuickActions ─────────────────────────────────────────────────────────────

function QuickActions({ actions, onSelect }: { actions: QuickAction[]; onSelect: (value: string, label: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2 pl-9">
      {actions.map((a) => (
        <button
          key={a.value}
          onClick={() => onSelect(a.value, a.label)}
          className="px-3.5 py-1.5 rounded-full border border-brand text-brand bg-white text-ds-body-sm font-medium hover:bg-brand hover:text-white transition-all duration-150 cursor-pointer"
        >
          {a.label}
        </button>
      ))}
    </div>
  );
}

// ─── TypingIndicator ──────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex gap-1 px-3.5 py-2.5 bg-n-100 rounded-sm rounded-tr-2xl rounded-br-2xl rounded-bl-2xl w-fit">
      {[0, 1, 2].map((i) => (
        <span key={i} className="w-1.5 h-1.5 rounded-full bg-n-400 inline-block animate-ai-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
      ))}
    </div>
  );
}

// ─── LeadCaptureForm (with EmailJS) ──────────────────────────────────────────

function LeadCaptureForm({ onSubmit }: { onSubmit: () => void }) {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", date: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const ready = Boolean(formData.name && formData.email && formData.phone && formData.date);
  console.log("Sending to EmailJS:", {
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    date: formData.date,
  });

  const inputs = [
    { key: "name", placeholder: "Your name", type: "text", icon: User },
    { key: "email", placeholder: "Email address", type: "email", icon: Mail },
    { key: "phone", placeholder: "Phone number", type: "tel", icon: Phone },
    { key: "date", placeholder: "Preferred date", type: "date", icon: Calendar },
  ] as const;

  const handleSubmit = async () => {
    if (!ready) return;
    setLoading(true);
    setError("");
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          date: formData.date,
        },
        EMAILJS_PUBLIC_KEY
      );
      onSubmit();
    } catch (err) {
      console.error("EmailJS error:", err);
      setError("Failed to send. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ml-9 bg-n-50 border border-n-border rounded-xl p-4 flex flex-col gap-2.5">
      {inputs.map(({ key, placeholder, type, icon: Icon }) => (
        <div key={key} className="relative">
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-n-400" />
          <input
            type={type}
            placeholder={placeholder}
            value={formData[key]}
            onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-n-border text-ds-body text-n-900 placeholder:text-n-400 bg-white outline-none focus:border-brand transition-colors duration-150"
          />
        </div>
      ))}

      {error && <p className="text-xs text-red-500 text-center">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={!ready || loading}
        className={`w-full py-2 rounded-lg bg-brand text-white text-ds-body font-semibold flex items-center justify-center gap-1.5 transition-all duration-150 ${ready && !loading ? "hover:bg-brand-dark cursor-pointer opacity-100" : "opacity-50 cursor-not-allowed"}`}
      >
        {loading
          ? <Loader2 size={14} className="animate-spin" />
          : <><Send size={14} /> Book my call</>
        }
      </button>
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const initialActions: QuickAction[] = [
  { label: "Increase conversions", value: "conversions" },
  { label: "Track profits", value: "profits" },
  { label: "Boost listings", value: "listing" },
  { label: "See live demo", value: "demo" },
];

const flows: Record<string, { reply: string; actions: QuickAction[] }> = {
  conversions: {
    reply: "Opsell helps identify drop-offs, high-performing products, and conversion opportunities in real time.",
    actions: [
      { label: "Watch Demo", value: "demo" },
      { label: "See Dashboard", value: "dashboard" },
      { label: "Book a Call", value: "book" },
    ],
  },
  profits: {
    reply: "Track real margins, ad spend, shipping costs, and hidden profit leaks automatically with Opsell.",
    actions: [
      { label: "View Analytics", value: "analytics" },
      { label: "Explore Features", value: "features" },
      { label: "Book Demo", value: "book" },
    ],
  },
  listing: {
    reply: "Optimize your listings and boost your visibility.",
    actions: [
      { label: "See Insights", value: "insights" },
      { label: "Learn More", value: "features" },
      { label: "Schedule Demo", value: "book" },
    ],
  },
  demo: {
    reply: "Want a personalized walkthrough of Opsell?",
    actions: [
      { label: "Schedule a Call", value: "book" },
      { label: "Watch Product Tour", value: "tour" },
    ],
  },
  dashboard: {
    reply: "Our dashboard surfaces every key metric — revenue, AOV, CAC, LTV — in one premium view.",
    actions: [
      { label: "Book Demo", value: "book" },
      { label: "See Insights", value: "insights" },
    ],
  },
  analytics: {
    reply: "Get cohort retention, channel attribution, and SKU-level profitability — all live.",
    actions: [
      { label: "Schedule Demo", value: "book" },
      { label: "Learn More", value: "features" },
    ],
  },
  insights: {
    reply: "Opsell's insights engine flags wins and leaks daily so your team acts faster.",
    actions: [
      { label: "Book a Call", value: "book" },
      { label: "Explore Features", value: "features" },
    ],
  },
  features: {
    reply: "Profit tracking, ROAS optimization, cohort analytics, attribution, alerts — built for ecommerce growth.",
    actions: [
      { label: "Book Demo", value: "book" },
      { label: "Watch Tour", value: "tour" },
    ],
  },
  tour: {
    reply: "Our 3-minute product tour walks through every core workflow. Want to book a call after?",
    actions: [
      { label: "Yes, book a call", value: "book" },
      { label: "Maybe Later", value: "later" },
    ],
  },
};

let idCounter = 0;
const nid = () => `m-${Date.now()}-${++idCounter}`;

// ─── ChatWidget ───────────────────────────────────────────────────────────────

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bootRef = useRef(false);



  useEffect(() => {
    if (open && !bootRef.current) {
      bootRef.current = true;
      pushBot("Hi 👋 Want to increase your ecommerce growth?", initialActions);
    }
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing]);

  function pushBot(content: string, actions?: QuickAction[], extra: Partial<Message> = {}) {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { id: nid(), role: "bot", content, actions, ...extra }]);
    }, 700);
  }

  function pushUser(content: string) {
    setMessages((m) => {
      const stripped = m.map((msg, i) =>
        i === m.length - 1 && msg.role === "bot" ? { ...msg, actions: undefined } : msg
      );
      return [...stripped, { id: nid(), role: "user", content }];
    });
  }

  function handleAction(value: string, label: string) {

    pushUser(label);
    setTimeout(() => {
      if (value === "book") {
        pushBot("Would you like me to schedule a quick call with our team?", [
          { label: "Yes", value: "yes" },
          { label: "Maybe Later", value: "later" },
        ]);
        return;
      }
      if (value === "yes") {
        pushBot("Awesome — drop your details and we'll lock it in:", undefined, { form: true });
        return;
      }
      if (value === "later") {
        pushBot("No worries — explore more whenever you're ready.", initialActions);
        return;
      }
      const f = flows[value];
      if (f) pushBot(f.reply, f.actions);
      else pushBot("Got it — what else can I help with?", initialActions);
    }, 150);
  }

  function handleFormSubmit() {
    setMessages((m) => m.map((msg) => (msg.form ? { ...msg, form: false } : msg)));
    pushUser("Submitted my details");
    setTimeout(() => {
      pushBot("Perfect 👌 Our team will connect with you shortly.", undefined, { success: true });
    }, 200);
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.94 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="origin-bottom-right w-[min(380px,calc(100vw-3rem))] h-[600px] max-h-[calc(100vh-6rem)] bg-white/95 backdrop-blur-md rounded-3xl shadow-elev-3 border border-n-border overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-n-border bg-ai-bg flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl bg-brand flex items-center justify-center shrink-0 shadow-elev-2">
                <MessageCircleIcon size={18} className="text-white" />
                <span aria-hidden className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success border-2 border-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-ds-h3 text-n-900 truncate">Opsell Growth Assistant</p>
                <p className="text-ds-caption text-n-500 flex items-center gap-1 mt-0.5">
                  <TrendingUp size={11} aria-hidden /> Online · replies instantly
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="w-7 h-7 rounded-lg flex items-center justify-center text-n-400 hover:text-n-700 hover:bg-n-100 transition-colors duration-150 cursor-pointer border-0 bg-transparent"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4">
              <AnimatePresence initial={false}>
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22 }}
                    className="flex flex-col gap-2.5"
                  >
                    <MessageBubble message={m} />
                    {m.actions && m.actions.length > 0 && (
                      <QuickActions actions={m.actions} onSelect={handleAction} />
                    )}
                    {m.form && <LeadCaptureForm onSubmit={handleFormSubmit} />}
                  </motion.div>
                ))}
              </AnimatePresence>
              {typing && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="pl-9">
                  <TypingIndicator />
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-n-border text-center text-ds-caption text-n-400">
              Powered by <span className="font-semibold text-n-700">Opsell</span> · Ecommerce growth, on autopilot
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <FloatingButton open={open} onClick={() => setOpen((o) => !o)} />
    </div>
  );
}