from sqlalchemy.orm import Session
from models.prediction import Prediction
from schemas.prediction import PredictionInput
from ml.predictor import BurnoutPredictor
from typing import List, Optional

class PredictionService:
    def __init__(self, db: Session):
        self.db = db
        self.predictor = BurnoutPredictor()
    
    def create_prediction(self, user_id: int, input_data: PredictionInput) -> Prediction:
        """Create a new burnout prediction"""
        # Convert input to dict
        features = input_data.model_dump()
        
        # Get prediction from ML model
        burnout_score, risk_level = self.predictor.predict(features)
        
        # Generate recommendations based on risk level
        recommendations = self._generate_recommendations(risk_level, features)
        
        # Save to database
        db_prediction = Prediction(
            user_id=user_id,
            burnout_score=burnout_score,
            risk_level=risk_level,
            input_features=features,
            recommendations=recommendations
        )
        
        self.db.add(db_prediction)
        self.db.commit()
        self.db.refresh(db_prediction)
        return db_prediction
    
    def get_user_predictions(self, user_id: int) -> List[Prediction]:
        """Get all predictions for a user"""
        return self.db.query(Prediction).filter(
            Prediction.user_id == user_id
        ).order_by(Prediction.created_at.desc()).all()
    
    def get_prediction_by_id(self, prediction_id: int) -> Optional[Prediction]:
        """Get a specific prediction by ID"""
        return self.db.query(Prediction).filter(Prediction.id == prediction_id).first()
    
    def _generate_recommendations(self, risk_level: str, features: dict) -> List[str]:
        """Generate personalized recommendations based on risk level and features"""
        recommendations = []
        
        if risk_level == "high":
            recommendations.append("Consider taking a break or vacation to recharge")
            recommendations.append("Speak with a mental health professional")
        
        if features.get("sleep_hours_per_day", 7) < 6:
            recommendations.append("Prioritize getting 7-8 hours of sleep per night")
        
        if features.get("work_hours_per_week", 40) > 50:
            recommendations.append("Try to reduce work hours and set boundaries")
        
        if features.get("physical_activity_hours", 0) < 2:
            recommendations.append("Incorporate at least 30 minutes of exercise daily")
        
        if features.get("social_support", 5) < 5:
            recommendations.append("Connect with friends and family for support")
        
        if not recommendations:
            recommendations.append("Maintain your current healthy habits")
            recommendations.append("Continue monitoring your well-being")
        
        return recommendations
