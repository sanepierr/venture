"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { predict, PredictResponse } from '@/lib/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Nav } from '@/components/Nav';

function PlanContent() {
  const searchParams = useSearchParams();
  const latStr = searchParams.get('lat');
  const lngStr = searchParams.get('lng');
  const lat = latStr ? Number(latStr) : NaN;
  const lng = lngStr ? Number(lngStr) : NaN;
  const [data, setData] = useState<PredictResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isNaN(lat) && !isNaN(lng)) {
      predict(lat, lng).then(setData).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [lat, lng]);

  const handleDownload = async () => {
    const element = document.getElementById('plan-content') as HTMLElement;
    if (element && data) {
      const canvas = await html2canvas(element, { scale: 2 });
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
  if (!data) return <div className="flex items-center justify-center h-64 text-[var(--ink-muted)]">No location selected. <a href="/explore" className="text-[var(--accent)] underline">Go to explore</a>.</div>;

  const top = data.recommendations[0];

  return (
    <>
      <button 
        onClick={handleDownload} 
        className="mb-8 bg-[var(--ink)] text-[var(--bg)] hover:bg-[var(--accent)] px-6 py-2 rounded-lg font-medium mx-auto block"
      >
        ⬇️ Download PDF Guide
      </button>
      <div id="plan-content" className="space-y-8 print:space-y-6 max-w-4xl mx-auto p-4 print:p-0 print:bg-white">
        <h1 className="text-4xl font-bold print:text-3xl">Venture Business Plan</h1>
        <h2 className="text-3xl font-bold text-[var(--accent)]">{top.category}</h2>
        <p className="text-xl text-[var(--ink-muted)] mb-8">
          {data.location.neighborhood} • {data.location.lat.toFixed(4)}, {data.location.lng.toFixed(4)}
        </p>
        
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

