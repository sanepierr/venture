"use client";

import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";

export function HowItWorks() {
  const { t } = useI18n();

  return (
    <section id="how" className="relative py-32 px-6 bg-[var(--surface)] border-y border-[var(--border)]">
      <div className="mx-auto max-w-7xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-serif text-5xl md:text-6xl tracking-tight max-w-2xl"
        >
          {t("how.title")}
        </motion.h2>

        <div className="mt-20 grid md:grid-cols-3 gap-12 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-[var(--border-strong)] to-transparent" />

          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              className="relative"
            >
              <div className="w-12 h-12 rounded-full bg-[var(--bg)] border border-[var(--border-strong)] flex items-center justify-center relative z-10 font-mono text-xs">
                {t(`how.${i}.k` as never)}
              </div>
              <h3 className="mt-8 font-serif text-3xl">
                {t(`how.${i}.t` as never)}
              </h3>
              <p className="mt-3 text-[var(--ink-muted)] leading-relaxed">
                {t(`how.${i}.b` as never)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
