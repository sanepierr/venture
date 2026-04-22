"use client";

import Link from "next/link";
import { Logo } from "./Logo";
import { useTheme } from "./ThemeProvider";
import { useI18n } from "@/lib/i18n";
import { Moon, Sun, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export function Nav() {
  const { theme, toggle } = useTheme();
  const { lang, setLang, t } = useI18n();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
      className="fixed top-0 inset-x-0 z-50 px-6 py-4 backdrop-blur-md bg-[var(--bg)]/70 border-b border-[var(--border)]"
    >
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        <Link href="/" className="text-[var(--ink)]">
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-[var(--ink-muted)]">
          <a href="#how" className="hover:text-[var(--ink)] transition-colors">
            {t("nav.how")}
          </a>
          <Link href="/about" className="hover:text-[var(--ink)] transition-colors">
            {t("nav.about")}
          </Link>
          <Link href="/explore" className="hover:text-[var(--ink)] transition-colors">
            {t("nav.explore")}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang(lang === "en" ? "lg" : "en")}
            className="text-xs uppercase tracking-widest text-[var(--ink-muted)] hover:text-[var(--ink)] px-2.5 py-1 border border-[var(--border)] rounded-full transition-colors font-mono"
            aria-label="Toggle language"
          >
            {lang === "en" ? "LG" : "EN"}
          </button>
          <button
            onClick={toggle}
            className="p-2 rounded-full border border-[var(--border)] hover:border-[var(--border-strong)] text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          <Link
            href="/explore"
            className="ml-1 hidden sm:inline-flex items-center gap-1.5 bg-[var(--ink)] text-[var(--bg)] text-sm px-4 py-2 rounded-full hover:bg-[var(--accent)] transition-colors"
          >
            {t("nav.launch")}
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
