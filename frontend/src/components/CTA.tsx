"use client";

import { useI18n } from "@/lib/i18n";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export function CTA() {
  const { t } = useI18n();

  return (
    <section className="relative py-32 px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9 }}
        className="relative mx-auto max-w-6xl rounded-[2rem] bg-[var(--ink)] text-[var(--bg)] p-12 md:p-20 overflow-hidden"
      >
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-40 blur-3xl orb"
          style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)" }} />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full opacity-30 blur-3xl orb"
          style={{ background: "radial-gradient(circle, var(--success) 0%, transparent 70%)", animationDelay: "-8s" }} />

        <div className="relative">
          <h2 className="font-serif text-5xl md:text-7xl tracking-tight leading-[1]">
            {t("cta.title")}
          </h2>
          <p className="mt-6 text-lg text-[var(--bg)]/70 max-w-xl">
            {t("cta.sub")}
          </p>
          <Link
            href="/explore"
            className="group mt-10 inline-flex items-center gap-2 bg-[var(--accent)] text-white px-7 py-4 rounded-full hover:bg-[var(--accent-hover)] transition-all"
          >
            {t("cta.button")}
            <ArrowUpRight
              size={18}
              className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
