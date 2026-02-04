from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Gamification
    points = Column(Integer, default=0)
    level = Column(Integer, default=1)
    
    # Relationships
    streak = relationship("Streak", back_populates="user", uselist=False)
    achievements = relationship("UserAchievement", back_populates="user")
    goals = relationship("Goal", back_populates="user")
    mood_entries = relationship("MoodEntry", back_populates="user")
    activity_logs = relationship("ActivityLog", back_populates="user")
    
    def __repr__(self):
        return f"<User(id={self.id}, username={self.username}, email={self.email})>"
