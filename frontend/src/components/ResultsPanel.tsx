"use client";

import { PredictResponse } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { MapPin, Users, Store, Signpost, GraduationCap } from "lucide-react";
import { useRef, useEffect } from "react";

export function ResultsPanel({
  data,
  loading,
  error,
}: {
  data: PredictResponse | null;
  loading: boolean;
  error: string | null;
}) {
  const { t } = useI18n();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data && scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [data]);

  return (
    <div className="h-full flex flex-col">
      <AnimatePresence mode="wait">
        {loading && <LoadingState key="loading" />}
        {!loading && !data && !error && <EmptyState key="empty" />}
        {error && !loading && <ErrorState key="error" msg={error} />}
        {data && !loading && <DataState key="data" data={data} />}
      </AnimatePresence>
    </div>
  );

  function EmptyState() {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex-1 flex flex-col items-center justify-center text-center px-8 py-20"
      >
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-[var(--accent)]/20 blur-2xl rounded-full" />
          <div className="relative w-16 h-16 rounded-full border border-[var(--border-strong)] flex items-center justify-center bg-[var(--surface)]">
            <MapPin size={22} className="text-[var(--accent)]" />
          </div>
        </div>
        <h3 className="font-serif text-2xl">{t("explore.empty.title")}</h3>
        <p className="mt-3 text-sm text-[var(--ink-muted)] max-w-xs leading-relaxed">
          {t("explore.empty.sub")}
        </p>
      </motion.div>
    );
  }

  function LoadingState() {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex-1 flex flex-col items-center justify-center px-8"
      >
        <div className="flex gap-1.5 mb-5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
              className="w-2 h-2 rounded-full bg-[var(--accent)]"
            />
          ))}
        </div>
        <div className="font-mono text-xs uppercase tracking-widest text-[var(--ink-muted)]">
          {t("explore.loading")}
        </div>
      </motion.div>
    );
  }

  function ErrorState({ msg }: { msg: string }) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex-1 flex flex-col items-center justify-center px-8 text-center"
      >
        <div className="text-sm text-[var(--ink-muted)]">Something went wrong</div>
        <div className="mt-2 font-mono text-xs text-[var(--ink-subtle)]">{msg}</div>
      </motion.div>
    );
  }

  function DataState({ data }: { data: PredictResponse }) {
    const top = data.recommendations[0];
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-7 py-8 scroll-smooth scrollbar-thin scrollbar-thumb-[var(--border-strong)] scrollbar-track-transparent hover:scrollbar-thumb-[var(--ink-muted)]"
      >
        {/* Header */}
        <div className="flex items-baseline justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--ink-subtle)]">
              Location
            </div>
            <div className="font-serif text-2xl mt-0.5">{data.location.neighborhood}</div>
            <div className="mt-1 font-mono text-[10px] text-[var(--ink-subtle)]">
              {data.location.lat.toFixed(4)}, {data.location.lng.toFixed(4)}
            </div>
          </div>
        </div>

        {/* Anchors */}
        <div className="mt-6 grid grid-cols-4 gap-2">
          {[
            { icon: GraduationCap, v: data.anchors.schools, l: "Schools" },
            { icon: Signpost, v: data.anchors.taxi_stages, l: "Stages" },
            { icon: Store, v: data.anchors.markets, l: "Markets" },
            { icon: Users, v: data.anchors.population_density, l: "Density" },
          ].map(({ icon: Icon, v, l }) => (
            <div
              key={l}
              className="p-3 rounded-xl bg-[var(--bg)] border border-[var(--border)]"
            >
              <Icon size={14} className="text-[var(--ink-subtle)]" />
              <div className="mt-2 font-serif text-xl leading-none">{v}</div>
              <div className="mt-1 text-[9px] font-mono uppercase tracking-widest text-[var(--ink-subtle)]">
                {l}
              </div>
            </div>
          ))}
        </div>

        {/* Top recommendation card */}
        <div className="mt-6 p-5 rounded-2xl bg-[var(--ink)] text-[var(--bg)] relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full opacity-40 blur-2xl"
            style={{ background: "var(--accent)" }} />
          <div className="relative">
            <div className="font-mono text-[10px] uppercase tracking-widest opacity-60">
              Top match
            </div>
            <div className="mt-1 font-serif text-3xl">{top.category}</div>
            <div className="mt-4 grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest opacity-60">
                  {t("explore.revenue")}
                </div>
                <div className="mt-1 font-serif text-lg">
                  UGX {fmt(top.daily_revenue_ugx[0])}
                  <span className="opacity-60">–{fmt(top.daily_revenue_ugx[1])}</span>
                </div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest opacity-60">
                  {t("explore.survival")}
                </div>
                <div className="mt-1 font-serif text-lg" style={{ color: "var(--success)" }}>
                  {Math.round(top.survival_12mo * 100)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ranked list */}
        <div className="mt-6">
          <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--ink-subtle)] mb-3">
            {t("explore.results")}
          </div>
          <div className="space-y-2.5">
            {data.recommendations.slice(1, 6).map((r, i) => (
              <motion.div
                key={r.category}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-3 rounded-xl bg-[var(--bg)] border border-[var(--border)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="font-mono text-[10px] text-[var(--ink-subtle)] w-6">
                      0{i + 2}
                    </div>
                    <div className="font-serif text-base truncate">{r.category}</div>
                  </div>
                  <div className="font-mono text-sm text-[var(--ink-muted)]">
                    {Math.round(r.score * 100)}
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1 bg-[var(--border)] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${r.score * 100}%` }}
                      transition={{ delay: i * 0.05 + 0.1, duration: 0.7 }}
                      className="h-full bg-[var(--ink)]"
                    />
                  </div>
                  <div className="text-[10px] font-mono text-[var(--ink-subtle)] whitespace-nowrap">
                    UGX {fmt(r.daily_revenue_ugx[0])}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }
}

function fmt(n: number) {
  if (n >= 1000) return `${Math.round(n / 1000)}k`;
  return String(n);
}
