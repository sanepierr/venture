"use client";

import { useI18n } from "@/lib/i18n";
import { Logo } from "./Logo";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-[var(--border)] py-12 px-6">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
        <Logo />
        <div className="text-sm text-[var(--ink-muted)] font-serif italic">
          {t("footer.tag")}
        </div>
        <div className="text-xs font-mono uppercase tracking-widest text-[var(--ink-subtle)]">
          © 2026 Venture
        </div>
      </div>
    </footer>
  );
}
