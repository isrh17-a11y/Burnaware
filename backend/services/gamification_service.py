from sqlalchemy.orm import Session
from sqlalchemy import desc
from models.gamification import Streak, Achievement, UserAchievement, Challenge
from models.coaching import Goal, GoalCategory
from models.user import User
from schemas.gamification import GoalCreate, GoalUpdate
from datetime import datetime, timedelta

class GamificationService:
    def __init__(self, db: Session):
        self.db = db
        
    # --- Profile & Points ---
    def get_profile(self, user_id: int):
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            # Return default profile if user not found
            return {
                "points": 0,
                "level": 1,
                "streak": None,
                "achievements": []
            }
        
        streak = self.db.query(Streak).filter(Streak.user_id == user_id).first()
        
        # Determine earned achievements
        user_achievements = self.db.query(UserAchievement).filter(UserAchievement.user_id == user_id).all()
        earned_ids = {ua.achievement_id for ua in user_achievements}
        
        all_achievements = self.db.query(Achievement).all()
        achievements_resp = []
        for ach in all_achievements:
            ach_dict = {
                "id": ach.id,
                "name": ach.name,
                "description": ach.description,
                "icon_name": ach.icon_name,
                "earned_at": next((ua.earned_at for ua in user_achievements if ua.achievement_id == ach.id), None)
            }
            achievements_resp.append(ach_dict)
            
        return {
            "points": user.points if user.points is not None else 0,
            "level": user.level if user.level is not None else 1,
            "streak": streak,
            "achievements": achievements_resp
        }

    def award_points(self, user_id: int, points: int):
        user = self.db.query(User).filter(User.id == user_id).first()
        user.points += points
        
        # Simple level up logic: Level = 1 + (Points / 100)
        new_level = 1 + (user.points // 100)
        if new_level > user.level:
            user.level = new_level
            # TODO: Create notification for level up
            
        self.db.commit()
        self.check_achievements(user_id)
        
    def check_achievements(self, user_id: int):
        # Placeholder for complex achievement logic
        pass

    # --- Streaks ---
    def update_streak(self, user_id: int):
        streak = self.db.query(Streak).filter(Streak.user_id == user_id).first()
        if not streak:
            streak = Streak(user_id=user_id, current_streak=1, longest_streak=1)
            self.db.add(streak)
        else:
            today = datetime.utcnow().date()
            last_date = streak.last_activity_date.date()
            
            if today == last_date:
                # Already active today
                pass
            elif today == last_date + timedelta(days=1):
                # Consecutive day
                streak.current_streak += 1
                if streak.current_streak > streak.longest_streak:
                    streak.longest_streak = streak.current_streak
                self.db.commit() # Commit streak update
                # Award streak points
                self.award_points(user_id, 10)
            else:
                # Streak broken
                streak.current_streak = 1
                
            streak.last_activity_date = datetime.utcnow()
            
        self.db.commit()

    # --- Coaching / Goals ---
    def create_goal(self, user_id: int, goal_data: GoalCreate):
        goal = Goal(
            user_id=user_id,
            title=goal_data.title,
            description=goal_data.description,
            category=goal_data.category,
            target_date=goal_data.target_date
        )
        self.db.add(goal)
        self.db.commit()
        self.db.refresh(goal)
        return goal
        
    def get_goals(self, user_id: int):
        return self.db.query(Goal).filter(Goal.user_id == user_id).order_by(desc(Goal.created_at)).all()
        
    def update_goal(self, goal_id: int, update_data: GoalUpdate):
        goal = self.db.query(Goal).filter(Goal.id == goal_id).first()
        if goal:
            goal.is_completed = update_data.is_completed
            if goal.is_completed:
                goal.completed_at = datetime.utcnow()
                # Award points for goal completion
                self.award_points(goal.user_id, 50)
            self.db.commit()
            self.db.refresh(goal)
        return goal
