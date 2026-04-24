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
          <h1 style="font-size: 32px; margin: 0; letter-spacing: -0.05em;">Venture Strategic Report</h1>
          <p style="font-size: 14px; color: #666; margin-top: 10px; font-family: monospace;">
            ${data.location.neighborhood} | ${data.location.lat.toFixed(4)}, ${data.location.lng.toFixed(4)} | Generated on ${new Date().toLocaleDateString()}
          </p>
        </div>

        <div style="margin-bottom: 40px; padding: 30px; background: #fafafa; border-radius: 16px; border: 1px solid #eaeaea;">
          <h2 style="font-size: 24px; margin-top: 0; margin-bottom: 20px; letter-spacing: -0.02em;">Primary Opportunity: ${topRec.category}</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
            <div>
              <div style="font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 5px;">Projected Monthly Gross</div>
              <div style="font-size: 20px; font-weight: 600;">UGX ${(topRec.daily_revenue_ugx[0] * 30).toLocaleString()} - ${(topRec.daily_revenue_ugx[1] * 30).toLocaleString()}</div>
            </div>
            <div>
              <div style="font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 5px;">12-Mo Survival Rate</div>
              <div style="font-size: 20px; font-weight: 600; color: #16a34a;">${Math.round(topRec.survival_12mo * 100)}%</div>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 40px;">
          <h3 style="font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.15em; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 20px;">Estimated Investment Capital</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 14px;">
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #f9f9f9; padding-bottom: 5px;"><span>Est. Monthly Rent</span> <strong>UGX ${topRec.setup_costs.rent.toLocaleString()}</strong></div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #f9f9f9; padding-bottom: 5px;"><span>License & Permits</span> <strong>UGX ${topRec.setup_costs.license.toLocaleString()}</strong></div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #f9f9f9; padding-bottom: 5px;"><span>Initial Inventory</span> <strong>UGX ${topRec.setup_costs.stock.toLocaleString()}</strong></div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #f9f9f9; padding-bottom: 5px;"><span>Equipment & Misc</span> <strong>UGX ${topRec.setup_costs.equipment.toLocaleString()}</strong></div>
          </div>
          <div style="margin-top: 15px; text-align: right; font-size: 18px; font-weight: 700;">
            Total: UGX ${(Object.values(topRec.setup_costs).reduce((a, b) => a + b, 0)).toLocaleString()}
          </div>
        </div>

        <div style="display: flex; gap: 40px; margin-bottom: 50px;">
          <div style="flex: 1;">
            <h3 style="font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.15em; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 20px;">Environmental Anchors</h3>
            <ul style="list-style: none; padding: 0; margin: 0; font-size: 14px; color: #333;">
              <li style="margin-bottom: 12px; display: flex; justify-content: space-between; border-bottom: 1px solid #f5f5f5; padding-bottom: 5px;"><span>Schools</span> <strong>${data.anchors.schools}</strong></li>
              <li style="margin-bottom: 12px; display: flex; justify-content: space-between; border-bottom: 1px solid #f5f5f5; padding-bottom: 5px;"><span>Taxi Stages</span> <strong>${data.anchors.taxi_stages}</strong></li>
              <li style="margin-bottom: 12px; display: flex; justify-content: space-between; border-bottom: 1px solid #f5f5f5; padding-bottom: 5px;"><span>Markets</span> <strong>${data.anchors.markets}</strong></li>
              <li style="margin-bottom: 12px; display: flex; justify-content: space-between; border-bottom: 1px solid #f5f5f5; padding-bottom: 5px;"><span>Pop. Density</span> <strong>${data.anchors.population_density}/km²</strong></li>
            </ul>
          </div>
          <div style="flex: 1;">
            <h3 style="font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.15em; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 20px;">Peer Benchmarks</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <thead>
                <tr style="text-align: left; color: #aaa; font-size: 10px;">
                  <th style="padding-bottom: 10px;">Category</th>
                  <th style="padding-bottom: 10px;">Score</th>
                  <th style="padding-bottom: 10px;">Comp.</th>
                </tr>
              </thead>
              <tbody>
                ${data.recommendations.slice(1, 4).map((r) => `
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #f5f5f5;">${r.category}</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #f5f5f5;">${Math.round(r.score * 100)}%</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #f5f5f5;">${data.competitors[r.category] || 0}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
        
        <div style="background: #fff; border: 1px solid #ddd; border-radius: 12px; padding: 30px;">
          <h3 style="font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.15em; margin-top: 0; margin-bottom: 20px;">Strategic Analysis</h3>
          <ul style="padding-left: 20px; font-size: 13px; line-height: 1.6; color: #444; margin: 0;">
            <li style="margin-bottom: 10px;"><strong>Market Fit:</strong> ${data.anchors.schools >= 3 ? "Significant student population identified. Focus on high-frequency, low-margin retail." : "Residential focus suggested; prioritize logistics and household essential services."}</li>
            <li style="margin-bottom: 10px;"><strong>Transit Advantage:</strong> ${data.anchors.taxi_stages >= 2 ? "High commuter flow supports quick-service and mobile-money concepts." : "Lower mobility suggests a stable, loyalty-driven local customer base."}</li>
            <li style="margin-bottom: 10px;"><strong>Competition Note:</strong> ${data.competitors[topRec.category] === 0 ? "Untapped opportunity detected with zero direct competitors in the immediate radius." : "Saturation detected; success requires significant service differentiation."}</li>
          </ul>
        </div>
        
        <div style="margin-top: 80px; text-align: center; font-size: 10px; color: #aaa; text-transform: uppercase; letter-spacing: 0.1em; border-top: 1px solid #eee; padding-top: 20px;">
          CONFIDENTIAL STRATEGIC DOCUMENT &bull; Venture Analytics Engine &bull; Kampala, Uganda
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
