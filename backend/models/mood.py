from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from .user import Base

class MoodEntry(Base):
    __tablename__ = "mood_entries"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    mood_category = Column(String, nullable=False) # sad, angry, anxious, tired, bored, okay
    note = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="mood_entries")

class MoodActivity(Base):
    __tablename__ = "mood_activities"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False) # e.g., "gentle_comfort", "release_energy" matching mood
    mood_category = Column(String, nullable=False) # The mood this activity is for
    duration_mins = Column(Integer, default=5)
    
class ActivityLog(Base):
    __tablename__ = "activity_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    activity_title = Column(String, nullable=False) # Store title directly in case activity is removed later? Or link to ID. Let's store title for simplicity or ID if we seed.
    # Let's link to MoodActivity ideally, but for simplicity of "just completed something", 
    # we might want flexibility. Let's use ID but fall back to title if needed.
    # Actually, for the requirements, "store their progress" implies knowing what they did.
    
    mood_entry_id = Column(Integer, ForeignKey("mood_entries.id"), nullable=True)
    completed_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="activity_logs")
