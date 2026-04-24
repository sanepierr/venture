"""Venture API — location-aware business recommendation for Kampala."""
from __future__ import annotations
from pathlib import Path

import joblib
import numpy as np
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from synth import (
    CATEGORIES,
    BASE_REVENUE,
    features_at,
    nearest_neighborhood,
    _feature_vector,
    _category_outcome,
    train_and_save,
)

MODEL_PATH = Path(__file__).parent / "model.pkl"
if not MODEL_PATH.exists():
    print("Model not found — training…")
    train_and_save(MODEL_PATH)

_bundle = joblib.load(MODEL_PATH)
CLF = _bundle["clf"]
REG = _bundle["reg"]

app = FastAPI(title="Venture API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictIn(BaseModel):
    lat: float = Field(..., ge=-90, le=90)
    lng: float = Field(..., ge=-180, le=180)


class SetupCosts(BaseModel):
    rent: int
    license: int
    stock: int
    equipment: int


class Recommendation(BaseModel):
    category: str
    score: float
    daily_revenue_ugx: tuple[int, int]
    survival_12mo: float
    setup_costs: SetupCosts


class Anchors(BaseModel):
    schools: int
    taxi_stages: int
    markets: int
    population_density: int


class Location(BaseModel):
    lat: float
    lng: float
    neighborhood: str


class PredictOut(BaseModel):
    location: Location
    anchors: Anchors
    competitors: dict[str, int]
    recommendations: list[Recommendation]


@app.get("/")
def root():
    return {"ok": True, "service": "venture-api"}


@app.get("/health")
def health():
    return {"status": "ok", "categories": len(CATEGORIES)}


@app.post("/predict", response_model=PredictOut)
def predict(inp: PredictIn) -> PredictOut:
    f = features_at(inp.lat, inp.lng)
    x = np.array([_feature_vector(f)])

    # Classifier probabilities across categories (mapped by class label)
    proba_row = CLF.predict_proba(x)[0]
    classes = list(CLF.classes_)
    proba_by_idx = {int(c): float(p) for c, p in zip(classes, proba_row)}

    # Combine model probability with ground-truth scoring to smooth sparse regions
    recs: list[Recommendation] = []
    for idx, cat in enumerate(CATEGORIES):
        gt_score, (lo, hi), surv, costs = _category_outcome(cat, f)
        # Blended score: 60% model, 40% rule score (both in 0-1)
        model_p = proba_by_idx.get(idx, 0.0)
        score = float(np.clip(0.6 * model_p * len(CATEGORIES) / 3 + 0.4 * gt_score, 0.0, 1.0))
        recs.append(
            Recommendation(
                category=cat,
                score=round(score, 4),
                daily_revenue_ugx=(lo, hi),
                survival_12mo=round(surv, 3),
                setup_costs=SetupCosts(**costs),
            )
        )
    recs.sort(key=lambda r: r.score, reverse=True)

    return PredictOut(
        location=Location(
            lat=inp.lat,
            lng=inp.lng,
            neighborhood=nearest_neighborhood(inp.lat, inp.lng),
        ),
        anchors=Anchors(
            schools=f["schools"],
            taxi_stages=f["taxi_stages"],
            markets=f["markets"],
            population_density=int(round(f["population"] * 100)),
        ),
        competitors=f["competitors"],
        recommendations=recs,
    )
