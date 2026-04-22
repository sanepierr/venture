"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { predict, PredictResponse } from '@/lib/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Nav } from '@/components/Nav';

type SavedLocation = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  topBusiness?: string;
  score?: number;
  date?: string;
};

type PlanCustomization = {
  planTitle: string;
  ownerName: string;
  startingBudgetUgx: string;
  goals: string;
  notes: string;
};

const SAVED_KEY = "venture_saved_locations";
const PLAN_CUSTOM_KEY = "venture_plan_customizations_v1";

function loadSavedLocations(): SavedLocation[] {
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(Boolean) as SavedLocation[];
  } catch {
    return [];
  }
}

function loadAllCustomizations(): Record<string, PlanCustomization> {
  try {
    const raw = localStorage.getItem(PLAN_CUSTOM_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as Record<string, PlanCustomization>;
  } catch {
    return {};
  }
}

function defaultCustomization(): PlanCustomization {
  return {
    planTitle: "Venture Business Plan",
    ownerName: "",
    startingBudgetUgx: "",
    goals: "",
    notes: "",
  };
}

function PlanContent() {
  const searchParams = useSearchParams();
  const latStr = searchParams.get('lat');
  const lngStr = searchParams.get('lng');
  const latFromQuery = latStr ? Number(latStr) : NaN;
  const lngFromQuery = lngStr ? Number(lngStr) : NaN;
  const [data, setData] = useState<PredictResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [customById, setCustomById] = useState<Record<string, PlanCustomization>>({});

  useEffect(() => {
    setSavedLocations(loadSavedLocations());
    setCustomById(loadAllCustomizations());
  }, []);

  const selectedSaved = selectedId
    ? savedLocations.find((l) => l.id === selectedId) ?? null
    : null;

  const lat = Number.isFinite(latFromQuery)
    ? latFromQuery
    : selectedSaved
      ? selectedSaved.lat
      : NaN;
  const lng = Number.isFinite(lngFromQuery)
    ? lngFromQuery
    : selectedSaved
      ? selectedSaved.lng
      : NaN;

  useEffect(() => {
    // If the URL includes lat/lng we treat it as an override (no need for selectedId).
    if (Number.isFinite(latFromQuery) && Number.isFinite(lngFromQuery)) return;
    // Pick the newest saved location by default.
    if (!selectedId && savedLocations.length > 0) {
      const sorted = [...savedLocations].sort((a, b) => {
        const ad = a.date ? Date.parse(a.date) : 0;
        const bd = b.date ? Date.parse(b.date) : 0;
        return bd - ad;
      });
      setSelectedId(sorted[0]?.id ?? null);
    }
  }, [latFromQuery, lngFromQuery, savedLocations, selectedId]);

  useEffect(() => {
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      setLoading(true);
      predict(lat, lng).then(setData).finally(() => setLoading(false));
    } else {
      setData(null);
      setLoading(false);
    }
  }, [lat, lng]);

  const selectedCustomization: PlanCustomization =
    (selectedId && customById[selectedId]) ? customById[selectedId] : defaultCustomization();

  function updateCustomization(patch: Partial<PlanCustomization>) {
    if (!selectedId) return;
    const next = { ...(customById[selectedId] ?? defaultCustomization()), ...patch };
    const nextAll = { ...customById, [selectedId]: next };
    setCustomById(nextAll);
    localStorage.setItem(PLAN_CUSTOM_KEY, JSON.stringify(nextAll));
  }

  const handleDownload = async () => {
    const element = document.getElementById('plan-content') as HTMLElement;
    if (element && data) {
      const canvas = await html2canvas(element, {
        scale: 2,
        ignoreElements: (el) => (el as HTMLElement).dataset?.pdfIgnore === "true",
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`venture-plan-${data.location.neighborhood || 'kampala'}.pdf`);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-[var(--ink)]">Analyzing location...</div>;
  if (!data) {
    return (
      <div className="flex items-center justify-center h-64 text-[var(--ink-muted)] text-center px-6">
        <div>
          <div>No location selected.</div>
          <div className="mt-2">
            <a href="/explore" className="text-[var(--accent)] underline">Go to explore</a>
            {savedLocations.length > 0 && (
              <span className="text-[var(--ink-subtle)]"> or pick a saved location above.</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  const top = data.recommendations[0];

  return (
    <>
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6" data-pdf-ignore="true">
          <div className="flex-1">
            <div className="text-xs font-mono uppercase tracking-widest text-[var(--ink-subtle)]">Plan for</div>
            <select
              value={selectedId ?? ""}
              onChange={(e) => setSelectedId(e.target.value || null)}
              disabled={Number.isFinite(latFromQuery) && Number.isFinite(lngFromQuery)}
              className="mt-2 w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] transition-colors disabled:opacity-60"
            >
              <option value="" disabled>
                {savedLocations.length > 0 ? "Select a saved location" : "No saved locations yet"}
              </option>
              {savedLocations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name} ({l.lat.toFixed(4)}, {l.lng.toFixed(4)})
                </option>
              ))}
            </select>
            {(Number.isFinite(latFromQuery) && Number.isFinite(lngFromQuery)) && (
              <div className="mt-2 text-xs text-[var(--ink-subtle)]">
                Showing plan for URL coordinates. Clear the query params to use saved locations.
              </div>
            )}
          </div>
          <button
            onClick={handleDownload}
            className="bg-[var(--ink)] text-[var(--bg)] hover:bg-[var(--accent)] px-6 py-3 rounded-xl font-medium"
          >
            ⬇️ Download PDF Guide
          </button>
        </div>
      </div>
      <div id="plan-content" className="space-y-8 print:space-y-6 max-w-4xl mx-auto p-4 print:p-0 print:bg-white">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold print:text-3xl">
            {selectedId ? (customById[selectedId]?.planTitle ?? "Venture Business Plan") : "Venture Business Plan"}
          </h1>
          <div className="grid md:grid-cols-3 gap-4" data-pdf-ignore="true">
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-[var(--ink-subtle)]">
                Plan title
              </label>
              <input
                value={selectedCustomization.planTitle}
                onChange={(e) => updateCustomization({ planTitle: e.target.value })}
                disabled={!selectedId}
                className="mt-2 w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] transition-colors disabled:opacity-60"
                placeholder="e.g. My Grocery Plan"
              />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-[var(--ink-subtle)]">
                Owner name
              </label>
              <input
                value={selectedCustomization.ownerName}
                onChange={(e) => updateCustomization({ ownerName: e.target.value })}
                disabled={!selectedId}
                className="mt-2 w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] transition-colors disabled:opacity-60"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-[var(--ink-subtle)]">
                Starting budget (UGX)
              </label>
              <input
                value={selectedCustomization.startingBudgetUgx}
                onChange={(e) => updateCustomization({ startingBudgetUgx: e.target.value })}
                disabled={!selectedId}
                inputMode="numeric"
                className="mt-2 w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] transition-colors disabled:opacity-60"
                placeholder="e.g. 5000000"
              />
            </div>
          </div>
          {(selectedCustomization.ownerName || selectedCustomization.startingBudgetUgx) && (
            <div className="text-sm text-[var(--ink-muted)]">
              {selectedCustomization.ownerName && (
                <span><span className="font-semibold">Owner:</span> {selectedCustomization.ownerName} </span>
              )}
              {selectedCustomization.startingBudgetUgx && (
                <span className="ml-3"><span className="font-semibold">Budget:</span> UGX {selectedCustomization.startingBudgetUgx}</span>
              )}
            </div>
          )}
        </div>
        <h2 className="text-3xl font-bold text-[var(--accent)]">{top.category}</h2>
        <p className="text-xl text-[var(--ink-muted)] mb-8">
          {data.location.neighborhood} • {data.location.lat.toFixed(4)}, {data.location.lng.toFixed(4)}
        </p>

        <section>
          <h3 className="text-2xl font-semibold mb-6 border-b pb-2 border-[var(--border)]">🎯 Goals &amp; Notes</h3>
          <div className="grid md:grid-cols-2 gap-6" data-pdf-ignore="true">
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-[var(--ink-subtle)]">Goals</label>
              <textarea
                value={selectedCustomization.goals}
                onChange={(e) => updateCustomization({ goals: e.target.value })}
                disabled={!selectedId}
                className="mt-2 w-full min-h-[120px] px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] transition-colors disabled:opacity-60"
                placeholder="What do you want to achieve in the first 90 days?"
              />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-[var(--ink-subtle)]">Notes</label>
              <textarea
                value={selectedCustomization.notes}
                onChange={(e) => updateCustomization({ notes: e.target.value })}
                disabled={!selectedId}
                className="mt-2 w-full min-h-[120px] px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] transition-colors disabled:opacity-60"
                placeholder="Add assumptions, suppliers, pricing ideas, etc."
              />
            </div>
          </div>
          {(selectedCustomization.goals || selectedCustomization.notes) && (
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <div className="font-semibold">Goals</div>
                <div className="mt-1 whitespace-pre-wrap text-[var(--ink-muted)]">{selectedCustomization.goals || "—"}</div>
              </div>
              <div>
                <div className="font-semibold">Notes</div>
                <div className="mt-1 whitespace-pre-wrap text-[var(--ink-muted)]">{selectedCustomization.notes || "—"}</div>
              </div>
            </div>
          )}
        </section>
        
        <section>
          <h3 className="text-2xl font-semibold mb-6 border-b pb-2 border-[var(--border)]">📊 Market Analysis</h3>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <p><span className="font-bold">Schools:</span> {data.anchors.schools}</p>
              <p><span className="font-bold">Taxi stages:</span> {data.anchors.taxi_stages} (high foot traffic)</p>
              <p><span className="font-bold">Markets:</span> {data.anchors.markets}</p>
            </div>
            <div>
              <p><span className="font-bold">Population density:</span> {data.anchors.population_density}%</p>
              <p><span className="font-bold">Total competitors:</span> {Object.values(data.competitors).reduce((a,b)=>a+b,0)}</p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-semibold mb-6 border-b pb-2 border-[var(--border)]">💰 Financial Projections</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-3xl font-bold mb-2">
                Daily: UGX {top.daily_revenue_ugx[0].toLocaleString()} - {top.daily_revenue_ugx[1].toLocaleString()}
              </p>
              <p className="text-2xl">Monthly: UGX {(top.daily_revenue_ugx[0]*30).toLocaleString()} - {(top.daily_revenue_ugx[1]*30).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-green-600 mb-2">
                {Math.round(top.survival_12mo * 100)}% survival
              </p>
              <p className="text-3xl font-bold">Score: {Math.round(top.score * 100)}%</p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-semibold mb-6 border-b pb-2 border-[var(--border)]">🚀 Startup Checklist</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start gap-2"><span className="font-mono w-6">1.</span>URA TIN registration</div>
              <div className="flex items-start gap-2"><span className="font-mono w-6">2.</span>KCCA trade license</div>
              <div className="flex items-start gap-2"><span className="font-mono w-6">3.</span>Location lease (500k-2M UGX/mo)</div>
              <div className="flex items-start gap-2"><span className="font-mono w-6">4.</span>Initial stock (5-20M UGX)</div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-2"><span className="font-mono w-6">5.</span>1-3 staff hires</div>
              <div className="flex items-start gap-2"><span className="font-mono w-6">6.</span>MTN MoMo till + signage</div>
              <div className="flex items-start gap-2"><span className="font-mono w-6">7.</span>WhatsApp Business catalog</div>
              <div className="flex items-start gap-2"><span className="font-mono w-6">8.</span>Local network (boda, market)</div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-semibold mb-6 border-b pb-2 border-[var(--border)]">⚠️ Risks &amp; Mitigation</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-bold">Competition ({Object.values(data.competitors).reduce((a,b)=>a+b,0)} businesses)</h4>
              <p>Focus on superior service, niche positioning, morning peak hours.</p>
            </div>
            <div>
              <h4 className="font-bold">Economic shocks</h4>
              <p>Low overhead (family labor), multiple revenue (delivery, wholesale), cash reserves 3mo.</p>
            </div>
            <div>
              <h4 className="font-bold">Regulatory</h4>
              <p>All licenses current, join local SACCO for info/networking.</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default function PlanPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Nav />
      <main className="pt-20">
        <Suspense fallback={<div className="flex items-center justify-center h-screen text-[var(--ink)]">Loading plan...</div>}>
          <PlanContent />
        </Suspense>
      </main>
    </div>
  );
}

