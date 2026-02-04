from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class MoodEntryCreate(BaseModel):
    mood_category: str # sad, angry, anxious, tired, bored, okay
    note: Optional[str] = None

class MoodActivityResponse(BaseModel):
    id: int
    title: str
    category: str
    duration_mins: int
    is_completed: bool = False # Helper for frontend
    
    class Config:
        from_attributes = True

class MoodResponse(BaseModel):
    reassurance_message: str
    suggested_activities: List[MoodActivityResponse]
