"use client";

import {
    useState,
    useEffect,
    useCallback,
    useRef,
    type ReactElement,
    type CSSProperties,
    type RefObject,
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
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
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
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="5.5" r="2.5" />
            <path d="M2.5 13.5c0-3 2-4.5 5.5-4.5s5.5 1.5 5.5 4.5" />
        </svg>
    );
}

function IconMail({ size = 16 }: IconProps): ReactElement {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" />
            <polyline points="1.5,4.5 8,9 14.5,4.5" />
        </svg>
    );
}

function IconBrandIcon({ size = 16 }: IconProps): ReactElement {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="8" height="9" rx="1.2" />
            <path d="M6 4V2.5A1.5 1.5 0 0 1 7.5 1h5A1.5 1.5 0 0 1 14 2.5V11a1.5 1.5 0 0 1-1.5 1.5H10" />
        </svg>
    );
}

function IconBox({ size = 16 }: IconProps): ReactElement {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
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
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
        validate: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
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
        validate: (v: string) => /^[+\d][\d\s\-().]{7,}$/.test(v.trim()),
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
        if (action === "set" && value !== undefined) localStorage.setItem(key, value);
        if (action === "remove") localStorage.removeItem(key);
    } catch {}
    return null;
}

function getScrollPct(): number {
    const el = document.documentElement;
    return ((window.scrollY + window.innerHeight) / el.scrollHeight) * 100;
}

// ─────────────────────────────────────────────
// Hook: is mobile?
// ─────────────────────────────────────────────
function useIsMobile(): boolean {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 639px)");
        setIsMobile(mq.matches);

        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
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
    brandGradient: "linear-gradient(135deg, #5046E5 0%, #7B73FF 100%)",
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

function inputBaseStyle(hasErr: boolean, isMobile: boolean): CSSProperties {
    return {
        width: "100%",
        // 16px on mobile prevents iOS auto-zoom on focus
        fontSize: isMobile ? "16px" : "13.5px",
        padding: isMobile ? "11px 12px 11px 38px" : "9px 12px 9px 36px",
        borderRadius: "10px",
        border: `1.5px solid ${hasErr ? COLOR.error : COLOR.border}`,
        background: hasErr ? COLOR.errorBg : COLOR.inputBg,
        outline: "none",
        transition: "border-color 0.15s, box-shadow 0.15s",
        // Remove default appearance on iOS selects
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

    const [errors, setErrors] = useState<FormErrors>({});
    const [submitError, setSubmitError] = useState("");

    const entryTime = useRef(Date.now());
    const triggered = useRef(false);
    const isForcedRef = useRef(false);
    const firstInputRef = useRef<HTMLInputElement | HTMLSelectElement | null>(null);

    const isMobile = useIsMobile();

    const openPopup = useCallback((forced = false) => {
        if (triggered.current) return;
        triggered.current = true;
        isForcedRef.current = forced;
        setVisible(true);
        setTimeout(() => {
            setAnimateIn(true);
            setTimeout(() => { firstInputRef.current?.focus(); }, 300);
        }, 20);
    }, []);

    useEffect(() => {
        if (!forcedOpen) return;
        if (safeLocalStorage("get", capturedKey) === "1") {
            onUnlock?.({} as FormValues);
            return;
        }
        triggered.current = false;
        openPopup(true);
    }, [forcedOpen, capturedKey, onUnlock, openPopup]);

    useEffect(() => {
        function tryShow() {
            if (triggered.current) return;
            if (safeLocalStorage("get", storageKey) === "1") {
                triggered.current = true;
                return;
            }
            const elapsed = (Date.now() - entryTime.current) / 1000;
            const scrollPct = getScrollPct();
            if (elapsed >= minTimeSeconds || scrollPct >= scrollThreshold) {
                openPopup(false);
            }
        }
        window.addEventListener("scroll", tryShow, { passive: true });
        const interval = setInterval(tryShow, 1000);
        return () => {
            window.removeEventListener("scroll", tryShow);
            clearInterval(interval);
        };
    }, [minTimeSeconds, scrollThreshold, openPopup, storageKey]);

    const dismiss = useCallback(() => {
        triggered.current = false;
        setAnimateIn(false);
        setTimeout(() => { setVisible(false); }, 300);
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
            if (field.validate && !field.validate(value)) {
                errs[field.id] = field.errorMsg;
            }
        }
        return errs;
    };

    const handleChange = (id: FieldId, value: string) => {
        setValues((prev) => ({ ...prev, [id]: value }));
        if (errors[id]) setErrors((prev) => ({ ...prev, [id]: undefined }));
    };

    const handleSubmit = async (): Promise<void> => {
        setSubmitError("");
        const errs = validateAll();
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        try {
            setLoading(true);
            const payload = {
                full_name: values.fullName.trim(),
                work_email: values.workEmail.trim().toLowerCase(),
                brand_name: values.brandName.trim(),
                monthly_orders: values.monthlyOrders,
                whatsapp: values.whatsapp.trim(),
            };
            const { error } = await supabase.from("leads").insert([payload]);
            if (error) {
                console.error(error);
                setSubmitError("Unable to submit form. Please try again.");
                return;
            }
            safeLocalStorage("set", storageKey, "1");
            safeLocalStorage("set", capturedKey, "1");
            onSubmit?.(values);
            if (isForcedRef.current && onUnlock) { onUnlock(values); dismiss(); return; }
            setSubmitted(true);
        } catch (err) {
            console.error(err);
            setSubmitError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!visible) return null;

    // ── Layout tokens ──────────────────────────────────────────
    // Mobile: bottom sheet sliding up from the bottom edge
    // Desktop: centered modal
    const sheetStyle: CSSProperties = isMobile
        ? {
              position: "fixed",
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9999,
              width: "100%",
              maxWidth: "100%",
              background: "#fff",
              // Rounded only on top corners for bottom-sheet feel
              borderRadius: "20px 20px 0 0",
              overflow: "hidden",
              boxShadow: "0 -8px 40px rgba(0,0,0,0.18)",
              opacity: animateIn ? 1 : 0,
              transform: animateIn ? "translateY(0)" : "translateY(100%)",
              transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
              // Cap max-height so very tall form doesn't overflow
              maxHeight: "92dvh",
              display: "flex",
              flexDirection: "column",
          }
        : {
              width: "100%",
              maxWidth: "460px",
              background: "#fff",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
              opacity: animateIn ? 1 : 0,
              transform: animateIn ? "translateY(0)" : "translateY(24px)",
              transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
          };

    const wrapperStyle: CSSProperties = isMobile
        ? {
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              // Don't center — let the sheet sit at the bottom
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
          }
        : {
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
          };

    const headerPadding = isMobile ? "16px 18px 14px" : "22px";
    const bodyPadding   = isMobile ? "14px 18px 20px" : "22px";
    const headingSize   = isMobile ? "18px" : "20px";
    const fieldGap      = isMobile ? "12px" : "14px";
    const labelSize     = isMobile ? "12px" : "12px";

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={dismiss}
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 9998,
                    background: "rgba(15,17,20,0.55)",
                    backdropFilter: "blur(3px)",
                    opacity: animateIn ? 1 : 0,
                    transition: "opacity 0.3s ease",
                }}
            />

            {/* Outer wrapper */}
            <div style={wrapperStyle}>

                {/* Modal / bottom sheet */}
                <div style={sheetStyle}>

                    {/* ── Drag handle (mobile only) ── */}
                    {isMobile && (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                paddingTop: "10px",
                                paddingBottom: "2px",
                                flexShrink: 0,
                            }}
                        >
                            <div
                                style={{
                                    width: "36px",
                                    height: "4px",
                                    borderRadius: "999px",
                                    background: COLOR.border,
                                }}
                            />
                        </div>
                    )}

                    {/* ── Header ── */}
                    <div
                        style={{
                            background: COLOR.brandGradient,
                            padding: headerPadding,
                            color: "#fff",
                            position: "relative",
                            flexShrink: 0,
                        }}
                    >
                        <button
                            onClick={dismiss}
                            aria-label="Close"
                            style={{
                                position: "absolute",
                                top: "12px",
                                right: "12px",
                                width: "32px",
                                height: "32px",
                                borderRadius: "8px",
                                border: "none",
                                background: "rgba(255,255,255,0.15)",
                                color: "#fff",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                // Larger tap target on mobile
                                padding: 0,
                            }}
                        >
                            <IconX size={14} />
                        </button>

                        <span
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "4px 10px",
                                borderRadius: "999px",
                                background: "rgba(255,255,255,0.15)",
                                fontSize: "11px",
                                marginBottom: "8px",
                            }}
                        >
                            <IconSparkle size={10} />
                            Opsell AI
                        </span>

                        <h2
                            style={{
                                margin: 0,
                                fontSize: headingSize,
                                fontWeight: 700,
                                // Give space so text doesn't collide with X button
                                paddingRight: "40px",
                            }}
                        >
                            {isForcedRef.current
                                ? "One last step to export"
                                : "Please enter your details"}
                        </h2>

                        <p style={{ margin: "6px 0 0", fontSize: "13px", opacity: 0.8 }}>
                            {isForcedRef.current
                                ? "Unlock CSV export instantly."
                                : "Get your free profitability report."}
                        </p>
                    </div>

                    {/* ── Body ── */}
                    {/* overflow-y: auto so the form scrolls inside the sheet on very small screens */}
                    <div
                        style={{
                            padding: bodyPadding,
                            overflowY: "auto",
                            WebkitOverflowScrolling: "touch",
                            flex: 1,
                        }}
                    >
                        {submitted ? (
                            <div style={{ textAlign: "center", padding: "24px 0" }}>
                                <div
                                    style={{
                                        width: "60px",
                                        height: "60px",
                                        borderRadius: "50%",
                                        margin: "0 auto 14px",
                                        background: COLOR.successBg,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: COLOR.success,
                                    }}
                                >
                                    <IconCheck size={24} />
                                </div>
                                <h3 style={{ margin: "0 0 8px", fontSize: "18px" }}>You're in!</h3>
                                <p style={{ margin: 0, color: COLOR.textMuted, fontSize: "14px" }}>
                                    We'll contact you shortly.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div style={{ display: "flex", flexDirection: "column", gap: fieldGap }}>
                                    {FIELDS.map((field, idx) => {
                                        const Icon = field.icon;
                                        const error = errors[field.id];

                                        return (
                                            <div key={field.id}>
                                                <label
                                                    style={{
                                                        display: "block",
                                                        marginBottom: "5px",
                                                        fontSize: labelSize,
                                                        fontWeight: 600,
                                                        color: COLOR.textLabel,
                                                    }}
                                                >
                                                    {field.label}
                                                </label>

                                                <div style={{ position: "relative" }}>
                                                    <span
                                                        style={{
                                                            position: "absolute",
                                                            left: "12px",
                                                            top: "50%",
                                                            transform: "translateY(-50%)",
                                                            color: "#8C919A",
                                                            pointerEvents: "none",
                                                            // Ensure icon doesn't receive touch events
                                                            zIndex: 1,
                                                        }}
                                                    >
                                                        <Icon size={14} />
                                                    </span>

                                                    {field.type === "select" ? (
                                                        <select
                                                            ref={idx === 0 ? (firstInputRef as RefObject<HTMLSelectElement>) : null}
                                                            value={values[field.id]}
                                                            onChange={(e) => handleChange(field.id, e.target.value)}
                                                            style={{
                                                                ...inputBaseStyle(!!error, isMobile),
                                                                paddingRight: "32px",
                                                                // Restore appearance just enough for the arrow
                                                                backgroundImage:
                                                                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238C919A' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")",
                                                                backgroundRepeat: "no-repeat",
                                                                backgroundPosition: "right 10px center",
                                                                backgroundColor: !!error ? COLOR.errorBg : COLOR.inputBg,
                                                            }}
                                                        >
                                                            {field.options?.map((option) => (
                                                                <option key={option.value} value={option.value}>
                                                                    {option.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                        <input
                                                            ref={idx === 0 ? (firstInputRef as RefObject<HTMLInputElement>) : null}
                                                            type={field.type}
                                                            placeholder={field.placeholder}
                                                            autoComplete={field.autoComplete}
                                                            value={values[field.id]}
                                                            onChange={(e) => handleChange(field.id, e.target.value)}
                                                            style={inputBaseStyle(!!error, isMobile)}
                                                        />
                                                    )}
                                                </div>

                                                {error && (
                                                    <p style={{ marginTop: "5px", fontSize: "12px", color: COLOR.error }}>
                                                        {error}
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {submitError && (
                                    <p style={{ marginTop: "12px", color: COLOR.error, fontSize: "13px" }}>
                                        {submitError}
                                    </p>
                                )}

                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    style={{
                                        width: "100%",
                                        marginTop: "18px",
                                        // Taller tap target on mobile (min 48px)
                                        padding: isMobile ? "15px" : "13px",
                                        borderRadius: "12px",
                                        border: "none",
                                        background: COLOR.brandGradient,
                                        color: "#fff",
                                        fontWeight: 700,
                                        fontSize: isMobile ? "15px" : "14px",
                                        cursor: "pointer",
                                        opacity: loading ? 0.7 : 1,
                                        // Prevent text selection on quick taps
                                        userSelect: "none",
                                        WebkitTapHighlightColor: "transparent",
                                    }}
                                >
                                    {loading
                                        ? "Submitting..."
                                        : isForcedRef.current
                                            ? "Unlock & Download CSV →"
                                            : "Get my free report →"}
                                </button>

                                <p
                                    style={{
                                        textAlign: "center",
                                        marginTop: "12px",
                                        // A bit more breathing room at the bottom on mobile
                                        marginBottom: isMobile ? "env(safe-area-inset-bottom, 0px)" : 0,
                                        fontSize: "11px",
                                        color: COLOR.textLight,
                                    }}
                                >
                                    🔒 Your details are private.
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}