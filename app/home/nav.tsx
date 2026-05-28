"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import { usePathname } from "next/navigation"
import Image from "next/image"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "How it works", href: "/works" },
  { label: "Features", href: "/features" },
  { label: "Profit Calculator", href: "/profit-calculator" },
  // { label: "Pricing", href: "/pricing" },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [screenWidth, setScreenWidth] = useState(1200)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4">
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 90, damping: 20, mass: 0.8 }}
        animate={{
          maxWidth: scrolled ? 820 : screenWidth,
          marginTop: scrolled ? 8 : 0,          // ← tighter: was 18
          borderRadius: scrolled ? 28 : 0,
          height: scrolled ? 54 : 72,            // ← slightly shorter pill
          paddingLeft: scrolled ? 20 : 24,
          paddingRight: scrolled ? 20 : 24,
          backgroundColor: scrolled ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0)",
          backdropFilter: scrolled ? "blur(12px)" : "blur(0px)",
          boxShadow: scrolled
            ? "0 8px 24px rgba(15,17,20,0.10), 0 2px 6px rgba(15,17,20,0.06)"
            : "0 0 0 rgba(0,0,0,0)",
          borderColor: scrolled ? "rgba(226,228,232,1)" : "rgba(0,0,0,0)",
        }}
        className="mx-auto flex w-full items-center justify-between border font-display"
      >
        {/* Logo */}

        <Link
          href="/"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 0,
            textDecoration: "none",
          }}
        >
          
          <Image
            src="/logo-nb.png"
            alt="Opsell Logo"
            width={50}
            height={50}
          />

          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 24,
              fontWeight: 800,
              color: "#0F1114",
              letterSpacing: "-0.03em",
            }}
          >
            opsell
          </span>

          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 20,
              fontWeight: 800,
              color: "#5046E5",
            }}
          >
            .
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-0.5 list-none m-0 p-0">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <li key={link.href} className="relative">
                  <Link
                    href={link.href}
                    className={`relative flex h-[38px] items-center justify-center rounded-full px-4 text-ds-body font-semibold transition-colors duration-200 ${isActive ? "text-n-900" : "text-n-600 hover:text-n-900"
                      }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full border border-n-border bg-white shadow-elev-1"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Link
            href="https://forms.gle/XXKAuPXLiKRK7TxW6"
            className="hidden h-[38px] items-center rounded-md bg-brand px-5 text-ds-body font-semibold text-white shadow-[0_4px_14px_rgba(80,70,229,0.35)] transition-all hover:bg-brand-dark hover:shadow-[0_6px_20px_rgba(80,70,229,0.45)] hover:-translate-y-px md:inline-flex"
          >
            Get my revenue audit
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-[38px] w-[38px] items-center justify-center rounded-lg border border-n-border bg-white shadow-elev-1 text-n-600 md:hidden"
          >
            {mobileMenuOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </motion.div>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={{
          opacity: mobileMenuOpen ? 1 : 0,
          y: mobileMenuOpen ? 0 : -8,
          pointerEvents: mobileMenuOpen ? "auto" : "none",
        }}
        transition={{ duration: 0.18 }}
        className="mx-0 mt-2 overflow-hidden rounded-2xl border border-n-border bg-white/95 shadow-elev-3 backdrop-blur md:hidden"
      >
        {mobileMenuOpen && (
          <div className="flex flex-col p-3 gap-0.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-xl px-4 py-3 text-ds-body font-medium transition-colors ${isActive
                    ? "bg-brand-light text-brand"
                    : "text-n-600 hover:bg-n-100 hover:text-n-900"
                    }`}
                >
                  {link.label}
                </Link>
              )
            })}
            <Link
              href="https://forms.gle/XXKAuPXLiKRK7TxW6"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 flex items-center justify-center rounded-xl bg-brand px-4 py-3 text-ds-body font-semibold text-white transition hover:bg-brand-dark"
            >
              Get my revenue audit
            </Link>
          </div>
        )}
      </motion.div>
    </header>
  )
}