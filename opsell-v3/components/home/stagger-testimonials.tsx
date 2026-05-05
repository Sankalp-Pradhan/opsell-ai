"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SQRT_5000 = Math.sqrt(5000);

const testimonials = [
  {
    id: 0,
    testimonial: "Opsell completely changed how we upsell — our revenue per user jumped almost instantly.",
    by: "Aman Gupta, Founder of a D2C Apparel Brand",
    imgSrc: "https://i.pravatar.cc/150?img=1"
  },
  {
    id: 1,
    testimonial: "With Opsell, we finally understand our customers' buying patterns. The insights are gold.",
    by: "Rohit Jain, Amazon FBA Seller",
    imgSrc: "https://i.pravatar.cc/150?img=2"
  },
  {
    id: 2,
    testimonial: "We were guessing our upsells before — Opsell made everything data-driven and accurate.",
    by: "Neha Kapoor, Shopify Store Owner",
    imgSrc: "https://i.pravatar.cc/150?img=3"
  },
  {
    id: 3,
    testimonial: "Planning offers and campaigns is effortless with Opsell. It just tells us what works.",
    by: "Vikram Shah, E-commerce Brand CFO",
    imgSrc: "https://i.pravatar.cc/150?img=4"
  },
  {
    id: 4,
    testimonial: "If you run an e-commerce brand and aren’t using Opsell, you're leaving money on the table.",
    by: "Arjun Mehta, D2C Electronics Brand Founder",
    imgSrc: "https://i.pravatar.cc/150?img=5"
  },
  {
    id: 5,
    testimonial: "Opsell saved us HOURS of manual analysis — everything is automated and smart.",
    by: "Karan Verma, Flipkart Seller",
    imgSrc: "https://i.pravatar.cc/150?img=6"
  },
  {
    id: 6,
    testimonial: "We were skeptical at first, but Opsell quickly proved its value with real revenue growth.",
    by: "Priya Nair, Beauty Brand Owner",
    imgSrc: "https://i.pravatar.cc/150?img=7"
  },
  {
    id: 7,
    testimonial: "The analytics in Opsell are insane — we can literally see what drives conversions.",
    by: "Siddharth Rao, Head of Growth at a D2C Brand",
    imgSrc: "https://i.pravatar.cc/150?img=8"
  },
  {
    id: 8,
    testimonial: "Simple, powerful, and actually useful — Opsell just works.",
    by: "Ankit Agarwal, Shopify Dropshipper",
    imgSrc: "https://i.pravatar.cc/150?img=9"
  },
  {
    id: 9,
    testimonial: "Switched to Opsell and never looked back — nothing else comes close.",
    by: "Rahul Bansal, Multi-Brand Seller",
    imgSrc: "https://i.pravatar.cc/150?img=10"
  },
  {
    id: 10,
    testimonial: "We've been searching for a tool like Opsell for years — this is exactly what we needed.",
    by: "Dev Malhotra, E-commerce Sales Director",
    imgSrc: "https://i.pravatar.cc/150?img=11"
  },
  {
    id: 11,
    testimonial: "We integrated Opsell and the team was using it confidently within minutes.",
    by: "Megha Singh, Operations Manager (Online Store)",
    imgSrc: "https://i.pravatar.cc/150?img=12"
  },
  {
    id: 12,
    testimonial: "Opsell’s support team is insanely responsive — they actually help you grow.",
    by: "Ishita Arora, Customer Experience Lead (D2C)",
    imgSrc: "https://i.pravatar.cc/150?img=13"
  },
  {
    id: 13,
    testimonial: "The conversion boost we got after implementing Opsell is honestly unreal.",
    by: "Manish Tiwari, Marketplace Seller",
    imgSrc: "https://i.pravatar.cc/150?img=14"
  },
  {
    id: 14,
    testimonial: "Opsell transformed how we handle upselling — it’s now our biggest growth lever.",
    by: "Ritika Sethi, Founder of a Skincare Brand",
    imgSrc: "https://i.pravatar.cc/150?img=15"
  },
  {
    id: 15,
    testimonial: "As we scaled, Opsell scaled with us — no drop in performance at all.",
    by: "Aditya Khanna, D2C Startup Founder",
    imgSrc: "https://i.pravatar.cc/150?img=16"
  },
  {
    id: 16,
    testimonial: "Opsell keeps getting smarter — every update actually improves our revenue.",
    by: "Kunal Desai, E-commerce Growth Lead",
    imgSrc: "https://i.pravatar.cc/150?img=17"
  },
  {
    id: 17,
    testimonial: "The ROI from Opsell is insane — it paid for itself within weeks.",
    by: "Nikhil Arora, Online Retail Business Owner",
    imgSrc: "https://i.pravatar.cc/150?img=18"
  },
  {
    id: 18,
    testimonial: "Powerful AI + simple UI — Opsell nailed the balance perfectly.",
    by: "Harsh Vardhan, Tech Lead at a D2C Brand",
    imgSrc: "https://i.pravatar.cc/150?img=19"
  },
  {
    id: 19,
    testimonial: "We’ve tried multiple tools, but Opsell stands out in performance and accuracy.",
    by: "Sneha Gupta, Head of E-commerce Operations",
    imgSrc: "https://i.pravatar.cc/150?img=20"
  }
];

interface TestimonialItem {
  id: number;
  testimonial: string;
  by: string;
  imgSrc: string;
}

interface TestimonialCardProps {
  position: number;
  testimonial: TestimonialItem;
  handleMove: (steps: number) => void;
  cardSize: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  position,
  testimonial,
  handleMove,
  cardSize
}) => {
  const isCenter = position === 0;

  // ─── Derived values passed directly to Framer animate ─────────────────
  const x      = (cardSize / 1.5) * position;
  const y      = isCenter ? -65 : position % 2 ? 15 : -15;
  const rotate = isCenter ? 0 : position % 2 ? 2.5 : -2.5;
  const zIndex = isCenter ? 10 : 0;

  return (
    <motion.div
      onClick={() => handleMove(position)}
      className="absolute left-1/2 top-1/2 cursor-pointer overflow-hidden"
      // ─── Framer owns all interpolation — no CSS transition needed ────────
      animate={{
        x:          `calc(-50% + ${x}px)`,
        y:          `calc(-50% + ${y}px)`,
        rotate,
        zIndex,
        // Animatable color/shadow values
        boxShadow:  isCenter
          ? '0 20px 50px -15px rgba(80,70,229,0.45)'
          : '0px 0px 0px 0px rgba(0,0,0,0)',
        // background can't spring-interpolate between gradient strings,
        // so we cross-fade opacity instead (see inner overlay below)
      }}
      // ─── Spring: snappy but not bouncy ───────────────────────────────────
      transition={{
        type:      'spring',
        stiffness: 280,
        damping:   28,
        mass:      0.8,
        // zIndex snaps instantly so cards never z-fight mid-transition
        zIndex: { duration: 0 },
      }}
      style={{
        width:  cardSize,
        height: cardSize,
        clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
        // Base (off-center) background — center overlay fades in on top
        background: '#F8F9FA',
        border: isCenter
          ? '1px solid rgba(255,255,255,0.10)'
          : '2px solid #E2E4E8',
        padding: 32,
      }}
    >
      {/*
        ─── Center dark gradient overlay ─────────────────────────────────────
        Framer can't interpolate between two background-image strings, so we
        layer the dark gradient as an absolutely-positioned child and animate
        its opacity. This gives a smooth cross-fade as a card moves in/out of
        center position.
      */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{ opacity: isCenter ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28, mass: 0.8 }}
        style={{
          background: 'linear-gradient(135deg, #1C1F24 0%, #0F1114 100%)',
        }}
      />

      {/* Ambient glow orb — only rendered for center card ────────────────── */}
      <motion.div
        className="pointer-events-none absolute rounded-full"
        animate={{ opacity: isCenter ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        style={{
          right:      '-5rem',
          top:        '-5rem',
          width:      '12rem',
          height:     '12rem',
          background: 'rgba(80,70,229,0.12)',
          filter:     'blur(48px)',
        }}
      />

      {/* All inner content sits above the overlays ──────────────────────── */}
      <div className="relative z-10 h-full">
        {/* Angled cut-corner decorative line */}
        <span
          className="absolute block origin-top-right rotate-45"
          style={{
            right:           -2,
            top:             48,
            width:           SQRT_5000,
            height:          2,
            backgroundColor: isCenter ? 'rgba(123,115,255,0.25)' : '#E2E4E8',
          }}
        />

        {/* Avatar */}
        <img
          src={testimonial.imgSrc}
          alt={testimonial.by.split(',')[0]}
          className="mb-4 object-cover object-top"
          style={{
            width:     48,
            height:    56,
            boxShadow: `3px 3px 0px ${isCenter ? 'rgba(255,255,255,0.08)' : '#F0F1F3'}`,
          }}
        />

        {/* Quote — font-display / ds-h3 */}
        <h3
          className="font-display text-ds-h3"
          style={{ color: isCenter ? '#FFFFFF' : '#0F1114' }}
        >
          "{testimonial.testimonial}"
        </h3>

        {/* Attribution — font-body / ds-body-sm */}
        <p
          className="absolute bottom-8 left-8 right-8 font-body text-ds-body-sm italic"
          style={{ color: isCenter ? 'rgba(255,255,255,0.55)' : '#6B707A' }}
        >
          — {testimonial.by}
        </p>
      </div>
    </motion.div>
  );
};

export const StaggerTestimonials: React.FC = () => {
  const [cardSize, setCardSize] = useState(365);
  const [testimonialsList, setTestimonialsList] = useState<TestimonialItem[]>(testimonials);

  const handleMove = (steps: number) => {
    // Keep ids stable so React reuses DOM nodes and the CSS transform
    // transition actually plays instead of unmount/remount.
    const newList = [...testimonialsList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push(item);          // stable id — no Math.random()
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift(item);       // stable id
      }
    }
    setTestimonialsList(newList);
  };

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia('(min-width: 640px)');
      setCardSize(matches ? 365 : 290);
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    /*
      Container background → n.100 (#F0F1F3), a neutral tint from the DS
      that's lighter than n-50 cards while giving clear separation.
    */
    <div
      className="relative w-full overflow-hidden"
      style={{
        height: 600,
        backgroundColor: '#F0F1F3',  // n.100
      }}
    >
      {testimonialsList.map((testimonial, index) => {
        const position = testimonialsList.length % 2
          ? index - (testimonialsList.length + 1) / 2
          : index - testimonialsList.length / 2;
        return (
          <TestimonialCard
            key={testimonial.id}
            testimonial={testimonial}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
          />
        );
      })}

      {/* Navigation buttons ─────────────────────────────────────────────── */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {[
          { label: 'Previous testimonial', icon: <ChevronLeft />, step: -1 },
          { label: 'Next testimonial',     icon: <ChevronRight />, step: 1  },
        ].map(({ label, icon, step }) => (
          <button
            key={label}
            onClick={() => handleMove(step)}
            aria-label={label}
            /*
              DS button pattern:
                Default  → white bg, n.border border, n.900 icon
                Hover    → brand fill (#5046E5), white icon
                Radius   → rounded-md (8px from DS borderRadius scale)
                Shadow   → elev-1 at rest
              Size: 56×56px keeps the square hit-target from the original.
            */
            className="group flex items-center justify-center transition-all duration-200 focus-visible:outline-none"
            style={{
              width: 56,
              height: 56,
              backgroundColor: '#FFFFFF',
              border: '2px solid #E2E4E8',          // n.border
              borderRadius: 8,                       // borderRadius.md
              boxShadow: '0 1px 2px rgba(15,17,20,0.06)', // elev-1
              color: '#0F1114',                      // n.900
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.backgroundColor = '#5046E5';  // brand.DEFAULT
              el.style.borderColor      = '#5046E5';
              el.style.color            = '#FFFFFF';
              el.style.boxShadow        = '0 2px 8px rgba(80,70,229,0.30)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.backgroundColor = '#FFFFFF';
              el.style.borderColor      = '#E2E4E8';
              el.style.color            = '#0F1114';
              el.style.boxShadow        = '0 1px 2px rgba(15,17,20,0.06)';
            }}
          >
            {icon}
          </button>
        ))}
      </div>
    </div>
  );
};