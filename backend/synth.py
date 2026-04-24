"""Synthetic Kampala business dataset + model training.

Generates ~5000 grid cells across Kampala bounds, each with features:
- schools, taxi_stages, markets, competitors per category, population density
Labels: best-performing business category, daily revenue, 12mo survival.

The generator encodes plausible Ugandan SMB economics so the model learns
meaningful patterns (e.g. mobile money thrives near taxi stages, chapati
stands near schools, pharmacies where density is high and competitors low).
"""
from __future__ import annotations
import numpy as np
from pathlib import Path
import joblib
from sklearn.ensemble import GradientBoostingClassifier, GradientBoostingRegressor
from sklearn.multioutput import MultiOutputRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

# Kampala approximate bounds
LAT_MIN, LAT_MAX = 0.27, 0.42
LNG_MIN, LNG_MAX = 32.50, 32.68

CATEGORIES = [
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
]

# Base setup costs in UGX thousands (License, Initial Stock/Tools, Equipment)
# Rent is calculated dynamically based on location vibrancy/density
BASE_SETUP_COSTS = {
    "Mobile Money Agent":  {"license": 300,  "stock": 2500, "equipment": 800},
    "Chapati Stand":       {"license": 150,  "stock": 400,  "equipment": 600},
    "Salon":               {"license": 250,  "stock": 800,  "equipment": 3500},
    "Pharmacy":            {"license": 1200, "stock": 8000, "equipment": 5000},
    "Hardware Shop":       {"license": 600,  "stock": 15000, "equipment": 3000},
    "Boda Stage":          {"license": 100,  "stock": 100,  "equipment": 100},
    "Grocery":             {"license": 400,  "stock": 4000, "equipment": 2500},
    "Phone Repair":        {"license": 250,  "stock": 1500, "equipment": 2000},
    "Internet Cafe":       {"license": 500,  "stock": 1000, "equipment": 12000},
    "Tailor":              {"license": 200,  "stock": 1200, "equipment": 1500},
    "Restaurant":          {"license": 700,  "stock": 2500, "equipment": 8000},
    "Bakery":              {"license": 600,  "stock": 3000, "equipment": 12000},
    "Stationery":          {"license": 250,  "stock": 2500, "equipment": 4000},
    "Butchery":            {"license": 450,  "stock": 1500, "equipment": 6000},
    "Fruit Vendor":        {"license": 100,  "stock": 600,  "equipment": 200},
    "School Supplies":     {"license": 300,  "stock": 4500, "equipment": 1500},
    "Barbershop":          {"license": 200,  "stock": 400,  "equipment": 2500},
    "Tea Kiosk":           {"license": 150,  "stock": 300,  "equipment": 400},
    "Liquor Store":        {"license": 1500, "stock": 10000, "equipment": 3000},
    "Second-hand Clothes": {"license": 350,  "stock": 6000, "equipment": 400},
    "Electronics Repair":  {"license": 400,  "stock": 2000, "equipment": 3500},
    "Poultry Feed":        {"license": 300,  "stock": 8000, "equipment": 1000},
    "Printing Shop":       {"license": 500,  "stock": 3000, "equipment": 25000},
    "Juice Bar":           {"license": 300,  "stock": 600,  "equipment": 4000},
}


# Base daily revenue in UGX thousands (lower, upper)
BASE_REVENUE = {
    "Mobile Money Agent": (120, 260),
    "Chapati Stand": (40, 90),
    "Salon": (60, 140),
    "Pharmacy": (180, 450),
    "Hardware Shop": (150, 380),
    "Boda Stage": (35, 70),
    "Grocery": (90, 200),
    "Phone Repair": (50, 130),
    "Internet Cafe": (40, 110),
    "Tailor": (30, 80),
    "Restaurant": (120, 320),
    "Bakery": (100, 240),
    "Stationery": (45, 110),
    "Butchery": (110, 230),
    "Fruit Vendor": (25, 65),
    "School Supplies": (55, 140),
    "Barbershop": (40, 95),
    "Tea Kiosk": (20, 55),
    "Liquor Store": (90, 210),
    "Second-hand Clothes": (50, 140),
    "Electronics Repair": (60, 150),
    "Poultry Feed": (80, 180),
    "Printing Shop": (70, 180),
    "Juice Bar": (30, 80),
}


# Demand drivers — how strongly each anchor/feature influences each category's suitability.
# Keys: schools, taxi_stages, markets, population, existing_competitors (negative effect)
DEMAND = {
    "Mobile Money Agent": {"taxi_stages": 1.0, "population": 0.7, "markets": 0.6, "schools": 0.2},
    "Chapati Stand":      {"schools": 1.0, "taxi_stages": 0.6, "population": 0.5},
    "Salon":              {"population": 1.0, "markets": 0.4, "schools": 0.3},
    "Pharmacy":           {"population": 1.0, "markets": 0.5, "schools": 0.4},
    "Hardware Shop":      {"population": 0.7, "markets": 0.4},
    "Boda Stage":         {"taxi_stages": 1.0, "markets": 0.6, "schools": 0.3},
    "Grocery":            {"population": 1.0, "markets": 0.3},
    "Phone Repair":       {"taxi_stages": 0.8, "population": 0.7, "markets": 0.5},
    "Internet Cafe":      {"schools": 1.0, "population": 0.5},
    "Tailor":             {"markets": 0.8, "population": 0.5},
    "Restaurant":         {"taxi_stages": 0.8, "markets": 0.6, "population": 0.7},
    "Bakery":             {"population": 0.9, "schools": 0.5, "markets": 0.4},
    "Stationery":         {"schools": 1.0, "population": 0.4},
    "Butchery":           {"markets": 1.0, "population": 0.6},
    "Fruit Vendor":       {"markets": 1.0, "taxi_stages": 0.6, "schools": 0.4},
    "School Supplies":    {"schools": 1.0, "population": 0.3},
    "Barbershop":         {"population": 0.9, "schools": 0.4, "taxi_stages": 0.4},
    "Tea Kiosk":          {"taxi_stages": 0.9, "markets": 0.6, "schools": 0.5},
    "Liquor Store":       {"population": 0.8, "taxi_stages": 0.4},
    "Second-hand Clothes":{"markets": 1.0, "population": 0.4},
    "Electronics Repair": {"markets": 0.7, "population": 0.6, "taxi_stages": 0.4},
    "Poultry Feed":       {"markets": 0.9, "population": 0.4},
    "Printing Shop":      {"schools": 0.9, "population": 0.5},
    "Juice Bar":          {"schools": 0.7, "taxi_stages": 0.5, "population": 0.5},
}

NEIGHBORHOODS = [
    # (name, lat, lng, vibrancy 0-1)
    ("Kampala CBD",   0.3136, 32.5811, 1.00),
    ("Nakasero",      0.3218, 32.5831, 0.95),
    ("Kololo",        0.3353, 32.5910, 0.70),
    ("Nakawa",        0.3295, 32.6250, 0.85),
    ("Ntinda",        0.3564, 32.6191, 0.85),
    ("Kamwokya",      0.3389, 32.5860, 0.90),
    ("Bugolobi",      0.3200, 32.6150, 0.75),
    ("Kibuli",        0.2980, 32.6020, 0.78),
    ("Kabalagala",    0.2941, 32.6107, 0.88),
    ("Kansanga",      0.2830, 32.6180, 0.82),
    ("Makerere",      0.3327, 32.5680, 0.92),
    ("Wandegeya",     0.3333, 32.5750, 0.95),
    ("Kisementi",     0.3420, 32.5950, 0.72),
    ("Bukoto",        0.3497, 32.6061, 0.78),
    ("Naguru",        0.3383, 32.6088, 0.70),
    ("Mengo",         0.3040, 32.5650, 0.82),
    ("Rubaga",        0.3024, 32.5550, 0.78),
    ("Kawempe",       0.3786, 32.5653, 0.85),
    ("Bwaise",        0.3661, 32.5634, 0.88),
    ("Kyebando",      0.3590, 32.5860, 0.80),
    ("Ggaba",         0.2634, 32.6348, 0.75),
    ("Najjera",       0.3726, 32.6404, 0.70),
    ("Kiwatule",      0.3618, 32.6352, 0.75),
    ("Banda",         0.3430, 32.6420, 0.65),
    ("Mutungo",       0.3105, 32.6450, 0.68),
]


def nearest_neighborhood(lat: float, lng: float) -> str:
    best = None
    best_d = 1e9
    for name, nlat, nlng, _ in NEIGHBORHOODS:
        d = (lat - nlat) ** 2 + (lng - nlng) ** 2
        if d < best_d:
            best_d = d
            best = name
    return best or "Kampala"


def _vibrancy_at(lat: float, lng: float) -> float:
    """Weighted average of neighborhood vibrancies by inverse-distance."""
    ws, vs = 0.0, 0.0
    for _, nlat, nlng, vib in NEIGHBORHOODS:
        d = (lat - nlat) ** 2 + (lng - nlng) ** 2
        w = 1.0 / (d + 0.0002)
        ws += w
        vs += w * vib
    return vs / ws


def features_at(lat: float, lng: float, rng: np.random.Generator | None = None) -> dict:
    """Generate plausible anchor features for a location."""
    if rng is None:
        # Deterministic per-location: seed from coords so repeated clicks give same answer
        seed = int(((lat + 90) * 1e6 + (lng + 180) * 1e3)) % (2**32)
        rng = np.random.default_rng(seed)
    vib = _vibrancy_at(lat, lng)  # 0.6–1.0 typical
    # Anchors scale with vibrancy + noise
    schools = max(0, int(rng.normal(vib * 4, 1.2)))
    taxi_stages = max(0, int(rng.normal(vib * 3, 1.0)))
    markets = max(0, int(rng.normal(vib * 1.5, 0.7)))
    population = float(np.clip(rng.normal(vib * 0.85, 0.1), 0.1, 1.0))
    # Competitor density (total businesses in 400m)
    competitor_total = max(0, int(rng.normal(vib * 18, 5)))
    # Distribute competitors across categories, biased to common ones
    weights = np.array([1.4, 1.3, 1.0, 0.7, 0.6, 1.2, 1.1, 0.9, 0.7, 0.9,
                        0.8, 0.7, 0.8, 0.9, 1.1, 0.8, 1.0, 1.1, 0.7, 0.9,
                        0.7, 0.5, 0.6, 0.6])
    weights = weights / weights.sum()
    comp_alloc = rng.multinomial(competitor_total, weights)
    competitors = {cat: int(n) for cat, n in zip(CATEGORIES, comp_alloc)}
    return {
        "schools": schools,
        "taxi_stages": taxi_stages,
        "markets": markets,
        "population": population,
        "competitors": competitors,
    }


def _score_category(cat: str, f: dict) -> float:
    """Hand-crafted ground-truth score used to generate labels."""
    weights = DEMAND[cat]
    demand = (
        weights.get("schools", 0) * f["schools"] / 6
        + weights.get("taxi_stages", 0) * f["taxi_stages"] / 5
        + weights.get("markets", 0) * f["markets"] / 3
        + weights.get("population", 0) * f["population"]
    )
    saturation = f["competitors"][cat] / 6  # more competitors → worse
    return float(demand - 0.8 * saturation)


def _category_outcome(cat: str, f: dict) -> tuple[float, tuple[int, int], float, dict[str, int]]:
    """Return (score_0_1, daily_revenue_range_ugx, survival_12mo, setup_costs_ugx)."""
    raw = _score_category(cat, f)
    # Normalize roughly to 0-1
    score = 1 / (1 + np.exp(-0.9 * (raw - 0.5)))
    base_lo, base_hi = BASE_REVENUE[cat]
    mult = 0.6 + 1.1 * score  # revenue multiplier
    lo = int(base_lo * mult * 1000)
    hi = int(base_hi * mult * 1000)
    # Survival: good score + moderate competition
    survival = float(np.clip(0.35 + 0.55 * score - 0.02 * f["competitors"][cat], 0.15, 0.93))

    # Calculate Setup Costs
    # Rent depends on population density and base cat needs
    base_costs = BASE_SETUP_COSTS[cat]
    est_rent = int((150 + 400 * f["population"]) * 1000)
    # Adjust for categories that need more space (hardware, restaurant)
    if cat in ["Hardware Shop", "Restaurant", "Pharmacy", "Bakery", "Printing Shop"]:
        est_rent *= 2
    elif cat in ["Fruit Vendor", "Boda Stage", "Chapati Stand"]:
        est_rent //= 3

    costs = {
        "rent": est_rent,
        "license": base_costs["license"] * 1000,
        "stock": base_costs["stock"] * 1000,
        "equipment": base_costs["equipment"] * 1000,
    }

    return score, (lo, hi), survival, costs


def generate_dataset(n: int = 5000, seed: int = 42):
    rng = np.random.default_rng(seed)
    X, y_cls, y_rev_lo, y_rev_hi, y_surv = [], [], [], [], []
    for _ in range(n):
        lat = rng.uniform(LAT_MIN, LAT_MAX)
        lng = rng.uniform(LNG_MIN, LNG_MAX)
        f = features_at(lat, lng, rng)
        # Score every category, pick the best as the label
        scored = [(cat, *_category_outcome(cat, f)) for cat in CATEGORIES]
        scored.sort(key=lambda t: t[1], reverse=True)
        best = scored[0]
        features_vec = _feature_vector(f)
        X.append(features_vec)
        y_cls.append(CATEGORIES.index(best[0]))
        y_rev_lo.append(best[2][0])
        y_rev_hi.append(best[2][1])
        y_surv.append(best[3])
    return (np.array(X), np.array(y_cls), np.array(y_rev_lo),
            np.array(y_rev_hi), np.array(y_surv))


def _feature_vector(f: dict) -> list[float]:
    return [
        f["schools"],
        f["taxi_stages"],
        f["markets"],
        f["population"],
        sum(f["competitors"].values()),
        *[f["competitors"][c] for c in CATEGORIES],
    ]


def train_and_save(out: Path):
    X, y_cls, y_lo, y_hi, y_surv = generate_dataset()
    clf = Pipeline([
        ("scale", StandardScaler()),
        ("gb", GradientBoostingClassifier(n_estimators=140, max_depth=3, random_state=0)),
    ])
    clf.fit(X, y_cls)

    reg = Pipeline([
        ("scale", StandardScaler()),
        ("gb", MultiOutputRegressor(GradientBoostingRegressor(n_estimators=120, max_depth=3, random_state=0))),
    ])
    reg.fit(X, np.column_stack([y_lo, y_hi, y_surv]))

    out.parent.mkdir(exist_ok=True, parents=True)
    joblib.dump({"clf": clf, "reg": reg}, out)
    print(f"Saved model to {out} — train acc {clf.score(X, y_cls):.3f}")


if __name__ == "__main__":
    train_and_save(Path(__file__).parent / "model.pkl")
