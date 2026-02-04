from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from schemas.mood import MoodEntryCreate, MoodResponse
from services.mood_service import MoodService
from services.database import get_db
from pydantic import BaseModel

router = APIRouter()

class ActivityComplete(BaseModel):
    title: str

@router.post("/log/{user_id}", response_model=MoodResponse)
async def log_mood(user_id: int, entry: MoodEntryCreate, db: Session = Depends(get_db)):
    service = MoodService(db)
    return service.log_mood(user_id, entry)

@router.post("/activity/{user_id}/complete")
async def complete_activity(user_id: int, data: ActivityComplete, db: Session = Depends(get_db)):
    service = MoodService(db)
    return service.complete_activity(user_id, data.title)
