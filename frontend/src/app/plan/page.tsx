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
  const lat = Number(searchParams.get('lat'));
  const lng = Number(searchParams.get('lng'));
  const [data, setData] = useState<PredictResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (lat &amp;&amp; lng &amp;&amp; !isNaN(lat) &amp;&amp; !isNaN(lng)) {
      predict(lat, lng).then(setData).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [lat, lng]);

  const handleDownload = async () => {
    const element = document.getElementById('plan-content') as HTMLElement;
    if (element &amp;&amp; data) {
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

      pdf.save(`venture-plan-${data.location.neighborhood}.pdf`);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64">Loading plan...</div>;
  if (!data) return <div className="flex items-center justify-center h-64 text-[var(--ink-muted)]">No location data. Visit from explore.</div>;

  const top = data.recommendations[0];

  return (
    <>
      <button 
        onClick={handleDownload} 
        className="mb-8 bg-[var(--ink)] text-[var(--bg)] hover:bg-[var(--accent)] px-6 py-2 rounded-lg font-medium mx-auto block"
      >
        Download PDF Guide
      </button>
      <div id="plan-content" className="space-y-8 print:space-y-6 max-w-4xl mx-auto p-4 print:p-0">
        <h1 className="text-4xl font-bold print:text-3xl">Business Plan: {top.category}</h1>
        <p className="text-xl text-[var(--ink-muted)]">
          {data.location.neighborhood} ({data.location.lat.toFixed(4)}, {data.location.lng.toFixed(4)})
        </p>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">Market Analysis</h2>
          <ul className="space-y-2 text-lg">
            <li>• Schools: {data.anchors.schools} - Good for education-related businesses</li>
            <li>• Taxi stages: {data.anchors.taxi_stages} - High foot traffic area</li>
            <li>• Markets: {data.anchors.markets} - Existing trade ecosystem</li>
            <li>• Population density: {data.anchors.population_density}%</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Financial Projections</h2>
          <p className="text-2xl font-bold mb-2">
            Daily Revenue: UGX {top.daily_revenue_ugx[0].toLocaleString()} - {top.daily_revenue_ugx[1].toLocaleString()}
          </p>
          <p>12-month Survival Probability: <span className="text-3xl font-bold text-green-600">{Math.round(top.survival_12mo * 100)}%</span></p>
          <p>Viability Score: <span className="text-3xl font-bold">{Math.round(top.score * 100)}%</span></p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Startup Checklist</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div><span className="font-bold">1.</span> URA business registration</div>
              <div><span className="font-bold">2.</span> Secure location lease (UGX 500k-2M/mo)</div>
              <div><span className="font-bold">3.</span> Initial inventory (UGX 5-20M)</div>
              <div><span className="font-bold">4.</span> Trade license from KCCA</div>
            </div>
            <div className="space-y-3">
              <div><span className="font-bold">5.</span> Hire 1-3 staff</div>
              <div><span className="font-bold">6.</span> Signage + WhatsApp Business</div>
              <div><span className="font-bold">7.</span> Join local boda/sacco networks</div>
              <div><span className="font-bold">8.</span> MTN MoMo till</div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Risks &amp; Mitigation</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-lg mb-2">Competition ({Object.values(data.competitors).reduce((a,b)=>a+b,0)} total)</h3>
              <p>Differentiate with better service/location.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Economic volatility</h3>
              <p>Keep costs low, multiple revenue streams.</p>
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
      <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
        <PlanContent />
      </Suspense>
    </div>
  );
}

