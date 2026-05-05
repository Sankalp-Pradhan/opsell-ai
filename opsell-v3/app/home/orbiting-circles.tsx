"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface OrbitingCirclesProps {
  className?: string;
  children?: React.ReactNode;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  radius?: number;
  path?: boolean;
  iconSize?: number;
  speed?: number;
}

export function OrbitingCircles({ 
  className,
  children,
  reverse = false,
  duration = 20,
  radius = 160,
  path = true,
  iconSize = 50,
  speed = 0.5,
}: OrbitingCirclesProps) {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number | null>(null);
  const count = React.Children.count(children);
  const totalMs = (duration / speed) * 1000;

  useEffect(() => {
    const items = itemRefs.current;

    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const elapsed = now - startRef.current;
      const progress = (elapsed % totalMs) / totalMs;
      const baseAngle = progress * 360 * (reverse ? -1 : 1);

      items.forEach((el, i) => {
        if (!el) return;
        const angleDeg = baseAngle + (360 / count) * i;
        const rad = (angleDeg * Math.PI) / 180;
        const x = Math.cos(rad) * radius;
        const y = Math.sin(rad) * radius;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [totalMs, reverse, count, radius]);

  const childArray = React.Children.toArray(children);

  return (
    <>
      {path && (
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
            stroke="rgba(148,163,184,0.35)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        </svg>
      )}
      {childArray.map((child, i) => (
        <div
          key={i}
          ref={(el) => {
            itemRefs.current[i] = el;
          }}
          className={cn(
            "absolute flex items-center justify-center rounded-full",
            className
          )}
          style={{
            top: "50%",
            left: "50%",
            width: iconSize,
            height: iconSize,
            marginTop: -iconSize / 2,
            marginLeft: -iconSize / 2,
            willChange: "transform",
          }}
        >
          {child}
        </div>
      ))}
    </>
  );
}
