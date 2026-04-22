"use client";

import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Map, TrendingUp, ShieldCheck } from "lucide-react";

const icons = [Map, TrendingUp, ShieldCheck];

export function Features() {
  const { t } = useI18n();

  return (
    <section id="features" className="relative py-32 px-6">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <div className="text-xs font-mono uppercase tracking-widest text-[var(--accent)]">
            — Capabilities
          </div>
          <h2 className="mt-4 font-serif text-5xl md:text-6xl leading-[1.05] tracking-tight">
            {t("feat.title")}
          </h2>
          <p className="mt-6 text-lg text-[var(--ink-muted)] max-w-xl leading-relaxed">
            {t("feat.sub")}
          </p>
        </motion.div>

        <div className="mt-16 grid md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => {
            const Icon = icons[i - 1];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="group relative p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] transition-all hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-white transition-colors">
                  <Icon size={20} />
                </div>
                <h3 className="mt-8 font-serif text-2xl">
                  {t(`feat.${i}.title` as never)}
                </h3>
                <p className="mt-3 text-[var(--ink-muted)] leading-relaxed">
                  {t(`feat.${i}.body` as never)}
                </p>
                <div className="mt-8 font-mono text-xs text-[var(--ink-subtle)]">
                  0{i}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
