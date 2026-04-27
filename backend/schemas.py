from datetime import datetime
from pydantic import BaseModel, Field


class SensorReading(BaseModel):
    timestamp: datetime
    acceleration: float = Field(..., ge=-5.0, le=5.0)
    strain: float = Field(..., ge=0.0, le=200.0)
    displacement: float = Field(..., ge=0.0, le=100.0)
    temperature: float = Field(..., ge=-50.0, le=120.0)
    is_anomaly: bool = False


class FeatureVector(BaseModel):
    mean: float
    rms: float
    std: float


class PredictionResponse(BaseModel):
    score: float
    status: str
    timestamp: datetime


class Alert(BaseModel):
    timestamp: datetime
    status: str
    message: str
    score: float
