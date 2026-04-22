"use client";

import Link from "next/link";
import { Logo } from "./Logo";
import { useTheme } from "./ThemeProvider";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { Moon, Sun, ArrowUpRight, User, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

export function Nav() {
  const { theme, toggle } = useTheme();
  const { lang, setLang, t } = useI18n();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          <Link href="/#how" className="hover:text-[var(--ink)] transition-colors">
            {t("nav.how")}
          </Link>
          <Link href="/about" className="hover:text-[var(--ink)] transition-colors">
            {t("nav.about")}
          </Link>
          <Link href="/explore" className="hover:text-[var(--ink)] transition-colors">
            {t("nav.explore")}
          </Link>
          {user && (
            <>
              <Link href="/dashboard" className="hover:text-[var(--ink)] transition-colors text-[var(--accent)]">
                Dashboard
              </Link>
              <Link href="/plan" className="hover:text-[var(--ink)] transition-colors">
                Plan
              </Link>
            </>
          )}


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
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="ml-1 flex items-center gap-2 px-3 py-2 rounded-full bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--ink)] hover:border-[var(--accent)] transition-colors"
              >
                <User size={14} />
                <span className="hidden sm:inline">{user.name.split(" ")[0]}</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xl overflow-hidden">
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-[var(--ink)] hover:bg-[var(--bg)] transition-colors"
                  >
                    <User size={14} />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { logout(); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-[var(--ink-muted)] hover:bg-[var(--bg)] transition-colors"
                  >
                    <LogOut size={14} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="ml-1 hidden sm:inline-flex items-center gap-1.5 bg-[var(--ink)] text-[var(--bg)] text-sm px-4 py-2 rounded-full hover:bg-[var(--accent)] transition-colors"
            >
              Sign in
              <ArrowUpRight size={14} />
            </Link>
          )}
        </div>
      </div>
    </motion.header>
  );
}
