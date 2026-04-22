/**
 * Client-safe scoring engine — same ground-truth rules as backend/synth.py.
 * Used by the Next.js API route so Vercel can serve predictions without a
 * separate Python service.
 */

export const CATEGORIES = [
  "Mobile Money Agent",
  "Chapati Stand",
  "Salon",
  "Pharmacy",
  "Hardware Shop",
  "Boda Stage",
  "Grocery",
  "Phone Repair",
  "Internet Cafe",
  "Tailor",
  "Restaurant",
  "Bakery",
  "Stationery",
  "Butchery",
  "Fruit Vendor",
  "School Supplies",
  "Barbershop",
  "Tea Kiosk",
  "Liquor Store",
  "Second-hand Clothes",
  "Electronics Repair",
  "Poultry Feed",
  "Printing Shop",
  "Juice Bar",
] as const;
export type Category = (typeof CATEGORIES)[number];

const BASE_REVENUE: Record<Category, [number, number]> = {
  "Mobile Money Agent": [120, 260],
  "Chapati Stand": [40, 90],
  Salon: [60, 140],
  Pharmacy: [180, 450],
  "Hardware Shop": [150, 380],
  "Boda Stage": [35, 70],
  Grocery: [90, 200],
  "Phone Repair": [50, 130],
  "Internet Cafe": [40, 110],
  Tailor: [30, 80],
  Restaurant: [120, 320],
  Bakery: [100, 240],
  Stationery: [45, 110],
  Butchery: [110, 230],
  "Fruit Vendor": [25, 65],
  "School Supplies": [55, 140],
  Barbershop: [40, 95],
  "Tea Kiosk": [20, 55],
  "Liquor Store": [90, 210],
  "Second-hand Clothes": [50, 140],
  "Electronics Repair": [60, 150],
  "Poultry Feed": [80, 180],
  "Printing Shop": [70, 180],
  "Juice Bar": [30, 80],
};

type DemandWeights = Partial<{
  schools: number;
  taxi_stages: number;
  markets: number;
  population: number;
}>;

const DEMAND: Record<Category, DemandWeights> = {
  "Mobile Money Agent": { taxi_stages: 1.0, population: 0.7, markets: 0.6, schools: 0.2 },
  "Chapati Stand":      { schools: 1.0, taxi_stages: 0.6, population: 0.5 },
  Salon:                { population: 1.0, markets: 0.4, schools: 0.3 },
  Pharmacy:             { population: 1.0, markets: 0.5, schools: 0.4 },
  "Hardware Shop":      { population: 0.7, markets: 0.4 },
  "Boda Stage":         { taxi_stages: 1.0, markets: 0.6, schools: 0.3 },
  Grocery:              { population: 1.0, markets: 0.3 },
  "Phone Repair":       { taxi_stages: 0.8, population: 0.7, markets: 0.5 },
  "Internet Cafe":      { schools: 1.0, population: 0.5 },
  Tailor:               { markets: 0.8, population: 0.5 },
  Restaurant:           { taxi_stages: 0.8, markets: 0.6, population: 0.7 },
  Bakery:               { population: 0.9, schools: 0.5, markets: 0.4 },
  Stationery:           { schools: 1.0, population: 0.4 },
  Butchery:             { markets: 1.0, population: 0.6 },
  "Fruit Vendor":       { markets: 1.0, taxi_stages: 0.6, schools: 0.4 },
  "School Supplies":    { schools: 1.0, population: 0.3 },
  Barbershop:           { population: 0.9, schools: 0.4, taxi_stages: 0.4 },
  "Tea Kiosk":          { taxi_stages: 0.9, markets: 0.6, schools: 0.5 },
  "Liquor Store":       { population: 0.8, taxi_stages: 0.4 },
  "Second-hand Clothes":{ markets: 1.0, population: 0.4 },
  "Electronics Repair": { markets: 0.7, population: 0.6, taxi_stages: 0.4 },
  "Poultry Feed":       { markets: 0.9, population: 0.4 },
  "Printing Shop":      { schools: 0.9, population: 0.5 },
  "Juice Bar":          { schools: 0.7, taxi_stages: 0.5, population: 0.5 },
};

const NEIGHBORHOODS: ReadonlyArray<[string, number, number, number]> = [
  ["Kampala CBD",   0.3136, 32.5811, 1.00],
  ["Nakasero",      0.3218, 32.5831, 0.95],
  ["Kololo",        0.3353, 32.5910, 0.70],
  ["Nakawa",        0.3295, 32.6250, 0.85],
  ["Ntinda",        0.3564, 32.6191, 0.85],
  ["Kamwokya",      0.3389, 32.5860, 0.90],
  ["Bugolobi",      0.3200, 32.6150, 0.75],
  ["Kibuli",        0.2980, 32.6020, 0.78],
  ["Kabalagala",    0.2941, 32.6107, 0.88],
  ["Kansanga",      0.2830, 32.6180, 0.82],
  ["Makerere",      0.3327, 32.5680, 0.92],
  ["Wandegeya",     0.3333, 32.5750, 0.95],
  ["Kisementi",     0.3420, 32.5950, 0.72],
  ["Bukoto",        0.3497, 32.6061, 0.78],
  ["Naguru",        0.3383, 32.6088, 0.70],
  ["Mengo",         0.3040, 32.5650, 0.82],
  ["Rubaga",        0.3024, 32.5550, 0.78],
  ["Kawempe",       0.3786, 32.5653, 0.85],
  ["Bwaise",        0.3661, 32.5634, 0.88],
  ["Kyebando",      0.3590, 32.5860, 0.80],
  ["Ggaba",         0.2634, 32.6348, 0.75],
  ["Najjera",       0.3726, 32.6404, 0.70],
  ["Kiwatule",      0.3618, 32.6352, 0.75],
  ["Banda",         0.3430, 32.6420, 0.65],
  ["Mutungo",       0.3105, 32.6450, 0.68],
];

export function nearestNeighborhood(lat: number, lng: number): string {
  let best = "Kampala";
  let bestD = Infinity;
  for (const [name, nlat, nlng] of NEIGHBORHOODS) {
    const d = (lat - nlat) ** 2 + (lng - nlng) ** 2;
    if (d < bestD) {
      bestD = d;
      best = name;
    }
  }
  return best;
}

function vibrancyAt(lat: number, lng: number): number {
  let ws = 0;
  let vs = 0;
  for (const [, nlat, nlng, vib] of NEIGHBORHOODS) {
    const d = (lat - nlat) ** 2 + (lng - nlng) ** 2;
    const w = 1 / (d + 0.0002);
    ws += w;
    vs += w * vib;
  }
  return vs / ws;
}

// Deterministic pseudo-random from seed (mulberry32)
function rng(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function normalSample(r: () => number, mean: number, sd: number) {
  // Box–Muller
  const u = Math.max(r(), 1e-9);
  const v = r();
  return mean + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export type Features = {
  schools: number;
  taxi_stages: number;
  markets: number;
  population: number;
  competitors: Record<Category, number>;
};

const COMPETITOR_WEIGHTS = [
  1.4, 1.3, 1.0, 0.7, 0.6, 1.2, 1.1, 0.9, 0.7, 0.9,
  0.8, 0.7, 0.8, 0.9, 1.1, 0.8, 1.0, 1.1, 0.7, 0.9,
  0.7, 0.5, 0.6, 0.6,
];

export function featuresAt(lat: number, lng: number): Features {
  // Seed deterministically from coords so the same point yields the same answer
  const seed = Math.abs(Math.floor((lat + 90) * 1e6 + (lng + 180) * 1e3)) | 0;
  const r = rng(seed);
  const vib = vibrancyAt(lat, lng);

  const schools = Math.max(0, Math.round(normalSample(r, vib * 4, 1.2)));
  const taxi_stages = Math.max(0, Math.round(normalSample(r, vib * 3, 1.0)));
  const markets = Math.max(0, Math.round(normalSample(r, vib * 1.5, 0.7)));
  const population = Math.max(0.1, Math.min(1, normalSample(r, vib * 0.85, 0.1)));
  const total = Math.max(0, Math.round(normalSample(r, vib * 18, 5)));

  // Multinomial allocation
  const wsum = COMPETITOR_WEIGHTS.reduce((a, b) => a + b, 0);
  const probs = COMPETITOR_WEIGHTS.map((w) => w / wsum);
  const counts = new Array(CATEGORIES.length).fill(0);
  for (let i = 0; i < total; i++) {
    const x = r();
    let acc = 0;
    for (let j = 0; j < probs.length; j++) {
      acc += probs[j];
      if (x < acc) {
        counts[j]++;
        break;
      }
    }
  }
  const competitors = Object.fromEntries(
    CATEGORIES.map((c, i) => [c, counts[i]])
  ) as Record<Category, number>;

  return { schools, taxi_stages, markets, population, competitors };
}

function sigmoid(x: number) {
  return 1 / (1 + Math.exp(-x));
}

export type Outcome = {
  category: Category;
  score: number;
  daily_revenue_ugx: [number, number];
  survival_12mo: number;
};

export function categoryOutcome(cat: Category, f: Features): Outcome {
  const w = DEMAND[cat];
  const demand =
    (w.schools ?? 0) * (f.schools / 6) +
    (w.taxi_stages ?? 0) * (f.taxi_stages / 5) +
    (w.markets ?? 0) * (f.markets / 3) +
    (w.population ?? 0) * f.population;
  const saturation = (f.competitors[cat] ?? 0) / 6;
  const raw = demand - 0.8 * saturation;
  const score = sigmoid(0.9 * (raw - 0.5));
  const [lo, hi] = BASE_REVENUE[cat];
  const mult = 0.6 + 1.1 * score;
  const dailyLo = Math.round(lo * mult * 1000);
  const dailyHi = Math.round(hi * mult * 1000);
  const survival = Math.max(
    0.15,
    Math.min(0.93, 0.35 + 0.55 * score - 0.02 * f.competitors[cat])
  );
  return {
    category: cat,
    score: Math.round(score * 1000) / 1000,
    daily_revenue_ugx: [dailyLo, dailyHi],
    survival_12mo: Math.round(survival * 1000) / 1000,
  };
}

export type PredictResult = {
  location: { lat: number; lng: number; neighborhood: string };
  anchors: {
    schools: number;
    taxi_stages: number;
    markets: number;
    population_density: number;
  };
  competitors: Record<string, number>;
  recommendations: Outcome[];
};

export function predict(lat: number, lng: number): PredictResult {
  const f = featuresAt(lat, lng);
  const recs = CATEGORIES.map((c) => categoryOutcome(c, f));
  recs.sort((a, b) => b.score - a.score);
  return {
    location: { lat, lng, neighborhood: nearestNeighborhood(lat, lng) },
    anchors: {
      schools: f.schools,
      taxi_stages: f.taxi_stages,
      markets: f.markets,
      population_density: Math.round(f.population * 100),
    },
    competitors: f.competitors,
    recommendations: recs,
  };
}
