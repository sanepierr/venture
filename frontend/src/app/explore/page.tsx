"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Nav } from "@/components/Nav";
import { ResultsPanel } from "@/components/ResultsPanel";
import { predict, PredictResponse } from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";

const KampalaMap = dynamic(() => import("@/components/KampalaMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-[var(--surface)] text-sm text-[var(--ink-muted)] font-mono">
      loading map…
    </div>
  ),
});

export default function ExplorePage() {
  const { t } = useI18n();
  const [point, setPoint] = useState<{ lat: number; lng: number } | null>(null);
  const [data, setData] = useState<PredictResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onPick(lat: number, lng: number) {
    setPoint({ lat, lng });
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const r = await predict(lat, lng);
      setData(r);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="h-screen flex flex-col overflow-hidden">
      <Nav />
      <div className="flex-1 pt-[68px] grid lg:grid-cols-[1fr_440px] grid-rows-[1fr_auto] lg:grid-rows-1">
        {/* Map */}
        <div className="relative row-start-1">
          <KampalaMap point={point} onPick={onPick} />

          {/* Floating overlay title */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute top-6 left-6 z-[400] max-w-sm"
          >
            <div className="bg-[var(--surface)]/90 backdrop-blur-md border border-[var(--border)] rounded-2xl p-4 shadow-lg">
              <div className="font-serif text-xl leading-tight">{t("explore.title")}</div>
              <div className="mt-1 text-xs text-[var(--ink-muted)]">{t("explore.sub")}</div>
            </div>
          </motion.div>

          {/* Coords pill */}
          {point && (
            <div className="absolute bottom-6 left-6 z-[400] px-3 py-1.5 rounded-full bg-[var(--surface)]/90 backdrop-blur-md border border-[var(--border)] font-mono text-xs text-[var(--ink-muted)]">
              {point.lat.toFixed(4)}°, {point.lng.toFixed(4)}°
            </div>
          )}
        </div>

        {/* Panel */}
        <aside className="row-start-2 lg:row-start-1 bg-[var(--surface)] border-l border-[var(--border)] lg:min-h-0 min-h-[50vh] overflow-hidden">
          <ResultsPanel data={data} loading={loading} error={error} />
        </aside>
      </div>
    </main>
  );
}
