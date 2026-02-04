from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# --- Coaching / Goals ---
class GoalBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: str = "personal"
    target_date: Optional[datetime] = None

class GoalCreate(GoalBase):
    pass

class GoalUpdate(BaseModel):
    is_completed: bool

class GoalResponse(GoalBase):
    id: int
    is_completed: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# --- Gamification ---
class AchievementResponse(BaseModel):
    id: int
    name: str
    description: str
    icon_name: str
    earned_at: Optional[datetime] = None # If user has it
    
    class Config:
        from_attributes = True

class StreakResponse(BaseModel):
    current_streak: int
    longest_streak: int
    last_activity_date: Optional[datetime]
    
    class Config:
        from_attributes = True

class GamificationProfile(BaseModel):
    points: int
    level: int
    streak: Optional[StreakResponse]
    achievements: List[AchievementResponse]
