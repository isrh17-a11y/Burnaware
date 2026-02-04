from sqlalchemy.orm import Session
from models.mood import MoodEntry, MoodActivity, ActivityLog
from models.user import User
from schemas.mood import MoodEntryCreate
from datetime import datetime
from services.gamification_service import GamificationService

# Hardcoded activities based on user request
MOOD_ACTIVITIES = {
    "sad": [
        {"title": "Make a warm drink (chai, cocoa, coffee)", "duration": 10},
        {"title": "Sit in sunlight or near a window", "duration": 10},
        {"title": "Watch 3–4 short funny reels", "duration": 5},
        {"title": "Write a '3 tiny wins today' list", "duration": 5},
        {"title": "Hug a pillow/blanket + soft music", "duration": 5},
        {"title": "Do a 5-minute room tidy", "duration": 5}
    ],
    "angry": [
        {"title": "Fast walk or stair climb", "duration": 10},
        {"title": "Punch a pillow / shake hands", "duration": 2},
        {"title": "Blast loud music and lip-sync", "duration": 5},
        {"title": "Write a rant note -> delete it", "duration": 5},
        {"title": "Cold water splash on face", "duration": 1}
    ],
    "anxious": [
        {"title": "4-7-8 breathing", "duration": 3},
        {"title": "Guided 5-min meditation", "duration": 5},
        {"title": "Make a simple 3-task to-do list", "duration": 5},
        {"title": "Wash hands with warm water", "duration": 2},
        {"title": "Journal: 'What's in my control?'", "duration": 5}
    ],
    "tired": [
        {"title": "10-minute power nap", "duration": 10},
        {"title": "Quick shower or cold splash", "duration": 5},
        {"title": "Step outside for fresh air", "duration": 5},
        {"title": "Eat fruit or light snack", "duration": 5},
        {"title": "Play upbeat music and stretch", "duration": 3}
    ],
    "bored": [
        {"title": "Rearrange desk or bed", "duration": 10},
        {"title": "Try a new hairstyle/outfit", "duration": 5},
        {"title": "Cook or make a random snack", "duration": 15},
        {"title": "Learn one new Canva/Figma trick", "duration": 10},
        {"title": "10-min sketch challenge", "duration": 10}
    ],
    "okay": [
        {"title": "Dance to 2 songs", "duration": 6},
        {"title": "Do skincare + lip gloss", "duration": 5},
        {"title": "Make a cute Pinterest board", "duration": 10},
        {"title": "Write future goals notes", "duration": 5},
        {"title": "Read 5 pages of a book", "duration": 10}
    ]
}

REASSURANCE_MESSAGES = {
    "sad": "It's okay to feel low. Be gentle with yourself right now. 💙",
    "angry": "Your feelings are valid. Let's release that energy safely. 🔥",
    "anxious": "You are safe. Take a deep breath. One step at a time. 🌿",
    "tired": "Rest is productive. Listen to your body's need for a pause. 💤",
    "bored": "A blank canvas! Let's spark a tiny bit of creativity. ✨",
    "okay": "That's great! Let's upgrade that vibe even further! 🚀"
}

class MoodService:
    def __init__(self, db: Session):
        self.db = db
        self.gamification = GamificationService(db)
        
    def log_mood(self, user_id: int, entry: MoodEntryCreate):
        # 1. Save Mood Entry
        mood_entry = MoodEntry(
            user_id=user_id,
            mood_category=entry.mood_category,
            note=entry.note
        )
        self.db.add(mood_entry)
        self.db.commit()
        
        # 2. Return Reassurance + Activities
        # In a real app, we might store these in DB. here we mock them as "Activity" objects
        suggestions = []
        activities = MOOD_ACTIVITIES.get(entry.mood_category, [])
        
        # We simulate DB objects for response schema
        for i, act in enumerate(activities):
            suggestions.append({
                "id": i + 1000, # Fake ID for now since they aren't in DB
                "title": act["title"],
                "category": "suggestion",
                "duration_mins": act["duration"],
                "is_completed": False
            })
            
        return {
            "reassurance_message": REASSURANCE_MESSAGES.get(entry.mood_category, "You've got this."),
            "suggested_activities": suggestions
        }

    def complete_activity(self, user_id: int, activity_title: str):
        # Log activity
        log = ActivityLog(
            user_id=user_id,
            activity_title=activity_title
        )
        self.db.add(log)
        
        # Award Points via Gamification Service
        # We award 20 points for a mood activity
        self.gamification.award_points(user_id, 20)
        
        self.db.commit()
        return {"status": "completed", "points_awarded": 20}
