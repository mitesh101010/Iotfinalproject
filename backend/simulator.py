from __future__ import annotations

import random
from datetime import datetime

import numpy as np

from schemas import SensorReading


class SensorSimulator:
    """Generates IoT-like sensor readings with realistic noise and anomalies."""

    def __init__(self, anomaly_probability: float = 0.12) -> None:
        self.anomaly_probability = anomaly_probability

    def _normal_reading(self) -> SensorReading:
        acceleration = float(np.clip(np.random.normal(0.0, 0.35), -2.0, 2.0))
        strain = float(np.clip(np.random.normal(45.0, 10.0), 0.0, 100.0))
        displacement = float(np.clip(np.random.normal(18.0, 5.5), 0.0, 50.0))
        temperature = float(np.clip(np.random.normal(29.0, 2.8), 20.0, 40.0))
        return SensorReading(
            timestamp=datetime.utcnow(),
            acceleration=acceleration,
            strain=strain,
            displacement=displacement,
            temperature=temperature,
            is_anomaly=False,
        )

    def _inject_anomaly(self, reading: SensorReading) -> SensorReading:
        mode = random.choice(["spike", "jump", "drift"])

        if mode == "spike":
            reading.acceleration = float(np.clip(reading.acceleration + random.choice([-1.6, 1.7]), -2.0, 2.0))
            reading.strain = float(np.clip(reading.strain + random.choice([-40, 42]), 0.0, 100.0))
        elif mode == "jump":
            reading.displacement = float(np.clip(reading.displacement + random.choice([20, 25]), 0.0, 50.0))
            reading.temperature = float(np.clip(reading.temperature + random.choice([8, 10]), 20.0, 40.0))
        else:  # drift
            reading.acceleration = float(np.clip(reading.acceleration + random.choice([1.0, -1.2]), -2.0, 2.0))
            reading.strain = float(np.clip(reading.strain + random.choice([30, -35]), 0.0, 100.0))
            reading.temperature = float(np.clip(reading.temperature + random.choice([6, -7]), 20.0, 40.0))

        reading.is_anomaly = True
        return reading

    def generate(self) -> SensorReading:
        reading = self._normal_reading()
        if random.random() < self.anomaly_probability:
            reading = self._inject_anomaly(reading)
        return reading
