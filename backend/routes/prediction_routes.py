from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from schemas.prediction import PredictionInput, PredictionResponse
from services.prediction_service import PredictionService
from services.database import get_db

router = APIRouter()

@router.post("/", response_model=PredictionResponse, status_code=status.HTTP_201_CREATED)
async def create_prediction(
    prediction_input: PredictionInput,
    user_id: int,  # TODO: Get from JWT token
    db: Session = Depends(get_db)
):
    """Create a new burnout prediction"""
    prediction_service = PredictionService(db)
    return prediction_service.create_prediction(user_id, prediction_input)

@router.get("/user/{user_id}", response_model=List[PredictionResponse])
async def get_user_predictions(user_id: int, db: Session = Depends(get_db)):
    """Get all predictions for a specific user"""
    prediction_service = PredictionService(db)
    return prediction_service.get_user_predictions(user_id)

@router.get("/{prediction_id}", response_model=PredictionResponse)
async def get_prediction(prediction_id: int, db: Session = Depends(get_db)):
    """Get a specific prediction by ID"""
    prediction_service = PredictionService(db)
    prediction = prediction_service.get_prediction_by_id(prediction_id)
    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")
    return prediction
