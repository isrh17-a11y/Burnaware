from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from .user import Base

class Prediction(Base):
    __tablename__ = "predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    burnout_score = Column(Float, nullable=False)
    risk_level = Column(String, nullable=False)  # low, medium, high
    input_features = Column(JSON, nullable=False)
    recommendations = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f"<Prediction(id={self.id}, user_id={self.user_id}, risk_level={self.risk_level})>"
