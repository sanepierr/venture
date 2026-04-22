export type Prediction = {
  category: string;
  score: number;
  daily_revenue_ugx: [number, number];
  survival_12mo: number;
};

export type PredictResponse = {
  location: { lat: number; lng: number; neighborhood: string };
  anchors: {
    schools: number;
    taxi_stages: number;
    markets: number;
    population_density: number;
  };
  competitors: Record<string, number>;
  recommendations: Prediction[];
};

// Default to the co-located Next API route. Override with NEXT_PUBLIC_API_URL
// to point at the FastAPI backend (e.g. for local dev or a Render/Fly deploy).
const API = process.env.NEXT_PUBLIC_API_URL || "";

export async function predict(lat: number, lng: number): Promise<PredictResponse> {
  const url = API ? `${API}/predict` : `/api/predict`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ lat, lng }),
  });
  if (!res.ok) throw new Error(`predict failed: ${res.status}`);
  return res.json();
}
