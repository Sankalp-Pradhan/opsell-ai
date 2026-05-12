"use client";

import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  RefObject,
} from "react";
import { createPortal } from "react-dom";

import {
  PLATFORMS,
  SELLER_TIERS,
  SHIPPING_ZONES,
  ORDER_TYPES,
} from "../data/platforms";

import { CATEGORIES } from "../data/categories";

import {
  IconGear,
  IconClose,
  IconAlert,
  IconHelp,
  IconPlus,
  IconMinus,
} from "./Icon";

/* -------------------------------------------------------------------------- */
/* TYPES */
/* -------------------------------------------------------------------------- */

interface Platform {
  name: string;
  color: string;
  fbxProgram?: string | null;
  hasSellerTier?: boolean;
  hasShippingZone?: boolean;
  hasCOD?: boolean;
  hasWeight?: boolean;
}

interface PlatformSetting {
  category?: string;
  fulfillmentMethod?: string;
  sellerTier?: string;
  shippingZone?: string;
  orderType?: string;
}

type GlobalSettings = Record<string, PlatformSetting>;

interface Product {
  sellingPrice: number | "";
  cogs: number | "";
  weight: number | "";
  returnRate: number | "";
  shippingCostToBuyer: number | "";
  adsSpend: number | "";
  selectedPlatforms: string[];
}

/* -------------------------------------------------------------------------- */
/* HELPERS */
/* -------------------------------------------------------------------------- */

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/* -------------------------------------------------------------------------- */
/* TOOLTIP */
/* -------------------------------------------------------------------------- */

function Tip({ text }: { text: string }) {
  return (
    <div className="group relative inline-flex">
      <button
        type="button"
        aria-label={text}
        className="
          ml-1.5
          flex h-4 w-4 items-center justify-center
          rounded-full
          bg-n-100
          text-n-500
          transition-colors
          hover:bg-brand-light
          hover:text-brand
        "
      >
        <IconHelp size={10} />
      </button>

      <div
        className="
          pointer-events-none
          absolute left-1/2 top-[120%]
          z-50
          hidden w-56 -translate-x-1/2
          rounded-xl
          border border-n-border
          bg-white
          p-3
          text-ds-caption
          text-n-600
          shadow-elev-3
          group-hover:block
        "
      >
        {text}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* INPUT */
/* -------------------------------------------------------------------------- */

interface InputFieldProps {
  label: string;
  value: number | "";
  onChange: (value: number | "") => void;
  tooltip?: string;
  suffix?: string;
  warning?: string;
}

function InputField({
  label,
  value,
  onChange,
  tooltip,
  suffix,
  warning,
}: InputFieldProps) {
  return (
    <div className="space-y-2">
      <label className="flex items-center text-ds-body-sm font-medium text-n-600">
        {label}
        {tooltip && <Tip text={tooltip} />}
      </label>

      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => {
            if (e.target.value === "") return onChange("");
            onChange(Number(e.target.value));
          }}
          className={cn(
            `
              h-12 w-full
              rounded-xl
              border
              bg-white
              px-4
              font-mono
              text-ds-body
              text-n-900
              outline-none
              transition-all
              border-n-border
              focus:border-brand
              focus:ring-4
              focus:ring-brand/10
            `,
            warning &&
              "border-error bg-error-light focus:ring-error/10"
          )}
          placeholder="0"
        />

        {suffix && (
          <span
            className="
              absolute right-4 top-1/2
              -translate-y-1/2
              text-ds-body-sm
              text-n-400
            "
          >
            {suffix}
          </span>
        )}
      </div>

      {warning && (
        <p
          className="
            flex items-center gap-1.5
            text-ds-caption
            font-medium
            text-error
          "
        >
          <IconAlert size={12} />
          {warning}
        </p>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* SELECT */
/* -------------------------------------------------------------------------- */

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
}) {
  return (
    <div className="space-y-2">
      <label className="text-ds-caption font-semibold uppercase tracking-wide text-n-500">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          h-11 w-full
          rounded-xl
          border border-n-border
          bg-white
          px-3
          text-ds-body-sm
          text-n-700
          outline-none
          transition-all
          focus:border-brand
          focus:ring-4
          focus:ring-brand/10
        "
      >
        <option value="">Select…</option>

        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* TOGGLE */
/* -------------------------------------------------------------------------- */

function ToggleField({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-ds-caption font-semibold uppercase tracking-wide text-n-500">
        {label}
      </label>

      <div className="flex rounded-xl border border-n-border bg-n-50 p-1">
        {options.map((option) => {
          const active = option === value;

          return (
            <button
              key={option}
              onClick={() => onChange(option)}
              className={cn(
                `
                  flex-1 rounded-lg
                  px-3 py-2
                  text-ds-caption
                  font-semibold
                  transition-all
                `,
                active
                  ? "bg-brand text-white shadow-elev-1"
                  : "text-n-500 hover:text-n-800"
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* ADS SPEND */
/* -------------------------------------------------------------------------- */

function AdsSpendField({
  value,
  onChange,
}: {
  value: number | "";
  onChange: (v: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [budget, setBudget] = useState("");
  const [units, setUnits] = useState("");

  const perUnit =
    Number(budget) > 0 && Number(units) > 0
      ? Math.round(Number(budget) / Number(units))
      : null;

  return (
    <div className="col-span-full space-y-3">
      <InputField
        label="Ads Spend"
        value={value}
        onChange={(v) => onChange(v as number)}
        tooltip="Monthly ad budget ÷ expected monthly sales."
      />

      <button
        onClick={() => setOpen(!open)}
        className="
          inline-flex items-center gap-2
          text-ds-caption
          font-semibold
          text-brand
          transition-opacity
          hover:opacity-80
        "
      >
        {open ? (
          <IconMinus size={12} />
        ) : (
          <IconPlus size={12} />
        )}

        {open
          ? "Hide calculator"
          : "Calculate per-unit spend"}
      </button>

      {open && (
        <div
          className="
            rounded-2xl
            border border-ai-border
            bg-ai-bg
            p-4
            animate-fade-up
          "
        >
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="number"
              value={budget}
              onChange={(e) =>
                setBudget(e.target.value)
              }
              placeholder="5000"
              className="
                h-10 w-28
                rounded-lg
                border border-n-border
                px-3
                text-sm
              "
            />

            <span className="font-mono text-n-400">
              ÷
            </span>

            <input
              type="number"
              value={units}
              onChange={(e) =>
                setUnits(e.target.value)
              }
              placeholder="100"
              className="
                h-10 w-24
                rounded-lg
                border border-n-border
                px-3
                text-sm
              "
            />

            <span className="font-mono text-n-400">
              =
            </span>

            <span className="font-mono font-bold text-brand">
              {perUnit != null
                ? `₹${perUnit}`
                : "—"}
            </span>

            <button
              disabled={perUnit == null}
              onClick={() => {
                if (perUnit != null) {
                  onChange(perUnit);
                  setOpen(false);
                }
              }}
              className="
                rounded-xl
                bg-brand
                px-4 py-2
                text-ds-caption
                font-semibold
                text-white
                shadow-elev-1
                transition-all
                hover:bg-brand-dark
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              Use value
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* POPOVER */
/* -------------------------------------------------------------------------- */

function PlatformSettingsPopover({
  id,
  platform,
  anchorRef,
  onClose,
  globalSettings,
  onUpdateSetting,
}: {
  id: string;
  platform: Platform;
  anchorRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  globalSettings: GlobalSettings;
  onUpdateSetting: (
    id: string,
    setting: Partial<PlatformSetting>
  ) => void;
}) {
  const popoverRef =
    useRef<HTMLDivElement>(null);

  const [pos, setPos] = useState({
    top: 0,
    left: 0,
  });

  const computePosition = useCallback(() => {
    const anchor = anchorRef.current;

    if (!anchor) return;

    const rect =
      anchor.getBoundingClientRect();

    setPos({
      top: rect.bottom + 10,
      left: rect.left,
    });
  }, [anchorRef]);

  useLayoutEffect(() => {
    computePosition();
  }, [computePosition]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(
          e.target as Node
        )
      ) {
        onClose();
      }
    };

    document.addEventListener(
      "mousedown",
      close
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        close
      );
  }, [onClose]);

  return createPortal(
    <div
      ref={popoverRef}
      className="
        fixed z-50
        w-80
        rounded-3xl
        border border-n-border
        bg-white
        p-5
        shadow-elev-3
        animate-fade-up
      "
      style={{
        top: pos.top,
        left: pos.left,
      }}
    >
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-display text-ds-h3 text-n-900">
          {platform.name} Settings
        </h3>

        <button
          onClick={onClose}
          className="
            flex h-8 w-8 items-center justify-center
            rounded-lg
            text-n-500
            transition-colors
            hover:bg-n-100
            hover:text-n-900
          "
        >
          <IconClose size={14} />
        </button>
      </div>

      <div className="space-y-4">
        <SelectField
          label="Category"
          value={
            globalSettings[id]?.category ?? ""
          }
          onChange={(v) =>
            onUpdateSetting(id, {
              category: v,
            })
          }
          options={
            (CATEGORIES as Record<
              string,
              string[]
            >)[id] ?? []
          }
        />

        {platform.fbxProgram && (
          <ToggleField
            label="Fulfillment"
            options={[
              "Self-Ship",
              "Platform Fulfillment",
            ]}
            value={
              globalSettings[id]
                ?.fulfillmentMethod ??
              "Self-Ship"
            }
            onChange={(v) =>
              onUpdateSetting(id, {
                fulfillmentMethod: v,
              })
            }
          />
        )}

        {platform.hasSellerTier && (
          <SelectField
            label="Tier"
            value={
              globalSettings[id]
                ?.sellerTier ?? "Gold"
            }
            onChange={(v) =>
              onUpdateSetting(id, {
                sellerTier: v,
              })
            }
            options={SELLER_TIERS}
          />
        )}

        {platform.hasShippingZone && (
          <SelectField
            label="Zone"
            value={
              globalSettings[id]
                ?.shippingZone ?? "Local"
            }
            onChange={(v) =>
              onUpdateSetting(id, {
                shippingZone: v,
              })
            }
            options={SHIPPING_ZONES}
          />
        )}

        {platform.hasCOD && (
          <ToggleField
            label="Order Type"
            options={ORDER_TYPES}
            value={
              globalSettings[id]
                ?.orderType ?? "Prepaid"
            }
            onChange={(v) =>
              onUpdateSetting(id, {
                orderType: v,
              })
            }
          />
        )}
      </div>
    </div>,
    document.body
  );
}

/* -------------------------------------------------------------------------- */
/* MAIN FORM */
/* -------------------------------------------------------------------------- */

interface CalculatorFormProps {
  product: Product;
  onUpdate: (u: Partial<Product>) => void;
  globalSettings: GlobalSettings;
  onUpdateSetting: (
    id: string,
    setting: Partial<PlatformSetting>
  ) => void;
}

export default function CalculatorForm({
  product,
  onUpdate,
  globalSettings,
  onUpdateSetting,
}: CalculatorFormProps) {
  const [showAdvanced, setShowAdvanced] =
    useState(false);

  const [expandedConfig, setExpandedConfig] =
    useState<string | null>(null);

  const gearRefs =
    useRef<
      Record<string, HTMLButtonElement>
    >({});

  const warnings: string[] = [];

  if (
    typeof product.sellingPrice ===
      "number" &&
    typeof product.cogs === "number" &&
    product.cogs > product.sellingPrice
  ) {
    warnings.push("Selling below cost");
  }

  const togglePlatform = (
    platformId: string
  ) => {
    const current = [
      ...product.selectedPlatforms,
    ];

    const index =
      current.indexOf(platformId);

    if (index >= 0) {
      current.splice(index, 1);
    } else {
      current.push(platformId);
    }

    onUpdate({
      selectedPlatforms: current,
    });
  };

  return (
    <section
      className="
        rounded-3xl
        border border-n-border
        bg-white
        p-8
        shadow-elev-3
      "
    >
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="font-display text-ds-h1 text-n-900">
          Calculate Profitability
        </h2>

        <p className="mt-2 text-ds-body text-n-500">
          Compare real platform margins instantly.
        </p>
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div
          className="
            mb-6
            rounded-2xl
            border border-error/20
            bg-error-light
            p-4
          "
        >
          {warnings.map((warning) => (
            <div
              key={warning}
              className="
                flex items-center gap-2
                text-ds-body-sm
                font-semibold
                text-error
              "
            >
              <IconAlert size={14} />
              {warning}
            </div>
          ))}
        </div>
      )}

      {/* Core */}
      <div className="grid gap-6 md:grid-cols-2">
        <InputField
          label="Selling Price"
          value={product.sellingPrice}
          onChange={(v) =>
            onUpdate({ sellingPrice: v })
          }
        />

        <InputField
          label="Cost of Goods"
          value={product.cogs}
          onChange={(v) =>
            onUpdate({ cogs: v })
          }
        />
      </div>

      {/* Advanced Toggle */}
      <div className="my-8 flex justify-center">
        <button
          onClick={() =>
            setShowAdvanced(!showAdvanced)
          }
          className="
            inline-flex items-center gap-2
            rounded-xl
            border border-n-border
            px-4 py-2
            text-ds-body-sm
            font-semibold
            text-n-600
            transition-all
            hover:border-brand/30
            hover:bg-brand-light/30
            hover:text-brand
          "
        >
          {showAdvanced ? (
            <IconMinus size={14} />
          ) : (
            <IconPlus size={14} />
          )}

          {showAdvanced
            ? "Hide Advanced Options"
            : "Show Advanced Options"}
        </button>
      </div>

      {/* Advanced */}
      {showAdvanced && (
        <div
          className="
            mb-8
            grid gap-5
            rounded-3xl
            border border-n-border
            bg-n-50
            p-6
            md:grid-cols-2
          "
        >
          <InputField
            label="Weight"
            value={product.weight}
            onChange={(v) =>
              onUpdate({ weight: v })
            }
            suffix="g"
          />

          <InputField
            label="Return Rate"
            value={product.returnRate}
            onChange={(v) =>
              onUpdate({ returnRate: v })
            }
            suffix="%"
          />

          <InputField
            label="Shipping to Buyer"
            value={
              product.shippingCostToBuyer
            }
            onChange={(v) =>
              onUpdate({
                shippingCostToBuyer: v,
              })
            }
          />

          <AdsSpendField
            value={product.adsSpend}
            onChange={(v) =>
              onUpdate({
                adsSpend: v,
              })
            }
          />
        </div>
      )}

      {/* Platforms */}
      <div className="border-t border-n-border pt-6">
        <div className="mb-4 flex items-end gap-3">
          <h3 className="font-display text-ds-h3 text-n-900">
            Compare Platforms
          </h3>

          <span className="text-ds-caption text-n-500">
            Toggle platforms to include
          </span>
        </div>

        <div className="flex flex-wrap gap-3">
          {Object.entries(
            PLATFORMS as Record<
              string,
              Platform
            >
          ).map(([id, platform]) => {
            const active =
              product.selectedPlatforms.includes(
                id
              );

            return (
              <div
                key={id}
                className="relative flex"
              >
                <button
                  onClick={() =>
                    togglePlatform(id)
                  }
                  className={cn(
                    `
                      rounded-full
                      border
                      px-4 py-2
                      text-ds-body-sm
                      font-semibold
                      transition-all
                    `,
                    active
                      ? "border-brand bg-brand-light text-brand"
                      : "border-n-border bg-white text-n-600 hover:border-brand/30 hover:bg-brand-light/20"
                  )}
                >
                  {platform.name}
                </button>

                {active && (
                  <>
                    <button
                      ref={(el) => {
                        if (el)
                          gearRefs.current[id] =
                            el;
                      }}
                      onClick={() =>
                        setExpandedConfig(
                          expandedConfig === id
                            ? null
                            : id
                        )
                      }
                      className="
                        ml-2
                        flex h-10 w-10 items-center justify-center
                        rounded-full
                        border border-brand/20
                        bg-brand-light
                        text-brand
                        transition-all
                        hover:bg-brand
                        hover:text-white
                      "
                    >
                      <IconGear size={14} />
                    </button>

                    {expandedConfig === id && (
                      <PlatformSettingsPopover
                        id={id}
                        platform={platform}
                        anchorRef={{
                          current:
                            gearRefs.current[
                              id
                            ] ?? null,
                        }}
                        onClose={() =>
                          setExpandedConfig(
                            null
                          )
                        }
                        globalSettings={
                          globalSettings
                        }
                        onUpdateSetting={
                          onUpdateSetting
                        }
                      />
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}