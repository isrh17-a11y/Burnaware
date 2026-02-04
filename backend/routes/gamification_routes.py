from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from schemas.gamification import GamificationProfile, GoalCreate, GoalResponse, GoalUpdate
from services.gamification_service import GamificationService
from services.database import get_db

router = APIRouter()

@router.get("/profile/{user_id}", response_model=GamificationProfile)
async def get_profile(user_id: int, db: Session = Depends(get_db)):
    service = GamificationService(db)
    return service.get_profile(user_id)

@router.post("/goals/{user_id}", response_model=GoalResponse)
async def create_goal(user_id: int, goal: GoalCreate, db: Session = Depends(get_db)):
    service = GamificationService(db)
    return service.create_goal(user_id, goal)

@router.get("/goals/{user_id}", response_model=List[GoalResponse])
async def get_goals(user_id: int, db: Session = Depends(get_db)):
    service = GamificationService(db)
    return service.get_goals(user_id)

@router.put("/goals/{goal_id}", response_model=GoalResponse)
async def update_goal(goal_id: int, goal_update: GoalUpdate, db: Session = Depends(get_db)):
    service = GamificationService(db)
    goal = service.update_goal(goal_id, goal_update)
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    return goal
