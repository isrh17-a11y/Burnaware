from pydantic import BaseModel, Field
from typing import Dict, List, Optional
from datetime import datetime

class PredictionInput(BaseModel):
    work_hours_per_week: float = Field(..., ge=0, le=168)
    sleep_hours_per_day: float = Field(..., ge=0, le=24)
    stress_level: int = Field(..., ge=1, le=10)
    job_satisfaction: int = Field(..., ge=0, le=10) # Allow 0 satisfaction
    work_life_balance: int = Field(..., ge=1, le=10)
    physical_activity_hours: float = Field(..., ge=0, le=168) # Weekly max 168
    social_support: int = Field(..., ge=1, le=10)
    
    class Config:
        json_schema_extra = {
            "example": {
                "work_hours_per_week": 45,
                "sleep_hours_per_day": 7,
                "stress_level": 6,
                "job_satisfaction": 7,
                "work_life_balance": 6,
                "physical_activity_hours": 3,
                "social_support": 8
            }
        }

class PredictionResponse(BaseModel):
    id: int
    user_id: int
    burnout_score: float
    risk_level: str
    input_features: Dict
    recommendations: Optional[List[str]]
    created_at: datetime
    
    class Config:
        from_attributes = True
