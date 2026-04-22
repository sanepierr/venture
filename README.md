# Venture

**Venture** is a hackathon project for making smarter, location-aware investment decisions in **Kampala**. The app combines a polished **Next.js** frontend (map-driven explore flow, scoring UI) with a **FastAPI** backend that serves ML-backed recommendations from synthetic geo and category features.

## What it does

- Pick a place on the map and get **ranked business categories**, blended **scores**, estimated **daily revenue ranges (UGX)**, and **12‑month survival** hints.
- The UI reads **neighborhood context**: schools, taxi stages, markets, population density, and competitor counts where the model and rules use them.

## Repository layout

| Path | Role |
|------|------|
| `frontend/` | Next.js 16 app: landing, explore page, Leaflet map, theme/i18n, `/api/predict` route |
| `backend/` | FastAPI service: `POST /predict` with scikit-learn + `synth.py` features; auto-trains `model.pkl` if missing |

By default the frontend calls **`http://localhost:3000/api/predict`**, which uses the TypeScript **`scoring`** implementation in-process. To use the Python API instead, set:

```bash
export NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

before `npm run dev` (see `frontend/src/lib/api.ts`).

## Prerequisites

- **Node.js** 20+ (matches Next 16 / React 19 tooling in `frontend/package.json`)
- **Python** 3.12+ recommended (backend deps target current `numpy` / `scikit-learn`)

## Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Run the backend (optional)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

- API root: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
- Health: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)
- Predict: `POST http://127.0.0.1:8000/predict` with JSON `{"lat": number, "lng": number}`

## Build

```bash
cd frontend && npm run build && npm start
```

## License / data

Demo data and models are **synthetic** for the hackathon; treat outputs as illustrations, not financial or legal advice.
