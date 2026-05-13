"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactElement,
  type CSSProperties,
} from "react";

import { supabase } from "@/lib/supabase";

// ─────────────────────────────────────────────
// Icon components
// ─────────────────────────────────────────────
interface IconProps {
  size?: number;
}

function IconX({ size = 16 }: IconProps): ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line x1="3" y1="3" x2="13" y2="13" />
      <line x1="13" y1="3" x2="3" y2="13" />
    </svg>
  );
}

function IconSparkle({ size = 14 }: IconProps): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 1l1.5 4.5L14 7l-4.5 1.5L8 13l-1.5-4.5L2 7l4.5-1.5z" />
    </svg>
  );
}

function IconUser({ size = 16 }: IconProps): ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="5.5" r="2.5" />
      <path d="M2.5 13.5c0-3 2-4.5 5.5-4.5s5.5 1.5 5.5 4.5" />
    </svg>
  );
}

function IconMail({ size = 16 }: IconProps): ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" />
      <polyline points="1.5,4.5 8,9 14.5,4.5" />
    </svg>
  );
}

function IconBrandIcon({ size = 16 }: IconProps): ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="4" width="8" height="9" rx="1.2" />
      <path d="M6 4V2.5A1.5 1.5 0 0 1 7.5 1h5A1.5 1.5 0 0 1 14 2.5V11a1.5 1.5 0 0 1-1.5 1.5H10" />
    </svg>
  );
}

function IconBox({ size = 16 }: IconProps): ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="1.5,5 8,1.5 14.5,5" />
      <polyline points="1.5,5 1.5,12 8,14.5 14.5,12 14.5,5" />
      <line x1="8" y1="1.5" x2="8" y2="14.5" />
      <polyline points="1.5,5 8,8.5 14.5,5" />
    </svg>
  );
}

function IconWhatsApp({ size = 16 }: IconProps): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 1C4.134 1 1 4.134 1 8c0 1.26.335 2.44.917 3.46L1 15l3.628-.887A7 7 0 1 0 8 1zm0 1.4A5.6 5.6 0 1 1 8 13.6a5.574 5.574 0 0 1-2.891-.808l-.207-.126-2.154.526.545-2.09-.14-.216A5.574 5.574 0 0 1 2.4 8 5.6 5.6 0 0 1 8 2.4zm-1.68 2.45c-.15-.33-.31-.337-.455-.343l-.387-.007c-.134 0-.352.05-.536.25-.184.2-.7.684-.7 1.669s.717 1.936.817 2.07c.1.134 1.387 2.2 3.407 2.994 1.686.665 2.03.533 2.396.5.367-.033 1.183-.484 1.35-.951.166-.467.166-.868.116-.951-.05-.084-.184-.134-.384-.234-.2-.1-1.183-.584-1.367-.65-.184-.067-.317-.1-.45.1-.134.2-.517.65-.633.784-.117.134-.234.15-.434.05-.2-.1-.843-.31-1.606-.991-.594-.53-.995-1.183-1.112-1.383-.117-.2-.013-.308.088-.407.09-.09.2-.234.3-.35.1-.117.134-.2.2-.334.067-.133.034-.25-.017-.35-.05-.1-.44-1.09-.617-1.486z" />
    </svg>
  );
}

function IconCheck({ size = 16 }: IconProps): ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="2.5,8.5 6,12 13.5,4" />
    </svg>
  );
}

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type FieldId =
  | "fullName"
  | "workEmail"
  | "brandName"
  | "monthlyOrders"
  | "whatsapp";

interface SelectOption {
  value: string;
  label: string;
}

interface FieldConfig {
  id: FieldId;
  label: string;
  type: "text" | "email" | "tel" | "select";
  placeholder?: string;
  icon: (props: IconProps) => ReactElement;
  autoComplete?: string;
  required: boolean;
  options?: SelectOption[];
  validate?: (value: string) => boolean;
  errorMsg?: string;
}

type FormValues = Record<FieldId, string>;
type FormErrors = Partial<Record<FieldId, string>>;

export interface LeadCapturePopupProps {
  scrollThreshold?: number;
  minTimeSeconds?: number;
  storageKey?: string;
  onSubmit?: (data: FormValues) => void;
  open?: boolean;
  onUnlock?: (data: FormValues) => void;
  capturedKey?: string;
}

// ─────────────────────────────────────────────
// Field Config
// ─────────────────────────────────────────────
const FIELDS: FieldConfig[] = [
  {
    id: "fullName",
    label: "Full Name",
    type: "text",
    placeholder: "Rahul Sharma",
    icon: IconUser,
    autoComplete: "name",
    required: true,
  },
  {
    id: "workEmail",
    label: "Work Email",
    type: "email",
    placeholder: "rahul@brand.com",
    icon: IconMail,
    autoComplete: "email",
    required: true,
    validate: (v: string) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    errorMsg: "Enter a valid email address",
  },
  {
    id: "brandName",
    label: "Brand Name",
    type: "text",
    placeholder: "e.g. Mamaearth, Boat",
    icon: IconBrandIcon,
    autoComplete: "organization",
    required: true,
  },
  {
    id: "monthlyOrders",
    label: "Monthly Orders",
    type: "select",
    icon: IconBox,
    required: true,
    options: [
      { value: "", label: "Select range…" },
      { value: "0-100", label: "0 – 100 orders/mo" },
      { value: "100-500", label: "100 – 500 orders/mo" },
      { value: "500-2000", label: "500 – 2,000 orders/mo" },
      { value: "2000-10000", label: "2,000 – 10,000 orders/mo" },
      { value: "10000+", label: "10,000+ orders/mo" },
    ],
  },
  {
    id: "whatsapp",
    label: "WhatsApp Number",
    type: "tel",
    placeholder: "+91 98765 43210",
    icon: IconWhatsApp,
    autoComplete: "tel",
    required: true,
    validate: (v: string) =>
      /^[+\d][\d\s\-().]{7,}$/.test(v.trim()),
    errorMsg: "Enter a valid WhatsApp number",
  },
];

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function safeLocalStorage(
  action: "get" | "set" | "remove",
  key: string,
  value?: string
): string | null {
  try {
    if (action === "get") return localStorage.getItem(key);

    if (action === "set" && value !== undefined) {
      localStorage.setItem(key, value);
    }

    if (action === "remove") {
      localStorage.removeItem(key);
    }
  } catch {}

  return null;
}

function getScrollPct(): number {
  if (typeof window === "undefined") return 0;

  const el = document.documentElement;

  return (
    ((window.scrollY + window.innerHeight) /
      el.scrollHeight) *
    100
  );
}

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");

    setIsMobile(mq.matches);

    const handler = (e: MediaQueryListEvent) =>
      setIsMobile(e.matches);

    mq.addEventListener("change", handler);

    return () => {
      mq.removeEventListener("change", handler);
    };
  }, []);

  return isMobile;
}

// ─────────────────────────────────────────────
// Colors
// ─────────────────────────────────────────────
const COLOR = {
  brand: "#5046E5",
  brandDark: "#3B32C4",
  brandLight: "rgba(80,70,229,0.12)",
  brandGradient:
    "linear-gradient(135deg, #5046E5 0%, #7B73FF 100%)",
  error: "#EF4444",
  errorBg: "#FEF2F2",
  success: "#16A34A",
  successBg: "#ECFDF5",
  border: "#E2E4E8",
  inputBg: "#F8F9FA",
  text: "#0F1114",
  textMuted: "#6B707A",
  textLight: "#B0B4BC",
  textLabel: "#4A4F57",
} as const;

function inputBaseStyle(
  hasErr: boolean,
  isMobile: boolean
): CSSProperties {
  return {
    width: "100%",
    fontSize: isMobile ? "16px" : "13.5px",
    padding: isMobile
      ? "11px 12px 11px 38px"
      : "9px 12px 9px 36px",
    borderRadius: "10px",
    border: `1.5px solid ${
      hasErr ? COLOR.error : COLOR.border
    }`,
    background: hasErr
      ? COLOR.errorBg
      : COLOR.inputBg,
    outline: "none",
    transition:
      "border-color 0.15s, box-shadow 0.15s",
    WebkitAppearance: "none",
    appearance: "none",
    boxSizing: "border-box",
  };
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
export default function LeadCapturePopup({
  scrollThreshold = 85,
  minTimeSeconds = 15,
  storageKey = "opsell-lead-popup-dismissed",
  onSubmit,
  open: forcedOpen = false,
  onUnlock,
  capturedKey = "opsell-lead-captured",
}: LeadCapturePopupProps): ReactElement | null {
  const [visible, setVisible] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [values, setValues] = useState<FormValues>({
    fullName: "",
    workEmail: "",
    brandName: "",
    monthlyOrders: "",
    whatsapp: "",
  });

  const [errors, setErrors] =
    useState<FormErrors>({});

  const [submitError, setSubmitError] =
    useState("");

  const entryTime = useRef(Date.now());
  const triggered = useRef(false);
  const isForcedRef = useRef(false);

  const firstInputRef =
    useRef<HTMLInputElement | HTMLSelectElement | null>(
      null
    );

  const isMobile = useIsMobile();

  const openPopup = useCallback(
    (forced = false) => {
      if (triggered.current) return;

      triggered.current = true;
      isForcedRef.current = forced;

      setVisible(true);

      setTimeout(() => {
        setAnimateIn(true);

        setTimeout(() => {
          firstInputRef.current?.focus();
        }, 300);
      }, 20);
    },
    []
  );

  useEffect(() => {
    if (!forcedOpen) return;

    if (
      safeLocalStorage("get", capturedKey) ===
      "1"
    ) {
      onUnlock?.({} as FormValues);
      return;
    }

    triggered.current = false;
    openPopup(true);
  }, [
    forcedOpen,
    capturedKey,
    onUnlock,
    openPopup,
  ]);

  useEffect(() => {
    function tryShow() {
      if (triggered.current) return;

      if (
        safeLocalStorage("get", storageKey) ===
        "1"
      ) {
        triggered.current = true;
        return;
      }

      const elapsed =
        (Date.now() - entryTime.current) / 1000;

      const scrollPct = getScrollPct();

      if (
        elapsed >= minTimeSeconds ||
        scrollPct >= scrollThreshold
      ) {
        openPopup(false);
      }
    }

    window.addEventListener("scroll", tryShow, {
      passive: true,
    });

    const interval = setInterval(tryShow, 1000);

    return () => {
      window.removeEventListener(
        "scroll",
        tryShow
      );

      clearInterval(interval);
    };
  }, [
    minTimeSeconds,
    scrollThreshold,
    openPopup,
    storageKey,
  ]);

  const dismiss = useCallback(() => {
    triggered.current = false;

    setAnimateIn(false);

    setTimeout(() => {
      setVisible(false);
    }, 300);

    safeLocalStorage("set", storageKey, "1");
  }, [storageKey]);

  const validateAll = (): FormErrors => {
    const errs: FormErrors = {};

    for (const field of FIELDS) {
      const value = values[field.id];

      if (field.required && !value.trim()) {
        errs[field.id] = `${field.label} is required`;
        continue;
      }

      if (
        field.validate &&
        !field.validate(value)
      ) {
        errs[field.id] = field.errorMsg;
      }
    }

    return errs;
  };

  const handleChange = (
    id: FieldId,
    value: string
  ) => {
    setValues((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (errors[id]) {
      setErrors((prev) => ({
        ...prev,
        [id]: undefined,
      }));
    }
  };

  const handleSubmit = async (): Promise<void> => {
    setSubmitError("");

    const errs = validateAll();

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    try {
      setLoading(true);

      const payload = {
        full_name: values.fullName.trim(),
        work_email: values.workEmail
          .trim()
          .toLowerCase(),
        brand_name: values.brandName.trim(),
        monthly_orders: values.monthlyOrders,
        whatsapp: values.whatsapp.trim(),
      };

      const { error } = await supabase
        .from("leads")
        .insert([payload]);

      if (error) {
        console.error(error);

        setSubmitError(
          "Unable to submit form. Please try again."
        );

        return;
      }

      safeLocalStorage(
        "set",
        storageKey,
        "1"
      );

      safeLocalStorage(
        "set",
        capturedKey,
        "1"
      );

      onSubmit?.(values);

      if (isForcedRef.current && onUnlock) {
        onUnlock(values);
        dismiss();
        return;
      }

      setSubmitted(true);
    } catch (err) {
      console.error(err);

      setSubmitError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return <div>...</div>;
}