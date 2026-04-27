from __future__ import annotations

import asyncio
from collections import deque
from contextlib import asynccontextmanager
from datetime import datetime

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from ml_model import AnomalyDetector
from schemas import Alert, PredictionResponse, SensorReading
from simulator import SensorSimulator

MAX_HISTORY = 200
MAX_ALERTS = 200

simulator = SensorSimulator(anomaly_probability=0.12)
detector = AnomalyDetector(contamination=0.12)

sensor_history: deque[SensorReading] = deque(maxlen=MAX_HISTORY)
alert_history: deque[Alert] = deque(maxlen=MAX_ALERTS)
latest_prediction = PredictionResponse(score=0.0, status="NORMAL", timestamp=datetime.utcnow())


async def data_generation_loop() -> None:
    global latest_prediction
    while True:
        reading = simulator.generate()
        sensor_history.append(reading)

        prediction = detector.predict(reading)
        latest_prediction = PredictionResponse(
            score=prediction.score,
            status=prediction.status,
            timestamp=reading.timestamp,
        )

        if prediction.status in {"WARNING", "CRITICAL"}:
            alert_history.append(
                Alert(
                    timestamp=reading.timestamp,
                    status=prediction.status,
                    message="Abnormal structural behavior detected",
                    score=prediction.score,
                )
            )

        await asyncio.sleep(1)


@asynccontextmanager
async def lifespan(_: FastAPI):
    bootstrap_normals = []
    while len(bootstrap_normals) < 350:
        sample = simulator.generate()
        if not sample.is_anomaly:
            bootstrap_normals.append(sample)

    detector.train(bootstrap_normals)

    task = asyncio.create_task(data_generation_loop())
    try:
        yield
    finally:
        task.cancel()


app = FastAPI(title="InfraGuard AI API", version="1.0.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/data", response_model=SensorReading)
def get_latest_data():
    if not sensor_history:
        return simulator.generate()
    return sensor_history[-1]


@app.get("/predict", response_model=PredictionResponse)
def get_prediction():
    return latest_prediction


@app.get("/history", response_model=list[SensorReading])
def get_history():
    return list(sensor_history)[-100:]


@app.get("/alerts", response_model=list[Alert])
def get_alerts():
    return list(alert_history)
