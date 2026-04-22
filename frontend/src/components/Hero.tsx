"use client";

import { useI18n } from "@/lib/i18n";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowRight, MapPin } from "lucide-react";

export function Hero() {
  const { t } = useI18n();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".reveal-word", {
        yPercent: 120,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.06,
        delay: 0.2,
      });
      gsap.from(".hero-sub", {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.7,
      });
      gsap.from(".hero-cta > *", {
        y: 14,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.9,
      });
      gsap.from(".hero-stat", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        delay: 1.1,
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const line1 = t("hero.title.1").split(" ");
  const line2 = t("hero.title.2").split(" ");

  return (
    <section
      ref={rootRef}
      className="relative min-h-screen flex items-center pt-32 pb-24 px-6 overflow-hidden bg-grid"
    >
      {/* Animated orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="orb absolute -top-40 -left-20 w-[520px] h-[520px] rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)" }} />
        <div className="orb absolute top-1/3 -right-40 w-[620px] h-[620px] rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--success) 0%, transparent 70%)", animationDelay: "-6s" }} />
      </div>

      <div className="relative mx-auto max-w-7xl w-full grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--surface)]/60 backdrop-blur-sm text-xs font-mono uppercase tracking-widest text-[var(--ink-muted)]"
          >
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75 pulse-ring"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--accent)]"></span>
            </span>
            {t("hero.eyebrow")}
          </motion.div>

          <h1 className="mt-8 font-serif text-[13vw] sm:text-[10vw] lg:text-[8.5vw] xl:text-[130px] leading-[0.95] tracking-[-0.03em]">
            <span className="reveal-line">
              {line1.join(" ")}
            </span>
            {" "}
            <span className="reveal-line italic text-[var(--accent)]">
              {line2.join(" ")}
            </span>
          </h1>

          <p className="hero-sub mt-8 max-w-xl text-lg leading-relaxed text-[var(--ink-muted)]">
            {t("hero.sub")}
          </p>

          <div className="hero-cta mt-10 flex flex-wrap gap-3">
            <Link
              href="/explore"
              className="group inline-flex items-center gap-2 bg-[var(--ink)] text-[var(--bg)] px-6 py-3.5 rounded-full hover:bg-[var(--accent)] transition-all"
            >
              <MapPin size={16} />
              {t("hero.cta.primary")}
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <a
              href="#how"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[var(--border-strong)] text-[var(--ink)] hover:bg-[var(--surface)] transition-colors"
            >
              {t("hero.cta.secondary")}
            </a>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg">
            {[
              ["hero.stat1.value", "hero.stat1.label"],
              ["hero.stat2.value", "hero.stat2.label"],
              ["hero.stat3.value", "hero.stat3.label"],
            ].map(([v, l]) => (
              <div key={l} className="hero-stat border-l border-[var(--border-strong)] pl-4">
                <div className="font-serif text-3xl tracking-tight">
                  {t(v as never)}
                </div>
                <div className="mt-1 text-xs uppercase tracking-widest text-[var(--ink-subtle)]">
                  {t(l as never)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: animated "chip" card */}
        <div className="lg:col-span-5 hidden lg:block">
          <HeroCard />
        </div>
      </div>
    </section>
  );
}

function HeroCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: 2 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 1.2, delay: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
      className="relative"
    >
      <div className="absolute -inset-2 bg-[var(--accent)]/10 blur-2xl rounded-[2rem]" />
      <div className="relative bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.2)]">
        <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-[var(--ink-subtle)]">
          <span>Recommendation · live</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
            Kampala
          </span>
        </div>

        <div className="mt-5 flex items-baseline justify-between">
          <div>
            <div className="text-xs text-[var(--ink-subtle)] font-mono">TOP MATCH</div>
            <div className="font-serif text-3xl mt-1">Mobile Money Agent</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-[var(--ink-subtle)] font-mono">SCORE</div>
            <div className="font-serif text-3xl mt-1 text-[var(--accent)]">94</div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {[
            { l: "Chapati Stand", v: 87 },
            { l: "Salon", v: 71 },
            { l: "Pharmacy", v: 64 },
            { l: "Retail Shop", v: 58 },
          ].map((r, i) => (
            <motion.div
              key={r.l}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + i * 0.08 }}
              className="flex items-center gap-3"
            >
              <div className="w-28 text-sm text-[var(--ink-muted)]">{r.l}</div>
              <div className="flex-1 h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${r.v}%` }}
                  transition={{ delay: 0.9 + i * 0.08, duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
                  className="h-full bg-[var(--ink)]"
                />
              </div>
              <div className="w-8 text-right text-xs font-mono text-[var(--ink-muted)]">
                {r.v}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 pt-5 border-t border-dashed border-[var(--border)] grid grid-cols-2 gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-[var(--ink-subtle)] font-mono">
              Est. daily
            </div>
            <div className="font-serif text-xl mt-0.5">
              UGX 180k<span className="text-[var(--ink-subtle)] text-sm">–240k</span>
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-[var(--ink-subtle)] font-mono">
              Survival · 12mo
            </div>
            <div className="font-serif text-xl mt-0.5 text-[var(--success)]">78%</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
