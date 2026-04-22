"use client";

import { useI18n } from "@/lib/i18n";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import { Brain, Globe, MessageCircle, Users, Layers, ArrowUpRight } from "lucide-react";

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <main className="min-h-screen">
      <Nav />

      <div className="pt-32 pb-24 px-6">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--surface)]/60 backdrop-blur-sm text-xs font-mono uppercase tracking-widest text-[var(--ink-muted)]">
              {t("about.badge")}
            </div>
            <h1 className="mt-8 font-serif text-5xl md:text-6xl leading-[1.05] tracking-tight">
              {t("about.title")}
            </h1>
            <div className="mt-3 text-xl text-[var(--accent)] font-serif">
              {t("about.subtitle")}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-14 grid md:grid-cols-3 gap-4"
          >
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)]">
                  <Brain size={18} />
                </div>
                <div className="font-serif text-2xl">AI</div>
              </div>
              <div className="mt-3 text-sm text-[var(--ink-muted)] leading-relaxed">
                {t("about.solution.body")}
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)]">
                  <MessageCircle size={18} />
                </div>
                <div className="font-serif text-2xl">Chatbot</div>
              </div>
              <div className="mt-3 text-sm text-[var(--ink-muted)] leading-relaxed">
                {t("about.how.3")}
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)]">
                  <Globe size={18} />
                </div>
                <div className="font-serif text-2xl">Luganda</div>
              </div>
              <div className="mt-3 text-sm text-[var(--ink-muted)] leading-relaxed">
                {t("about.how.4")}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <section className="py-24 px-6 bg-[var(--surface)] border-y border-[var(--border)]">
        <div className="mx-auto max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="p-8 rounded-3xl bg-[var(--bg)] border border-[var(--border)]"
            >
              <div className="text-xs font-mono uppercase tracking-widest text-[var(--accent)]">
                {t("about.problem.title")}
              </div>
              <div className="mt-4 font-serif text-3xl">{t("about.problem.title")}</div>
              <p className="mt-4 text-[var(--ink-muted)] leading-relaxed">
                {t("about.problem.body")}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="p-8 rounded-3xl bg-[var(--bg)] border border-[var(--border)]"
            >
              <div className="text-xs font-mono uppercase tracking-widest text-[var(--accent)]">
                {t("about.solution.title")}
              </div>
              <div className="mt-4 font-serif text-3xl">{t("about.solution.title")}</div>
              <p className="mt-4 text-[var(--ink-muted)] leading-relaxed">
                {t("about.solution.body")}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <div className="text-xs font-mono uppercase tracking-widest text-[var(--accent)]">
              {t("about.how.title")}
            </div>
            <h2 className="mt-4 font-serif text-5xl leading-tight tracking-tight">
              {t("about.how.title")}
            </h2>
          </motion.div>

          <div className="mt-12 grid md:grid-cols-2 gap-4">
            {[
              { icon: Globe, body: t("about.how.1") },
              { icon: MessageCircle, body: t("about.how.2") },
              { icon: Brain, body: t("about.how.3") },
              { icon: Layers, body: t("about.how.4") },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className="flex gap-4 p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)]"
              >
                <div className="w-10 h-10 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)] shrink-0">
                  <item.icon size={18} />
                </div>
                <div className="text-[var(--ink-muted)] leading-relaxed">{item.body}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-[var(--surface)] border-y border-[var(--border)]">
        <div className="mx-auto max-w-5xl">
          <div className="grid lg:grid-cols-3 gap-4">
            {[
              { title: t("about.impact.title"), body: t("about.impact.body") },
              { title: t("about.scale.title"), body: t("about.scale.body") },
              { title: t("about.stack.title"), body: t("about.stack.body") },
            ].map((card) => (
              <div key={card.title} className="p-7 rounded-3xl bg-[var(--bg)] border border-[var(--border)]">
                <div className="font-serif text-2xl">{card.title}</div>
                <p className="mt-3 text-[var(--ink-muted)] leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-[var(--accent)]">
                {t("about.team.title")}
              </div>
              <h2 className="mt-4 font-serif text-5xl leading-tight tracking-tight">
                {t("about.team.title")}
              </h2>
              <div className="mt-8 space-y-3 text-lg text-[var(--ink)]">
                <div className="flex items-center gap-3">
                  <Users size={18} className="text-[var(--accent)]" />
                  <span>{t("about.team.1")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users size={18} className="text-[var(--accent)]" />
                  <span>{t("about.team.2")}</span>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)]">
              <div className="text-xs font-mono uppercase tracking-widest text-[var(--ink-subtle)]">
                {t("about.prototype")}
              </div>
              <Link
                href="https://venture-steel.vercel.app/"
                target="_blank"
                className="mt-3 inline-flex items-center gap-2 text-[var(--accent)] hover:underline break-all"
              >
                venture-steel.vercel.app <ArrowUpRight size={14} />
              </Link>
              <div className="mt-6 text-xs text-[var(--ink-subtle)] leading-relaxed">
                {t("about.badge")}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}