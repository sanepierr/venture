"use client";

import { PredictResponse } from "@/lib/api";
import { Download, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useState } from "react";

export function PlanningGuide({ data }: { data: PredictResponse }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      // Create a temporary div offscreen to render the guide
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.style.top = "0";
      container.style.width = "800px";
      container.style.background = "#fff"; 
      container.style.color = "#000";
      container.style.padding = "60px";
      container.style.fontFamily = "system-ui, -apple-system, sans-serif";
      
      const topRec = data.recommendations[0];

      // Build the HTML content
      container.innerHTML = `
        <div style="border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="font-size: 32px; margin: 0; letter-spacing: -0.05em;">Venture Planning Guide</h1>
          <p style="font-size: 18px; color: #555; margin-top: 10px;">${data.location.neighborhood} &bull; Coordinates: ${data.location.lat.toFixed(4)}, ${data.location.lng.toFixed(4)}</p>
        </div>

        <div style="margin-bottom: 40px; padding: 30px; background: #fafafa; border-radius: 16px; border: 1px solid #eaeaea;">
          <h2 style="font-size: 28px; margin-top: 0; margin-bottom: 20px; letter-spacing: -0.02em;">Top Match: ${topRec.category}</h2>
          <div style="display: flex; gap: 60px;">
            <div>
              <div style="font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 5px;">Est. Daily Revenue</div>
              <div style="font-size: 24px; font-weight: 600;">UGX ${topRec.daily_revenue_ugx[0].toLocaleString()} - ${topRec.daily_revenue_ugx[1].toLocaleString()}</div>
            </div>
            <div>
              <div style="font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 5px;">12-Mo Survival Rate</div>
              <div style="font-size: 24px; font-weight: 600; color: #16a34a;">${Math.round(topRec.survival_12mo * 100)}%</div>
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 40px; margin-bottom: 50px;">
          <div style="flex: 1;">
            <h3 style="font-size: 18px; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 20px;">Location Anchors</h3>
            <ul style="list-style: none; padding: 0; margin: 0; font-size: 16px; color: #333;">
              <li style="margin-bottom: 12px; display: flex; justify-content: space-between;"><span>Schools</span> <strong>${data.anchors.schools}</strong></li>
              <li style="margin-bottom: 12px; display: flex; justify-content: space-between;"><span>Taxi Stages</span> <strong>${data.anchors.taxi_stages}</strong></li>
              <li style="margin-bottom: 12px; display: flex; justify-content: space-between;"><span>Markets</span> <strong>${data.anchors.markets}</strong></li>
              <li style="margin-bottom: 12px; display: flex; justify-content: space-between;"><span>Population Density</span> <strong>${data.anchors.population_density}</strong></li>
            </ul>
          </div>
          <div style="flex: 1;">
            <h3 style="font-size: 18px; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 20px;">Runner-Up Opportunities</h3>
            <ul style="list-style: none; padding: 0; margin: 0; font-size: 16px;">
              ${data.recommendations.slice(1, 4).map((r, i) => `
                <li style="margin-bottom: 12px; display: flex; justify-content: space-between;">
                  <span style="color: #333;">${i + 1}. ${r.category}</span>
                  <strong style="color: #888;">${Math.round(r.score * 100)} Score</strong>
                </li>
              `).join('')}
            </ul>
          </div>
        </div>
        
        <div style="background: #fff; border: 1px solid #ddd; border-radius: 12px; padding: 30px;">
          <h3 style="font-size: 18px; margin-top: 0; margin-bottom: 20px;">Area Insights</h3>
          <ul style="padding-left: 20px; font-size: 16px; line-height: 1.8; color: #444; margin: 0;">
            <li style="margin-bottom: 10px;">${data.anchors.schools >= 3 ? "High school density supports education-adjacent businesses." : "Few schools; focus on general retail/food."}</li>
            <li style="margin-bottom: 10px;">${data.anchors.taxi_stages >= 2 ? "Strong commuter traffic favors quick-service formats." : "Lower mobility area; caters to a steady resident customer base."}</li>
            <li style="margin-bottom: 10px;">${data.anchors.markets >= 2 || data.anchors.population_density >= 70 ? "Dense market/population area suits pharmacies, groceries, butcheries." : "Emerging spot—lower volume but less competition."}</li>
          </ul>
        </div>
        
        <div style="margin-top: 80px; text-align: center; font-size: 12px; color: #aaa; text-transform: uppercase; letter-spacing: 0.1em;">
          Generated by Venture • Not financial advice.
        </div>
      `;

      document.body.appendChild(container);

      // Give browser a moment to apply styles
      await new Promise(r => setTimeout(r, 100));

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(\`Venture_Guide_\${data.location.neighborhood.replace(/\\s+/g, '_')}.pdf\`);
      
      document.body.removeChild(container);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={generatePDF}
      disabled={isGenerating}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50 text-xs font-medium"
      title="Download Planning Guide (PDF)"
    >
      {isGenerating ? (
        <Loader2 size={14} className="animate-spin text-white" />
      ) : (
        <Download size={14} className="text-white" />
      )}
      <span>{isGenerating ? "Exporting..." : "Export Guide"}</span>
    </button>
  );
}
