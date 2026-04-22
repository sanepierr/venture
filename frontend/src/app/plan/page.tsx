"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { predict, PredictResponse } from '@/lib/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Nav } from '@/components/Nav';
import { Button } from '@/components/ui/button'; // Assume or create

export default function PlanPage() {
  const searchParams = useSearchParams();
  const lat = Number(searchParams.get('lat'));
  const lng = Number(searchParams.get('lng'));
  const [data, setData] = useState<PredictResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (lat && lng) {
      predict(lat, lng).then(setData).finally(() => setLoading(false));
    }
  }, [lat, lng]);

  const handleDownload = async () => {
    const element = document.getElementById('plan-content');
    if (element) {
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

      pdf.save(`venture-plan-${data?.location.neighborhood}.pdf`);
    }
  };

  if (loading || !data) return <div>Loading plan...</div>;

  const top = data.recommendations[0];

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <div className="max-w-4xl mx-auto p-8">
        <button onClick={handleDownload} className="mb-8 bg-primary text-primary-foreground px-6 py-2 rounded-lg">
          Download PDF Guide
        </button>
        <div id="plan-content" className="space-y-8">
          <h1 className="text-4xl font-bold">Business Plan: {top.category}</h1>
          <p>Location: {data.location.neighborhood} ({data.location.lat.toFixed(4)}, {data.location.lng.toFixed(4)})</p>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Market Analysis</h2>
            <ul className="space-y-2">
              <li>• Schools: {data.anchors.schools} - {'Good for school-related services'}</li>
              <li>• Taxi stages: {data.anchors.taxi_stages} - High foot traffic</li>
              <li>• Markets: {data.anchors.markets} - Competitor density</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Financial Projections</h2>
            <p>Daily Revenue: UGX {top.daily_revenue_ugx[0].toLocaleString()} - {top.daily_revenue_ugx[1].toLocaleString()}</p>
            <p>12mo Survival: {Math.round(top.survival_12mo * 100)}%</p>
            <p>Score: {Math.round(top.score * 100)}%</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Startup Checklist</h2>
            <ul className="grid md:grid-cols-2 gap-4">
              <li>✅ Register business (URA)</li>
              <li>✅ Secure location lease</li>
              <li>✅ Initial inventory UGX 5-20M</li>
              <li>✅ Trade license</li>
              <li>✅ Initial staff (1-3)</li>
              <li>✅ Marketing (signage, WhatsApp)</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

