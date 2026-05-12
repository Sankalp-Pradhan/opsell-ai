"use client";

import { PLATFORMS } from "../data/platforms";

/* -------------------------------------------------------------------------- */
/* TYPES */
/* -------------------------------------------------------------------------- */

type PlatformId = keyof typeof PLATFORMS;

type PlatformBadgeSize =
  | "sm"
  | "md"
  | "lg";

interface PlatformBadgeProps {
  platformId: PlatformId;
  size?: PlatformBadgeSize;
  showDot?: boolean;
  className?: string;
}

/* -------------------------------------------------------------------------- */
/* HELPERS */
/* -------------------------------------------------------------------------- */

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

/* -------------------------------------------------------------------------- */
/* SIZE MAP */
/* -------------------------------------------------------------------------- */

const SIZE_STYLES: Record<
  PlatformBadgeSize,
  {
    wrapper: string;
    dot: string;
  }
> = {
  sm: {
    wrapper:
      "px-2.5 py-1 text-[11px] rounded-lg gap-1.5",
    dot: "h-1.5 w-1.5",
  },

  md: {
    wrapper:
      "px-3 py-1.5 text-ds-caption rounded-xl gap-2",
    dot: "h-2 w-2",
  },

  lg: {
    wrapper:
      "px-4 py-2 text-ds-body-sm rounded-xl gap-2.5",
    dot: "h-2.5 w-2.5",
  },
};

/* -------------------------------------------------------------------------- */
/* COMPONENT */
/* -------------------------------------------------------------------------- */

export default function PlatformBadge({
  platformId,
  size = "sm",
  showDot = true,
  className = "",
}: PlatformBadgeProps) {
  const platform =
    PLATFORMS[platformId];

  if (!platform) return null;

  const styles =
    SIZE_STYLES[size];

  return (
    <span
      className={cn(
        `
          inline-flex items-center
          border
          font-semibold
          tracking-tight
          whitespace-nowrap
          transition-all
          shadow-sm
        `,
        styles.wrapper,
        className
      )}
      style={{
        backgroundColor: `${platform.color}12`,
        borderColor: `${platform.color}24`,
        color: platform.color,
      }}
    >
      {/* Status Dot */}

      {showDot && (
        <span
          className={cn(
            `
              shrink-0 rounded-full
            `,
            styles.dot
          )}
          style={{
            backgroundColor:
              platform.color,
            boxShadow: `0 0 10px ${platform.color}55`,
          }}
        />
      )}

      {/* Platform Name */}

      <span
        className="
          font-body
          leading-none
        "
      >
        {platform.name}
      </span>
    </span>
  );
}