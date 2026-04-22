"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { Nav } from "@/components/Nav";
import { ResultsPanel } from "@/components/ResultsPanel";
import { Chatbot } from "@/components/Chatbot";
import { predict, PredictResponse } from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { Bookmark } from "lucide-react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

function ExploreContent() {
  const { t } = useI18n();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [point, setPoint] = useState<{ lat: number; lng: number } | null>(null);
  const [data, setData] = useState<PredictResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const KampalaMap = dynamic(() => import("@/components/KampalaMap"), {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center bg-[var(--surface)] text-sm text-[var(--ink-muted)] font-mono">
        {t("explore.loading_map")}
      </div>
    ),
  });

  const onPick = useCallback(async (lat: number, lng: number) => {
    setPoint({ lat, lng });
    setLoading(true);
    setError(null);
    setData(null);
    setSaved(false);
    try {
      const r = await predict(lat, lng);
      setData(r);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const latStr = searchParams.get("lat");
    const lngStr = searchParams.get("lng");
    if (!latStr || !lngStr) return;
    const lat = Number(latStr);
    const lng = Number(lngStr);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      onPick(lat, lng);
    }
  }, [onPick, searchParams]);

  function saveLocation() {
    if (!data || !user) return;
    const savedLocations = JSON.parse(localStorage.getItem("venture_saved_locations") || "[]");
    const exists = savedLocations.find(
      (l: { lat: number; lng: number }) =>
        Math.abs(l.lat - data.location.lat) < 0.0001 && Math.abs(l.lng - data.location.lng) < 0.0001
    );
    if (!exists) {
      savedLocations.push({
        id: crypto.randomUUID(),
        name: data.location.neighborhood,
        lat: data.location.lat,
        lng: data.location.lng,
        topBusiness: data.recommendations[0]?.category || "Unknown",
        score: Math.round(data.recommendations[0]?.score * 100) || 0,
        date: new Date().toISOString(),
      });
      localStorage.setItem("venture_saved_locations", JSON.stringify(savedLocations));
      setSaved(true);
    }
  }

  return (
    <main className="h-screen flex flex-col overflow-hidden">
      <Nav />
      <div className="flex-1 pt-[68px] overflow-hidden">
        <div className="grid lg:grid-cols-[1fr_440px] h-full">
          {/* Map */}
          <div className="relative h-full">
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
                {t("explore.coords")
                  .replace("{lat}", point.lat.toFixed(4))
                  .replace("{lng}", point.lng.toFixed(4))}
              </div>
            )}
          </div>

          {/* Panel */}
          <aside className="bg-[var(--surface)] border-l border-[var(--border)] h-full flex flex-col overflow-hidden">
            {data && user && (
              <div className="px-7 py-4 border-b border-[var(--border)] flex justify-end shrink-0">
                <button
                  onClick={saveLocation}
                  disabled={saved}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all ${
                    saved
                      ? "bg-[var(--success)]/20 text-[var(--success)]"
                      : "bg-[var(--ink)] text-[var(--bg)] hover:bg-[var(--accent)]"
                  }`}
                >
                  <Bookmark size={14} fill={saved ? "currentColor" : "none"} />
                  {saved ? t("explore.saved") : t("explore.save_location")}
                </button>
              </div>
            )}
            <div className="flex-1 overflow-auto">
              <div className="h-full" data-lenis-prevent>
                <ResultsPanel data={data} loading={loading} error={error} />
              </div>
            </div>
            {data && <Chatbot data={data} />}
          </aside>
        </div>
      </div>
    </main>
  );
}

export default function ExplorePage() {
  const { t } = useI18n();
  return (
    <Suspense
      fallback={
        <main className="h-screen flex flex-col overflow-hidden">
          <Nav />
          <div className="flex-1 pt-[68px] overflow-hidden">
            <div className="h-full w-full flex items-center justify-center bg-[var(--surface)] text-sm text-[var(--ink-muted)] font-mono">
              {t("explore.loading_explore")}
            </div>
          </div>
        </main>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}

