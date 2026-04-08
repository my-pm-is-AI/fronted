"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const navLinks = [
  { label: "Solutions", href: "#" },
  { label: "Agents", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Docs", href: "#" },
];

export default function Navbar() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 border-b border-white/[0.06] bg-black/60 backdrop-blur-xl" />

      {/* Logo */}
      <div className="relative z-10 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)]">
          <span className="text-sm font-bold text-white">T</span>
        </div>
        <span className="text-lg font-semibold tracking-tight text-white">
          Trestle
        </span>
      </div>

      {/* Links */}
      <div className="relative z-10 hidden items-center gap-1 md:flex">
        {navLinks.map((link, i) => (
          <a
            key={link.label}
            href={link.href}
            className="relative rounded-lg px-4 py-2 text-sm text-white/60 transition-colors hover:text-white"
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {hoveredIndex === i && (
              <motion.div
                className="absolute inset-0 rounded-lg bg-white/[0.06]"
                layoutId="navHover"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{link.label}</span>
          </a>
        ))}
      </div>

      {/* CTA */}
      <div className="relative z-10">
        <button className="rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-medium text-white transition-all hover:bg-[var(--accent-light)] hover:shadow-lg hover:shadow-[var(--accent)]/25 active:scale-95">
          Get Started
        </button>
      </div>
    </motion.nav>
  );
}
