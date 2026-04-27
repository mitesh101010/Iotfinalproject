# InfraGuard AI

InfraGuard AI is an AI-powered infrastructure monitoring and safety platform that simulates IoT sensor networks, detects anomalies using Isolation Forest, and visualizes live system health in a SaaS-style dashboard.

## Architecture

- **Simulation Layer**: `backend/simulator.py`
- **Processing + ML Layer**: `backend/ml_model.py`
- **API Layer**: `backend/main.py`
- **Visualization Layer**: `frontend/src/*`

## Backend Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs on `http://127.0.0.1:8000`.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://127.0.0.1:5173` and calls backend endpoints every second.

## API Endpoints

- `GET /data` → latest sensor data
- `GET /predict` → anomaly score + status
- `GET /history` → latest 100 records
- `GET /alerts` → anomaly alert history

## Notes

- In-memory storage is maintained for recent sensor data and alert logs.
- The backend trains Isolation Forest using generated **normal-only** bootstrap samples at startup.
- System health classes:
  - `< 0.5` = NORMAL
  - `0.5 - 0.7` = WARNING
  - `> 0.7` = CRITICAL
