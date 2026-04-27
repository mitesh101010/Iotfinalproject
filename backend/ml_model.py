from __future__ import annotations

from dataclasses import dataclass

import numpy as np
from sklearn.ensemble import IsolationForest

from schemas import FeatureVector, SensorReading


@dataclass
class MLResult:
    score: float
    status: str


class AnomalyDetector:
    def __init__(self, contamination: float = 0.12, random_state: int = 42) -> None:
        self.model = IsolationForest(contamination=contamination, random_state=random_state)
        self._trained = False

    @staticmethod
    def extract_features(reading: SensorReading) -> FeatureVector:
        values = np.array(
            [reading.acceleration, reading.strain, reading.displacement, reading.temperature],
            dtype=float,
        )
        mean = float(np.mean(values))
        rms = float(np.sqrt(np.mean(values**2)))
        std = float(np.std(values))
        return FeatureVector(mean=mean, rms=rms, std=std)

    def train(self, normal_readings: list[SensorReading]) -> None:
        rows = [self.extract_features(reading).model_dump().values() for reading in normal_readings]
        x_train = np.array([list(row) for row in rows], dtype=float)
        self.model.fit(x_train)
        self._trained = True

    def predict(self, reading: SensorReading) -> MLResult:
        if not self._trained:
            raise RuntimeError("Model must be trained before prediction.")

        features = self.extract_features(reading)
        x = np.array([[features.mean, features.rms, features.std]], dtype=float)

        # IsolationForest gives higher scores for normal points; invert and scale to [0,1].
        decision_score = float(self.model.decision_function(x)[0])
        normalized_score = float(np.clip((0.25 - decision_score) / 0.5, 0.0, 1.0))

        if normalized_score < 0.5:
            status = "NORMAL"
        elif normalized_score < 0.7:
            status = "WARNING"
        else:
            status = "CRITICAL"

        return MLResult(score=round(normalized_score, 4), status=status)
